

export interface Guest {
    _id: string;
    name: string;
    phone: string;
    plusOneCount: number;
    allergies: string;
    dietaryRestrictions: string;
}

export type GuestsDetails = Guest[];

