# Development Road Map

## Project Timeline (June 5 - August 24)

## All tasks and times are subjected to changes and will be updated - according to development -

## Phase 1: Backend Development (June 5 - June 30)

### Weeks 1-2 (June 5-16): Authentication & User Management
- [x] Google OAuth implementation
- [x] User roles (Host/Guest)
- [x] User registration and profile completion
- [x] Authentication testing
- [x] Logout and session management
- [x] Swagger documentation

### Weeks 3-4 (June 17-30): Core Backend Features
- [x] Dinner Event Model & APIs
  - [x] Create event endpoint
  - [x] Update event endpoint (status updates)
  - [ ] Delete event endpoint (deferred - status change to 'cancelled' used instead)
  - [x] List events endpoint (with role-based filtering)
  - [x] Get single event endpoints (Host: published events, Guest: upcoming events)
- [x] Event Booking System 
  - [x] Direct booking endpoint (Host books guests to their published event)
  - [x] Booking validation and business rules
  - [x] Delete booking functionality
  - [x] Dietary restrictions and allergies support
- [x] Search/Filter Event Functionality
  - [x] Query parameters for event search
  - [x] Filter by date, dietary preferences
  - [x] Role-based event filtering (Guests see only open events)
  - [x] Event status filtering for hosts
  - [ ] Filter by location (planned for future)
  - [ ] Search by geocoding point location (planned for future)
- [x] Basic testing for each feature
  - [x] Event creation tests
  - [x] Event listing tests  
  - [x] Event filtering tests
  - [x] Business rule validation tests
  - [x] Booking system tests
  - [x] Authentication integration tests

## Bonus Features Implemented Beyond Original Scope
- [x] Advanced role-based authorization system
- [x] Comprehensive middleware architecture
- [x] Event status management with history tracking
- [x] Business rule validation (no duplicate events same day)
- [x] Route parameter validation (like :eventId :guestId)
- [x] Enhanced error handling and logging

## Phase 2: Frontend Development (July 1 - August 24)


## Tech Stack
- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication
  - Jest for testing

- Frontend:
  - React Native
  - Material-UI/Chakra UI
  - Axios
  - React Router

## Development Approach
- Mobile-first design
- Feature-by-feature development
- Continuous testing during implementation
- Focus on core MVP features
