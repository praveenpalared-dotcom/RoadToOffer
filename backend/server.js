require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { router: authRouter } = require('./routes/auth');
const progressRouter = require('./routes/progress');
const leetcodeRouter = require('./routes/leetcode');
const codeforcesRouter = require('./routes/codeforces');
const projectsRouter = require('./routes/projects');
const assessmentsRouter = require('./routes/assessments');
const recommendationsRouter = require('./routes/recommendations');
const companiesRouter = require('./routes/companies');
const interviewRouter = require('./routes/interview');
const csFundamentalsRouter = require('./routes/cs-fundamentals');
const revisionRouter = require('./routes/revision');
const aptitudeRouter = require('./routes/aptitude');
const resumeRouter = require('./routes/resume');
const contestsRouter = require('./routes/contests');
const leaderboardRouter = require('./routes/leaderboard');
const studyAssistantRouter = require('./routes/study-assistant');
const { Topic } = require('./config/db');
const { runSeed } = require('./utils/seed');

const app = express();

// Config Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/progress', progressRouter);
app.use('/api/leetcode', leetcodeRouter);
app.use('/api/codeforces', codeforcesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/assessments', assessmentsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/cs-fundamentals', csFundamentalsRouter);
app.use('/api/revision', revisionRouter);
app.use('/api/aptitude', aptitudeRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/contests', contestsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/study-assistant', studyAssistantRouter);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve frontend assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('RoadToOffer Server is running in development mode. API is active on /api.');
  });
}

const PORT = process.env.PORT || 5000;

// Connect to DB and Auto-Seed if empty
async function startServer() {
  try {
    const topicsCount = await Topic.countDocuments({});
    if (topicsCount === 0) {
      console.log('[SERVER] No topics found. Auto-seeding default roadmap...');
      await runSeed();
    }
  } catch (error) {
    console.error('[SERVER] Database check failed, skipping auto-seed:', error.message);
  }

  // Only listen on a port if not running in Vercel Serverless environment
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`[SERVER] RoadToOffer backend running on http://localhost:${PORT}`);
    });
  }
}

startServer();

// Export the app for Vercel serverless deployment
module.exports = app;
