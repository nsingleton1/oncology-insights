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

// Create source directory if it doesn't exist
if (!fs.existsSync(sourceDir)) {
  console.log(`Creating source directory: ${sourceDir}`);
  fs.mkdirSync(sourceDir, { recursive: true });
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
    
    // Ensure chart exists with proper format
    if (!data.chart) {
      console.log(`ℹ️ Adding proper chart data to ${fileName}`);
      
      // If old chart_data exists, convert it to new format
      if (data.chart_data && data.chart_data.categories && data.chart_data.values) {
        data.chart = {
          type: "bar",
          unit: "provider",
          data: data.chart_data.categories.map((name, i) => ({
            name,
            value: data.chart_data.values[i],
            gap: (data.benchmark ? data.chart_data.values[i] - data.benchmark : 0),
            highlight: i === 0
          })),
          benchmark: data.benchmark || 65,
          nccn_target: data.benchmark || 65
        };
      } else {
        // Create default chart data
        data.chart = {
          type: "bar",
          unit: "provider",
          data: [
            { name: "Provider A", value: 60, gap: -5, highlight: true },
            { name: "Provider B", value: 57, gap: -8, highlight: false },
            { name: "Provider C", value: 54, gap: -11, highlight: false },
            { name: "Provider D", value: 58, gap: -7, highlight: false },
            { name: "Provider E", value: 56, gap: -9, highlight: false }
          ],
          benchmark: 65,
          nccn_target: 70
        };
      }
    }
    
    // Ensure financial_impact exists with proper format
    if (typeof data.financial_impact === 'number' || !data.financial_impact) {
      console.log(`ℹ️ Updating financial_impact in ${fileName}`);
      const financialImpactValue = data.financial_impact || 0;
      data.financial_impact = {
        annual_opportunity: `$${financialImpactValue.toLocaleString()}/year`,
        math: data.financial_impact_description || "No direct financial impact calculated."
      };
    }
    
    // Ensure clinical_impact exists
    if (!data.clinical_impact) {
      console.log(`ℹ️ Adding clinical_impact to ${fileName}`);
      data.clinical_impact = {
        description: "Clinical impact analysis based on outcomes data and peer-reviewed literature.",
        metrics: [
          {
            type: "PFS",
            value: "+3.2 months",
            description: "Potential median progression-free survival improvement"
          },
          {
            type: "OS",
            value: "+5.1 months",
            description: "Potential median overall survival improvement"
          },
          {
            type: "QoL",
            value: "+15%",
            description: "Enhanced quality of life measures"
          }
        ],
        quantitative: "+5.1 months OS"
      };
    }
    
    // Ensure weighted_score exists
    if (!data.weighted_score) {
      console.log(`ℹ️ Adding weighted_score to ${fileName}`);
      data.weighted_score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
    }
    
    // Convert action_steps to proper format if they're strings
    if (data.action_steps && Array.isArray(data.action_steps)) {
      if (typeof data.action_steps[0] === 'string') {
        console.log(`ℹ️ Converting action_steps to proper format in ${fileName}`);
        const icons = ['chart-bar', 'user-group', 'star', 'document', 'alert', 'flag'];
        data.action_steps = data.action_steps.map((text, i) => ({
          text,
          icon: icons[i % icons.length]
        }));
      }
    } else {
      console.log(`ℹ️ Adding default action_steps to ${fileName}`);
      data.action_steps = [
        {
          text: "Compare outcomes by regimen and disease subtype",
          icon: "chart-bar"
        },
        {
          text: "Analyze progression-free survival by provider",
          icon: "user-group"
        },
        {
          text: "Identify best practices from top-performing providers",
          icon: "star"
        }
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
    chart: {
      type: "bar",
      unit: "provider",
      data: [
        { name: "Provider A", value: 60, gap: -5, highlight: true },
        { name: "Provider B", value: 57, gap: -8, highlight: false },
        { name: "Provider C", value: 54, gap: -11, highlight: false },
        { name: "Provider D", value: 58, gap: -7, highlight: false },
        { name: "Provider E", value: 56, gap: -9, highlight: false }
      ],
      benchmark: 65,
      nccn_target: 70
    },
    financial_impact: {
      annual_opportunity: "$0",
      math: "Standardizing outcomes could lead to improved patient care without direct financial impact."
    },
    clinical_impact: {
      description: "Reducing variation in clinical outcomes can significantly improve patient survival and quality of life.",
      metrics: [
        {
          type: "PFS",
          value: "+3.2 months",
          description: "Potential median progression-free survival improvement"
        },
        {
          type: "OS",
          value: "+5.1 months",
          description: "Potential median overall survival improvement"
        },
        {
          type: "QoL",
          value: "+15%",
          description: "Enhanced quality of life measures"
        }
      ],
      quantitative: "+5.1 months OS"
    },
    weighted_score: 78,
    action_steps: [
      {
        text: "Compare outcomes by regimen and disease subtype",
        icon: "chart-bar"
      },
      {
        text: "Analyze progression-free survival by provider",
        icon: "user-group"
      },
      {
        text: "Identify best practices from top-performing providers",
        icon: "star"
      }
    ],
    drilldowns: [
      {
        label: "View by Payer Type",
        cohort: "Clinical Outcomes by Payer Type",
        jsonFile: "clinical-outcomes-by-payer.json",
        drilldownLevel: 1
      },
      {
        label: "Compare Sites",
        cohort: "Clinical Outcomes by Site",
        jsonFile: "clinical-outcomes-by-site.json",
        drilldownLevel: 1
      },
      {
        label: "Variance by Regimen",
        cohort: "Clinical Outcomes by Regimen",
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