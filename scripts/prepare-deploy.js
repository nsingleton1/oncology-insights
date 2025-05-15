const fs = require('fs');
const path = require('path');

// Define paths
const sourceDir = path.join(__dirname, '../public/data/insights');
const targetDir = path.join(__dirname, '../build/data/insights');
const rootDir = path.join(__dirname, '..');
const buildDir = path.join(__dirname, '../build');

// Create function to ensure directory exists
function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Create function to copy files recursively
function copyFiles(source, target) {
  // Ensure target directory exists
  ensureDirExists(target);
  
  // Get all items in source directory
  const items = fs.readdirSync(source, { withFileTypes: true });
  
  // Process each item
  for (const item of items) {
    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);
    
    if (item.isDirectory()) {
      // If directory, recursively copy
      copyFiles(sourcePath, targetPath);
    } else {
      // If file, copy it
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${sourcePath} -> ${targetPath}`);
    }
  }
}

// Function to copy a single file
function copyFile(source, target) {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target);
    console.log(`Copied: ${source} -> ${target}`);
    return true;
  } else {
    console.warn(`Warning: Source file not found: ${source}`);
    return false;
  }
}

// Execute the copies
console.log('Preparing deployment - Copying data files to build directory...');
try {
  // 1. Copy JSON data files
  copyFiles(sourceDir, targetDir);
  console.log('Data files successfully copied to build directory.');
  
  // 2. Copy static.json to build directory (for Railway)
  const staticJsonSource = path.join(rootDir, 'static.json');
  const staticJsonTarget = path.join(buildDir, 'static.json');
  copyFile(staticJsonSource, staticJsonTarget);
  
  // 3. Ensure _redirects is in the build directory (copied from public)
  const redirectsTarget = path.join(buildDir, '_redirects');
  if (!fs.existsSync(redirectsTarget)) {
    console.log('_redirects file not found in build directory. Creating it...');
    fs.writeFileSync(redirectsTarget, '/* /index.html 200');
    console.log('Created _redirects file in build directory.');
  }
  
  console.log('All deployment files successfully prepared.');
} catch (error) {
  console.error('Error preparing deployment files:', error);
  process.exit(1);
} 