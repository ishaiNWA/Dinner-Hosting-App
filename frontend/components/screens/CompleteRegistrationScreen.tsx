import { View, Text, StyleSheet } from 'react-native';

export default function CompleteRegistrationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CompleteRegistrationScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f4fd',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
}); 