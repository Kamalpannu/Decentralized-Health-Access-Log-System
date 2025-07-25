import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PATIENTS, CREATE_ACCESS_REQUEST } from '../../lib/graphql-queries';
import { Search, UserPlus, Calendar, Phone, Mail } from 'lucide-react';

export const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [purpose, setPurpose] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);

  const { data, loading, error } = useQuery(GET_PATIENTS);

  const [createAccessRequest, { loading: creatingRequest }] = useMutation(CREATE_ACCESS_REQUEST, {
    onCompleted: () => {
      setShowRequestModal(false);
      setSelectedPatient(null);
      setPurpose('');
    },
    onError: (err) => {
      console.error('Failed to create access request:', err);
      // Optionally add UI feedback here
    },
  });

  const filteredPatients =
    data?.patients?.filter(
      (patient) =>
        patient.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleRequestAccess = async () => {
    if (selectedPatient && purpose.trim()) {
      console.log("Sending input:", {
        input: {
          patientId: selectedPatient.id,
          reason: purpose.trim(),
          message: purpose.trim(),
        }
      });

      await createAccessRequest({
        variables: {
          input: {
            patientId: selectedPatient.id,
            reason: purpose.trim(),
            message: purpose.trim(),
          }
        }
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center py-8">
        Error loading patients: {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Patients</h1>
          <p className="text-gray-600">Browse and request access to patient records</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search patients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Search patients"
        />
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-blue-600">
                  {patient.user.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{patient.user.name}</h3>
                <p className="text-sm text-gray-500">Patient ID: {patient.id.slice(0, 8)}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {patient.user.email}
              </div>
              {patient.phoneNumber && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {patient.phoneNumber}
                </div>
              )}
              {patient.dateOfBirth && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedPatient(patient);
                setShowRequestModal(true);
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Request Access
            </button>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Request Access Modal */}
      {showRequestModal && selectedPatient && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-access-title"
        >
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3
              id="request-access-title"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              Request Access to {selectedPatient.user.name}'s Records
            </h3>

            <div className="mb-4">
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Purpose of access request
              </label>
              <textarea
                id="purpose"
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Please specify the medical purpose for accessing this patient's records..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={creatingRequest}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={creatingRequest}
              >
                Cancel
              </button>
              <button
                onClick={handleRequestAccess}
                disabled={!purpose.trim() || creatingRequest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
