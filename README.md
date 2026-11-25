# BinWise — AI-Powered Waste Segregation Application

**Tagline:** Know Your Waste. Sort It Right. Keep India Clean.  
**Hackathon Track:** Track 5 – Smarter Cities & Civic Infrastructure

BinWise helps Indian households identify whether everyday waste items belong in **Wet**, **Dry**, or **Hazardous** waste bins using Google Gemini Vision, along with clear preparation and disposal instructions.

## Features

- **Landing Page**: Overview of BinWise, 3 waste categories, how it works, and environmental impact.
- **AI Waste Scanner**: Upload or drag-and-drop an image, preview/replace/remove it, and classify via `POST /api/classify-waste`.
- **Classification Result Page**: Displays detected item, category badge, confidence score, explanation, disposal method, preparation steps, and safety warnings.
- **Personal Dashboard**: Live stats (total, wet, dry, hazardous, eco points), Recharts category distribution bar chart, and recent scans.
- **Waste Knowledge Library**: Searchable & filterable library of 22 Indian household waste items.
- **Scan History**: Persistent `localStorage` history with view & delete actions.
- **Eco Points**: Gamified points, achievement badges, and activity log.

## Setup & Installation

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Configure Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Set your Google Gemini API key in `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=5000
```

> **Note:** If `GEMINI_API_KEY` is not set, the backend automatically runs in **Demo Mode** and returns clearly labelled simulated responses so you can test the full application flow.

### 3. Run the Application

Start the backend (port 5000) and frontend (port 5173) in separate terminals:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

Open `http://localhost:5173` in your browser.
