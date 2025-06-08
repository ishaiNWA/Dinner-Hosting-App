# Event Management System Specification

## Overview
This document outlines the plan for the Event Management System for the Dinner Hosting Application, (separating MVP features from future production) 

## System Logic and Flow

### Core Business Logic

#### 1. Event Publication Flow
- Hosts create and publish dinner events
- Events follow a defined lifecycle:

  - `open for registration`: Available for guest registration
  - `fully-booked`: Maximum capacity reached
  - `cancelled`: Event cancelled by host
  - `completed`: Event has occurred

#### 2. Event Discovery Process
- Guests search available events using filters 
   A. Location (proximity/area)
   B. Dietary requirements (kosher, vegan-friendly)
   C. Date range
- Search results provide essential event details
- Guests can view full event details before interaction

#### 3. Registration Process
1. **Pre-Registration Communication**
   - Guests must initiate chat with host before registration
   - Allows for:
     - HUMAN CONNECTION!
     - special Dietary requirement discussion
     - Logistical clarification

2. **Registration Workflow**
   - Guest submits registration after chat
   - Registration stored in event's registration array
   - Host receives notification of new registration
   - Host can approve/decline registration
   - Status updates trigger notifications
   - Capacity automatically managed

3. **Registration Tracking**
   - Events track all associated registrations
   - Guests maintain history of their registrations
   - Registration status changes logged with timestamps
   - Attendance tracked post-event

## Data Models (Draft)

### Event
```typescript
interface DinnerEvent {
  id: string;
  hostId: string;
  title: string;
  description: string;
  dateTime: Date;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
  capacity: {
    total: number;
    available: number;
  };
  dietary: {
    isKosher: boolean;
    isVeganFriendly: boolean;
    additionalOptions: string[];
  };
  status: 'open for registration' | 'fully-booked' | 'cancelled' | 'completed';
  allowsPlusOne: boolean;
  maxPlusOnes: number;
  registrations: [EventRegistration];
  lastUpdated: Date;
}
```

### EventRegistration
```typescript
interface EventRegistration {
  id: string;
  eventId: string;
  guestId: ObjectId; 
  status: 'pending' | 'approved' | 'declined' | 'cancelled' | 'participated';
  numberOfGuests: number;
  dietaryRestrictions: {
    type: [String],
    enum: {
      values: dietaryRestrictionsArray,
      message: '{VALUE} is not a valid dietary restriction'
    },
    required: true,
  };
  allergies: {
    type: String,
    default: "none",
  };
  notes: string[];
  registrationDate: Date;
  lastStatusUpdate: Date;
  statusHistory: [{
    status: string;
    timestamp: Date;
  }];
}
```

### Guest (Additional Fields)
```typescript
interface GuestRegistrationHistory {
  submittedRegistrations: [{
    eventId: string;
    registrationId: string;
    status: string;
    submissionDate: Date;
  }];
}
```

## API Endpoints (Draft)

### MVP Endpoints

#### Events
- POST /api/events - Create new event
- GET /api/events - List/search events
- GET /api/events/:id - Get event details
- PUT /api/events/:id - Update event
- DELETE /api/events/:id - Cancel event

#### Registrations
- POST /api/events/:id/registrations - Submit registration
- GET /api/events/:id/registrations - List registrations (host only)
- PUT /api/events/:id/registrations/:regId - Update registration status
- DELETE /api/events/:id/registrations/:regId - Cancel registration

#### Guest Registration History
- GET /api/guests/:id/registrations - Get guest's registration history
- GET /api/guests/:id/registrations/:regId - Get specific registration details

## Implementation Phases

### Phase 1: Core Event Management
1. Event model and database schema
2. Basic CRUD operations for events
3. Event search functionality
4. Basic registration system

### Phase 2: Search and Discovery
1. Advanced search filters
2. Geolocation support
3. Search result optimization

### Phase 3: Registration System
1. Registration workflow
2. Capacity management
3. Email notifications

### Future Phases
1. Messaging system
2. Manager approval system
3. Post-event management
4. Rating and feedback system

## Technical Implementation Notes

### Event Registration Flow
1. **Pre-Registration**  // NOT SURE YET!
   - Chat system must be implemented before registration system
   - Chat history should be preserved for safety and reference

2. **Registration Management**
   - Automatic capacity tracking
   - Status change triggers
   - Notification system integration points

3. **Data Integrity**
   - Bi-directional references between Event and Guest
   - Status history maintenance
   - Timestamp tracking for all changes

### Future Production Features

#### 1. Event Approval System
- Manager approval required for published events

#### 2. Direct Messaging System
- In-app chat between Host and Guest
- Message history
- Notification system

#### 3. Post-Event Management
- Manager follow-up system
- Attendance tracking
- No-show recording
- Event feedback collection

