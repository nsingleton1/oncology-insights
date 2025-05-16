# OncoInsights

A React application for visualizing oncology treatment insights.

## Running Locally

### Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher

### Installation

```bash
npm install
```

### Running the Application

To run both the React application and the mock API server:

```bash
npm run dev
```

This will start:
- The React application on http://localhost:3000
- The mock API server on http://localhost:3001

You can also run them separately:

```bash
# Just the React app
npm start

# Just the mock API
npm run mock-api
```

## Running with Docker

### Prerequisites

- Docker
- Docker Compose

### Building and Running

```bash
# Build and start the containers
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop the containers
docker-compose down
```

The application will be available at:
- React app: http://localhost:3000
- Mock API: http://localhost:3001

## Project Structure

- `src/` - React application source code
- `public/` - Static assets
- `mock-api/` - Mock API server configuration and data
- `scripts/` - Build and utility scripts

## Deployment

This application can be run locally using:

```bash
npm start
```

It can also be deployed using Docker:

```bash
docker-compose up
```

Or deployed to Railway:

```bash
railway up
```

## IMPORTANT NOTICE

The `oncology-insights` subdirectory contains a deprecated version of this application and should not be used. All development should be done using the files in the root directory.

## Local Development

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ and npm

### Running Locally with Docker

1. Build and start the container:
```bash
docker-compose up --build
```

2. Access the application at http://localhost:80

### Development without Docker

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Access the application at http://localhost:3000

## Production Deployment

### Containerization

The application is containerized using a multi-stage Docker build process:
1. Build stage: Compiles the React application
2. Production stage: Serves the built static files using Nginx

### Kubernetes Deployment

The application is designed to be deployed on a Kubernetes cluster with the following components:

1. **Deployment**: Manages the application pods
   - 3 replicas for high availability
   - Resource limits
   - Health checks

2. **Service**: Internal networking
   - Exposes port 80

3. **Ingress**: External access
   - TLS termination
   - HTTP to HTTPS redirect
   - Security headers

4. **ConfigMap**: Environment variables
   - API URLs
   - Environment identifiers

### Deployment Steps

1. Update the domain in `kubernetes/ingress.yaml` to match your environment

2. Deploy using kubectl:
```bash
# Create namespace if it doesn't exist
kubectl create namespace oncology

# Apply Kubernetes manifests
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/ingress.yaml
```

3. Verify deployment:
```bash
kubectl get pods -n oncology
kubectl get ingress -n oncology
```

## CI/CD Pipeline

The repository includes a GitHub Actions workflow in `.github/workflows/deploy.yml` that:

1. Builds and tests the application
2. Creates a Docker image
3. Pushes the image to GitHub Container Registry
4. Deploys to a Kubernetes cluster

### Requirements for CI/CD

1. GitHub repository secret: `KUBE_CONFIG` (Kubernetes configuration file)
2. Kubernetes namespace: `oncology`

## Monitoring and Maintenance

- Application logs are available through `kubectl logs`
- Health checks ensure automatic recovery from failures
- Rolling updates provide zero-downtime deployments

## Railway Deployment Instructions

This application is configured for deployment on Railway. Follow these steps to deploy:

1. **Install Railway CLI** (if not already installed):
   ```
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```
   railway login
   ```

3. **Link your project** (if not already linked):
   ```
   railway link
   ```

4. **Deploy to Railway**:
   ```
   railway up
   ```

5. **Set Environment Variables** (through Railway dashboard):
   - `NODE_ENV`: production
   - `REACT_APP_DATA_SOURCE`: static
   - `PORT`: 8080

## Local Development

To run the application locally using Docker:

```
docker-compose up
```

Access the application at:
- React App: http://localhost:3000
- Mock API: http://localhost:3001

## Architecture

The application consists of:
- A React frontend
- A mock API server using json-server

In production, both are served from the same container with the frontend on the main port and the API on port 3001. 