import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

export default function GuestDashboard() {

  const {userName , logoutCoordinator} = useAuthContext();

  const logOutHandler = async ()=>{
    await logoutCoordinator();
    router.replace('/');
   }

  return (
    <View style={styles.dashboardScreen}>
      <TouchableOpacity style={styles.logoutButton} onPress={logOutHandler}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <Text style={styles.title}>welcome  {userName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboardScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf2e8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
}); 