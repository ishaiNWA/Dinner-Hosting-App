/**
 * Valid user profile fields that can be requested via query parameters
 * This type matches the validUserSchemaKeysArray from the backend Mongoose schemas
 */
export type ValidUserProfileField = 
  // Base UserSchema fields
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'isRegistrationComplete'
  | 'role'
  
  // Contact details (shared between Host and Guest)
  | 'phoneNumber'
  | 'address'
  
  // Host-specific fields
  | 'isAuthorizedByManager'
  | 'publishedEvents'
  
  // Guest-specific fields
  | 'dietaryRestrictions'
  | 'allergies'
  | 'upcomingEvents'
  | 'eventHistory';

/**
 * Array type that can only contain valid user profile fields
 * Compatible with the backend validUserSchemaKeysArray from Mongoose schemas
 */
export type ValidUserProfileFieldsArray = ValidUserProfileField[];

/**
 * Interface for profile query parameters
 */
export interface ProfileParams {
  fields?: ValidUserProfileFieldsArray;
  include?: ('contactDetails' | 'roleDetails' | 'all')[];
}