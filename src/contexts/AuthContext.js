import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { CircularProgress, Box } from '@mui/material';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    checkAuth();
    // We can safely disable the exhaustive-deps warning here because checkAuth is defined in the same component
    // and doesn't depend on any props or state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      // Check if token is expired
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp > currentTime) {
          // Token is still valid, try to get current user
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            return;
          }
        }

        // Token is expired, try to refresh if we have a refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            await authService.refreshToken();
            const refreshedUser = await authService.getCurrentUser();
            setUser(refreshedUser);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            handleLogout();
          }
        } else {
          handleLogout();
        }
      } catch (tokenError) {
        console.error('Token validation failed:', tokenError);
        handleLogout();
      }
      
    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await authService.login({ username, password });
      const { access, refresh, user: userData } = response;
        if (access && refresh) {
        localStorage.setItem('token', access);
        localStorage.setItem('refresh_token', refresh);
        setUser(userData);
        setError(null);
        return userData;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        error,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
