FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Make sure our scripts are executable
RUN chmod +x scripts/*.js || true

# Expose the port that React development server uses
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV WDS_SOCKET_PORT=3000

# Use the exact same start command as locally
CMD ["npm", "start"] 