const express = require('express');
const router = express.Router();
const { User, Recommendation, Topic, Problem } = require('../config/db');
const { authenticateToken } = require('./auth');

// GET /api/recommendations
// Generates and returns daily recommended actions based on weakness
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Look for existing pending recommendations for today
    const today = new Date().toISOString().split('T')[0];
    let recommendations = await Recommendation.find({ userEmail: req.user.email, date: today });

    // If none exist for today, generate them using AI Mentor Logic
    if (recommendations.length === 0) {
      // Logic: Find weakest pillar from placement readiness
      const readiness = user.placementReadiness || { breakdown: {} };
      const breakdown = readiness.breakdown || {};
      
      let weakestPillar = null;
      let minScore = 101;
      
      for (const [pillar, score] of Object.entries(breakdown)) {
        if (score < minScore) {
          minScore = score;
          weakestPillar = pillar;
        }
      }

      if (!weakestPillar) weakestPillar = 'DSA'; // Default fallback

      const generated = [
        {
          userEmail: req.user.email,
          date: today,
          task: `Revise ${weakestPillar} fundamentals`,
          reason: `Your ${weakestPillar} score is currently ${minScore}%, which is your weakest area.`,
          timeEstimate: '45 min',
          priority: 1,
          xp: 150,
          status: 'Pending'
        },
        {
          userEmail: req.user.email,
          date: today,
          task: 'Solve 2 problems from Track C (DSA)',
          reason: 'Consistency is key. Maintain your daily streak.',
          timeEstimate: '30 min',
          priority: 2,
          xp: 100,
          status: 'Pending'
        },
        {
          userEmail: req.user.email,
          date: today,
          task: 'Start a new Full Stack Project',
          reason: 'You need more project experience to pass the FAANG resume screen.',
          timeEstimate: '2 hours',
          priority: 3,
          xp: 300,
          status: 'Pending'
        }
      ];

      for (const rec of generated) {
        await Recommendation.create(rec);
      }
      
      recommendations = await Recommendation.find({ userEmail: req.user.email, date: today });
    }

    res.json({ recommendations, aiInsight: "I've analyzed your placement readiness. Focus on your weakest pillar today to maximize your interview conversion rate." });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recommendations', error: error.message });
  }
});

// POST /api/recommendations/:id/complete
router.post('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const rec = await Recommendation.findOne({ _id: id, userEmail: req.user.email });
    if (!rec) return res.status(404).json({ message: 'Recommendation not found' });
    
    // Using updateMany as fallback since LocalCollection supports it in our custom db.js
    await Recommendation.updateMany({ _id: id }, { $set: { status: 'Completed' } });

    const user = await User.findOne({ email: req.user.email });
    const newXp = (user.xp || 0) + rec.xp;
    const newLevel = Math.floor(newXp / 1000) + 1;
    
    await User.updateOne({ email: req.user.email }, { $set: { xp: newXp, level: newLevel } });
    
    const updatedUser = await User.findOne({ email: req.user.email });

    res.json({ message: 'Task completed', xpEarned: rec.xp, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete task', error: error.message });
  }
});

module.exports = router;
