/**
 * Windows-compatible deployment script
 * This script handles deployment preparation for Windows environments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('========= WINDOWS DEPLOYMENT PREPARATION =========');

// Ensure the build directory exists
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
  console.error('❌ ERROR: Build directory not found. Run npm build first.');
  process.exit(1);
}

// Create _redirects file for SPA routing
const redirectsContent = '/* /index.html 200';
fs.writeFileSync(path.join(buildDir, '_redirects'), redirectsContent);
console.log('✅ Created _redirects file for SPA routing');

// Create static.json for Heroku
const staticJson = {
  "root": "build/",
  "routes": {
    "/**": "index.html"
  },
  "https_only": true,
  "headers": {
    "/**": {
      "Cache-Control": "public, max-age=0, must-revalidate"
    },
    "/static/**": {
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  }
};
fs.writeFileSync(
  path.join(buildDir, 'static.json'),
  JSON.stringify(staticJson, null, 2)
);
console.log('✅ Created static.json for Heroku');

// Ensure data files are copied to the build directory
const sourceDataDir = path.join(__dirname, '../src/data');
const destDataDir = path.join(buildDir, 'data');

// Create data directory in build if it doesn't exist
if (!fs.existsSync(destDataDir)) {
  fs.mkdirSync(destDataDir, { recursive: true });
}

// Copy any data from src/data to build/data (if src/data exists)
if (fs.existsSync(sourceDataDir)) {
  try {
    // Use cross-platform copy function instead of cp command
    console.log('Copying data files using Node.js...');
    
    // Recursive copy function
    const copyDir = (src, dest) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };
    
    copyDir(sourceDataDir, destDataDir);
    console.log('✅ Copied data files from src/data to build/data');
  } catch (error) {
    console.error('❌ Failed to copy data files:', error.message);
  }
}

// Also copy public/data to build/data if it exists
const publicDataDir = path.join(__dirname, '../public/data');
if (fs.existsSync(publicDataDir)) {
  try {
    console.log('Copying public data files...');
    
    const copyDir = (src, dest) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };
    
    copyDir(publicDataDir, destDataDir);
    console.log('✅ Copied data files from public/data to build/data');
  } catch (error) {
    console.error('❌ Failed to copy public data files:', error.message);
  }
}

// Create Procfile for Heroku
const procfileContent = 'web: npx serve -s build';
fs.writeFileSync(path.join(buildDir, 'Procfile'), procfileContent);
console.log('✅ Created Procfile for Heroku');

// Create .buildpacks file for Heroku
const buildpacksContent = 'https://github.com/heroku/heroku-buildpack-nodejs.git';
fs.writeFileSync(path.join(buildDir, '.buildpacks'), buildpacksContent);
console.log('✅ Created .buildpacks file for Heroku');

// Create .node-version file for Railway/Vercel
const nodeVersion = process.version.slice(1); // Remove the 'v' prefix
fs.writeFileSync(path.join(buildDir, '.node-version'), nodeVersion);
console.log(`✅ Created .node-version file (${nodeVersion})`);

console.log('✅ Windows deployment preparation completed successfully.'); 