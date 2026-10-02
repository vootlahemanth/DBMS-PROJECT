import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ut_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved user from localStorage', e);
    }
    return null;
  });

  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ut_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ut_user');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    setAuthLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      setAuthLoading(false);
      return { success: false, message: 'Please enter your email address.' };
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setAuthLoading(false);
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (!password || password.trim().length === 0) {
      setAuthLoading(false);
      return { success: false, message: 'Please enter your password.' };
    }

    try {
      const res = await authService.login({ email: cleanEmail, password });
      if (res.data && res.data.success && res.data.data) {
        const user = res.data.data;
        const authSession = {
          isAuthenticated: true,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone || '+91 90000 00000',
          role: user.role,
          city: user.city || 'Hyderabad',
          token: user.token,
          verificationStatus: user.verificationStatus
        };
        setCurrentUser(authSession);
        setAuthLoading(false);
        return { success: true, user: authSession };
      }
      setAuthLoading(false);
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (error) {
      setAuthLoading(false);
      const msg = error.response?.data?.message || error.message || 'Login failed. Please check backend connection.';
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    setAuthLoading(true);
    try {
      const res = await authService.register(userData);
      if (res.data && res.data.success && res.data.data) {
        const user = res.data.data;
        const authSession = {
          isAuthenticated: true,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone || '+91 90000 00000',
          role: user.role,
          city: user.city || 'Hyderabad',
          token: user.token,
          verificationStatus: user.verificationStatus
        };
        setCurrentUser(authSession);
        setAuthLoading(false);
        return { success: true, user: authSession };
      }
      setAuthLoading(false);
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (error) {
      setAuthLoading(false);
      const msg = error.response?.data?.message || error.message || 'Registration failed. Please check backend connection.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ut_user');
  };

  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        authLoading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
