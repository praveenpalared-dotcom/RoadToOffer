const fs = require('fs');
const path = require('path');

function replaceNavigate(filePath, oldPath, newPath) {
  const p = path.join(__dirname, 'frontend/src/pages', filePath);
  if (!fs.existsSync(p)) return;
  
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(new RegExp(`navigate\\('${oldPath.replace(/\//g, '\\/')}'\\)`, 'g'), `navigate('${newPath}')`);
  fs.writeFileSync(p, content);
}

replaceNavigate('CSFundamentals.jsx', '/problem/two-sum', '/feature/practice/cs-fundamentals');
replaceNavigate('CompanyPrep.jsx', '/roadmap', '/feature/company/interview-prep');
replaceNavigate('AdvancedProjects.jsx', '/projects', '/feature/project/architecture-guide');
replaceNavigate('Revision.jsx', '/problem/two-sum', '/feature/revision/flashcards');
replaceNavigate('Aptitude.jsx', '/problem/two-sum', '/feature/aptitude/quantitative');
replaceNavigate('Contests.jsx', '/roadmap', '/feature/contest/registration');

console.log("Successfully re-routed all internal buttons to FeatureMockView!");
