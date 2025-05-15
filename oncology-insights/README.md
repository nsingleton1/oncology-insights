# Oncology Insights Platform

A comprehensive analytics platform for oncology practices, featuring biomarker testing compliance metrics and treatment utilization insights.

## Features

- Oncology treatment utilization gap analysis
- Biomarker testing compliance tracking
- Provider performance benchmarking
- Financial impact analysis
- Clinical outcome metrics

## Deployment Options

This application can be deployed through multiple methods:

### Docker/Kubernetes

The application includes a production-ready Dockerfile and Kubernetes manifests:

```bash
# Build Docker image
docker build -t oncology-insights:latest .

# Run locally
docker run -p 80:80 oncology-insights:latest

# Deploy to Kubernetes
kubectl apply -f kubernetes/
```

### Railway

Deploy directly to Railway using the included configuration:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

### Heroku

The application includes Heroku configuration files:

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create oncology-insights

# Deploy
git push heroku main
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run with Docker Compose (includes mock API)
docker-compose up
```

### Windows-Specific Instructions

For Windows environments, use the following commands:

```powershell
# Deploy with Windows-compatible scripts
npm run deploy:windows

# Start development server
npm start
```

## Using Git

To push this codebase to your GitHub repository:

```powershell
# Install Git for Windows first from https://git-scm.com/download/win
# Then use the NPM scripts to simplify the process:

# Initialize Git repository (if not already done)
npm run git:init

# Add all files to staging
npm run git:add

# Commit changes
npm run git:commit

# Set up the remote repository
npm run git:setup-remote

# Push to GitHub
npm run git:push
```

Alternatively, you can use the standard Git commands:

```powershell
git init
git add .
git commit -m "Initial commit with full deployment configuration"
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

## Environment Configuration

The application supports various environment configurations:

```
# .env.development (local development)
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_TITLE=Oncology Insights (Dev)

# .env.production (production deployment)
REACT_APP_ENVIRONMENT=production
REACT_APP_TITLE=Oncology Insights Platform
REACT_APP_DATA_SOURCE=api
```

## Data Files

The application uses JSON data files stored in:

- `/public/data/insights/` - Publicly accessible data files
- `/src/data/insights/` - Data files bundled with the application

## Deployment Scripts

The project includes several utility scripts:

- `scripts/verify-dependencies.js` - Verifies all required dependencies
- `scripts/create-placeholder-images.js` - Creates placeholder images for development
- `scripts/prepare-deploy.js` - Prepares the build for deployment (Unix/Linux)
- `scripts/windows-deploy.js` - Windows-compatible deployment script
- `scripts/post-deployment.js` - Validates the deployment

## CI/CD Pipeline

GitHub Actions workflow is configured for automated builds and deployments.

## License

MIT
