// User management API calls - profile, preferences 

import { Config, HttpMethod } from "@/constants/Config";
import { apiRequest } from "./api";
import { User } from "@/types/auth";
import { ValidUserProfileFieldsArray } from "@/types/profile-params";

const { ENDPOINTS } = Config;

export const getUserProfile = async (fields?: ValidUserProfileFieldsArray, include?: ValidUserProfileFieldsArray) => {

    let queryParams = '';
    
    if (fields && fields.length > 0) {
        // Create query params from fields array
        const fieldsParam = fields.join(',');
        queryParams = `fields=${encodeURIComponent(fieldsParam)}`;
    }else if(include && include.length > 0){
        const includeParam = include.join(',');
        queryParams = `include=${encodeURIComponent(includeParam)}`;
    }

    try {

        
        const url = queryParams ? `${ENDPOINTS.USERS.PROFILE}?${queryParams}` : ENDPOINTS.USERS.PROFILE;
        const response = await apiRequest(HttpMethod.GET, url);
        console.log("ORIGINAL RESPONSE: ", JSON.stringify(response));
        return response.data;
    } catch (error: any) {
        return error;
    }
}; 

export const getUserAddress = async ()=>{
    try{
          const data = await getUserProfile([Config.PROFILE_FIELDS.ADDRESS]);
          console.log("GET USER ADDRESS DATA: ", JSON.stringify(data));
          return data.user.address;
    }catch(error: any){
        return error;
    }
} 