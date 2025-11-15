import { Farm, Zone, Crop, ReadingType, Equipment, ZoneCrop, Alert, Report, ReadingTypeCode, EquipmentStatus, ThresholdType, CropGrowthStage, User } from '../types';

// --- SIMULATED BACKEND DATABASE ---
const DB: {
    users: User[];
    farms: Farm[];
    zones: Zone[];
    zoneCrops: ZoneCrop[];
    equipments: Equipment[];
    alerts: Alert[];
    reports: Report[];
    readingTypes: ReadingType[];
    cropCatalog: Crop[];
} = {
    users: [
        { id: 1, name: 'Layla Abdulsalam', email: 'layla.abdulsalam@smartagri.com', role: 'Farm Owner', avatarUrl: '' }
    ],
    farms: [],
    zones: [],
    zoneCrops: [],
    equipments: [],
    alerts: [],
    reports: [],
    readingTypes: [
        { id: 1, code: ReadingTypeCode.SoilMoisture, displayName: 'Soil Moisture', unit: '%' },
        { id: 2, code: ReadingTypeCode.SoilPH, displayName: 'Soil pH', unit: '' },
        { id: 3, code: ReadingTypeCode.Temperature, displayName: 'Temperature', unit: 'C' },
        { id: 4, code: ReadingTypeCode.AmbientHumidity, displayName: 'Ambient Humidity', unit: '%' },
    ],
    cropCatalog: [
         {
            id: 1, name: 'Tomato', seasons: [
                { id: 1, cropId: 1, name: 'Summer', stages: [
                    { id: 1, cropSeasonId: 1, name: 'Germination', durationDays: 10, order: 1, requirements: [
                        { id: 1, stageId: 1, readingTypeId: 1, minValue: 55, maxValue: 75, optimalMin: 60, optimalMax: 70}, // Moisture
                        { id: 2, stageId: 1, readingTypeId: 3, minValue: 18, maxValue: 30, optimalMin: 22, optimalMax: 26}, // Temp
                    ]},
                    { id: 2, cropSeasonId: 1, name: 'Vegetative', durationDays: 30, order: 2, requirements: [
                        { id: 3, stageId: 2, readingTypeId: 1, minValue: 50, maxValue: 70, optimalMin: 55, optimalMax: 65}, // Moisture
                        { id: 4, stageId: 2, readingTypeId: 3, minValue: 20, maxValue: 32, optimalMin: 24, optimalMax: 28}, // Temp
                    ]},
                    { id: 3, cropSeasonId: 1, name: 'Flowering', durationDays: 20, order: 3, requirements: [
                        { id: 5, stageId: 3, readingTypeId: 1, minValue: 60, maxValue: 80, optimalMin: 65, optimalMax: 75},
                        { id: 6, stageId: 3, readingTypeId: 3, minValue: 22, maxValue: 34, optimalMin: 25, optimalMax: 30},
                    ]},
                     { id: 4, cropSeasonId: 1, name: 'Fruiting', durationDays: 30, order: 4, requirements: [
                        { id: 7, stageId: 4, readingTypeId: 1, minValue: 65, maxValue: 85, optimalMin: 70, optimalMax: 80},
                        { id: 8, stageId: 4, readingTypeId: 3, minValue: 24, maxValue: 35, optimalMin: 26, optimalMax: 32},
                    ]},
                ]}
            ]
        },
        {
            id: 2, name: 'Corn', seasons: [
                 { id: 2, cropId: 2, name: 'Summer', stages: [
                    { id: 5, cropSeasonId: 2, name: 'Planting', durationDays: 7, order: 1, requirements: [
                         { id: 9, stageId: 5, readingTypeId: 1, minValue: 60, maxValue: 80, optimalMin: 65, optimalMax: 75},
                         { id: 10, stageId: 5, readingTypeId: 3, minValue: 15, maxValue: 25, optimalMin: 18, optimalMax: 22},
                    ]},
                    { id: 6, cropSeasonId: 2, name: 'Tasseling', durationDays: 40, order: 2, requirements: [
                         { id: 11, stageId: 6, readingTypeId: 1, minValue: 65, maxValue: 85, optimalMin: 70, optimalMax: 80},
                         { id: 12, stageId: 6, readingTypeId: 3, minValue: 20, maxValue: 33, optimalMin: 24, optimalMax: 30},
                    ]},
                 ]}
            ]
        }
    ],
};

const simulateApi = <T,>(data: T, delay = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

// --- HELPER FUNCTIONS ---
export function findCrop(cropId: number) {
    return DB.cropCatalog.find(c => c.id === cropId);
}
export function findStage(crop: Crop | undefined, stageId: number) {
    if (!crop) return null;
    for (const season of crop.seasons) {
        const stage = season.stages.find(s => s.id === stageId);
        if (stage) return stage;
    }
    return null;
}
export function findRequirements(stage: CropGrowthStage | null, readingTypeId: number) {
    if (!stage) return null;
    return stage.requirements.find(r => r.readingTypeId === readingTypeId) || null;
}

// --- STATIC DATA API ---
export const getCropCatalog = () => simulateApi(DB.cropCatalog);
export const getReadingTypes = () => simulateApi(DB.readingTypes);
export const getUser = (userId: number) => simulateApi(DB.users.find(u => u.id === userId));

// --- FARM API ---
export const getFarms = (userId: number) => simulateApi(DB.farms.filter(f => f.ownerUserId === userId));
export const createFarm = (farmData: Omit<Farm, 'id'>) => {
    const newFarm = { ...farmData, id: Date.now() };
    DB.farms.push(newFarm);
    return simulateApi(newFarm);
};
export const updateFarm = (farmId: number, updates: Partial<Farm>) => {
    const farmIndex = DB.farms.findIndex(f => f.id === farmId);
    if (farmIndex === -1) return Promise.reject('Farm not found');
    DB.farms[farmIndex] = { ...DB.farms[farmIndex], ...updates };
    return simulateApi(DB.farms[farmIndex]);
};
export const deleteFarm = (farmId: number) => {
    DB.farms = DB.farms.filter(f => f.id !== farmId);
    // Also delete associated zones, equipment, etc.
    const farmZones = DB.zones.filter(z => z.farmId === farmId).map(z => z.id);
    DB.zones = DB.zones.filter(z => z.farmId !== farmId);
    DB.equipments = DB.equipments.filter(e => !farmZones.includes(e.zoneId));
    return simulateApi({ success: true });
};

// --- ZONE API ---
export const getZonesByFarm = (farmId: number) => simulateApi(DB.zones.filter(z => z.farmId === farmId));
export const createZone = (zoneData: Omit<Zone, 'id'>) => {
    const newZone = { ...zoneData, id: Date.now() };
    DB.zones.push(newZone);
    return simulateApi(newZone);
};
export const updateZone = (zoneId: number, updates: Partial<Zone>) => {
    const zoneIndex = DB.zones.findIndex(z => z.id === zoneId);
    if (zoneIndex === -1) return Promise.reject('Zone not found');
    DB.zones[zoneIndex] = { ...DB.zones[zoneIndex], ...updates };
    return simulateApi(DB.zones[zoneIndex]);
};
export const deleteZone = (zoneId: number) => {
    DB.zones = DB.zones.filter(z => z.id !== zoneId);
    DB.equipments = DB.equipments.filter(e => e.zoneId !== zoneId);
    return simulateApi({ success: true });
};

// --- EQUIPMENT API ---
export const getEquipmentsByFarm = (farmId: number) => {
    const farmZoneIds = DB.zones.filter(z => z.farmId === farmId).map(z => z.id);
    return simulateApi(DB.equipments.filter(e => farmZoneIds.includes(e.zoneId)));
};
export const createEquipment = (equipmentData: Omit<Equipment, 'id' | 'lastReadingAt'>) => {
    const newEquipment = { ...equipmentData, id: Date.now(), lastReadingAt: new Date().toISOString() };
    DB.equipments.push(newEquipment);
    return simulateApi(newEquipment);
};
export const updateEquipment = (equipmentId: number, updates: Partial<Equipment>) => {
    const eqIndex = DB.equipments.findIndex(e => e.id === equipmentId);
    if (eqIndex === -1) return Promise.reject('Equipment not found');
    DB.equipments[eqIndex] = { ...DB.equipments[eqIndex], ...updates };
    return simulateApi(DB.equipments[eqIndex]);
};
export const deleteEquipment = (equipmentId: number) => {
    DB.equipments = DB.equipments.filter(e => e.id !== equipmentId);
    return simulateApi({ success: true });
};


// --- CROP ASSIGNMENT (ZoneCrop) API ---
export const getZoneCropsByFarm = (farmId: number) => {
    const farmZoneIds = DB.zones.filter(z => z.farmId === farmId).map(z => z.id);
    return simulateApi(DB.zoneCrops.filter(zc => farmZoneIds.includes(zc.zoneId)));
};
export const assignCropToZone = (zoneCropData: Omit<ZoneCrop, 'id'>) => {
    // Deactivate any other active crop in the same zone
    DB.zoneCrops.forEach(zc => {
        if (zc.zoneId === zoneCropData.zoneId && zc.isActive) {
            zc.isActive = false;
        }
    });
    const newZoneCrop = { ...zoneCropData, id: Date.now() };
    DB.zoneCrops.push(newZoneCrop);
    return simulateApi(newZoneCrop);
};

export const updateZoneCrop = (zoneCropId: number, updates: Partial<ZoneCrop>) => {
    const zcIndex = DB.zoneCrops.findIndex(zc => zc.id === zoneCropId);
    if (zcIndex === -1) return Promise.reject('ZoneCrop not found');
    
    // If this crop is being activated, deactivate others in the same zone
    if (updates.isActive === true) {
        const zoneId = DB.zoneCrops[zcIndex].zoneId;
        DB.zoneCrops.forEach(zc => {
            if (zc.zoneId === zoneId && zc.id !== zoneCropId) {
                zc.isActive = false;
            }
        });
    }

    DB.zoneCrops[zcIndex] = { ...DB.zoneCrops[zcIndex], ...updates };
    return simulateApi(DB.zoneCrops[zcIndex]);
};


// --- ALERT API ---
export const getAlertsByFarm = (farmId: number) => {
     const farmZoneIds = DB.zones.filter(z => z.farmId === farmId).map(z => z.id);
     return simulateApi(DB.alerts.filter(a => farmZoneIds.includes(a.zoneId)));
};
export const acknowledgeAlert = (alertId: number) => {
    const alertIndex = DB.alerts.findIndex(a => a.id === alertId);
    if (alertIndex === -1) return Promise.reject('Alert not found');
    DB.alerts[alertIndex].isAcknowledged = true;
    return simulateApi(DB.alerts[alertIndex]);
};
export const addAlert = (alert: Omit<Alert, 'id'>) => {
    const newAlert = { ...alert, id: Date.now() };
    DB.alerts.push(newAlert);
    return newAlert;
};

// --- REPORT API ---
export const getReportsByFarm = (farmId: number) => {
    return simulateApi(DB.reports.filter(r => r.farmId === farmId));
};
export const generateReport = (farmId: number) => {
    const newReport: Report = {
        id: `REP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Weekly Summary',
        author: 'System',
        farmId: farmId
    };
    DB.reports.push(newReport);
    return simulateApi(newReport);
}