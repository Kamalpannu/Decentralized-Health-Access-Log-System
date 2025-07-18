import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PENDING_REQUESTS, RESPOND_TO_ACCESS_REQUEST } from '../../lib/graphql-queries';
import { Shield, Check, X, Clock, Calendar, User } from 'lucide-react';

export const AccessControlPage = () => {
  const { data, loading, error, refetch } = useQuery(GET_PENDING_REQUESTS);
  
  const [respondToAccessRequest] = useMutation(RESPOND_TO_ACCESS_REQUEST, {
    onCompleted: () => {
      refetch();
    }
  });

  const handleResponse = async (requestId, approved) => {
    await respondToAccessRequest({
      variables: {
        requestId,
        approved
      }
    });
  };

  if (loading) return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-600 text-center py-8">Error loading requests: {error.message}</div>;

  const pendingRequests = data?.pendingRequests || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Access Control</h1>
        <p className="text-gray-600">
          Manage who can access your medical records. You have {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-500" />
            Pending Access Requests ({pendingRequests.length})
          </h2>
        </div>
        
        {pendingRequests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {pendingRequests.map(request => (
              <div key={request.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Dr. {request.doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{request.doctor.email}</p>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          Purpose of Access Request:
                        </h4>
                        <p className="text-sm text-gray-700">{request.purpose}</p>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Requested on {new Date(request.requestedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => handleResponse(request.id, false)}
                    className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Deny Access
                  </button>
                  <button
                    onClick={() => handleResponse(request.id, true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Grant Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
            <p className="text-gray-600">
              Access requests from doctors will appear here for your approval
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Privacy Matters</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• Only doctors you explicitly approve can access your medical records</p>
              <p>• You can revoke access at any time by contacting us</p>
              <p>• All access is logged and monitored for security</p>
              <p>• Your data is encrypted and protected according to healthcare standards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};