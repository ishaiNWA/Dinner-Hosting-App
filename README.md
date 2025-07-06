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
- Follow-up events
- Update status for the events,  hosts and guests

## Tech Stack

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React Native with Expo
- **Authentication**: Google OAuth + JWT and human(manager) verification

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn
- ngrok (for mobile development)

### 🚨 IMPORTANT: Mobile Development Setup with ngrok

**Why ngrok is needed:** Google OAuth blocks private IP addresses (like `localhost` or `192.168.x.x`) for security reasons. Mobile devices can't reach `localhost` anyway. ngrok creates a secure public tunnel to your local server.

**Before each development session, you MUST:**

#### 1. Install ngrok (one-time setup)
```bash
# Install ngrok
sudo snap install ngrok

# Sign up at https://ngrok.com and get your authtoken
ngrok authtoken <YOUR_AUTHTOKEN>
```

#### 2. Start ngrok tunnel
```bash
# Start ngrok (run this FIRST, before starting your backend)
ngrok http 5000 
```

#### 3. Update URLs in 3 places (EVERY TIME - ngrok URL changes each restart)

Copy the `https://xxxxx.ngrok-free.app` URL from ngrok output, then update:

**A. Frontend Environment** (`frontend/.env`):
```bash
# Simply update this one line in .env file
EXPO_PUBLIC_API_URL=https://YOUR-NGROK-URL.ngrok-free.app
```

**B. Backend Environment** (`.env` file):
```bash
GOOGLE_OAUTH_CALLBACK_URL=https://YOUR-NGROK-URL.ngrok-free.app/api/auth/google/callback
```

**C. Google Cloud Console:**
- Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- Edit your OAuth 2.0 Client
- Update "Authorized redirect URIs":
  - `https://YOUR-NGROK-URL.ngrok-free.app/api/auth/google/callback`

#### 4. Start your servers
```bash
# Terminal 1: Backend (after updating .env)
npm run dev

# Terminal 2: Frontend  
cd frontend
expo start
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration (including ngrok URL)

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cat > .env << 'EOF'
# Frontend Environment Variables
# Update this URL every time you restart ngrok
EXPO_PUBLIC_API_URL=https://YOUR-NGROK-URL.ngrok-free.app
EXPO_PUBLIC_API_TIMEOUT=10000
EXPO_PUBLIC_DEBUG=true
EOF

# Start Expo development server
expo start
```

## Development Workflow

1. **Start ngrok first**: `ngrok http 5000`
2. **Update 3 URLs** with new ngrok URL (frontend, backend, Google Console)  
3. **Start backend**: `npm run dev`
4. **Start frontend**: `cd frontend && expo start`
5. **Test OAuth** on mobile device/simulator

⚠️ **Remember**: ngrok URLs change every restart, so you'll need to update the URLs each development session.

## Production Deployment

For production, replace ngrok URLs with your actual domain name in all 3 places.

## Testing

```bash
# Run backend tests
npm test

# Frontend testing is currently manual
# See mobile app on device/simulator