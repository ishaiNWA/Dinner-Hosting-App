// Events API calls - CRUD operations for events 

import { apiRequest } from "./api";
import { Config, HttpMethod } from '../constants/Config';
import { EventSummary } from "@/types/events";
import { GuestsDetails } from "@/types/guest";

const API_URL = Config.API_URL;
const PUBLISH_EVENT_URL = Config.ENDPOINTS.EVENTS.CREATE;
const FETCH_ALL_PUBLISHED_EVENTS_URL = Config.ENDPOINTS.EVENTS.FETCH_ALL_PUBLISHED;

// url: POST api/events

async function publishEvent(eventFormData: any){

    let url = `${API_URL}${PUBLISH_EVENT_URL}`;
    let response;
    try{
     response = await apiRequest(HttpMethod.POST, url, eventFormData);

    console.log(`DEBUG!!!: publishEvent response: ${JSON.stringify(response)}`)

    if(response.data.success === true){
        console.log(`Success response!`)
        const eventSummary: EventSummary = response.data.data.event;
        return {
            success: true,
            eventSummary: eventSummary
        };
    }else{
        return {
            success: false,
            error: response.data.message
        };
    }

    }catch(error){
        return {
            success: false,
            error: error
        };
    }
}



async function fetchAllPublishedEvents(){

    let url = `${API_URL}${FETCH_ALL_PUBLISHED_EVENTS_URL}`;

    try{

         let response = await apiRequest(HttpMethod.GET, url);
         if(response.data.success === true){
            const eventsArray: EventSummary[] = response.data.data.events;
            return {
                success: true,
                events: eventsArray
            };
         }else{
            return {
                success: false,
                error: response.data.message
            };
         }
    }catch(error){
        return {
            success: false,
            error: error
        };
    }
}


async function getSinglePublishedEvent(eventId: string){

    const FETCH_SINGLE_PUBLISHED_EVENT_URL = Config.ENDPOINTS.EVENTS.GET_BY_ID(eventId);
    let url = `${API_URL}${FETCH_SINGLE_PUBLISHED_EVENT_URL}`;

    try{
        let response = await apiRequest(HttpMethod.GET, url);

        if(response.data.success === true){
            return {
                success: true,
                data: response.data.data
            }
        }else{
            throw new Error(response.data.message);
        }
    }catch(error){
        return {
            success: false,
            error: error
        };
    }
}

// Data extraction - transforms for specific use case
 const getEventParticipants = async (eventId: string) => {
    try{
    const eventDetails = await getSinglePublishedEvent(eventId);
    if(eventDetails.success && eventDetails.data?.participants ){
      let guestsDetails: GuestsDetails = [];
      guestsDetails = eventDetails.data.participants.map((p: any) => ({
        id: p.id,
        name: p.name,
        phone: p.phone,
        allergies: p.allergies,
        dietaryRestrictions: p.dietaryRestrictions,
        plusOne: p.plusOne,
        notes: p.notes
      }));
      return {
        success: true,
        data: guestsDetails as GuestsDetails
      };
    };
    }
    catch(error){
        return{
            success: false,
            error: error
        }
    } 
    }

export { publishEvent, fetchAllPublishedEvents, getEventParticipants };