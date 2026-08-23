const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');

// GET /api/contests
router.get('/', (req, res) => {
  const contests = [
    { platform: 'LeetCode', name: 'Weekly Contest 400', date: 'Sunday, 8:00 AM', type: 'Upcoming', color: 'text-yellow-500' },
    { platform: 'Codeforces', name: 'Round 950 (Div. 2)', date: 'Tuesday, 8:05 PM', type: 'Upcoming', color: 'text-blue-500' },
    { platform: 'CodeChef', name: 'Starters 120', date: 'Wednesday, 8:00 PM', type: 'Upcoming', color: 'text-amber-700' }
  ];

  res.json({ contests });
});

module.exports = router;
