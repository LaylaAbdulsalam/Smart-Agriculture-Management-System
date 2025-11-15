import React, { useState } from 'react';
import DefaultUserIcon from '../components/DefaultUserIcon';
import { TFunction } from '../types';

interface SignUpProps {
  onSignUpSuccess: () => void;
  onSwitchToLogin: () => void;
  t: TFunction;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onSwitchToLogin, t }) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative w-full max-w-lg p-8 space-y-6 bg-card-light dark:bg-card-dark rounded-xl shadow-lg animate-fade-in border border-border-light dark:border-border-dark">
        <div className="text-center">
           <div className="w-24 h-10 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-4">{/* Logo Placeholder */}</div>
          <p className="text-text-light-secondary dark:text-dark-secondary mt-4">{t('signup.title')}</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSignUpSuccess(); }}>
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
              <input type="file" onChange={handleAvatarChange} accept="image/*" className="block w-full text-sm text-slate-500 file:me-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
            </label>
          </div>

          <div>
            <label className="text-sm font-medium">{t('signup.name')}</label>
            <input type="text" required placeholder="Layla Abdulsalam" defaultValue="Layla Abdulsalam" className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
          </div>
          
          <div>
            <label className="text-sm font-medium">{t('signup.email')}</label>
            <input type="email" required placeholder="layla.abdulsalam@example.com" defaultValue="layla.abdulsalam@smartagri.com" className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t('signup.password')}</label>
              <input type="password" required defaultValue="password" className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium">{t('signup.confirmPassword')}</label>
              <input type="password" required defaultValue="password" className="mt-1 block w-full px-3 py-2 bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md" />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {t('signup.createButton')}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-text-light-secondary dark:text-dark-secondary">
          {t('signup.hasAccount')}{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-primary hover:text-primary-focus">{t('signup.login')}</button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
