const { execSync } = require('child_process');
const chalk = require('chalk') || { green: text => text, red: text => text, yellow: text => text, blue: text => text };

console.log(chalk.blue('🔍 Starting Docker build test...'));

try {
  // First, verify data files
  console.log(chalk.blue('🔍 Verifying data files...'));
  try {
    execSync('node scripts/verify-data-files.js', { stdio: 'inherit' });
  } catch (error) {
    console.error(chalk.red('❌ Data file verification failed. Fix data issues before continuing.'));
    process.exit(1);
  }

  // Build the Docker image with verbose output
  console.log(chalk.blue('🔨 Building Docker image...'));
  execSync('docker build -t oncology-insights:test . --progress=plain', { stdio: 'inherit' });
  
  // If we got here, the build was successful
  console.log(chalk.green('✅ Docker build successful!'));
  
  // Run the container to test it
  console.log(chalk.blue('🚀 Running container for testing...'));
  console.log(chalk.yellow('⚠️ Press Ctrl+C to stop the container when done testing.'));
  
  execSync('docker run -p 8080:8080 --name oncology-insights-test oncology-insights:test', { stdio: 'inherit' });
  
} catch (error) {
  console.error(chalk.red(`❌ Error: ${error.message}`));
  
  // Try to clean up the container if it exists
  try {
    execSync('docker rm -f oncology-insights-test', { stdio: 'ignore' });
  } catch (cleanupError) {
    // Ignore cleanup errors
  }
  
  process.exit(1);
} finally {
  // Try to clean up the container if it exists
  try {
    execSync('docker rm -f oncology-insights-test', { stdio: 'ignore' });
  } catch (cleanupError) {
    // Ignore cleanup errors
  }
} 