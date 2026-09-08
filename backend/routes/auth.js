const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  User,
  Problem,
  connectDB
} = require('../config/db');

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'roadtooffer_jwt_secret_token_key_2026_dsa_tracker';

// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Access Denied: No Token Provided'
    });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: 'Invalid or Expired Token'
        });
      }

      req.user = decoded;
      next();
    }
  );
};

// ============================================================
// STREAK HELPER
// ============================================================

function checkAndResetStreak(user) {
  if (!user.lastActiveDate) {
    return false;
  }

  const todayStr =
    new Date().toISOString().split('T')[0];

  const yesterday = new Date();
  yesterday.setDate(
    yesterday.getDate() - 1
  );

  const yesterdayStr =
    yesterday.toISOString().split('T')[0];

  if (
    user.lastActiveDate !== todayStr &&
    user.lastActiveDate !== yesterdayStr
  ) {
    user.currentStreak = 0;
    return true;
  }

  return false;
}

// ============================================================
// REGISTER
// ============================================================

router.post('/register', async (req, res) => {
  try {
    // IMPORTANT:
    // Make sure MongoDB is connected before querying.
    await connectDB();

    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please enter all fields'
      });
    }

    // Check if user already exists
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message:
          'User already exists with this email'
      });
    }

    // Hash password
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // Create user
    const newUser =
      await User.create({
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

    // ========================================================
    // GENERATE JWT IMMEDIATELY
    // ========================================================

    const token =
      jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name
        },
        JWT_SECRET,
        {
          expiresIn: '7d'
        }
      );

    // ========================================================
    // IMPORTANT
    //
    // DO NOT initialize problems here.
    //
    // Registration must return immediately.
    // Problem initialization is handled separately.
    // ========================================================

    console.log(
      `[REGISTER] User created successfully: ${email}`
    );

    // ========================================================
    // RETURN RESPONSE IMMEDIATELY
    // ========================================================

    return res.status(201).json({
      token,

      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,

        level: newUser.level,
        xp: newUser.xp,

        currentStreak:
          newUser.currentStreak,

        longestStreak:
          newUser.longestStreak,

        lastActiveDate:
          newUser.lastActiveDate,

        badges:
          newUser.badges || [],

        dailyGoals:
          newUser.dailyGoals || {
            solveCount: 0,
            solveTarget: 2,
            reviseCount: 0,
            reviseTarget: 3,
            challengeCompleted: false
          },

        leetcodeUsername:
          newUser.leetcodeUsername || '',

        leetcodeStats:
          newUser.leetcodeStats || null,

        codeforcesHandle:
          newUser.codeforcesHandle || '',

        codeforcesStats:
          newUser.codeforcesStats || null
      }
    });

  } catch (error) {
    console.error(
      '[REGISTER] Error:',
      error
    );

    return res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
});

// ============================================================
// INITIALIZE USER PROBLEMS
// ============================================================
//
// This is a separate endpoint.
//
// Registration does NOT wait for this.
//
// Frontend can call this after authentication.
// ============================================================

router.post(
  '/initialize',
  authenticateToken,
  async (req, res) => {
    try {
      // Make sure MongoDB is connected
      await connectDB();

      const email =
        req.user.email;

      console.log(
        `[INITIALIZE] Starting problem initialization for ${email}`
      );

      // Check whether problems already exist
      const existingProblems =
        await Problem.countDocuments({
          userEmail: email
        });

      if (existingProblems > 0) {
        console.log(
          `[INITIALIZE] ${existingProblems} problems already exist for ${email}`
        );

        return res.json({
          message:
            'User problems already initialized',

          initialized: false,

          totalProblems:
            existingProblems
        });
      }

      const {
        initializeUserProblemsAndStats
      } = require('../utils/seed');

      const result =
        await initializeUserProblemsAndStats(
          email
        );

      console.log(
        `[INITIALIZE] Completed for ${email}`
      );

      return res.status(201).json({
        message:
          'User problems initialized successfully',

        initialized: true,

        totalProblems:
          result.totalProblems
      });

    } catch (error) {
      console.error(
        '[INITIALIZE] Error:',
        error
      );

      return res.status(500).json({
        message:
          'Problem initialization failed',

        error: error.message
      });
    }
  }
);

// ============================================================
// LOGIN
// ============================================================

router.post('/login', async (req, res) => {
  try {
    // Make sure MongoDB is connected
    await connectDB();

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please enter all fields'
      });
    }

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Check streak
    const streakReset =
      checkAndResetStreak(user);

    if (streakReset) {
      await User.updateOne(
        { email: user.email },
        {
          $set: {
            currentStreak: 0
          }
        }
      );
    }

    // Generate JWT
    const token =
      jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name
        },
        JWT_SECRET,
        {
          expiresIn: '7d'
        }
      );

    return res.json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,

        level: user.level,
        xp: user.xp,

        currentStreak:
          user.currentStreak,

        longestStreak:
          user.longestStreak,

        lastActiveDate:
          user.lastActiveDate,

        badges:
          user.badges || [],

        dailyGoals:
          user.dailyGoals || {
            solveCount: 0,
            solveTarget: 2,
            reviseCount: 0,
            reviseTarget: 3,
            challengeCompleted: false
          },

        leetcodeUsername:
          user.leetcodeUsername || '',

        leetcodeStats:
          user.leetcodeStats || null,

        codeforcesHandle:
          user.codeforcesHandle || '',

        codeforcesStats:
          user.codeforcesStats || null
      }
    });

  } catch (error) {
    console.error(
      '[LOGIN] Error:',
      error
    );

    return res.status(500).json({
      message: 'Login failed',
      error: error.message
    });
  }
});

// ============================================================
// GET PROFILE
// ============================================================

router.get(
  '/profile',
  authenticateToken,
  async (req, res) => {
    try {
      // Make sure MongoDB is connected
      await connectDB();

      const user =
        await User.findOne({
          email: req.user.email
        });

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      const streakReset =
        checkAndResetStreak(user);

      if (streakReset) {
        await User.updateOne(
          { email: user.email },
          {
            $set: {
              currentStreak: 0
            }
          }
        );
      }

      return res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,

          level: user.level,
          xp: user.xp,

          currentStreak:
            user.currentStreak,

          longestStreak:
            user.longestStreak,

          lastActiveDate:
            user.lastActiveDate,

          badges:
            user.badges || [],

          dailyGoals:
            user.dailyGoals || {
              solveCount: 0,
              solveTarget: 2,
              reviseCount: 0,
              reviseTarget: 3,
              challengeCompleted: false
            },

          leetcodeUsername:
            user.leetcodeUsername || '',

          leetcodeStats:
            user.leetcodeStats || null,

          codeforcesHandle:
            user.codeforcesHandle || '',

          codeforcesStats:
            user.codeforcesStats || null
        }
      });

    } catch (error) {
      console.error(
        '[PROFILE] Error:',
        error
      );

      return res.status(500).json({
        message:
          'Fetching profile failed',

        error: error.message
      });
    }
  }
);

// ============================================================
// RESET ALL PROGRESS
// ============================================================

router.post(
  '/reset',
  authenticateToken,
  async (req, res) => {
    try {
      // Make sure MongoDB is connected
      await connectDB();

      const email =
        req.user.email;

      const {
        initializeUserProblemsAndStats
      } = require('../utils/seed');

      // Reset intentionally waits
      await initializeUserProblemsAndStats(
        email
      );

      const updatedUser =
        await User.findOne({
          email
        });

      return res.json({
        message:
          'Progress successfully reset.',

        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,

          level: updatedUser.level,
          xp: updatedUser.xp,

          currentStreak:
            updatedUser.currentStreak,

          longestStreak:
            updatedUser.longestStreak,

          lastActiveDate:
            updatedUser.lastActiveDate,

          badges:
            updatedUser.badges || [],

          dailyGoals:
            updatedUser.dailyGoals,

          leetcodeUsername:
            updatedUser.leetcodeUsername || '',

          leetcodeStats:
            updatedUser.leetcodeStats || null,

          codeforcesHandle:
            updatedUser.codeforcesHandle || '',

          codeforcesStats:
            updatedUser.codeforcesStats || null
        }
      });

    } catch (error) {
      console.error(
        '[RESET] Error:',
        error
      );

      return res.status(500).json({
        message: 'Reset failed',
        error: error.message
      });
    }
  }
);

// ============================================================
// RESET PASSWORD
// ============================================================

router.post(
  '/reset-password',
  async (req, res) => {
    try {
      // Make sure MongoDB is connected
      await connectDB();

      const {
        email,
        newPassword
      } = req.body;

      if (!email || !newPassword) {
        return res.status(400).json({
          message:
            'Please provide email and new password'
        });
      }

      const user =
        await User.findOne({
          email
        });

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      const salt =
        await bcrypt.genSalt(10);

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          salt
        );

      await User.updateOne(
        { email },
        {
          $set: {
            password: hashedPassword
          }
        }
      );

      return res.json({
        message:
          'Password reset successfully'
      });

    } catch (error) {
      console.error(
        '[RESET PASSWORD] Error:',
        error
      );

      return res.status(500).json({
        message:
          'Password reset failed',

        error: error.message
      });
    }
  }
);

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  router,
  authenticateToken
};