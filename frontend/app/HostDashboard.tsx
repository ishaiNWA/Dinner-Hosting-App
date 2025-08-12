import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { use, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';

import PublishEventModal from '@/components/modals/PublishEventModal';
import { fetchAllPublishedEvents, publishEvent } from '@/services/events';
import { EventSummary, EventDataItem } from '@/types/events';
import { formatEventDate } from '@/services/utils';
import EventInteraction from '@/components/events/EventInteraction';
import { GuestsDetails } from '@/types/guest';

const INITIAL_WAIT_TIME = 1000;



export default function HostDashboard() {


  // State variables
  const [eventsDataItems, setEventsDataItems] = useState<Array<EventDataItem>>([]);
  const {userName , logoutCoordinator} = useAuthContext();
  const [isPublishEventModalVisible, setIsPublishEventModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const[isEventInteractionModalVisible, setIsEventInteractionModalVisible] = useState(false);
  const[selectedEventDataItem, setSelectedEventDataItem] = useState<EventDataItem | null>(null);

  const MAX_RETRIES = 3;
  const INITIAL_WAIT_TIME = 1000; // 1 second

  useEffect(() => {
    const initEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetchAllPublishedEvents();
        
        if (response.success && response.events) {
          const eventsWithDetails = response.events.map((event: EventSummary) => ({
            eventSummary: event,
            isGuestDetailsCached: false,
          }));
          setEventsDataItems(eventsWithDetails);
          setIsLoading(false);
        } else {
          throw new Error('Failed to fetch events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        
        if (retryCount < MAX_RETRIES) {
          // Exponential backoff retry
          const backoffTime = INITIAL_WAIT_TIME * Math.pow(2, retryCount);
          setRetryCount(prev => prev + 1);
          
          setTimeout(() => {
            initEvents();
          }, backoffTime);
        } else {
          // Max retries reached - show error
          setError('Failed to load events. Please try again later.');
          setIsLoading(false);
        }
      }
    };

    initEvents();
  }, [retryCount]);



   const handleSelectEvent = (eventDataItem: EventDataItem)=>{
    console.log('selectEvent', eventDataItem.eventSummary._id);
    setSelectedEventDataItem(eventDataItem);
    setIsEventInteractionModalVisible(true);
   }

   const handleBookParticipant = (eventId: string )=>{
      
    let newEventDataItems = eventsDataItems.map((item)=>{
      if(item.eventSummary._id === eventId){
        return{
          ...item,
          isGuestDetailsCached: false
        }
      }
      return item;
    })
    setEventsDataItems(newEventDataItems);
   }

   const renderEvent = (eventDataItem: EventDataItem)=>{
    return (
      <TouchableOpacity style={styles.eventEntryButton} onPress={()=>handleSelectEvent(eventDataItem)}>
      <View style={styles.eventEntry}>
        <Text style={styles.eventName}>{eventDataItem.eventSummary.eventName}</Text>
        <Text style={styles.eventDate}>{formatEventDate(eventDataItem.eventSummary.timing.eventDate)}</Text>
        <Text style={styles.eventParticipants}>{eventDataItem.eventSummary.participantCount}</Text>
      </View>
      </TouchableOpacity>
    )
   }
   const logOutHandler = async ()=>{
    await logoutCoordinator();
    router.replace('/');
   }

   const handlePublishEvent =  async (eventFormData: any)=>{
    

    console.log('API call to publish event');

    const response = await publishEvent(eventFormData);

    console.log(`DEBUG IN HOST DASHBOARD!!!: handlePublishEvent response: ${JSON.stringify(response)}`)

    if(response.success && response.eventSummary){
      let eventSummery = response.eventSummary;

      let newEventDataItem: EventDataItem = {
        eventSummary: eventSummery,
        isGuestDetailsCached: false
      }
      let newEventsDataItems = [...eventsDataItems, newEventDataItem];
      setEventsDataItems(newEventsDataItems);
      return {
        success: true,
        message: 'Event published successfully'
      }
    }else{
      return {
        success: false,
        error: response.error
      }
    }
   }

   const handleClosePublishEventModal = ()=>{
    setIsPublishEventModalVisible(false);
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

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>
            {retryCount > 0 ? `Retrying... (${retryCount}/${MAX_RETRIES})` : 'Loading events...'}
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              setRetryCount(0);
              setError(null);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Published Events list */}
      {!isLoading && !error && (
        <View style={styles.eventsContainer}>
           <Text style={styles.eventsContainerTitle}>published events</Text>
           <View style={styles.eventsHeaderTopBar}>
            <Text style={styles.eventsHeaderTopBarTitle}>event name</Text>
            <Text style={styles.eventsHeaderTopBarTitle}>date</Text>
            <Text style={styles.eventsHeaderTopBarTitle}>participants</Text>
           </View>
           <FlatList data={eventsDataItems} 
           renderItem={({item})=>renderEvent(item)}
           keyExtractor={(item)=>item.eventSummary._id}
           />
        </View>
      )}

      {/* Publish Event Modal */}
      <PublishEventModal
        visible={isPublishEventModalVisible}
        onClose={handleClosePublishEventModal}
        onSubmit={handlePublishEvent}
        existingEventDates={eventsDataItems.map((item)=>item.eventSummary.timing.eventDate)} // Use correct path from EventSummary interface
      />

      {/* Event Interaction Modal */}
      {selectedEventDataItem && (
        <EventInteraction
          visible={isEventInteractionModalVisible}
          eventdata={selectedEventDataItem}
          onBookParticipant={()=>handleBookParticipant(selectedEventDataItem.eventSummary._id)}
          onClose={() => {
            setIsEventInteractionModalVisible(false);
            setSelectedEventDataItem(null);
          }}
        />
      )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 