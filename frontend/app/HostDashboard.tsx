import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { use, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList , Modal, TextInput, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTimeWeekFromNow } from '@/services/utils';
import AddressInput from '@/components/forms/AddressInput';
import useAddressContext from './hooks/useAddressContext';

const mockEventsData = [
  {
    _id: "507f1f77bcf86cd799439011",
    eventName: "Team Building Workshop",
    date: "2025-08-15",
    participants: 12
  },
  {
    _id: "507f1f77bcf86cd799439012",
    eventName: "Product Launch Presentation",
    date: "2025-09-03",
    participants: 45
  },
  {
    _id: "507f1f77bcf86cd799439013",
    eventName: "Annual Company Retreat",
    date: "2025-10-20",
    participants: 87
  },
  {
    _id: "507f1f77bcf86cd799439014",
    eventName: "Client Strategy Meeting",
    date: "2025-08-28",
    participants: 8
  },
  {
    _id: "507f1f77bcf86cd799439015",
    eventName: "Holiday Party Planning",
    date: "2025-11-12",
    participants: 23
  }
];

const FIELD_INPUT_ERROR_MESSAGES = {
  newEventName: 'event name must be between 3 and 25 characters',
  newEventDate: 'event date must be at least one week from now',
}
const INVALID_DATE_PLACEHOLDER = new Date()

export default function HostDashboard() {

   const [events, setEvents] = useState(mockEventsData);
   const {userName , logoutCoordinator} = useAuthContext();
   const [isPublishEventModalVisible, setIsPublishEventModalVisible] = useState(false);

  const [newEventName, setNewEventName] = useState('');
  const [newEventNameError, setNewEventNameError] = useState('');

  const [newEventDate, setNewEventDate] = useState<Date>(INVALID_DATE_PLACEHOLDER);
  const [newEventDateError, setNewEventDateError] = useState('');
  const [showMobileDatePicker, setShowMobileDatePicker] = useState(false);

  const addressContextObject = useAddressContext();

  const handleNewEventNameChange = (text: string)=>{
    setNewEventName(text);
    if(text.length < 3 || text.length > 25){
      setNewEventNameError(FIELD_INPUT_ERROR_MESSAGES.newEventName);
    }else{
      setNewEventNameError('');
    }
  }

  const handleNewEventDateChange = (event: any, selectedDate?: Date | undefined)=>{
    if(selectedDate && selectedDate < getTimeWeekFromNow()){
      setNewEventDateError(FIELD_INPUT_ERROR_MESSAGES.newEventDate);
    }else{
      setNewEventDateError('');
    }
    if(selectedDate){
      setNewEventDate(selectedDate);
    }
    if(Platform.OS !== 'web'){
      setShowMobileDatePicker(false);
    }
  }

   const selectEvent = (eventId: string)=>{
    console.log('selectEvent', eventId);
   }

   const renderEvent = (event: any)=>{
    return (
      <TouchableOpacity style={styles.eventEntryButton} onPress={()=>selectEvent(event._id)}>
      <View style={styles.eventEntry}>
        <Text style={styles.eventName}>{event.eventName}</Text>
        <Text style={styles.eventDate}>{event.date}</Text>
        <Text style={styles.eventParticipants}>{event.participants}</Text>
      </View>
      </TouchableOpacity>
    )
   }

   const logOutHandler = async ()=>{
    await logoutCoordinator();
    router.replace('/');
   }

  return (
    <View style={styles.dashboardScreen}>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logOutHandler}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Publish Event Button */}
      <TouchableOpacity style={styles.publishEventButton} onPress={()=>setIsPublishEventModalVisible(true)}>
          <Text>Publish New Event</Text>
        </TouchableOpacity>

      <Text style={styles.title}>welcome {userName}</Text>

        {/* Published Events */}
      <View style={styles.eventsContainer}>
         <Text style={styles.eventsContainerTitle}>published events</Text>
         <View style={styles.eventsHeaderTopBar}>
          <Text style={styles.eventsHeaderTopBarTitle}>event name</Text>
          <Text style={styles.eventsHeaderTopBarTitle}>date</Text>
          <Text style={styles.eventsHeaderTopBarTitle}>participants</Text>
         </View>
         <FlatList data={events} 
         renderItem={({item})=>renderEvent(item)}
         keyExtractor={(item)=>item._id}
         />
      </View>

      {/* Publish Event Modal */}
      <Modal
          animationType="slide"
          transparent={true}
          visible={isPublishEventModalVisible}
          onRequestClose={()=>setIsPublishEventModalVisible(false)}
        >
          <View style={styles.publishEventModal}>
            <Text>publishEventModal !</Text>
            <View style={styles.newEventForm}>
                
                            {/* event name field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Event Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    newEventNameError ? styles.inputError : styles.inputValid
                  ]}
                  value={newEventName}
                  onChangeText={handleNewEventNameChange}
                  placeholder="event's name"
                
                  maxLength={25}
                />
                {newEventNameError ? (
                  <Text style={styles.fieldErrorText}>{newEventNameError}</Text>
                ) : null}
          </View>
              
              {/* event date field */}
                <View style={styles.fieldContainer}>
              
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
                  style={styles.dateInput}
                  
                />
                
                {newEventDateError ? (
                  <Text style={styles.fieldErrorText}>{newEventDateError}</Text>
                ) : null}
                </View>
                ) : (
                  <View>
                    <TouchableOpacity  
                      style={[styles.selectDateButton]} 
                      onPress={()=>setShowMobileDatePicker(true)}>
                      <Text style={styles.selectDateButtonText}>
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
                  <Text style={styles.fieldErrorText}>{newEventDateError}</Text>
                ) : null}
                  </View>
                )
              }
              </View>

              {/* event address field */}
                <View style={styles.fieldContainer}>
              <AddressInput
                {...addressContextObject}
              />
              </View>
              
              {/* event is kosher field */}
                <View style={styles.fieldContainer}>
              
              </View>
              
              {/* event is vagen friendly field */}
                <View style={styles.fieldContainer}>
              
              </View>
              
              {/* event free notes field */}
                <View style={styles.fieldContainer}>
              
              </View>
            </View>
          </View>
        </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
  },
  dashboardScreen: {
    flex: 1,
    backgroundColor: '#d4a5a5', // Grey-red background per cursor rules
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  eventsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  eventsContainerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  eventsHeaderTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  eventsHeaderTopBarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  eventEntryButton: {
    marginBottom: 8,
  },
  eventEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  eventName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  eventDate: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  eventParticipants: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    zIndex: 1,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  publishEventButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
  },
  publishEventModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  newEventForm: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  inputError: {
    borderColor: 'red',
  },
  inputValid: {
    borderColor: 'green',
  },
  fieldErrorText: {
    color: 'red',
    fontSize: 12,
  },
  dateInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  selectDateButton: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  selectDateButtonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 