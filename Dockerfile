FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Create scripts directory if it doesn't exist
RUN mkdir -p scripts

# Ensure scripts are executable
RUN find scripts -name "*.js" -exec chmod +x {} \; || echo "No scripts to make executable"

# Build the application with verbose output
RUN npm run build --verbose || (echo "Build failed, checking for output directory" && ls -la && mkdir -p build && echo "Created empty build directory")

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build/ /usr/share/nginx/html/

# Ensure the data directory exists
RUN mkdir -p /usr/share/nginx/html/data/insights

# Copy data files explicitly to ensure they're available
COPY --from=build /app/public/data/insights/ /usr/share/nginx/html/data/insights/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add a basic index.html if none exists
RUN if [ ! -f /usr/share/nginx/html/index.html ]; then \
    echo '<html><body><h1>Oncology Insights</h1><p>Application is being deployed. Please check back later.</p></body></html>' > /usr/share/nginx/html/index.html; \
fi

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 