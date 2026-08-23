const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');

// GET /api/aptitude
router.get('/', (req, res) => {
  const topics = [
    { title: 'Quantitative Aptitude', topics: 'Time & Work, Prob, P&C', progress: 65, color: 'bg-emerald-500' },
    { title: 'Logical Reasoning', topics: 'Syllogisms, Blood Relations', progress: 40, color: 'bg-amber-500' },
    { title: 'Verbal Ability', topics: 'Reading Comp, Vocab', progress: 85, color: 'bg-blue-500' }
  ];

  res.json({ topics });
});

module.exports = router;
