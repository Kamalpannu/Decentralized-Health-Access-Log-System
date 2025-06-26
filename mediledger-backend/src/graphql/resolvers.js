const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    getUsers: async () => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    createUser: async (_, { email, role }) => {
      return await prisma.user.create({
        data: { email, role },
      });
    },
  },
};

module.exports = resolvers;
