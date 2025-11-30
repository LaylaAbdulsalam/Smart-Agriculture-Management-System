/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { TFunction } from '../types';
import { useAuth } from '../contexts/useAuth';

interface LoginProps {
  onSwitchToSignUp: () => void;
  t: TFunction;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignUp, t }) => {
  const { login, verifyOtp, resendVerificationOtp } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    localStorage.removeItem('authToken');

    const formData = new FormData(e.target as HTMLFormElement);
    const inputEmail = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    setEmail(inputEmail); 

    try {
      await login(inputEmail, password);
    } catch (error: any) {
      const errorMsg = error.message || 'Login failed.';
      
      if (errorMsg.includes('OTP') || errorMsg.includes('confirmed') || errorMsg.includes('verification')) {
        setShowOtpInput(true);
        setOtp(''); 
        setError('Your account needs verification. Please enter the code sent to your email.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyOtp(email.trim(), otp.trim());
    } catch (error: any) {
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
        await resendVerificationOtp(email);
        alert('OTP resent successfully!');
    } catch (err: any) {
        setError(err.message || "Failed to resend OTP");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=1974&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative w-full max-w-md p-8 space-y-6 bg-card-light dark:bg-card-dark rounded-xl shadow-lg animate-fade-in border border-border-light dark:border-border-dark">
        
        <div className="text-center">
         <img src="/SmartAgri_Logo.png" alt="SmartAgri Logo" className="h-25 w-25 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {showOtpInput ? 'Verify Account' : t('login.title')}
          </h2>
          <p className="text-text-light-secondary dark:text-dark-secondary mt-4">
            {showOtpInput ? `Enter the code sent to ${email}` : t('login.description')}
          </p>
        </div>

        {error && (
          <div className={`border px-4 py-3 rounded ${showOtpInput ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
            {error}
          </div>
        )}

        {!showOtpInput ? (
          // Login Form
          <form key="login-form" className="space-y-6" onSubmit={handleLoginSubmit}>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-black dark:text-white">
                {t('login.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-black dark:text-white">
                {t('login.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Your Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ms-2 block text-sm text-text-light-secondary dark:text-dark-secondary">
                  {t('login.rememberMe')}
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-focus">
                  {t('login.forgotPassword')}
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : t('login.loginButton')}
              </button>
            </div>
            <p className="text-center text-sm text-text-light-secondary dark:text-dark-secondary">
              {t('login.noAccount')}{' '}
              <button type="button" onClick={onSwitchToSignUp} className="font-medium text-primary hover:text-primary-focus">
                {t('login.createAccount')}
              </button>
            </p>
          </form>
        ) : (
          // OTP Form
          <form key="otp-form" className="space-y-6" onSubmit={handleOtpSubmit}>
            <div>
              <label htmlFor="otp" className="text-sm font-medium text-black dark:text-white">
                Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                autoFocus 
                placeholder="Enter 6-digit code"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </div>
            <div className="flex justify-between text-sm mt-4">
                <button 
                    type="button"
                    onClick={() => setShowOtpInput(false)} 
                    className="text-text-light-secondary dark:text-dark-secondary hover:underline"
                >
                    Back to Login
                </button>
                <button 
                    type="button"
                    onClick={handleResendOtp} 
                    disabled={loading}
                    className="text-primary hover:text-primary-focus hover:underline disabled:opacity-50"
                >
                    Resend Code
                </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;