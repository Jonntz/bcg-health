import { PrismaClient } from "@prisma/client";
import { generateToken, hashPassword, comparePassword } from "./utils/auth";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      const userId = context.userId;
      if (!userId) throw new Error("Not authenticated");
      return await prisma.user.findUnique({ where: { id: userId } });
    },
  },
  Mutation: {
    register: async (_: any, { email, password }: any) => {
      const hashed = await hashPassword(password);
      const user = await prisma.user.create({
        data: { email, password: hashed },
      });
      return generateToken({ userId: user.id });
    },
    login: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) throw new Error("Invalid credentials");
      const valid = await comparePassword(password, user.password);

      if (!valid) throw new Error("Invalid credentials");
      return generateToken({ userId: user.id });
    },
  },
};

export default resolvers;
