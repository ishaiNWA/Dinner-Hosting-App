import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, FlatList, Keyboard } from 'react-native';
import GuestIdInput from '../forms/GuestIdInput';
import DietaryRestrictionsInput from '../forms/DietaryRestrictionsInput';
import AllergiesInput from '../forms/AllergiesInput';
import PlusOneInput from '../forms/PlusOneInput';
import NotesInput from '../forms/NotesInput';
import useGuestIdContext from '@/app/hooks/useGuestIdContext';
import useDietaryRestrictionsContext from '@/app/hooks/useDietaryRestrictionsContext';
import useAllergiesContext from '@/app/hooks/useAllergiesContext';

interface BookParticipantModalProps {
    visible: boolean;
    onClose: () => void;
}

function BookParticipantModal({ visible, onClose }: BookParticipantModalProps) {

    const [isBookingParticipantProcess, setIsBookingParticipantProcess] = useState(false);
    const guestIdContext = useGuestIdContext();
    const dietaryRestrictionsContext = useDietaryRestrictionsContext();
    const allergiesContext = useAllergiesContext();


    const clearForm = ()=>{
        dietaryRestrictionsContext.clearForm();
        guestIdContext.clearGuestId();
    }

    const handleBookParticipant = ()=>{
        //TODO:: implement booking participant
    }

    const handleCloseModal = ()=>{
        //TODO:: implement close modal
        clearForm();
        onClose();
    }

    const isBookingFormValid = ()=>{
        //TODO:: implement booking form validation
        return true;
    }

    return (
        <Modal
            visible={visible}
            onRequestClose={handleCloseModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.bookParticipantModalContent}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Book Participant</Text>
                    </View>
                    <View style={styles.formContainer}>
                        <FlatList
                            data={[
                                {
                                    key: 'guestId', 
                                    component: (
                                      <GuestIdInput
                                      guestIdContext={guestIdContext}
                                      />
                                    )
                                },
                                {
                                    key: 'dietaryRestrictions',
                                    component: (
                                        <DietaryRestrictionsInput
                                        dietaryRestrictionsContext={dietaryRestrictionsContext}
                                        />
                                    )
                                },
                                {
                                    key: 'allergies',
                                    component: (
                                        <AllergiesInput
                                        allergiesContext={allergiesContext}
                                        />
                                    )
                                },
                                {
                                    key: 'plusOne',
                                    component: (
                                        <PlusOneInput
                                        />
                                    )
                                },
                                {
                                    key: 'notes',
                                    // component: (
                                    //             // <NotesInput
                                    //     // notesContext={notesContext}
                                    //     // />
                                    // )
                                },
                            ]}
                            renderItem={({item})=>{
                                return <View style={styles.fieldContainer}>
                                    {item.component}
                                </View>
                            }}
                            keyExtractor={(item)=>item.key}
                            contentContainerStyle={styles.scrollViewContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            onScrollBeginDrag={Keyboard.dismiss}
                        />
                    </View>
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
                            (isBookingParticipantProcess || !isBookingFormValid()) ? styles.submitButtonDisabled : {}
                        ]} 
                        onPress={handleBookParticipant}
                        disabled={isBookingParticipantProcess || !isBookingFormValid()}
                        >
                        {isBookingParticipantProcess ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={[styles.buttonText, styles.submitButtonText]}>Book Participant</Text>
                        )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default BookParticipantModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    bookParticipantModalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    bookParticipantText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 20,
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
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
    },
    cancelButtonText: {
        color: '#fff',
    },
    submitButton: {
        backgroundColor: '#28a745',
    },
    submitButtonText: {
        color: '#fff',
    },
    submitButtonDisabled: {
        backgroundColor: '#6c757d',
        opacity: 0.6,
    },
    fieldContainer: {
        width: '100%',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginRight: 10,
        minWidth: 120,
    },
    fieldInput: {
        flex: 1,
        minWidth: 150,
    },
    fieldError: {
        fontSize: 14,
        color: '#FF3B30',
        marginTop: 5,
        width: '100%',
        marginLeft: 130, // Align with input (label width + marginRight)
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});
