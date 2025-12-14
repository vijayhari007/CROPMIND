import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Verify the user still exists in our storage
        if (userData.id && localStorage.getItem(`user_${userData.id}`)) {
          setUser(userData);
        } else {
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const generateUserId = () => {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  };

  const register = async (userData) => {
    try {
      // Check if user already exists
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('user_')) {
          try {
            const existingUser = JSON.parse(localStorage.getItem(key));
            if (existingUser && existingUser.email === userData.email) {
              throw new Error('Email already registered');
            }
          } catch (e) {
            console.warn('Error checking existing user:', e);
          }
        }
      }
      
      // In a real app, this would be an API call
      const userId = 'user_' + Date.now();
      const newUser = {
        id: userId,
        ...userData,
        createdAt: new Date().toISOString(),
      };
      
      // Store with user ID as key for easier lookup
      localStorage.setItem(`user_${userId}`, JSON.stringify(newUser));
      // Also store in the standard 'user' key for session management
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      toast.success('Registration successful!');
      navigate('/community');
      return newUser;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      // Check all stored users (in a real app, this would be an API call)
      const allUsers = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('user_')) {
          try {
            const user = JSON.parse(localStorage.getItem(key));
            if (user && user.email === email) {
              allUsers.push(user);
            }
          } catch (e) {
            console.warn('Error parsing user data for key:', key, e);
          }
        }
      }
      
      // Find the user with matching credentials
      const userData = allUsers.find(user => 
        user.email === email && user.password === password
      );
      
      if (userData) {
        // Store the user in the standard 'user' key for session management
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Login successful!');
        navigate('/community');
        return userData;
      } else if (allUsers.some(u => u.email === email)) {
        throw new Error('Incorrect password');
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
