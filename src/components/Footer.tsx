import React from 'react';
import { TFunction, Page } from '../types';

interface FooterProps {
    t: TFunction;
    setActivePage?: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ t, setActivePage }) => {
  const handleNavClick = (page: Page) => {
    if (setActivePage) {
      setActivePage(page);
    }
  };

  return (
    <footer className="w-full flex-shrink-0 bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark px-4 md:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-200 dark:bg-slate-700 rounded animate-pulse">{/* Logo Placeholder */}</div>
          <p className="text-sm text-text-light-secondary dark:text-dark-secondary">
            &copy; 2025 {t('sidebar.appName')}. {t('footer.rights')}
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <button onClick={() => handleNavClick(Page.About)} className="text-text-light-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-primary transition-colors">{t('footer.about')}</button>
          <button onClick={() => handleNavClick(Page.Contact)} className="text-text-light-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-primary transition-colors">{t('footer.contact')}</button>
          <button onClick={() => handleNavClick(Page.PrivacyPolicy)} className="text-text-light-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-primary transition-colors">{t('footer.privacy')}</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
