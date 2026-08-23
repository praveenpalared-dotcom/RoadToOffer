const fs = require('fs');
const path = require('path');

const frontendFiles = ['CSFundamentals.jsx', 'Revision.jsx', 'Aptitude.jsx', 'ResumeAnalyzer.jsx', 'Contests.jsx', 'InterviewSimulator.jsx'];
const backendFiles = ['cs-fundamentals.js', 'revision.js', 'aptitude.js', 'resume.js', 'contests.js', 'interview.js'];

// Patch frontend
frontendFiles.forEach(file => {
  const p = path.join(__dirname, 'frontend/src/pages', file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/if\s*\(\!token\)\s*return;/g, '');
    fs.writeFileSync(p, content);
  }
});

// Patch backend
backendFiles.forEach(file => {
  const p = path.join(__dirname, 'backend/routes', file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/,\s*authenticateToken\s*,/g, ',');
    content = content.replace(/authenticateToken\s*,/g, '');
    fs.writeFileSync(p, content);
  }
});

console.log("Patched all files to remove token dependency for mock routes.");
