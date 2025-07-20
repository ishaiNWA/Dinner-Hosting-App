// API service layer - Axios setup + interceptors 

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Config, HttpMethod } from '../constants/Config';
import { router } from 'expo-router';


let unAuthorizedCallback: ()=>void;
export const  registerUnauthorizedHandler = (unauthorizedHandler: ()=>void)=>{
    unAuthorizedCallback = unauthorizedHandler;
}



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
      console.log(`🚨 API ERROR INTERCEPTOR TRIGGERED 🚨`)
      console.log('Error details:', error);
      
      // Get status from multiple possible locations
      const status = error.status || error.response?.status || error.code;
      console.log(`Status detected: ${status}`);
      
      // Handle token expiration
      if (status === 401 && unAuthorizedCallback) {
        console.log('🚨 401 DETECTED - CALLING UNAUTHORIZED CALLBACK 🚨');
        unAuthorizedCallback();
        console.log('🚨 UNAUTHORIZED CALLBACK INVOKED 🚨');
        return Promise.reject({error: 'Unauthorized request', status: 401});
      }
      
      console.log('❌ API ERROR: Not 401 or no callback registered');
      return Promise.reject(error);
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

