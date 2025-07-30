import { commonStyles } from "@/styles/commonStyles";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native";

const styles = StyleSheet.create({
  notesInput: {
    ...commonStyles.input,
    minHeight: 80,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
});

interface NotesInputProps {
  notes: string;
  notesError: string;
  handleNoteChange: (text: string) => void;
  isValidNotes: () => boolean;
}
const NotesInput = ( {notes, notesError, handleNoteChange, isValidNotes}: NotesInputProps ) => {
    return (
        <View style={commonStyles.fieldContainer}>
    <Text style={commonStyles.label}>Notes</Text>
    <TextInput
        style={[
          styles.notesInput,
          notesError ? commonStyles.inputError : commonStyles.inputValid
        ]}
        value={notes}
        onChangeText={handleNoteChange}
        placeholder="Add any special requests, dietary restrictions, or additional information..."
        placeholderTextColor="#999"
        multiline={true}
        numberOfLines={4}
        maxLength={500}
        textAlignVertical="top"
        blurOnSubmit={false}
        returnKeyType="default"
      />
      <Text style={styles.characterCount}>
        {notes.length}/500 characters
      </Text>
      {notesError ? (
        <Text style={commonStyles.errorText}>{notesError}</Text>
      ) : null}
  </View>
    )
};

export default NotesInput;