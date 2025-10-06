#!/bin/bash
#
# Mythofy Mail - Initial Setup Script
# Run this ONCE on a fresh server
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   Mythofy Mail - Initial Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if running as root (for system-wide installs)
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}⚠ Running as root. This is okay for initial setup.${NC}"
    echo ""
fi

# 1. Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh

    # Add current user to docker group
    if [ "$EUID" -ne 0 ]; then
        sudo usermod -aG docker $USER
        echo -e "${YELLOW}⚠ You've been added to the docker group. Please log out and back in.${NC}"
    fi

    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# 2. Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

# 3. Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp .env.example .env

    # Generate JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/g" .env

    echo -e "${GREEN}✓ .env file created with generated JWT secret${NC}"
    echo -e "${YELLOW}⚠ You still need to add your Mailcow API key to .env${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# 4. Create necessary directories
echo -e "${YELLOW}📁 Creating directories...${NC}"
mkdir -p nginx/ssl
mkdir -p backend/migrations
echo -e "${GREEN}✓ Directories created${NC}"

# 5. Set permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
chmod +x deploy.sh
chmod +x setup.sh
echo -e "${GREEN}✓ Permissions set${NC}"

# 6. Pull base images
echo -e "${YELLOW}🐳 Pulling Docker base images...${NC}"
docker pull node:20-alpine
docker pull rust:1.75
docker pull redis:7-alpine
docker pull mysql:8.0
docker pull nginx:alpine
echo -e "${GREEN}✓ Base images pulled${NC}"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✅ Setup complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo ""
echo -e "1. ${YELLOW}Edit .env file:${NC}"
echo -e "   nano .env"
echo -e "   ${BLUE}# Add your Mailcow API key${NC}"
echo ""
echo -e "2. ${YELLOW}Deploy the application:${NC}"
echo -e "   ./deploy.sh"
echo ""
echo -e "3. ${YELLOW}Access the application:${NC}"
echo -e "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo -e "   README.md - Overview and features"
echo -e "   SETUP.md - Detailed setup guide"
echo -e "   HTML-AND-AVATAR-FEATURES.md - Avatar & HTML email features"
echo ""
