import React from 'react';
import { TFunction, Page, ReadingTypeCode } from '../types';
import { useFarm } from '../contexts/FarmContext';
import SensorCard from '../components/SensorCard';
import AIReportPanel from '../components/AIPanel';
import ChartComponent from '../components/ChartComponent';

interface DashboardProps {
  t: TFunction;
  setActivePage: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ t, setActivePage }) => {
  const { farms, zones, readings, equipments, readingTypes, selectedFarmId } = useFarm();

  const selectedFarm = farms.find(f => f.id === selectedFarmId);

  if (!selectedFarm) {
    return (
      <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl shadow-md">
        <h3 className="text-xl font-semibold">Welcome to your Smart Agriculture Dashboard!</h3>
        <p className="text-text-light-secondary dark:text-dark-secondary mt-2">
          Select a farm from the header to view its data, or create one to get started.
        </p>
        <button 
          onClick={() => setActivePage(Page.Farms)} 
          className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors"
        >
          Go to Farm Management
        </button>
      </div>
    );
  }

  const getAverageForType = (typeCode: ReadingTypeCode) => {
    const type = readingTypes.find(rt => rt.code === typeCode);
    if (!type) return { value: 'N/A', unit: '' };

    const relevantEquipments = equipments.filter(eq => eq.readingTypeId === type.id);
    const relevantReadings = readings.filter(r => 
      relevantEquipments.some(eq => eq.id === r.equipmentId)
    );
    
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
    .filter(r => equipments.some(eq => 
      eq.id === r.equipmentId && 
      eq.readingTypeId === readingTypes.find(rt => rt.code === ReadingTypeCode.SoilMoisture)?.id
    ))
    .slice(-24)
    .map(r => ({ 
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      value: r.value 
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SensorCard 
          title={t('dashboard.temperature')} 
          value={`${tempAvg.value}°${tempAvg.unit}`} 
          icon="temp" 
          status="good" 
        />
        <SensorCard 
          title={t('dashboard.soilMoisture')} 
          value={`${moistureAvg.value}${moistureAvg.unit}`} 
          icon="moisture" 
          status="good" 
        />
        <SensorCard 
          title={t('dashboard.humidity')} 
          value={`${humidityAvg.value}${humidityAvg.unit}`} 
          icon="humidity" 
          status="good" 
        />
        <SensorCard 
          title={t('dashboard.activeZones')} 
          value={`${zones.length}`} 
          icon="zone" 
          status="good" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartComponent 
            title={t('dashboard.soilMoistureTrend')} 
            data={moistureHistory} 
            dataKey="value" 
            color="#3b82f6" 
          />
        </div>
        <div className="lg:col-span-1">
          <AIReportPanel t={t} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;