import { View, Text, StyleSheet } from 'react-native';

export default function GuestDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GuestDashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
}); 