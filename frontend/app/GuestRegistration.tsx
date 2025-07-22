import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Button, Alert } from 'react-native';
import { UserRoles } from "@/types/auth";
import { DIETARY_RESTRICTIONS, DietaryRestrictionType } from '@/constants/dietaryRestrictions';
import { router } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';
import { searchForAddress } from '@/services/addressService';
import { StandardAddress } from '@/types/address';

const buildGuestCompleteRegistrationBody = (phoneNumber: string, address: string , dietaryRestrictions: Array<DietaryRestrictionType>, allergies: string) => {
  return JSON.stringify({
    userDataForm: {
      role: UserRoles.GUEST,
      roleDetails: {
        contactDetails: {
          phoneNumber,
          address
        },
        dietaryRestrictions,
        allergies
      }
    }
  });
};

export default function GuestRegistration() {

  const {completeRegistrationCoordinator} = useAuthContext();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<StandardAddress[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [selectedAddressSuggestion, setSelectedAddressSuggestion] = useState('');

  const [selectedRestrictions, setSelectedRestrictions] = useState<DietaryRestrictionType[]>([]);
  const [isRestrictionsModalVisible, setIsRestrictionsModalVisible] = useState(false);

  const [allergies, setAllergies] = useState('');
  const[allergiesModalVisible, setAllergiesModalVisible] = useState(false);
  const[allergiesOption, setAllergiesOption] = useState<'none' | 'other' |null >(null);
  const [allergiesError, setAllergiesError] = useState('');


  const handleAllergyChange = (text: string) => {
    setAllergies(text);
    
    // Skip validation for 'none' - it's a special case
    if(text === 'none') {
      setAllergiesError('');
      return;
    }
    
    // Validate user input for 'other'
    if(text.length > 0 && text.trim().length < 3){
      setAllergiesError('Allergies too short');
    }else{
      setAllergiesError('');
    }
  };

  const handleNoneAllergies = () => {
    setAllergiesOption('none');
    setAllergiesModalVisible(false);
    handleAllergyChange('none');
  };

  const handleOtherAllergies = () => {
    setAllergiesOption('other');
    setAllergiesModalVisible(false);
    handleAllergyChange('');
  };



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
  };

  const handleSelectedAddressSuggestionChange = (address: string) => {
    setShowAddressSuggestions(false);
    setSelectedAddressSuggestion(address);
    handleAddressChange(address);
  };

  useEffect(() => {
    let searchAddressTimeoutId: any;
    if (address.length >= 3 && address !== selectedAddressSuggestion) {
      searchAddressTimeoutId = setTimeout(async function fetchAddressSuggestions() {
        const suggestions = await searchForAddress(address);
        setAddressSuggestions(suggestions);
        setShowAddressSuggestions(true);
      }, 500); // 500ms debounce delay
    } else {
      setShowAddressSuggestions(false);
    }
    return () => clearTimeout(searchAddressTimeoutId);
  }, [address]);

  const handleGoBack = () => {
    console.log('Going back to CompleteRegistration');
    router.back();
  };

  const handleToggleRestriction = (restriction: DietaryRestrictionType) => {
    setSelectedRestrictions(prev => {
      // Handle "none" special case
      if (restriction === "none") {
        return prev.includes("none") ? [] : ["none"];
      }
      
      // If selecting other restrictions, remove "none" if it's present
      const withoutNone = prev.filter(item => item !== "none");
      
      // Handle other restrictions
      if (withoutNone.includes(restriction)) {
        return withoutNone.filter(item => item !== restriction); // Remove
      } else {
        return [...withoutNone, restriction]; // Add
      }
    });
  };




  const isFormValid = () => {
    return (phoneNumber !== '' && phoneError === '' && address !== '' && selectedRestrictions.length > 0 
      && allergies !== '' && allergiesError === '' && selectedAddressSuggestion === address && addressError === ''
    );
  };


  const handleSubmit = async () => {
    if(isSubmitting){
      return;
    }
    try{
    setIsSubmitting(true);
    const guestCompleteRegistration = buildGuestCompleteRegistrationBody(phoneNumber, address, selectedRestrictions, allergies);
  
  const response: any = await completeRegistrationCoordinator(guestCompleteRegistration);
  if(response.success){
    router.replace('/GuestDashboard'); 
  }else{
    return response.error;
  }

  }catch(error){
    console.log('Error:', error);
  }finally{
    setIsSubmitting(false);
  }
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

      <Text style={styles.title}>Guest Registration</Text>

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
            {showAddressSuggestions && addressSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {addressSuggestions.map((suggestion: StandardAddress) => (
                  <TouchableOpacity
                    key={suggestion.placeId}
                    style={styles.addressSuggestionsButton}
                    onPress={() => handleSelectedAddressSuggestionChange(suggestion.fullAddress)}
                  >
                    <Text style={styles.suggestionText}>{suggestion.fullAddress}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {addressError ? (
              <Text style={styles.errorText}>{addressError}</Text>
            ) : null}
          </View>

          {/* Allergies Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Allergies</Text>
            <TouchableOpacity 
              style={styles.selectInput}
              onPress={() => setAllergiesModalVisible(true)}
            >
              <Text style={styles.selectText}>
                {allergies === 'none' ? 'No allergies' : allergies || "Select allergies or none"}
              </Text>
            </TouchableOpacity>
            {allergiesError ? (
              <Text style={styles.errorText}>{allergiesError}</Text>
            ) : null}
          </View>

          {/* Allergies Modal */}
          <Modal 
            visible={allergiesModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Allergies</Text>
                
                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={handleNoneAllergies}
                >
                  <Text style={styles.modalOptionText}>No allergies</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={handleOtherAllergies}
                >
                  <Text style={styles.modalOptionText}>I have allergies</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => setAllergiesModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Allergy Details Input (when "Other" is selected) */}
          {allergiesOption === 'other' && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Describe your allergies</Text>
              <TextInput
                style={[
                  styles.input,
                  allergiesError ? styles.inputError : styles.inputValid
                ]}
                value={allergies}
                onChangeText={handleAllergyChange}
                placeholder="Enter your allergies (e.g., nuts, dairy, etc.)"
                multiline={true}
                numberOfLines={2}
              />
              {allergiesError ? (
                <Text style={styles.errorText}>{allergiesError}</Text>
              ) : null}
            </View>
          )}

          {/* Dietary Restrictions */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Dietary Restrictions</Text>
            <TouchableOpacity 
              style={styles.selectInput}
              onPress={() => setIsRestrictionsModalVisible(true)}
            >
              <Text style={styles.selectText}>
                {selectedRestrictions.length === 0 
                  ? "Select dietary restrictions" 
                  : selectedRestrictions.includes("none") 
                    ? "No restrictions" 
                    : `${selectedRestrictions.length} restriction${selectedRestrictions.length > 1 ? 's' : ''} selected`
                }
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Dietary Restrictions Modal */}
          <Modal 
            visible={isRestrictionsModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Dietary Restrictions</Text>
                
                <ScrollView style={styles.modalScrollView}>
                  {DIETARY_RESTRICTIONS.map((item) => (
                    <TouchableOpacity 
                      key={item}
                      style={styles.checkboxRow}
                      onPress={() => handleToggleRestriction(item)}
                    >
                      <View style={[
                        styles.checkbox, 
                        selectedRestrictions.includes(item) && styles.checkboxSelected
                      ]}>
                        {selectedRestrictions.includes(item) && (
                          <Text style={styles.checkboxIcon}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>
                        {item === "none" ? "No restrictions" : item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <TouchableOpacity 
                  style={styles.modalDoneButton}
                  onPress={() => setIsRestrictionsModalVisible(false)}
                >
                  <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  selectInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  selectText: {
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalCancelButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ff4444',
    width: '100%',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalScrollView: {
    width: '100%',
    maxHeight: 250, // Limit height for scrolling
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  checkboxIcon: {
    color: '#fff',
    fontSize: 16,
  },
  modalDoneButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    width: '100%',
    alignItems: 'center',
  },
  modalDoneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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