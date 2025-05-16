# OncoInsights Dashboard

This is the main OncoInsights dashboard application for visualizing oncology insights data.

## Project Structure

- The main application code is in the root directory
- Data files are located in `src/data/insights`
- React components are in `src/components`

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