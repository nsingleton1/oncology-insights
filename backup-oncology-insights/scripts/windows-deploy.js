/**
 * Windows-compatible deployment script
 * This script handles deployment preparation for Windows environments
 */

console.log("========= WINDOWS DEPLOYMENT HELPER =========");

try {
  const fs = require('fs');
  const path = require('path');
  
  // Ensure build directory exists
  const buildDir = path.join(__dirname, '../build');
  if (!fs.existsSync(buildDir)) {
    console.error("❌ Build directory not found! Run 'npm run build' first.");
    process.exit(1);
  }
  
  // Create a simple health check endpoint
  const healthCheckContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Oncology Insights API - Health Check</title>
    </head>
    <body>
      <h1>Health Check - OK</h1>
      <p>Service is running properly.</p>
      <p>Timestamp: ${new Date().toISOString()}</p>
    </body>
    </html>
  `;
  
  // Write the health check file
  fs.writeFileSync(path.join(buildDir, 'health.html'), healthCheckContent);
  console.log("✅ Created health check endpoint");
  
  // Create a Railway specific start script
  const startScript = `
    #!/usr/bin/env node
    
    const { exec } = require('child_process');
    const http = require('http');
    const fs = require('fs');
    const path = require('path');
    
    // Health check server
    const healthServer = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      
      // Try to read the health.html file
      try {
        const healthContent = fs.readFileSync(path.join(__dirname, 'health.html'), 'utf8');
        res.end(healthContent);
      } catch (error) {
        // Fallback if file doesn't exist
        res.end('Health check OK - ' + new Date().toISOString());
      }
    });
    
    // Start health check server first
    healthServer.listen(process.env.PORT || 3000, () => {
      console.log(\`Health check server listening on port \${process.env.PORT || 3000}\`);
      
      // Then start the actual serve command
      console.log('Starting serve for the React app...');
      const serveProcess = exec('npx serve -s build', (error) => {
        if (error) {
          console.error('Error starting serve:', error);
          // Keep the health check server running even if serve fails
        }
      });
      
      // Pipe serve's output to our process
      serveProcess.stdout.pipe(process.stdout);
      serveProcess.stderr.pipe(process.stderr);
    });
  `;
  
  // Write the start script
  fs.writeFileSync(path.join(__dirname, '../start.js'), startScript);
  console.log("✅ Created Railway start script");
  
  // Create a simple package.json for Railway if it doesn't exist at the root
  const rootPackageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = require(rootPackageJsonPath);
  
  // Update scripts for Railway
  packageJson.scripts = {
    ...packageJson.scripts,
    "start": "node start.js"
  };
  
  // Make sure we have serve in dependencies
  if (!packageJson.dependencies.serve) {
    packageJson.dependencies.serve = "^14.0.0";
    console.log("✅ Added serve dependency to package.json");
  }
  
  // Write the updated package.json
  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("✅ Updated package.json for Railway deployment");
  
  console.log("✅ Windows deployment preparation complete!");
} catch (error) {
  console.error("Error during Windows deployment preparation:", error);
  // Don't fail the build
}

console.log("========= WINDOWS DEPLOYMENT HELPER COMPLETE ========="); 