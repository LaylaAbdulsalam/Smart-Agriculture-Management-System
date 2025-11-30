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
  addFarm: (farmData: Omit<Farm, 'id' | 'ownerUserId'>) => Promise<void>;
  updateFarm: (farmId: string, farmData: Partial<Farm>) => Promise<void>;
  deleteFarm: (farmId: string) => Promise<void>;
  addZone: (zoneData: Omit<Zone, 'id'>) => Promise<void>;
  updateZone: (zoneId: string, zoneData: Partial<Zone>) => Promise<void>;
  deleteZone: (zoneId: string) => Promise<void>;
  assignCropToZone: (zoneCropData: Omit<ZoneCrop, 'id'>) => Promise<ZoneCrop>;
  updateZoneCrop: (zoneCropId: string, updates: Partial<ZoneCrop>) => Promise<ZoneCrop>;
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

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [crops, types] = await Promise.all([
          api.getCropCatalog(),
          api.getReadingTypes()
        ]);
        setCropCatalog(crops);
        setReadingTypes(types);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
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
    const loadFarmData = async () => {
      if (selectedFarmId) {
        setLoading(true);
        setReadings([]); 
        try {
          const [farmZones, farmZoneCrops, farmEquipment, farmAlerts] = await Promise.all([
            api.getZonesByFarm(selectedFarmId),
            api.getZoneCropsByFarm(selectedFarmId),
            api.getEquipmentByFarm(selectedFarmId),
            api.getAlertsByFarm(selectedFarmId)
          ]);
          
          setZones(farmZones);
          setZoneCrops(farmZoneCrops);
          setEquipments(farmEquipment);
          setAlerts(farmAlerts);

          if (farmEquipment.length > 0) {
            const readingPromises = farmEquipment.map(eq => api.getReadingsByEquipment(eq.id));
            const readingsArrays = await Promise.all(readingPromises);
            const allReadings = readingsArrays.flat();
            setReadings(allReadings);
          }

        } catch (error) {
          console.error('Failed to load farm data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setZones([]);
        setZoneCrops([]);
        setEquipments([]);
        setAlerts([]);
        setReadings([]);
      }
    };
    loadFarmData();
  }, [selectedFarmId]);

  const addFarm = useCallback(async (farmData: Omit<Farm, 'id' | 'ownerUserId'>) => {
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
    if (!zoneData.farmId) throw new Error('Farm ID is missing');
    const newZone = await api.createZone(zoneData);
    setZones(prev => [...prev, newZone]);
  }, []);

  const updateZone = useCallback(async (zoneId: string, zoneData: Partial<Zone>) => {
    const updatedZone = await api.updateZone(zoneId, zoneData);
    setZones(prev => prev.map(z => z.id === zoneId ? updatedZone : z));
  }, []);

  const deleteZone = useCallback(async (zoneId: string) => {
    await api.deleteZone(zoneId);
    setZones(prev => prev.filter(z => z.id !== zoneId));
  }, []);

  const assignCropToZone = useCallback(async (zoneCropData: Omit<ZoneCrop, 'id'>): Promise<ZoneCrop> => {
    const newZoneCrop = await api.assignCropToZone(zoneCropData);
    setZoneCrops(prev => [...prev.filter(zc => zc.zoneId !== newZoneCrop.zoneId), newZoneCrop]);
    return newZoneCrop;
  }, []);

  const updateZoneCrop = useCallback(async (zoneCropId: string, updates: Partial<ZoneCrop>): Promise<ZoneCrop> => {
    const updatedZoneCrop = await api.updateZoneCrop(zoneCropId, updates);
    setZoneCrops(prev => prev.map(zc => zc.id === updatedZoneCrop.id ? updatedZoneCrop : zc));
    return updatedZoneCrop;
  }, []);

  const addEquipment = useCallback(async (equipmentData: any) => {
    try {
      const newEquipmentFromApi = await api.createEquipment(equipmentData);
      setEquipments(prev => [...prev, newEquipmentFromApi]);
    } catch (error) {
      console.error('Failed to add equipment:', error);
      throw error;
    }
  }, []);

  const updateEquipment = useCallback(async (equipmentId: string, equipmentData: Partial<Equipment>) => {
    const updatedEquipment = await api.updateEquipment(equipmentId, equipmentData);
    setEquipments(prev => prev.map(e => e.id === equipmentId ? updatedEquipment : e));
  }, []);

  const deleteEquipment = useCallback(async (equipmentId: string) => {
    await api.deleteEquipment(equipmentId);
    setEquipments(prev => prev.filter(e => e.id !== equipmentId));
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    const updatedAlert = await api.acknowledgeAlert(alertId);
    setAlerts(prev => prev.map(a => a.id === alertId ? updatedAlert : a));
  }, []);

  const simulateData = useCallback(() => {
  }, []);

  const contextValue = useMemo(() => ({
    farms,
    selectedFarmId,
    zones,
    zoneCrops,
    equipments,
    readings,
    alerts,
    cropCatalog,
    readingTypes,
    setSelectedFarmId,
    addFarm,
    updateFarm,
    deleteFarm,
    addZone,
    updateZone,
    deleteZone,
    assignCropToZone,
    updateZoneCrop,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    acknowledgeAlert,
    simulateData,
    loading,
  }), [
    farms, selectedFarmId, zones, zoneCrops, equipments, readings, alerts,
    cropCatalog, readingTypes, loading, addFarm, updateFarm, deleteFarm,
    addZone, updateZone, deleteZone, assignCropToZone, updateZoneCrop,
    addEquipment, updateEquipment, deleteEquipment, acknowledgeAlert, simulateData
  ]);

  return (
    <FarmContext.Provider value={contextValue}>
      {children}
    </FarmContext.Provider>
  );
};



