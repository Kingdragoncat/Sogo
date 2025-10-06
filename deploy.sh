#!/bin/bash
#
# Mythofy Mail - Automated Deployment Script
# Usage: ./deploy.sh [dev|prod]
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV=${1:-dev}
PROJECT_NAME="mythofy-mail"
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   Mythofy Mail - Automated Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"
echo -e "${GREEN}✓ Docker Compose is installed${NC}"
echo ""

# Environment setup
if [ "$ENV" = "prod" ]; then
    echo -e "${YELLOW}🚀 Production deployment mode${NC}"
    COMPOSE_FILE="docker-compose.yml"
else
    echo -e "${YELLOW}🔧 Development deployment mode${NC}"
    COMPOSE_FILE="docker-compose.yml"
fi

# Check for .env file
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo -e "${YELLOW}⚠ No .env file found. Creating from .env.example...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠ Please edit .env with your Mailcow credentials before continuing.${NC}"
        echo -e "${YELLOW}  Press ENTER to open .env in nano, or Ctrl+C to exit and edit manually.${NC}"
        read -p ""
        nano .env
    else
        echo -e "${RED}❌ No .env file or .env.example found!${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Environment file exists${NC}"
echo ""

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Validate required environment variables
REQUIRED_VARS=("MAILCOW_API_KEY" "JWT_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "${RED}   - $var${NC}"
    done
    exit 1
fi

echo -e "${GREEN}✓ All required environment variables are set${NC}"
echo ""

# Stop existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker-compose down 2>/dev/null || true
echo ""

# Build images
echo -e "${BLUE}🔨 Building Docker images...${NC}"
docker-compose build --no-cache
echo ""

# Start services
echo -e "${BLUE}🚀 Starting services...${NC}"
docker-compose up -d
echo ""

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check service status
SERVICES=("frontend" "backend" "redis" "mysql")
ALL_HEALTHY=true

for service in "${SERVICES[@]}"; do
    if docker-compose ps | grep -q "${PROJECT_NAME}-${service}.*Up"; then
        echo -e "${GREEN}✓ $service is running${NC}"
    else
        echo -e "${RED}✗ $service is not running${NC}"
        ALL_HEALTHY=false
    fi
done

echo ""

if [ "$ALL_HEALTHY" = true ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   ✅ Deployment successful!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}📡 Services are running at:${NC}"
    echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
    echo -e "   Backend:  ${GREEN}http://localhost:8080${NC}"
    echo -e "   Nginx:    ${GREEN}http://localhost${NC}"
    echo ""
    echo -e "${BLUE}📊 View logs:${NC}"
    echo -e "   ${YELLOW}docker-compose logs -f${NC}"
    echo ""
    echo -e "${BLUE}🔧 Manage services:${NC}"
    echo -e "   Stop:    ${YELLOW}docker-compose down${NC}"
    echo -e "   Restart: ${YELLOW}docker-compose restart${NC}"
    echo -e "   Rebuild: ${YELLOW}docker-compose up -d --build${NC}"
    echo ""
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}   ❌ Deployment failed!${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Check logs with: ${NC}docker-compose logs"
    exit 1
fi
