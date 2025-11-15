import React from 'react';
import { TFunction } from '../types';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToSignUp: () => void;
  t: TFunction;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToSignUp, t }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=1974&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative w-full max-w-md p-8 space-y-6 bg-card-light dark:bg-card-dark rounded-xl shadow-lg animate-fade-in border border-border-light dark:border-border-dark">
        <div className="text-center">
          <div className="w-24 h-10 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-4">{/* Logo Placeholder */}</div>
          <p className="text-text-light-secondary dark:text-dark-secondary mt-4">{t('login.description')}</p>
        </div>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLoginSuccess(); }}>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-black dark:text-white">{t('login.email')}</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue="layla.abdulsalam@smartagri.com"
              className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-black dark:text-white">{t('login.password')}</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              defaultValue="password"
              className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ms-2 block text-sm text-text-light-secondary dark:text-dark-secondary">{t('login.rememberMe')}</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-focus">{t('login.forgotPassword')}</a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {t('login.loginButton')}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-text-light-secondary dark:text-dark-secondary">
          {t('login.noAccount')}{' '}
          <button onClick={onSwitchToSignUp} className="font-medium text-primary hover:text-primary-focus">{t('login.createAccount')}</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
