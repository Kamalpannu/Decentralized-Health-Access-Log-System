import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_RECORDS, GET_ME } from '../../lib/graphql-queries';
import { FileText, Calendar, Stethoscope } from 'lucide-react';
import AIBot from '../../components/AIBot';

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const MyRecordsPage = () => {
  const { data, loading, error } = useQuery(GET_MY_RECORDS);
  const { data: userData } = useQuery(GET_ME);

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center py-8">
        Error loading records: {error.message}
      </div>
    );

  const records = data?.myRecords || [];

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Medical Records</h1>
        <p className="text-gray-600">
          {records.length} medical record{records.length !== 1 ? 's' : ''} in your health history
        </p>
      </div>

      <div className="space-y-4">
        {records.length > 0 ? (
          records.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{record.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Stethoscope className="h-4 w-4 mr-1" />
                          Dr. {record.doctor.name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(record.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {record.content && <p className="text-gray-700 mb-4">{record.content}</p>}

                  {(record.diagnosis || record.treatment) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      {record.diagnosis && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <h4 className="text-sm font-semibold text-red-900 mb-1">Diagnosis</h4>
                          <p className="text-sm text-red-800">{record.diagnosis}</p>
                        </div>
                      )}
                      {record.treatment && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="text-sm font-semibold text-green-900 mb-1">Treatment</h4>
                          <p className="text-sm text-green-800">{record.treatment}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records yet</h3>
            <p className="text-gray-600">
              Your medical records will appear here when doctors add them to your profile
            </p>
          </div>
        )}
      </div>

      {records.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{records.length}</div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {new Set(records.map((r) => r.doctor.name)).size}
              </div>
              <div className="text-sm text-gray-600">Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {
                  records.filter((r) => {
                    const created = new Date(r.createdAt);
                    return !isNaN(created) && created > thirtyDaysAgo;
                  }).length
                }
              </div>
              <div className="text-sm text-gray-600">Last 30 Days</div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Bot Integration */}
      {userData?.me?.Patient?.id && (
        <AIBot 
          patientId={userData.me.Patient.id} 
          patientName={userData.me.name}
        />
      )}
    </div>
  );
};
