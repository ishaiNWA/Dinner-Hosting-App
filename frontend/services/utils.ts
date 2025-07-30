
export function getTimeWeekFromNow(){
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}


/**
 * Efficiently formats ISO date string to DD-MM-YYYY format
 * Uses built-in toLocaleDateString for optimal performance and locale support
 * @param isoDateString - ISO 8601 date string (e.g., "2025-08-10T00:00:00.000+00:00")
 * @returns Formatted date string in DD-MM-YYYY format (e.g., "10-08-2025")
 */
export const formatEventDate = (isoDateString: string): string => {
    try {
      const date = new Date(isoDateString);
      
      // Quick validity check
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      // Use built-in formatting with en-GB locale for DD/MM/YYYY, then replace separator
      return date.toLocaleDateString('en-GB').replace(/\//g, '-');
      
    } catch {
      return 'Invalid Date';
    }
  };