#!/bin/sh

# Make sure the data directory exists in the build folder
if [ ! -d "./build/data" ] && [ -d "./public/data" ]; then
  echo "Copying data directory from public to build..."
  mkdir -p ./build/data
  cp -r ./public/data/* ./build/data/
fi

# Create a simple Express server that handles both API and static files
cat > server.js << 'EOF'
const express = require('express');
const jsonServer = require('json-server');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Setup json-server
const apiRouter = jsonServer.router('./mock-api/db.json');
const middlewares = jsonServer.defaults({
  logger: false
});

// Apply routes configuration
const routes = require('./mock-api/routes.json');
const rewriter = jsonServer.rewriter(routes);

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// Use JSON Server for the API routes
app.use('/api', rewriter, apiRouter);
app.use('/api', middlewares, apiRouter);

// For any other request, send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

# Install Express
npm install express

# Run the combined server
node server.js 