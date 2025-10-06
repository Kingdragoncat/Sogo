# Mythofy Mail - Detailed Setup Guide

This guide provides step-by-step instructions for setting up Mythofy Mail from scratch.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Initial Setup](#initial-setup)
3. [Mailcow Configuration](#mailcow-configuration)
4. [SSL/TLS Certificates](#ssltls-certificates)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [Running the Application](#running-the-application)
8. [Verification](#verification)
9. [Production Deployment](#production-deployment)

## System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Linux (Ubuntu 22.04+ recommended)

### Software Requirements
- Docker 24.0+
- Docker Compose 2.20+
- Git

### For Local Development
- Node.js 20+
- Rust 1.75+

## Initial Setup

### 1. Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 2. Clone Repository

```bash
# Navigate to your projects directory
cd /opt

# Clone (or create) the mythofy-mail directory
mkdir -p mythofy-mail
cd mythofy-mail
```

## Mailcow Configuration

### 1. Access Mailcow Admin

1. Login to your Mailcow instance at `https://mail.mythofy.net`
2. Use admin credentials

### 2. Create API Key

1. Navigate to **System** → **API**
2. Click **Add API Key**
3. Set permissions:
   - ✅ Read mailboxes
   - ✅ Read domains
   - ✅ Read aliases
4. Copy the generated API key
5. Save it securely (you'll need it for `.env`)

### 3. Verify IMAP/SMTP Settings

Check your Mailcow configuration:

```bash
# IMAP
Host: mail.mythofy.net
Port: 993 (SSL/TLS)

# SMTP
Host: mail.mythofy.net
Port: 587 (STARTTLS)
```

## SSL/TLS Certificates

### Option 1: Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt install certbot -y

# Generate certificate
sudo certbot certonly --standalone -d mail.mythofy.net

# Copy to nginx directory
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/mail.mythofy.net/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/mail.mythofy.net/privkey.pem nginx/ssl/key.pem
sudo chmod 644 nginx/ssl/*.pem
```

### Option 2: Self-Signed (Development Only)

```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/CN=mail.mythofy.net"
```

## Environment Configuration

### 1. Create Environment Files

```bash
# Root .env
cp .env.example .env

# Frontend .env
cp frontend/.env.local.example frontend/.env.local

# Backend .env
cp backend/.env.example backend/.env
```

### 2. Configure Root `.env`

```bash
nano .env
```

Set these values:

```env
# Mailcow Configuration
MAILCOW_API_URL=https://mail.mythofy.net
MAILCOW_API_KEY=paste-your-api-key-here

# IMAP Configuration
IMAP_HOST=mail.mythofy.net
IMAP_PORT=993

# SMTP Configuration
SMTP_HOST=mail.mythofy.net
SMTP_PORT=587

# Redis Configuration
REDIS_URL=redis://redis:6379

# MySQL Configuration
DATABASE_URL=mysql://mailuser:mailpass@mysql:3306/mythofy_mail

# JWT Secret - GENERATE A STRONG RANDOM VALUE
JWT_SECRET=$(openssl rand -base64 32)
```

### 3. Generate Strong JWT Secret

```bash
# Generate random secret
openssl rand -base64 32

# Add to .env
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
```

### 4. Configure Frontend

```bash
nano frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For production:
```env
NEXT_PUBLIC_API_URL=https://mail.mythofy.net/api
```

## Database Setup

### 1. Start MySQL Container

```bash
docker-compose up -d mysql
```

### 2. Wait for Initialization

```bash
# Wait 30 seconds for MySQL to fully start
sleep 30

# Check logs
docker-compose logs mysql
```

### 3. Verify Database

```bash
docker-compose exec mysql mysql -u mailuser -pmailpass -e "SHOW DATABASES;"
```

You should see `mythofy_mail` in the list.

### 4. Run Migrations

```bash
docker-compose exec mysql mysql -u mailuser -pmailpass mythofy_mail < backend/migrations/001_init.sql
```

## Running the Application

### Development Mode

#### Frontend Only
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:3000
```

#### Backend Only
```bash
cd backend
cargo run
# API at http://localhost:8080
```

### Production Mode (Docker)

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

## Verification

### 1. Health Check

```bash
# Check backend health
curl http://localhost:8080/api/health

# Should return: {"status":"healthy"}
```

### 2. Test Frontend

Open browser to `http://localhost:3000`

You should see the Mythofy Mail login screen.

### 3. Test Login

1. Navigate to the frontend
2. Enter your Mailcow email and password
3. Click Login
4. You should be redirected to the inbox

### 4. Check Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx
```

## Production Deployment

### 1. Update nginx Configuration

```bash
nano nginx/nginx.conf
```

Change `server_name` to your domain:
```nginx
server_name mail.mythofy.net;
```

### 2. Update Frontend Environment

```bash
nano frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=https://mail.mythofy.net
```

### 3. Rebuild for Production

```bash
docker-compose down
docker-compose up -d --build
```

### 4. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

### 5. Set Up Automatic Restart

```bash
# Add to crontab
crontab -e

# Add this line to restart daily at 3 AM
0 3 * * * cd /opt/mythofy-mail && docker-compose restart
```

### 6. Configure Backups

```bash
# Create backup script
nano backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/mythofy-mail"

mkdir -p $BACKUP_DIR

# Backup MySQL
docker-compose exec -T mysql mysqldump -u mailuser -pmailpass mythofy_mail > $BACKUP_DIR/db_$DATE.sql

# Backup Redis
docker-compose exec -T redis redis-cli SAVE
docker cp mythofy-mail-redis-1:/data/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
# Make executable
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
0 2 * * * /opt/mythofy-mail/backup.sh
```

## Troubleshooting

### Logs Not Showing

```bash
docker-compose logs --tail=100 -f backend
```

### Permission Denied

```bash
sudo chown -R $USER:$USER .
```

### Port Already in Use

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### Database Connection Failed

```bash
# Reset database
docker-compose down mysql
docker volume rm mythofy-mail_mysql-data
docker-compose up -d mysql
sleep 30
docker-compose exec mysql mysql -u mailuser -pmailpass mythofy_mail < backend/migrations/001_init.sql
```

## Next Steps

1. **Test all features**: Send, receive, delete, star emails
2. **Configure DNS**: Point `mail.mythofy.net` to your server
3. **Monitor logs**: Set up log aggregation (e.g., ELK stack)
4. **Set up monitoring**: Use Prometheus + Grafana
5. **Configure backups**: Automate and test restore process

## Support

For issues or questions, contact the Mythofy development team.

---

✨ **Mythofy Mail** - Clean. Secure. Mythical.
