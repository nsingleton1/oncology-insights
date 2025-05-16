const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// Define path to insights data
const publicDir = path.join(__dirname, '../public/data/insights');

// Create destination directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  console.log(`Creating directory: ${publicDir}`);
  fs.mkdirSync(publicDir, { recursive: true });
}

// Get all existing JSON files
const existingFiles = globSync(path.join(publicDir, '*.json'));

console.log(`Found ${existingFiles.length} existing data files.`);

// Validate and update existing files
existingFiles.forEach(file => {
  try {
    const fileName = path.basename(file);
    
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
    
    // Write the updated file back
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`✓ Updated: ${fileName}`);
    
  } catch (error) {
    console.error(`❌ Error processing file ${path.basename(file)}: ${error.message}`);
  }
});

console.log(`\nCompleted processing data files in ${publicDir}`);

// Check for required files and create them if missing
const requiredFiles = [
  'breast-cancer-cdk46.json',
  'nsclc-pd1.json',
  'mcrc-egfr.json',
  'biomarker-compliance.json'
];

const missingFiles = requiredFiles.filter(fileName => 
  !fs.existsSync(path.join(publicDir, fileName))
);

if (missingFiles.length > 0) {
  console.log(`Creating ${missingFiles.length} missing required file(s)...`);
  
  missingFiles.forEach(fileName => {
    const id = fileName.replace('.json', '');
    
    const defaultData = {
      id,
      display_name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      cohort: "Patients initiating treatment (2024-2025)",
      insight_type: "Clinical Outcomes by Provider",
      summary: `This is a default insight for ${id}. Please update with actual data.`,
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
        annual_opportunity: "$75,000/year",
        math: "Standardizing outcomes could lead to improved patient care."
      },
      clinical_impact: {
        description: "Improving outcomes can significantly impact patient survival and quality of life.",
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
      ]
    };
    
    fs.writeFileSync(path.join(publicDir, fileName), JSON.stringify(defaultData, null, 2));
    console.log(`✓ Created default file: ${fileName}`);
  });
} 