import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, TFunction, Farm, Theme, Language } from '../types';
import DefaultUserIcon from './DefaultUserIcon';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  farms: Farm[];
  selectedFarmId: string | null;
  onSelectFarm: (farmId: string | null) => void;
  unacknowledgedAlertsCount: number;
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TFunction;
}

const ProfileIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);
const SettingsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-1.57 1.996A1.532 1.532 0 013.17 8.51c-1.56.38-1.56 2.6 0 2.98a1.532 1.532 0 01.948 2.286c-.836 1.372.734 2.942 1.996 1.57A1.532 1.532 0 018.51 16.83c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.286-.948c1.372.836 2.942-.734-1.57-1.996A1.532 1.532 0 0116.83 11.49c1.56-.38 1.56-2.6 0-2.98a1.532 1.532 0 01-.948-2.286c.836-1.372-.734-2.942-1.996-1.57A1.532 1.532 0 0111.49 3.17zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);
const LogoutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
  </svg>
);
const AlertsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  farms,
  selectedFarmId,
  onSelectFarm,
  unacknowledgedAlertsCount,
  theme,
  toggleTheme,
  language,
  setLanguage,
  t,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const farmDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    '/dashboard': t('header.farmOverview'),
    '/farms': 'Farm Management',
    '/zones': t('header.zoneManagement'),
    '/equipment': t('header.equipmentStatus'),
    '/alerts': t('header.alerts'),
    '/reports': t('header.reportsAnalytics'),
    '/settings': t('header.systemSettings'),
    '/profile': t('header.userProfile'),
    '/login': 'Login',
    '/signup': 'Sign Up',
    '/home': t('landingHeader.home'),
  };

  const selectedFarm = farms.find(f => f.id === selectedFarmId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) setUserDropdownOpen(false);
      if (farmDropdownRef.current && !farmDropdownRef.current.contains(event.target as Node)) setFarmDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserNav = (path: string) => {
    navigate(path);
    setUserDropdownOpen(false);
  };

  const handleFarmSelect = (farmId: string) => {
    onSelectFarm(farmId);
    setFarmDropdownOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="h-20 shrink-0 flex items-center justify-between px-4 md:px-6 lg:px-8 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
      <div className="flex items-center gap-4">
         <div className="hidden">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white">{pageTitles[location.pathname]}</h1>

        {/* Farm Dropdown */}
        {farms.length > 0 && selectedFarm && (
          <div className="relative" ref={farmDropdownRef}>
            <button onClick={() => setFarmDropdownOpen(!farmDropdownOpen)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <span className="font-semibold text-sm">{selectedFarm.name}</span>
              <ChevronDownIcon />
            </button>
            {farmDropdownOpen && (
              <div className="absolute start-0 mt-2 w-48 bg-card-light dark:bg-slate-700 rounded-md shadow-lg py-1 z-50 border border-border-light dark:border-border-dark">
                {farms.map(farm => (
                  <button key={farm.id} onClick={() => handleFarmSelect(farm.id)} className="w-full text-left rtl:text-right flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600">
                    {farm.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Language Toggle */}
        <button onClick={toggleLanguage} className="px-3 py-1 rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-slate-700">
          {language === 'en' ? 'EN' : 'AR'}
        </button>

        {/* Alerts */}
        <button onClick={() => navigate('/alerts')} className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
          <AlertsIcon />
          {unacknowledgedAlertsCount > 0 && (
            <span className="absolute top-0 end-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-card-light dark:ring-card-dark"></span>
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-3">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="User avatar" className="h-10 w-10 rounded-full object-cover bg-slate-200 dark:bg-slate-700" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <DefaultUserIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
              </div>
            )}
            <div className="hidden md:block text-left rtl:text-right">
              <p className="font-semibold text-sm text-black dark:text-white">{user.username}</p>
              <p className="text-xs text-text-light-secondary dark:text-dark-secondary truncate max-w-[150px]">{user.usertype}</p>
            </div>
          </button>

          {userDropdownOpen && (
            <div className="absolute end-0 mt-2 w-48 bg-card-light dark:bg-slate-700 rounded-md shadow-lg py-1 z-50 border border-border-light dark:border-border-dark">
              <button onClick={() => handleUserNav('/profile')} className="w-full text-left rtl:text-right flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600">
                <ProfileIcon className="me-2" /> {t('sidebar.profile')}
              </button>
              <button onClick={() => handleUserNav('/settings')} className="w-full text-left rtl:text-right flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600">
                <SettingsIcon className="me-2" /> {t('sidebar.settings')}
              </button>
              <div className="border-t border-border-light dark:border-border-dark my-1"></div>
              <button onClick={onLogout} className="w-full text-left rtl:text-right flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-slate-600">
                <LogoutIcon className="me-2" /> {t('sidebar.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
