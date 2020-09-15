import { gql } from "apollo-server-express";

export const typeDefs = gql`
  extend type Query {
    course(id: ID!): Course
    courses: [Course]
  }

  type Course @key(fields: "id") {
    id: ID!
    name: String!
    students: [Student]
  }

  extend type Student @key(fields: "id") {
    id: ID! @external
  }
`;

export const resolvers = {
  Course: {
    __resolveReference(ref) {
      return { id: ref.id, name: "hello course" };
    },
    students(course) {
      return course.students.map((id) => ({ __typename: "Student", id }));
    },
  },
  Query: {
    course: async (_, { id }, context) => {
      return { id, name: "hello course", students: [1, 2, 3] };
    },
    courses: async (_, {}, context) => {
      return [{ id: 1, name: "hello course", students: [1, 2, 3] }];
    },
  },
};
