const { Topic, Problem, User, ActivityLog, RoadmapTrack } = require('../config/db');
const bcrypt = require('bcryptjs');

const roadmapTracks = [
  { name: 'TRACK A — PROGRAMMING FOUNDATION', description: 'Core programming concepts and basic tools.', order: 1 },
  { name: 'TRACK B — COMPUTATIONAL THINKING', description: 'Develop logical problem solving skills.', order: 2 },
  { name: 'TRACK C — DSA', description: 'Data Structures and Algorithms for coding interviews.', order: 3 },
  { name: 'TRACK D — CS FUNDAMENTALS', description: 'Core computer science subjects.', order: 4 },
  { name: 'TRACK E — WEB DEVELOPMENT', description: 'Frontend engineering and frameworks.', order: 5 },
  { name: 'TRACK F — BACKEND', description: 'Server-side development and databases.', order: 6 },
  { name: 'TRACK G — CLOUD & DEVOPS', description: 'Deployment, containers, and cloud infrastructure.', order: 7 },
  { name: 'TRACK H — AI / GENAI', description: 'Artificial intelligence and generative models.', order: 8 },
  { name: 'TRACK I — APTITUDE', description: 'Quantitative, logical, and verbal reasoning.', order: 9 },
  { name: 'TRACK J — CAREER', description: 'Resume building and interview preparation.', order: 10 }
];

const topics = [
  // TRACK A
  { name: 'C++', slug: 'cpp', phase: 'Language', track: 'TRACK A — PROGRAMMING FOUNDATION', order: 0 },
  { name: 'Python', slug: 'python', phase: 'Language', track: 'TRACK A — PROGRAMMING FOUNDATION', order: 1 },
  { name: 'JavaScript', slug: 'javascript-basics', phase: 'Language', track: 'TRACK A — PROGRAMMING FOUNDATION', order: 2 },
  { name: 'STL', slug: 'stl', phase: 'Core', track: 'TRACK A — PROGRAMMING FOUNDATION', order: 3 },
  { name: 'Time Complexity', slug: 'time-complexity', phase: 'Complexity', track: 'TRACK A — PROGRAMMING FOUNDATION', order: 4 },
  { name: 'Space Complexity', slug: 'space-complexity', phase: 'Complexity', track: 'TRACK A — PROGRAMMING FOUNDATION', order: 5 },
  { name: 'Git', slug: 'git', phase: 'Tools', track: 'TRACK A — PROGRAMMING FOUNDATION', order: 6 },
  { name: 'GitHub', slug: 'github', phase: 'Tools', track: 'TRACK A — PROGRAMMING FOUNDATION', order: 7 },
  { name: 'Linux basics', slug: 'linux-basics', phase: 'Tools', track: 'TRACK A — PROGRAMMING FOUNDATION', order: 8 },

  // TRACK B
  { name: 'Conditionals', slug: 'conditionals', phase: 'Foundation', track: 'TRACK B — COMPUTATIONAL THINKING', order: 0 },
  { name: 'Loops', slug: 'loops', phase: 'Foundation', track: 'TRACK B — COMPUTATIONAL THINKING', order: 1 },
  { name: 'Arithmetic', slug: 'arithmetic', phase: 'Foundation', track: 'TRACK B — COMPUTATIONAL THINKING', order: 2 },
  { name: 'Number Properties', slug: 'number-properties', phase: 'Foundation', track: 'TRACK B — COMPUTATIONAL THINKING', order: 3 },
  { name: 'Strings Basics', slug: 'strings-basics', phase: 'Foundation', track: 'TRACK B — COMPUTATIONAL THINKING', order: 4 },
  { name: 'Arrays Core', slug: 'arrays-core', phase: 'Core', track: 'TRACK B — COMPUTATIONAL THINKING', order: 5 },
  { name: 'Searching', slug: 'searching', phase: 'Core', track: 'TRACK B — COMPUTATIONAL THINKING', order: 6 },
  { name: 'Sorting', slug: 'sorting', phase: 'Core', track: 'TRACK B — COMPUTATIONAL THINKING', order: 7 },
  { name: 'Frequency Counting', slug: 'frequency-counting', phase: 'Core', track: 'TRACK B — COMPUTATIONAL THINKING', order: 8 },
  { name: 'Basic Two Pointers', slug: 'basic-two-pointers', phase: 'Core', track: 'TRACK B — COMPUTATIONAL THINKING', order: 9 },
  { name: 'Advanced Strings', slug: 'advanced-strings', phase: 'Advanced', track: 'TRACK B — COMPUTATIONAL THINKING', order: 10 },
  { name: 'Sliding Window', slug: 'sliding-window-ct', phase: 'Advanced', track: 'TRACK B — COMPUTATIONAL THINKING', order: 11 },
  { name: 'Hashing', slug: 'hashing-ct', phase: 'Advanced', track: 'TRACK B — COMPUTATIONAL THINKING', order: 12 },
  { name: 'Prefix Sum', slug: 'prefix-sum-ct', phase: 'Advanced', track: 'TRACK B — COMPUTATIONAL THINKING', order: 13 },
  { name: 'Advanced Arrays', slug: 'advanced-arrays', phase: 'Advanced', track: 'TRACK B — COMPUTATIONAL THINKING', order: 14 },
  { name: 'Matrix Problems', slug: 'matrix-problems', phase: 'Advanced', track: 'TRACK B — COMPUTATIONAL THINKING', order: 15 },
  { name: 'Subarray Problems', slug: 'subarray-problems', phase: 'Advanced', track: 'TRACK B — COMPUTATIONAL THINKING', order: 16 },

  // TRACK C (Existing DSA)
  { name: 'Mathematics', slug: 'mathematics', phase: 'Foundation', track: 'TRACK C — DSA', order: 0 },
  { name: 'Arrays', slug: 'arrays', phase: 'Foundation', track: 'TRACK C — DSA', order: 1 },
  { name: 'Strings', slug: 'strings', phase: 'Foundation', track: 'TRACK C — DSA', order: 2 },
  { name: 'Hashing', slug: 'hashing', phase: 'Foundation', track: 'TRACK C — DSA', order: 3 },
  { name: 'Two Pointers', slug: 'two-pointers', phase: 'Foundation', track: 'TRACK C — DSA', order: 4 },
  { name: 'Sliding Window', slug: 'sliding-window', phase: 'Foundation', track: 'TRACK C — DSA', order: 5 },
  { name: 'Prefix Sum', slug: 'prefix-sum', phase: 'Foundation', track: 'TRACK C — DSA', order: 6 },
  { name: 'Binary Search', slug: 'binary-search', phase: 'Foundation', track: 'TRACK C — DSA', order: 7 },
  { name: 'Stack', slug: 'stack', phase: 'Foundation', track: 'TRACK C — DSA', order: 8 },
  { name: 'Queue', slug: 'queue', phase: 'Foundation', track: 'TRACK C — DSA', order: 9 },
  { name: 'Linked List', slug: 'linked-list', phase: 'Foundation', track: 'TRACK C — DSA', order: 10 },
  { name: 'Recursion & Backtracking', slug: 'recursion-backtracking', phase: 'Problem Solving', track: 'TRACK C — DSA', order: 11 },
  { name: 'Greedy', slug: 'greedy', phase: 'Problem Solving', track: 'TRACK C — DSA', order: 12 },
  { name: 'Bit Manipulation', slug: 'bit-manipulation', phase: 'Problem Solving', track: 'TRACK C — DSA', order: 13 },
  { name: 'Binary Trees', slug: 'binary-trees', phase: 'Trees', track: 'TRACK C — DSA', order: 14 },
  { name: 'Binary Search Trees', slug: 'bst', phase: 'Trees', track: 'TRACK C — DSA', order: 15 },
  { name: 'Heaps / Priority Queues', slug: 'heaps', phase: 'Trees', track: 'TRACK C — DSA', order: 16 },
  { name: 'Graph BFS/DFS', slug: 'graph-traversal', phase: 'Graphs', track: 'TRACK C — DSA', order: 17 },
  { name: 'Shortest Paths & MST', slug: 'shortest-paths', phase: 'Graphs', track: 'TRACK C — DSA', order: 18 },
  { name: '1D DP', slug: '1d-dp', phase: 'Dynamic Programming', track: 'TRACK C — DSA', order: 19 },
  { name: '2D/Grid DP', slug: '2d-dp', phase: 'Dynamic Programming', track: 'TRACK C — DSA', order: 20 },
  { name: 'Knapsack & Subsequences', slug: 'knapsack', phase: 'Dynamic Programming', track: 'TRACK C — DSA', order: 21 },
  { name: 'Tries', slug: 'tries', phase: 'Advanced', track: 'TRACK C — DSA', order: 22 },
  { name: 'Segment Trees', slug: 'segment-trees', phase: 'Advanced', track: 'TRACK C — DSA', order: 23 },

  // TRACK D
  { name: 'OOP', slug: 'oop', phase: 'Core', track: 'TRACK D — CS FUNDAMENTALS', order: 0 },
  { name: 'DBMS', slug: 'dbms', phase: 'Core', track: 'TRACK D — CS FUNDAMENTALS', order: 1 },
  { name: 'Operating Systems', slug: 'os', phase: 'Core', track: 'TRACK D — CS FUNDAMENTALS', order: 2 },
  { name: 'Computer Networks', slug: 'cn', phase: 'Core', track: 'TRACK D — CS FUNDAMENTALS', order: 3 },
  { name: 'Computer Architecture', slug: 'ca', phase: 'Core', track: 'TRACK D — CS FUNDAMENTALS', order: 4 },
  { name: 'Data Representation', slug: 'data-rep', phase: 'Core', track: 'TRACK D — CS FUNDAMENTALS', order: 5 },
  { name: 'Software Engineering', slug: 'se', phase: 'Core', track: 'TRACK D — CS FUNDAMENTALS', order: 6 },
  { name: 'SQL', slug: 'sql', phase: 'Core', track: 'TRACK D — CS FUNDAMENTALS', order: 7 },

  // TRACK E
  { name: 'HTML & CSS', slug: 'html-css', phase: 'Basics', track: 'TRACK E — WEB DEVELOPMENT', order: 0 },
  { name: 'JavaScript DOM & Async', slug: 'js-dom-async', phase: 'Basics', track: 'TRACK E — WEB DEVELOPMENT', order: 1 },
  { name: 'React', slug: 'react', phase: 'Framework', track: 'TRACK E — WEB DEVELOPMENT', order: 2 },
  { name: 'State Management', slug: 'state-management', phase: 'Framework', track: 'TRACK E — WEB DEVELOPMENT', order: 3 },
  
  // TRACK F
  { name: 'Node.js & Express', slug: 'nodejs-express', phase: 'Server', track: 'TRACK F — BACKEND', order: 0 },
  { name: 'REST APIs & Auth', slug: 'rest-auth', phase: 'Server', track: 'TRACK F — BACKEND', order: 1 },
  { name: 'PostgreSQL & ORMs', slug: 'postgres-orm', phase: 'Database', track: 'TRACK F — BACKEND', order: 2 },
  
  // TRACK G
  { name: 'Docker & CI/CD', slug: 'docker-cicd', phase: 'DevOps', track: 'TRACK G — CLOUD & DEVOPS', order: 0 },
  { name: 'AWS/Azure Basics', slug: 'cloud-basics', phase: 'Cloud', track: 'TRACK G — CLOUD & DEVOPS', order: 1 },

  // TRACK H
  { name: 'GenAI & LLMs', slug: 'genai-llms', phase: 'AI', track: 'TRACK H — AI / GENAI', order: 0 },
  { name: 'RAG & Vector DBs', slug: 'rag-vector', phase: 'AI', track: 'TRACK H — AI / GENAI', order: 1 },
  { name: 'AI Agents', slug: 'ai-agents', phase: 'AI', track: 'TRACK H — AI / GENAI', order: 2 },

  // TRACK I
  { name: 'Quantitative', slug: 'quant', phase: 'Aptitude', track: 'TRACK I — APTITUDE', order: 0 },
  { name: 'Logical Reasoning', slug: 'logical', phase: 'Aptitude', track: 'TRACK I — APTITUDE', order: 1 },
  { name: 'Verbal', slug: 'verbal', phase: 'Aptitude', track: 'TRACK I — APTITUDE', order: 2 },

  // TRACK J
  { name: 'Resume & Portfolio', slug: 'resume-portfolio', phase: 'Preparation', track: 'TRACK J — CAREER', order: 0 },
  { name: 'Interviews & HR', slug: 'interviews-hr', phase: 'Preparation', track: 'TRACK J — CAREER', order: 1 }
];

const leetcodeBank = require('./leetcodeDatabase');

const templateProblems = leetcodeBank;

function isPreloadedTitle(name) {
  if (!name) return false;
  return preloadedSolvedTitles.some(title =>
    name.toLowerCase().trim() === title.toLowerCase().trim()
  );
}

// Function to populate problems for a user email with initial Not Started status
async function initializeUserProblemsAndStats(email) {
  // 1. Delete current user problems and activity logs for this user
  try {
    await Problem.deleteMany({ userEmail: email });
    await ActivityLog.deleteMany({ userEmail: email });
  } catch (e) {}

  // 2. Create problems for this user, starting as Not Started
  for (const prob of templateProblems) {
    const xp = prob.xp || (prob.difficulty === 'Hard' ? 100 : prob.difficulty === 'Medium' ? 50 : 20);

    await Problem.create({
      name: prob.name,
      difficulty: prob.difficulty,
      pattern: prob.pattern || '',
      platform: prob.platform || 'LeetCode',
      status: 'Not Started',
      notes: '',
      userCode: {},
      answer: '',
      revisionSchedule: 'None',
      lastSolved: '',
      timesRevised: 0,
      companyTags: prob.companyTags || [],
      solutionLink: prob.solutionLink || '',
      topicSlug: prob.topicSlug,
      userEmail: email,
      isFavorite: false,
      xp
    });
  }

  // 3. Update user profile to clean initial state
  const user = await User.findOne({ email });
  if (user) {
    await User.updateOne(
      { email },
      {
        $set: {
          xp: 0,
          level: 1,
          badges: [],
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: '',
          dailyGoals: {
            solveCount: 0,
            solveTarget: 2,
            reviseCount: 0,
            reviseTarget: 3,
            challengeCompleted: false
          }
        }
      }
    );
  }

  return { totalProblems: templateProblems.length };
}

async function runSeed() {
  console.log('[SEED] Starting database seeding...');
  
  // Clear existing topics & default template problems
  try {
    await Topic.deleteMany({});
    console.log('[SEED] Cleared existing topics.');
  } catch(e) {}

  try {
    await Problem.deleteMany({ userEmail: 'template' });
    console.log('[SEED] Cleared template problems.');
  } catch(e) {}

  // Seed tracks
  try {
    await RoadmapTrack.deleteMany({});
    console.log('[SEED] Cleared existing tracks.');
  } catch(e) {}

  for (const track of roadmapTracks) {
    await RoadmapTrack.create(track);
  }
  console.log(`[SEED] Seeded ${roadmapTracks.length} tracks successfully.`);

  // Seed topics
  for (const topic of topics) {
    await Topic.create(topic);
  }
  console.log(`[SEED] Seeded ${topics.length} topics successfully.`);

  // Seed problems under template userEmail
  for (const problem of templateProblems) {
    await Problem.create({
      ...problem,
      userEmail: 'template',
      status: 'Not Started',
      notes: '',
      revisionSchedule: 'None',
      lastSolved: '',
      timesRevised: 0,
      isFavorite: false
    });
  }
  console.log(`[SEED] Seeded ${templateProblems.length} default template problems successfully.`);

  // Seed/Update all existing users
  const users = await User.find({});
  for (const u of users) {
    await initializeUserProblemsAndStats(u.email);
    console.log(`[SEED] Initialized clean problem list for user: ${u.email}`);
  }

  // Pre-create demo candidate account if not exists
  const candidateEmail = 'candidate@roadtooffer.com';
  let candidateUser = await User.findOne({ email: candidateEmail });
  
  if (!candidateUser) {
    console.log('[SEED] Pre-creating candidate demo user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('candidate123', salt);
    
    await User.create({
      name: 'Candidate Demo',
      email: candidateEmail,
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

    await initializeUserProblemsAndStats(candidateEmail);
  }

  console.log('[SEED] Seeding process complete.');
}

if (require.main === module) {
  runSeed().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { runSeed, templateProblems, initializeUserProblemsAndStats };
