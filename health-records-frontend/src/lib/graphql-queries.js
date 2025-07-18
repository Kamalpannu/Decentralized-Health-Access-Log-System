import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      avatar
      role
    }
  }
`;

export const GET_PATIENTS = gql`
  query GetPatients {
    patients {
      id
      name
      email
      dateOfBirth
      phone
    }
  }
`;

export const GET_MY_PATIENTS = gql`
  query GetMyPatients {
    myPatients {
      id
      name
      email
      dateOfBirth
      phone
    }
  }
`;

export const GET_ACCESS_REQUESTS = gql`
  query GetAccessRequests {
    accessRequests {
      id
      patientId
      patient {
        name
        email
      }
      status
      requestedAt
      purpose
    }
  }
`;

export const GET_PATIENT_RECORDS = gql`
  query GetPatientRecords($patientId: ID!) {
    patientRecords(patientId: $patientId) {
      id
      title
      description
      diagnosis
      treatment
      createdAt
      doctor {
        name
      }
    }
  }
`;

export const GET_MY_RECORDS = gql`
  query GetMyRecords {
    myRecords {
      id
      title
      description
      diagnosis
      treatment
      createdAt
      doctor {
        name
      }
    }
  }
`;

export const GET_PENDING_REQUESTS = gql`
  query GetPendingRequests {
    pendingRequests {
      id
      doctorId
      doctor {
        name
        email
      }
      status
      requestedAt
      purpose
    }
  }
`;

export const CREATE_ACCESS_REQUEST = gql`
  mutation CreateAccessRequest($patientId: ID!, $purpose: String!) {
    createAccessRequest(patientId: $patientId, purpose: $purpose) {
      id
      status
    }
  }
`;

export const CREATE_MEDICAL_RECORD = gql`
  mutation CreateMedicalRecord($input: MedicalRecordInput!) {
    createMedicalRecord(input: $input) {
      id
      title
      description
    }
  }
`;

export const RESPOND_TO_ACCESS_REQUEST = gql`
  mutation RespondToAccessRequest($requestId: ID!, $approved: Boolean!) {
    respondToAccessRequest(requestId: $requestId, approved: $approved) {
      id
      status
    }
  }
`;