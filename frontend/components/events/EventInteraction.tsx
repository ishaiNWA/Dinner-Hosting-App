// EventInteraction Modal Component - Display and interact with specific event

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { EventDataItem, EventSummary } from "@/types/events";
import EventDetailsTab from './EventDetailsTab';
import EventParticipantsTab from './EventParticipantsTab';
import { getEventParticipants } from '@/services/events';
import { GuestsDetails } from '@/types/guest';

interface EventInteractionProps {
    visible: boolean;
    eventdata: EventDataItem;
    onBookParticipant: () => void;
    onClose: () => void;
}



type TabType = 'eventDetailsTab' | 'participantsTab';

function EventInteraction({ visible, eventdata, onBookParticipant, onClose }: EventInteractionProps) {
    const [activeTab, setActiveTab] = useState<TabType>('eventDetailsTab');
    const [isBookParticipantModalVisible, setIsBookParticipantModalVisible] = useState(false);
    const[isLoading, setIsLoading] = useState(false);
    const[cachedGuestsDetails, setCachedGuestsDetails] = useState<Map <string, GuestsDetails>>(new Map());
    const [currentEventGuestsDetails, setCurrentEventGuestsDetails] = useState<GuestsDetails>([]);

    
    useEffect(()=>{
        const fetchGuestDetails = async ()=>{
            try{
                setIsLoading(true);
                const response = await getEventParticipants(eventdata.eventSummary._id);
                if(response &&response.success && response.data){
                    cachedGuestsDetails.set(eventdata.eventSummary._id, response.data);
                    setCurrentEventGuestsDetails(response.data);
                    console.log(JSON.stringify(response.data));
                }
                else{
                    throw new Error(response?.error as string || 'Failed to fetch data');
                }
                
                eventdata.isGuestDetailsCached = true;
            }
            catch(error){
                console.error('Error fetching guest details:', error);
                handleClose();
            }
            finally{
                setIsLoading(false);
            }
        }
        
        // Check cache first
        if (cachedGuestsDetails.has(eventdata.eventSummary._id) && eventdata.isGuestDetailsCached) {
            let guestsDetails = cachedGuestsDetails.get(eventdata.eventSummary._id);
            setCurrentEventGuestsDetails(guestsDetails as GuestsDetails);
            eventdata.isGuestDetailsCached = true;
        }else{
            fetchGuestDetails();
        }
    },[eventdata])



    const handleClose = () => {
        console.log('Close EventInteraction modal');
        onClose();
    }

    const clearForm = ()=>{

    }

    const handleBookParticipant = ()=>{
        console.log('Book Participant');
        onBookParticipant();
        setIsBookParticipantModalVisible(true);
    }

    const handleCloseBookParticipantModal = () => {
        setIsBookParticipantModalVisible(false);
    }

    return (
        <Modal
            visible={visible}
            onRequestClose={handleClose}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Event Details</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tab Selector */}
                    <View style={styles.tabSelectorContainer}>
                        <TouchableOpacity 
                            style={[
                                styles.tabButton, 
                                activeTab === 'eventDetailsTab' && styles.activeTabButton
                            ]} 
                            onPress={() => setActiveTab('eventDetailsTab')}
                        >
                            <Text style={[
                                styles.tabButtonText,
                                activeTab === 'eventDetailsTab' && styles.activeTabButtonText
                            ]}>
                                Event Details
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.tabButton, 
                                activeTab === 'participantsTab' && styles.activeTabButton
                            ]} 
                            onPress={() => setActiveTab('participantsTab')}
                        >
                            <Text style={[
                                styles.tabButtonText,
                                activeTab === 'participantsTab' && styles.activeTabButtonText
                            ]}>
                                Participants
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tab Content */}
                    <View style={styles.tabPresentationContainer}>
                        {activeTab === 'eventDetailsTab' && <EventDetailsTab  />}
                        {activeTab === 'participantsTab' && <EventParticipantsTab  />}
                    </View>

                    {/* Lower Action Buttons */}
                    <View style={styles.lowerButtonsContainer}>
                        <TouchableOpacity style={[styles.lowerButton, styles.bookButton]} onPress={handleBookParticipant}>
                            <Text style={styles.lowerButtonText}>Book Participant</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.lowerButton, styles.closeButtonStyle]} onPress={handleClose}>
                            <Text style={styles.lowerButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Book Participant Modal */}
            <Modal
                visible={isBookParticipantModalVisible}
                onRequestClose={() => setIsBookParticipantModalVisible(false)}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.bookParticipantModalContent}>
                        <View style={styles.header}>
                            <Text style={styles.modalTitle}>Book Participant</Text>
                            <TouchableOpacity onPress={() => setIsBookParticipantModalVisible(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bookParticipantContent}>
                            <Text style={styles.bookParticipantText}>Book Participant functionality coming soon...</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </Modal>
    )
}

export default EventInteraction;



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
        maxWidth: 600, // Slightly bigger than PublishEventModal (500)
        maxHeight: '90%',
        minHeight: 400,
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
    tabSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    activeTabButton: {
        backgroundColor: '#007bff',
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    activeTabButtonText: {
        color: '#fff',
    },
    tabPresentationContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    lowerButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 20,
    },
    lowerButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    lowerButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    bookButton: {
        backgroundColor: '#28a745', // Green for book action
    },
    closeButtonStyle: {
        backgroundColor: '#6c757d', // Gray for close action
    },
    bookParticipantModalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    bookParticipantContent: {
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
});

