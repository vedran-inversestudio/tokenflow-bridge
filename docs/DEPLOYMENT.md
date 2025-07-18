# 🚀 Deployment Guide

Complete deployment instructions for the Tokenflow Bridge system across different platforms.

## 🎯 Deployment Options

- **Local Development**: Run on your local machine
- **Vercel**: Serverless deployment with automatic scaling
- **Netlify**: Static site hosting with serverless functions
- **Railway**: Container-based deployment
- **Heroku**: Traditional hosting platform
- **Docker**: Containerized deployment

## 🏠 Local Development

### Prerequisites

```bash
# Install Node.js 18+
node --version

# Install Git
git --version

# Install PM2 (optional, for process management)
npm install -g pm2
```

### Setup

```bash
# Clone repository
git clone <your-repo-url>
cd tokenflow-bridge

# Install dependencies
cd bridge && npm install
cd ../mcp-server && npm install
cd ..

# Start development servers
./start-tokenflow-bridge.sh
```

### Environment Configuration

Create `.env` files:

```bash
# bridge/.env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
AUTH_KEY=your-dev-key

# mcp-server/.env
BRIDGE_URL=http://localhost:4000
CONNECTION_KEY=your-dev-key
PROJECT_ID=development
```

## ☁️ Vercel Deployment

### 1. Prepare for Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

### 2. Configure Bridge Server

Create `bridge/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 3. Deploy Bridge Server

```bash
cd bridge

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add AUTH_KEY
vercel env add CORS_ORIGIN
```

### 4. Configure MCP Server

Update MCP server configuration:

```javascript
// mcp-server/server.js
const BRIDGE_URL = process.env.BRIDGE_URL || 'https://your-bridge.vercel.app';
```

### 5. Deploy MCP Server (Optional)

```bash
cd mcp-server

# Create vercel.json
echo '{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}' > vercel.json

# Deploy
vercel --prod
```

### 6. Update Plugin Configuration

In Figma plugin, update bridge URL:

```
Bridge URL: https://your-bridge.vercel.app
Project ID: production
Connection Key: your-production-key
```

## 🌐 Netlify Deployment

### 1. Prepare Bridge Server

Create `bridge/netlify.toml`:

```toml
[build]
  command = "npm install"
  publish = "public"
  functions = "functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server.js"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Create Serverless Function

Create `bridge/functions/server.js`:

```javascript
const serverless = require('serverless-http');
const app = require('../server.js');

exports.handler = serverless(app);
```

### 3. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd bridge
netlify deploy --prod

# Set environment variables
netlify env:set AUTH_KEY your-production-key
netlify env:set CORS_ORIGIN https://your-domain.com
```

## 🚂 Railway Deployment

### 1. Prepare for Railway

Create `railway.json` in root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd bridge && node server.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables
railway variables set AUTH_KEY=your-production-key
railway variables set CORS_ORIGIN=https://your-domain.com
```

## 🐳 Docker Deployment

### 1. Create Dockerfile

Create `Dockerfile` in root:

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY bridge/package*.json ./bridge/
COPY mcp-server/package*.json ./mcp-server/

# Install dependencies
RUN cd bridge && npm ci --only=production
RUN cd mcp-server && npm ci --only=production

# Copy source code
COPY bridge/ ./bridge/
COPY mcp-server/ ./mcp-server/

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built application
COPY --from=builder /app/bridge ./bridge
COPY --from=builder /app/mcp-server ./mcp-server

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start application
CMD ["node", "bridge/server.js"]
```

### 2. Create Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  tokenflow-bridge:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - AUTH_KEY=your-production-key
      - CORS_ORIGIN=https://your-domain.com
    volumes:
      - token-data:/app/data
    restart: unless-stopped

  mcp-server:
    build: .
    command: node mcp-server/server.js
    environment:
      - BRIDGE_URL=http://tokenflow-bridge:4000
      - CONNECTION_KEY=your-production-key
    depends_on:
      - tokenflow-bridge
    restart: unless-stopped

volumes:
  token-data:
```

### 3. Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🏗️ Heroku Deployment

### 1. Prepare for Heroku

Create `bridge/Procfile`:

```
web: node server.js
```

### 2. Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-tokenflow-bridge

# Deploy
cd bridge
git init
git add .
git commit -m "Initial deployment"
git push heroku main

# Set environment variables
heroku config:set AUTH_KEY=your-production-key
heroku config:set CORS_ORIGIN=https://your-domain.com
```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# Bridge Server
NODE_ENV=production
PORT=4000
AUTH_KEY=your-secure-production-key
CORS_ORIGIN=https://your-domain.com
LOG_LEVEL=info

# MCP Server
BRIDGE_URL=https://your-bridge-domain.com
CONNECTION_KEY=your-secure-production-key
PROJECT_ID=production
LOG_LEVEL=info
```

### Security Best Practices

```bash
# Generate secure keys
openssl rand -hex 32

# Use environment-specific keys
AUTH_KEY_DEV=dev-key-123
AUTH_KEY_STAGING=staging-key-456
AUTH_KEY_PRODUCTION=production-key-789

# Set up CORS properly
CORS_ORIGIN=https://your-domain.com,https://your-figma-plugin.com
```

## 📊 Monitoring and Logging

### Health Checks

```bash
# Test health endpoint
curl https://your-bridge-domain.com/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2025-07-18T13:00:00.000Z",
  "version": "1.0.0"
}
```

### Logging Configuration

```javascript
// bridge/server.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Performance Monitoring

```javascript
// Add monitoring endpoints
app.get('/api/stats', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    connections: wsServer.clients.size,
    tokens: Object.keys(tokenData).length
  });
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Tokenflow Bridge

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd bridge && npm install
        cd ../mcp-server && npm install
        
    - name: Run tests
      run: |
        cd bridge && npm test
        cd ../mcp-server && npm test
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./bridge
```

### Environment Secrets

Set up secrets in your deployment platform:

```bash
# Vercel
VERCEL_TOKEN=your-vercel-token
ORG_ID=your-org-id
PROJECT_ID=your-project-id

# Netlify
NETLIFY_AUTH_TOKEN=your-netlify-token
SITE_ID=your-site-id

# Railway
RAILWAY_TOKEN=your-railway-token
PROJECT_ID=your-project-id
```

## 🔍 Troubleshooting

### Common Deployment Issues

**Build Failures:**
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables:**
```bash
# Verify environment variables
echo $AUTH_KEY
echo $CORS_ORIGIN

# Set missing variables
export AUTH_KEY=your-key
export CORS_ORIGIN=https://your-domain.com
```

**CORS Issues:**
```bash
# Check CORS configuration
curl -H "Origin: https://your-domain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS https://your-bridge-domain.com/api/tokens
```

### Debug Commands

```bash
# Check deployment status
vercel ls
netlify status
railway status

# View logs
vercel logs
netlify logs
railway logs

# Test endpoints
curl https://your-bridge-domain.com/health
curl https://your-bridge-domain.com/api/tokens
```

## 📈 Performance Optimization

### Production Optimizations

```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Set security headers
const helmet = require('helmet');
app.use(helmet());

// Enable caching
app.use(express.static('public', {
  maxAge: '1h',
  etag: true
}));

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### Database Considerations

For production, consider adding a database:

```javascript
// MongoDB example
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Token schema
const TokenSchema = new mongoose.Schema({
  name: String,
  type: String,
  value: String,
  projectId: String,
  createdAt: { type: Date, default: Date.now }
});

const Token = mongoose.model('Token', TokenSchema);
```

## 🎉 Success!

After deployment, verify:

- ✅ Bridge server responds to health checks
- ✅ Dashboard loads correctly
- ✅ Figma plugin connects successfully
- ✅ MCP server works in Cursor
- ✅ Token data flows through the system

Your Tokenflow Bridge is now ready for production use! 🚀 