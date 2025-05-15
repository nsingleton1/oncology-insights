FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Ensure the data directory exists and copy data files
RUN mkdir -p public/data/insights
RUN cp -r src/data/insights/* public/data/insights/ || echo "No data files to copy"

# Build the application - if this fails, let it fail
RUN npm run build

# Expose the port
EXPOSE 8080

# Start command
CMD ["npx", "serve", "-s", "build", "-l", "8080"] 