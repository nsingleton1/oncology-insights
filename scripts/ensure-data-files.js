const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// Define paths
const sourceDir = path.join(__dirname, '../src/data/insights');
const publicDir = path.join(__dirname, '../public/data/insights');

// Create destination directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  console.log(`Creating directory: ${publicDir}`);
  fs.mkdirSync(publicDir, { recursive: true });
}

// Get all source JSON files
const sourceFiles = globSync(path.join(sourceDir, '*.json'));

console.log(`Found ${sourceFiles.length} data files in source directory.`);

// Copy files to public directory
sourceFiles.forEach(file => {
  try {
    const fileName = path.basename(file);
    const targetPath = path.join(publicDir, fileName);
    
    // Read and validate the file
    const jsonContent = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(jsonContent);
    
    // Check for required fields
    const requiredFields = ['id', 'display_name', 'cohort', 'summary'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error(`❌ Error in ${fileName}: Missing required fields: ${missingFields.join(', ')}`);
    } else {
      console.log(`✅ Validated ${fileName}`);
    }
    
    // Ensure chart_data or chart exists
    if (!data.chart_data && !data.chart) {
      console.log(`ℹ️ Adding default chart_data to ${fileName}`);
      data.chart_data = {
        categories: ["Provider A", "Provider B", "Provider C", "Provider D", "Provider E"],
        values: [60, 57, 54, 58, 56],
        peer_values: [65, 65, 65, 65, 65],
        target_values: [70, 70, 70, 70, 70]
      };
      data.benchmark = 65;
    }
    
    // Ensure action_steps or suggestions exist
    if (!data.action_steps && !data.suggestions) {
      console.log(`ℹ️ Adding default action_steps to ${fileName}`);
      data.action_steps = [
        "Compare outcomes by regimen and disease subtype",
        "Analyze progression-free survival by provider",
        "Identify best practices from top-performing providers"
      ];
    }
    
    // Write the updated file to the public directory
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
    console.log(`✓ Copied and updated: ${fileName}`);
    
  } catch (error) {
    console.error(`❌ Error processing file ${path.basename(file)}: ${error.message}`);
  }
});

console.log(`\nCompleted processing data files. Copied to ${publicDir}`);

// If there are no source files, create a default one
if (sourceFiles.length === 0) {
  console.log(`Creating default clinical outcomes file as no source files were found.`);
  
  const defaultData = {
    id: "clinical-outcomes-overview",
    display_name: "Clinical Outcomes",
    cohort: "Patients with metastatic solid tumors initiating 1st Line treatment (2024-2025)",
    insight_type: "Clinical Outcomes by Provider",
    summary: "Overall survival rates show 5% variation across sites, with significant differences in progression-free survival by regimen and provider.",
    chart_data: {
      categories: ["Provider A", "Provider B", "Provider C", "Provider D", "Provider E"],
      values: [60, 57, 54, 58, 56],
      peer_values: [65, 65, 65, 65, 65],
      target_values: [70, 70, 70, 70, 70]
    },
    benchmark: 65,
    financial_impact: 0,
    financial_impact_description: "Standardizing outcomes could lead to improved patient care without direct financial impact.",
    action_steps: [
      "Compare outcomes by regimen and disease subtype",
      "Analyze progression-free survival by provider",
      "Identify best practices from top-performing providers"
    ],
    drilldowns: [
      {
        label: "View by Payer Type",
        description: "Compare outcomes by payer type",
        jsonFile: "clinical-outcomes-by-payer.json",
        drilldownLevel: 1
      },
      {
        label: "Compare Sites",
        description: "Compare outcomes by site",
        jsonFile: "clinical-outcomes-by-site.json",
        drilldownLevel: 1
      },
      {
        label: "Variance by Regimen",
        description: "Compare outcomes by regimen",
        jsonFile: "clinical-outcomes-by-regimen.json",
        drilldownLevel: 1
      }
    ]
  };
  
  // Write to both source and public directories
  fs.writeFileSync(path.join(sourceDir, 'clinical-outcomes.json'), JSON.stringify(defaultData, null, 2));
  fs.writeFileSync(path.join(publicDir, 'clinical-outcomes.json'), JSON.stringify(defaultData, null, 2));
  
  console.log(`✓ Created default clinical outcomes file`);
} 