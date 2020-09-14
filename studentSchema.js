import { gql } from "apollo-server-express";

export const typeDefs = gql`
  extend type Query {
    student(id: Int!): Student
    students: [Student]
  }

  type Student {
    id: Int
    name: String!
  }
`;

export const resolvers = {
  Query: {
    student: async (_, { id }, context) => {
      return { id, name: "hello student" };
    },
    students: async (_, {}, context) => {
      return [{ id: 1, name: "hello student" }];
    },
  },
};
