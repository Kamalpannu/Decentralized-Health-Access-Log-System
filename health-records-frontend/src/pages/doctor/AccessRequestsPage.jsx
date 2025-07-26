import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACCESS_REQUESTS } from '../../lib/graphql-queries';
import { Clock, CheckCircle, XCircle, User, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

const formatDate = (dateString) => {
  const parsed = dayjs(dateString);
  return parsed.isValid() ? parsed.format('MMM D, YYYY') : 'Unknown date';
};

export const AccessRequestsPage = () => {
  const { data, loading, error } = useQuery(GET_ACCESS_REQUESTS);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'DENIED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-100 text-orange-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'DENIED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        Error loading access requests: {error.message}
      </div>
    );

  const requests = data?.accessRequests || [];
  console.log('Fetched patient requests:', data?.accessRequests);
  const validRequests = requests.filter(req => req.patient?.user);
  const pendingRequests = validRequests.filter(req => req.status === 'PENDING');
  const completedRequests = validRequests.filter(req => req.status !== 'PENDING');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Access Requests</h1>
        <p className="text-gray-600">Track your requests for patient record access</p>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Pending Requests ({pendingRequests.length})
          </h2>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {pendingRequests.map(request => (
              <div key={request.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.patient?.user?.name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.patient?.user?.email || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Purpose:</span> {request.reason}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Requested {formatDate(request.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
            <p className="text-gray-600">Your access requests will appear here</p>
          </div>
        )}
      </div>

      {/* Request History */}
      {completedRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Request History ({completedRequests.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {completedRequests.map(request => (
              <div key={request.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.patient?.user?.name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.patient?.user?.email || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Purpose:</span> {request.reason}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Requested {formatDate(request.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
