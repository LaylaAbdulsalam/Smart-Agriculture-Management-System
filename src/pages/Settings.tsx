
import React, { useState } from 'react';
import Toast from '../components/Toast';
import { Theme, Language, TFunction } from '../types';
import ThemeToggle from '../components/ThemeToggle';

interface SettingsProps {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TFunction;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md ${className}`}>
    {children}
  </div>
);

const LanguageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13-4-4m0 0l4-4m-4 4h12" /></svg>;
const AppearanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;


const Settings: React.FC<SettingsProps> = ({ theme, toggleTheme, language, setLanguage, t }) => {
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    // In a real app, settings might be saved to a backend.
    // Here we just show a confirmation.
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <Toast message={t('settingsPage.toastSuccess')} show={showToast} onClose={() => setShowToast(false)} />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-black dark:text-white">{t('settingsPage.title')}</h1>
        <button 
          onClick={handleSave}
          className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors"
        >
          {t('settingsPage.save')}
        </button>
      </div>
      
       <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-primary"><AppearanceIcon/></div>
          <h3 className="text-lg font-semibold">{t('settingsPage.appearance')}</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="themeToggle" className="font-medium">{t('settingsPage.theme')}</label>
            <p className="text-sm text-text-light-secondary dark:text-dark-secondary">{t('settingsPage.themeDescription')}</p>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-primary"><LanguageIcon/></div>
          <h3 className="text-lg font-semibold">{t('settingsPage.language')}</h3>
        </div>
        <p className="text-sm text-text-light-secondary dark:text-dark-secondary mb-3">{t('settingsPage.languageDescription')}</p>
        <div className="flex gap-2">
            <button onClick={() => setLanguage('en')} className={`px-4 py-2 rounded-lg transition-colors ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-700'}`}>English</button>
            <button onClick={() => setLanguage('ar')} className={`px-4 py-2 rounded-lg transition-colors ${language === 'ar' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-700'}`}>العربية</button>
        </div>
      </Card>
      
    </div>
  );
};

export default Settings;
