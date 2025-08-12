import Constants from 'expo-constants';
import { ValidUserProfileField } from '@/types/profile-params';


const mandatoryEnvVars = ['EXPO_PUBLIC_API_URL'];

mandatoryEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
});


// HTTP Methods enum for type safety
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

// Environment detection
const ENV = {
  dev: {
    API_URL: process.env.EXPO_PUBLIC_API_URL,  // Use local network IP instead of localhost for mobile
    API_TIMEOUT: 10000, // 10 seconds
    DEBUG: true,
  },
  staging: {
    API_URL: 'https://your-staging-api.com', // Replace when you have staging
    API_TIMEOUT: 15000,
    DEBUG: true,
  },
  prod: {
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
  

  // App Information
  APP_NAME: 'Dinner Hosting App',
  APP_VERSION: Constants.expoConfig?.version || '1.0.0',
  
  // Authentication
  JWT_STORAGE_KEY: 'dinner_app_jwt_token',
  USER_STORAGE_KEY: 'dinner_app_user_data',
  
  // OAuth Configuration
  OAUTH_LOGIN_URL: `${selectedENV.API_URL}/api/auth/google`,
  OAUTH_REDIRECT_URL: 'exp://localhost:19000',
  
  // API Endpoints (relative to API_URL)
  ENDPOINTS: {
    // Authentication
    AUTH: {
      COMPLETE_REGISTRATION: `${selectedENV.API_URL}/api/auth/complete-registration`,
      LOGOUT: `${selectedENV.API_URL}/api/auth/logout`,
    },
    
    // Events
    EVENTS: {
      BASE: '/events',
      CREATE: '/api/events',
      FETCH_ALL_PUBLISHED: '/api/events/published',
      UPDATE: (id: string) => `/events/${id}`,
      DELETE: (id: string) => `/events/${id}`,
      GET_BY_ID: (id: string) => `/api/events/published/${id}`,
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
      PROFILE: '/api/user/me',
      UPDATE_PROFILE: '/api/user/me',
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
  
  // Address Service Configuration

    ADDRESS_SERVICE_BASE_URL: 'https://nominatim.openstreetmap.org',

  // Profile Fields Constants
  PROFILE_FIELDS: {
    // Base UserSchema fields
    FIRST_NAME: 'firstName' as ValidUserProfileField,
    LAST_NAME: 'lastName' as ValidUserProfileField,
    EMAIL: 'email' as ValidUserProfileField,
    IS_REGISTRATION_COMPLETE: 'isRegistrationComplete' as ValidUserProfileField,
    ROLE: 'role' as ValidUserProfileField,
    
    // Contact details
    PHONE_NUMBER: 'phoneNumber' as ValidUserProfileField,
    ADDRESS: 'address' as ValidUserProfileField,
    
    // Host-specific fields
    IS_AUTHORIZED_BY_MANAGER: 'isAuthorizedByManager' as ValidUserProfileField,
    PUBLISHED_EVENTS: 'publishedEvents' as ValidUserProfileField,
    
    // Guest-specific fields
    DIETARY_RESTRICTIONS: 'dietaryRestrictions' as ValidUserProfileField,
    ALLERGIES: 'allergies' as ValidUserProfileField,
    UPCOMING_EVENTS: 'upcomingEvents' as ValidUserProfileField,
    EVENT_HISTORY: 'eventHistory' as ValidUserProfileField,
  } satisfies Record<string, ValidUserProfileField>,
  
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