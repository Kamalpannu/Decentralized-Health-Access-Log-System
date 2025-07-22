import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { SET_USER_ROLE } from '../lib/graphql-queries';
import { 
  User, 
  Stethoscope, 
  Calendar, 
  Phone, 
  MapPin, 
  UserCheck, 
  Save,
  ArrowLeft,
  Building,
  FileText,
  Heart
} from 'lucide-react';

export const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refetchUser } = useAuth();
  const selectedRole = location.state?.role || 'PATIENT';
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    phone: '',
    
    // Patient specific fields
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    bloodType: '',
    allergies: '',
    
    // Doctor specific fields
    specialization: '',
    licenseNumber: '',
    hospital: '',
    experience: ''
  });

  const [updateUserRole] = useMutation(SET_USER_ROLE, {
    onCompleted: () => {
      refetchUser();
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Error setting role:', error);
      setLoading(false);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data based on role
      let profileData = {};
      
      if (selectedRole === 'PATIENT') {
        profileData = {
          dateOfBirth: formData.dateOfBirth || null,
          phoneNumber: formData.phone || null,
          address: formData.address || null,
          emergencyContact: formData.emergencyContact || null,
          bloodType: formData.bloodType || null,
          allergies: formData.allergies || null
        };
      } else if (selectedRole === 'DOCTOR') {
        profileData = {
          specialization: formData.specialization || null,
          licenseNumber: formData.licenseNumber || null,
          hospital: formData.hospital || null,
          phoneNumber: formData.phone || null,
          experience: formData.experience || null
        };
      }

      await updateUserRole({
        variables: {
          role: selectedRole,
          data: profileData
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/select-role');
  };

  const getRoleIcon = () => {
    return selectedRole === 'DOCTOR' ? Stethoscope : User;
  };

  const getRoleColor = () => {
    return selectedRole === 'DOCTOR' ? 'green' : 'blue';
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  const RoleIcon = getRoleIcon();
  const roleColor = getRoleColor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={goBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to role selection
          </button>
          
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-${roleColor}-600 rounded-full mb-4`}>
            <RoleIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your {selectedRole === 'DOCTOR' ? 'Doctor' : 'Patient'} Profile
          </h1>
          <p className="text-gray-600">
            Please provide some additional information to set up your account
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Role-specific Fields */}
            {selectedRole === 'PATIENT' && (
              <>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Patient Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="h-4 w-4 inline mr-2" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Type
                      </label>
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select blood type</option>
                        {bloodTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Emergency contact name & phone"
                      />
                    </div>

                    <div>
                      <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
                        Allergies
                      </label>
                      <input
                        type="text"
                        id="allergies"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="List any allergies"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedRole === 'DOCTOR' && (
              <>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2 text-green-500" />
                    Doctor Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                        <UserCheck className="h-4 w-4 inline mr-2" />
                        Specialization *
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., Cardiology, Pediatrics"
                      />
                    </div>

                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="h-4 w-4 inline mr-2" />
                        License Number *
                      </label>
                      <input
                        type="text"
                        id="licenseNumber"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Medical license number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-2">
                        <Building className="h-4 w-4 inline mr-2" />
                        Hospital/Clinic
                      </label>
                      <input
                        type="text"
                        id="hospital"
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Current workplace"
                      />
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        min="0"
                        max="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Years of practice"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || (selectedRole === 'DOCTOR' && (!formData.specialization || !formData.licenseNumber))}
                className={`w-full flex items-center justify-center px-6 py-3 bg-${roleColor}-600 text-white font-medium rounded-lg hover:bg-${roleColor}-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                <Save className="h-5 w-5 mr-2" />
                Complete Profile Setup
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          You can update this information later in your profile settings
        </div>
      </div>
    </div>
  );
};