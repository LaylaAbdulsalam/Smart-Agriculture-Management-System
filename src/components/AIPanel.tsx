
import React from 'react';
import { TFunction } from '../types';

interface AIPanelProps {
  t: TFunction;
}

const AIPanel: React.FC<AIPanelProps> = ({ t }) => {

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">{t('aiPanel.title')}</h3>
      
      <div className="flex-grow space-y-4">
        <div className="text-center text-text-light-secondary dark:text-dark-secondary flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <p>{t('aiPanel.placeholder')}</p>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
