const { Assessment } = require('../config/db');

async function seed() {
  try {
    await Assessment.deleteMany({});
    console.log('Cleared existing assessments.');

    const assessments = [
      {
        title: 'CT Foundation Test - Phase 1',
        type: 'CT',
        durationMinutes: 45,
        questions: [
          {
            questionText: 'What is the time complexity of searching in a balanced BST?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
            correctAnswer: 'O(log N)'
          },
          {
            questionText: 'Which data structure uses LIFO principle?',
            options: ['Queue', 'Stack', 'Array', 'Linked List'],
            correctAnswer: 'Stack'
          }
        ]
      },
      {
        title: 'Core CS Fundamentals Quiz',
        type: 'CS Fundamentals',
        durationMinutes: 30,
        questions: [
          {
            questionText: 'What does ACID stand for in databases?',
            options: ['Atomicity, Consistency, Isolation, Durability', 'Active, Consistent, Isolated, Durable', 'Automatic, Continuous, Integral, Dynamic', 'None of the above'],
            correctAnswer: 'Atomicity, Consistency, Isolation, Durability'
          },
          {
            questionText: 'Which layer is NOT in the OSI model?',
            options: ['Application', 'Transport', 'Internet', 'Network'],
            correctAnswer: 'Internet'
          }
        ]
      },
      {
        title: 'Aptitude & Logical Reasoning - Mock 1',
        type: 'Aptitude',
        durationMinutes: 60,
        questions: [
          {
            questionText: 'If A is brother of B, and B is sister of C. How is A related to C?',
            options: ['Brother', 'Sister', 'Uncle', 'Cousin'],
            correctAnswer: 'Brother'
          },
          {
            questionText: '2, 6, 12, 20, ?',
            options: ['28', '30', '32', '36'],
            correctAnswer: '30'
          }
        ]
      }
    ];

    for (const a of assessments) {
      await Assessment.create(a);
    }
    console.log('Seeded 3 assessments.');
  } catch (err) {
    console.error(err);
  }
}

seed();
