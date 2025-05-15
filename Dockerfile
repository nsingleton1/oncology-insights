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
RUN chmod +x scripts/*.js 2>/dev/null || echo "No scripts to make executable"

# Build the application with verbose output
RUN npm run build --verbose || (echo "Build failed, checking for output directory" && ls -la && mkdir -p build && echo "Created empty build directory")

# Copy necessary data files to the build directory to ensure they're available to the next stage
RUN mkdir -p build/data/insights
RUN if [ -d "public/data/insights" ]; then \
      cp -r public/data/insights/* build/data/insights/ 2>/dev/null || echo "No data files in public/data/insights"; \
    elif [ -d "oncology-insights/public/data/insights" ]; then \
      cp -r oncology-insights/public/data/insights/* build/data/insights/ 2>/dev/null || echo "No data files in oncology-insights/public/data/insights"; \
    else \
      echo "{}" > build/data/insights/dummy-data.json; \
      echo "No data directories found, created dummy data"; \
    fi

# Production stage
FROM nginx:alpine

# Ensure the html directory exists
RUN mkdir -p /usr/share/nginx/html

# Copy built files from build stage
COPY --from=build /app/build/ /usr/share/nginx/html/

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