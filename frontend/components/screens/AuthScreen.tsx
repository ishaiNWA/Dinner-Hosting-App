import { View, Text, StyleSheet } from 'react-native';
import { useAuthContext } from '@/contexts/AuthContext';
import { SocialIcon } from 'react-native-elements';

export default function AuthScreen() {
  const { googleLoginCoordinator, isLoading, error } = useAuthContext();

  const handleGoogleLogin = async () => {
    await googleLoginCoordinator();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dinner Hosting App</Text>
      <Text style={styles.subtitle}>Connect soldiers with hosts for dinner</Text>
      
      {/* Google Sign In Button */}
      <SocialIcon
        title="Sign In With Google"
        button
        type="google"
        onPress={handleGoogleLogin}
        disabled={isLoading}
        loading={isLoading}
        style={styles.googleButton}
      />
      
      {/* Error Display */}
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
      
      {/* Loading Text */}
      {isLoading && (
        <Text style={styles.loadingText}>
          Signing you in...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f0f0', // Grey-red background as requested
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
  },
  googleButton: {
    width: 250,
    marginVertical: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
    marginTop: 10,
  },
}); 