const express = require('express');
const router = express.Router();
const { User, Topic, Problem, ActivityLog, RoadmapTrack } = require('../config/db');
const { authenticateToken } = require('./auth');

// GET ROADMAP STATE (TOPICS & COMPLETION METRICS)
router.get('/roadmap', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const allTopics = await Topic.find();
    let allTracks = [];
    try {
      allTracks = await RoadmapTrack.find();
      allTracks.sort((a, b) => a.order - b.order);
    } catch(e) {}
    
    const userProblems = await Problem.find({ userEmail: email });

    // Group progress by topic
    const topicStats = allTopics.map(t => {
      const topicProbs = userProblems.filter(p => p.topicSlug === t.slug);
      const total = topicProbs.length;
      const completed = topicProbs.filter(p => p.status === 'Complete').length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      let status = 'Not Started';
      if (completed === total && total > 0) status = 'Mastered';
      else if (completed > 0) status = 'In Progress';

      return {
        name: t.name,
        slug: t.slug,
        phase: t.phase,
        track: t.track,
        order: t.order,
        totalProblems: total,
        completedProblems: completed,
        percentage: percent,
        status
      };
    });

    res.json({ tracks: allTracks, topics: topicStats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch roadmap', error: error.message });
  }
});

// GET PROBLEMS BY TOPIC
router.get('/problems/:topicSlug', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const slug = req.params.topicSlug;

    // Auto-sync missing template problems for this user
    const templates = await Problem.find({ userEmail: 'template', topicSlug: slug });
    let userProblems = await Problem.find({ userEmail: email, topicSlug: slug });

    const userProbNames = new Set(userProblems.map(p => p.name.toLowerCase().trim()));
    const missingTemplates = templates.filter(t => !userProbNames.has(t.name.toLowerCase().trim()));

    if (missingTemplates.length > 0) {
      for (const t of missingTemplates) {
        await Problem.create({
          name: t.name,
          difficulty: t.difficulty,
          pattern: t.pattern || '',
          platform: t.platform || 'LeetCode',
          status: 'Not Started',
          notes: '',
          userCode: t.userCode || {},
          answer: t.answer || '',
          revisionSchedule: 'None',
          lastSolved: '',
          timesRevised: 0,
          companyTags: t.companyTags || [],
          solutionLink: t.solutionLink || '',
          topicSlug: slug,
          userEmail: email,
          isFavorite: false,
          xp: t.xp || 20
        });
      }
      userProblems = await Problem.find({ userEmail: email, topicSlug: slug });
    }

    res.json({ problems: userProblems });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch problems', error: error.message });
  }
});

// GET SINGLE PROBLEM
router.get('/problem/:problemId', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const id = req.params.problemId;
    const problem = await Problem.findOne({ _id: id, userEmail: email });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json({ problem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch problem detail', error: error.message });
  }
});

// GET GENERAL USER STATS (DASHBOARD SUMMARY)
router.get('/dashboard-stats', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const problems = await Problem.find({ userEmail: email });
    const total = problems.length;
    const completed = problems.filter(p => p.status === 'Complete').length;
    const completionPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Heatmap data (problems solved per date)
    const logs = await ActivityLog.find({ userEmail: email });
    // Group logs by date
    const heatmap = {};
    logs.forEach(log => {
      heatmap[log.date] = (heatmap[log.date] || 0) + 1;
    });

    // Recent activity (last 7 logs)
    const recentActivity = logs
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 10);

    // Analytics: Difficulty Distribution
    const easy = problems.filter(p => p.difficulty === 'Easy');
    const medium = problems.filter(p => p.difficulty === 'Medium');
    const hard = problems.filter(p => p.difficulty === 'Hard');
    const difficultyDist = [
      { name: 'Easy', count: easy.length, completed: easy.filter(p => p.status === 'Complete').length },
      { name: 'Medium', count: medium.length, completed: medium.filter(p => p.status === 'Complete').length },
      { name: 'Hard', count: hard.length, completed: hard.filter(p => p.status === 'Complete').length }
    ];

    // --- READINESS ENGINE ---
    const allTopics = await Topic.find();
    const trackCategoryMap = {
      'TRACK C — DSA': 'DSA',
      'TRACK D — CS FUNDAMENTALS': 'CS Fundamentals',
      'TRACK B — COMPUTATIONAL THINKING': 'CT',
      'TRACK I — APTITUDE': 'Aptitude',
      'TRACK E — WEB DEVELOPMENT': 'Development',
      'TRACK F — BACKEND': 'Development',
      'TRACK G — CLOUD & DEVOPS': 'Development',
      'TRACK H — AI / GENAI': 'AI/GenAI'
    };

    const categoryScores = {
      DSA: 0,
      'CS Fundamentals': 0,
      CT: 0,
      Aptitude: 0,
      Development: 0,
      'AI/GenAI': 0,
      Projects: user.placementReadiness?.projects || 0,
      Resume: user.placementReadiness?.resume || 0,
      Interview: user.placementReadiness?.interview || 0,
      Communication: user.placementReadiness?.communication || 0
    };

    const categoryTotals = {
      DSA: { t: 0, c: 0 },
      'CS Fundamentals': { t: 0, c: 0 },
      CT: { t: 0, c: 0 },
      Aptitude: { t: 0, c: 0 },
      Development: { t: 0, c: 0 },
      'AI/GenAI': { t: 0, c: 0 }
    };

    problems.forEach(p => {
      const topic = allTopics.find(t => t.slug === p.topicSlug);
      if (topic) {
        let cat = trackCategoryMap[topic.track];
        if (cat && categoryTotals[cat]) {
          categoryTotals[cat].t += 1;
          if (p.status === 'Complete') categoryTotals[cat].c += 1;
        }
      }
    });

    for (let cat in categoryTotals) {
      if (categoryTotals[cat].t > 0) {
        categoryScores[cat] = Math.round((categoryTotals[cat].c / categoryTotals[cat].t) * 100);
      }
    }

    // Dynamic Weights based on Career Path
    const careerPath = user.preferences?.careerPath || 'Software Engineer';
    let weights = {};
    if (careerPath === 'Backend Engineer') {
      weights = { DSA: 0.20, 'CS Fundamentals': 0.20, Development: 0.25, Projects: 0.15, CT: 0.05, Aptitude: 0.05, 'AI/GenAI': 0.0, Resume: 0.05, Interview: 0.05, Communication: 0.0 };
    } else if (careerPath === 'AI Engineer') {
      weights = { DSA: 0.20, 'CS Fundamentals': 0.10, Development: 0.10, Projects: 0.15, CT: 0.05, Aptitude: 0.05, 'AI/GenAI': 0.25, Resume: 0.05, Interview: 0.05, Communication: 0.0 };
    } else if (careerPath === 'Frontend Engineer') {
      weights = { DSA: 0.15, 'CS Fundamentals': 0.10, Development: 0.30, Projects: 0.20, CT: 0.05, Aptitude: 0.05, 'AI/GenAI': 0.0, Resume: 0.05, Interview: 0.05, Communication: 0.05 };
    } else {
      // Default / Software Engineer
      weights = { DSA: 0.20, 'CS Fundamentals': 0.15, CT: 0.10, Aptitude: 0.10, Projects: 0.15, Development: 0.10, 'AI/GenAI': 0.05, Resume: 0.05, Interview: 0.05, Communication: 0.05 };
    }

    let overallScore = 0;
    for (let cat in weights) {
      overallScore += (categoryScores[cat] || 0) * weights[cat];
    }
    overallScore = Math.round(overallScore);

    const sortedCategories = Object.keys(categoryScores).sort((a, b) => categoryScores[a] - categoryScores[b]);
    const weakest = sortedCategories[0];
    const strongest = sortedCategories[sortedCategories.length - 1];

    // Generate Biggest Bottleneck
    const bottleneckReasons = {
      'DSA': 'Your problem solving speed and algorithmic knowledge needs improvement for technical rounds.',
      'CS Fundamentals': 'Core theoretical concepts like OS, DBMS, and Networks are frequently asked but you are falling behind.',
      'Projects': 'You lack practical proof of work. Real-world projects are crucial to bypass resume screening.',
      'Development': 'Your hands-on framework and backend/frontend skills are currently too weak for production roles.',
      'AI/GenAI': 'You are missing core modern AI integration skills required for this specific role.',
      'Aptitude': 'You may fail the initial online assessment rounds due to low quantitative/logical scores.',
      'Interview': 'Your mock interview performance shows a lack of confidence or clear structuring of answers.',
      'Resume': 'Your resume is not ATS-friendly and lacks quantified impact.'
    };

    const biggestBottleneck = {
      name: weakest,
      reason: bottleneckReasons[weakest] || `You have completed only ${categoryScores[weakest] || 0}% of ${weakest} preparation.`,
      recommendations: [
        `Spend 45 mins reviewing ${weakest} core concepts.`,
        `Solve 2 medium problems related to ${weakest}.`,
        `Complete pending tasks in the Roadmap.`
      ]
    };

    // Generate Today's Mission
    const todayMission = [
      { id: 1, title: `45 min — ${weakest} Deep Dive`, completed: false },
      { id: 2, title: `30 min — ${sortedCategories[1] || 'CS Fundamentals'}`, completed: false },
      { id: 3, title: `60 min — Project Development`, completed: false },
      { id: 4, title: `30 min — LeetCode Daily`, completed: false },
      { id: 5, title: `15 min — Mock Interview Prep`, completed: false }
    ];

    const placementReadiness = {
      overall: overallScore,
      breakdown: categoryScores,
      trend: '+2%', 
      strongest,
      weakest,
      careerPath
    };

    // MOCK DATA for Phase 1
    const upcomingDeadlines = [
      { id: 1, title: 'Amazon SDE Intern Application', daysLeft: 2, urgency: 'high' },
      { id: 2, title: 'Global Hackathon 2026', daysLeft: 7, urgency: 'medium' },
      { id: 3, title: 'TCS NQT Registration', daysLeft: 14, urgency: 'low' }
    ];

    const recentAchievements = [
      { id: 1, title: '7 Day Streak', icon: '🔥', date: 'Today' },
      { id: 2, title: 'First Project Shipped', icon: '💻', date: '2 days ago' },
      { id: 3, title: 'First Problem Solved', icon: '🥉', date: '1 week ago' }
    ];

    const weeklyPerformance = {
      dsa: '+18%',
      cs: '+12%',
      projects: '+25%',
      consistency: '+31%'
    };

    const aiCareerInsight = `Your project work improved significantly this week (+25%), but your ${weakest} preparation remains behind. Focus on ${weakest} to boost your overall placement readiness.`;

    res.json({
      overall: {
        total,
        completed,
        percentage: completionPercent,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        rank: getRankFromLevel(user.level),
        xp: user.xp,
        level: user.level,
        dailyGoals: user.dailyGoals
      },
      placementReadiness,
      difficulty: difficultyDist,
      heatmap,
      recentActivity,
      biggestBottleneck,
      todayMission,
      upcomingDeadlines,
      recentAchievements,
      weeklyPerformance,
      aiCareerInsight
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate dashboard statistics', error: error.message });
  }
});

// UPDATE PROBLEM STATUS / SUBMIT SOLUTION
router.put('/problem/:problemId', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const id = req.params.problemId;
    const { status, notes, solutionLink, revisionSchedule, isFavorite, userCode, answer, userSolution } = req.body;

    const problem = await Problem.findOne({ _id: id, userEmail: email });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const wasCompleted = problem.status === 'Complete';
    const isNowCompleted = status === 'Complete';

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;
    if (userCode !== undefined) updateFields.userCode = userCode;
    if (answer !== undefined) updateFields.answer = answer;
    if (userSolution !== undefined) updateFields.answer = userSolution;
    if (solutionLink !== undefined) updateFields.solutionLink = solutionLink;
    if (revisionSchedule !== undefined) updateFields.revisionSchedule = revisionSchedule;
    if (isFavorite !== undefined) updateFields.isFavorite = isFavorite;

    let xpEarned = 0;
    let streakIncremented = false;
    let badgeUnlocked = null;

    const todayStr = new Date().toISOString().split('T')[0];

    // If marked completed now, but wasn't completed before
    if (isNowCompleted && !wasCompleted) {
      updateFields.lastSolved = todayStr;
      
      // Calculate XP
      if (problem.difficulty === 'Easy') xpEarned = 20;
      else if (problem.difficulty === 'Medium') xpEarned = 50;
      else if (problem.difficulty === 'Hard') xpEarned = 100;
      
      // Create activity log
      await ActivityLog.create({
        userEmail: email,
        date: todayStr,
        problemName: problem.name,
        xpEarned
      });
    }

    // Update the problem
    await Problem.updateOne({ _id: id, userEmail: email }, { $set: updateFields });

    // Update user states (XP, Level, Streaks, Daily Goals, Badges)
    const user = await User.findOne({ email });
    if (user) {
      const newXp = user.xp + xpEarned;
      const newLevel = Math.floor(newXp / 1000) + 1;
      
      // Streak Calculation
      let newStreak = (user.currentStreak || 0);
      let newLongest = (user.longestStreak || 0);
      if (xpEarned > 0) {
        if (!user.lastActiveDate) {
          newStreak = 1;
        } else if (user.lastActiveDate !== todayStr) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (user.lastActiveDate === yesterdayStr) {
            newStreak = (user.currentStreak || 0) + 1;
          } else {
            newStreak = 1;
          }
        } else if (newStreak === 0) {
          newStreak = 1;
        }

        if (newStreak > newLongest) {
          newLongest = newStreak;
        }
        streakIncremented = true;
      }

      // Update Daily Goal Checklist
      const goals = { ...user.dailyGoals };
      if (xpEarned > 0) {
        goals.solveCount = (goals.solveCount || 0) + 1;
        if (goals.solveCount >= goals.solveTarget && goals.reviseCount >= goals.reviseTarget) {
          goals.challengeCompleted = true;
        }
      }

      // Check Badges
      const allProblems = await Problem.find({ userEmail: email });
      const completedProbs = allProblems.filter(p => p.status === 'Complete');
      const allTopics = await Topic.find();

      const phases = ['Foundation', 'Problem Solving', 'Trees', 'Graphs', 'Dynamic Programming', 'Advanced'];
      const phaseBadgeMapping = {
        'Foundation': 'Bronze',
        'Problem Solving': 'Silver',
        'Trees': 'Gold',
        'Graphs': 'Platinum',
        'Dynamic Programming': 'Diamond',
        'Advanced': 'Grandmaster'
      };

      const userBadges = [...(user.badges || [])];

      for (const phase of phases) {
        const badgeName = phaseBadgeMapping[phase];
        if (!userBadges.includes(badgeName)) {
          // Check if all problems in all topics of this phase are completed
          const phaseTopicSlugs = allTopics.filter(t => t.phase === phase).map(t => t.slug);
          const phaseProblems = allProblems.filter(p => phaseTopicSlugs.includes(p.topicSlug));
          
          if (phaseProblems.length > 0 && phaseProblems.every(p => p.status === 'Complete')) {
            userBadges.push(badgeName);
            badgeUnlocked = badgeName;
          }
        }
      }

      // If all templates across all phases are complete, user earns 'Grandmaster' (which maps to Advanced or complete roadmap)
      if (!userBadges.includes('Grandmaster')) {
        if (allProblems.length > 0 && allProblems.every(p => p.status === 'Complete')) {
          userBadges.push('Grandmaster');
          badgeUnlocked = 'Grandmaster';
        }
      }

      await User.updateOne({ email }, {
        $set: {
          xp: newXp,
          level: newLevel,
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastActiveDate: todayStr,
          badges: userBadges,
          dailyGoals: goals
        }
      });
    }

    const updatedUser = await User.findOne({ email });

    res.json({
      message: 'Problem updated successfully',
      xpEarned,
      levelUp: updatedUser.level > user.level,
      badgeUnlocked,
      user: {
        level: updatedUser.level,
        xp: updatedUser.xp,
        currentStreak: updatedUser.currentStreak,
        longestStreak: updatedUser.longestStreak,
        badges: updatedUser.badges,
        dailyGoals: updatedUser.dailyGoals
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update problem status', error: error.message });
  }
});

// TOGGLE DAILY CHECKLIST ITEMS
router.put('/daily-goals', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const { reviseCount, solveCount, challengeCompleted } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const goals = { ...user.dailyGoals };
    if (reviseCount !== undefined) goals.reviseCount = reviseCount;
    if (solveCount !== undefined) goals.solveCount = solveCount;
    if (challengeCompleted !== undefined) goals.challengeCompleted = challengeCompleted;

    await User.updateOne({ email }, { $set: { dailyGoals: goals } });
    
    res.json({ dailyGoals: goals });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update daily goals', error: error.message });
  }
});

// ADMIN ROUTES: ADD TOPIC
router.post('/admin/topics', authenticateToken, async (req, res) => {
  try {
    const { name, phase, order } = req.body;
    if (!name || !phase) return res.status(400).json({ message: 'Name and phase are required' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newTopic = await Topic.create({ name, slug, phase, order: order || 0 });

    res.status(201).json({ message: 'Topic created successfully', topic: newTopic });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create topic', error: error.message });
  }
});

// ADMIN ROUTES: ADD PROBLEM
router.post('/admin/problems', authenticateToken, async (req, res) => {
  try {
    const { name, difficulty, pattern, platform, companyTags, solutionLink, topicSlug } = req.body;
    if (!name || !difficulty || !topicSlug) {
      return res.status(400).json({ message: 'Name, difficulty and topic are required' });
    }

    let xp = 20;
    if (difficulty === 'Medium') xp = 50;
    else if (difficulty === 'Hard') xp = 100;

    // Create template problem first
    const templateProblem = await Problem.create({
      name,
      difficulty,
      pattern: pattern || '',
      platform: platform || 'LeetCode',
      status: 'Not Started',
      notes: '',
      revisionSchedule: 'None',
      lastSolved: '',
      timesRevised: 0,
      companyTags: companyTags || [],
      solutionLink: solutionLink || '',
      topicSlug,
      userEmail: 'template',
      isFavorite: false,
      xp
    });

    // Seed this problem for the logged-in admin user as well
    await Problem.create({
      name,
      difficulty,
      pattern: pattern || '',
      platform: platform || 'LeetCode',
      status: 'Not Started',
      notes: '',
      revisionSchedule: 'None',
      lastSolved: '',
      timesRevised: 0,
      companyTags: companyTags || [],
      solutionLink: solutionLink || '',
      topicSlug,
      userEmail: req.user.email,
      isFavorite: false,
      xp
    });

    res.status(201).json({ message: 'Problem added successfully', problem: templateProblem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add problem', error: error.message });
  }
});

// ADMIN ROUTES: EDIT PROBLEM
router.put('/admin/problems/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, difficulty, pattern, platform, companyTags, solutionLink } = req.body;
    
    const problem = await Problem.findOne({ _id: id });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    let xp = 20;
    if (difficulty === 'Medium') xp = 50;
    else if (difficulty === 'Hard') xp = 100;

    const updates = { name, difficulty, pattern, platform, companyTags, solutionLink, xp };
    await Problem.updateOne({ _id: id }, { $set: updates });

    res.json({ message: 'Problem updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update problem', error: error.message });
  }
});

// ADMIN ROUTES: DELETE PROBLEM
router.delete('/admin/problems/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    await Problem.deleteOne({ _id: id });
    res.json({ message: 'Problem deleted successfully from templates' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete problem', error: error.message });
  }
});

// Helper: CSV line parser handling quotes, commas, and formatting
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"+|"+$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"+|"+$/g, ''));
  return result;
}

// ADMIN ROUTES: BULK UPLOAD CSV
router.post('/admin/upload-csv', authenticateToken, async (req, res) => {
  try {
    const { csvData, topicSlug } = req.body; // Expect raw CSV rows as string
    if (!csvData || !topicSlug) return res.status(400).json({ message: 'Missing CSV content or topic selection' });

    // Parse simple CSV rows
    const lines = csvData.replace(/\r/g, '').split('\n');
    let imported = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || i === 0) continue; // skip header or empty lines
      
      const matches = parseCSVLine(line);
      if (matches.length < 2) continue;

      const name = matches[0];
      const difficulty = matches[1]; // Easy, Medium, Hard
      const pattern = matches[2] || '';
      const platform = matches[3] || 'LeetCode';
      const companyTagsString = matches[4] || '';
      const solutionLink = matches[5] || '';

      const companyTags = companyTagsString ? companyTagsString.split(';').map(c => c.trim()) : [];

      let xp = 20;
      if (difficulty === 'Medium') xp = 50;
      else if (difficulty === 'Hard') xp = 100;

      // Seed template
      await Problem.create({
        name,
        difficulty,
        pattern,
        platform,
        status: 'Not Started',
        notes: '',
        revisionSchedule: 'None',
        lastSolved: '',
        timesRevised: 0,
        companyTags,
        solutionLink,
        topicSlug,
        userEmail: 'template',
        isFavorite: false,
        xp
      });

      // Seed for current user
      await Problem.create({
        name,
        difficulty,
        pattern,
        platform,
        status: 'Not Started',
        notes: '',
        revisionSchedule: 'None',
        lastSolved: '',
        timesRevised: 0,
        companyTags,
        solutionLink,
        topicSlug,
        userEmail: req.user.email,
        isFavorite: false,
        xp
      });

      imported++;
    }

    res.json({ message: `Successfully imported ${imported} problems into ${topicSlug}.` });
  } catch (error) {
    res.status(500).json({ message: 'CSV parse/import failed', error: error.message });
  }
});

// Helper for Rank Title
function getRankFromLevel(level) {
  if (level < 5) return 'Beginner 🌟';
  if (level < 10) return 'Bronze 🥉';
  if (level < 20) return 'Silver 🥈';
  if (level < 30) return 'Gold 🥇';
  if (level < 40) return 'Platinum 💎';
  if (level < 50) return 'Diamond 💠';
  return 'Grandmaster 👑';
}

module.exports = router;
