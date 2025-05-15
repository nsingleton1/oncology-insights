/**
 * Script to verify all critical dependencies are installed correctly.
 * This helps avoid deployment issues related to missing or incompatible packages.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('========= DEPENDENCY VERIFICATION =========');

const requiredDependencies = [
  'react',
  'react-dom',
  'react-scripts',
  'serve',
  '@headlessui/react',
  'recharts',
  'tailwindcss',
  'postcss',
  'autoprefixer'
];

// Function to check if a package is installed
function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}

// Verify package.json exists
const packageJsonPath = path.join(__dirname, '../package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ ERROR: package.json not found!');
  process.exit(1);
}

// Read package.json
let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.error('❌ ERROR: Failed to parse package.json:', error.message);
  process.exit(1);
}

console.log('Checking required dependencies...');

// Check if all required packages are in dependencies or devDependencies
let missingInPackageJson = [];
requiredDependencies.forEach(dep => {
  if (
    (!packageJson.dependencies || !packageJson.dependencies[dep]) &&
    (!packageJson.devDependencies || !packageJson.devDependencies[dep])
  ) {
    missingInPackageJson.push(dep);
  }
});

// Check if required packages are actually installed
let missingInstalled = [];
requiredDependencies.forEach(dep => {
  if (!isPackageInstalled(dep)) {
    missingInstalled.push(dep);
  } else {
    console.log(`✅ ${dep} is installed`);
  }
});

// Report errors if any dependencies are missing
if (missingInPackageJson.length > 0) {
  console.error(`❌ ERROR: The following dependencies are missing from package.json: ${missingInPackageJson.join(', ')}`);
}

if (missingInstalled.length > 0) {
  console.error(`❌ ERROR: The following dependencies are not installed: ${missingInstalled.join(', ')}`);
  console.error('Run npm install to install missing dependencies');
  process.exit(1);
}

// Check node_modules exists
const nodeModulesPath = path.join(__dirname, '../node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ ERROR: node_modules directory not found!');
  console.error('Run npm install to set up dependencies');
  process.exit(1);
}

// Check for required configuration files
const requiredConfigFiles = [
  'tailwind.config.js',
  'postcss.config.js'
];

let missingConfigFiles = [];
requiredConfigFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    missingConfigFiles.push(file);
  } else {
    console.log(`✅ ${file} exists`);
  }
});

if (missingConfigFiles.length > 0) {
  console.error(`❌ ERROR: The following configuration files are missing: ${missingConfigFiles.join(', ')}`);
  process.exit(1);
}

console.log('✅ All critical dependencies are properly installed.');

// Check for problematic dependency versions
try {
  console.log('Checking for known problematic dependency versions...');
  const npmLsOutput = execSync('npm ls', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  
  const problematicPatterns = [
    { pattern: /UNMET PEER DEPENDENCY/, message: 'Unmet peer dependencies detected' },
    { pattern: /npm ERR! peer dep missing/, message: 'Missing peer dependencies' },
  ];
  
  let hasProblematicDependencies = false;
  problematicPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(npmLsOutput)) {
      console.warn(`⚠️ WARNING: ${message}`);
      hasProblematicDependencies = true;
    }
  });
  
  if (!hasProblematicDependencies) {
    console.log('✅ No known problematic dependency issues detected.');
  }
} catch (error) {
  console.warn('⚠️ WARNING: Could not run full dependency check:', error.message);
}

console.log('Dependency verification completed successfully.');

// All checks passed
process.exit(0); 