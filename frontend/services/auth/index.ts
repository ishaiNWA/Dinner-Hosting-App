// Main authentication entry point - orchestrates between web and mobile auth

import { Config, HttpMethod } from "@/constants/Config";
import { Platform } from "react-native";
import { apiRequest } from "../api";
import { handleWebGoogleLogin } from './webAuth';
import { handleMobileGoogleLogin } from './mobileAuth';
import { validateWebAuthResult } from './authValidation';

const { ENDPOINTS } = Config;

export async function googleLogin() {
    try {
        if (Platform.OS === 'web') {
            const result = await handleWebGoogleLogin();
            return validateWebAuthResult(result);
        }

        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            return await handleMobileGoogleLogin();
        } else {
            return { error: 'Invalid platform' };
        }

    } catch (error: any) {
        console.error('OAuth failed:', error);
        return { error: error.message };
    }
}

export async function completeRegistration(requestBody: any) {
    try {
        const response = await apiRequest(HttpMethod.POST, ENDPOINTS.AUTH.COMPLETE_REGISTRATION, requestBody);

        console.log(`this is the response: ${JSON.stringify(response, null, 2)}`)
        return response.data;
    } catch (error: any) {
        console.log('COMPLETE REGISTRATION THROWN ERROR!!', error);
        return error;
    }
} 

export async function logout() {
    try {
        const response = await apiRequest(HttpMethod.POST, ENDPOINTS.AUTH.LOGOUT, undefined);
        return response.data;
    } catch (error: any) {
        return { error: error.message };
    }
}