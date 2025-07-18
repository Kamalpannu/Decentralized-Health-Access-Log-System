// graphql/resolvers.js
const prisma = require('../prismaClient');
const { requireAuth, requireRole } = require('../auth');

module.exports = {
  Query: {
    me: async (_, __, { user }) => {
      return requireAuth(user);
    },

    patients: async (_, __, { user }) => {
      requireRole(user, 'DOCTOR');
      return prisma.patient.findMany({ include: { user: true } });
    },

    doctors: async (_, __, { user }) => {
      requireAuth(user);
      return prisma.doctor.findMany({ include: { user: true } });
    },

    myPatients: async (_, __, { user }) => {
      requireRole(user, 'DOCTOR');
      const doctor = await prisma.doctor.findUnique({
        where: { userId: user.id },
        include: { patients: { include: { user: true } } }
      });
      return doctor?.patients || [];
    },

    myRecords: async (_, __, { user }) => {
      requireRole(user, 'PATIENT');
      const patient = await prisma.patient.findUnique({
        where: { userId: user.id },
        include: { records: true }
      });
      return patient?.records || [];
    },

    accessRequests: async (_, __, { user }) => {
      requireRole(user, 'DOCTOR');
      const doctor = await prisma.doctor.findUnique({
        where: { userId: user.id },
        include: {
          accessRequests: { include: { patient: { include: { user: true } } } }
        }
      });
      return doctor?.accessRequests || [];
    },

    pendingRequests: async (_, __, { user }) => {
      requireRole(user, 'PATIENT');
      const patient = await prisma.patient.findUnique({
        where: { userId: user.id },
        include: {
          accessRequests: {
            where: { status: 'PENDING' },
            include: { doctor: { include: { user: true } } }
          }
        }
      });
      return patient?.accessRequests || [];
    },

    patientRecords: async (_, { patientId }, { user }) => {
      requireRole(user, 'DOCTOR');
      return prisma.record.findMany({ where: { patientId } });
    }
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const { doctorData, patientData, ...base } = input;

      return prisma.user.create({
        data: {
          ...base,
          Doctor: base.role === 'DOCTOR' ? { create: doctorData } : undefined,
          Patient: base.role === 'PATIENT' ? { create: patientData } : undefined,
        }
      });
    },

    updateProfile: async (_, { input }, { user }) => {
      requireAuth(user);
      const updates = {};
      if (input.name !== undefined) updates.name = input.name;
      if (input.avatar !== undefined) updates.avatar = input.avatar;

      if (user.role === 'DOCTOR' && input.doctorData) {
        await prisma.doctor.update({
          where: { userId: user.id },
          data: input.doctorData,
        });
      }

      if (user.role === 'PATIENT' && input.patientData) {
        await prisma.patient.update({
          where: { userId: user.id },
          data: input.patientData,
        });
      }

      return prisma.user.update({
        where: { id: user.id },
        data: updates
      });
    },

    createAccessRequest: async (_, { input }, { user }) => {
      requireRole(user, 'DOCTOR');
      const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });

      return prisma.accessRequest.create({
        data: {
          doctorId: doctor.id,
          patientId: input.patientId,
          reason: input.reason,
          message: input.message
        }
      });
    },

    updateAccessRequest: async (_, { input }, { user }) => {
      requireRole(user, 'PATIENT');

      const accessRequest = await prisma.accessRequest.findUnique({
        where: { id: input.id }
      });

      if (!accessRequest) throw new Error('Access request not found');

      const patient = await prisma.patient.findUnique({
        where: { userId: user.id }
      });

      if (accessRequest.patientId !== patient.id) throw new Error('Access denied');

      return prisma.accessRequest.update({
        where: { id: input.id },
        data: { status: input.status }
      });
    },

    createRecord: async (_, { input }, { user }) => {
      let patientId = input.patientId;

      if (user.role === 'PATIENT' && !input.patientId) {
        const patient = await prisma.patient.findUnique({
          where: { userId: user.id }
        });
        patientId = patient.id;
      } else {
        requireRole(user, 'DOCTOR');
      }

      return prisma.record.create({
        data: {
          title: input.title,
          content: input.content,
          diagnosis: input.diagnosis,
          treatment: input.treatment,
          medications: input.medications,
          notes: input.notes,
          patientId
        }
      });
    },

    updateRecord: async (_, { input }, { user }) => {
      requireAuth(user);

      const record = await prisma.record.findUnique({ where: { id: input.id } });
      if (!record) throw new Error('Record not found');

      const patient = await prisma.patient.findUnique({ where: { userId: user.id } });

      if (user.role === 'PATIENT') {
        if (record.patientId !== patient.id) throw new Error('Access denied');
      }

      if (user.role === 'DOCTOR') {
        const doctor = await prisma.doctor.findUnique({
          where: { userId: user.id },
          include: { patients: true }
        });

        const hasAccess = doctor.patients.some(p => p.id === record.patientId);
        if (!hasAccess) throw new Error('Access denied');
      }

      return prisma.record.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          diagnosis: input.diagnosis,
          treatment: input.treatment,
          medications: input.medications,
          notes: input.notes,
        }
      });
    },

    deleteRecord: async (_, { id }, { user }) => {
      requireAuth(user);

      const record = await prisma.record.findUnique({ where: { id } });
      if (!record) throw new Error('Record not found');

      const patient = await prisma.patient.findUnique({ where: { userId: user.id } });

      if (user.role === 'PATIENT') {
        if (record.patientId !== patient.id) throw new Error('Access denied');
      }

      if (user.role === 'DOCTOR') {
        const doctor = await prisma.doctor.findUnique({
          where: { userId: user.id },
          include: { patients: true }
        });

        const hasAccess = doctor.patients.some(p => p.id === record.patientId);
        if (!hasAccess) throw new Error('Access denied');
      }

      await prisma.record.delete({ where: { id } });
      return true;
    }
  }
};
