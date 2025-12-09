/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { TFunction } from '../types';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  t: TFunction;
}

const Login: React.FC<LoginProps> = ({ t }) => {
  const { login, verifyOtp, resendVerificationOtp } = useAuth();
  const navigate = useNavigate();
  
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

    try {
      await login(email, password);
      navigate('/dashboard'); // redirect after successful login
    } catch (error: any) {
      const msg = error.message || 'Login failed.';
      if (msg.includes('OTP') || msg.includes('confirmed') || msg.includes('verification')) {
        setShowOtpInput(true);
        setOtp('');
        setError('Your account needs verification. Please enter the code sent to your email.');
      } else {
        setError(msg);
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
      navigate('/dashboard'); // redirect after OTP verification
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
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
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=1974&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative w-full max-w-md p-8 space-y-6 bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-border-light dark:border-border-dark">
        <div className="text-center">
          <img src="/SmartAgri_Logo.png" alt="SmartAgri Logo" className="h-25 w-25 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black dark:text-white">{showOtpInput ? 'Verify Account' : t('login.title')}</h2>
          <p className="text-text-light-secondary dark:text-dark-secondary mt-4">
            {showOtpInput ? `Enter the code sent to ${email}` : t('login.description')}
          </p>
        </div>

        {error && <div className={`border px-4 py-3 rounded ${showOtpInput ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-red-100 border-red-400 text-red-700'}`}>{error}</div>}

        {!showOtpInput ? (
          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full p-2 border rounded"/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="block w-full p-2 border rounded"/>
            <button type="submit" disabled={loading} className="w-full py-2 bg-primary text-white rounded">{loading ? 'Logging in...' : t('login.loginButton')}</button>
            <p className="text-center text-sm text-text-light-secondary dark:text-dark-secondary">
              {t('login.noAccount')}{' '}
              <button type="button" onClick={() => navigate('/signup')} className="text-primary">{t('login.createAccount')}</button>
            </p>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleOtpSubmit}>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required className="block w-full p-2 border rounded"/>
            <button type="submit" disabled={loading} className="w-full py-2 bg-primary text-white rounded">{loading ? 'Verifying...' : 'Verify & Login'}</button>
            <div className="flex justify-between text-sm mt-4">
              <button type="button" onClick={() => setShowOtpInput(false)} className="text-text-light-secondary hover:underline">Back to Login</button>
              <button type="button" onClick={handleResendOtp} disabled={loading} className="text-primary hover:underline">Resend Code</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
