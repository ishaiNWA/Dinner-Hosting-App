// API service layer - Axios setup + interceptors 

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Config, HttpMethod } from '../constants/Config';
import { router } from 'expo-router';

const apiClient = axios.create({
    baseURL: Config.API_URL,
    timeout: Config.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. REQUEST INTERCEPTOR
apiClient.interceptors.request.use(async (config) => {

    if(Platform.OS !== 'web'){
      // 1.1. get the jwt token from the secure store for mobile platforms
    const token = await SecureStore.getItemAsync(Config.JWT_STORAGE_KEY);
    // Add to every request header automatically
    console.log(`this is the token: ${token}`)
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
        console.log(`sent headers:${JSON.stringify(config.headers)}`)
    }
    }else{
      config.withCredentials = true;
    }
    
    // Add platform to Query params 
        config.params = {
            ...config.params,
            platform: Platform.OS
        };
    return config;
});

// 2. RESPONSE INTERCEPTOR  
apiClient.interceptors.response.use(
    // Success handler
    async (response) => {
      return response;
    },
    // Error handler
    async (error: any) => {
      console.log(`ERROR !!!!!`)
      
      // Get status from multiple possible locations
      const status = error.status || error.response?.status || error.code;
      
      // Handle token expiration
      if (status === 401) {
        console.log(`401 ERROR !!!!!`)
        // Platform-specific unauthorized handling
        if (Platform.OS === 'web') {
          localStorage.setItem('isUnAuthUser', 'true');
        } else {
          // For mobile, clear the stored token and set flag
          await SecureStore.deleteItemAsync(Config.JWT_STORAGE_KEY);
          await SecureStore.setItemAsync('isUnAuthUser', 'true');
        }
        router.replace('/')
      }
      
    }
);

export const apiRequest = (method: HttpMethod, url: string, data = null, config = {}) => {
    return apiClient.request({
      method,
      url,
      data,
      ...config
    });
}

