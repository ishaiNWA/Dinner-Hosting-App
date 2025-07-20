// Authentication Context - user login state and auth logic 

import { createContext, useState, useContext, useEffect, useCallback } from "react"
import {completeRegistration, googleLogin, logout} from "@/services/auth"
import { User, UserRoles } from "@/types/auth"
import { Config } from "@/constants/Config"
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import { Alert, Platform } from "react-native";
import { registerUnauthorizedHandler } from "@/services/api";
import { me } from "@/services/users";

// AuthContext type
interface AuthContextType {
    user: User | null;
    error: string | null;
    isLoggedIn: boolean;
    isRegistrationComplete: boolean;
    isLoading: boolean;
    userRole: UserRoles | null;
    googleLoginCoordinator: () => Promise<void>;
    completeRegistrationCoordinator: (requestBody: any) => Promise<{success: boolean, error?: string}>;
    logoutCoordinator: () => Promise<{success: boolean, error?: string}>;
    unauthorizedHandler: () => Promise<void>;
}

// 1. create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 2. Provider component
const AuthProvider = ({children}: {children: React.ReactNode}) =>{

    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [isRegistrationComplete, setIsRegistrationComplete] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)  
    const [userRole, setUserRole] = useState<UserRoles | null>(null)


    const googleLoginCoordinator = async() =>{
        setIsLoading(true);
        setError(null); // Clear previous errors
        
        try {
            const result: any = await googleLogin();
            // First check if result exists
            if (!result) {
                setError('No response from Google login');
                return;
            }
            if('error' in result){
                setError(result.error);
            } else {
                const {token, user, isRegistrationComplete} = result;
               await setAuthResponse( true, user, isRegistrationComplete, token)
               // localStorage is already handled in setAuthResponse - no need to duplicate
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false); // Always runs, whether success or error
        }
    }

    const setAuthResponse = async ( responseIsLoggedIn: boolean, responseUser: User, responseIsRegistrationComplete: boolean , token: string = '') => {
        setUser(responseUser);
        
        // Only store token manually on mobile platforms
        // Web uses httpOnly cookies set by backend
        if (Platform.OS !== 'web') {
            await SecureStore.setItemAsync(Config.JWT_STORAGE_KEY, token);
        }

        setIsLoggedIn(responseIsLoggedIn);
        setUserRole(responseUser.role);
        setIsRegistrationComplete(responseIsRegistrationComplete);
        console.log(`isLoggedIn AFTER: ${isLoggedIn}`);
        if(Platform.OS === 'web'){
            localStorage.setItem('isLoggedIn', responseIsLoggedIn.toString());
            localStorage.setItem('isRegistrationComplete', responseIsRegistrationComplete.toString());
            localStorage.setItem('userRole', responseUser.role as string);
            console.log(`responseIsLoggedIn: ${responseIsLoggedIn}`);
            console.log(`complete registration: LOCAL STORAGE IS LOGGED IN: ${localStorage.getItem('isLoggedIn')}`);
        }
        setIsLoading(false);
    }

    useEffect(()=>{
        const restoreAuthState = async ()=>{
                // Try to restore from localStorage

                const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
                const savedUserRole = localStorage.getItem('userRole');
                const savedIsRegistrationComplete = localStorage.getItem('isRegistrationComplete');
                

                console.log('IS SAVED IS LOGGED IN TRUE OR FALSE:', savedIsLoggedIn);

                // If valid data exists, restore it
                if (savedIsLoggedIn === 'true') {
                    setIsLoggedIn(true);
                    setUserRole(savedUserRole as UserRoles);
                    setIsRegistrationComplete(savedIsRegistrationComplete === 'true');      
                    
                    // Validate with server
                    try {
                        console.log('🔍 VALIDATING TOKEN WITH SERVER...');
                        const userData = await me();
                        console.log('🔍 SERVER RESPONSE:', userData);
                        
                        if (userData.error && userData.status === 401) {
                            console.log('❌ TOKEN INVALID - CLEARING AUTH STATE');
                            await clearAuthState();
                        } else if (!userData.error) {
                            console.log('✅ TOKEN VALID - KEEPING RESTORED STATE');
                        } else {
                            console.log('⚠️ UNEXPECTED RESPONSE:', userData);
                        }
                    } catch (error) {
                        console.log('🌐 NETWORK ERROR - KEEPING OFFLINE STATE:', error);
                        // Keep localStorage state for offline support
                    }
                }
        };

        const initializeAuth = async () => {
            if (Platform.OS === 'web'){
                await restoreAuthState();
            }
            
            // CRITICAL: Always set loading to false after restoration attempt
            setIsLoading(false);
        };
        
        initializeAuth();
    }, []); // Fixed missing semicolon

    const completeRegistrationCoordinator = async (requestBody: any) => {
        
            const response = await completeRegistration(requestBody);
            console.log('Response:', response);
            if (response.error) {
                console.log('completeRegistrationCoordinator response error!!!:', response.error);
              if(response.status === 500){
                Alert.alert('Error', 'Internal error, please try again later');
              }else{
                Alert.alert('Error', response.error);
              }
              return {success: false, error: response.error};
            } else {
              Alert.alert('Success', 'Registration completed successfully');
              setIsRegistrationComplete(true);
              const { role } = response.user;
              setUserRole(role);
              
              if(Platform.OS === 'web'){
                console.log(`complete registration: LOCAL STORAGE IS LOGGED IN: ${localStorage.getItem('isLoggedIn')}`);
                localStorage.setItem('isRegistrationComplete', 'true');
                localStorage.setItem('userRole', role);
              }
              return {success: true};
        }
    }
        const clearAuthState = async () => {

        console.log('clearAuthState called!!!');
        console.log(`setIsLoggedIn BEFORE clearAuthState: ${isLoggedIn}`);
        console.log(`setUserRole BEFORE clearAuthState: ${userRole}`);
        console.log(`setIsRegistrationComplete BEFORE clearAuthState: ${isRegistrationComplete}`);
        
        setUser(null);
        setUserRole(null);
        setIsLoggedIn(false);
        setIsRegistrationComplete(false);
        
        console.log(`setIsLoggedIn AFTER clearAuthState: ${isLoggedIn}`);
        console.log('clearAuthState: States have been set to false/null');
        
        if(Platform.OS === 'web'){
            localStorage.removeItem('isRegistrationComplete');
            localStorage.removeItem('userRole');
            localStorage.removeItem('isLoggedIn');
            console.log('clearAuthState: localStorage cleared');
        } else {
            await SecureStore.deleteItemAsync(Config.JWT_STORAGE_KEY);
            console.log('clearAuthState: SecureStore cleared');
        }
        
        // Force navigation back to root when auth is cleared
        console.log('🚀 FORCING NAVIGATION TO ROOT');
        router.replace('/');
    }


    const logoutCoordinator = async () => {
        const response: any = await logout();
        if(response.error){
            Alert.alert('Error', response.error);
            return {success: false, error: response.error};
        }
        await clearAuthState();
        return {success: true};
    }   

    const unauthorizedHandler = useCallback(async () => {
        
        if (Platform.OS === 'web') {
            // browser alert
            window.alert(
                'Session Expired\n\nYour session has expired for security reasons. Please log in again to continue.'
            );
            await clearAuthState();
        
        } else {
            // mobile alert
            Alert.alert(
                'Session Expired',
                'Your session has expired for security reasons. Please log in again to continue.',
                [
                    {
                        text: 'Continue to Login',
                        onPress: async () => {
                            await clearAuthState();
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }, []); // Empty deps - function never changes

    useEffect(() => {
        registerUnauthorizedHandler(unauthorizedHandler);
        
        // Optional cleanup (though not strictly needed for your case)
        return () => registerUnauthorizedHandler(() => {});
    }, [unauthorizedHandler]); // Only re-register if handler changes (it won't)


    return(
        <AuthContext.Provider value={{user, error, isLoggedIn, isRegistrationComplete, userRole,
         isLoading, googleLoginCoordinator, completeRegistrationCoordinator, logoutCoordinator, unauthorizedHandler}}>
            {children}
        </AuthContext.Provider>
    )
}

// 3. Custom hook for components to use AuthContext
const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}   



// 4. Exports
export { AuthProvider, useAuthContext };