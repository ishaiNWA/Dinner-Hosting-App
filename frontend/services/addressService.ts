import { Config } from "@/constants/Config";
import { StandardAddress } from "@/types/address";

const ADDRESS_SERVICE_BASE_URL = Config.ADDRESS_SERVICE_BASE_URL;

// DEBUG: Check if config is loading properly
console.log('=== CONFIG DEBUG ===');
console.log('Config object:', Config);
console.log('ADDRESS_SERVICE_BASE_URL from config:', ADDRESS_SERVICE_BASE_URL);
console.log('=== END CONFIG DEBUG ===');

const buildCommonAddressObject = (dataObject: any): StandardAddress => {
    console.log("received object", JSON.stringify(dataObject));

    const address = dataObject.address || {};

    // Safe property accessors with fallbacks
    const getCity = (addr: any): string => {
        return addr.city || addr.town || addr.village || addr.municipality || '';
    };

    const getStreet = (addr: any): string => {
        return addr.road || addr.street || addr.pedestrian || addr.footway || '';
    };

    const getHouseNumber = (addr: any): string => {
        return addr.house_number || '';
    };

    const getCountry = (addr: any): string => {
        return addr.country || '';
    };

    // Extract values
    const city = getCity(address)?.trim();
    const street = getStreet(address)?.trim();
    const houseNumber = getHouseNumber(address)?.trim();
    const country = getCountry(address)?.trim();
    const countryCode = address.country_code?.trim() || '';

    // Build fullAddress from available parts
    const addressParts = [];
    if (street && houseNumber) {
        addressParts.push(`${street} ${houseNumber}`);
    } else if (street) {
        addressParts.push(street);
    }
    
    if (city) addressParts.push(city);
    if (country) addressParts.push(country);
    
    const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : (dataObject.display_name || '');

    return {
        // standart Address object
        placeId: dataObject.place_id || 0,
        city: city || undefined,
        street: street || undefined,
        houseNumber: houseNumber || undefined,
        country: country || undefined,
        countryCode: countryCode || undefined,
        fullAddress: fullAddress,
        coordinates: {
            lat: parseFloat(dataObject.lat) || 0,
            lon: parseFloat(dataObject.lon) || 0,
        }
    };
}

export const searchForAddress = async (address: string): Promise<StandardAddress[]> => {
    try {
        const url = `${ADDRESS_SERVICE_BASE_URL}/search?q=${encodeURIComponent(address)}&countrycodes=il&format=json&addressdetails=1&limit=5`;
        
        // DEBUG: Check the actual URL being called
        console.log('=== FETCH DEBUG ===');
        console.log('Constructed URL:', url);
        console.log('=== END FETCH DEBUG ===');
        
        const response = await fetch(url);
        const dataArray = await response.json();
        
        // DEBUG: Log the API response to see structure
        console.log('=== ADDRESS API RESPONSE ===');
        console.log('Full response:', dataArray);
        if (dataArray && dataArray.length > 0) {
            console.log('First suggestion structure:', dataArray[0]);
        }
        console.log('=== END DEBUG ===');
        
        // Validate it's an array before mapping
        if (!Array.isArray(dataArray)) {
            console.log('API response is not an array:', dataArray);
            return [];
        }
        
        const addressArray: StandardAddress[] = dataArray.map((dataObject: any) => 
            buildCommonAddressObject(dataObject)
        );

        console.log('FULL ADDRESS ', JSON.stringify(addressArray[0]?.fullAddress));
        return addressArray;
    } catch (error) {
        console.error('Error searching for address:', error);
        return [];
    }
}



