/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ReactNode, useEffect } from 'react';
import { User, Theme, Language } from '../types';
import * as api from '../services/apiService';
import { AuthContext } from './useAuth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || Theme.Dark);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'en');

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userData = await api.getCurrentUser();
          if (userData && userData.id) {
            setUser(userData);
            setIsLoggedIn(true);
          } else {
            throw new Error("Invalid user data from API");
          }
        } catch (error) {
          console.error("Session restore failed:", error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Theme.Dark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
  }, [language]);

  const login = async (email: string, password: string) => {
    try {
      setTempPassword(password);
      const response = await api.login({ email, password });
      console.log("Login API Response:", response);

      if (response && response.user && response.auth?.token) {
        localStorage.setItem('authToken', response.auth.token);
        setUser(response.user);
        setIsLoggedIn(true);
        setTempPassword(null);
      } else {
        throw new Error((response as any).message || 'Login failed: API did not return expected data.');
      }
    } catch (error: any) {
      logout();
      console.error('Login Flow Error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login error.');
    }
  };

  const register = async (fullname: string, email: string, password: string, phonenumber: string) => {
    try {
      setTempPassword(password);
      await api.register({FullName: fullname, email, password, PhoneNumber: phonenumber });
    } catch (error: any) {
      setTempPassword(null);
      throw new Error(error.response?.data?.message || error.message || 'Registration error.');
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const passwordToUse = tempPassword;
      if (!passwordToUse) {
        throw new Error("Session expired. Please try registering again.");
      }
      const verificationResponse = await api.verifyOtp({ email, otp });
      if (verificationResponse && verificationResponse.success) {
        await login(email, passwordToUse);
      } else {
        throw new Error((verificationResponse as any).message || "OTP verification failed.");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Verification error.');
    }
  };
  
  const resendVerificationOtp = async (email: string) => {
    try {
      await api.resendOtp(email);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('authToken');
    setTempPassword(null);
  };

  const handleThemeChange = (newTheme: Theme) => setTheme(newTheme);
  const handleLanguageChange = (newLanguage: Language) => setLanguage(newLanguage);

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, loading, theme, language,
      login, register, verifyOtp, resendVerificationOtp, logout,
      setTheme: handleThemeChange, setLanguage: handleLanguageChange,
    }}>
      {children}
    </AuthContext.Provider>
  );
};