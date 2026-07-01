// ============================================================
// AUTH CONTEXT - Authentication State Management
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, getUser, setToken, setUser, clearAuthData } from '../utils/localStorage';
import { isTokenExpired, getRoleFromToken } from '../utils/helpers';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto Login — restore session from localStorage on app start
  useEffect(() => {
    const initAuth = () => {
      const storedToken = getToken();
      const storedUser = getUser();

      if (storedToken && storedUser) {
        if (!isTokenExpired(storedToken)) {
          setTokenState(storedToken);
          setUserState(storedUser);
        } else {
          // Token expired — clear stale session
          clearAuthData();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Call this after a successful login/signup API response
   * BACKEND NOTE: Expects { token: string, user: object }
   * The role is extracted from user.role OR from JWT payload if missing
   */
  const login = useCallback((authData) => {
    const { token: newToken, user: newUser } = authData;

    // Ensure role is always present on the user object
    const role = newUser?.role || getRoleFromToken(newToken);
    const userWithRole = { ...newUser, role };

    setToken(newToken);
    setUser(userWithRole);
    setTokenState(newToken);
    setUserState(userWithRole);
  }, []);

  /**
   * Clears all auth state and redirects to login
   */
  const logout = useCallback(() => {
    clearAuthData();
    setTokenState(null);
    setUserState(null);
  }, []);

  /**
   * Call this after a successful profile update
   * Merges updated fields into the current user object
   */
  const updateUser = useCallback((updatedData) => {
    setUserState((prev) => {
      const merged = { ...prev, ...updatedData };
      setUser(merged);
      return merged;
    });
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === ROLES.ADMIN;
  const isUser = user?.role === ROLES.USER;

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    isUser,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
