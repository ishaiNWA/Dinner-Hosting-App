// API service layer - Axios setup + interceptors 

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Config, HttpMethod, Platform } from '../constants/Config';

const apiClient = axios.create({
    baseURL: Config.API_URL,
    timeout: Config.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. REQUEST INTERCEPTOR
apiClient.interceptors.request.use(async (config) => {
    // 1.1. get the jwt token from the local storage
    const token = await SecureStore.getItemAsync(Config.JWT_STORAGE_KEY);
    // Add to every request header automatically
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add platform to Query params for mobile platform
    if (Config.PLATFORM === Platform.MOBILE) {
        config.params = {
            ...config.params,
            platform: Config.PLATFORM
        };
    }
    
    return config;
});

// 2. RESPONSE INTERCEPTOR  
apiClient.interceptors.response.use(
    async (response) => {
      // Check if this response contains a new token (login/register)
      if (response.data?.data?.token || response.data?.token) {
        const token = response.data?.data?.token || response.data?.token;
        await SecureStore.setItemAsync(Config.JWT_STORAGE_KEY, token);
      }
      return response;
    },
    async (error) => {
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

