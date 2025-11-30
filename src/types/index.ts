/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface User {
  id: string;          
  username: string;    
  email: string;
  usertype: string;    
  roles: string[];    
  avatarUrl?: string;  
}

export interface Farm {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lon: number;
    address: string;
  };
  code: string;
  ownerUserId: string;
}

export enum ReadingTypeCode {
  SoilMoisture = 'SOIL_MOISTURE',
  SoilPH = 'SOIL_PH',
  Temperature = 'TEMPERATURE',
  AmbientHumidity = 'AMBIENT_HUMIDITY',
  WaterUsage = 'WATER_USAGE'
}

export interface ReadingType {
  id: string; 
  code: string;
  category: string;
  displayname: string; 
  unit: string;
}

export interface CropStageRequirement {
  id: string;
  readingtypecode: string;
  readingtypename: string;
  unit: string;
  minvalue: number;
  maxvalue: number;
  optimalmin: number;
  optimalmax: number;
}

export interface CropGrowthStage {
  id: string;
  stagename: string;
  order: number;
  durationdays: number;
  description: string;
  requirements: any[]; 
}

export interface CropSeason {
  id: string;
  seasonname: string;
  plantingstartmonth: number;
  expectedrangedays: string;
}

export interface Crop {
  id: string;
  name: string;
  growthstages?: CropGrowthStage[]; 
  seasons?: CropSeason[];

  // Added optional fields for UI helper logic if API doesn't send them in list
  optimalTemp?: { min: number, max: number };
  optimalHum?: { min: number, max: number };
  optimalMoisture?: { min: number, max: number };
  growthDurationDays?: number;
}

export interface ZoneCrop {
  id: string; 
  zoneId: string; 
  cropId: string; 
  plantedAt: string;
  expectedHarvestAt?: string;
  currentStageId?: number; 
  isActive: boolean;
  actualHarvestAt?: string;
  yieldWeightKg?: number;
}

export interface Zone {
  id: string; 
  farmId: string; 
  name: string;
  area: number;
  soilType: string;
}

export enum EquipmentStatus {
  Active = 'Active',
  Fault = 'Fault',
  Inactive = 'Inactive',
}

export interface Equipment {
  id: string;
  zoneid: string;
  readingtypeid: string;
  serialnumber: string;
  equipmentmodel: string;
  installationdate: string;
  isactive: boolean;
  name?: string; 
  readingtypename?: string; 
  status?: EquipmentStatus; 
}

export interface SensorReading {
  id: string;
  equipmentid: string; 
  value: number;
  timestamp: string;
  readingtype: string;
}

export enum ThresholdType {
  BelowMin = 'BelowMin',
  AboveMax = 'AboveMax',
}

export enum AlertSeverity {
  Critical = 'Critical',
  Warning = 'Warning',
  Info = 'Info'
}

export interface Alert {
  id: string;
  zoneid: string;
  equipmentid: string;
  cropid: string;
  cropname: string;
  cropgrowthstageid: string;
  stagename: string;
  readingtypeid: string;
  readingtypename: string;
  value: number;
  alerttype: string;
  message: string;
  severity: string;
  timestamp: string;
  isAcknowledged: boolean;
  resolvedat: string;
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

export interface AppContext {
  crops: Crop[];
  readingTypes: ReadingType[];
  t: TFunction;
}

export interface AIRecommendation {
  overallHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  summary: string;
  irrigation: {
    status: string;
    recommendations: string[];
  };
  fertilization: {
    status: string;
    recommendations: string[];
  };
  cropHealth: {
    status: string;
    issues: string[];
    recommendations: string[];
  };
  equipment: {
    status: string;
    issues: string[];
  };
  alerts: {
    critical: number;
    recommendations: string[];
  };
  nextActions: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export interface RegisterResult {
  token: string;
  user: User;
}

// Request DTOs
export interface CreateFarmRequest {
  name: string;
  description: string;
  location: {
    address: string;
    lat: number;
    lon: number;
  };
  code: string;
  ownerUserId: number;
}

export interface UpdateFarmRequest {
  id: number;
  name?: string;
  description?: string;
  location?: {
    address?: string;
    lat?: number;
    lon?: number;
  };
  code?: string;
}

export interface CreateZoneRequest {
  name: string;
  area: number;
  soilType: string;
  farmId: number;
}

export interface UpdateZoneRequest {
  id: number;
  name?: string;
  area?: number;
  soilType?: string;
}

export interface ZoneCropRequest {
  zoneId: number;
  cropId: number;
  currentStageId: number;
  plantedAt: string;
  expectedHarvestAt: string;
  isActive: boolean;
  yieldWeightKg?: number;
  actualHarvestAt?: string;
}

export interface UpdateZoneCropRequest {
  id: number;
  zoneId?: number;
  cropId?: number;
  currentStageId?: number;
  plantedAt?: string;
  expectedHarvestAt?: string;
  isActive?: boolean;
  yieldWeightKg?: number;
  actualHarvestAt?: string;
}

