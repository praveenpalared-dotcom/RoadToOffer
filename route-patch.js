const fs = require('fs');
const path = require('path');

function injectNavigate(filePath, navTarget) {
  const p = path.join(__dirname, 'frontend/src/pages', filePath);
  if (!fs.existsSync(p)) return;
  
  let content = fs.readFileSync(p, 'utf8');
  
  // Add import if missing
  if (!content.includes('useNavigate')) {
    content = content.replace("import React", "import { useNavigate } from 'react-router-dom';\nimport React");
  }

  // Add hook if missing
  if (!content.includes('const navigate = useNavigate();')) {
    // Find the first line after `const ComponentName = () => {`
    const match = content.match(/const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{/);
    if (match) {
      content = content.replace(match[0], match[0] + "\n  const navigate = useNavigate();");
    }
  }

  // Replace button clicks (heuristic)
  if (filePath === 'CSFundamentals.jsx') {
    content = content.replace(/<button /g, `<button onClick={() => navigate('${navTarget}')} `);
  }
  if (filePath === 'CompanyPrep.jsx') {
    content = content.replace(/<button /g, `<button onClick={() => navigate('${navTarget}')} `);
  }
  if (filePath === 'AdvancedProjects.jsx') {
    content = content.replace(/<button /g, `<button onClick={() => navigate('${navTarget}')} `);
  }
  if (filePath === 'Revision.jsx') {
    content = content.replace(/<button className="px-5/g, `<button onClick={() => navigate('${navTarget}')} className="px-5`);
  }
  if (filePath === 'Aptitude.jsx') {
    content = content.replace(/<button className="mt-6 w-full/g, `<button onClick={() => navigate('${navTarget}')} className="mt-6 w-full`);
  }
  if (filePath === 'Contests.jsx') {
    content = content.replace(/<button className="mt-6 w-full py-2.5/g, `<button onClick={() => navigate('${navTarget}')} className="mt-6 w-full py-2.5`);
  }
  
  fs.writeFileSync(p, content);
}

injectNavigate('CSFundamentals.jsx', '/problem/two-sum'); // Route to problem view as mock
injectNavigate('CompanyPrep.jsx', '/roadmap'); // Route to roadmap as mock
injectNavigate('AdvancedProjects.jsx', '/projects'); // Route to projects
injectNavigate('Revision.jsx', '/problem/two-sum'); // Route to problem view
injectNavigate('Aptitude.jsx', '/problem/two-sum'); // Route to problem view
injectNavigate('Contests.jsx', '/roadmap'); // Route to roadmap

console.log("Successfully wired up all internal hub buttons!");
