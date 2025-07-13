// API service layer - Axios setup + interceptors 

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Config, HttpMethod } from '../constants/Config';

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

    async (error: any) => {
      // Handle token expiration
      if (error.response?.status === 401) {
        // TODO : Token expired - redirect to login
        await SecureStore.deleteItemAsync(Config.JWT_STORAGE_KEY);
        // TODO : Navigate to login screen (will be implemented with navigation context)
      }
      throw error;
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

