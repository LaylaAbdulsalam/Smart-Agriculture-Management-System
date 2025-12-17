/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Farm, Zone, ZoneCrop, Equipment, SensorReading, Alert, Crop, ReadingType } from '../types';
import * as api from '../services/apiService';

export interface FarmContextType {
  farms: Farm[];
  selectedFarmId: string | null;
  zones: Zone[];
  zoneCrops: ZoneCrop[];
  equipments: Equipment[];
  readings: SensorReading[];
  alerts: Alert[];
  cropCatalog: Crop[];
  readingTypes: ReadingType[];
  setSelectedFarmId: (id: string | null) => void;
  addFarm: (farmData: Omit<Farm, 'id' | 'ownerUserId' | 'description'>) => Promise<void>;
  updateFarm: (farmId: string, farmData: Partial<Farm>) => Promise<void>;
  deleteFarm: (farmId: string) => Promise<void>;
  addZone: (zoneData: Omit<Zone, 'id'>) => Promise<void>;
  updateZone: (zoneId: string, zoneData: Partial<Zone>) => Promise<void>;
  deleteZone: (zoneId: string) => Promise<void>;
  assignCropToZone: (zoneCropData: Omit<ZoneCrop, 'id'>) => Promise<ZoneCrop>;
  updateZoneCrop: (zoneCropId: string, updates: Partial<ZoneCrop>) => Promise<ZoneCrop>;
  deleteZoneCrop: (zoneCropId: string) => Promise<void>; 
  addEquipment: (equipmentData: any) => Promise<void>;
  updateEquipment: (equipmentId: string, equipmentData: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (equipmentId: string) => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  simulateData: () => void;
  loading: boolean;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};

interface FarmProviderProps {
  children: ReactNode;
  userId: string | null;
}

export const FarmProvider: React.FC<FarmProviderProps> = ({ children, userId }) => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [zoneCrops, setZoneCrops] = useState<ZoneCrop[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [cropCatalog, setCropCatalog] = useState<Crop[]>([]);
  const [readingTypes, setReadingTypes] = useState<ReadingType[]>([]);
  const [loading, setLoading] = useState(false);

  const refetchFarmData = useCallback(async (farmId: string) => {
    setLoading(true);
    try {
      const [farmZones, farmZoneCrops, farmEquipment, farmAlerts] = await Promise.all([
        api.getZonesByFarm(farmId),
        api.getZoneCropsByFarm(farmId),
        api.getEquipmentByFarm(farmId),
        api.getAlertsByFarm(farmId)
      ]);
      setZones(farmZones);
      setZoneCrops(farmZoneCrops);
      setEquipments(farmEquipment);
      setAlerts(farmAlerts);
    } catch (error) {
      console.error('Failed to refetch farm data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [crops, types] = await Promise.all([
          api.getCropCatalog(),
          api.getReadingTypes()
        ]);
        setCropCatalog(crops);
        setReadingTypes(types);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadFarms = async () => {
      if (userId) {
        setLoading(true);
        try {
          const userFarms = await api.getFarms();
          setFarms(userFarms);
        } catch (error) {
          console.error('Failed to load farms:', error);
          setFarms([]);
        } finally {
          setLoading(false);
        }
      } else {
        setFarms([]);
        setSelectedFarmId(null);
      }
    };
    loadFarms();
  }, [userId]);

  useEffect(() => {
    if (selectedFarmId === null && farms.length > 0) {
      setSelectedFarmId(farms[0].id);
    } else if (selectedFarmId !== null && !farms.some(f => f.id === selectedFarmId)) {
        setSelectedFarmId(farms.length > 0 ? farms[0].id : null);
    }
  }, [farms, selectedFarmId]);

  useEffect(() => {
    if (selectedFarmId) {
      refetchFarmData(selectedFarmId);
    } else {
      setZones([]);
      setZoneCrops([]);
      setEquipments([]);
      setAlerts([]);
      setReadings([]);
    }
  }, [selectedFarmId, refetchFarmData]);

  const simulateData = useCallback(() => {
    if (equipments.length === 0) return;
    setReadings(prevReadings => {
      const newReadings: SensorReading[] = [];
      equipments.forEach(eq => {
        if (eq.status !== 'Active') return;
        const lastReading = prevReadings.filter(r => r.equipmentId === eq.id).pop();
        let baseValue = lastReading ? lastReading.value : 50;
        baseValue += (Math.random() - 0.5) * 2;
        const newReading: SensorReading = {
          id: `${eq.id}-${Date.now()}`,
          equipmentId: eq.id,
          value: parseFloat(baseValue.toFixed(1)),
          timestamp: new Date().toISOString(),
          readingType: eq.readingTypeId
        };
        newReadings.push(newReading);
      });
      return [...prevReadings, ...newReadings].slice(-200);
    });
  }, [equipments]);

  useEffect(() => {
    if (selectedFarmId) {
      const interval = setInterval(() => {
        simulateData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedFarmId, simulateData]);

  const addFarm = useCallback(async (farmData: Omit<Farm, 'id' | 'ownerUserId' | 'description'>) => {
    if (!userId) throw new Error('User not logged in');
    const newFarm = await api.createFarm({ ...farmData, ownerUserId: userId });
    setFarms(prev => [...prev, newFarm]);
    setSelectedFarmId(newFarm.id);
  }, [userId]);

  const updateFarm = useCallback(async (farmId: string, farmData: Partial<Farm>) => {
    const updatedFarm = await api.updateFarm(farmId, farmData);
    setFarms(prev => prev.map(f => f.id === farmId ? updatedFarm : f));
  }, []);

  const deleteFarm = useCallback(async (farmId: string) => {
    await api.deleteFarm(farmId);
    setFarms(prev => {
      const remainingFarms = prev.filter(f => f.id !== farmId);
      if (selectedFarmId === farmId) {
        setSelectedFarmId(remainingFarms.length > 0 ? remainingFarms[0].id : null);
      }
      return remainingFarms;
    });
  }, [selectedFarmId]);

  const addZone = useCallback(async (zoneData: Omit<Zone, 'id'>) => {
    if (!selectedFarmId) throw new Error('Farm ID is missing');
    await api.createZone(zoneData);
    await refetchFarmData(selectedFarmId);
  }, [selectedFarmId, refetchFarmData]);

  const updateZone = useCallback(async (zoneId: string, zoneData: Partial<Zone>) => {
    if (!selectedFarmId) return;
    await api.updateZone(zoneId, zoneData);
    await refetchFarmData(selectedFarmId);
  }, [selectedFarmId, refetchFarmData]);

  const deleteZone = useCallback(async (zoneId: string) => {
    if (!selectedFarmId) return;
    await api.deleteZone(zoneId);
    await refetchFarmData(selectedFarmId);
  }, [selectedFarmId, refetchFarmData]);

  const assignCropToZone = useCallback(async (zoneCropData: Omit<ZoneCrop, 'id'>): Promise<ZoneCrop> => {
    if (!selectedFarmId) throw new Error("No selected farm");
    const newZoneCrop = await api.assignCropToZone(zoneCropData);
    await refetchFarmData(selectedFarmId);
    return newZoneCrop;
  }, [selectedFarmId, refetchFarmData]);

  const updateZoneCrop = useCallback(async (zoneCropId: string, updates: Partial<ZoneCrop>): Promise<ZoneCrop> => {
    if (!selectedFarmId) throw new Error("No selected farm");
    const updatedZoneCrop = await api.updateZoneCrop(zoneCropId, updates);
    await refetchFarmData(selectedFarmId);
    return updatedZoneCrop;
  }, [selectedFarmId, refetchFarmData]);
  
  const deleteZoneCrop = useCallback(async (zoneCropId: string) => {
    if (!selectedFarmId) return;
    await api.deleteZoneCrop(zoneCropId);
    await refetchFarmData(selectedFarmId);
  }, [selectedFarmId, refetchFarmData]);

  const addEquipment = useCallback(async (equipmentData: any) => {
    if (!selectedFarmId) return;
    await api.createEquipment(equipmentData);
    await refetchFarmData(selectedFarmId);
  }, [selectedFarmId, refetchFarmData]);

  const updateEquipment = useCallback(async (equipmentId: string, equipmentData: Partial<Equipment>) => {
    if (!selectedFarmId) return;
    await api.updateEquipment(equipmentId, equipmentData);
    await refetchFarmData(selectedFarmId);
  }, [selectedFarmId, refetchFarmData]);

  const deleteEquipment = useCallback(async (equipmentId: string) => {
    if (!selectedFarmId) return;
    await api.deleteEquipment(equipmentId);
    await refetchFarmData(selectedFarmId);
  }, [selectedFarmId, refetchFarmData]);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    if (!selectedFarmId) return;
    await api.acknowledgeAlert(alertId);
    await refetchFarmData(selectedFarmId);
  }, [selectedFarmId, refetchFarmData]);

  const contextValue = useMemo(() => ({
    farms, selectedFarmId, zones, zoneCrops, equipments, readings, alerts,
    cropCatalog, readingTypes, setSelectedFarmId, addFarm, updateFarm, deleteFarm,
    addZone, updateZone, deleteZone, assignCropToZone, updateZoneCrop, deleteZoneCrop,
    addEquipment, updateEquipment, deleteEquipment, acknowledgeAlert, simulateData, loading,
  }), [
    farms, selectedFarmId, zones, zoneCrops, equipments, readings, alerts,
    cropCatalog, readingTypes, loading, addFarm, updateFarm, deleteFarm,
    addZone, updateZone, deleteZone, assignCropToZone, updateZoneCrop, deleteZoneCrop,
    addEquipment, updateEquipment, deleteEquipment, acknowledgeAlert, simulateData
  ]);

  return (
    <FarmContext.Provider value={contextValue}>
      {children}
    </FarmContext.Provider>
  );
};