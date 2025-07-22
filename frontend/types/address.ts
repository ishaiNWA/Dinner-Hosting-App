/**
 * Address Types
 * Standardized address structure for the application
 */

export interface StandardAddress {
    placeId: number;
    city?: string;
    street?: string;
    houseNumber?: string;
    country?: string;
    countryCode?: string;
    fullAddress: string;
    coordinates?: {
        lat: number;
        lon: number;
    };
}

