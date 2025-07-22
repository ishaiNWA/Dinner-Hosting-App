import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  // Form Container Styles
  fieldContainer: {
    marginBottom: 20,
  },
  
  // Label Styles
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  
  // Input Styles
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  
  // Input State Styles
  inputValid: {
    borderColor: '#ddd',
  },
  
  inputError: {
    borderColor: '#ff4444',
  },
  
  // Error Text Styles
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  
  // Button Styles
  buttonContainer: {
    marginTop: 20,
  },
  
  // Loading Text Styles
  loadingText: {
    color: '#333',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  
  // Suggestions Styles (for address autocomplete)
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
  
  // Modal Styles
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
  
  // Select Input Styles
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
}); 