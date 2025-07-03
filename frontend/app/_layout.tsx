import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';
import { ActivityIndicator } from 'react-native';
import { UserRole } from '@/types/auth';
import HostDashboard from '@/components/screens/HostDashboard';
import CompleteRegistrationScreen from '@/components/screens/CompleteRegistrationScreen';
import GuestDashboard from '@/components/screens/GuestDashboard';
import AuthScreen from '@/components/screens/AuthScreen';

function NavigationController(){

const {isLoggedIn , isRegistrationComplete , userRole, isLoading} = useAuthContext()

if(isLoading){
  return <ActivityIndicator size="large" color="#0000ff" />
}
if(isLoggedIn){
  if(!isRegistrationComplete){
    return <CompleteRegistrationScreen />
  } else {
   return userRole === UserRole.HOST ? <HostDashboard /> : <GuestDashboard />
  }
}
return <AuthScreen />
}



export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NavigationController />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
