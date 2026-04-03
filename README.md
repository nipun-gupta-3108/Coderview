# Coderview

Coderview is a full-stack collaborative coding interview platform for practicing technical interviews in real time. It combines live video, chat, a Monaco-based code editor, curated DSA problems, and remote code execution so two users can solve problems together in a shared session.

![Coderview screenshot](./frontend/public/screenshot-for-readme.png)

## Features

### Core Features
- **Clerk authentication** for secure sign up and sign in
- **Interactive Dashboard** with active sessions and completed session history
- **1:1 Collaborative Interview Rooms** - Create or join live coding sessions
- **Stream-powered Real-time Communication** - Video calling and in-session chat
- **Monaco Editor** with support for JavaScript, Python, Java, and C++
- **Curated DSA Problem Library** with starter code, examples, and expected outputs
- **Remote Code Execution** through OneCompiler API

### AI-Powered Learning Features
- **AI Hint System** - Get progressive hints (3 levels) without full solutions
- **AI Code Review** - Receive focused feedback on correctness and bug risks
- **AI Problem Explanation** - Break down complex problems into simple language

### Data & Infrastructure
- **MongoDB** persistence for users and sessions
- **Inngest** integration for syncing Clerk users with MongoDB and Stream
- **Responsive UI** - Optimized scrolling for AI panels and output console on all screen sizes

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- TanStack Query
- Tailwind CSS v4 + DaisyUI
- Clerk
- Monaco Editor
- Stream Video + Stream Chat

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- Clerk Express middleware
- Inngest
- Stream Node SDK

## Pages & Sections

### Home Page
- Hero section with feature highlights
- Call-to-action to get started
- Overview of platform capabilities

### Dashboard
- View all active sessions
- See recently completed sessions
- Create new interview session
- Join existing sessions

### Problem Page
- Practice problems independently
- AI-powered guidance without collaboration
- Test your solution against expected outputs
- Three AI features: Hints, Code Review, Problem Explanation

### Session Page
- Live collaborative coding environment
- Real-time video call with partner
- In-session chat for communication
- Shared code editor
- AI assistance during session
- Output console with test results

## Project Structure

```text
Coderview/
|-- backend/
|   |-- src/
|   |   |-- controllers/           # Business logic for AI, chat, execution, sessions
|   |   |-- lib/                   # Database, environment, Inngest, OpenAI, Stream
|   |   |-- middleware/            # Route protection
|   |   |-- models/                # MongoDB schemas (User, Session)
|   |   `-- routes/                # API endpoints
|   `-- package.json
|-- frontend/
|   |-- public/                    # Static assets
|   |-- src/
|   |   |-- api/                   # API client (sessions)
|   |   |-- components/            # Reusable UI components
|   |   |-- data/                  # Problem library
|   |   |-- hooks/                 # Custom React hooks
|   |   |-- lib/                   # AI, Axios, OneCompiler, Stream, utilities
|   |   `-- pages/                 # Application pages
|   `-- package.json
`-- package.json
```

## How It Works

### Creating & Joining Sessions
1. Users authenticate with Clerk.
2. Clerk user lifecycle events are handled by Inngest to create or delete matching MongoDB and Stream users.
3. A signed-in user can create a session by choosing a problem and difficulty.
4. The backend creates:
   - a MongoDB session record
   - a Stream video call
   - a Stream chat channel
5. Another user can join the active session and collaborate in real time.
6. Code is executed through the backend using the OneCompiler API.
7. When the host ends the session, the Stream call/channel are deleted and the session is marked as completed.

### Problem-Solving Workflow
1. **Understand the Problem** - Read the problem description with examples and constraints
   - Use "AI Explain Problem" to break down complex problems into simpler language
2. **Write Code** - Use the Monaco editor to write and test your solution
   - Switch between JavaScript, Python, Java, or C++
   - Execute code immediately to see output
3. **Get Guidance** - Use AI-powered features without compromising learning
   - **AI Hint** - Get 3 levels of progressive hints to guide your thinking
   - **AI Code Review** - Receive focused feedback on correctness and bug analysis
4. **Collaborate** - In live sessions, discuss with your partner via video/chat while coding together
5. **Verify Solution** - Run code against test cases and see if your solution passes

## Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DB_URL=your_mongodb_connection_string
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
ONECOMPILER_API_KEY=your_onecompiler_api_key
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
```

## Local Development

### 1. Install dependencies

From the repo root:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 2. Start the backend

```bash
cd backend
npm run dev
```

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

### 4. Open the app

Visit `http://localhost:5173`

## Production Build

From the repo root:

```bash
npm run build
npm start
```

The root build script installs backend and frontend dependencies, then builds the Vite frontend. The backend serves the built frontend when `NODE_ENV=production`.

## API Overview

### Session routes

- `POST /api/sessions` create a session
- `GET /api/sessions/active` list active sessions
- `GET /api/sessions/my-recent` list recent completed sessions for the current user
- `GET /api/sessions/:id` get a session by id
- `POST /api/sessions/:id/join` join a session
- `POST /api/sessions/:id/end` end a session as host

### Chat route

- `GET /api/chat/token` generate a Stream token for the authenticated user

### Code execution route

- `POST /api/execute` run code against the OneCompiler API

### Health route

- `GET /health`

## Notes

- Authenticated routes depend on Clerk session cookies and backend `withCredentials` support.
- Stream video/chat requires both frontend and backend API keys to be configured.
- The Inngest endpoint is exposed at `/api/inngest`; Clerk events must be wired to it in your deployment setup.
- Current problem data is stored locally in `frontend/src/data/problems.js`.

## Scripts

### Root

- `npm run build`
- `npm start`

### Backend

- `npm run dev`
- `npm start`

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Future Improvements

- Shared live code syncing between both participants
- Persistent submissions and session notes
- Better automated test-case evaluation per problem
- Session recordings and feedback summaries
- Search/filter support in the problem library

## License

ISC
