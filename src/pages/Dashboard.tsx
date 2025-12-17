/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { TFunction, ReadingTypeCode, Zone, Crop, ZoneCrop } from '../types';
import { useFarm } from '../contexts/FarmContext';
import SensorCard from '../components/SensorCard';
import AIReportPanel from '../components/AIPanel';
import ChartComponent from '../components/ChartComponent';

const WeatherCard: React.FC = () => {
  const [temp, setTemp] = useState(26.0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(prev => parseFloat((prev + (Math.random() - 0.5) * 0.5).toFixed(1)));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-text-light-secondary dark:text-dark-secondary">Weather Forecast</p>
        <p className="text-3xl font-bold text-black dark:text-white">{temp}°C Sunny</p>
      </div>
      <div className="text-yellow-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm-7.071 0a1 1 0 001.414 1.414l.707-.707a1 1 0 10-1.414-1.414l-.707.707zM1 10a1 1 0 011-1h1a1 1 0 110 2H2a1 1 0 01-1-1zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM5.05 14.464l-.707.707a1 1 0 101.414 1.414l.707-.707a1 1 0 00-1.414-1.414zM14.95 5.536a1 1 0 00-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707z" clipRule="evenodd" /></svg>
      </div>
    </div>
  );
};

const ActiveCropCard: React.FC<{ 
  selectedZoneId: string | 'all';
  zones: Zone[];
  zoneCrops: ZoneCrop[];
  cropCatalog: Crop[];
}> = ({ selectedZoneId, zones, zoneCrops, cropCatalog }) => {

  const cardContent = useMemo(() => {
    if (selectedZoneId !== 'all') {
      const zone = zones.find(z => z.id === selectedZoneId);
      const activeZoneCrop = zoneCrops.find(zc => zc.zoneId === selectedZoneId && zc.isActive);
      
      if (zone && activeZoneCrop) {
        const cropDetails = cropCatalog.find(c => c.id === activeZoneCrop.cropId);
        const cropName = cropDetails?.name || activeZoneCrop.cropName || 'Unknown Crop';
        // eslint-disable-next-line react-hooks/purity
        const days = Math.floor((Date.now() - new Date(activeZoneCrop.plantedAt).getTime()) / (1000 * 60 * 60 * 24));
        return {
          title: `Active Crop in ${zone.name}`,
          content: cropName,
          isList: false,
          subtext: `${days} days since planting`
        };
      }
      return { title: `Active Crop in ${zone?.name || 'Zone'}`, content: 'N/A', isList: false, subtext: 'No active crop assigned.' };
    }

    const allActiveCrops = zoneCrops
      .filter(zc => zc.isActive)
      .map(zc => cropCatalog.find(c => c.id === zc.cropId)?.name || zc.cropName)
      .filter(Boolean);
    
    if (allActiveCrops.length > 0) {
      const uniqueCrops = [...new Set(allActiveCrops)];
      return {
        title: 'Active Crops (Farm-Wide)',
        content: uniqueCrops,
        isList: true,
        subtext: `${uniqueCrops.length} different crop(s) active.`
      };
    }

    return { title: 'Active Crop', content: 'No Active Crops Yet', isList: false, subtext: 'Assign a crop to a zone to get started.' };

  }, [selectedZoneId, zones, zoneCrops, cropCatalog]);

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md flex flex-col justify-between h-full">
      <div>
        <p className="text-sm font-medium text-text-light-secondary dark:text-dark-secondary">{cardContent.title}</p>
        {cardContent.isList ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {(cardContent.content as string[]).map(cropName => (
              <span key={cropName} className="bg-slate-200 dark:bg-slate-700 text-sm font-medium px-2.5 py-1 rounded-full">
                {cropName}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-3xl font-bold text-black dark:text-white truncate" title={cardContent.content as string}>{cardContent.content as string}</p>
        )}
      </div>
      <p className="text-xs text-text-light-secondary dark:text-dark-secondary mt-2">{cardContent.subtext}</p>
    </div>
  );
};

interface DashboardProps {
  t: TFunction;
}

const Dashboard: React.FC<DashboardProps> = ({ t }) => {
  const { farms, zones, readings, equipments, readingTypes, selectedFarmId, zoneCrops, cropCatalog } = useFarm();
  const [selectedZoneId, setSelectedZoneId] = useState<string | 'all'>('all');
  
  const [displayTemp, setDisplayTemp] = useState('24.5');
  const [displayMoisture, setDisplayMoisture] = useState('45.2');
  const [displayHumidity, setDisplayHumidity] = useState('60.0');

  const selectedFarm = useMemo(() => farms.find(f => f.id === selectedFarmId), [farms, selectedFarmId]);
  const selectedZone = useMemo(() => zones.find(z => z.id === selectedZoneId), [zones, selectedZoneId]);

  const filteredEquipments = useMemo(() => {
    if (selectedZoneId === 'all') return equipments;
    return equipments.filter(eq => eq.zoneId === selectedZoneId);
  }, [equipments, selectedZoneId]);

  const filteredReadings = useMemo(() => {
    if (filteredEquipments.length === 0) return [];
    const relevantEquipmentIds = new Set(filteredEquipments.map(eq => eq.id));
    return readings.filter(r => relevantEquipmentIds.has(r.equipmentId));
  }, [readings, filteredEquipments]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTemp(prev => (parseFloat(prev) + (Math.random() - 0.5) * 0.2).toFixed(1));
      setDisplayMoisture(prev => (parseFloat(prev) + (Math.random() - 0.5) * 0.3).toFixed(1));
      setDisplayHumidity(prev => (parseFloat(prev) + (Math.random() - 0.5) * 0.4).toFixed(1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const moistureHistory = useMemo(() => {
    const soilType = readingTypes.find(rt => rt.code === ReadingTypeCode.SoilMoisture);
    const realHistory = filteredReadings
      .filter(r => filteredEquipments.some(eq => eq.id === r.equipmentId && (eq.readingTypeId === soilType?.id || (r as any).readingType === soilType?.id)))
      .slice(-24)
      .map(r => ({ time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: r.value }));

    if (realHistory.length > 5) {
      return realHistory;
    } else {
      const data = [];
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000);
          // eslint-disable-next-line react-hooks/purity
          const randomValue = 30 + Math.random() * 30 + Math.sin(i / 3) * 10;
          data.push({
              time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              value: Number(randomValue.toFixed(1))
          });
      }
      return data;
    }
  }, [filteredReadings, filteredEquipments, readingTypes]);

  if (!selectedFarm) {
    return (
      <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl shadow-md">
        <h3 className="text-xl font-semibold">Welcome to your Smart Agriculture Dashboard!</h3>
        <p className="text-text-light-secondary dark:text-dark-secondary mt-2">
          Select a farm from the header to view its data, or create one to get started.
        </p>
        <button className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors">
          Go to Farm Management
        </button>
      </div>
    );
  }

  const chartTitle = selectedZoneId === 'all' 
    ? t('dashboard.soilMoistureTrend') 
    : `${selectedZone?.name || 'Zone'}: Soil Moisture Trend`;

  return (
    <div className="space-y-6">
      <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-md flex items-center gap-4">
        <label htmlFor="zone-filter" className="font-medium text-black dark:text-white">View Data For:</label>
        <select
          id="zone-filter"
          value={selectedZoneId}
          onChange={(e) => setSelectedZoneId(e.target.value)}
          className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="all">All Zones (Farm-Wide)</option>
          {zones.map(zone => (
            <option key={zone.id} value={zone.id}>{zone.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SensorCard title={t('dashboard.temperature')} value={`${displayTemp}°C`} icon="temp" status="good" />
        <SensorCard title={t('dashboard.soilMoisture')} value={`${displayMoisture}%`} icon="moisture" status="good" />
        <SensorCard title={t('dashboard.humidity')} value={`${displayHumidity}%`} icon="humidity" status="good" />
        <SensorCard title={t('dashboard.activeZones')} value={`${zones.length}`} icon="zone" status="good" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartComponent title={chartTitle} data={moistureHistory} dataKey="value" color="#3b82f6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <WeatherCard />
            <ActiveCropCard 
              selectedZoneId={selectedZoneId}
              zones={zones}
              zoneCrops={zoneCrops}
              cropCatalog={cropCatalog}
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <AIReportPanel t={t} selectedZoneId={selectedZoneId} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;