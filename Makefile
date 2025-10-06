# Mythofy Mail - Makefile for easy commands

.PHONY: help setup deploy start stop restart logs clean build dev test

# Default target
help:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "   Mythofy Mail - Available Commands"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "  make setup       - Initial setup (run once)"
	@echo "  make deploy      - Deploy all services"
	@echo "  make start       - Start all services"
	@echo "  make stop        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - View all logs"
	@echo "  make clean       - Clean up containers and volumes"
	@echo "  make build       - Rebuild all images"
	@echo "  make dev         - Start development servers"
	@echo ""
	@echo "  Service-specific:"
	@echo "  make logs-backend   - View backend logs"
	@echo "  make logs-frontend  - View frontend logs"
	@echo "  make shell-backend  - Shell into backend container"
	@echo "  make shell-frontend - Shell into frontend container"
	@echo ""

# Initial setup
setup:
	@./setup.sh

# Deploy all services
deploy:
	@./deploy.sh

# Start services
start:
	@docker-compose up -d

# Stop services
stop:
	@docker-compose down

# Restart services
restart:
	@docker-compose restart

# View logs
logs:
	@docker-compose logs -f

# View backend logs
logs-backend:
	@docker-compose logs -f backend

# View frontend logs
logs-frontend:
	@docker-compose logs -f frontend

# Clean up
clean:
	@docker-compose down -v
	@docker system prune -f

# Build images
build:
	@docker-compose build --no-cache

# Development mode (frontend)
dev:
	@echo "Starting development servers..."
	@cd frontend && npm run dev

# Shell into backend
shell-backend:
	@docker-compose exec backend sh

# Shell into frontend
shell-frontend:
	@docker-compose exec frontend sh

# Check status
status:
	@docker-compose ps

# Health check
health:
	@echo "Backend health:"
	@curl -s http://localhost:8080/api/health | jq . || echo "Backend not responding"
	@echo ""
	@echo "Frontend status:"
	@curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "Frontend not responding"

# Backup database
backup:
	@mkdir -p backups
	@docker-compose exec -T mysql mysqldump -u mailuser -pmailpass mythofy_mail > backups/backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "Backup created in backups/"

# Restore database (usage: make restore FILE=backup.sql)
restore:
	@docker-compose exec -T mysql mysql -u mailuser -pmailpass mythofy_mail < $(FILE)
	@echo "Database restored from $(FILE)"

# Update and rebuild
update:
	@git pull
	@docker-compose down
	@docker-compose build --no-cache
	@docker-compose up -d
	@echo "Update complete!"
