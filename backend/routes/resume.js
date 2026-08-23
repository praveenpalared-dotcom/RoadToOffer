const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');

// POST /api/resume/analyze
router.post('/analyze', (req, res) => {
  // Simulate AI processing delay
  setTimeout(() => {
    const analysis = {
      score: 72,
      feedback: 'Good structure, but missing key impact metrics.',
      keywords: {
        found: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
        missing: ['Docker', 'AWS', 'System Design', 'Agile']
      },
      actionVerbs: ['Developed', 'Led', 'Architected'],
      improvements: [
        'Quantify your impact (e.g. "Improved performance by X%").',
        'Add a dedicated section for System Design projects.',
        'Include links to live deployments or GitHub repos.'
      ]
    };
    res.json({ analysis });
  }, 2000);
});

module.exports = router;
