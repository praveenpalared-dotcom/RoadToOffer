const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Problem } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'roadtooffer_jwt_secret_token_key_2026_dsa_tracker';

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });
    req.user = decoded;
    next();
  });
};

// Helper: Calculate streak updates on user load
function checkAndResetStreak(user) {
  if (!user.lastActiveDate) return false;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const lastActive = new Date(user.lastActiveDate);
  const today = new Date(todayStr);
  
  const diffTime = Math.abs(today - lastActive);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // If user hasn't logged in for more than 1 day (meaning diffDays > 1 and lastActive was NOT yesterday)
  // Let's check dates directly to avoid timezone errors:
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (user.lastActiveDate !== todayStr && user.lastActiveDate !== yesterdayStr) {
    user.currentStreak = 0;
    return true; // updated
  }
  return false;
}

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      level: 1,
      xp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      badges: [],
      dailyGoals: {
        solveCount: 0,
        solveTarget: 2,
        reviseCount: 0,
        reviseTarget: 3,
        challengeCompleted: false
      }
    });

    // Seed user problems with preloaded solved problems
    const { initializeUserProblemsAndStats } = require('../utils/seed');
    await initializeUserProblemsAndStats(email);

    const createdUser = await User.findOne({ email });
    const token = jwt.sign({ id: createdUser._id, email: createdUser.email, name: createdUser.name }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        level: createdUser.level,
        xp: createdUser.xp,
        currentStreak: createdUser.currentStreak,
        longestStreak: createdUser.longestStreak,
        lastActiveDate: createdUser.lastActiveDate,
        badges: createdUser.badges || [],
        dailyGoals: createdUser.dailyGoals || { solveCount: 0, solveTarget: 2, reviseCount: 0, reviseTarget: 3, challengeCompleted: false },
        leetcodeUsername: createdUser.leetcodeUsername || '',
        leetcodeStats: createdUser.leetcodeStats || null,
        codeforcesHandle: createdUser.codeforcesHandle || '',
        codeforcesStats: createdUser.codeforcesStats || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check streak reset
    const streakReset = checkAndResetStreak(user);
    if (streakReset) {
      await User.updateOne({ email: user.email }, { $set: { currentStreak: 0 } });
    }

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastActiveDate: user.lastActiveDate,
        badges: user.badges || [],
        dailyGoals: user.dailyGoals || { solveCount: 0, solveTarget: 2, reviseCount: 0, reviseTarget: 3, challengeCompleted: false },
        leetcodeUsername: user.leetcodeUsername || '',
        leetcodeStats: user.leetcodeStats || null,
        codeforcesHandle: user.codeforcesHandle || '',
        codeforcesStats: user.codeforcesStats || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// GET PROFILE
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check streak
    const streakReset = checkAndResetStreak(user);
    if (streakReset) {
      await User.updateOne({ email: user.email }, { $set: { currentStreak: 0 } });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastActiveDate: user.lastActiveDate,
        badges: user.badges || [],
        dailyGoals: user.dailyGoals || { solveCount: 0, solveTarget: 2, reviseCount: 0, reviseTarget: 3, challengeCompleted: false },
        leetcodeUsername: user.leetcodeUsername || '',
        leetcodeStats: user.leetcodeStats || null,
        codeforcesHandle: user.codeforcesHandle || '',
        codeforcesStats: user.codeforcesStats || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Fetching profile failed', error: error.message });
  }
});

// RESET ALL PROGRESS
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    
    const { initializeUserProblemsAndStats } = require('../utils/seed');
    await initializeUserProblemsAndStats(email);

    const updatedUser = await User.findOne({ email });

    res.json({
      message: 'Progress successfully reset.',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        level: updatedUser.level,
        xp: updatedUser.xp,
        currentStreak: updatedUser.currentStreak,
        longestStreak: updatedUser.longestStreak,
        lastActiveDate: updatedUser.lastActiveDate,
        badges: updatedUser.badges || [],
        dailyGoals: updatedUser.dailyGoals,
        leetcodeUsername: updatedUser.leetcodeUsername || '',
        leetcodeStats: updatedUser.leetcodeStats || null,
        codeforcesHandle: updatedUser.codeforcesHandle || '',
        codeforcesStats: updatedUser.codeforcesStats || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Reset failed', error: error.message });
  }
});

// RESET PASSWORD (FORGOTTEN PASSWORD)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Please provide email and new password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed', error: error.message });
  }
});

module.exports = { router, authenticateToken };
