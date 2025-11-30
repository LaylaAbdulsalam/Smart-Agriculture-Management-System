import React from 'react';
import { Page, Language, TFunction, Theme } from '../types';
import ThemeToggle from './ThemeToggle';

interface LandingHeaderProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TFunction;
    theme: Theme;
    toggleTheme: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ activePage, setActivePage, language, setLanguage, t, theme, toggleTheme }) => {
    
    const navItems = [
        { page: Page.Home, label: t('landingHeader.home') },
        { page: Page.About, label: t('landingHeader.about') },
        { page: Page.Contact, label: t('landingHeader.contact') },
    ];
    
    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/80 dark:bg-slate-900/80">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <button onClick={() => setActivePage(Page.Home)} className="flex items-center">
                        <img src="/SmartAgri_Logo.png" alt="SmartAgri Logo" className="h-25 w-25 mb-4" />
                        <span className="text-3xl font-bold text-black dark:text-white">SmartAgri</span>
                    </button>
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map(item => (
                            <button
                                key={item.page}
                                onClick={() => setActivePage(item.page)}
                                className={`text-lg font-medium transition-colors ${
                                    activePage === item.page
                                    ? 'text-primary'
                                    : 'text-text-light-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-primary'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                    <div className="flex items-center gap-4">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                        <div className="flex gap-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-full">
                           <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-sm rounded-full transition-colors ${language === 'en' ? 'bg-white dark:bg-slate-900 text-primary font-semibold' : 'text-text-light-secondary dark:text-dark-secondary'}`}>EN</button>
                           <button onClick={() => setLanguage('ar')} className={`px-3 py-1 text-sm rounded-full transition-colors ${language === 'ar' ? 'bg-white dark:bg-slate-900 text-primary font-semibold' : 'text-text-light-secondary dark:text-dark-secondary'}`}>AR</button>
                        </div>
                         <button onClick={() => setActivePage(Page.Login)} className="hidden sm:block px-5 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors">
                            {t('landingHeader.login')}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default LandingHeader;
