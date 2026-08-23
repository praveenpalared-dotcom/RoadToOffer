const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const { User, Problem, ActivityLog } = require('../config/db');

// In-Memory store for active friendly competition battles
const friendlyBattles = [
  {
    id: 'battle-101',
    title: 'Dynamic Programming Speed Duel',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    durationMinutes: 20,
    creatorName: 'Aarav Sharma',
    creatorEmail: 'aarav@example.com',
    status: 'Active',
    participants: [
      { email: 'aarav@example.com', name: 'Aarav Sharma', score: 150, solvedCount: 2, status: 'Solving' },
      { email: 'priya@example.com', name: 'Priya Patel', score: 100, solvedCount: 1, status: 'Solving' }
    ],
    targetProblems: ['Climbing Stairs', 'Coin Change', 'Longest Common Subsequence'],
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: 'battle-102',
    title: 'Trees & Graphs Weekend Sprint',
    topic: 'Trees & Graphs',
    difficulty: 'Hard',
    durationMinutes: 30,
    creatorName: 'Rohan Mehta',
    creatorEmail: 'rohan@example.com',
    status: 'Upcoming',
    participants: [
      { email: 'rohan@example.com', name: 'Rohan Mehta', score: 0, solvedCount: 0, status: 'Ready' }
    ],
    targetProblems: ['Binary Tree Maximum Path Sum', 'Course Schedule II', 'Word Ladder'],
    createdAt: new Date().toISOString()
  }
];

// Default peer competitors to populate leaderboard if DB has few users
const communityPeers = [
  { name: 'Aarav Sharma', email: 'aarav@example.com', xp: 4850, level: 5, currentStreak: 14, solvedCount: 142, rankTitle: 'Grandmaster' },
  { name: 'Priya Patel', email: 'priya@example.com', xp: 4200, level: 5, currentStreak: 11, solvedCount: 128, rankTitle: 'Master' },
  { name: 'Rohan Mehta', email: 'rohan@example.com', xp: 3950, level: 4, currentStreak: 9, solvedCount: 115, rankTitle: 'Master' },
  { name: 'Ananya Gupta', email: 'ananya@example.com', xp: 3400, level: 4, currentStreak: 7, solvedCount: 98, rankTitle: 'Candidate Master' },
  { name: 'Vikram Singh', email: 'vikram@example.com', xp: 3100, level: 4, currentStreak: 5, solvedCount: 89, rankTitle: 'Expert' },
  { name: 'Kavya Nair', email: 'kavya@example.com', xp: 2750, level: 3, currentStreak: 8, solvedCount: 76, rankTitle: 'Expert' },
  { name: 'Devansh Verma', email: 'devansh@example.com', xp: 2400, level: 3, currentStreak: 4, solvedCount: 64, rankTitle: 'Specialist' },
  { name: 'Neha Joshi', email: 'neha@example.com', xp: 2100, level: 3, currentStreak: 3, solvedCount: 52, rankTitle: 'Specialist' }
];

// GET /api/leaderboard?filter=global|weekly|friends
router.get('/', authenticateToken, async (req, res) => {
  try {
    const filter = req.query.filter || 'global';
    
    // Fetch all real users from DB
    const realUsers = await User.find({});
    const currentUserEmail = req.user.email;

    // Combine real users with community peers
    const userMap = new Map();

    communityPeers.forEach(peer => {
      userMap.set(peer.email, peer);
    });

    for (const u of realUsers) {
      const solvedProblems = await Problem.find({ userEmail: u.email, status: 'Complete' });
      userMap.set(u.email, {
        name: u.name || 'Anonymous Coder',
        email: u.email,
        xp: u.xp || 0,
        level: u.level || 1,
        currentStreak: u.currentStreak || 0,
        solvedCount: solvedProblems.length,
        rankTitle: u.xp >= 4000 ? 'Grandmaster' : u.xp >= 3000 ? 'Master' : u.xp >= 2000 ? 'Expert' : 'Specialist',
        isCurrentUser: u.email === currentUserEmail
      });
    }

    let leaderboardList = Array.from(userMap.values());

    if (filter === 'weekly') {
      leaderboardList = leaderboardList.map(u => ({
        ...u,
        weeklyXP: Math.round((u.xp % 800) + (u.currentStreak * 45))
      })).sort((a, b) => b.weeklyXP - a.weeklyXP);
    } else if (filter === 'friends') {
      // Simulate friends filter + current user
      leaderboardList = leaderboardList
        .filter(u => u.isCurrentUser || ['aarav@example.com', 'priya@example.com', 'ananya@example.com'].includes(u.email))
        .sort((a, b) => b.xp - a.xp);
    } else {
      leaderboardList.sort((a, b) => b.xp - a.xp);
    }

    // Attach numerical rank
    leaderboardList = leaderboardList.map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));

    const currentUserRank = leaderboardList.find(entry => entry.email === currentUserEmail) || {
      rank: leaderboardList.length + 1,
      name: req.user.name || 'You',
      email: currentUserEmail,
      xp: req.user.xp || 0,
      level: req.user.level || 1,
      currentStreak: req.user.currentStreak || 0,
      solvedCount: 0,
      rankTitle: 'Novice',
      isCurrentUser: true
    };

    res.json({
      filter,
      leaderboard: leaderboardList,
      currentUserRank,
      totalParticipants: leaderboardList.length
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET /api/leaderboard/battles - List active and upcoming friendly competitions
router.get('/battles', authenticateToken, (req, res) => {
  res.json({ battles: friendlyBattles });
});

// POST /api/leaderboard/battles - Create a friendly battle room
router.post('/battles', authenticateToken, (req, res) => {
  try {
    const { title, topic, difficulty, durationMinutes, matchMode } = req.body;
    const newBattle = {
      id: `battle-${Date.now()}`,
      title: title || `${topic || 'DSA'} ${matchMode || '1v1 Duel'}`,
      topic: topic || 'Arrays & Hashing',
      difficulty: difficulty || 'Medium',
      durationMinutes: parseInt(durationMinutes) || 15,
      creatorName: req.user.name || 'Student',
      creatorEmail: req.user.email,
      status: 'Active',
      matchMode: matchMode || '1v1 Duel',
      participants: [
        {
          email: req.user.email,
          name: req.user.name || 'Student',
          score: 0,
          solvedCount: 0,
          status: 'In Progress'
        },
        {
          email: 'bot-rival@roadtooffer.com',
          name: 'AI Rival (Skill matched)',
          score: 50,
          solvedCount: 1,
          status: 'In Progress'
        }
      ],
      targetProblems: [
        `Solve 2 ${topic || 'Array'} problems under ${durationMinutes || 15} mins`,
        `Optimize time complexity to O(N)`,
        `Pass all hidden test cases`
      ],
      createdAt: new Date().toISOString()
    };

    friendlyBattles.unshift(newBattle);
    res.json({ battle: newBattle, message: 'Friendly battle room created successfully!' });
  } catch (error) {
    console.error('Error creating battle:', error);
    res.status(500).json({ error: 'Failed to create battle' });
  }
});

// POST /api/leaderboard/battles/:id/join - Join friendly competition
router.post('/battles/:id/join', authenticateToken, (req, res) => {
  const { id } = req.params;
  const battle = friendlyBattles.find(b => b.id === id);
  if (!battle) {
    return res.status(404).json({ error: 'Battle not found' });
  }

  const existing = battle.participants.find(p => p.email === req.user.email);
  if (!existing) {
    battle.participants.push({
      email: req.user.email,
      name: req.user.name || 'Student',
      score: 0,
      solvedCount: 0,
      status: 'In Progress'
    });
  }

  res.json({ battle, message: 'Successfully joined friendly battle!' });
});

// POST /api/leaderboard/battles/:id/submit - Submit score/progress in a battle
router.post('/battles/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { pointsEarned } = req.body;
    const battle = friendlyBattles.find(b => b.id === id);
    if (!battle) {
      return res.status(404).json({ error: 'Battle not found' });
    }

    const participant = battle.participants.find(p => p.email === req.user.email);
    if (participant) {
      participant.score += (pointsEarned || 50);
      participant.solvedCount += 1;
      if (participant.solvedCount >= 2) {
        participant.status = 'Finished';
      }
    }

    // Award bonus XP to user
    const user = await User.findOne({ email: req.user.email });
    if (user) {
      user.xp = (user.xp || 0) + (pointsEarned || 50);
      await User.updateOne({ email: req.user.email }, { $set: { xp: user.xp } });
    }

    res.json({ battle, userXP: user ? user.xp : undefined, message: 'Battle score updated! +XP awarded.' });
  } catch (error) {
    console.error('Error submitting battle score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

module.exports = router;
