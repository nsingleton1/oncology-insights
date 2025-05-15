const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// Get all JSON files in the data directory
const jsonFiles = globSync(path.join(__dirname, '../src/data/insights/*.json'));

// Check for required properties across all files
console.log('Validating data files...');

let hasErrors = false;

jsonFiles.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const filename = path.basename(file);
    
    // Check required fields
    const requiredFields = ['id', 'display_name', 'cohort', 'summary'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error(`❌ Error in ${filename}: Missing required fields: ${missingFields.join(', ')}`);
      hasErrors = true;
    }

    // Check that either chart or chart_data exists
    if (!data.chart && !data.chart_data) {
      console.error(`❌ Error in ${filename}: Missing both chart and chart_data properties`);
      hasErrors = true;
    }

    // Check chart_data format if it exists
    if (data.chart_data) {
      if (!data.chart_data.categories || !data.chart_data.values || !Array.isArray(data.chart_data.categories) || !Array.isArray(data.chart_data.values)) {
        console.error(`❌ Error in ${filename}: chart_data must have categories and values arrays`);
        hasErrors = true;
      } else if (data.chart_data.categories.length !== data.chart_data.values.length) {
        console.error(`❌ Error in ${filename}: categories and values arrays must have the same length`);
        hasErrors = true;
      }
    }
    
    // Check action_steps or suggestions exists
    if ((!data.action_steps || !Array.isArray(data.action_steps)) && 
        (!data.suggestions || !Array.isArray(data.suggestions))) {
      console.error(`❌ Error in ${filename}: Missing both action_steps and suggestions arrays`);
      hasErrors = true;
    }
    
    // Check drilldowns if they exist
    if (data.drilldowns && Array.isArray(data.drilldowns)) {
      data.drilldowns.forEach((drilldown, index) => {
        if (!drilldown.label || !drilldown.jsonFile) {
          console.error(`❌ Error in ${filename}: Drilldown at index ${index} missing required fields (label, jsonFile)`);
          hasErrors = true;
        } else {
          // Check if referenced file exists
          const referencedFile = path.join(__dirname, '../src/data/insights', drilldown.jsonFile);
          if (!fs.existsSync(referencedFile)) {
            console.error(`❌ Error in ${filename}: Drilldown references non-existent file: ${drilldown.jsonFile}`);
            hasErrors = true;
          }
        }
      });
    }
    
    console.log(`✅ Validated ${filename}`);
  } catch (error) {
    console.error(`❌ Error parsing ${path.basename(file)}: ${error.message}`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error('\n❌ Data validation failed. Please fix the errors above before building.');
  process.exit(1);
} else {
  console.log('\n✅ All data files validated successfully.');
} 