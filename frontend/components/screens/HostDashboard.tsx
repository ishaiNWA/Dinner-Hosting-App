import { View, Text, StyleSheet } from 'react-native';

export default function HostDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HostDashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
}); 