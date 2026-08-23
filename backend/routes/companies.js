const express = require('express');
const router = express.Router();
const { Company } = require('../config/db');
const { authenticateToken } = require('./auth');

// GET /api/companies - Get all companies
router.get('/', authenticateToken, async (req, res) => {
  try {
    const companies = await Company.find({});
    
    // If no companies exist, return some static curated FAANG data
    if (companies.length === 0) {
      const defaultCompanies = [
        {
          name: 'Amazon',
          roles: 'SDE-1',
          salary: '₹15-28 LPA',
          rounds: 4,
          color: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
          tier: 'Product',
          expectations: { dsa: 70, cs: 60, projects: 65, ct: 60 },
          description: 'Focus heavily on Leadership Principles, Arrays, Trees, and Object-Oriented Design.',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
        },
        {
          name: 'Microsoft',
          roles: 'SDE',
          salary: '₹18-35 LPA',
          rounds: 4,
          color: 'text-green-400 border-green-400/30 bg-green-400/10',
          tier: 'Product',
          expectations: { dsa: 65, cs: 70, projects: 70, ct: 65 },
          description: 'Focus on System Design, C# / Java familiarity, and Linked Lists / Trees.',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
        },
        {
          name: 'Google',
          roles: 'SWE, SRE',
          salary: '₹20-40 LPA',
          rounds: 5,
          color: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
          tier: 'Product',
          expectations: { dsa: 85, cs: 80, projects: 50, ct: 90 },
          description: 'Intense DSA focus (Graphs, DP, Hard problems) and Computational Thinking.',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
        },
        {
          name: 'Atlassian',
          roles: 'SWE',
          salary: '₹35-65 LPA',
          rounds: 5,
          color: 'text-indigo-400 border-indigo-400/30 bg-indigo-400/10',
          tier: 'Product',
          expectations: { dsa: 80, cs: 75, projects: 75, ct: 85 },
          description: 'Focus on System Design, Backend scalability, and practical coding assignments.',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Atlassian_logo.svg'
        }
      ];
      
      for (const c of defaultCompanies) {
        await Company.create(c);
      }
      
      return res.json({ companies: defaultCompanies });
    }

    res.json({ companies });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch companies', error: error.message });
  }
});

module.exports = router;
