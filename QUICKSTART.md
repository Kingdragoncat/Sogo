# Mythofy Mail - Quick Start 🚀

## One-Line Deploy (Dedicated Server)

```bash
git clone <repo> mythofy-mail && cd mythofy-mail && chmod +x setup.sh deploy.sh && ./setup.sh && nano .env && ./deploy.sh
```

---

## Step-by-Step (5 Minutes)

### 1. Get the Code
```bash
cd /opt
git clone <your-repo> mythofy-mail
cd mythofy-mail
```

### 2. Run Setup
```bash
chmod +x setup.sh deploy.sh
./setup.sh
```

### 3. Add Your Mailcow API Key
```bash
nano .env
```

Change this line:
```env
MAILCOW_API_KEY=your-actual-api-key-here
```

Save and exit (Ctrl+X, Y, Enter)

### 4. Deploy
```bash
./deploy.sh
```

### 5. Access
Open browser: **http://your-server-ip:3000**

---

## Using Makefile (Even Easier!)

```bash
make setup          # Initial setup
make deploy         # Deploy
make logs           # View logs
make restart        # Restart
make status         # Check status
```

---

## For Claude Code Development

### On Dedi Server:
```bash
# Clone project
cd /opt
git clone <repo> mythofy-mail
cd mythofy-mail

# Install dependencies
cd frontend && npm install
cd ../backend && cargo build
cd ..

# Make changes with Claude Code
# Then deploy to test:
make deploy
```

### Quick Commands:
```bash
make dev            # Start dev servers
make logs-backend   # Backend logs
make logs-frontend  # Frontend logs
make clean          # Clean everything
make update         # Git pull + rebuild
```

---

## Environment Variables Quick Reference

**Required:**
- `MAILCOW_API_KEY` - Get from Mailcow admin
- `JWT_SECRET` - Auto-generated

**Optional (has defaults):**
- `MAILCOW_API_URL` - Default: https://mail.mythofy.net
- `IMAP_HOST` - Default: mail.mythofy.net
- `SMTP_HOST` - Default: mail.mythofy.net

---

## Troubleshooting

**Service won't start?**
```bash
make logs
```

**Need to restart?**
```bash
make restart
```

**Complete reset?**
```bash
make clean
make deploy
```

---

## URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Nginx:** http://localhost
- **Health Check:** http://localhost:8080/api/health

---

## Next Steps

1. ✅ Setup complete
2. 📧 Connect to Mailcow
3. 🎨 Customize branding
4. 🚀 Deploy to production

See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup with SSL/TLS.

---

**That's it! You're running Mythofy Mail!** ✨
