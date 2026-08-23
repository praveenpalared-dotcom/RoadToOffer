const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');

// POST /api/interview/chat - Mock AI Interview Chat
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    let aiResponse = "That's an interesting approach. Could you elaborate more on the trade-offs you considered?";

    // Mock AI Logic based on keywords
    if (lastMessage.includes('hash map') || lastMessage.includes('dictionary') || lastMessage.includes('object')) {
      aiResponse = "Using a hash map is a great choice for fast lookups. What would the time and space complexity be in the worst-case scenario?";
    } else if (lastMessage.includes('redis') || lastMessage.includes('cache')) {
      aiResponse = "Redis is excellent for this. How would you handle cache eviction or data consistency if the primary database gets updated?";
    } else if (lastMessage.includes('o(n)') || lastMessage.includes('o(1)')) {
      aiResponse = "Correct on the complexity. Now, imagine if the dataset is too large to fit in memory. How would you modify your algorithm?";
    } else if (lastMessage.includes('binary search')) {
      aiResponse = "Binary search works well here. What conditions must be true about the data for binary search to be applicable?";
    } else if (lastMessage.includes('token bucket') || lastMessage.includes('rate limit')) {
      aiResponse = "Token bucket is a classic algorithm. How does it compare to the leaky bucket algorithm in terms of handling bursty traffic?";
    }

    // Simulate network delay for realism
    setTimeout(() => {
      res.json({ reply: aiResponse });
    }, 1500);

  } catch (error) {
    res.status(500).json({ message: 'Failed to process chat', error: error.message });
  }
});

module.exports = router;
