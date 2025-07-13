// Authentication Context - user login state and auth logic 

import { createContext, useState, useContext, useEffect } from "react"
import {extractWebAuthResult, googleLogin} from "@/services/auth"
import { User, UserRole } from "@/types/auth"
import { Config } from "@/constants/Config"
import * as SecureStore from 'expo-secure-store';
import { Alert } from "react-native";
import { router } from "expo-router";
import { Platform } from "react-native";

// AuthContext type
interface AuthContextType {
    user: User | null;
    error: string | null;
    isLoggedIn: boolean;
    isRegistrationComplete: boolean;
    isLoading: boolean;
    userRole: UserRole | null;
    googleLoginCoordinator: () => Promise<void>;
}

// 1. create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 2. Provider component
const AuthProvider = ({children}: {children: React.ReactNode}) =>{

    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [isRegistrationComplete, setIsRegistrationComplete] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)  
    const [userRole, setUserRole] = useState<UserRole | null>(null)


    const googleLoginCoordinator = async() =>{
        setIsLoading(true);
        setError(null); // Clear previous errors
        
        try {
            const result = await googleLogin();

            Alert.alert("I'M BACK!!!");
            console.log("I'M BACK!!!");
            
            // First check if result exists
            if (!result) {
                setError('No response from Google login');
                return;
            }
            
            if('error' in result){
                setError(result.error);
            } else {
                const {token, user, isRegistrationComplete} = result;
               await setAuthResponse(user, isRegistrationComplete, token)

            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false); // Always runs, whether success or error
        }

    }

    useEffect(() => {
        const handleWebAuth = async () => {
            if (Platform.OS === 'web' && localStorage.getItem('isWebAuthInProgress')) {
                // Debug: Check if JWT cookie exists
                console.log('All cookies:', document.cookie);
                console.log('JWT cookie exists:', document.cookie.includes('jwt='));
                
                const params = extractWebAuthResult()
                if (!params || 'error' in params) {
                   return setError('Invalid OAuth response - missing required parameters')
                } else {
                    const { user, isRegistrationComplete } = params
                    try {
                        await setAuthResponse(user, isRegistrationComplete)
                        router.replace('/') 
                    } catch (error: any) {
                        setError(error.message);
                    } finally {
                        setIsLoading(false);
                    }
                }
            }
        }
    
        handleWebAuth()
    }, [])
    
    useEffect(() => {
        const handleUnAuthHandler = async () => {
            let isUnauthorized = false;
            
            if (Platform.OS === 'web') {
                isUnauthorized = localStorage.getItem('isUnAuthUser') === 'true';
                if (isUnauthorized) {
                    localStorage.removeItem('isUnAuthUser');
                }
            } else {
                const unAuthFlag = await SecureStore.getItemAsync('isUnAuthUser');
                isUnauthorized = unAuthFlag === 'true';
                if (isUnauthorized) {
                    await SecureStore.deleteItemAsync('isUnAuthUser');
                }
            }
            
            if (isUnauthorized) {
                setIsLoggedIn(false);
                setUser(null);
                setIsRegistrationComplete(false);
                setUserRole(null);
                router.replace('/');
            }
        }
        handleUnAuthHandler()
    }, [])


    const setAuthResponse = async ( user: User, isRegistrationComplete: boolean , token: string = '') => {
        setUser(user);
        
        // Only store token manually on mobile platforms
        // Web uses httpOnly cookies set by backend
        if (Platform.OS !== 'web') {
            await SecureStore.setItemAsync(Config.JWT_STORAGE_KEY, token);
        }
        
        setUserRole(user.role);
        setIsLoggedIn(true);
        setIsRegistrationComplete(isRegistrationComplete);
    }

    // TODO:: add logout function

    return(
        <AuthContext.Provider value={{user, error, isLoggedIn, isRegistrationComplete, userRole, isLoading, googleLoginCoordinator}}>
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