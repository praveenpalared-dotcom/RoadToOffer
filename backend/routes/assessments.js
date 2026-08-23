const express = require('express');
const router = express.Router();
const { User, Assessment, AssessmentAttempt } = require('../config/db');
const { authenticateToken } = require('./auth');

// GET ALL AVAILABLE ASSESSMENTS
router.get('/', authenticateToken, async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json({ assessments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assessments', error: error.message });
  }
});

// GET A SINGLE ASSESSMENT
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.id });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json({ assessment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assessment', error: error.message });
  }
});

// GET USER'S ASSESSMENT ATTEMPTS
router.get('/attempts/history', authenticateToken, async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find({ userEmail: req.user.email });
    res.json({ attempts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attempts', error: error.message });
  }
});

// SUBMIT AN ASSESSMENT ATTEMPT
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const assessmentId = req.params.id;
    const { answers } = req.body; // e.g. { "0": "A", "1": "C" }
    
    const assessment = await Assessment.findOne({ _id: assessmentId });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    let correctCount = 0;
    const totalQuestions = assessment.questions.length;
    
    assessment.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const attempt = await AssessmentAttempt.create({
      userEmail: req.user.email,
      assessmentId,
      score,
      status: 'Completed',
      createdAt: new Date().toISOString()
    });

    res.json({ 
      message: 'Assessment submitted successfully',
      score,
      correctCount,
      totalQuestions,
      attempt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit assessment', error: error.message });
  }
});

module.exports = router;
