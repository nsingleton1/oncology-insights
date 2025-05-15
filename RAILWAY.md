# Railway Deployment Guide for OncoInsights

This document provides instructions for deploying the OncoInsights platform to Railway.app.

## Prerequisites

1. A Railway.app account
2. Railway CLI installed (optional)
3. Git repository with the OncoInsights code

## Deployment Steps

### Option 1: Deploy with the Railway CLI

1. Login to Railway:
   ```bash
   railway login
   ```

2. Link your project:
   ```bash
   railway link
   ```

3. Deploy the application:
   ```bash
   railway up
   ```

### Option 2: Deploy via the Railway Dashboard

1. Go to [Railway.app](https://railway.app/) and login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect the configuration and deploy

## Configuration Files

The deployment uses multiple configuration files:

1. **railway.json**: Main Railway configuration
2. **railway.toml**: Additional Railway-specific settings  
3. **nixpacks.toml**: Detailed build instructions
4. **static.json**: Routing and caching configuration

## Environment Variables

Configure the following environment variables in Railway Dashboard:

- `REACT_APP_ENVIRONMENT`: Set to `production`
- `REACT_APP_VERSION`: Your version number or tag
- `PORT`: Railway sets this automatically, our configuration uses it

## Automated Deployment Processes

This application includes several automated deployment processes to ensure everything works correctly in production:

### 1. Asset Generation

The build process includes an asset generation step that:
- Automatically creates required image files (favicon.ico, logo192.png, logo512.png)
- Ensures the PWA manifest is properly configured
- Sets up all static assets required by the application

This happens in the `prebuild` script before the main build process starts.

### 2. Data File Handling

The application depends on JSON data files located in `public/data/insights/`. A post-build script (`scripts/prepare-deploy.js`) automatically copies these files to the correct location in the build directory.

How it works:
1. React builds the application
2. `prepare-deploy.js` runs and copies all JSON files from `public/data/insights/` to `build/data/insights/`
3. The script also ensures `static.json` and `_redirects` are copied to the build directory
4. Railway serves the static files from the build directory

### 3. Client-Side Routing Support

The application uses client-side routing for navigation between different views. To ensure this works correctly when deployed to Railway, both a `static.json` file and `_redirects` file are included that:

- Route all requests to index.html (enabling client-side routing)
- Set appropriate security headers
- Configure caching rules for different types of content
- Enforce HTTPS

### 4. Deployment Validation

A post-deployment validation script (`scripts/post-deployment.js`) runs after the build process to verify that:

- All critical files are present in the build directory
- JSON data files were properly copied
- Configuration files like `static.json` and `_redirects` are available
- Required assets like favicon and logo images exist

If any issues are detected, the deployment will fail with helpful error messages.

## Monitoring and Maintenance

- Monitor your application in the Railway dashboard
- View logs in real-time through the Railway dashboard
- The application will automatically restart on failure (up to 10 retries as configured)
- The deployment includes a health check endpoint configured at the root path

## Troubleshooting

If you encounter issues:

1. Check the build logs for validation errors
2. Verify that all required files are present in your repository
3. Review logs in the Railway dashboard
4. If data files aren't loading:
   - Check if the `prepare-deploy.js` script executed successfully in the build logs
   - Verify that files exist in your repository under `public/data/insights/`
   - Try accessing files directly via `/data/insights/[filename].json` in your browser
5. If routes aren't working:
   - Verify that `static.json` and `_redirects` exist in the build directory
   - Check for any syntax errors in these files
6. If assets aren't loading:
   - Check if the `create-placeholder-images.js` script ran successfully
   - Verify the image files were properly generated
   - Check manifest.json for any syntax errors 