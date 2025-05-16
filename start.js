const { spawn } = require('child_process');
const path = require('path');

console.log('Starting the Oncology Insights application...');

// Run the npm start command
const npmStart = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    CHOKIDAR_USEPOLLING: 'true',
    WATCHPACK_POLLING: 'true',
    WDS_SOCKET_PORT: '3000'
  }
});

npmStart.on('error', (error) => {
  console.error('Failed to start npm process:', error);
});

process.on('SIGINT', () => {
  npmStart.kill('SIGINT');
  process.exit(0);
}); 