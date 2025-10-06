# Mythofy Mail - Documentation Index 📚

Welcome to Mythofy Mail! This index will help you find what you need quickly.

---

## 🚀 Getting Started

### New to Mythofy Mail?
1. **[QUICKSTART.md](QUICKSTART.md)** - ⚡ 5-minute setup guide
2. **[README.md](README.md)** - 📖 Overview, features, and architecture
3. **[SETUP.md](SETUP.md)** - 🔧 Detailed setup instructions

---

## 📦 Deployment

### Deploy to Server
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
  - Docker setup
  - Production deployment
  - SSL/TLS configuration
  - Monitoring & troubleshooting

### Quick Commands
```bash
# Setup (run once)
./setup.sh

# Deploy
./deploy.sh

# Or use Makefile
make setup
make deploy
make logs
```

---

## ✨ Features

### Email Features
- **[HTML-AND-AVATAR-FEATURES.md](HTML-AND-AVATAR-FEATURES.md)**
  - HTML email rendering (secure with DOMPurify)
  - BIMI support (verified company logos)
  - Gravatar integration
  - Avatar fallbacks

### Current Features
- ✅ Modern Gmail-like UI
- ✅ Dark theme with Mythofy Gold branding
- ✅ HTML email support
- ✅ Company logos (BIMI)
- ✅ Gravatar avatars
- ✅ Full IMAP/SMTP integration
- ✅ Mailcow backend
- ✅ JWT authentication
- ✅ Redis caching
- ✅ MySQL storage

---

## 🏗️ Architecture

### Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Rust (Axum) + IMAP/SMTP
- **Cache:** Redis
- **Database:** MySQL
- **Proxy:** Nginx
- **Mail:** Mailcow integration

### Key Files
```
mythofy-mail/
├── frontend/              # Next.js app
│   ├── src/
│   │   ├── app/          # Pages & layouts
│   │   ├── components/   # React components
│   │   ├── lib/          # API client, utilities
│   │   └── store/        # State management
│   └── Dockerfile
├── backend/              # Rust API
│   ├── src/
│   │   ├── handlers/     # API routes
│   │   ├── services/     # Business logic
│   │   └── mailcow/      # Mailcow integration
│   └── Dockerfile
├── nginx/                # Reverse proxy
├── docker-compose.yml    # Container orchestration
├── .env                  # Configuration
├── setup.sh             # Initial setup
└── deploy.sh            # Deployment
```

---

## 🛠️ Development

### For Claude Code on Dedi Server

1. **Clone & Setup**
   ```bash
   cd /opt
   git clone <repo> mythofy-mail
   cd mythofy-mail
   make setup
   ```

2. **Install Dev Dependencies**
   ```bash
   cd frontend && npm install
   cd ../backend && cargo build
   ```

3. **Make Changes**
   - Edit files with Claude Code
   - Test: `make deploy`
   - Check logs: `make logs`

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "Feature: ..."
   git push
   ```

### Development Workflow
```bash
# Start dev servers
make dev

# View logs
make logs-backend
make logs-frontend

# Restart after changes
make restart

# Clean rebuild
make clean && make build
```

---

## 📡 API Reference

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Emails
- `GET /api/emails/:folder` - List emails
- `DELETE /api/emails/:id` - Delete
- `PATCH /api/emails/:id/read` - Mark read
- `PATCH /api/emails/:id/star` - Star
- `POST /api/emails/send` - Send email
- `GET /api/emails/search` - Search

### BIMI (Avatars)
- `GET /api/bimi/:domain` - Get company logo

### Health
- `GET /api/health` - Health check

---

## 🔐 Security

### Email Sanitization
- DOMPurify removes XSS vectors
- No JavaScript execution in emails
- Safe HTML tags only
- URL validation

### Authentication
- JWT tokens with IMAP verification
- Secure password handling
- Token expiration (7 days)

### BIMI Verification
- DNS TXT record lookup
- Domain verification required
- DMARC/SPF checks

---

## 📊 Monitoring

### Health Checks
```bash
# Check all services
docker-compose ps

# Backend health
curl http://localhost:8080/api/health

# View metrics
docker stats
```

### Logs
```bash
# All logs
make logs

# Specific service
make logs-backend
make logs-frontend

# Errors only
docker-compose logs | grep ERROR
```

---

## 🐛 Troubleshooting

### Common Issues

**Service won't start**
```bash
make logs
# Check for missing env vars or port conflicts
```

**Database connection failed**
```bash
make restart mysql
# Wait 30 seconds
```

**Frontend build errors**
```bash
cd frontend
rm -rf .next node_modules
npm install
cd .. && make build
```

**Backend compilation errors**
```bash
cd backend
cargo clean
cd .. && make build
```

### Quick Fixes
```bash
# Complete reset
make clean
make deploy

# Update and rebuild
make update

# Check status
make status
make health
```

---

## 🎨 Customization

### Branding
- Colors: [frontend/tailwind.config.ts](frontend/tailwind.config.ts)
  - Primary: `#be8f23` (Mythofy Gold)
  - Background: `#0e0e10` (Dark)
- Fonts: Inter (Google Fonts)
- Logo: Replace in components

### Email Styling
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- `.email-content` class for HTML emails

---

## 📝 Configuration

### Environment Variables

**Required:**
```env
MAILCOW_API_KEY=your-api-key
JWT_SECRET=auto-generated
```

**Optional (has defaults):**
```env
MAILCOW_API_URL=https://mail.mythofy.net
IMAP_HOST=mail.mythofy.net
IMAP_PORT=993
SMTP_HOST=mail.mythofy.net
SMTP_PORT=587
REDIS_URL=redis://redis:6379
DATABASE_URL=mysql://...
```

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| [README.md](README.md) | Project overview, features, quick start |
| [QUICKSTART.md](QUICKSTART.md) | ⚡ 5-minute setup guide |
| [SETUP.md](SETUP.md) | Detailed setup instructions |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide |
| [HTML-AND-AVATAR-FEATURES.md](HTML-AND-AVATAR-FEATURES.md) | Avatar & HTML email features |
| [INDEX.md](INDEX.md) | This file - documentation index |

---

## 🔗 Quick Links

### Scripts
- [setup.sh](setup.sh) - Initial setup
- [deploy.sh](deploy.sh) - Deployment
- [Makefile](Makefile) - Quick commands

### Configuration
- [.env.example](.env.example) - Environment template
- [docker-compose.yml](docker-compose.yml) - Container config
- [nginx/nginx.conf](nginx/nginx.conf) - Reverse proxy

### Code
- [frontend/src/](frontend/src/) - Frontend code
- [backend/src/](backend/src/) - Backend code

---

## 🆘 Getting Help

### Check These First:
1. Logs: `make logs`
2. Status: `make status`
3. Health: `make health`
4. Docs: This index!

### Debug Commands:
```bash
# View all container status
docker-compose ps

# Check specific service health
docker inspect mythofy-mail-backend | grep Health

# Test backend directly
curl http://localhost:8080/api/health

# View environment
cat .env

# Check ports
netstat -tulpn | grep -E '3000|8080|80|443'
```

---

## 🎯 Roadmap

### Planned Features
- [ ] Threaded conversations
- [ ] Rich text composer (TipTap)
- [ ] Drag & drop attachments
- [ ] PGP encryption
- [ ] Push notifications
- [ ] Email templates
- [ ] Advanced search
- [ ] Folder management
- [ ] Contact management
- [ ] Mobile app

---

## 📄 License

Proprietary - Copyright © 2025 Mythofy

---

## 🔗 External Resources

- [Mailcow Docs](https://mailcow.github.io/mailcow-dockerized-docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [Rust Axum](https://docs.rs/axum)
- [Docker Docs](https://docs.docker.com/)
- [BIMI Spec](https://bimigroup.org/)

---

**Need help?** Start with [QUICKSTART.md](QUICKSTART.md) or check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides.

**Mythofy Mail** - Clean. Secure. Mythical. ✨
