import gql from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    points: Int
  }

  type CheckIn {
    id: ID!
    date: String!
    sleepHours: Int
    meals: Int
    exerciseMinutes: Int
  }

  type Query {
    me: User
    myCheckIns: [CheckIn]
  }

  type Mutation {
    register(email: String!, password: String!): String
    login(email: String!, password: String!): String
    addCheckIn(
      date: String!
      sleepHours: Int!
      meals: Int!
      exerciseMinutes: Int!
    ): Boolean
  }
`;

export default typeDefs;
