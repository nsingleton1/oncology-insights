/**
 * Script to create placeholder images for the application
 * This ensures that all required assets are available during the build process
 */

const fs = require('fs');
const path = require('path');

console.log('========= CREATING PLACEHOLDER IMAGES =========');

// Ensure the public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Ensure the images directory exists
const imagesDir = path.join(publicDir, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create a simple SVG placeholder
function createPlaceholderSVG(width, height, text, bgColor = '#f0f0f0', textColor = '#333333') {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="${textColor}">${text}</text>
  </svg>`;
}

// List of placeholder images to create if they don't exist
const placeholders = [
  { filename: 'logo.svg', width: 200, height: 60, text: 'Oncology Insights', bg: '#0d9488', textColor: '#ffffff' },
  { filename: 'favicon.svg', width: 32, height: 32, text: 'OI', bg: '#0d9488', textColor: '#ffffff' },
  { filename: 'placeholder.svg', width: 300, height: 200, text: 'Image Placeholder', bg: '#f0f0f0', textColor: '#333333' },
  { filename: 'profile.svg', width: 48, height: 48, text: 'User', bg: '#e0e0e0', textColor: '#333333' },
  { filename: 'report.svg', width: 80, height: 80, text: 'Report', bg: '#e0e0e0', textColor: '#333333' },
  { filename: 'chart.svg', width: 80, height: 80, text: 'Chart', bg: '#e0e0e0', textColor: '#333333' }
];

// Create each placeholder if it doesn't exist
placeholders.forEach(({ filename, width, height, text, bg, textColor }) => {
  const filePath = path.join(imagesDir, filename);
  
  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${filename} already exists`);
    return;
  }
  
  // Create the SVG placeholder
  const svgContent = createPlaceholderSVG(width, height, text, bg, textColor);
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Created placeholder image: ${filename}`);
});

// Create favicon.ico if it doesn't exist
const faviconPath = path.join(publicDir, 'favicon.ico');
if (!fs.existsSync(faviconPath)) {
  // Copy the SVG favicon as a placeholder
  // In a real project, you'd convert SVG to ICO using a library
  const svgFaviconPath = path.join(imagesDir, 'favicon.svg');
  if (fs.existsSync(svgFaviconPath)) {
    fs.copyFileSync(svgFaviconPath, faviconPath);
    console.log('✅ Created favicon.ico (copied from SVG)');
  } else {
    // Create a minimal 1x1 transparent ICO file
    const minimalIco = Buffer.from([0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 24, 0, 0, 0]);
    fs.writeFileSync(faviconPath, minimalIco);
    console.log('✅ Created minimal favicon.ico');
  }
}

// Create or update manifest.json file
const manifestPath = path.join(publicDir, 'manifest.json');
const manifest = {
  "short_name": "Oncology Insights",
  "name": "Oncology Insights Platform",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "images/logo.svg",
      "type": "image/svg+xml",
      "sizes": "200x60"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#0d9488",
  "background_color": "#ffffff"
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ Created/updated manifest.json');

// Create robots.txt if it doesn't exist
const robotsPath = path.join(publicDir, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  const robotsContent = 'User-agent: *\nDisallow: /api/\nDisallow: /private/\nAllow: /';
  fs.writeFileSync(robotsPath, robotsContent);
  console.log('✅ Created robots.txt');
}

console.log('✅ Placeholder images creation completed.'); 