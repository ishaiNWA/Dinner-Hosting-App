// User management API calls - profile, preferences 

import { Config, HttpMethod } from "@/constants/Config";
import { apiRequest } from "./api";

const { ENDPOINTS } = Config;

export const me = async () => {
    try {
        console.log('HttpMethod.GET , ENDPOINTS.USERS.PROFILE: ', HttpMethod.GET , ENDPOINTS.USERS.PROFILE);





        console.log('me endpoint: ', ENDPOINTS.USERS.PROFILE);
        const response = await apiRequest(HttpMethod.GET, ENDPOINTS.USERS.PROFILE);
        console.log(`me response: ${JSON.stringify(response)}`);
        return response.data;
    } catch (error: any) {
        return error;
    }
}; 