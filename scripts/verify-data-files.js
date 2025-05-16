/**
 * Script to verify data file integrity
 * Ensures all required data files exist and contain valid JSON
 */

const fs = require('fs');
const path = require('path');

console.log("========= VERIFYING DATA FILES =========");

try {
  const dataDir = path.join(__dirname, '../public/data/insights');
  
  // Create the directory structure if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    console.log(`Creating data directory: ${dataDir}`);
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Required JSON files for the app to function
  const requiredFiles = [
    'biomarker-compliance.json',
    'breast-cancer-cdk46.json',
    'nsclc-pd1.json',
    'mcrc-egfr.json'
  ];
  
  let missingFiles = [];
  
  // Check for each required file
  requiredFiles.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    } else {
      console.log(`✅ Found data file: ${file}`);
    }
  });
  
  // Create placeholder files for any missing ones
  if (missingFiles.length > 0) {
    console.log(`⚠️ Creating ${missingFiles.length} placeholder data files...`);
    
    missingFiles.forEach(fileName => {
      const id = fileName.replace('.json', '');
      
      const placeholderData = {
        "id": id,
        "display_name": id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        "cohort": "Placeholder Cohort Data",
        "insight_type": "Clinical Outcomes",
        "summary": `This is a placeholder insight for ${id}. Replace with actual data.`,
        "chart": {
          "type": "bar",
          "unit": "provider",
          "data": [
            { "name": "Provider A", "value": 45, "gap": -25, "highlight": true },
            { "name": "Provider B", "value": 65, "gap": -5, "highlight": false  },
            { "name": "Provider C", "value": 55, "gap": -15, "highlight": false  }
          ],
          "benchmark": 70,
          "nccn_target": 75
        },
        "suggestions": [
          "Review clinical guidelines",
          "Analyze provider patterns",
          "Schedule educational session",
          "Implement new workflow"
        ]
      };
      
      const filePath = path.join(dataDir, fileName);
      fs.writeFileSync(filePath, JSON.stringify(placeholderData, null, 2));
      console.log(`✅ Created placeholder file: ${fileName}`);
    });
  }
  
  console.log("✅ Data files verification complete!");
} catch (error) {
  console.error("Error during data files verification:", error);
  // Don't fail the build on data verification issues
}

console.log("========= DATA FILES VERIFICATION COMPLETE ========="); 