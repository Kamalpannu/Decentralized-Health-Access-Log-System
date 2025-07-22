import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../lib/graphql-queries';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { data: userData, loading: userLoading, error: userError, refetch } = useQuery(GET_ME, {
    errorPolicy: 'ignore',
    fetchPolicy: 'cache-and-network',
  });
  
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loading = userLoading;

  useEffect(() => {
    console.log('Auth state:', { userData, userError });
    
    if (userData?.me) {
      setIsAuthenticated(true);
      setUser(userData.me);
    } else if (userError || !userData) {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [userData, userError]);

  // Debug logging
  useEffect(() => {
    console.log('Auth Context State:', {
      isAuthenticated,
      user,
      loading,
      hasRole: user?.role,
      userData: userData?.me?.id
    });
  }, [isAuthenticated, user, loading, userData]);

  const refetchUser = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error refetching user:', error);
    }
  };

  const value = {
    user,
    loading,
    error: userError,
    refetchUser,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};