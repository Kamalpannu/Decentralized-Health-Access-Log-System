const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    role: String!
  }
  type Doctor {
    id: ID!
    user: User!
    patients: [Patient]
  }
  type Patient {
    id: ID!
    user: User!
    records: [Record]
    doctors: [Doctor]
  }
  type Record {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
  }
  type AccessRequest {
    id: ID!
    doctor: Doctor!
    patient: Patient!
    approved: Boolean!
  }
  type Query {
    getUsers: [User]
    getDoctors: [Doctor]
    getPatients: [Patient]
    getRecords(patientId: ID!): [Record]
    getAccessRequests(doctorId: ID!): [AccessRequest]
  }
  type Mutation {
    createUser(email: String!, role: String!): User
    createDoctor(userId: String!): Doctor
    createPatient(userId: String!): Patient
    createRecord(patientId: String!, title: String!, content: String!): Record
    requestAccess(doctorId: String!, patientId: String!): AccessRequest
    approveAccess(requestId: String!): AccessRequest
  }
`;

module.exports = typeDefs;
