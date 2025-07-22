import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/doctor/PatientsPage';
import { MyPatientsPage } from './pages/doctor/MyPatientsPage';
import { AccessRequestsPage } from './pages/doctor/AccessRequestsPage';
import { PatientRecordsPage } from './pages/doctor/PatientRecordsPage';
import { MyRecordsPage } from './pages/patient/MyRecordsPage';
import { AccessControlPage } from './pages/patient/AccessControlPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading, isAuthenticated } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log('App State:', {
      isAuthenticated,
      user: user?.id,
      role: user?.role,
      loading
    });
  }, [isAuthenticated, user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Global Health Chain...</p>
        </div>
      </div>
    );
  }

  // Handle authentication states more clearly
  const shouldShowLogin = !isAuthenticated;
  const shouldShowRoleSelection = isAuthenticated && user && (!user.role || user.role === 'UNASSIGNED');
  const shouldShowDashboard = isAuthenticated && user && user.role && user.role !== 'UNASSIGNED';

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          shouldShowLogin ? <LoginPage /> : 
          shouldShowRoleSelection ? <Navigate to="/select-role" replace /> :
          shouldShowDashboard ? <Navigate to="/dashboard" replace /> :
          <LoginPage />
        } 
      />
      <Route 
        path="/select-role" 
        element={
          shouldShowRoleSelection ? <RoleSelectionPage /> : 
          shouldShowDashboard ? <Navigate to="/dashboard" replace /> : 
          shouldShowLogin ? <Navigate to="/login" replace /> :
          <RoleSelectionPage />
        } 
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      <Route 
        path="/profile-setup" 
        element={
          shouldShowRoleSelection ? <ProfileSetupPage /> : 
          shouldShowDashboard ? <Navigate to="/dashboard" replace /> : 
          shouldShowLogin ? <Navigate to="/login" replace /> :
          <ProfileSetupPage />
        } 
      />
      
      <Route
        path="/dashboard"
        element={
          shouldShowLogin ? <Navigate to="/login" replace /> :
          shouldShowRoleSelection ? <Navigate to="/select-role" replace /> :
          <ProtectedRoute allowedRoles={['DOCTOR', 'PATIENT']}>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Doctor Routes */}
      <Route
        path="/patients"
        element={
          shouldShowLogin ? <Navigate to="/login" replace /> :
          shouldShowRoleSelection ? <Navigate to="/select-role" replace /> :
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <Layout>
              <PatientsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/my-patients"
        element={
          shouldShowLogin ? <Navigate to="/login" replace /> :
          shouldShowRoleSelection ? <Navigate to="/select-role" replace /> :
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <Layout>
              <MyPatientsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/access-requests"
        element={
          shouldShowLogin ? <Navigate to="/login" replace /> :
          shouldShowRoleSelection ? <Navigate to="/select-role" replace /> :
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <Layout>
              <AccessRequestsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/patient/:patientId/records"
        element={
          shouldShowLogin ? <Navigate to="/login" replace /> :
          shouldShowRoleSelection ? <Navigate to="/select-role" replace /> :
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <Layout>
              <PatientRecordsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Patient Routes */}
      <Route
        path="/my-records"
        element={
          shouldShowLogin ? <Navigate to="/login" replace /> :
          shouldShowRoleSelection ? <Navigate to="/select-role" replace /> :
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <Layout>
              <MyRecordsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/access-control"
        element={
          shouldShowLogin ? <Navigate to="/login" replace /> :
          shouldShowRoleSelection ? <Navigate to="/select-role" replace /> :
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <Layout>
              <AccessControlPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;