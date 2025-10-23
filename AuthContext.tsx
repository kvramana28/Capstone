import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from './types';
import * as db from './services/databaseService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, mobile: string, password: string) => Promise<{ success: boolean; message: string; }>;
  resetPassword: (mobile: string, newPassword: string) => Promise<boolean>;
  findUserByMobile: (mobile: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const initialize = async () => {
      await db.initializeDatabase();
      
      const loggedInUser = sessionStorage.getItem('loggedInUser');
      if (loggedInUser) {
          const foundUser = JSON.parse(loggedInUser);
          setUser(foundUser);
          setIsAuthenticated(true);
      }
    };
    initialize();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = await db.loginUser(email, password);
    
    if (foundUser) {
      // Exclude password from the user object stored in state and session
      const { password, ...userToStore } = foundUser;
      setUser(userToStore);
      setIsAuthenticated(true);
      sessionStorage.setItem('loggedInUser', JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('loggedInUser');
  };

  const register = async (email: string, mobile: string, password: string): Promise<{ success: boolean; message: string; }> => {
    return db.registerUser(email, mobile, password);
  };
  
  const findUserByMobile = async (mobile: string): Promise<boolean> => {
    const user = await db.findUserByMobile(mobile);
    return !!user;
  };

  const resetPassword = async (mobile: string, newPassword: string): Promise<boolean> => {
    return db.resetUserPassword(mobile, newPassword);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, resetPassword, findUserByMobile }}>
      {children}
    </AuthContext.Provider>
  );
};
