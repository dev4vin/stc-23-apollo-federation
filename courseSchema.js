import { gql } from "apollo-server-express";

export const typeDefs = gql`
  extend type Query {
    course(id: Int!): Course
    courses: [Course]
  }

  type Course {
    id: Int
    name: String!
  }
`;

export const resolvers = {
  Query: {
    course: async (_, { id }, context) => {
      return { id, name: "hello course" };
    },
    courses: async (_, {}, context) => {
      return [{ id: 1, name: "hello course" }];
    },
  },
};
