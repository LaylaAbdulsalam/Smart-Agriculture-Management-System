/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { TFunction, ReadingTypeCode } from '../types';
import { useFarm } from '../contexts/FarmContext';
import SensorCard from '../components/SensorCard';
import AIReportPanel from '../components/AIPanel';
import ChartComponent from '../components/ChartComponent';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  t: TFunction;
}

const Dashboard: React.FC<DashboardProps> = ({ t }) => {
  const { farms, zones, readings, equipments, readingTypes, selectedFarmId } = useFarm();
  const navigate = useNavigate();
  const [moistureHistory, setMoistureHistory] = useState<any[]>([]);

  const selectedFarm = farms.find(f => f.id === selectedFarmId);

  useEffect(() => {
    const timer = setTimeout(() => {
        const soilType = readingTypes.find(rt => rt.code === ReadingTypeCode.SoilMoisture);
        
        const realHistory = readings
        .filter(r => equipments.some(eq => 
            eq.id === r.equipmentId && 
            (eq.readingTypeId === soilType?.id || r.readingType === soilType?.id)
        ))
        .slice(-24)
        .map(r => ({ 
            time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            value: r.value 
        }));

        if (realHistory.length > 0) {
            setMoistureHistory(realHistory);
        } else {
            const data = [];
            const now = new Date();
            for (let i = 23; i >= 0; i--) {
                const time = new Date(now.getTime() - i * 60 * 60 * 1000);
                const randomValue = 30 + Math.random() * 30 + Math.sin(i / 3) * 10;
                data.push({
                    time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    value: Number(randomValue.toFixed(1))
                });
            }
            setMoistureHistory(data);
        }
    }, 0);

    return () => clearTimeout(timer);
  }, [readings, equipments, readingTypes]);

  const getAverageForType = (typeCode: ReadingTypeCode) => {
    const type = readingTypes.find(rt => rt.code === typeCode);
    
    const mockDefaults: Record<string, {val: string, unit: string}> = {
        [ReadingTypeCode.Temperature]: { val: '24.5', unit: '°C' },
        [ReadingTypeCode.SoilMoisture]: { val: '45.2', unit: '%' },
        [ReadingTypeCode.AmbientHumidity]: { val: '60.0', unit: '%' },
    };

    if (!type) {
        return { value: mockDefaults[typeCode]?.val || '0', unit: mockDefaults[typeCode]?.unit || '' };
    }

    const relevantEquipments = equipments.filter(eq => eq.readingTypeId === type.id);
    const relevantReadings = readings.filter(r => 
      relevantEquipments.some(eq => eq.id === r.equipmentId)
    );
    
    if (relevantReadings.length === 0) {
        return { value: mockDefaults[typeCode]?.val || '0', unit: type.unit };
    }

    const latestReadings = relevantEquipments.map(eq => {
      return readings
        .filter(r => r.equipmentId === eq.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    }).filter(Boolean);

    if (latestReadings.length === 0) return { value: mockDefaults[typeCode]?.val || '0', unit: type.unit };
    
    const sum = latestReadings.reduce((acc, r) => acc + r.value, 0);
    const avg = sum / latestReadings.length;
    return { value: avg.toFixed(1), unit: type.unit };
  };

  const tempAvg = getAverageForType(ReadingTypeCode.Temperature);
  const moistureAvg = getAverageForType(ReadingTypeCode.SoilMoisture);
  const humidityAvg = getAverageForType(ReadingTypeCode.AmbientHumidity);

  if (!selectedFarm) {
    return (
      <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl shadow-md">
        <h3 className="text-xl font-semibold">Welcome to your Smart Agriculture Dashboard!</h3>
        <p className="text-text-light-secondary dark:text-dark-secondary mt-2">
          Select a farm from the header to view its data, or create one to get started.
        </p>
        <button 
          onClick={() => navigate('/farms')} 
          className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors"
        >
          Go to Farm Management
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SensorCard title={t('dashboard.temperature')} value={`${tempAvg.value}${tempAvg.unit}`} icon="temp" status="good" />
        <SensorCard title={t('dashboard.soilMoisture')} value={`${moistureAvg.value}${moistureAvg.unit}`} icon="moisture" status="good" />
        <SensorCard title={t('dashboard.humidity')} value={`${humidityAvg.value}${humidityAvg.unit}`} icon="humidity" status="good" />
        <SensorCard title={t('dashboard.activeZones')} value={`${zones.length || 4}`} icon="zone" status="good" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartComponent title={t('dashboard.soilMoistureTrend')} data={moistureHistory} dataKey="value" color="#3b82f6" />
        </div>
        <div className="lg:col-span-1">
          <AIReportPanel t={t} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;