import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_MY_PATIENTS, GET_ACCESS_REQUESTS, GET_MY_RECORDS, GET_PENDING_REQUESTS } from '../lib/graphql-queries';
import { Activity, Users, FileText, Shield, Clock, TrendingUp } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  
  const { data: patientsData } = useQuery(GET_MY_PATIENTS, {
    skip: user?.role !== 'DOCTOR'
  });
  
  const { data: accessRequestsData } = useQuery(GET_ACCESS_REQUESTS, {
    skip: user?.role !== 'DOCTOR'
  });
  
  const { data: recordsData } = useQuery(GET_MY_RECORDS, {
    skip: user?.role !== 'PATIENT'
  });
  
  const { data: pendingRequestsData } = useQuery(GET_PENDING_REQUESTS, {
    skip: user?.role !== 'PATIENT'
  });

  const doctorStats = [
    {
      title: 'My Patients',
      value: patientsData?.myPatients?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Access Requests',
      value: accessRequestsData?.accessRequests?.filter(req => req.status === 'PENDING')?.length || 0,
      icon: Shield,
      color: 'bg-orange-500',
      change: '+3%'
    },
    {
      title: 'Recent Records',
      value: '24',
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'This Month',
      value: '127',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+15%'
    }
  ];

  const patientStats = [
    {
      title: 'My Records',
      value: recordsData?.myRecords?.length || 0,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+2'
    },
    {
      title: 'Pending Requests',
      value: pendingRequestsData?.pendingRequests?.filter(req => req.status === 'PENDING')?.length || 0,
      icon: Clock,
      color: 'bg-orange-500',
      change: ''
    },
    {
      title: 'Last Visit',
      value: '3 days ago',
      icon: Activity,
      color: 'bg-green-500',
      change: ''
    },
    {
      title: 'Health Score',
      value: '92%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+5%'
    }
  ];

  const stats = user?.role === 'DOCTOR' ? doctorStats : patientStats;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600">
          {user?.role === 'DOCTOR' 
            ? 'Manage your patients and medical records' 
            : 'View your health records and manage access'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {user?.role === 'DOCTOR' ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h3>
              <div className="space-y-4">
                {patientsData?.myPatients?.slice(0, 3).map(patient => (
                  <div key={patient.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {patient.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">{patient.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Access Requests</h3>
              <div className="space-y-4">
                {accessRequestsData?.accessRequests?.filter(req => req.status === 'PENDING').slice(0, 3).map(request => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.patient.name}</p>
                      <p className="text-sm text-gray-500">{request.purpose}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Medical Records</h3>
              <div className="space-y-4">
                {recordsData?.myRecords?.slice(0, 3).map(record => (
                  <div key={record.id} className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm font-medium text-gray-900">{record.title}</p>
                    <p className="text-sm text-gray-500">Dr. {record.doctor.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Requests</h3>
              <div className="space-y-4">
                {pendingRequestsData?.pendingRequests?.slice(0, 3).map(request => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dr. {request.doctor.name}</p>
                      <p className="text-sm text-gray-500">{request.purpose}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};