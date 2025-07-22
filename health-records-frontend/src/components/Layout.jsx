import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  UserCheck, 
  Shield, 
  LogOut, 
  Activity,
  Stethoscope
} from 'lucide-react';

export const Layout = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    fetch('http://localhost:4000/logout', {
      method: 'GET',
      credentials: 'include'
    }).then(() => {
      window.location.href = '/'; 
    }).catch((err) => {
      console.error('Logout failed', err);
    });
  };
  const doctorNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/patients', label: 'All Patients', icon: Users },
    { path: '/my-patients', label: 'My Patients', icon: UserCheck },
    { path: '/access-requests', label: 'Access Requests', icon: Shield },
  ];

  const patientNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/my-records', label: 'My Records', icon: FileText },
    { path: '/access-control', label: 'Access Control', icon: Shield },
  ];

  const navItems = user?.role === 'DOCTOR' ? doctorNavItems : patientNavItems;

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                Global Health Chain
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200 flex-shrink-0">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
