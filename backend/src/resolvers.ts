import { IResolvers } from "@graphql-tools/utils";

const resolvers: IResolvers = {
  Query: {
    me: () => ({
      id: "1",
      email: "test@bcgx.com",
      points: 10,
    }),
  },
  Mutation: {
    register: async (_parent, { email, password }) => {
      return "token-registrado";
    },
    login: async (_parent, { email, password }) => {
      return "token-logado";
    },
  },
};

export default resolvers;
