import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/doctor/PatientsPage';
import { MyPatientsPage } from './pages/doctor/MyPatientsPage';
import { AccessRequestsPage } from './pages/doctor/AccessRequestsPage';
import { PatientRecordsPage } from './pages/doctor/PatientRecordsPage';
import { MyRecordsPage } from './pages/patient/MyRecordsPage';
import { AccessControlPage } from './pages/patient/AccessControlPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();

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

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
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
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <Layout>
              <AccessControlPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;