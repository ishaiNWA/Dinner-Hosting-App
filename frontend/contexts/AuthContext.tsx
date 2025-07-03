// Authentication Context - user login state and auth logic 

import { createContext, useState, useContext } from "react"
import {googleLogin} from "@/services/auth"
import { User, UserRole } from "@/types/auth"
import { Config } from "@/constants/Config"
import * as SecureStore from 'expo-secure-store';

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
            if('error' in result){
                setError(result.error);
            } else {
                const {token, user, isRegistrationComplete} = result;
                setUser(user);
                await SecureStore.setItemAsync(Config.JWT_STORAGE_KEY, token);
                setUserRole(user.role);
                setIsLoggedIn(true);
                setIsRegistrationComplete(isRegistrationComplete);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false); // Always runs, whether success or error
        }
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