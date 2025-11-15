import React, { useState, useRef, useEffect } from 'react';
import { User, Page, TFunction, Farm } from '../types';
import DefaultUserIcon from './DefaultUserIcon';

interface HeaderProps {
  activePage: Page;
  user: User;
  onLogout: () => void;
  setActivePage: (page: Page) => void;
  t: TFunction;
  farms: Farm[];
  selectedFarmId: number | null;
  onSelectFarm: (farmId: number | null) => void;
  unacknowledgedAlertsCount: number;
}

const ProfileIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const SettingsIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-1.57 1.996A1.532 1.532 0 013.17 8.51c-1.56.38-1.56 2.6 0 2.98a1.532 1.532 0 01.948 2.286c-.836 1.372.734 2.942 1.996 1.57A1.532 1.532 0 018.51 16.83c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.286-.948c1.372.836 2.942-.734-1.57-1.996A1.532 1.532 0 0116.83 11.49c1.56-.38 1.56-2.6 0-2.98a1.532 1.532 0 01-.948-2.286c.836-1.372-.734-2.942-1.996-1.57A1.532 1.532 0 0111.49 3.17zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const LogoutIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>;
const AlertsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;


const Header: React.FC<HeaderProps> = ({ activePage, user, onLogout, setActivePage, t, farms, selectedFarmId, onSelectFarm, unacknowledgedAlertsCount }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const farmDropdownRef = useRef<HTMLDivElement>(null);

  const pageTitles: Record<Page, string> = {
      [Page.Dashboard]: t('header.farmOverview'),
      [Page.Farms]: 'Farm Management',
      [Page.Zones]: t('header.zoneManagement'),
      [Page.Equipment]: t('header.equipmentStatus'),
      [Page.Alerts]: t('header.alerts'),
      [Page.Reports]: t('header.reportsAnalytics'),
      [Page.Settings]: t('header.systemSettings'),
      [Page.Profile]: t('header.userProfile'),
      [Page.Login]: 'Login',
      [Page.SignUp]: 'Sign Up',
      [Page.Home]: t('landingHeader.home'),
      [Page.About]: t('landingHeader.about'),
      [Page.Contact]: t('landingHeader.contact'),
      [Page.PrivacyPolicy]: t('footer.privacy'),
  };

  const selectedFarm = farms.find(f => f.id === selectedFarmId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (farmDropdownRef.current && !farmDropdownRef.current.contains(event.target as Node)) {
        setFarmDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserNav = (page: Page) => {
    setActivePage(page);
    setUserDropdownOpen(false);
  }
  
  const handleFarmSelect = (farmId: number) => {
    onSelectFarm(farmId);
    setFarmDropdownOpen(false);
  }

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 md:px-6 lg:px-8 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
      <div className="flex items-center gap-4 " >
        <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white">{pageTitles[activePage]}</h1>
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
        <button onClick={() => setActivePage(Page.Alerts)} className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <AlertsIcon />
            {unacknowledgedAlertsCount > 0 && (
                <span className="absolute top-0 end-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-card-light dark:ring-card-dark"></span>
            )}
        </button>
       
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
              <p className="font-semibold text-sm text-black dark:text-white">{user.name}</p>
              <p className="text-xs text-text-light-secondary dark:text-dark-secondary truncate max-w-[150px]">{user.role}</p>
            </div>
          </button>
          {userDropdownOpen && (
            <div className="absolute end-0 mt-2 w-48 bg-card-light dark:bg-slate-700 rounded-md shadow-lg py-1 z-50 border border-border-light dark:border-border-dark">
              <button onClick={() => handleUserNav(Page.Profile)} className="w-full text-left rtl:text-right flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600">
                <ProfileIcon className="me-2"/> {t('sidebar.profile')}
              </button>
              <button onClick={() => handleUserNav(Page.Settings)} className="w-full text-left rtl:text-right flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600">
                <SettingsIcon className="me-2"/> {t('sidebar.settings')}
              </button>
              <div className="border-t border-border-light dark:border-border-dark my-1"></div>
              <button onClick={onLogout} className="w-full text-left rtl:text-right flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-slate-600">
                <LogoutIcon className="me-2"/> {t('sidebar.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
