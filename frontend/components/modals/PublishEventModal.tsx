import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import EventNameInput from '@/components/forms/EventNameInput';
import DateInput from '@/components/forms/DateInput';
import AddressInput from '@/components/forms/AddressInput';
import DropdownButton from '@/components/buttons/dropdown-buttons';
import NotesInput from '@/components/forms/NotesInput';
import useEventNameContext from '@/app/hooks/useEventNameContext';
import useDateContext from '@/app/hooks/useDateContext';
import useAddressContext from '@/app/hooks/useAddressContext';
import useKosherContext from '@/app/hooks/useKosherContext';
import useVeganContext from '@/app/hooks/useVeganContext';
import useNotesContext from '@/app/hooks/useNotesContext';

const INVALID_DATE_PLACEHOLDER = new Date();


//build the event form data for the API call according to validation schema in the backend
const buildPublishEventBody = (eventName: string, eventDate: Date, address: string, kosher: boolean, vegan: boolean, notes: string)=>{
  return {
    eventForm: {
      eventName: eventName,
      timing: {
        eventDate: eventDate,
      },
      location: {
        address: address,
      },
      dietary: {
        isKosher: kosher,
        isVeganFriendly: vegan,
        additionalOptions: notes,
      }
    }
  }
}


interface PublishEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (eventFormData: any) => Promise<{success: boolean, error?: Error, message?: string}>;
  existingEventDates: string[];
}

const PublishEventModal = ({
  visible,
  onClose,
  onSubmit,
  existingEventDates
}: PublishEventModalProps) => {


    const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
    const eventNameContextObject = useEventNameContext();
    const dateContextObject = useDateContext(existingEventDates);
    const addressContextObject = useAddressContext();
    const kosherContextObject = useKosherContext();
    const veganContextObject = useVeganContext();
    const notesContextObject = useNotesContext();

    const clearForm = ()=>{
        eventNameContextObject.clearEventName();
        dateContextObject.clearDate();
        addressContextObject.clearAddress();
        kosherContextObject.clearKosher();
        veganContextObject.clearVegan();
        notesContextObject.clearNotes();
    }

    const isEventFormValid = ()=>{
        console.log('isEventFormValid', eventNameContextObject.isEventNameValid(), dateContextObject.isDateValid(), addressContextObject.isAddressValid(), kosherContextObject.isKosherValid(), veganContextObject.isVeganValid(), notesContextObject.isValidNotes());
        return eventNameContextObject.isEventNameValid() && dateContextObject.isDateValid() 
        && addressContextObject.isAddressValid() && kosherContextObject.isKosherValid() 
        && veganContextObject.isVeganValid() && notesContextObject.isValidNotes();
       }


       const handleSubmitEvent = async ()=>{
        setIsSubmittingEvent(true);
        const eventFormData = buildPublishEventBody(eventNameContextObject.newEventName,
             dateContextObject.newEventDate, addressContextObject.address,
              kosherContextObject.kosher === 'Yes' ? true : false ,
               veganContextObject.vegan === 'Yes' ? true : false,
                notesContextObject.notes);
        console.log('API call to publish event');   

        const response = await onSubmit(eventFormData);
        if(response.success){
            console.log('event published successfully - close modal');
            handleCloseModal();
        }else if(response.error){
            console.log('error publishing event - show error message');
            setIsSubmittingEvent(false);
            return;
        }
       }

       const handleCloseModal = ()=>{
        setIsSubmittingEvent(false);
        clearForm();
        onClose();
       }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Publish New Event</Text>
          
          <FlatList 
            data={[
              { 
                key: 'eventName', 
                component: (
                  <EventNameInput
                    newEventName={eventNameContextObject.newEventName}
                    newEventNameError={eventNameContextObject.newEventNameError}
                    handleNewEventNameChange={eventNameContextObject.handleNewEventNameChange}
                  />
                )
              },
              { 
                key: 'eventDate', 
                component: (
                  <DateInput
                    newEventDate={dateContextObject.newEventDate}
                    newEventDateError={dateContextObject.newEventDateError}
                    showMobileDatePicker={dateContextObject.showMobileDatePicker}
                    setShowMobileDatePicker={dateContextObject.setShowMobileDatePicker}
                    handleNewEventDateChange={dateContextObject.handleNewEventDateChange}
                  />
                )
              },
              { 
                key: 'eventAddress', 
                component: <AddressInput {...addressContextObject} />
              },
              { 
                key: 'kosher', 
                component: (
                  <DropdownButton 
                    text="Kosher"
                    state={kosherContextObject.kosher}
                    setState={kosherContextObject.setKosher}
                    error={kosherContextObject.kosherError}
                    errorMessages={kosherContextObject.kosherErrorMessages}
                    showDropdown={kosherContextObject.showKosherDropDown}
                    setShowDropdown={kosherContextObject.setShowKosherDropDown}
                    dropdownOptionsArray={kosherContextObject.kosherDropDownOptionsArray}
                    handleDropdownOptionSelection={kosherContextObject.handleDropdownOptionSelection}
                  />
                )
              },
              { 
                key: 'vegan', 
                component: (
                  <DropdownButton 
                    text="Vegan Friendly"
                    state={veganContextObject.vegan}
                    setState={veganContextObject.setVegan}
                    error={veganContextObject.veganError}
                    errorMessages={veganContextObject.veganErrorMessages}
                    showDropdown={veganContextObject.showVeganDropDown}
                    setShowDropdown={veganContextObject.setShowVeganDropDown}
                    dropdownOptionsArray={veganContextObject.veganDropDownOptionsArray}
                    handleDropdownOptionSelection={veganContextObject.handleDropdownOptionSelection}
                  />
                )
              },
              { 
                key: 'notes', 
                component: <NotesInput {...notesContextObject} />
              }
            ]}
            renderItem={({ item }) => (
              <View style={styles.fieldContainer}>
                {item.component}
              </View>
            )}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={handleCloseModal}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.submitButton, 
                (isSubmittingEvent || !isEventFormValid()) ? styles.submitButtonDisabled : {}
              ]} 
              onPress={handleSubmitEvent}
              disabled={isSubmittingEvent || !isEventFormValid()}
            >
              {isSubmittingEvent ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[styles.buttonText, styles.submitButtonText]}>Submit Event</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%', // Increased from 80% to 90%
    minHeight: 400, // Add minimum height
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10, // Add some top margin
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#007bff',
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#fff',
  },
  submitButtonText: {
    color: '#fff',
  },
});

export default PublishEventModal; 