import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User } from './types';
import * as db from './services/databaseService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (email: string, mobile: string, password: string) => Promise<{ success: boolean; message: string; }>;
  findUserByMobile: (mobile: string) => Promise<User | null>;
  resetUserPassword: (mobile: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await db.initializeDatabase();
      // For persistence, we could use localStorage to store the logged-in user.
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const loggedInUser = await db.loginUser(email, password);
    if (loggedInUser) {
      // Omit password from user object stored in state/session
      const { password, ...userToStore } = loggedInUser;
      const finalUser = userToStore as User
      setUser(finalUser);
      sessionStorage.setItem('user', JSON.stringify(finalUser));
    }
    setLoading(false);
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  const register = async (email: string, mobile: string, password: string) => {
    setLoading(true);
    const result = await db.registerUser(email, mobile, password);
    setLoading(false);
    return result;
  };
  
  const findUserByMobile = async (mobile: string) => {
    setLoading(true);
    const result = await db.findUserByMobile(mobile);
    setLoading(false);
    return result;
  }
  
  const resetUserPassword = async (mobile: string, newPassword: string) => {
    setLoading(true);
    const result = await db.resetUserPassword(mobile, newPassword);
    setLoading(false);
    return result;
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    findUserByMobile,
    resetUserPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
