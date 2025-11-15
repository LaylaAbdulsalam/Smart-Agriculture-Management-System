import React from 'react';
import { TFunction } from '../types';

interface ContactProps {
  t: TFunction;
}

const Contact: React.FC<ContactProps> = ({ t }) => {
  return (
    <div className="animate-fade-in">
        <div className="bg-primary/10 py-12">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold text-primary">{t('contact.title')}</h1>
            </div>
        </div>
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto space-y-8">
                <p className="text-lg text-center text-text-light-secondary dark:text-dark-secondary leading-relaxed">
                    {t('contact.p1')}
                </p>
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-md border border-border-light dark:border-border-dark space-y-4">
                    <h2 className="text-2xl font-semibold mb-4 text-center">{t('contact.reachOut')}</h2>
                    <div className="text-lg">
                        <strong className="text-black dark:text-white">{t('contact.email')}</strong> 
                        <a href={`mailto:${t('contact.emailAddress')}`} className="ms-2 text-primary hover:underline">{t('contact.emailAddress')}</a>
                    </div>
                    <div className="text-lg">
                        <strong className="text-black dark:text-white">{t('contact.phone')}</strong> 
                        <span className="ms-2 text-text-light-secondary dark:text-dark-secondary">{t('contact.phoneNumber')}</span>
                    </div>
                    <div className="text-lg">
                        <strong className="text-black dark:text-white">{t('contact.address')}</strong> 
                        <span className="ms-2 text-text-light-secondary dark:text-dark-secondary">{t('contact.addressDetails')}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Contact;
