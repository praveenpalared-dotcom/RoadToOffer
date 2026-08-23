# RoadToOffer 🚀
> Master DSA. Stay Consistent. Crack Placements.

RoadToOffer is a premium, gamified DSA Progress Tracking SaaS platform designed to keep students motivated and consistent while preparing for technical placement drives. It features progress dashboards,spaced-repetition checklists, interview readiness models, and badges.

---

## 💎 Features

- **Gamified Progression**: Level-up thresholds (+1000 XP) and ranks ranging from *Beginner* to *Grandmaster*. Earn dynamic badges (Bronze, Silver, Gold, etc.) on phase completion.
- **Placement Readiness Indicator**: Computes weighted scores across DSA modules (Foundation, Trees, Graphs, DP) and rates your readiness for top tech companies (Infosys, TCS, Amazon, Microsoft, Google, Meta) with smart focus recommendations.
- **GitHub-style Contribution Heatmap**: Hoverable, color-density mapped activity squares representing solves over the last 6 months.
- **Spaced-Repetition Revision System**: Add problem revision schedules (1 Day, 3 Days, 7 Days) and log detailed algorithmic constraints and corner cases in the notes.
- **Interactive Solutions Sandbox**: Write, edit, and keep templates in C++, Java, or Python inside a mockup code compiler workspace.
- **Admin CSV Bulk Uploader**: Instantly parse and import problem sets in CSV format directly into topics.
- **Universal Database Engine**: Auto-falls back to a localized JSON persistence store (`backend/data/local_db.json`) if MongoDB coordinates are missing.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router, Framer Motion, Recharts, React Icons, Canvas Confetti
- **Backend**: Node.js, Express.js, JWT, Bcrypt
- **Database**: MongoDB (Mongoose) / Local JSON Fallback Driver

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher

### 2. Environment Setup
Rename/inspect the root `.env` file:
```env
PORT=5000
MONGODB_URI=
JWT_SECRET=roadtooffer_jwt_secret_token_key_2026_dsa_tracker
NODE_ENV=development
```
*Note: If `MONGODB_URI` is blank, the server automatically starts up using the local filesystem JSON database.*

### 3. Installation
From the root workspace folder, run:
```bash
# Installs root, backend, and frontend packages
npm run setup
```

### 4. Running Locally
Run the concurrent dev command:
```bash
# Starts both frontend (port 5173) and backend (port 5000)
npm run dev
```

---

## ⚡ Demo Testing Credentials
Autofill controls are present on the landing page, or log in manually with:
- **Email**: `candidate@roadtooffer.com`
- **Password**: `candidate123`
