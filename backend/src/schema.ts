import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    points: Int
  }

  type Query {
    me: User
  }

  type Mutation {
    register(email: String!, password: String!): String
    login(email: String!, password: String!): String
  }
`;

export default typeDefs;
