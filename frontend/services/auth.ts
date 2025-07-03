// Authentication API calls - login, register, logout 

import { Config } from "@/constants/Config";
import * as WebBrowser from 'expo-web-browser'; // package for oauth 
import * as Linking from 'expo-linking';
import { User } from "@/types/auth";

export async function googleLogin() {
    try {
        // Invoke WebBrowser.openAuthSessionAsync
        const result = await WebBrowser.openAuthSessionAsync(
            Config.OAUTH_LOGIN_URL,    // Parameter 1: authUrl
            Config.OAUTH_REDIRECT_URL, // Parameter 2: redirectUrl  
            {                          // Parameter 3: options (optional)
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
        } else {
            // User cancelled or other error
            return { error: `OAuth ${result.type}` };
        }

    } catch (error: any) {
        console.error('OAuth failed:', error);
        return { error: error.message };
    }
}
