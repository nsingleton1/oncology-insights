// verify-dependencies.js
console.log("========= VERIFYING DEPENDENCIES =========");
try {
  // Check for critical dependencies
  const deps = ['react', 'react-dom', 'react-scripts', 'typescript', 'serve'];
  let allDepsFound = true;
  
  deps.forEach(dep => {
    try {
      require.resolve(dep);
      console.log(`✅ Found dependency: ${dep}`);
    } catch (e) {
      console.error(`❌ Missing dependency: ${dep}`);
      allDepsFound = false;
    }
  });
  
  if (allDepsFound) {
    console.log("✅ All critical dependencies verified!");
  } else {
    console.warn("⚠️ Some dependencies are missing. Run 'npm install' to fix.");
  }
} catch (error) {
  console.error("Error during dependency verification:", error);
  // Don't fail the build on dependency check issues
}
console.log("========= DEPENDENCY VERIFICATION COMPLETE ========="); 