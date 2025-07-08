import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';
import TestApp from '../TestApp';

// 🧪 TESTING MODE: Controlled by environment variable
const TESTING_MODE = process.env.EXPO_PUBLIC_TESTING_MODE === 'true';


export default function RootLayout(){

  const colorScheme = useColorScheme();
    const [loaded] = useFonts({
      SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
  
    if (!loaded) {
      // Async font loading only occurs in development.
      return null;
    }
  
    // 🧪 TESTING MODE: Show TestApp instead of normal app
    if (TESTING_MODE) {
      return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <TestApp />
          <StatusBar style="auto" />
        </ThemeProvider>
      );
    }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="Auth" />
          <Stack.Screen name="CompleteRegistration" />
          <Stack.Screen name="HostDashboard" />
          <Stack.Screen name="GuestDashboard" />
          <Stack.Screen name="HostRegistration" />
          <Stack.Screen name="GuestRegistration" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}














