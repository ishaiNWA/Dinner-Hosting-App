# Dinner Hosting App for Soldiers
 
README 0.1

A mobile application that connects people willing to host dinner events with soldiers on vacation who lack family support.

## Project Overview

This platform facilitates meaningful social connections through shared dinner events, creating a supportive community for soldiers while providing hosts with an opportunity to give back. The app includes human validation by managers who follow up after events to ensure a proper respectful use of this platform.

## Features

### For Hosts
- Publish dinner events with location ,language and dietary options
- Register soldiers for dinner events (after personal phone conversation)

### For Soldiers (Guests)
- Search for dinner events based on location and preferences
- View available dinners and details


### For Managers
- Verify and authorize users
- Follow-up on events
- Update status for the events,  hosts and guests

## Tech Stack

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React Native
- **Authentication**: JWT and human(manager) verification
- **Real-time Communication**: WebSocket-based chat

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
