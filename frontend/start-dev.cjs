const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

function checkBackend() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/api/health', (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function start() {
  const isBackendRunning = await checkBackend();
  let backendProcess = null;

  if (!isBackendRunning) {
    console.log('\x1b[36m[RoadToOffer]\x1b[0m Backend server not detected on port 5000. Auto-starting backend...');
    const backendPath = path.resolve(__dirname, '..', 'backend', 'server.js');
    backendProcess = spawn('node', [backendPath], {
      stdio: 'inherit',
      shell: true
    });
  } else {
    console.log('\x1b[32m[RoadToOffer]\x1b[0m Backend server is active on http://localhost:5000');
  }

  const viteCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const viteProcess = spawn(viteCmd, ['vite'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  const cleanup = () => {
    if (backendProcess) backendProcess.kill();
    if (viteProcess) viteProcess.kill();
    process.exit();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

start();
