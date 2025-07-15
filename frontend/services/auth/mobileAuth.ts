import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from "react-native";
import { Config } from "@/constants/Config";
import { validateMobileAuthResult } from './authValidation';

export async function handleMobileGoogleLogin() {        
    const result = await WebBrowser.openAuthSessionAsync(
        `${Config.OAUTH_LOGIN_URL}?platform=${Platform.OS}`,    //  https://117eef343b05.ngrok-free.app
        Config.OAUTH_REDIRECT_URL, // OAUTH_REDIRECT_URL: 'exp://localhost:19000',
        {                          // options (optional)
            showTitle: true,       // Show page title in browser
            showInRecents: true,   // Show in recent apps list
        }
    );       
    // Handle the result
    if (result.type === 'success') {
        // Success: Browser redirected back to app
        console.log('OAuth completed, redirect URL:', result.url);
        
        // Parse the URL parameters
        const parsed = Linking.parse(result.url);
        const params = parsed.queryParams;
        
       return  validateMobileAuthResult(params)

    } else {
        // User cancelled or other error
        return { error: `OAuth ${result.type}` };
    }
} 