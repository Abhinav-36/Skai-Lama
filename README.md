# Event Management System

A MERN stack application for managing events across multiple profiles and timezones.

## Tech Stack

- **Frontend**: React
- **Backend**: Express.js
- **Database**: MongoDB
- **State Management**: Zustand
- **Timezone Management**: dayjs

## Features

- Create and manage user profiles
- Create events for one or multiple profiles
- Multi-timezone support - view events in any timezone
- Update events with change tracking
- Event update history logs (bonus feature)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-management
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Profiles
- `GET /api/profiles` - Get all profiles
- `POST /api/profiles` - Create a new profile

### Events
- `GET /api/events` - Get all events (optional query: `profileIds`)
- `GET /api/events/:id` - Get a single event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `GET /api/events/:id/logs` - Get event update logs

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── Profile.js
│   │   ├── Event.js
│   │   └── EventLog.js
│   ├── routes/
│   │   ├── profiles.js
│   │   └── events.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Usage

1. Start both backend and frontend servers
2. Open the application in your browser
3. Create profiles using the "Add Profile" button
4. Select profiles and create events with timezone, start, and end date/time
5. View events in your preferred timezone
6. Edit events and view update history

## Notes

- Events are stored with UTC timestamps in the database
- All timezone conversions are handled on the frontend using dayjs
- Event update logs track all changes made to events
- End date/time cannot be in the past relative to start date/time








