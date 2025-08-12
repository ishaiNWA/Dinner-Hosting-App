// Events TypeScript types - Event, EventForm, EventFilters, etc. 


export interface EventSummary {
    _id: string;
    eventName: string;
    timing: {
      eventDate: string; // ISO date string
      createdAt: string; // ISO date string
    };
    status: {
      current: string;
    };
    participantCount: number;
    location: {
      address: string;
    };
    dietary: {
      isKosher: boolean;
      isVeganFriendly: boolean;
      additionalOptions: string;
    };
  }

  export interface EventDataItem {
    eventSummary: EventSummary;
    isGuestDetailsCached: boolean;  
  }

