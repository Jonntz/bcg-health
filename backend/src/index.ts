import express from "express";
import { ApolloServer } from "@apollo/server";
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from "@apollo/server/express4";
import { json } from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import typeDefs from "./schema";
import resolvers from "./resolvers";
import { verifyToken } from "./utils/auth";

dotenv.config();

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }: ExpressContextFunctionArgument) => {
        const token = req.headers.authorization || "";
        try {
          const decoded: any = verifyToken(token.replace("Bearer ", ""));
          return { userId: decoded.userId };
        } catch {
          return {};
        }
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();
