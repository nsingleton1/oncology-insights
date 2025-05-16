FROM node:18-alpine as build

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine as production

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Install json-server globally
RUN npm install -g json-server

# Install express
RUN npm install express

# Copy built app and necessary files
COPY --from=build /app/build ./build
COPY --from=build /app/mock-api ./mock-api
COPY --from=build /app/public ./public

# Expose the port for the server
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV REACT_APP_DATA_SOURCE=api

# Add start script
COPY docker-start.sh /
RUN chmod +x /docker-start.sh

CMD ["/docker-start.sh"] 