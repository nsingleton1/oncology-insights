const fs = require('fs');
const path = require('path');

console.log('Fixing module imports...');

// Ensure all directories exist
const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');

// Path to files
const appPath = path.join(srcDir, 'App.tsx');
const tabModulePath = path.join(componentsDir, 'TabManagementModule.tsx');

// Fix App.tsx import
if (fs.existsSync(appPath)) {
  console.log('Updating App.tsx imports...');
  let appContent = fs.readFileSync(appPath, 'utf8');
  
  // Replace named import with default import
  appContent = appContent.replace(
    /import\s*\{\s*TabManagementModule\s*\}\s*from\s*['"]\.\/components\/TabManagementModule['"]/g,
    `import TabManagementModule from './components/TabManagementModule'`
  );
  
  fs.writeFileSync(appPath, appContent);
  console.log('App.tsx imports updated.');
}

// Fix TabManagementModule.tsx export
if (fs.existsSync(tabModulePath)) {
  console.log('Updating TabManagementModule.tsx exports...');
  let tabModuleContent = fs.readFileSync(tabModulePath, 'utf8');
  
  // Replace named export with regular const definition
  tabModuleContent = tabModuleContent.replace(
    /export\s+const\s+TabManagementModule\s*:/g,
    'const TabManagementModule:'
  );
  
  // Add default export if not already present
  if (!tabModuleContent.includes('export default TabManagementModule')) {
    tabModuleContent += '\n\nexport default TabManagementModule;';
  }
  
  fs.writeFileSync(tabModulePath, tabModuleContent);
  console.log('TabManagementModule.tsx exports updated.');
}

console.log('Module imports fixed.'); 