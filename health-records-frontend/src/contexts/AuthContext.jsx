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
  const { data, loading, error, refetch } = useQuery(GET_ME, {
    errorPolicy: 'ignore',
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    } else {
      setUser(null);
    }
  }, [data]);

  const refetchUser = () => {
    refetch();
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};