/**
 * Script to prepare files for deployment
 * - Ensures all data files are copied to the build directory
 * - Creates redirects file for SPA routing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('========= DEPLOYMENT PREPARATION =========');

// Ensure the build directory exists
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
  console.error('❌ ERROR: Build directory not found. Run npm build first.');
  process.exit(1);
}

// Create _redirects file for Netlify/Vercel
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
const sourceDataDir = path.join(__dirname, '../public/data');
const destDataDir = path.join(buildDir, 'data');

// Create data directory in build if it doesn't exist
if (!fs.existsSync(destDataDir)) {
  fs.mkdirSync(destDataDir, { recursive: true });
}

// Copy data from public/data to build/data
if (fs.existsSync(sourceDataDir)) {
  try {
    execSync(`cp -R ${sourceDataDir}/* ${destDataDir}/`, { stdio: 'inherit' });
    console.log('✅ Copied data files from public/data to build/data');
  } catch (error) {
    console.warn('⚠️ Could not copy data files:', error.message);
    
    // Fallback to manual copy
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
    
    try {
      copyDir(sourceDataDir, destDataDir);
      console.log('✅ Copied data files using fallback method');
    } catch (fallbackError) {
      console.error('❌ Failed to copy data files:', fallbackError.message);
    }
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

console.log('✅ Deployment preparation completed successfully.'); 