import React, { useState, useEffect, useCallback, startTransition } from 'react';
import { Theme, Page, User, UserRole, Farm, Zone, Alert, ZoneCrop, Equipment, SensorReading, ThresholdType, ReadingType, Crop } from './types';
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
import RoleSelection from './pages/RoleSelection';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import LandingHeader from './components/LandingHeader';
import AlertsPage from './pages/Alerts';
import FarmsPage from './pages/Farms';
import * as api from './services/apiService';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language, setLanguage, t } = useLocalization();

  const [user, setUser] = useState<User | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [zoneCrops, setZoneCrops] = useState<ZoneCrop[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [cropCatalog, setCropCatalog] = useState<Crop[]>([]);
  const [readingTypes, setReadingTypes] = useState<ReadingType[]>([]);

  useEffect(() => {
    api.getCropCatalog().then(setCropCatalog);
    api.getReadingTypes().then(setReadingTypes);
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      api.getFarms(user.id).then(userFarms => {
        setFarms(userFarms);
        if (userFarms.length > 0 && !selectedFarmId) setSelectedFarmId(userFarms[0].id);
        else if (userFarms.length === 0) setSelectedFarmId(null);
      });
    }
  }, [isLoggedIn, user, selectedFarmId]);

  useEffect(() => {
    if (selectedFarmId) {
      Promise.all([
        api.getZonesByFarm(selectedFarmId),
        api.getZoneCropsByFarm(selectedFarmId),
        api.getEquipmentsByFarm(selectedFarmId),
        api.getAlertsByFarm(selectedFarmId)
      ]).then(([zones, zoneCrops, equipments, alerts]) => {
        startTransition(() => {
          setZones(zones);
          setZoneCrops(zoneCrops);
          setEquipments(equipments);
          setAlerts(alerts);
          setReadings([]);
        });
      });
    } else {
      startTransition(() => {
        setZones([]);
        setZoneCrops([]);
        setEquipments([]);
        setAlerts([]);
        setReadings([]);
      });
    }
  }, [selectedFarmId]);

  const simulateData = useCallback(() => {
    if (!selectedFarmId) return;

    const newReadings: SensorReading[] = [];

    equipments.forEach(eq => {
      const readingType = readingTypes.find(rt => rt.id === eq.readingTypeId);
      if (!readingType || eq.status !== 'Active') return;

      let value = 50;
      if (readingType.code === 'TEMPERATURE') value = 25 + (Math.random() - 0.5) * 5;
      if (readingType.code === 'SOIL_MOISTURE') value = 45 + (Math.random() - 0.5) * 20;
      if (readingType.code === 'AMBIENT_HUMIDITY') value = 60 + (Math.random() - 0.5) * 10;

      const newReading: SensorReading = {
        id: Date.now() + Math.random(),
        equipmentId: eq.id,
        value: parseFloat(value.toFixed(1)),
        timestamp: new Date().toISOString()
      };
      newReadings.push(newReading);

      const zone = zones.find(z => z.id === eq.zoneId);
      const activeCrop = zoneCrops.find(zc => zc.zoneId === zone?.id && zc.isActive);
      if (zone && activeCrop) {
        const crop = api.findCrop(activeCrop.cropId);
        const stage = api.findStage(crop, activeCrop.currentStageId);
        const requirement = api.findRequirements(stage, eq.readingTypeId);

        if (requirement) {
          const isAlertTriggered = newReading.value < requirement.minValue || newReading.value > requirement.maxValue;
          const existingAlert = alerts.find(a => a.zoneId === zone.id && a.readingTypeId === eq.readingTypeId && !a.isAcknowledged);

          if (isAlertTriggered && !existingAlert) {
            const alertData: Omit<Alert, 'id'> = {
              zoneId: zone.id,
              zoneCropId: activeCrop.id,
              readingTypeId: eq.readingTypeId,
              stageId: activeCrop.currentStageId,
              value: newReading.value,
              message: `${readingType.displayName} is out of range (${newReading.value} ${readingType.unit}). Allowed: ${requirement.minValue}-${requirement.maxValue}.`,
              thresholdType: newReading.value < requirement.minValue ? ThresholdType.BelowMin : ThresholdType.AboveMax,
              isAcknowledged: false,
              createdAt: new Date().toISOString(),
            };
            const newAlert = api.addAlert(alertData);
            setAlerts(prev => [...prev, newAlert]);
          }
        }
      }
    });
    setReadings(prev => [...prev.slice(-100), ...newReadings]);

  }, [equipments, zones, zoneCrops, alerts, readingTypes, selectedFarmId]);

  useEffect(() => {
    const interval = setInterval(simulateData, 7000);
    return () => clearInterval(interval);
  }, [simulateData]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Theme.Dark);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === Theme.Light ? Theme.Dark : Theme.Light);

  // === Handlers ===
  const handleAddFarm = (farmData: Omit<Farm, 'id' | 'ownerUserId'>) => {
    if (!user) return;
    api.createFarm({ ...farmData, ownerUserId: user.id }).then(newFarm => {
      setFarms(prev => [...prev, newFarm]);
      if (!selectedFarmId) setSelectedFarmId(newFarm.id);
    });
  };

  const handleUpdateFarm = (farmId: number, farmData: Partial<Farm>) => {
    api.updateFarm(farmId, farmData).then(updatedFarm => {
      setFarms(prev => prev.map(f => f.id === farmId ? updatedFarm : f));
    });
  };

  const handleDeleteFarm = (farmId: number) => {
    api.deleteFarm(farmId).then(() => {
      setFarms(prev => prev.filter(f => f.id !== farmId));
      if (selectedFarmId === farmId) {
        const newSelectedId = farms.length > 1 ? farms.find(f => f.id !== farmId)!.id : null;
        setSelectedFarmId(newSelectedId);
      }
    });
  };

  const handleAssignCrop = (zoneCropData: Omit<ZoneCrop, 'id'>): Promise<ZoneCrop> => {
    return api.assignCropToZone(zoneCropData).then(newZoneCrop => {
      const otherCrops = zoneCrops.filter(zc => zc.zoneId !== newZoneCrop.zoneId);
      const deactivatedCrops = zoneCrops.filter(zc => zc.zoneId === newZoneCrop.zoneId).map(zc => ({ ...zc, isActive: false }));
      setZoneCrops([...otherCrops, ...deactivatedCrops, newZoneCrop]);
      return newZoneCrop;
    });
  };

  const handleUpdateZoneCrop = (zoneCropId: number, updates: Partial<ZoneCrop>): Promise<ZoneCrop> => {
    return api.updateZoneCrop(zoneCropId, updates).then(updatedZoneCrop => {
      setZoneCrops(prev => prev.map(zc => zc.id === updatedZoneCrop.id ? updatedZoneCrop : zc));
      return updatedZoneCrop;
    });
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActivePage(Page.Dashboard);
    api.getUser(1).then(user => setUser(user || null));
  };

  const handleRoleSelected = (role: UserRole) => {
    if (user) setUser({ ...user, role });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setFarms([]);
    setSelectedFarmId(null);
    setActivePage(Page.Home);
  };

  const handleAcknowledgeAlert = (alertId: number) => {
    api.acknowledgeAlert(alertId).then(updatedAlert => {
      setAlerts(prev => prev.map(a => a.id === alertId ? updatedAlert : a));
    });
  };

  // === Render Pages ===
  const renderDashboardPage = () => {
    const selectedFarm = farms.find(f => f.id === selectedFarmId);
    switch (activePage) {
      case Page.Dashboard:
        return <Dashboard farm={selectedFarm} zones={zones} alerts={alerts} equipments={equipments} readings={readings} readingTypes={readingTypes} t={t} setActivePage={setActivePage} />;
      case Page.Farms:
        return <FarmsPage farms={farms} t={t} onAddFarm={handleAddFarm} onUpdateFarm={handleUpdateFarm} onDeleteFarm={handleDeleteFarm} />;
      case Page.Zones:
        return <Zones zones={zones} zoneCrops={zoneCrops} equipments={equipments} readings={readings} alerts={alerts} t={t} farmId={selectedFarmId} setZones={setZones} appContext={{ crops: cropCatalog, readingTypes, t }} onAssignCrop={handleAssignCrop} onUpdateZoneCrop={handleUpdateZoneCrop} />;
      case Page.Equipment:
        return <EquipmentPage equipments={equipments} zones={zones} readings={readings} readingTypes={readingTypes} t={t} farmId={selectedFarmId} setEquipments={setEquipments} />;
      case Page.Alerts:
        return <AlertsPage alerts={alerts} zones={zones} readingTypes={readingTypes} onAcknowledge={handleAcknowledgeAlert} t={t} />;
      case Page.Reports:
        return <Reports farmId={selectedFarmId} t={t} />;
      case Page.Settings:
        return <Settings theme={theme} toggleTheme={toggleTheme} language={language} setLanguage={setLanguage} t={t} />;
      case Page.Profile:
        return user ? <Profile user={user} setUser={setUser} t={t} /> : null;
      default:
        setActivePage(Page.Dashboard);
        return null;
    }
  };

  const renderPublicPage = () => {
    switch (activePage) {
      case Page.Home: return <Home setActivePage={setActivePage} t={t} />;
      case Page.About: return <About t={t} />;
      case Page.Contact: return <Contact t={t} />;
      case Page.PrivacyPolicy: return <PrivacyPolicy t={t} />;
      case Page.Login: return <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => setActivePage(Page.SignUp)} t={t} />;
      case Page.SignUp: return <SignUp onSignUpSuccess={handleLoginSuccess} onSwitchToLogin={() => setActivePage(Page.Login)} t={t} />;
      default: setActivePage(Page.Home); return null;
    }
  };

  // === Main Render ===
  if (!isLoggedIn) {
    const isAuthPage = activePage === Page.Login || activePage === Page.SignUp;
    if (isAuthPage) return <ErrorBoundary>{renderPublicPage()}</ErrorBoundary>;

    return (
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans">
          <LandingHeader activePage={activePage} setActivePage={setActivePage} language={language} setLanguage={setLanguage} t={t} theme={theme} toggleTheme={toggleTheme} />
          <main className="flex-grow">{renderPublicPage()}</main>
          <Footer t={t} setActivePage={setActivePage} />
        </div>
      </ErrorBoundary>
    );
  }

  if (isLoggedIn && user && !user.role) {
    return <ErrorBoundary><RoleSelection user={user} onSelectRole={handleRoleSelected} onBack={handleLogout} t={t} /></ErrorBoundary>;
  }

  if (isLoggedIn && user?.role) {
    const unacknowledgedAlerts = alerts.filter(a => !a.isAcknowledged).length;
    return (
      <ErrorBoundary>
        <div className="flex h-screen bg-slate-50 dark:bg-bg-dark text-text-light dark:text-text-dark font-sans">
          <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} t={t} unacknowledgedAlertsCount={unacknowledgedAlerts} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header activePage={activePage} user={user} onLogout={handleLogout} setActivePage={setActivePage} t={t} farms={farms} selectedFarmId={selectedFarmId} onSelectFarm={setSelectedFarmId} unacknowledgedAlertsCount={unacknowledgedAlerts} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
              {renderDashboardPage()}
            </main>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    </ErrorBoundary>
  );
};

export default App;
