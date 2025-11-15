import React from 'react';
import { TFunction } from '../types';

interface PrivacyPolicyProps {
  t: TFunction;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ t }) => {
  return (
    <div className="animate-fade-in">
        <div className="bg-primary/10 py-12">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold text-primary">{t('privacy.title')}</h1>
            </div>
        </div>
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto space-y-6 text-lg text-text-light-secondary dark:text-dark-secondary leading-relaxed text-justify">
                <p>{t('privacy.p1')}</p>
                <p>{t('privacy.p2')}</p>
                <p>{t('privacy.p3')}</p>
                <p>{t('privacy.p4')}</p>
            </div>
        </div>
    </div>
  );
};

export default PrivacyPolicy;
