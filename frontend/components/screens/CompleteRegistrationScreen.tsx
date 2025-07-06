import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserRole } from '@/types/auth';
import { useState } from 'react';

export default function CompleteRegistrationScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      
      <View style={styles.cardsContainer}>
        {/* Host Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏠 Become a Host</Text>
          <View style={styles.divider} />
          <Text style={styles.cardDescription}>
            Create dinner events and welcome soldiers to your home
          </Text>
          <Text style={styles.cardRequirements}>
            Requirements: Contact info, verification
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => console.log('Host selected')}
          >
            <Text style={styles.buttonText}>Continue as Host</Text>
          </TouchableOpacity>
        </View>

        {/* Guest Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎖️ Join as Guest</Text>
          <View style={styles.divider} />
          <Text style={styles.cardDescription}>
            Attend dinner events in your area
          </Text>
          <Text style={styles.cardRequirements}>
            Requirements: Contact info, dietary preferences
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => console.log('Guest selected')}
          >
            <Text style={styles.buttonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f4fd',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
    marginBottom: 15,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardRequirements: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
});