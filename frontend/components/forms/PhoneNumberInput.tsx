import { Text, TextInput, View } from "react-native";
import { commonStyles } from "@/styles/commonStyles";

interface PhoneNumberInputProps {
  phoneNumber: string;
  phoneError: string;
  handlePhoneChange: (text: string) => void;
  isValidPhone: () => boolean;
}

const PhoneNumberInput = ({ phoneNumber, phoneError, handlePhoneChange, isValidPhone }: PhoneNumberInputProps) => {
  return (
    <View style={commonStyles.fieldContainer}>
      <Text style={commonStyles.label}>Phone Number</Text>
      <TextInput
        style={[
          commonStyles.input,
          phoneError ? commonStyles.inputError : commonStyles.inputValid
        ]}
        value={phoneNumber}
        onChangeText={handlePhoneChange}
        placeholder="05X-XXXXXXX"
        keyboardType="numeric"
        maxLength={11}
      />
      {phoneError ? (
        <Text style={commonStyles.errorText}>{phoneError}</Text>
      ) : null}
    </View>
  );
};

export default PhoneNumberInput;