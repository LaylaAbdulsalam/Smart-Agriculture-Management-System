export const API_CONFIG = {
  BASE_URL: '', 
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/Auth/login',
    REGISTER: '/api/Auth/register',
    VERIFY_EMAIL: '/api/Auth/email/verify',
    RESEND_VERIFY_OTP: '/api/Auth/email/resend-otp',
    LOGOUT: '/api/Auth/logout',
    ME: '/api/Auth/me',
  },
 FARMS: {
    LIST: '/api/farms/list',
    GET: '/api/farms/get-farm',
    CREATE: '/api/farms/create',
    UPDATE: '/api/farms/update',
    DELETE: '/api/farms/delete',
  },
  ZONES: {
    LIST_BY_FARM: '/api/farm-zones',
    CREATE: '/api/create',
    UPDATE: '/api/update',
    DELETE: '/api/delete',
  },
  EQUIPMENTS: {
    LIST: '/api/equipments/list',
    GET: '/api/equipments/get',
    CREATE: '/api/equipments/create',
    UPDATE: '/api/equipments/update',
    DELETE: '/api/equipments/delete',
  },
  ALERTS: {
    LIST: '/api/alerts/list',
    RESOLVE: '/api/alerts/resolve',
  },
  CROPS: {
    LIST: '/api/crops/list',
    GET_CROP: '/api/crops/get-crop',
  },
  ZONE_CROPS: {
    LIST: '/api/zone-crops/list',
    CREATE: '/api/zone-crops/create',
    UPDATE: '/api/zone-crops/update',
  },
  READINGS: {
    LIST: '/api/sensor-readings/list',
  },

  READING_TYPES: {
    LIST: '/api/readingtypes/list',
    GET: '/api/readingtypes/get-readingtype',
    CREATE: '/api/readingtypes/create',
    UPDATE: '/api/readingtypes/update',
    DELETE: '/api/readingtypes/delete',
  },  

};