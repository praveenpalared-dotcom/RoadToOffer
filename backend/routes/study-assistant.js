const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const { User, Problem } = require('../config/db');

// Intelligent AI Chat Knowledge Engine
function generateAIResponse(message, userContext = {}) {
  const query = message.toLowerCase();
  const name = userContext.name || 'Student';

  if (query.includes('schedule') || query.includes('plan') || query.includes('timetable')) {
    return {
      reply: `Hey ${name}! I've analyzed your prep trajectory. Here is a high-impact 7-day study strategy focused on high-yield placement topics:\n\n` +
        `• Day 1-2: Master Two Pointers & Sliding Window (Solve 4 Medium LeetCode problems)\n` +
        `• Day 3: Binary Search on Answer Space & Binary Trees Traversal\n` +
        `• Day 4-5: Dynamic Programming (1D & Knapsack fundamentals)\n` +
        `• Day 6: System Design Basics & SQL Joins / Indexing\n` +
        `• Day 7: Full Speed Mock Test & Weak Area Revision`,
      actionType: 'schedule'
    };
  }

  if (query.includes('hint') || query.includes('socratic') || query.includes('help me solve')) {
    return {
      reply: `Let's break this down step-by-step! 🧠\n\n` +
        `**Step 1:** What state or invariant stays constant throughout the loop?\n` +
        `**Step 2:** Can you reduce the runtime by storing previously computed sub-problems in a Hash Map or Array?\n` +
        `**Step 3:** Think about edge cases: What happens when the input array is empty or contains negative numbers?`,
      actionType: 'socratic'
    };
  }

  if (query.includes('dijkstra') || query.includes('graph')) {
    return {
      reply: `**Dijkstra's Algorithm Summary:**\n` +
        `• **Purpose:** Finds the shortest path from a single source node to all other nodes in a weighted graph with non-negative edge weights.\n` +
        `• **Data Structure:** Min-Heap / Priority Queue + Distance Array.\n` +
        `• **Time Complexity:** O((V + E) log V) with binary heap.\n` +
        `• **Pro Tip:** If edge weights are negative, use Bellman-Ford algorithm instead!`,
      actionType: 'explanation'
    };
  }

  if (query.includes('interview') || query.includes('behavioral') || query.includes('star')) {
    return {
      reply: `For behavioral interviews, use the **STAR Method**:\n` +
        `1. **Situation:** Set the context of the project or conflict.\n` +
        `2. **Task:** Explain what your exact responsibility was.\n` +
        `3. **Action:** Detail the specific technical steps YOU took.\n` +
        `4. **Result:** Quantify the outcome (e.g. "Improved API latency by 40%").`,
      actionType: 'interview'
    };
  }

  // Default intelligent companion fallback response
  return {
    reply: `Great question, ${name}! As your AI Study Assistant, I recommend focusing on building strong intuition over memorization.\n\n` +
      `When approaching **${message.slice(0, 30)}...**, always ask yourself:\n` +
      `1. What is the brute-force approach and its time complexity?\n` +
      `2. What redundant computations can we eliminate using data structures like HashMaps, Stacks, or Heaps?\n` +
      `3. How would you explain your code aloud to a Senior Staff Engineer?`,
    actionType: 'general'
  };
}

// POST /api/study-assistant/chat
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const response = generateAIResponse(message, req.user);
    res.json(response);
  } catch (error) {
    console.error('Study assistant error:', error);
    res.status(500).json({ error: 'Failed to process AI chat request' });
  }
});

// POST /api/study-assistant/schedule
router.post('/schedule', authenticateToken, async (req, res) => {
  try {
    const { dailyHours, targetCompany, focusTopics } = req.body;
    const hours = dailyHours || 3;
    const company = targetCompany || 'Top Tech Product Companies';

    const schedule = [
      {
        day: 'Monday',
        topic: 'Arrays & Two Pointers',
        duration: `${hours} hours`,
        tasks: ['Solve 3 LeetCode Mediums', 'Revise Array rotation patterns', 'Complete 1 Speed Quiz']
      },
      {
        day: 'Tuesday',
        topic: 'Sliding Window & Hash Maps',
        duration: `${hours} hours`,
        tasks: ['Longest Substring Without Repeating Chars', 'Subarray Sum Equals K', 'Review Space Complexities']
      },
      {
        day: 'Wednesday',
        topic: 'Trees & BFS/DFS Traversal',
        duration: `${hours} hours`,
        tasks: ['Binary Tree Level Order Traversal', 'Validate BST', 'Draw recursion call stacks']
      },
      {
        day: 'Thursday',
        topic: 'Dynamic Programming & Memoization',
        duration: `${hours} hours`,
        tasks: ['House Robber I & II', 'Coin Change problem', 'Identify overlapping subproblems']
      },
      {
        day: 'Friday',
        topic: 'CS Core: Operating Systems & DBMS',
        duration: `${hours} hours`,
        tasks: ['Process vs Threads & Deadlocks', 'SQL Indexing & Normalization', 'Revise 10 Core Flashcards']
      },
      {
        day: 'Saturday',
        topic: `${company} Target Interview Simulation`,
        duration: `${hours + 1} hours`,
        tasks: ['Complete 45-min Timed Mock Code Test', 'Friendly 1v1 Leaderboard Challenge', 'AI Socratic Review']
      },
      {
        day: 'Sunday',
        topic: 'Revision & Backlog Clear',
        duration: '2 hours',
        tasks: ['Re-solve flagged problems', 'Update Resume Achievements', 'Set weekly goals for next sprint']
      }
    ];

    res.json({ company, dailyHours: hours, schedule });
  } catch (error) {
    console.error('Schedule generation error:', error);
    res.status(500).json({ error: 'Failed to generate study schedule' });
  }
});

// POST /api/study-assistant/socratic
router.post('/socratic', authenticateToken, (req, res) => {
  const { problemTitle } = req.body;
  const title = problemTitle || 'Two Sum / Array Problem';

  const socraticHints = [
    {
      level: 1,
      title: 'Conceptual Hint 💡',
      hint: `If you are looking for target - X, do you need to scan the entire array every time? What data structure offers O(1) lookups?`
    },
    {
      level: 2,
      title: 'Structural Strategy 🛠️',
      hint: `Use a Hash Map where the key is the array value and the value is its index. As you iterate, check if (target - currentNum) exists in the map.`
    },
    {
      level: 3,
      title: 'Edge Case Guard 🛡️',
      hint: `Ensure you don't use the same element twice (e.g. when target is 6 and the array contains a single 3).`
    }
  ];

  res.json({ problemTitle: title, hints: socraticHints });
});

// POST /api/study-assistant/quiz
router.post('/quiz', authenticateToken, (req, res) => {
  const { topic } = req.body;
  
  const quizzes = [
    {
      id: 1,
      question: 'What is the average time complexity of searching in a Hash Map?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      answerIndex: 0,
      explanation: 'Hash Maps provide average O(1) constant time complexity for insert, search, and delete operations via hashing.'
    },
    {
      id: 2,
      question: 'Which algorithm is best suited to find the shortest path in an unweighted graph?',
      options: ['Depth First Search (DFS)', 'Breadth First Search (BFS)', 'Dijkstra\'s Algorithm', 'Floyd-Warshall'],
      answerIndex: 1,
      explanation: 'BFS explores level-by-level, guaranteeing the shortest path in unweighted graphs.'
    },
    {
      id: 3,
      question: 'What is the worst-case space complexity of a recursive depth-first search on a binary tree with N nodes?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(2^N)'],
      answerIndex: 2,
      explanation: 'In a skewed tree (like a linked list), the call stack height reaches N frames, resulting in O(N) space complexity.'
    }
  ];

  res.json({ topic: topic || 'DSA Core', quiz: quizzes });
});

// POST /api/study-assistant/flashcards
router.post('/flashcards', authenticateToken, (req, res) => {
  const flashcards = [
    { id: 1, category: 'Sorting', concept: 'QuickSelect Algorithm', summary: 'Finds the k-th smallest element in an unsorted array in average O(N) time without full sorting.' },
    { id: 2, category: 'Data Structures', concept: 'Monotonic Stack', summary: 'A stack whose elements are strictly increasing or decreasing. Ideal for Next Greater Element problems.' },
    { id: 3, category: 'Graphs', concept: 'Topological Sort', summary: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u->v, u comes before v.' },
    { id: 4, category: 'Dynamic Programming', concept: 'Kadane\'s Algorithm', summary: 'Finds the maximum subarray sum in O(N) time and O(1) space by tracking current max sum.' },
    { id: 5, category: 'System Design', concept: 'CAP Theorem', summary: 'In a distributed storage system, you can only guarantee 2 out of 3: Consistency, Availability, Partition Tolerance.' }
  ];

  res.json({ flashcards });
});

module.exports = router;
