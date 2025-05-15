/**
 * Post-deployment validation script
 * 
 * This script runs after deployment to verify critical files are accessible.
 * It validates that JSON data files are accessible at their expected paths.
 */

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const dataDir = path.join(buildDir, 'data/insights');

console.log('========= POST-DEPLOYMENT VALIDATION =========');

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('❌ Build directory not found!');
  process.exit(1);
}

// Check if data directory exists
if (!fs.existsSync(dataDir)) {
  console.error('❌ Data directory not found in build!');
  process.exit(1);
}

// Check for critical files
const criticalFiles = [
  'index.html',
  'data/insights/biomarker-compliance.json',
  'static.json',
  '_redirects',
  'favicon.ico',
  'logo192.png',
  'logo512.png',
  'manifest.json'
];

let allFilesExist = true;

criticalFiles.forEach(file => {
  const filePath = path.join(buildDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Critical file missing: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

// Count JSON files to ensure we have data
const jsonFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
console.log(`Found ${jsonFiles.length} JSON data files in the build directory.`);

if (jsonFiles.length === 0) {
  console.error('❌ No JSON data files found! The application will not function correctly.');
  allFilesExist = false;
}

// Final status
if (allFilesExist) {
  console.log('✅ All critical files verified. Deployment should be functional.');
} else {
  console.error('❌ Some critical files are missing. Deployment may not function correctly.');
  process.exit(1);
} 