# Development Road Map

## Project Timeline (June 5 - August 24)

## All tasks and times are subjected to changes and will be updated - according to development -

## Phase 1: Backend Development (June 5 - June 30)

### Weeks 1-2 (June 5-16): Authentication & User Management
- [x] Google OAuth implementation
- [x] User roles (Host/Guest)
- [x] User registration and profile completion
- [x] Authentication testing
- [ ] Logout and session management
- [ ] Swagger documentation

### Weeks 3-4 (June 17-30): Core Backend Features
- [ ] Dinner Event Model & APIs
  - [ ] Create event endpoint
  - [ ] Update event endpoint
  - [ ] Delete event endpoint
  - [ ] List events endpoint
- [ ] Event Registration System
  - [ ] Request registration endpoint
  - [ ] Approve/reject registration endpoint
  - [ ] Registration status management
  - [ ] Chat  ???(might be postponed)
- [ ] Search/Filter Functionality
  - [ ] Query parameters for event search
  - [ ] Filter by date, location, etc.
- [ ] Basic testing for each feature

## Phase 2: Frontend Development (July 1 - August 24)

### Weeks 1-2 (July 1-14): Frontend Setup & Learning
- [ ] Project setup with Create React App
- [ ] UI framework setup (Material-UI/Chakra UI)
- [ ] Basic component structure
- [ ] Authentication UI
  - [ ] Login page
  - [ ] Registration flow
  - [ ] Profile management

### Weeks 3-4 (July 15-28): Host Features
- [ ] Event Management Interface
  - [ ] Create event form
  - [ ] Edit event form
  - [ ] Delete event functionality
- [ ] Registration Management
  - [ ] View registration requests
  - [ ] Approve/reject interface
- [ ] Mobile responsive design

### Weeks 5-6 (July 29-August 11): Guest Features
- [ ] Event Discovery
  - [ ] Browse events list
  - [ ] Search/filter interface
  - [ ] Event details view
- [ ] Registration Flow
  - [ ] Request registration
  - [ ] View registration status
- [ ] Profile Management
  - [ ] View/edit profile
  - [ ] Registration history

### Weeks 7-8 (August 12-24): Integration & Polish
- [ ] API Integration
  - [ ] Connect all frontend features to backend
  - [ ] Error handling
  - [ ] Loading states
- [ ] Testing & Bug Fixes
- [ ] UI/UX Improvements
- [ ] Deployment

## Tech Stack
- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication
  - Jest for testing

- Frontend:
  - React
  - Material-UI/Chakra UI
  - Axios
  - React Router

## Development Approach
- Mobile-first design
- Feature-by-feature development
- Continuous testing during implementation
- Focus on core MVP features
