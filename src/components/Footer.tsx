import React from 'react';
import { Link } from 'react-router-dom';
import { TFunction } from '../types';

interface FooterProps {
    t: TFunction;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="w-full shrink-0 bg-card-light dark:bg-card-dark border-t border-border-light dark:border-border-dark px-4 md:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <img src="/SmartAgri_Logo.png" alt="SmartAgri Logo" className="h-20 w-20 mx-auto mb-4" />
          <p className="text-sm text-text-light-secondary dark:text-dark-secondary">
            &copy; 2025 {t('sidebar.appName')}. {t('footer.rights')}
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/about" className="text-text-light-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-primary transition-colors">
            {t('footer.about')}
          </Link>
          <Link to="/contact" className="text-text-light-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-primary transition-colors">
            {t('footer.contact')}
          </Link>
          <Link to="/privacy-policy" className="text-text-light-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-primary transition-colors">
            {t('footer.privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;