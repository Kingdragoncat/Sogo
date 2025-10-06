# Mythofy Mail

> **Clean. Secure. Mythical.**

A custom webmail inbox UI for Mythofy Mail, replacing SoGo entirely while using Mailcow backend and APIs. This is a modern, sleek email client built with Next.js and Rust, designed for staff email and potential expansion into a public email hosting product.

![Mythofy Mail](https://img.shields.io/badge/Status-Development-gold)

## 🎨 Features

- **Modern UI**: Gmail-grade interface with Mythofy branding
- **Dark Theme**: Base color `#0e0e10` with Mythofy Gold accents (`#be8f23`)
- **Full Email Functionality**: Read, send, delete, star, and manage emails
- **Real-time Updates**: WebSocket support for instant notifications
- **Secure**: JWT authentication integrated with Mailcow
- **Fast**: Rust backend with Redis caching
- **Scalable**: Docker-based deployment with reverse proxy

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom Mythofy theme
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React

### Backend
- **Language**: Rust
- **Framework**: Axum (async web framework)
- **Authentication**: JWT with IMAP verification
- **Caching**: Redis for folder listings and unread counts
- **Storage**: MySQL for user metadata

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx with SSL/TLS
- **Mail Integration**: Mailcow API + IMAP/SMTP

## 📦 Project Structure

```
mythofy-mail/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   ├── lib/             # API client and utilities
│   │   └── store/           # Zustand state management
│   ├── Dockerfile
│   └── package.json
├── backend/                  # Rust backend
│   ├── src/
│   │   ├── handlers/        # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── mailcow/         # Mailcow API integration
│   │   ├── models.rs        # Data models
│   │   ├── config.rs        # Configuration
│   │   └── main.rs          # Entry point
│   ├── migrations/          # Database migrations
│   ├── Dockerfile
│   └── Cargo.toml
├── nginx/                    # Nginx configuration
│   └── nginx.conf
├── docker-compose.yml        # Docker orchestration
├── .env.example             # Environment template
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Rust 1.75+ (for local development)
- Access to a Mailcow instance

### 1. Clone and Configure

```bash
# Navigate to the project directory
cd mythofy-mail

# Copy environment files
cp .env.example .env
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env

# Edit .env with your Mailcow credentials
nano .env
```

### 2. Configure Environment Variables

Edit `.env` and set the following:

```env
# Mailcow Configuration
MAILCOW_API_URL=https://mail.mythofy.net
MAILCOW_API_KEY=your-actual-mailcow-api-key

# IMAP/SMTP Configuration
IMAP_HOST=mail.mythofy.net
IMAP_PORT=993
SMTP_HOST=mail.mythofy.net
SMTP_PORT=587

# JWT Secret (IMPORTANT: Change in production!)
JWT_SECRET=generate-a-strong-random-secret-here
```

### 3. Start with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Nginx (production): http://localhost

### 4. Initial Setup

```bash
# Create database tables
docker-compose exec mysql mysql -u mailuser -pmailpass mythofy_mail < backend/migrations/001_init.sql
```

## 🛠️ Development

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend Development

```bash
cd backend

# Install dependencies
cargo build

# Run development server
cargo run

# Build for production
cargo build --release
```

## 🔐 Authentication

The application uses JWT tokens with Mailcow IMAP authentication:

1. User submits email and password
2. Backend validates credentials via IMAP
3. JWT token is generated and returned
4. Token is used for all subsequent API requests

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout (invalidate token)

### Emails
- `GET /api/emails/:folder` - List emails in folder
- `DELETE /api/emails/:id` - Delete email
- `PATCH /api/emails/:id/read` - Mark as read/unread
- `PATCH /api/emails/:id/star` - Star/unstar email
- `POST /api/emails/send` - Send new email
- `GET /api/emails/search?q=query` - Search emails

### Health
- `GET /api/health` - Health check

## 🎨 Customization

### Colors

The theme uses Mythofy brand colors defined in [tailwind.config.ts](frontend/tailwind.config.ts):

```typescript
colors: {
  primary: "#be8f23",           // Mythofy Gold
  "mythofy-gold": "#be8f23",
  "background-dark": "#0e0e10",  // Dark background
}
```

### Fonts

The application uses **Inter** font family loaded from Google Fonts.

## 🔧 Configuration

### Mailcow Integration

To get your Mailcow API key:

1. Login to Mailcow admin panel
2. Go to **System** → **API**
3. Create a new API key with appropriate permissions
4. Copy the key to your `.env` file

### SSL/TLS Configuration

For production, place your SSL certificates in `nginx/ssl/`:

```
nginx/ssl/
├── cert.pem
└── key.pem
```

Update `nginx/nginx.conf` with your domain name.

## 📊 Performance

- **Redis Caching**: Folder listings and unread counts cached for 60 seconds
- **Connection Pooling**: MySQL and Redis use connection pools
- **Optimized Builds**: Production builds use LTO and optimizations

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Backend won't compile
```bash
cd backend
cargo clean
cargo build
```

### Can't connect to Mailcow
- Verify IMAP/SMTP ports are open
- Check Mailcow API key permissions
- Test IMAP connection manually: `telnet mail.mythofy.net 993`

### Database connection issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d mysql
# Wait 30 seconds for MySQL to initialize
docker-compose up -d
```

## 🚢 Deployment

### Production Deployment

1. **Set up SSL certificates** in `nginx/ssl/`
2. **Update environment variables** with production values
3. **Change JWT_SECRET** to a strong random value
4. **Build and deploy**:

```bash
docker-compose -f docker-compose.yml up -d --build
```

5. **Set up automatic backups** for MySQL and Redis data
6. **Configure firewall** to allow ports 80, 443

### Updating

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## 📝 Todo / Roadmap

- [ ] Implement threaded conversation view
- [ ] Add rich text email composer (TipTap or similar)
- [ ] Drag and drop attachment uploads
- [ ] PGP encryption support
- [ ] Mobile responsive design improvements
- [ ] Push notifications
- [ ] Email templates
- [ ] Advanced search filters
- [ ] Folder management
- [ ] Contact management

## 🤝 Contributing

This is a private Mythofy project. For questions or issues, contact the development team.

## 📄 License

Proprietary - Copyright © 2025 Mythofy

## 🔗 Links

- [About Mythofy](https://mythofy.net/about)
- [Legal](https://mythofy.net/legal)
- [Mailcow Documentation](https://mailcow.github.io/mailcow-dockerized-docs/)

---

**Mythofy Mail** - Clean. Secure. Mythical. ✨
