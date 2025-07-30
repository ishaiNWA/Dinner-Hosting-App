    import { commonStyles } from "@/styles/commonStyles";
    import { Text, TextInput } from "react-native";
import { View } from "react-native";



interface EventNameInputProps {
    newEventName: string;
    newEventNameError: string;
    handleNewEventNameChange: (text: string) => void;
}

const EventNameInput = ( {newEventName, newEventNameError, handleNewEventNameChange}: EventNameInputProps )=>{
    return (
        <View style={commonStyles.fieldContainer}>
        <Text style={commonStyles.label}>Event Name</Text>
        <TextInput
          style={[
            commonStyles.input,
            newEventNameError ? commonStyles.inputError : commonStyles.inputValid
          ]}
          value={newEventName}
          onChangeText={handleNewEventNameChange}
          placeholder="event's name"
        
          maxLength={25}
        />
        {newEventNameError || newEventName.length === 0 ? (
            <Text style={commonStyles.errorText}>
                {newEventNameError || 'Event name is required'}
            </Text>
        ) : null}
  </View>           
    )
}

export default EventNameInput;