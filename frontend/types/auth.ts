// Authentication TypeScript types - User, LoginRequest, RegisterRequest, etc. 

// User Roles (matches backend user-roles.js)
export enum UserRole {
  HOST = 'host',
  GUEST = 'guest',
}


export interface User {
  _id: string;                    // MongoDB ID
  firstName: string;              // From Google given_name
  lastName: string;               // From Google family_name  
  email: string;                  // From Google email
  isRegistrationComplete: boolean; // Database field
  role: UserRole | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
    isRegistrationComplete: boolean; // Duplicated outside user object
  };
}

