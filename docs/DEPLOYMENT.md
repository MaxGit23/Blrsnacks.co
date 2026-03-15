# Blrsnacks.co — Deployment Guide

## Architecture Overview

```
┌──────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Vercel (CDN)   │────▶│  NestJS API      │────▶│  MySQL 8.0  │
│   Next.js SSR    │     │  Docker / VPS     │     │  Managed DB │
│   Frontend       │     │  Port 3001        │     │  Port 3306  │
└──────────────────┘     └──────────────────┘     └─────────────┘
```

---

## Option A: Docker Compose (VPS / Single Server)

Best for: Small to medium traffic, single-server deployments.

### Prerequisites
- Ubuntu 22.04+ or similar Linux server
- Docker Engine 24+ and Docker Compose v2
- Domain with DNS pointing to your server
- SSL certificate (use Caddy or Certbot)

### Step-by-step

```bash
# 1. Clone the repository
git clone https://github.com/your-org/Blrsnacks.co.git
cd Blrsnacks.co

# 2. Create environment file
cp .env.example .env
nano .env  # Fill in all values — see .env.example for documentation

# 3. Generate secure secrets
openssl rand -base64 64  # Use for JWT_SECRET
openssl rand -base64 64  # Use for JWT_REFRESH_SECRET
openssl rand -base64 32  # Use for MYSQL_PASSWORD and MYSQL_ROOT_PASSWORD

# 4. Run database migrations
docker compose --profile migrate up migrate

# 5. Start all services
docker compose up -d

# 6. Verify
docker compose ps
curl http://localhost:3001/api/v1/health
```

### Reverse Proxy (Caddy — recommended)

```bash
# Install Caddy
sudo apt install -y caddy

# /etc/caddy/Caddyfile
cat > /etc/caddy/Caddyfile << 'EOF'
api.blrsnacks.co {
    reverse_proxy localhost:3001
    encode gzip
}
EOF

sudo systemctl reload caddy
```

### Updating

```bash
git pull origin main
docker compose build api
docker compose --profile migrate up migrate
docker compose up -d api
```

---

## Option B: Vercel (Frontend) + Docker (Backend)

Best for: Maximum frontend performance with CDN edge caching.

### Frontend → Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd frontend
vercel

# 3. Set environment variables in Vercel dashboard:
#    NEXT_PUBLIC_API_URL = https://api.blrsnacks.co/api/v1
#    NEXT_PUBLIC_SITE_URL = https://blrsnacks.co
```

**Vercel settings:**
- Framework: Next.js (auto-detected)
- Build command: `npm run build`
- Output directory: `.next`
- Node.js version: 20.x

### Backend → Docker on VPS

Follow Option A steps 1–6 for the backend only. Use Caddy or Nginx to proxy `api.blrsnacks.co` → `localhost:3001`.

---

## Option C: Cloud-Managed (AWS / GCP / Azure)

Best for: High availability, auto-scaling.

### AWS Architecture

| Component | AWS Service |
|-----------|-------------|
| Frontend | Vercel or AWS Amplify |
| Backend API | ECS Fargate or EC2 |
| Database | RDS MySQL 8.0 |
| File Storage | S3 + CloudFront CDN |
| Secrets | AWS Secrets Manager |
| Monitoring | CloudWatch |

### Setup Notes

1. **RDS MySQL**: Create an instance, update `DATABASE_URL` to point to RDS endpoint
2. **ECS Fargate**: Push Docker image to ECR, create task definition and service
3. **Application Load Balancer**: Route `api.blrsnacks.co` to Fargate service
4. **S3**: Upload product images to S3, update `getImageUrl()` to point to CloudFront

---

## Database Migrations

Always run migrations before starting the application:

```bash
# Docker Compose
docker compose --profile migrate up migrate

# Manual (if not using Docker)
cd backend
npx prisma migrate deploy
```

**Never** run `prisma migrate dev` in production — it drops and recreates tables.

---

## SSL Certificates

### With Caddy (recommended)
Caddy automatically provisions Let's Encrypt certificates.

### With Certbot (Nginx)
```bash
sudo certbot --nginx -d api.blrsnacks.co
```

---

## Monitoring & Logs

```bash
# View real-time logs
docker compose logs -f api

# View last 100 lines
docker compose logs --tail=100 api

# Check health
curl -s http://localhost:3001/api/v1/health | jq
```

---

## Backup Strategy

```bash
# MySQL backup (run via cron daily)
docker exec blrsnacks-db mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" blrsnacks > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i blrsnacks-db mysql -u root -p"$MYSQL_ROOT_PASSWORD" blrsnacks < backup_20260226.sql
```

---

## Rollback

```bash
# Revert to previous image
docker compose down api
docker compose up -d api --no-build  # Uses last built image

# Or pull a specific tag
docker compose build api --build-arg VERSION=1.2.3
docker compose up -d api
```
