import React from 'react';
import { TFunction } from '../types';

interface AboutProps {
  t: TFunction;
}

const About: React.FC<AboutProps> = ({ t }) => {
  return (
    <div className="animate-fade-in">
        <div className="bg-primary/10 py-12">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold text-primary">{t('about.title')}</h1>
            </div>
        </div>
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto space-y-6 text-lg text-text-light-secondary dark:text-dark-secondary leading-relaxed text-justify">
                <p>{t('about.p1')}</p>
                <p>{t('about.p2')}</p>
                <p>{t('about.p3')}</p>
            </div>
        </div>
    </div>
  );
};

export default About;
