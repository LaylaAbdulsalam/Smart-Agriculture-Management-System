
import React from 'react';
import { Theme } from '../types';

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-8 w-14 rounded-full bg-gray-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark"
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`absolute inset-0 flex items-center justify-end pr-1 transition-opacity duration-300 ${
          theme === Theme.Light ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <SunIcon />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-start pl-1 transition-opacity duration-300 ${
          theme === Theme.Dark ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <MoonIcon />
      </span>
      <span
        className={`inline-block h-6 w-6 transform bg-white rounded-full shadow-lg transition-transform duration-300 ${
          theme === Theme.Dark ? 'translate-x-7 rtl:-translate-x-7' : 'translate-x-1 rtl:-translate-x-1'
        }`}
      />
    </button>
  );
};

export default ThemeToggle;