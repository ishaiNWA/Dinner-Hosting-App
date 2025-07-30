import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { use, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

import PublishEventModal from '@/components/modals/PublishEventModal';
import { publishEvent } from '@/services/events';
import { EventSummary } from '@/types/events';
import { formatEventDate } from '@/services/utils';


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



export default function HostDashboard() {

   const [events, setEvents] = useState<EventSummary[]>([]);
   const {userName , logoutCoordinator} = useAuthContext();
   const [isPublishEventModalVisible, setIsPublishEventModalVisible] = useState(false);
  

   const selectEvent = (eventId: string)=>{
    console.log('selectEvent', eventId);
   }

   const renderEvent = (event: EventSummary)=>{
    return (
      <TouchableOpacity style={styles.eventEntryButton} onPress={()=>selectEvent(event._id)}>
      <View style={styles.eventEntry}>
        <Text style={styles.eventName}>{event.eventName}</Text>
        <Text style={styles.eventDate}>{formatEventDate(event.timing.eventDate)}</Text>
        <Text style={styles.eventParticipants}>{event.participantCount}</Text>
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

      setEvents([...events, eventSummery]);
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
      <PublishEventModal
        visible={isPublishEventModalVisible}
        onClose={handleClosePublishEventModal}
        onSubmit={handlePublishEvent}
        existingEventDates={events.map((event)=>event.timing.eventDate)} // Use correct path from EventSummary interface
      />

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
}); 