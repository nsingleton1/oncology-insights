/**
 * Script to validate deployment and perform post-deployment checks
 * Ensures data files are properly accessible and app configuration is correct
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

console.log('========= POST-DEPLOYMENT VALIDATION =========');

// Check if build directory exists and has the expected files
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
  console.error('❌ ERROR: Build directory not found. Run npm build first.');
  process.exit(1);
}

// Check for critical files
const criticalFiles = [
  'index.html',
  'static/js',
  'static/css',
  '_redirects',
  'static.json'
];

let missingFiles = [];
criticalFiles.forEach(file => {
  const filePath = path.join(buildDir, file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.error(`❌ ERROR: The following critical files are missing: ${missingFiles.join(', ')}`);
  process.exit(1);
}

// Validate data files are in the build folder
const buildDataDir = path.join(buildDir, 'data');
if (!fs.existsSync(buildDataDir)) {
  console.warn('⚠️ WARNING: data directory not found in build');
  
  // Create data directory
  fs.mkdirSync(buildDataDir, { recursive: true });
  console.log('✅ Created data directory in build');

  // Check public/data as fallback
  const publicDataDir = path.join(__dirname, '../public/data');
  if (fs.existsSync(publicDataDir)) {
    console.log('Found data in public/data, this will be served in production.');
  } else {
    console.warn('⚠️ WARNING: No data found in public/data either. Application may not function correctly.');
  }
} else {
  // Validate that JSON files in data folder are valid
  const dataFiles = fs.readdirSync(buildDataDir, { withFileTypes: true })
    .filter(entry => !entry.isDirectory() && entry.name.endsWith('.json'))
    .map(entry => entry.name);
  
  if (dataFiles.length === 0) {
    console.warn('⚠️ WARNING: No JSON files found in build/data directory');
  } else {
    console.log(`Found ${dataFiles.length} JSON files in build/data`);
    
    // Validate a few random JSON files
    const samplesToValidate = Math.min(3, dataFiles.length);
    let validationErrors = [];
    
    for (let i = 0; i < samplesToValidate; i++) {
      const randomIndex = Math.floor(Math.random() * dataFiles.length);
      const filePath = path.join(buildDataDir, dataFiles[randomIndex]);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content); // Will throw if not valid JSON
        console.log(`✅ Validated JSON: ${dataFiles[randomIndex]}`);
      } catch (error) {
        validationErrors.push(`${dataFiles[randomIndex]}: ${error.message}`);
      }
    }
    
    if (validationErrors.length > 0) {
      console.error('❌ ERROR: Found invalid JSON files:', validationErrors);
    }
  }
}

// Create a manifest for the data files
console.log('Creating data manifest file...');
function createDataManifest(directory, basePath = '') {
  const result = [];
  
  if (!fs.existsSync(directory)) {
    return result;
  }
  
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const relativePath = path.join(basePath, entry.name);
    
    if (entry.isDirectory()) {
      result.push(...createDataManifest(path.join(directory, entry.name), relativePath));
    } else if (entry.name.endsWith('.json')) {
      result.push(relativePath);
    }
  }
  
  return result;
}

// Create manifest from both build/data and public/data
const buildDataFiles = createDataManifest(buildDataDir);
const publicDataDir = path.join(__dirname, '../public/data');
const publicDataFiles = createDataManifest(publicDataDir, 'public');

const dataManifest = {
  buildData: buildDataFiles,
  publicData: publicDataFiles,
  generatedAt: new Date().toISOString()
};

fs.writeFileSync(
  path.join(buildDir, 'data-manifest.json'),
  JSON.stringify(dataManifest, null, 2)
);
console.log('✅ Created data-manifest.json');

console.log('✅ Post-deployment validation completed successfully.'); 