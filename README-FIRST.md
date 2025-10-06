# 🎉 Mythofy Mail - START HERE

## What Is This?

**Mythofy Mail** is a custom webmail client that replaces SoGo while using your Mailcow backend. It's a modern, sleek Gmail-style interface with Mythofy branding.

### ✨ Key Features
- 🎨 **Dark theme** with Mythofy Gold accents
- 📧 **HTML emails** with secure rendering
- 🏢 **Company logos** (BIMI protocol)
- 👤 **Gravatars** or initials fallback
- 🔐 **Secure** with JWT + IMAP auth
- ⚡ **Fast** with Redis caching
- 🐳 **Docker** ready for easy deployment

---

## 🚀 Quick Start (Choose Your Path)

### Path 1: Just Want to See It Run?
👉 [QUICKSTART.md](QUICKSTART.md) - 5 minutes to deployed

### Path 2: Want to Deploy to Production?
👉 [DEPLOYMENT.md](DEPLOYMENT.md) - Full production setup

### Path 3: Want to Develop with Claude Code?
👉 [TRANSFER-TO-DEDI.md](TRANSFER-TO-DEDI.md) - Setup on dedicated server

### Path 4: Want to Understand Everything?
👉 [INDEX.md](INDEX.md) - Complete documentation index

---

## 📦 What's Included

```
mythofy-mail/
├── 📱 Frontend (Next.js)
│   ├── Modern UI with Tailwind
│   ├── HTML email rendering
│   ├── Smart avatars (BIMI/Gravatar)
│   └── Real-time updates
│
├── 🔧 Backend (Rust)
│   ├── IMAP/SMTP integration
│   ├── Mailcow API client
│   ├── JWT authentication
│   └── BIMI DNS lookup
│
├── 🐳 Docker Setup
│   ├── Frontend container
│   ├── Backend container
│   ├── Redis for caching
│   ├── MySQL for data
│   └── Nginx reverse proxy
│
└── 📚 Documentation
    ├── README-FIRST.md (this file)
    ├── QUICKSTART.md
    ├── DEPLOYMENT.md
    ├── SETUP.md
    └── INDEX.md
```

---

## 🎯 One-Command Deploy

On your server:
```bash
./setup.sh && nano .env && ./deploy.sh
```

Or with Make:
```bash
make setup && nano .env && make deploy
```

---

## 📚 Documentation Map

| **If you want to...** | **Read this** |
|----------------------|---------------|
| Deploy in 5 minutes | [QUICKSTART.md](QUICKSTART.md) |
| Production deployment | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Transfer to dedi server | [TRANSFER-TO-DEDI.md](TRANSFER-TO-DEDI.md) |
| Detailed setup steps | [SETUP.md](SETUP.md) |
| Understand features | [README.md](README.md) |
| HTML/Avatar features | [HTML-AND-AVATAR-FEATURES.md](HTML-AND-AVATAR-FEATURES.md) |
| Find any doc | [INDEX.md](INDEX.md) |

---

## ⚡ Super Quick Commands

### First Time Setup
```bash
chmod +x setup.sh deploy.sh
./setup.sh              # Installs Docker, creates .env
nano .env               # Add your MAILCOW_API_KEY
./deploy.sh            # Deploy!
```

### Using Makefile (Easier!)
```bash
make setup             # One-time setup
make deploy            # Deploy all services
make logs              # View logs
make restart           # Restart
make status            # Check status
make help              # See all commands
```

---

## 🔑 What You Need

1. **Mailcow API Key** (get from Mailcow admin panel)
2. **Server with Docker** (setup.sh installs it)
3. **5 minutes** ⏰

That's it!

---

## 🌐 Access Points

After deployment:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Nginx:** http://localhost
- **Health Check:** http://localhost:8080/api/health

---

## 🛠️ For Claude Code Development

### On Dedicated Server:

1. **Transfer project:**
   ```bash
   cd /opt
   git clone <repo> mythofy-mail
   cd mythofy-mail
   ```

2. **Setup for development:**
   ```bash
   make setup
   cd frontend && npm install
   cd ../backend && cargo build
   ```

3. **Make changes and deploy:**
   ```bash
   # Edit files with Claude Code
   make deploy      # Test changes
   make logs        # View output
   ```

4. **Quick commands:**
   ```bash
   make dev         # Dev servers
   make logs        # All logs
   make restart     # Restart services
   make clean       # Clean rebuild
   ```

---

## 🎨 Stack Overview

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | Next.js 14 + TypeScript | Modern UI |
| Styling | Tailwind CSS | Mythofy theme |
| Backend | Rust (Axum) | Fast API |
| Auth | JWT + IMAP | Secure login |
| Cache | Redis | Speed |
| Database | MySQL | User data |
| Proxy | Nginx | Routing |
| Email | Mailcow | Mail server |

---

## 🔐 Security Features

- ✅ HTML email sanitization (DOMPurify)
- ✅ XSS protection (no scripts in emails)
- ✅ JWT token authentication
- ✅ IMAP credential verification
- ✅ BIMI domain verification (DNS)
- ✅ Secure HTTPS (with SSL setup)

---

## 📊 Current Status

### ✅ Working Now
- Modern inbox UI
- HTML email rendering
- Company logos (BIMI)
- Gravatar avatars
- Email reading
- Docker deployment
- Mailcow integration

### 🔜 Coming Soon
- Email sending (SMTP)
- Rich text composer
- Drag & drop attachments
- PGP encryption
- Mobile app
- Push notifications

---

## 🚨 Important Notes

### This Replaces SoGo Web UI Only
- ✅ Mailcow keeps running (email server)
- ✅ IMAP/SMTP still work
- ✅ All emails stay in Mailcow
- ❌ SoGo web interface replaced with Mythofy Mail

### You Can Disable SoGo
```bash
# In Mailcow directory
nano docker-compose.override.yml
```
```yaml
sogo-mailcow:
  entrypoint: ["/bin/true"]
```

---

## 🆘 Need Help?

1. **Start here:** [QUICKSTART.md](QUICKSTART.md)
2. **Check logs:** `make logs`
3. **View status:** `make status`
4. **See all docs:** [INDEX.md](INDEX.md)

### Common Issues

**Services won't start?**
```bash
make logs  # Check what's wrong
```

**Need to restart?**
```bash
make restart
```

**Complete reset?**
```bash
make clean && make deploy
```

---

## 📝 Next Steps

1. ✅ You're here - reading this!
2. 📖 Choose your path above
3. 🚀 Deploy the app
4. 🎨 Customize and enjoy!

---

## 🔗 Quick Links

- [📋 QUICKSTART.md](QUICKSTART.md) - Deploy in 5 minutes
- [🚀 DEPLOYMENT.md](DEPLOYMENT.md) - Production guide
- [📦 TRANSFER-TO-DEDI.md](TRANSFER-TO-DEDI.md) - Dedi server setup
- [📚 INDEX.md](INDEX.md) - All documentation
- [📖 README.md](README.md) - Full overview

---

**Ready to start?** Pick a path above and go! 🎯

**Mythofy Mail** - Clean. Secure. Mythical. ✨
