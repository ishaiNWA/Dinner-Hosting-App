import { commonStyles } from "@/styles/commonStyles";
import { StandardAddress } from "@/types/address";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";


interface AddressInputProps {
  address: string;
  addressError: string;
  userHomeAddress: string
  showAddressSuggestions: boolean;
  addressSuggestions: StandardAddress[];
  handleSelctedAddressSuggestionChange: (address: string) => void;
  handleAddressChange: (text: string) => void;
}

const AddressInput = ({ address, addressError, showAddressSuggestions, addressSuggestions, handleSelctedAddressSuggestionChange, handleAddressChange, userHomeAddress }: AddressInputProps) =>{


   return (

    <View style={commonStyles.fieldContainer}>
    <Text style={commonStyles.label}>Address</Text>
    <TextInput
      style={[
        commonStyles.input,
        addressError ? commonStyles.inputError : commonStyles.inputValid
      ]}
      value={address}
      onChangeText={handleAddressChange}
      placeholder= {userHomeAddress ? userHomeAddress : "Enter your home address"}
      multiline={true}
      numberOfLines={3}
    /> 
    {showAddressSuggestions && addressSuggestions.length > 0 && (
      <View style={commonStyles.suggestionsContainer}>
      {addressSuggestions.map((suggestion: StandardAddress) => (
        <TouchableOpacity  key={suggestion.placeId} style={commonStyles.addressSuggestionsButton} 
          onPress={() => handleSelctedAddressSuggestionChange(suggestion.fullAddress)}> 

          <Text style={commonStyles.suggestionText}>{suggestion.fullAddress}</Text>

          </TouchableOpacity> 
        ))}
    </View> )}
    {addressError ? (
      <Text style={commonStyles.errorText}>{addressError}</Text>
    ) : null}
  </View>
   )

}

export default AddressInput;