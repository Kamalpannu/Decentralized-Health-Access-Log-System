import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PATIENT_RECORDS,
  CREATE_MEDICAL_RECORD,
  CHECK_ACCESS_QUERY,
} from '../../lib/graphql-queries';
import { ArrowLeft, Plus, FileText, Calendar, User, Save, X } from 'lucide-react';
import dayjs from 'dayjs';
import AIBot from '../../components/AIBot';

const formatDate = (dateString) => {
  const parsed = dayjs(dateString);
  return parsed.isValid() ? parsed.format('MMM D, YYYY') : 'Unknown date';
};

export const PatientRecordsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    diagnosis: '',
    treatment: '',
  });

  const { data, loading, error, refetch } = useQuery(GET_PATIENT_RECORDS, {
    variables: { patientId },
    skip: !patientId,
  });

  const {
    data: accessData,
    loading: accessLoading,
    error: accessError,
  } = useQuery(CHECK_ACCESS_QUERY, {
    variables: { patientId },
    skip: !patientId,
    fetchPolicy: 'network-only',
  });

  const canCreateRecord = accessData?.canCreateRecord ?? false;

  const [createMedicalRecord, { loading: creating }] = useMutation(CREATE_MEDICAL_RECORD, {
    onCompleted: () => {
      setShowCreateForm(false);
      setFormData({ title: '', description: '', diagnosis: '', treatment: '' });
      refetch();
    },
    onError: (mutationError) => {
      alert(mutationError.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) return;

    await createMedicalRecord({
      variables: {
        input: {
          patientId,
          title: formData.title,
          content: formData.description,
          diagnosis: formData.diagnosis,
          treatment: formData.treatment,
        },
      },
    });
  };

  const records = data?.patientRecords || [];

  if (loading || accessLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        Error loading records: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/my-patients')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back to My Patients"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
            <p className="text-gray-600">
              {records.length} medical record{records.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {canCreateRecord && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </button>
        )}
      </div>

      {/* Create Record Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Create New Medical Record</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close create form"
              disabled={creating}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={creating}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={creating}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis
                </label>
                <input
                  id="diagnosis"
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={creating}
                />
              </div>

              <div>
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment
                </label>
                <input
                  id="treatment"
                  type="text"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={creating}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {creating ? 'Saving...' : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-4">
        {records.length > 0 ? (
          <>
            {records.map((record) => (
              <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{record.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Dr. {record.doctor?.user?.name || 'Unknown'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(record.createdAt)}
                        </div>
                      </div>
                      {record.content && <p className="text-gray-700 mb-3">{record.content}</p>}
                    </div>
                  </div>
                </div>

                {(record.diagnosis || record.treatment) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    {record.diagnosis && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Diagnosis</h4>
                        <p className="text-sm text-gray-700">{record.diagnosis}</p>
                      </div>
                    )}
                    {record.treatment && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Treatment</h4>
                        <p className="text-sm text-gray-700">{record.treatment}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Add Another Record button below records list */}
            {canCreateRecord && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Record
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records</h3>
            <p className="text-gray-600 mb-4">
              Start by creating the first medical record for this patient
            </p>
            {canCreateRecord && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Record
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* AI Bot Integration */}
      {patientId && records.length > 0 && (
        <AIBot 
          patientId={patientId} 
          patientName={records[0]?.patient?.user?.name || 'Patient'}
        />
      )}
    </div>
  );
};
