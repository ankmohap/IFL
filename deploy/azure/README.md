# Azure Deployment

This project is containerized and deployable to Azure as a single image.

## Build and test image locally

```bash
docker build -t ifl-fullstack:latest .
docker run --rm -p 4000:4000 -e PORT=4000 -e DB_PATH=/data/ifl.sqlite3 ifl-fullstack:latest
```

## Deploy to Azure Container Registry + Container Apps

```bash
# Variables
RG=<resource-group>
LOCATION=eastus
ACR=<acr-name>
IMAGE=ifl-fullstack
TAG=latest
ENV=<container-app-env>
APP=ifl-fantasy-app

az group create -n $RG -l $LOCATION
az acr create -n $ACR -g $RG --sku Basic
az acr login -n $ACR

# Build and push image
az acr build --registry $ACR --image $IMAGE:$TAG .

# Create managed environment
az containerapp env create -n $ENV -g $RG -l $LOCATION

# Deploy app
az containerapp create \
  -n $APP \
  -g $RG \
  --environment $ENV \
  --image $ACR.azurecr.io/$IMAGE:$TAG \
  --target-port 4000 \
  --ingress external \
  --registry-server $ACR.azurecr.io \
  --cpu 0.5 \
  --memory 1Gi \
  --env-vars PORT=4000 DB_PATH=/data/ifl.sqlite3
```

## Deploy to Azure App Service (Web App for Containers)

```bash
RG=<resource-group>
PLAN=<app-service-plan>
APP=<webapp-name>
ACR=<acr-name>
IMAGE=ifl-fullstack
TAG=latest

az appservice plan create -g $RG -n $PLAN --is-linux --sku B1
az webapp create -g $RG -p $PLAN -n $APP \
  -i $ACR.azurecr.io/$IMAGE:$TAG

az webapp config appsettings set -g $RG -n $APP --settings \
  WEBSITES_PORT=4000 PORT=4000 DB_PATH=/home/site/data/ifl.sqlite3
```

## Notes

- SQLite is file-based. For production, use mounted persistent storage or migrate to a managed DB.
- Container Apps with multiple replicas + SQLite may cause data inconsistency unless you use a shared volume with proper locking semantics.
