// TestApp.js - For testing individual components
import React from 'react';
import { View, StyleSheet } from 'react-native';

// Import screens you want to test
import CompleteRegistrationScreen from '@/components/screens/CompleteRegistrationScreen';
import AuthScreen from '@/components/screens/AuthScreen';
import HostDashboard from '@/components/screens/HostDashboard';
import GuestDashboard from '@/components/screens/GuestDashboard';

export default function TestApp() {
  
  // 🎯 CHANGE THIS TO TEST DIFFERENT COMPONENTS
  // Simply uncomment the component you want to test:
  
  return <CompleteRegistrationScreen />;
  // return <AuthScreen />;
  // return <HostDashboard />;
  // return <GuestDashboard />;
  
  // Or wrap in a container if needed:
  // return (
  //   <View style={styles.container}>
  //     <CompleteRegistrationScreen />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 