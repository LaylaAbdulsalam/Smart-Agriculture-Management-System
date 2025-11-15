export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export type Language = 'en' | 'ar';

export type TFunction = (key: string, replacements?: Record<string, string | number>) => string;

export enum Page {
  Home = 'Home',
  About = 'About',
  Contact = 'Contact',
  PrivacyPolicy = 'PrivacyPolicy',
  Login = 'Login',
  SignUp = 'SignUp',
  Dashboard = 'Dashboard',
  Farms = 'Farms',
  Zones = 'Zones',
  Equipment = 'Equipment',
  Alerts = 'Alerts',
  Reports = 'Reports',
  Settings = 'Settings',
  Profile = 'Profile',
}

export type UserRole = 'Farm Owner' | 'Farm Manager' | 'Farm Worker' | 'Irrigation Engineer' | 'System Admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export interface Farm {
  id: number;
  name: string;
  description: string;
  location: {
      lat: number;
      lon: number;
      address: string;
  };
  code: string;
  ownerUserId: number;
}

export enum ReadingTypeCode {
  SoilMoisture = 'SOIL_MOISTURE',
  SoilPH = 'SOIL_PH',
  Temperature = 'TEMPERATURE',
  AmbientHumidity = 'AMBIENT_HUMIDITY',
  WaterUsage = 'WATER_USAGE'
}

export interface ReadingType {
  id: number;
  code: ReadingTypeCode;
  displayName: string;
  unit: string;
}

export interface CropStageRequirement {
  id: number;
  stageId: number;
  readingTypeId: number;
  minValue: number;
  maxValue: number;
  optimalMin: number;
  optimalMax: number;
}

export interface CropGrowthStage {
  id: number;
  cropSeasonId: number;
  name: string;
  durationDays: number;
  order: number;
  requirements: CropStageRequirement[];
}

export interface CropSeason {
  id: number;
  cropId: number;
  name: string; // "Winter", "Summer"
  stages: CropGrowthStage[];
}

export interface Crop {
  id: number;
  name: string;
  seasons: CropSeason[];
}

export interface ZoneCrop {
  id: number;
  zoneId: number;
  cropId: number;
  plantedAt: string; // ISO Date string
  expectedHarvestAt: string; // ISO Date string
  currentStageId: number;
  isActive: boolean;
  actualHarvestAt?: string;
  yieldWeightKg?: number;
}

export interface Zone {
  id: number;
  farmId: number;
  name: string;
  area: number; // in acres or sqm
  soilType: string;
  activeZoneCrop?: ZoneCrop; // The currently planted crop
}

export enum EquipmentStatus {
  Active = 'Active',
  Fault = 'Fault',
  Inactive = 'Inactive',
}

export interface Equipment {
  id: number;
  zoneId: number;
  serialNumber: string;
  model: string;
  readingTypeId: number;
  status: EquipmentStatus;
  lastReadingAt: string; // ISO Date string
}

export interface SensorReading {
  id: number;
  equipmentId: number;
  value: number;
  timestamp: string; // ISO Date string
}

export enum ThresholdType {
  BelowMin = 'BelowMin',
  AboveMax = 'AboveMax',
}

export interface Alert {
  id: number;
  zoneId: number;
  zoneCropId: number;
  readingTypeId: number;
  stageId: number;
  value: number;
  message: string;
  thresholdType: ThresholdType;
  isAcknowledged: boolean;
  createdAt: string; // ISO Date string
}

export interface Report {
    id: string;
    date: string;
    type: string;
    author: string;
    farmId: number;
}


export interface HistoricalDataPoint {
  time: string;
  value: number;
}

// Utility type for props that are passed down through multiple components
export interface AppContext {
    crops: Crop[];
    readingTypes: ReadingType[];
    t: TFunction;
}
