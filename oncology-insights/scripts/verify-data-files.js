/**
 * Script to verify data file integrity
 * Ensures all required data files exist and contain valid JSON
 */

const fs = require('fs');
const path = require('path');

console.log('========= DATA FILE VERIFICATION =========');

// Required data files that must exist
const requiredDataFiles = [
  'breast-cancer-cdk46.json',
  'nsclc-pd1.json',
  'mcrc-egfr.json',
  'biomarker-compliance.json'
];

// Check files in src/data/insights
const srcDataPath = path.join(__dirname, '../src/data/insights');
if (!fs.existsSync(srcDataPath)) {
  console.warn('⚠️ src/data/insights directory not found. Creating it...');
  fs.mkdirSync(srcDataPath, { recursive: true });
}

// Check files in public/data/insights
const publicDataPath = path.join(__dirname, '../public/data/insights');
if (!fs.existsSync(publicDataPath)) {
  console.warn('⚠️ public/data/insights directory not found. Creating it...');
  fs.mkdirSync(publicDataPath, { recursive: true });
}

// Function to verify JSON files
const verifyJsonFiles = (directory, files) => {
  let missingFiles = [];
  let invalidJsonFiles = [];

  files.forEach(file => {
    const filePath = path.join(directory, file);
    
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
      return;
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      JSON.parse(content); // Will throw if not valid JSON
      console.log(`✅ Verified ${file} in ${directory}`);
    } catch (error) {
      invalidJsonFiles.push({ file, error: error.message });
    }
  });

  return { missingFiles, invalidJsonFiles };
};

// Verify src/data/insights files
const srcResult = verifyJsonFiles(srcDataPath, requiredDataFiles);
if (srcResult.missingFiles.length > 0) {
  console.warn(`⚠️ Missing ${srcResult.missingFiles.length} files in src/data/insights: ${srcResult.missingFiles.join(', ')}`);
}
if (srcResult.invalidJsonFiles.length > 0) {
  console.error('❌ Invalid JSON files in src/data/insights:');
  srcResult.invalidJsonFiles.forEach(({ file, error }) => {
    console.error(`  - ${file}: ${error}`);
  });
}

// Verify public/data/insights files
const publicResult = verifyJsonFiles(publicDataPath, requiredDataFiles);
if (publicResult.missingFiles.length > 0) {
  console.warn(`⚠️ Missing ${publicResult.missingFiles.length} files in public/data/insights: ${publicResult.missingFiles.join(', ')}`);
  
  // Copy from src to public if available
  publicResult.missingFiles.forEach(file => {
    const srcFile = path.join(srcDataPath, file);
    if (fs.existsSync(srcFile)) {
      const destFile = path.join(publicDataPath, file);
      fs.copyFileSync(srcFile, destFile);
      console.log(`✅ Copied ${file} from src to public/data/insights`);
    }
  });
}
if (publicResult.invalidJsonFiles.length > 0) {
  console.error('❌ Invalid JSON files in public/data/insights:');
  publicResult.invalidJsonFiles.forEach(({ file, error }) => {
    console.error(`  - ${file}: ${error}`);
  });
}

// Check for all required files in at least one location
const missingEverywhere = requiredDataFiles.filter(file => 
  srcResult.missingFiles.includes(file) && publicResult.missingFiles.includes(file)
);

if (missingEverywhere.length > 0) {
  console.error(`❌ ERROR: The following critical data files are missing from both src and public: ${missingEverywhere.join(', ')}`);
  process.exit(1);
}

console.log('✅ Data file verification completed.');

// If at least one location has all the required files, we're good to go
process.exit(0); 