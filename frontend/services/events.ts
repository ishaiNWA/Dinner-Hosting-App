// Events API calls - CRUD operations for events 

import { apiRequest } from "./api";
import { Config, HttpMethod } from '../constants/Config';

const API_URL = Config.API_URL;
const PUBLISH_EVENT_URL = Config.ENDPOINTS.EVENTS.CREATE;
// url: POST api/events

async function publishEvent(eventFormData: any){

    let url = `${API_URL}${PUBLISH_EVENT_URL}`;
    let response;
    try{
     response = await apiRequest(HttpMethod.POST, url, eventFormData);
     
     console.log(`PUBLISH EVENT RESPONSE: ${JSON.stringify(response)}`)
    }catch(error){
        console.log(`error while trying to publish new event: ${error}`)
    }
    return response;
}

export { publishEvent };