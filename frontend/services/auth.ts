// Authentication API calls - login, register, logout 

import { Config, HttpMethod } from "@/constants/Config";
import * as WebBrowser from 'expo-web-browser'; // package for oauth 
import * as Linking from 'expo-linking';
import { User } from "@/types/auth";
import { apiRequest } from "./api";
import { Alert, Platform } from "react-native";
const {ENDPOINTS} = Config;

export async function googleLogin() {
    try {

        console.log(`OAUTH_LOGIN_URL: ${Config.OAUTH_LOGIN_URL}`);
        console.log(`OAUTH_REDIRECT_URL: ${Config.OAUTH_REDIRECT_URL}`);

        const handleWebGoogleLogin = async () => {
              // Web-specific code
              localStorage.setItem('isWebAuthInProgress', 'true');
              window.location.href = `${Config.OAUTH_LOGIN_URL}?platform=${Platform.OS}`;
        };


        const handleMobileGoogleLogin = async () => {        
            const result = await WebBrowser.openAuthSessionAsync(
                `${Config.OAUTH_LOGIN_URL}?platform=${Platform.OS}`,    //  https://117eef343b05.ngrok-free.app
                Config.OAUTH_REDIRECT_URL, // OAUTH_REDIRECT_URL: 'exp://localhost:19000',
                {                          // options (optional)
                    showTitle: true,       // Show page title in browser
                    showInRecents: true,   // Show in recent apps list
                }
            );
    
            Alert.alert(`FINISH WEB BROWSER`);
            console.log(`FINISH WEB BROWSER`);
            
            // Handle the result
            if (result.type === 'success') {
                // Success: Browser redirected back to app
                console.log('OAuth completed, redirect URL:', result.url);
                
                // Parse the URL parameters
                const parsed = Linking.parse(result.url);
                const params = parsed.queryParams;
                
               return  extractMobileAuthResult(params)

            } else {
                // User cancelled or other error
                return { error: `OAuth ${result.type}` };
            }}


        if (Platform.OS === 'web') {
            await handleWebGoogleLogin();
            return;
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

function extractMobileAuthResult(params:any){
            
                // Validate required parameters exist
                if (!params || !params.token || !params.user || !params.isRegistrationComplete) {
                    return { error: 'Invalid OAuth response - missing required parameters' };
                }
                
                // Parse and return the expected structure
                return {
                    token: params.token as string,
                    user: JSON.parse(decodeURIComponent(params.user as string)) as User,
                    isRegistrationComplete: params.isRegistrationComplete === 'true'
                };
}

export function extractWebAuthResult(){
    const params = Object.fromEntries(new URLSearchParams(window.location.search))
    
    if (!params || !params.user || !params.isRegistrationComplete) {
        return { error: 'Invalid OAuth response - missing required parameters' };
    } else {
        const { user: userString, isRegistrationComplete: isRegistrationCompleteString } = params
        const user =  JSON.parse(decodeURIComponent(userString)) as User
        const isRegistrationComplete = JSON.parse(isRegistrationCompleteString) as boolean
        localStorage.removeItem('isWebAuthInProgress')
        return {
            user,
            isRegistrationComplete
        }
    }
}


export async function completeRegistration(requestBody: any){
    try {
        console.log(`this is the url: ${ENDPOINTS.AUTH.COMPLETE_REGISTRATION}`)
        Alert.alert(`this is the url: ${ENDPOINTS.AUTH.COMPLETE_REGISTRATION}`)
        const response = await apiRequest(HttpMethod.POST, ENDPOINTS.AUTH.COMPLETE_REGISTRATION, requestBody);

        console.log(`this is the response: ${JSON.stringify(response, null, 2)}`)
        return response.data;
    } catch (error: any) {
        return { error: error.message };
    }
}
