import axios from "axios";
import { getMongoDb } from "./lib/mongo";
import { prisma } from "./lib/prisma";
import { generateToken, hashPassword, comparePassword } from "./utils/auth";

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      const userId = context.userId;
      if (!userId) throw new Error("Not authenticated");
      return await prisma.user.findUnique({ where: { id: userId } });
    },
    myCheckIns: async (_: any, __: any, context: any) => {
      if (!context.userId) throw new Error("Not authenticated");
      const db = await getMongoDb();
      return db
        .collection("checkins")
        .find({ userId: context.userId })
        .toArray();
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

    addCheckIn: async (
      _: any,
      { date, sleepHours, meals, exerciseMinutes }: any,
      context: any
    ) => {
      if (!context.userId) throw new Error("Not authenticated");
      const db = await getMongoDb();
      await db.collection("checkins").insertOne({
        userId: context.userId,
        date,
        sleepHours,
        meals,
        exerciseMinutes,
      });

      try {
        const res = await axios.post("http://172.25.176.1:8000/recommend", {
          sleepHours,
          meals,
          exerciseMinutes,
        });
        console.log("Recommendation:", res.data);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Erro ao chamar IA Python:", err.message);
        } else {
          console.error("Erro ao chamar IA Python:", err);
        }
      }

      return true;
    },
  },
};

export default resolvers;
