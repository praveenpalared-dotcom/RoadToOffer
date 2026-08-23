const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');

// GET /api/revision
router.get('/', (req, res) => {
  const flashcards = [
    { title: 'Reverse a Linked List', nextReview: 'Today', status: 'due', difficulty: 'Hard', type: 'DSA' },
    { title: 'Normalization (1NF to BCNF)', nextReview: 'Today', status: 'due', difficulty: 'Medium', type: 'DBMS' },
    { title: 'React Lifecycle Methods', nextReview: 'Tomorrow', status: 'upcoming', difficulty: 'Medium', type: 'Frontend' },
    { title: 'Dijkstra vs Bellman-Ford', nextReview: 'In 3 Days', status: 'upcoming', difficulty: 'Hard', type: 'Graphs' }
  ];

  const topics = [
    { name: 'Dynamic Programming', strength: 35, color: 'text-red-400 bg-red-400/10 border-red-400/20' },
    { name: 'Graphs', strength: 50, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    { name: 'Trees', strength: 80, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' }
  ];

  res.json({ flashcards, topics });
});

module.exports = router;
