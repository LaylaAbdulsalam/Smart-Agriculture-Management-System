import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthProvider';
import { useAuth } from './contexts/useAuth';
import { FarmProvider, useFarm } from './contexts/FarmContext';
import { Theme } from './types';
import { useLocalization } from './localization';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Footer from './components/Footer';

// Authenticated pages
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Zones from './pages/Zones';
import CropGuidePage from './pages/CropGuidePage';
import CropDetailPage from './pages/CropDetailPage';
import EquipmentPage from './pages/Equipment';
import Profile from './pages/Profile';
import AlertsPage from './pages/Alerts';
import FarmsPage from './pages/Farms';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import ErrorBoundary from './components/ErrorBoundary';
import LandingHeader from './components/LandingHeader';

const LoadingScreen: React.FC = () => {
  const { theme } = useAuth();

  return (
    <div className={`flex h-screen items-center justify-center font-sans ${theme === Theme.Dark ? 'dark' : ''} bg-slate-50 dark:bg-gray-900`}>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-green-600"></div>
    </div>
  );
};

// Layout for authenticated users
const AuthLayout: React.FC = () => {
  const { user, logout, theme, setTheme, language, setLanguage } = useAuth();
  const { farms, selectedFarmId, setSelectedFarmId, alerts } = useFarm();
  const { t } = useLocalization(language);

  const toggleTheme = () => setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);

  return (
    <div className={`flex h-screen font-sans ${theme === Theme.Dark ? 'dark' : ''} bg-slate-50 dark:bg-gray-900 text-black dark:text-white`}>
      <Sidebar 
        t={t}
        onLogout={logout}
        unacknowledgedAlertsCount={alerts.filter(a => !a.isAcknowledged).length}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user!}
          onLogout={logout}
          t={t}
          farms={farms}
          selectedFarmId={selectedFarmId}
          onSelectFarm={setSelectedFarmId}
          unacknowledgedAlertsCount={alerts.filter(a => !a.isAcknowledged).length}
          theme={theme}
          toggleTheme={toggleTheme}
          language={language}
          setLanguage={setLanguage}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/dashboard" element={<Dashboard t={t} />} />
            <Route path="/farms" element={<FarmsPage t={t} />} />
            <Route path="/zones" element={<Zones t={t} />} />
            <Route path="/crop-guide" element={<CropGuidePage t={t} />} />
            <Route path="/crop-guide/:cropId" element={<CropDetailPage t={t} />} />
            <Route path="/equipment" element={<EquipmentPage t={t} />} />
            <Route path="/alerts" element={<AlertsPage t={t} />} />
            <Route path="/reports" element={<Reports t={t} />} />
            <Route path="/settings" element={<Settings theme={theme} toggleTheme={toggleTheme} language={language} setLanguage={setLanguage} t={t} />} />
            <Route path="/profile" element={<Profile user={user!} setUser={() => {}} t={t} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Layout for public pages
const PublicLayout: React.FC = () => {
  const { theme, setTheme, language, setLanguage } = useAuth();
  const { t } = useLocalization(language);

  const toggleTheme = () => setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);

  return (
    <div className={`flex flex-col min-h-screen font-sans ${theme === Theme.Dark ? 'dark' : ''} bg-white dark:bg-gray-900`}>
      <LandingHeader
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        t={t}
      />

      <main className="grow">
        <Routes>
          <Route path="/" element={<Home t={t} />} />
          <Route path="/about" element={<About t={t} />} />
          <Route path="/contact" element={<Contact t={t} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy t={t} />} />
          <Route path="/login" element={<Login t={t} />} />
          <Route path="/signup" element={<SignUp t={t} />} />
        </Routes>
      </main>

      <Footer t={t} />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (isLoggedIn && user) {
    return (
      <FarmProvider userId={user.id}>
        <AuthLayout />
      </FarmProvider>
    );
  }

  return <PublicLayout />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
