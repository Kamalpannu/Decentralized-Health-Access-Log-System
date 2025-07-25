import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, User, UserCheck, ArrowRight } from 'lucide-react';

export const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleRoleSelection = async () => {
    if (!selectedRole) return;
    
    console.log('Navigating to profile setup with role:', selectedRole);
    navigate('/profile-setup', { 
      state: { role: selectedRole } 
    });
  };

  const roles = [
    {
      id: 'PATIENT',
      title: 'Patient',
      description: 'Access and manage your medical records',
      icon: User,
      features: [
        'View your medical history',
        'Manage access permissions',
        'Control who sees your records',
        'Track your health data'
      ],
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700'
    },
    {
      id: 'DOCTOR',
      title: 'Doctor',
      description: 'Manage patients and medical records',
      icon: Stethoscope,
      features: [
        'View patient records',
        'Create medical records',
        'Request patient access',
        'Manage your patients'
      ],
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      borderColor: 'border-green-500',
      textColor: 'text-green-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Role</h1>
          <p className="text-gray-600">Select how you'll be using Global Health Chain</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-200 border-2 ${
                  isSelected 
                    ? `${role.borderColor} shadow-xl scale-105` 
                    : 'border-gray-200 hover:shadow-xl hover:scale-102'
                }`}
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${role.color} rounded-full mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-gray-600">{role.description}</p>
                </div>

                <div className="space-y-3">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-2 h-2 ${role.color} rounded-full mr-3`}></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {isSelected && (
                  <div className={`mt-4 p-3 ${role.color.replace('bg-', 'bg-').replace('-500', '-50')} rounded-lg border ${role.borderColor}`}>
                    <p className={`text-sm font-medium ${role.textColor} text-center`}>
                      Selected as {role.title}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <button
            onClick={handleRoleSelection}
            disabled={!selectedRole}
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : 'User'}
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          You can change your role later by contacting support
        </div>
      </div>
    </div>
  );
};