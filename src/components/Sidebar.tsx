/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TFunction } from '../types';

interface SidebarProps {
  onLogout: () => void;
  t: TFunction;
  unacknowledgedAlertsCount: number;
}

const icons = {
  dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  farms: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  zones: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  cropGuide: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  equipment: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6" />
    </svg>
  ),
  reports: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2a4 4 0 004 4h0a4 4 0 004-4zm0 0V9a4 4 0 014-4h0a4 4 0 014 4v8m-8 0h8" />
    </svg>
  ),
  alerts: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  profile: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  logout: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

const Sidebar: React.FC<SidebarProps> = ({ onLogout, t, unacknowledgedAlertsCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const mainNav = [
    { to: '/dashboard', icon: icons.dashboard, label: t('sidebar.dashboard') },
    { to: '/farms', icon: icons.farms, label: 'Farms' },
    { to: '/zones', icon: icons.zones, label: t('sidebar.zones') },
    { to: '/crop-guide', icon: icons.cropGuide, label: 'Crop Guide' },
    { to: '/equipment', icon: icons.equipment, label: t('sidebar.equipment') },
    { to: '/alerts', icon: icons.alerts, label: t('sidebar.alerts'), badge: unacknowledgedAlertsCount },
    { to: '/reports', icon: icons.reports, label: t('sidebar.reports') },
  ];

  const settingsNav = [
    { to: '/settings', icon: icons.settings, label: t('sidebar.settings') },
  ];

  const renderNavLink = (item: any) => (
    <NavLink
      key={item.to}
      to={item.to}
      className={({ isActive }) =>
        `flex items-center justify-center md:justify-start p-3 w-full rounded-lg transition-colors duration-200 relative ${
          isActive
            ? 'bg-primary text-white'
            : 'text-text-light-secondary dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-slate-700'
        }`
      }
    >
      {item.icon}
      <span className="hidden md:block ms-4 font-medium">{item.label}</span>
      {item.badge > 0 && (
        <span className="absolute top-2 end-2 md:relative md:top-auto md:end-auto md:ms-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-red-100 bg-red-600 rounded-full">
          {item.badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <aside className="w-20 md:w-64 bg-card-light dark:bg-card-dark flex flex-col border-e border-border-light dark:border-border-dark transition-all duration-300">
      <div className="flex items-center justify-start h-20 border-b border-border-light dark:border-border-dark">
        <img src="/SmartAgri_Logo.png" alt="SAMS Logo" className="h-25 w-25 object-contain mb-5" />
        <h1 className="hidden md:block text-3xl font-bold text-primary leading-tight -ml-1">SmartAgri</h1>
      </div>

      <nav className="flex-1 px-2 md:px-4 py-4 space-y-2">
        <p className="hidden md:block px-4 text-xs font-semibold text-text-light-secondary dark:text-dark-secondary uppercase tracking-wider">
          {t('sidebar.mainMenu')}
        </p>
        {mainNav.map(renderNavLink)}

        <p className="hidden md:block px-4 pt-4 text-xs font-semibold text-text-light-secondary dark:text-dark-secondary uppercase tracking-wider">
          {t('sidebar.configuration')}
        </p>
        {settingsNav.map(renderNavLink)}
      </nav>

      <div className="px-2 md:px-4 py-4 mt-auto border-t border-border-light dark:border-border-dark">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center justify-center md:justify-start p-3 w-full rounded-lg transition-colors duration-200 mb-2 ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-text-light-secondary dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-slate-700'
            }`
          }
        >
          {icons.profile}
          <span className="hidden md:block ms-4 font-medium">{t('sidebar.profile')}</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start p-3 w-full rounded-lg transition-colors duration-200 text-text-light-secondary dark:text-dark-secondary hover:bg-red-500/10 hover:text-red-500"
        >
          {icons.logout}
          <span className="hidden md:block ms-4 font-medium">{t('sidebar.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;