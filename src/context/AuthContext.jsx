import { createContext, useContext, useEffect, useState } from 'react';
import { setToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(localStorage.getItem('token') || '');

  const login = (nextToken) => {
    localStorage.setItem('token', nextToken);
    setAuthToken(nextToken);
    setToken(nextToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken('');
    setToken('');
  };

  useEffect(() => setToken(token), [token]);

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
