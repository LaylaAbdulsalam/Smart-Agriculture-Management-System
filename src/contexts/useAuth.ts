import { createContext, useContext } from 'react';
import { User, Theme, Language } from '../types';

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  theme: Theme;
  language: Language;
  login: (email: string, password: string) => Promise<void>;
  register: (fullname: string, email: string, password: string, phonenumber: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendVerificationOtp: (email: string) => Promise<void>;
  logout: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};