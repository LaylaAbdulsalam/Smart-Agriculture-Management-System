import React from 'react';
import { Farm, Zone, Alert, Equipment, SensorReading, ReadingType, ReadingTypeCode, TFunction, Page } from '../types';
import SensorCard from '../components/SensorCard';
import AIPanel from '../components/AIPanel';
import ChartComponent from '../components/ChartComponent';

const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.242-1.21 2.878 0l5.394 10.332a1.5 1.5 0 01-1.306 2.268H4.17a1.5 1.5 0 01-1.306-2.268L8.257 3.099zM10 12a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;

const AlertsWidget: React.FC<{alerts: Alert[], zones: Zone[], t: TFunction, setActivePage: (p: Page) => void}> = ({alerts, zones, t, setActivePage}) => {
    const unacknowledged = alerts.filter(a => !a.isAcknowledged).slice(0, 4);

    return (
        <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-xl shadow-md h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">{t('dashboard.activeAlerts')}</h3>
            {unacknowledged.length > 0 ? (
                <div className="space-y-3 flex-grow">
                    {unacknowledged.map(alert => (
                        <div key={alert.id} className={`p-3 rounded-lg flex items-start gap-3 ${alert.thresholdType === 'BelowMin' ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
                            <div className={`mt-1 text-xl ${alert.thresholdType === 'BelowMin' ? 'text-yellow-500' : 'text-red-500'}`}><AlertIcon /></div>
                            <div>
                                <p className="font-semibold text-sm">{zones.find(z => z.id === alert.zoneId)?.name}</p>
                                <p className="text-xs text-text-light-secondary dark:text-dark-secondary">{alert.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-text-light-secondary dark:text-dark-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p>{t('dashboard.noAlerts')}</p>
                </div>
            )}
             <button onClick={() => setActivePage(Page.Alerts)} className="w-full mt-4 text-sm font-semibold text-primary hover:underline">{t('dashboard.viewAllAlerts')}</button>
        </div>
    )
}

interface DashboardProps {
  farm?: Farm;
  zones: Zone[];
  alerts: Alert[];
  equipments: Equipment[];
  readings: SensorReading[];
  readingTypes: ReadingType[];
  t: TFunction;
  setActivePage: (p: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ farm, zones, alerts, equipments, readings, readingTypes, t, setActivePage }) => {
    
    if (!farm) {
        return (
             <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl shadow-md">
                <h3 className="text-xl font-semibold">Welcome to your Smart Agriculture Dashboard!</h3>
                <p className="text-text-light-secondary dark:text-dark-secondary mt-2">Select a farm from the header to view its data, or create one to get started.</p>
                <button onClick={() => setActivePage(Page.Farms)} className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors">
                    Go to Farm Management
                </button>
            </div>
        )
    }

    const getAverageForType = (typeCode: ReadingTypeCode) => {
        const type = readingTypes.find(rt => rt.code === typeCode);
        if (!type) return { value: 'N/A', unit: '' };

        const relevantEquipments = equipments.filter(eq => eq.readingTypeId === type.id);
        const relevantReadings = readings.filter(r => relevantEquipments.some(eq => eq.id === r.equipmentId));
        
        if (relevantReadings.length === 0) return { value: 'N/A', unit: type.unit };

        const latestReadings = relevantEquipments.map(eq => {
            return readings
                .filter(r => r.equipmentId === eq.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
        }).filter(Boolean);

        if (latestReadings.length === 0) return { value: 'N/A', unit: type.unit };
        
        const sum = latestReadings.reduce((acc, r) => acc + r.value, 0);
        const avg = sum / latestReadings.length;
        return { value: avg.toFixed(1), unit: type.unit };
    };

    const tempAvg = getAverageForType(ReadingTypeCode.Temperature);
    const moistureAvg = getAverageForType(ReadingTypeCode.SoilMoisture);
    const humidityAvg = getAverageForType(ReadingTypeCode.AmbientHumidity);
    
    const moistureHistory = readings
      .filter(r => equipments.some(eq => eq.id === r.equipmentId && eq.readingTypeId === readingTypes.find(rt => rt.code === 'SOIL_MOISTURE')?.id))
      .slice(-24)
      .map(r => ({ time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: r.value }));


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SensorCard title={t('dashboard.temperature')} value={`${tempAvg.value}°${tempAvg.unit}`} icon="temp" status={parseFloat(tempAvg.value) > 35 ? 'warning' : 'good'} />
        <SensorCard title={t('dashboard.soilMoisture')} value={`${moistureAvg.value}${moistureAvg.unit}`} icon="moisture" status={parseFloat(moistureAvg.value) < 30 ? 'danger' : 'good'} />
        <SensorCard title={t('dashboard.humidity')} value={`${humidityAvg.value}${humidityAvg.unit}`} icon="humidity" status="good" />
        <SensorCard title={t('dashboard.activeZones')} value={`${zones.length}`} icon="zone" status="good" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <ChartComponent title={t('dashboard.soilMoistureTrend')} data={moistureHistory} dataKey="value" color="#3b82f6" />
           <AlertsWidget alerts={alerts} zones={zones} t={t} setActivePage={setActivePage} />
        </div>
        <div className="lg:col-span-1">
          <AIPanel t={t} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
