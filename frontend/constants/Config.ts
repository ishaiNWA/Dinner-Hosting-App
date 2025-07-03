import Constants from 'expo-constants';

// HTTP Methods enum for type safety
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

// Platform enum for type safety
export enum Platform {
  WEB = 'web',
  MOBILE = 'mobile',
}

// Environment detection
const ENV = {
  dev: {
    PLATFORM: Platform.MOBILE,  // Fixed: Added PLATFORM to all environments
    API_URL: 'http://localhost:5000',
    API_TIMEOUT: 10000, // 10 seconds
    DEBUG: true,
  },
  staging: {
    PLATFORM: Platform.MOBILE,  // Fixed: Added PLATFORM
    API_URL: 'https://your-staging-api.com', // Replace when you have staging
    API_TIMEOUT: 15000,
    DEBUG: true,
  },
  prod: {
    PLATFORM: Platform.MOBILE,  // Fixed: Added PLATFORM
    API_URL: 'https://your-production-api.com', // Replace when you deploy
    API_TIMEOUT: 15000,
    DEBUG: false,
  },
};

// Function to get current environment
const getEnvVars = () => {
  // This checks if we're in development mode
  if (__DEV__) {
    return ENV.dev; // Development environment
  }
  
  // You can add logic here to detect staging vs production
  // For now, we'll use production for all non-dev builds
  return ENV.prod;
};

// Export the current environment configuration
const selectedENV = getEnvVars();

export const Config = {
  // API Configuration
  API_URL: selectedENV.API_URL,
  API_TIMEOUT: selectedENV.API_TIMEOUT,
  DEBUG: selectedENV.DEBUG,
  PLATFORM: selectedENV.PLATFORM,
  

  // App Information
  APP_NAME: 'Dinner Hosting App',
  APP_VERSION: Constants.expoConfig?.version || '1.0.0',
  
  // Authentication
  JWT_STORAGE_KEY: 'dinner_app_jwt_token',
  USER_STORAGE_KEY: 'dinner_app_user_data',
  
  // OAuth Configuration
  OAUTH_LOGIN_URL: `${selectedENV.API_URL}/auth/google?platform=mobile`,
  OAUTH_REDIRECT_URL: 'exp://localhost:19000',
  
  // API Endpoints (relative to API_URL)
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/google',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
    },
    
    // Events
    EVENTS: {
      BASE: '/events',
      CREATE: '/events',
      UPDATE: (id: string) => `/events/${id}`,
      DELETE: (id: string) => `/events/${id}`,
      GET_BY_ID: (id: string) => `/events/${id}`,
      SEARCH: '/events/search',
    },
    
    // Bookings
    BOOKINGS: {
      CREATE: '/bookings',
      DELETE: (id: string) => `/bookings/${id}`,
      USER_BOOKINGS: '/bookings/my',
    },
    
    // Users
    USERS: {
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
    },
  },
  
  // UI Configuration
  UI: {
    // Colors (we'll expand this later)
    BRAND_COLOR: '#007AFF',
    
    // Timeouts
    TOAST_DURATION: 3000, // 3 seconds
    DEBOUNCE_DELAY: 500,   // 0.5 seconds for search
    
    // Pagination
    EVENTS_PER_PAGE: 10,
  },

  // Feature Flags (enable/disable features)
  FEATURES: {
    NOTIFICATIONS: true,
    MAPS: true,
    OFFLINE_MODE: false, // For future implementation
  },
  
  // Development helpers
  ...(selectedENV.DEBUG && {
    CURRENT_ENV: __DEV__ ? 'development' : 'production',
    EXPO_VERSION: Constants.expoConfig?.sdkVersion,
  }),
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${Config.API_URL}${endpoint}`;
};

// Helper function for debugging (only works in debug mode)
export const debugLog = (message: string, data?: any) => {
  if (Config.DEBUG) {
    console.log(`[${Config.APP_NAME}] ${message}`, data || '');
  }
};

// define types for the config object
export type ConfigType = typeof Config;
export type EndpointsType = typeof Config.ENDPOINTS; 