import { commonStyles } from "@/styles/commonStyles";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

const INVALID_DATE_PLACEHOLDER = new Date()

    interface DateInputProps {  
        newEventDate: Date;
        newEventDateError: string;
        showMobileDatePicker: boolean;
        setShowMobileDatePicker: (show: boolean) => void;
        handleNewEventDateChange: (event: any, selectedDate?: Date | undefined) => void;
    }

const useDateInput = ( {newEventDate, newEventDateError, showMobileDatePicker, setShowMobileDatePicker, handleNewEventDateChange}: DateInputProps )=>{


    return(

            <View style={commonStyles.fieldContainer}>
                <Text style={commonStyles.label}>Date</Text>
                
              {/* event date field */}
              <View style={commonStyles.fieldContainer}>
              
              {
                Platform.OS === 'web' ? (
                  <View>
                  <input
                  type="date"
                  value={newEventDate.toISOString().split('T')[0]} // Convert to YYYY-MM-DD
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    handleNewEventDateChange(null, selectedDate);
                  }}
                  style={commonStyles.input}
                  
                />
                
                {newEventDateError ? (
                  <Text style={commonStyles.errorText}>{newEventDateError}</Text>
                ) : null}
                </View>
                ) : (
                  <View>
                    <TouchableOpacity  
                            style={[commonStyles.input]} 
                      onPress={()=>setShowMobileDatePicker(true)}>
                      <Text style={commonStyles.input}>
                        {newEventDate !== INVALID_DATE_PLACEHOLDER ?
                      newEventDate.toLocaleDateString() 
                          : "Select Date"
                        }
                      </Text>
                    </TouchableOpacity>
                    {showMobileDatePicker && (
                      <DateTimePicker
                        value={newEventDate}
                        onChange={handleNewEventDateChange}
                        mode="date"
                        display="default"
                      />
                    )}
                    {newEventDateError ? (
                    <Text style={commonStyles.errorText}>{newEventDateError}</Text>
                ) : null}
                  </View>
                )
              }
            </View>
        </View>
    )
}

export default useDateInput;