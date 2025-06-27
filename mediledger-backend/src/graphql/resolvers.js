const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    getUsers: () => prisma.user.findMany(),
    getDoctors: () => prisma.doctor.findMany({ include: { user: true, patients: true } }),
    getPatients: () => prisma.patient.findMany({ include: { user: true, doctors: true } }),
    getRecords: (_, { patientId }) => prisma.record.findMany({ where: { patientId } }),
    getAccessRequests: (_, { doctorId }) =>
      prisma.accessRequest.findMany({
        where: { doctorId },
        include: { doctor: true, patient: true },
      }),
  },

  Mutation: {
    createUser: (_, { email, role }) =>
      prisma.user.create({ data: { email, role } }),

    createDoctor: (_, { userId }) =>
      prisma.doctor.create({ data: { userId } }),

    createPatient: (_, { userId }) =>
      prisma.patient.create({ data: { userId } }),

    createRecord: (_, { patientId, title, content }) =>
      prisma.record.create({ data: { patientId, title, content } }),

    requestAccess: (_, { doctorId, patientId }) =>
      prisma.accessRequest.create({ data: { doctorId, patientId } }),

    approveAccess: async (_, { requestId }) => {
      return await prisma.accessRequest.update({
        where: { id: requestId },
        data: { approved: true },
      });
    },
  },
};

module.exports = resolvers;
