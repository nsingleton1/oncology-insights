# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy all files (except those in .dockerignore)
COPY . .

# Create placeholder images and verify dependencies
RUN mkdir -p scripts
RUN node scripts/create-placeholder-images.js || echo "No placeholder script found, skipping"
RUN node scripts/verify-dependencies.js || echo "No verify script found, skipping"

# Build the app
RUN npm run build

# Generate runtime scripts for data handling
RUN mkdir -p build/scripts
RUN cp scripts/prepare-deploy.js build/scripts/ || echo "No prepare-deploy script found, skipping"
RUN cp scripts/post-deployment.js build/scripts/ || echo "No post-deployment script found, skipping"

# Final stage
FROM nginx:stable-alpine AS final

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Run prepare-deploy script to ensure all needed files are present
WORKDIR /usr/share/nginx/html
RUN mkdir -p scripts data

# Copy data files from public to ensure they're available
COPY --from=build /app/public/data /usr/share/nginx/html/data

# Create an SPA routing file for Nginx to handle client-side routing
RUN echo "/* /index.html 200" > /usr/share/nginx/html/_redirects
RUN echo '{"root":"./","routes":{"/**":"index.html"}}' > /usr/share/nginx/html/static.json

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget -q --spider http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"] 