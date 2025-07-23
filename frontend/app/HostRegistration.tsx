import { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { UserRoles } from "@/types/auth";
import { useAuthContext } from '@/contexts/AuthContext';
import PhoneNumberInput from '@/components/forms/PhoneNumberInput';
import AddressInput from '@/components/forms/AddressInput';
import usePhoneValidation from './hooks/usePhoneContext';
import useAddressContext from './hooks/useAddressContext';

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

  const {completeRegistrationCoordinator, user} = useAuthContext();

  const phoneValidationObject = usePhoneValidation();

  const addressContextObject = useAddressContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = () => {
    return (phoneValidationObject.isValidPhone() && addressContextObject.isAddressValid());
  };

  const handleSubmit = async () => {
    if(isSubmitting){
      return;
    }
    try{
    setIsSubmitting(true);
    const hostCompleteRegistration = buildHostCompleteRegistrationBody(phoneValidationObject.phoneNumber,addressContextObject.address);

    const response: any = await completeRegistrationCoordinator(hostCompleteRegistration);
    if(response.success){
      router.replace('/HostDashboard'); // Replace instead of push
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
          <PhoneNumberInput
            {...phoneValidationObject}
          />

          {/* Address Field */}
           <AddressInput 
            {...addressContextObject}
          />

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
  suggestionsContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  addressSuggestionsButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});