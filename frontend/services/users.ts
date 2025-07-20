// User management API calls - profile, preferences 

import { Config, HttpMethod } from "@/constants/Config";
import { apiRequest } from "./api";

const { ENDPOINTS } = Config;

export const me = async () => {
    try {
        const response = await apiRequest(HttpMethod.GET, ENDPOINTS.USERS.PROFILE);
        console.log(`me response: ${JSON.stringify(response)}`);
        return response.data;
    } catch (error: any) {
        return error;
    }
}; 