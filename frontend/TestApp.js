// TestApp.js - For testing individual components
import React from 'react';
import { View, StyleSheet } from 'react-native';

// Import screens you want to test
import CompleteRegistration from '@/app/CompleteRegistration';
import Auth from '@/app/Auth';
import HostDashboard from '@/app/HostDashboard';
import GuestDashboard from '@/app/GuestDashboard';
import HostRegistration from '@/app/HostRegistration';

export default function TestApp() {
  
  // 🎯 CHANGE THIS TO TEST DIFFERENT COMPONENTS
  // Simply uncomment the component you want to test:
  
  return <HostRegistration />;
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