FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Create public/data directory structure
RUN mkdir -p public/data/insights

# Ensure data files are properly copied to the public directory
# This is critical for the app to function correctly
RUN cp -r src/data/insights/* public/data/insights/ || echo "No data files to copy"

# Make sure the build can access the data files
RUN ls -la public/data/insights/ || echo "Directory listing failed"

# Build the application - if this fails, let it fail
RUN npm run build

# Verify the build directory contains the data files
RUN mkdir -p build/data/insights
RUN cp -r public/data/insights/* build/data/insights/ || echo "No data files to copy to build"
RUN ls -la build/data/insights/ || echo "Directory listing failed"

# Expose the port
EXPOSE 8080

# Start command
CMD ["npx", "serve", "-s", "build", "-l", "8080"] 