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

## Phase 2: Frontend Development (July 1 - August 17)

### Week 1 (July 1-7): Project Setup & Core Infrastructure
- [ ] Initialize React Native with Expo CLI
- [ ] Set up project folder structure with feature-based organization
- [ ] Configure React Navigation v6 with stack and tab navigators
- [ ] Set up Context API for global state management (AuthContext, AppContext)
- [ ] Configure Axios service layer with JWT interceptors
- [ ] Set up SecureStore for authentication token management
- [ ] Configure development environment and debugging tools

### Week 2 (July 8-14): Design System & Component Library
- [ ] Choose and configure UI library (NativeBase/React Native Elements)
- [ ] Define design tokens:
  - [ ] Color palette (primary, secondary, success, error, neutral)
  - [ ] Typography scale (headings, body, captions)
  - [ ] Spacing/sizing constants (margins, paddings, border radius)
- [ ] Create reusable component library:
  - [ ] Button variants (primary, secondary, outline)
  - [ ] Form components (Input, Select, Checkbox)
  - [ ] Card components for events
  - [ ] Loading states and error components
- [ ] Set up theme provider and dark/light mode support

### Week 3 (July 15-21): Authentication & Onboarding Flow
- [ ] **OAuth/Login Screen**
  - [ ] Google OAuth integration with Expo AuthSession
  - [ ] Handle JWT token from backend response
  - [ ] Store JWT using SecureStore
  - [ ] Implement auto-login on app restart
  - [ ] Error handling for auth failures
- [ ] **Registration Completion Screen**
  - [ ] Registraion form (Host/Guest)
  - [ ] Form validation with real-time feedback
  - [ ] Profile photo upload functionality
  - [ ] Submit registration via API
  - [ ] Success feedback and navigation to dashboard
- [ ] **Auth Context & Navigation Guards**
  - [ ] Protected route implementation
  - [ ] Role-based navigation logic
  - [ ] Token refresh handling

### Week 4 (July 22-28): Host User Flow Implementation
- [ ] **Host Dashboard Screen**
  - [ ] Fetch and display published events list with pagination
  - [ ] Event card design with status indicators
  - [ ] Pull-to-refresh functionality
  - [ ] select an event to open the "Published Event Management Modal"
  - [ ] Navigation to "Publish Event" screen
  - [ ] Empty state design for no events
- [ ] **Publish Event Screen**
  - [ ] Event creation form
  - [ ] Form data validation
  - [ ] Address input with map integration (optional)
  - [ ] Dietary options multi-select
  - [ ] Form validation and error states
  - [ ] Image upload for event
  - [ ] Submit via POST/events endpoint
  - [ ] Success feedback and navigation back to dashboard
- [ ] **Published Event Management Modal**
  - [ ] List of guests booked for event
  - [ ] Book guest to an event (phone call workflow)
  - [ ] Remove guest booking
  - [ ] Update event status

### Week 5 (July 29 - August 4): Guest User Flow Implementation
- [ ] **Guest Dashboard Screen**
  - [ ] Fetch and display Upcoming Events events list
  - [ ] alert when registered by Host to an UpcomingEvent (later could be whatsApp notification)
  - [ ] Select a specific Upcoming Event from the list for more details
  - [ ] Event details with host contact info
  - [ ] Navigation to "Search Events" screen
- [ ] **Search/Browse Events Screen**
  - [ ] Fetch available events with query parameters
  - [ ] Search bar with debounced input
  - [ ] Filter functionality:
    - [ ] Date range picker
    - [ ] Dietary preferences filter
    - [ ] Location radius filter (if implemented)
  - [ ] Sort options (date, distance, newest)
  - [ ] Event card design with host info
  - [ ] select a specific found event for open Event Details Modal
  - [ ] Infinite scroll/pagination
- [ ] **Event Details Screen**
  - [ ] Full event information display:
     - [ ] Host profile preview
    - [ ] number of current participants
     - [ ] Map integration showing location
    - [ ] contact details(phone number)

### Week 6 (August 5-11): Cross-cutting Features & Polish
- [ ] **Notifications System**
  - [ ] Push notifications setup with Expo Notifications
  - [ ] In-app notification center
  - [ ] Notification preferences screen
- [ ] **Error Handling & UX**
  - [ ] Global error boundary
  - [ ] Network connectivity handling
  - [ ] Offline mode indicators
  - [ ] Loading states for all async operations
  - [ ] Success/error toast notifications
- [ ] **Performance Optimization**
  - [ ] Image optimization and caching
  - [ ] List virtualization for large datasets
  - [ ] API response caching strategy
  - [ ] Bundle size optimization
- [ ] **Accessibility**
  - [ ] Screen reader support
  - [ ] Color contrast compliance
  - [ ] Touch target sizing
  - [ ] Keyboard navigation support

### Week 7 (August 12-17): Testing, Deployment & Documentation
- [ ] **Testing Implementation**
  - [ ] Unit tests for utility functions
  - [ ] Component testing with React Native Testing Library
  - [ ] Integration tests for critical user flows
  - [ ] E2E testing setup with Detox (optional)
- [ ] **Deployment Preparation**
  - [ ] Environment configuration (dev, staging, prod)
  - [ ] Build optimization and app signing
  - [ ] App store assets (icons, screenshots, descriptions)
  - [ ] Beta testing with TestFlight/Google Play Internal Testing
- [ ] **Documentation & Handover**
  - [ ] User guide creation
  - [ ] Technical documentation
  - [ ] Deployment guide
  - [ ] Known issues and future enhancements list

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

## Success Metrics

- **Performance**: App launch time < 3 seconds
- **Usability**: Task completion rate > 90% for core flows
- **Quality**: Crash-free rate > 99.5%
- **User Satisfaction**: App store rating > 4.0
- **Feature Coverage**: 100% of MVP features implemented and tested
