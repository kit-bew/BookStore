import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import axios from '../lib/axiosConfig';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('bookease-user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user, token } = response.data;

      setCurrentUser(user);
      localStorage.setItem('bookease-user', JSON.stringify(user));
      localStorage.setItem('bookease-token', token); 
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      const message = error?.response?.data?.message || "An error occurred during login";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/register', { name, email, password, role });
      const { message } = response.data;

      toast.success(message);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bookease-user');
    localStorage.removeItem('bookease-token');
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isLoading }}>
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
