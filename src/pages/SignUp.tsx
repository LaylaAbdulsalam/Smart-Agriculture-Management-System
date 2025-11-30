/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { TFunction } from '../types';
import { useAuth } from '../contexts/useAuth';    
import DefaultUserIcon from '../components/DefaultUserIcon';

interface SignUpProps {
  onSwitchToLogin: () => void;
  t: TFunction;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToLogin, t }) => {
  const { register, verifyOtp, resendVerificationOtp } = useAuth(); 
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const fullname = formData.get('fullname') as string;
      const email = formData.get('email') as string;
      const phonenumber = formData.get('phonenumber') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      setUserEmail(email);
      await register(fullname, email, password, phonenumber);
      setAwaitingOtp(true);

    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const otp = formData.get('otp') as string;
      
      await verifyOtp(userEmail, otp);
    } catch (error: any) {
      setError(error.message || 'OTP verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative w-full max-w-lg p-8 space-y-6 bg-card-light dark:bg-card-dark rounded-xl shadow-lg animate-fade-in border border-border-light dark:border-border-dark">

        {!awaitingOtp ? (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black dark:text-white">{t('signup.title')}</h2>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="shrink-0">
                  {avatarPreview ? (
                    <img className="h-16 w-16 object-cover rounded-full" src={avatarPreview} alt="Profile preview" />
                  ) : (
                    <div className="h-16 w-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <DefaultUserIcon className="w-10 h-10 text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                </div>
                <label className="block">
                  <span className="sr-only">{t('signup.choosePhoto')}</span>
                  <input type="file" onChange={handleAvatarChange} accept="image/*" className="block w-full text-sm text-slate-500 file:me-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </label>
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">{t('signup.name')}</label>
                <input type="text" name="fullname" required placeholder="Your Full Name" className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">{t('signup.email')}</label>
                <input type="email" name="email" required placeholder="your@email.com" className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
              </div>
              <div>
                <label className="text-sm font-medium text-black dark:text-white">Phone Number</label>
                <input type="tel" name="phonenumber" required placeholder="e.g. +201234567890" className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-black dark:text-white">{t('signup.password')}</label>
                  <input type="password" name="password" required placeholder="Password" className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
                </div>
                <div>
                  <label className="text-sm font-medium text-black dark:text-white">{t('signup.confirmPassword')}</label>
                  <input type="password" name="confirmPassword" required placeholder="Confirm Password" className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
                </div>
              </div>
              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Creating Account...' : t('signup.createButton')}
                </button>
              </div>
            </form>
            <p className="text-center text-sm text-text-light-secondary dark:text-dark-secondary">
              {t('signup.hasAccount')}{' '}
              <button onClick={onSwitchToLogin} className="font-medium text-primary hover:text-primary-focus">
                {t('signup.login')}
              </button>
            </p>
          </>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black dark:text-white">Verify Your Account</h2>
              <p className="text-text-light-secondary dark:text-dark-secondary mt-4">
                An OTP has been sent to <strong>{userEmail}</strong>. Please enter it below to complete your registration.
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <div>
                <label htmlFor="otp" className="text-sm font-medium text-black dark:text-white">
                  Verification Code (OTP)
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  placeholder="Enter the 6-digit code"
                  className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify and Create Account'}
                </button>
              </div>
            </form>
            
            <div className="text-center mt-4">
              <p className="text-sm text-text-light-secondary dark:text-dark-secondary">
                Didn't receive the code?{' '}
                <button 
                  onClick={async () => {
                    setLoading(true);
                    setError('');
                    try {
                      await resendVerificationOtp(userEmail);
                    } catch (e: any) {
                      setError(e.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="font-medium text-primary hover:text-primary-focus disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;