const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');

// GET /api/cs-fundamentals
router.get('/', (req, res) => {
  // Mock data representing database state for CS subjects
  const subjects = [
    { title: 'Operating Systems', progress: 45, modules: 12, completed: 5, color: 'text-blue-400 border-blue-400/30' },
    { title: 'Database Mgmt (DBMS)', progress: 70, modules: 15, completed: 11, color: 'text-amber-400 border-amber-400/30' },
    { title: 'Computer Networks', progress: 20, modules: 10, completed: 2, color: 'text-green-400 border-green-400/30' },
    { title: 'System Design', progress: 5, modules: 20, completed: 1, color: 'text-purple-400 border-purple-400/30' }
  ];

  res.json({ subjects });
});

module.exports = router;
