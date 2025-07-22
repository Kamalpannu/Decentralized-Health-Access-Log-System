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

export const IS_AUTHENTICATED = gql`
  query IsAuthenticated {
    me {
      id
    }
  }
`;

export const GET_PATIENTS = gql`
  query GetPatients {
    patients {
      id
      user {
        name
        email
      }
      dateOfBirth
      phoneNumber
    }
  }
`;

export const GET_MY_PATIENTS = gql`
  query GetMyPatients {
    myPatients {
      id
      user {
        name
        email
      }
      dateOfBirth
      phoneNumber
    }
  }
`;

export const GET_ACCESS_REQUESTS = gql`
  query GetAccessRequests {
    accessRequests {
      id
      patientId
      patient {
        user {
          name
          email
        }
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
      content
      diagnosis
      treatment
      createdAt
      doctor {
        user {
          name
        }
      }
    }
  }
`;

export const GET_MY_RECORDS = gql`
  query GetMyRecords {
    myRecords {
      id
      title
      content
      diagnosis
      treatment
      createdAt
      doctor {
        user {
          name
        }
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
        user {
          name
          email
        }
      }
      status
      requestedAt
      purpose
    }
  }
`;

export const CREATE_ACCESS_REQUEST = gql`
  mutation CreateAccessRequest($patientId: ID!, $reason: String, $message: String) {
    createAccessRequest(input: { patientId: $patientId, reason: $reason, message: $message }) {
      id
      status
    }
  }
`;

export const CREATE_MEDICAL_RECORD = gql`
  mutation CreateMedicalRecord($input: RecordInput!) {
    createRecord(input: $input) {
      id
      title
      content
      diagnosis
      treatment
    }
  }
`;

export const RESPOND_TO_ACCESS_REQUEST = gql`
  mutation RespondToAccessRequest($id: ID!, $status: String!) {
    updateAccessRequest(input: { id: $id, status: $status }) {
      id
      status
    }
  }
`;

export const SET_USER_ROLE = gql`
  mutation SetUserRole($role: Role!, $data: JSON) {
    setUserRole(role: $role, data: $data)
  }
`;