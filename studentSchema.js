import { gql } from "apollo-server-express";

export const typeDefs = gql`
  extend type Query {
    student(id: ID!): Student
    students: [Student]
  }

  type Student @key(fields: "id") {
    id: ID!
    name: String!
    courses: [Course]
  }

  extend type Course @key(fields: "id") {
    id: ID! @external
  }
`;

export const resolvers = {
  Student: {
    courses(student) {
      return student.courses.map((id) => ({ __typename: "Course", id }));
    },
    __resolveReference(ref) {
      return { id: ref.id, name: "hello student" };
    }
  },

  Query: {
    student: async (_, { id }, context) => {
      return { id, name: "hello student", courses: [1, 2, 3] };
    },
    students: async (_, {}, context) => {
      return [{ id: 1, name: "hello student", courses: [1] }];
    },
  },
};
