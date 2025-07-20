import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { UserRoles } from "@/types/auth";
import { completeRegistration } from '@/services/auth';
import { useAuthContext } from '@/contexts/AuthContext';

const buildHostCompleteRegistrationBody = (phoneNumber: string, address: string) => {
  return JSON.stringify({
    userDataForm: {
      role: UserRoles.HOST,
      roleDetails: {
        contactDetails: {
          phoneNumber,
          address
        }
      }
    }
  });
};

export default function HostRegistration() {

  const {completeRegistrationCoordinator} = useAuthContext();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateIsraeliPhone = (phone: string) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Must be exactly 10 digits starting with 05
    const israeliPhoneRegex = /^05\d{8}$/;
    return israeliPhoneRegex.test(digits);
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    
    // Real-time validation
    if (text.length > 0) {
      if (!validateIsraeliPhone(text)) {
        setPhoneError('Invalid format. Use: 05X-XXXXXXX');
      } else {
        setPhoneError(''); // Clear error when valid
      }
    } else {
      setPhoneError(''); // Clear error when empty
    }
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
    
    // Simple validation - just required
    if (text.length > 0 && text.trim().length < 5) {
      setAddressError('Address too short');
    } else {
      setAddressError('');
    }
  };

  const isFormValid = () => {
    return (phoneNumber !== '' && phoneError === '' && address !== '' && addressError === '');
  };

  const handleSubmit = async () => {
    if(isSubmitting){
      return;
    }
    try{
    setIsSubmitting(true);
    const hostCompleteRegistration = buildHostCompleteRegistrationBody(phoneNumber, address);

    const response: any = await completeRegistrationCoordinator(hostCompleteRegistration);
    if(response.success){
      router.push('/HostDashboard');
    }else{
      return response.error;
    }
  
    }catch(error){
      console.log('Error:', error);
    }finally{
      setIsSubmitting(false);
  }
  };

  const handleGoBack = () => {
    console.log('Going back to CompleteRegistration');
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Host Registration</Text>
        
        <View style={styles.formContainer}>
          {/* Phone Number Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                phoneError ? styles.inputError : styles.inputValid
              ]}
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              placeholder="05X-XXXXXXX"
              keyboardType="numeric"
              maxLength={11}
            />
            {phoneError ? (
              <Text style={styles.errorText}>{phoneError}</Text>
            ) : null}
          </View>

          {/* Address Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[
                styles.input,
                addressError ? styles.inputError : styles.inputValid
              ]}
              value={address}
              onChangeText={handleAddressChange}
              placeholder="Enter your full address"
              multiline={true}
              numberOfLines={3}
            />
            {addressError ? (
              <Text style={styles.errorText}>{addressError}</Text>
            ) : null}
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              title={isSubmitting ? "Submitting..." : "Submit Registration"} 
              onPress={handleSubmit} 
              disabled={!isFormValid() || isSubmitting} 
            />
              {isSubmitting && (
              <Text style={styles.loadingText}>
                Please wait while we process your registration...
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4a5a5', // Grey-red background per cursor rules
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 400, // Ensures form has enough space
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputValid: {
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
  loadingText: {
    color: '#333',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
});