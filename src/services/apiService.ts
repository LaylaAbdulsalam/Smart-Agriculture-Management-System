/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from './httpClient';
import { API_ENDPOINTS } from '../config/api.config';
import { User, Farm, Zone, Crop, Equipment, Alert, ZoneCrop, ReadingType, SensorReading, EquipmentStatus, CropGrowthStage, AlertSeverity } from '../types';

// --- DTO Interfaces ---
interface FarmDto { id: string; name: string; code: string; lat: number; lon: number; address: string; ownerid: string; ownername: string; zonescount: number; activecropscount: number; }
interface ZoneDto { id: string; name: string; area: number; soiltype: string; farmid: string; equipmentscount: number; }
interface EquipmentDto { id: string; zoneid: string; readingtypeid: string; readingtypename: string; equipmentmodel: string; serialnumber: string; isactive: boolean; installationdate: string; }
interface AlertDto { id: string; zoneid: string; equipmentid: string; cropid: string; cropname: string; cropgrowthstageid: string; stagename: string; readingtypeid: string; readingtypename: string; value: number; alerttype: string; message: string; severity: string; timestamp: string; isresolved: boolean; resolvedat: string; }
interface ZoneCropDto { id: string; zoneid: string; cropid: string; cropname: string; stagename: string; plantingdate: string; isactive: boolean; cropgrowthstageid: string; }
interface SensorReadingDto { id: string; equipmentid: string; value: number; timestamp: string; readingtype: string; }

// --- Request Interfaces ---
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { FullName: string; email: string; password: string; PhoneNumber: string; }
export interface OtpVerificationRequest { email: string; otp: string; }
export interface AuthResponse { auth: { token: string }; user: User; }

// --- Mappers ---
const mapFarm = (dto: FarmDto): Farm | null => {
  if (!dto.id) { return null; }
  return {
    id: dto.id,
    name: dto.name,
    location: { address: dto.address, lat: dto.lat, lon: dto.lon },
    ownerUserId: dto.ownerid,
    code: dto.code,
    description: `Active Zones: ${dto.zonescount}, Crops: ${dto.activecropscount}`
  };
};

const mapZone = (dto: ZoneDto): Zone => ({
  id: dto.id,
  farmId: dto.farmid,
  name: dto.name,
  area: dto.area,
  soilType: dto.soiltype
});

const mapEquipment = (dto: EquipmentDto): Equipment => ({
  id: dto.id,
  zoneId: dto.zoneid,
  readingTypeId: dto.readingtypeid,
  serialNumber: dto.serialnumber,
  model: dto.equipmentmodel,
  lastReadingAt: dto.installationdate, 
  name: dto.equipmentmodel, 
  status: dto.isactive ? EquipmentStatus.Active : EquipmentStatus.Inactive,
  readingTypeName: dto.readingtypename
});

const mapAlert = (dto: AlertDto): Alert => ({
  id: dto.id,
  zoneId: dto.zoneid,
  equipmentId: dto.equipmentid,
  cropId: dto.cropid,
  cropName: dto.cropname,
  stageName: dto.stagename,
  readingTypeId: dto.readingtypeid,
  readingTypeName: dto.readingtypename,
  value: dto.value,
  message: dto.message,
  severity: dto.severity as AlertSeverity,
  timestamp: dto.timestamp,
  isAcknowledged: dto.isresolved,
});

const mapSensorReading = (dto: SensorReadingDto): SensorReading => ({
  id: dto.id,
  equipmentId: dto.equipmentid, 
  value: dto.value,
  timestamp: dto.timestamp,
  readingType: dto.readingtype 
});

// --- Auth Services ---
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await httpClient.post<any>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    if (response && response.auth && response.user && response.auth.token) {
        localStorage.setItem('authToken', response.auth.token);
        return {
          auth: { token: response.auth.token },
          user: response.user, 
        };
    }
    throw new Error(response.message || "Login failed: Invalid data from server.");
};

export const register = async (data: RegisterRequest): Promise<any> => {
  return httpClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
};

export const verifyOtp = async (data: OtpVerificationRequest): Promise<any> => {
    try {
        console.log("Trying Login Verify Endpoint...");
        return await httpClient.post('/api/Auth/login/verify', { 
          email: data.email, 
          otp: data.otp 
        });
      } catch (error: any) {
        console.warn("Login Verify failed, trying Email Verify Endpoint...", error);
        return await httpClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { 
          email: data.email, 
          code: data.otp 
        });
      }
};

export const resendOtp = async (email: string): Promise<any> => {
  return httpClient.post(`${API_ENDPOINTS.AUTH.RESEND_VERIFY_OTP}?email=${email}`);
};

export const logout = async (): Promise<void> => {
  await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  localStorage.removeItem('authToken');
};

export const getCurrentUser = async (): Promise<User> => {
  return httpClient.get<User>(API_ENDPOINTS.AUTH.ME);
};

// --- Farm Services ---
export const getFarms = async (): Promise<Farm[]> => {
  const response = await httpClient.get<any>(API_ENDPOINTS.FARMS.LIST);
  if (response && Array.isArray(response.farms)) {
    return response.farms.map(mapFarm).filter(Boolean) as Farm[];
  }
  return [];
};

export const createFarm = async (farmData: any): Promise<Farm> => {
  const payload = {
    name: farmData.name,
    code: farmData.code || `F-${Date.now()}`,
    lat: farmData.location?.lat || 0,
    lon: farmData.location?.lon || 0,
    address: farmData.location?.address || '',
    OwnerId: String(farmData.ownerUserId)
  };
  const response = await httpClient.post<FarmDto>(API_ENDPOINTS.FARMS.CREATE, payload);
  const mappedFarm = mapFarm(response);
  if (!mappedFarm) throw new Error("Create farm failed: Invalid data from server");
  return mappedFarm;
};

export const updateFarm = async (id: string, farmData: any): Promise<Farm> => {
  const payload = { ...farmData, id: id };
  const response = await httpClient.put<FarmDto>(`${API_ENDPOINTS.FARMS.UPDATE}?id=${id}`, payload);
  const mappedFarm = mapFarm(response);
  if (!mappedFarm) throw new Error("Update farm failed: Invalid data from server");
  return mappedFarm;
};

export const deleteFarm = async (id: string): Promise<void> => {
  return httpClient.delete(`${API_ENDPOINTS.FARMS.DELETE}?id=${id}`);
};

// --- Zone Services ---
export const getZonesByFarm = async (farmId: string): Promise<Zone[]> => {
  const response = await httpClient.get<any>(`${API_ENDPOINTS.ZONES.LIST_BY_FARM}?farmId=${farmId}`);
  if (response && response.zones) {
    return response.zones.map(mapZone);
  }
  return [];
};

export const createZone = async (zoneData: Omit<Zone, 'id'>): Promise<Zone> => {
  const payload = {
    name: zoneData.name,
    area: Number(zoneData.area),
    soiltype: zoneData.soilType,
    farmid: String(zoneData.farmId)
  };
  const response = await httpClient.post<ZoneDto>(API_ENDPOINTS.ZONES.CREATE, payload);
  return mapZone(response);
};

export const updateZone = async (id: string, zoneData: any): Promise<Zone> => {
  const payload = { ...zoneData };
  const response = await httpClient.put<ZoneDto>(`${API_ENDPOINTS.ZONES.UPDATE}?id=${id}`, payload);
  return mapZone(response);
};

export const deleteZone = async (id: string): Promise<void> => {
  return httpClient.delete(`${API_ENDPOINTS.ZONES.DELETE}?id=${id}`);
};

// --- Equipment Services ---
export const getEquipmentByFarm = async (farmId: string): Promise<Equipment[]> => {
  const zones = await getZonesByFarm(farmId);
  if (zones.length === 0) return [];
  const promises = zones.map(zone => 
    httpClient.get<any>(`${API_ENDPOINTS.EQUIPMENTS.LIST}?zoneId=${zone.id}`)
  );
  const responses = await Promise.all(promises);
  let allEquipment: Equipment[] = [];
  responses.forEach(res => {
    if (res && res.equipments) {
      allEquipment = [...allEquipment, ...res.equipments.map(mapEquipment)];
    }
  });
  return allEquipment;
};

export const createEquipment = async (data: any): Promise<Equipment> => {
  const payload = {
    zoneid: String(data.zoneId),            
    readingtypeid: String(data.readingTypeId), 
    serialnumber: data.serialNumber,           
    equipmentmodel: data.model,       
    installationdate: new Date().toISOString(),
    isactive: data.status === 'Active'
  };
  const response = await httpClient.post<EquipmentDto>(API_ENDPOINTS.EQUIPMENTS.CREATE, payload);
  return mapEquipment(response);
};

export const updateEquipment = async (id: string, data: any): Promise<Equipment> => {
  const payload = {
      readingtypeid: String(data.readingTypeId),
      isactive: data.status === EquipmentStatus.Active
  };
  const response = await httpClient.put<EquipmentDto>(`${API_ENDPOINTS.EQUIPMENTS.UPDATE}?id=${id}`, payload);
  return mapEquipment(response);
};

export const deleteEquipment = async (id: string): Promise<void> => {
  return httpClient.delete(API_ENDPOINTS.EQUIPMENTS.DELETE, {
    params: { id: id }
  });
};

// --- Alert Services ---
export const getAlertsByFarm = async (farmId: string): Promise<Alert[]> => {
  try {
    const zones = await getZonesByFarm(farmId);
    if (zones.length === 0) return [];
    const promises = zones.map(zone => 
      httpClient.get<any>(`${API_ENDPOINTS.ALERTS.LIST}?zoneId=${zone.id}`)
    );
    const responses = await Promise.all(promises);
    let allAlerts: Alert[] = [];
    responses.forEach(res => {
      if (res && Array.isArray(res.alerts)) {
        allAlerts = [...allAlerts, ...res.alerts.map(mapAlert)];
      }
    });
    return allAlerts;
  } catch (error) {
    console.error("Failed to fetch alerts by farm:", error);
    return [];
  }
};

export const acknowledgeAlert = async (alertId: string): Promise<Alert> => {
  const updatedAlertDto = await httpClient.patch<any>(`${API_ENDPOINTS.ALERTS.RESOLVE}?id=${alertId}`, {});
  return mapAlert(updatedAlertDto);
};

// --- Reading Services ---
export const getReadingsByEquipment = async (equipmentId: string): Promise<SensorReading[]> => {
    try {
        const response = await httpClient.get<any>(`${API_ENDPOINTS.READINGS.LIST}?equipmentId=${equipmentId}`);
        if (response && Array.isArray(response.readings)) {
            return response.readings.map(mapSensorReading);
        }
        return [];
    } catch (error) {
        console.error(`Failed to fetch readings for equipment ${equipmentId}:`, error);
        return [];
    }
};

// --- Crop Services ---
export const getCropCatalog = async (): Promise<Crop[]> => {
  const response = await httpClient.get<any>(API_ENDPOINTS.CROPS.LIST);
  if (response && response.crops) {
    return response.crops.map((c: any) => ({
        id: c.id,
        name: c.name,
        seasons: []
    }));
  }
  return [];
};

export const getZoneCropsByFarm = async (farmId: string): Promise<ZoneCrop[]> => {
    const zones = await getZonesByFarm(farmId);
    if (zones.length === 0) return [];
    const promises = zones.map(zone => 
      httpClient.get<any>(`${API_ENDPOINTS.ZONE_CROPS.LIST}?zoneId=${zone.id}`)
    );
    const responses = await Promise.all(promises);
    let allZoneCrops: ZoneCrop[] = [];
    responses.forEach(res => {
      if (res && res.zonecrops) {
        const mapped = res.zonecrops.map((zc: ZoneCropDto) => ({
            id: zc.id,
            zoneId: zc.zoneid,
            cropId: zc.cropid,
            cropName: zc.cropname, 
            stageName: zc.stagename, 
            plantedAt: zc.plantingdate,
            isActive: zc.isactive,
            currentStageId: zc.cropgrowthstageid
        }));
        allZoneCrops = [...allZoneCrops, ...mapped];
      }
    });
    return allZoneCrops;
};

export const assignCropToZone = async (data: any): Promise<any> => {
    const payload = {
        zoneid: data.zoneid,
        cropid: data.cropid,
        cropgrowthstageid: data.cropgrowthstageid,
        plantingdate: new Date(data.plantingdate).toISOString().split('T')[0],
        isactive: data.isactive,
    };
    return httpClient.post(API_ENDPOINTS.ZONE_CROPS.CREATE, payload);
};

export const updateZoneCrop = async (id: number, updates: any): Promise<ZoneCrop> => {
    const payload = { 
        cropgrowthstageid: updates.cropgrowthstageid, 
        isactive: updates.isactive 
    };
    const response = await httpClient.put<any>(`${API_ENDPOINTS.ZONE_CROPS.UPDATE}?id=${id}`, payload);
    
    return {
        id: response.id,
        zoneId: response.zoneid,
        cropId: response.cropid,
        isActive: response.isactive,
        plantedAt: response.plantingdate,
        currentStageId: response.cropgrowthstageid,
        cropName: response.cropname,
        stageName: response.stagename
    };
};

export const getCropDetails = async (cropId: string): Promise<Crop | null> => {
  try {
    const response = await httpClient.get<any>(`${API_ENDPOINTS.CROPS.GET_CROP}?id=${cropId}`);
    if (!response) return null;
    return {
      ...response,
      growthStages: response.growthstages || response.growthStages 
    };
  } catch (error) {
    console.error(`Failed to fetch details for crop ${cropId}:`, error);
    return null;
  }
};

export const getReadingTypes = async (): Promise<ReadingType[]> => {
  try {
    const response = await httpClient.get<any>('/api/ReadingTypes/list'); 
    if (response && Array.isArray(response.readingtypes)) {
      return response.readingtypes.map((rt: any) => ({
        id: rt.id,
        code: rt.code,
        category: rt.category,
        displayName: rt.displayname, 
        unit: rt.unit,
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch reading types:", error);
    return [];
  }
};

// --- Mock Reports & Analytics ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getReportsByFarm = async (farmId: string): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        { id: 'RPT-001', date: new Date(Date.now() - 86400000 * 1).toISOString(), type: 'Daily Water Usage', author: 'System AI' },
        { id: 'RPT-002', date: new Date(Date.now() - 86400000 * 2).toISOString(), type: 'Soil Health Analysis', author: 'Dr. Ahmed (Consultant)' },
    ];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generateReport = async (farmId: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
        id: `RPT-${Math.floor(Math.random() * 1000)}`, 
        date: new Date().toISOString(), 
        type: 'On-Demand Analysis', 
        author: 'User Request' 
    };
};

// --- Helper Functions ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function findCrop(cropId: string): Crop | undefined {
  return undefined;
}

export function findStage(crop: Crop | undefined, stageId: string | number): CropGrowthStage | null {
  if (!crop || !crop.growthStages) {
    return null;
  }
  const stageIdAsString = stageId.toString();
  const stage = crop.growthStages.find(s => s.id === stageIdAsString);
  return stage || null;
}

export function findRequirements(stage: any, readingTypeId: number) {
  if (!stage || !stage.requirements) return null;
  return stage.requirements.find((r: any) => r.readingTypeId === readingTypeId) || null;
}