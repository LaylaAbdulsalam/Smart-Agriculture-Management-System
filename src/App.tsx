import React from 'react';
import { AuthProvider } from './contexts/AuthProvider';
import { useAuth } from './contexts/useAuth';
import { FarmProvider, useFarm } from './contexts/FarmContext';
import { Page, Theme } from './types';
import { useLocalization } from './localization';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Zones from './pages/Zones';
import EquipmentPage from './pages/Equipment';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import LandingHeader from './components/LandingHeader';
import AlertsPage from './pages/Alerts';
import FarmsPage from './pages/Farms';
import ErrorBoundary from './components/ErrorBoundary';

const LoadingScreen: React.FC = () => {
  const { theme } = useAuth();
  return (
    <div className={`flex h-screen items-center justify-center font-sans ${theme === Theme.Dark ? 'dark' : ''} bg-slate-50 dark:bg-gray-900`}>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-green-600"></div>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { user, logout, theme, setTheme, language, setLanguage } = useAuth();
  const { farms, selectedFarmId, setSelectedFarmId, alerts } = useFarm();
  const { t } = useLocalization();
  const [activePage, setActivePage] = React.useState<Page>(Page.Dashboard);
  const toggleTheme = () => setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);

  return (
    <div className={`flex h-screen font-sans ${theme === Theme.Dark ? 'dark' : ''} bg-slate-50 dark:bg-gray-900 text-black dark:text-white`}>
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onLogout={logout} 
        t={t} 
        unacknowledgedAlertsCount={alerts.filter(a => !a.isAcknowledged).length}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          activePage={activePage} 
          user={user!} 
          onLogout={logout} 
          setActivePage={setActivePage} 
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
          {activePage === Page.Dashboard && <Dashboard t={t} setActivePage={setActivePage} />}
          {activePage === Page.Farms && <FarmsPage t={t} />}
          {activePage === Page.Zones && <Zones t={t} />}
          {activePage === Page.Equipment && <EquipmentPage t={t} />}
          {activePage === Page.Alerts && <AlertsPage t={t} />}
          {activePage === Page.Reports && <Reports t={t} />}
          {activePage === Page.Settings && <Settings theme={theme} toggleTheme={toggleTheme} language={language} setLanguage={setLanguage} t={t} />}
          {activePage === Page.Profile && user && <Profile user={user} setUser={() => {}} t={t} />}
        </main>
      </div>
    </div>
  );
};

const PublicApp: React.FC = () => {
  const { theme, setTheme, language, setLanguage } = useAuth();
  const { t } = useLocalization();
  const [activePage, setActivePage] = React.useState<Page>(Page.Home);
  const toggleTheme = () => setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);

  const renderPublicPage = () => {
    switch (activePage) {
      case Page.Home: return <Home setActivePage={setActivePage} t={t} />;
      case Page.About: return <About t={t} />;
      case Page.Contact: return <Contact t={t} />;
      case Page.PrivacyPolicy: return <PrivacyPolicy t={t} />;
      case Page.Login: return <Login onSwitchToSignUp={() => setActivePage(Page.SignUp)} t={t} />;
      case Page.SignUp: return <SignUp onSwitchToLogin={() => setActivePage(Page.Login)} t={t} />;
      default: return <Home setActivePage={setActivePage} t={t} />;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen font-sans ${theme === Theme.Dark ? 'dark' : ''} bg-white dark:bg-gray-900 text-black dark:text-white`}>
      <LandingHeader 
        activePage={activePage} 
        setActivePage={setActivePage} 
        language={language} 
        setLanguage={setLanguage} 
        t={t} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      <main className="grow">{renderPublicPage()}</main>
      <Footer t={t} setActivePage={setActivePage} />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isLoggedIn) {
    if (!user) {
      return <LoadingScreen />;
    }
    return (
      <FarmProvider userId={user.id}>
        <AuthenticatedApp />
      </FarmProvider>
    );
  }
  
  return <PublicApp />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;