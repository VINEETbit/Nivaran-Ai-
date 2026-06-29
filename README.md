# 🛡️ Nivaran AI — Smart Hyperlocal Civic Resolution Platform

> **Nivaran (निवारण)**: *The act of resolving, curing, or removing an obstacle.*
>
> Nivaran AI is a premium, full-stack civic participation and diagnostic platform that bridges the gap between citizens, contractors, and public representatives (MLAs/Corporators). Driven by advanced AI, the platform automates civic auditing, crowdsources problem verification, handles contractor bidding, and ranks wards for transparent civic governance.

---

## 🛑 Important: Why is my app not showing features on Vercel?
If you deploy this repository directly to **Vercel** as a static site, you will see a broken or empty state (e.g., `"0 issues reported near you"`, with non-functional AI walkthroughs). 
* **The Reason**: This is a **Full-Stack Application** with an active Node.js Express backend (`server.ts`). Vercel only hosts the frontend static files by default and ignores the Express server.
* **The Solution**: You **MUST** deploy this to a host that supports full-stack Node.js environments. **Render** is the best, 100% free-tier provider that handles both the frontend and Node.js backend flawlessly.

---

## 🚀 Step-by-Step Deployment Guide for Render (Free & Reliable)

Follow these exact steps to launch **Nivaran AI** with all AI, bidding, and reporting features working perfectly:

### Step 1: Create a Render Account
1. Go to [Render.com](https://render.com/) and sign up (using your GitHub account makes connection easiest).

### Step 2: Create a New Web Service
1. Inside the Render Dashboard, click the blue **New +** button in the top right, then select **Web Service**.
2. Select **Build and deploy from a Git repository**.
3. Connect your GitHub account and select your **nivaran-ai** repository.

### Step 3: Configure Settings
Fill in the following fields exactly as described:
* **Name**: `nivaran-ai` (or any name you prefer)
* **Language**: `Node`
* **Branch**: `main`
* **Region**: Choose the region closest to you (e.g., Oregon (US West) or Singapore (Asia))
* **Build Command**: 
  ```bash
  npm run build
  ```
* **Start Command**: 
  ```bash
  npm run start
  ```
* **Instance Type**: Select the **Free** tier ($0/month).

### Step 4: Configure Environment Variables (CRITICAL for AI)
1. Scroll down to the **Advanced** section or click the **Environment** tab on the left sidebar.
2. Click **Add Environment Variable** and enter the following keys:
   * **Key**: `GEMINI_API_KEY`
   * **Value**: *[Paste your actual Gemini API Key here (starts with AIza...)]*
   * **Key**: `PORT`
   * **Value**: `3000`
   * **Key**: `NODE_ENV`
   * **Value**: `production`

### Step 5: Deploy!
1. Click **Create Web Service** at the bottom of the page.
2. Render will spin up the container, install dependencies, run the build script (`vite build` + `esbuild`), and launch the production node process.
3. Once the logs show `Server running on port 3000`, click the live URL displayed at the top of the page (e.g., `https://nivaran-ai.onrender.com`). All maps, AI scanning simulations, bidding features, and PDF letter generation will be fully functional!

---

## ✨ Features & AI-Driven Innovations

### 1. 👁️ Real-Time Computer Vision Auditing
* **Visual Diagnostics**: Citizens upload photos of potholes, garbage piles, water-logging, or electrical faults.
* **Gemini-Powered Audits**: The integrated Gemini API parses the image to automatically identify the issue type, determine the severity index (Low, Medium, High, Critical), generate a detailed technical description, and pre-fill the location.

### 2. 📝 Automated Legal & SLA Grievance Synthesizer
* **Bureaucratic Leverage**: Generates high-impact, legally grounded formal grievance letters addressed to municipal commissioners and department heads.
* **SLA Enforcement**: Mentions specific municipal laws and Service Level Agreement (SLA) timelines to enforce administrative accountability.

### 3. 🔍 Before-After AI Resolution Verification
* **Anti-Fraud Guardrails**: When contractors claim an issue is resolved, they must upload a completion photo. 
* **Dual-Image Analysis**: Gemini compares the "before" and "after" images to verify whether the repair is high-quality, preventing fraudulent closures.

### 4. 🛰️ Live Geospatial Sentry Map
* **Interactive Hotspots**: Visualizes reported incidents as high-fidelity geospatial heatmaps and cluster points.
* **Live Feed & Satellite Scanning**: Features live scanning animations mimicking municipal CCTV or satellite overwatch feeds detecting potholes in real-time.

### 5. 🏗️ Decoupled Contractor Bidding & Witnessing
* **Transparent Procurement**: Local contractors can bid transparently on open civic tickets, specifying budgets in INR (₹) and completion timelines.
* **Crowdsourced Witnessing**: Citizens can "witness" reports in their area to boost their priority index, forcing authorities to act faster.

### 6. 🏆 Municipal Leaderboard & Gamification
* **Corporator Accountability**: Ranks MLAs and Corporators dynamically based on their ward's resolution rate, SLA response time, and citizen rating.
* **Engagement Badges**: Citizens earn XP, climb city-wide leaderboards, and unlock achievements (e.g., *Sentry Cadet*, *Civic Hero*) for active reporting.

---

## 🛠️ Technology Stack

| Tier | Technology | Description |
|---|---|---|
| **Frontend** | **React 18 & TypeScript** | Component-driven, type-safe interactive UI. |
| **Styling** | **Tailwind CSS** | Custom responsive dark/light utility classes. |
| **Animation** | **Framer Motion** | Staggered entrances, fluid transitions, and scanline effects. |
| **Visualizers** | **Recharts** | Interactive charts for ward statistics, diagnostics, and budgets. |
| **Icons** | **Lucide React** | Consistent vector icon system. |
| **Backend** | **Node.js & Express** | Rest API endpoints, proxying secret AI keys securely. |
| **AI Engine** | **Gemini (Google Gen AI SDK)** | Multisensory image analysis and text synthesis. |
| **Build System** | **Vite & esbuild** | Blazing fast client builds & bundled server output. |

---

## ⚙️ Getting Started & Local Installation

### Prerequisites
* Node.js (v18.0.0 or higher)
* A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nivaran-ai.git
cd nivaran-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
# Root directory .env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
* **Client & Backend**: The full-stack app runs simultaneously on [http://localhost:3000](http://localhost:3000) using a unified Express-Vite development middleware.

---

## 🗺️ Project Structure

```text
nivaran-ai/
├── src/
│   ├── components/          # Extracted UI components
│   │   ├── BadgesProfile.tsx       # User badges and civic XP tracker
│   │   ├── CityLiveVideo.tsx       # Interactive AI camera and feed simulation
│   │   ├── Header.tsx              # Navbar, login modals, and dark mode toggles
│   │   ├── HeatmapDisplay.tsx      # Interactive incident location mapping
│   │   ├── IssueCard.tsx           # Ticket actions (upvote, bid, verify, witness)
│   │   ├── LeaderboardSection.tsx  # MLA transparency ranking index
│   │   ├── PersonaPortals.tsx      # Multi-user sandbox (Citizen/Contractor/Corporator)
│   │   ├── PredictiveSentry.tsx    # Predictive resource alerts & weather correlations
│   │   ├── ReportForm.tsx          # Incident reporter with computer vision auto-fill
│   │   ├── SmartCityBG.tsx         # Immersive ambient interface animations
│   │   └── WardInfo.tsx            # Ward diagnostic metrics & budget charts
│   ├── App.tsx              # Main orchestrator & state container
│   ├── main.tsx             # React mount entry
│   ├── types.ts             # Strong TypeScript definitions for models
│   └── index.css            # Tailwind theme variables & Google Font loads
├── server.ts                # Full-stack Express server (proxies Gemini & serves static assets)
├── package.json             # NPM metadata & custom build pipeline script
├── tsconfig.json            # TypeScript build parameters
└── vite.config.ts           # Bundler configurations for plugins & asset outputs
```

---

## 🔌 API Endpoints Reference

### Authenticational APIs
* `POST /api/login`: Decoupled secure sign-in sync.
* `POST /api/register`: Creates local simulated user credentials.
* `POST /api/reset`: Resets simulated database state back to pristine.

### Core Ticket Management
* `GET /api/issues`: Retrieves all local tickets.
* `POST /api/issues`: Generates a new issue with custom coordinates.
* `POST /api/issues/:id/upvote`: Tallies community agreement.
* `POST /api/issues/:id/witness`: Registers local witnesses to escalate severity.
* `POST /api/issues/:id/bid`: Allows contractors to submit competitive bids.
* `POST /api/issues/:id/status`: Updates administrative pipeline state.

### AI Integration Endpoints
* `POST /api/analyze-image`: Receives a base64 string, calls Gemini API to extract categorizations, descriptions, and severities.
* `POST /api/generate-letter`: Calls Gemini API to generate a professional SLA escalation letter based on issue attributes.
* `POST /api/verify-after`: Submits before and after photos to Gemini, returning a structured verification result confirming whether repair matches standards.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
