const { gql } = require('apollo-server');

const typeDefs = gql`
  type User{
    id: ID!
    email: String!
    role: String!
  }
  type Query {
    getUsers: [User]
  }
  type Mutation {
    createUser(email: String!, role: String!): User
  }
`;

module.exports = typeDefs;
