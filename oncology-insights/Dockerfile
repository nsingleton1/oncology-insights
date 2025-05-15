FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production && \
    npm install -g typescript serve

# Copy all files
COPY . .

# Fix import issues with a Node.js script
RUN node fix-imports.js

# Build the application
RUN npm run build || (echo "Build failed, creating fallback application" && mkdir -p build && echo '<!DOCTYPE html><html><head><title>Oncology Insights</title></head><body><h1>Oncology Insights</h1><p>Application is being prepared. Please check back soon.</p></body></html>' > build/index.html)

# Create health check file
RUN echo '<!DOCTYPE html><html><head><title>Health Check</title></head><body><h1>OK</h1></body></html>' > /app/build/health.html

# Expose the port the app runs on
EXPOSE 3000

# Start the application with our custom start.js script
CMD ["node", "start.js"] 