# Project Brief: Dinner Hosting App for Soldiers

## Executive Summary
This mobile application connects hosts willing to open their homes for dinner with soldiers on vacation who lack family support. The platform facilitates meaningful social connections through shared meals, creating a supportive community for soldiers while providing hosts with an opportunity to give back. The app includes a human validation component where managers follow up after events to ensure quality experiences.

## Target Users
- **Hosts**: People willing to prepare and host meals in their homes
- **Guests**: Soldiers on vacation without families or experiencing home issues
- **Managers**: Staff who verify users and follow up on dinner events

## Business Flow
1. Hosts publish dinner events with details (location, date, kosher/vegan options)
2. Soldiers search for dinners based on parameters (location, dietary needs, ability to bring friends)
3. Soldiers initiate online chat with potential hosts
4. Hosts register interested guests for their dinner events
5. Post-event, managers call both parties to follow up and update event statuses

## Core Functionality

### Host Features
- Publish dinner events with details
- Register guests to dinners
- Cancel guest registrations
- Cancel entire dinner events
- Chat with potential guests

### Guest Features
- Search for dinner events with filters
- View dinner event details
- Initiate chat with hosts
- (Note: Guest registration/cancellation requires direct host communication)

### Manager Features
- Verify user accounts through human validation
- Authorize/decline users
- Update event statuses after follow-up calls
- Monitor platform activity

## Technical Requirements

### Technology Stack
- **Frontend**: React Native for cross-platform mobile app
- **Backend**: Node.js server with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with email confirmation and human verification
- **Real-time Communication**: WebSocket-based chat functionality

### Data Model
- **User**: Core model with role-specific data objects
  - Shared fields: name, email, password, photo
  - Role-based fields stored in separate roleData object
  - Three roles: HOST, GUEST, MANAGER

- **Event**: Dinner events with details
  - Location, date/time, kosher/vegan options
  - Maximum guests, current status
  - Host reference

- **Participation**: Tracks involvement in events
  - Different properties based on role (host vs guest)
  - Status tracking (registered, canceled, completed)

### Security & Privacy
- Two-step verification (email + human validation)
- Manager authorization of users
- Secure chat environment
- Role-based access controls
- Privacy considerations for soldier data

## Implementation Approach
- Begin with a modular monolithic architecture
- Structure code into clear domain boundaries
- Focus on clean interfaces between components
- Plan for potential future extraction of microservices if needed
- Prioritize security and privacy throughout development

## Success Criteria
- Soldiers find welcoming dinner environments during vacations
- Hosts successfully connect with and support soldiers
- Positive feedback from both hosts and guests
- Growing community engagement
- Minimal issues or safety concerns

## Future Considerations
- Expanding to additional regions
- Adding rating/feedback systems
- Enhanced matching algorithms
- Community features beyond individual dinners
- Event management tools for recurring hosts
