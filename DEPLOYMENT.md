# 🚀 Tokenflow Bridge - Universal Deployment Guide

This guide explains how to deploy the Tokenflow Bridge system for universal use across multiple projects.

## 🌟 Universal Architecture Overview

The Tokenflow Bridge system now supports **universal connections** where:

- **One Figma plugin** can connect to **any project's bridge server**
- **Each project** can run its own bridge server (or use a shared one)
- **Cursor** can connect to any bridge server via MCP
- **No need to clone** the bridge system into every project

## 📋 Deployment Options

### Option 1: Local Development (Recommended for Testing)

Each project runs its own local bridge server:

```bash
# In your project directory
git clone https://github.com/your-username/tokenflow-bridge.git
cd tokenflow-bridge/bridge
npm install
npm start
```

**Bridge URL:** `http://localhost:4000`

### Option 2: Shared Bridge Server (Recommended for Teams)

Deploy one bridge server for your team/organization:

```bash
# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod

# Deploy to Railway
railway up
```

**Bridge URL:** `https://your-team-bridge.vercel.app`

### Option 3: Project-Specific Bridge Servers

Each project deploys its own bridge server:

```bash
# Project A
https://project-a-bridge.vercel.app

# Project B  
https://project-b-bridge.netlify.app

# Project C
https://project-c.railway.app
```

## 🔧 Configuration Steps

### 1. Figma Plugin Configuration

1. Open the Tokenflow Bridge plugin in Figma
2. Go to the **🔌 Connection** tab
3. Enter your bridge server URL:
   - Local: `http://localhost:4000`
   - Remote: `https://your-bridge.vercel.app`
4. (Optional) Enter a **Project ID** for isolation
5. Click **💾 Save & Connect**

### 2. Cursor MCP Configuration

1. Configure Cursor to use the MCP server:
   ```json
   // .cursorrules
   {
     "mcpServers": {
       "tokenflow": {
         "command": "node",
         "args": ["/path/to/tokenflow-bridge/mcp-server/server.js"]
       }
     }
   }
   ```

2. Use MCP tools to configure bridge connection:
   ```
   /configureBridgeConnection bridgeUrl="https://your-bridge.vercel.app" projectId="my-project"
   ```

### 3. Bridge Server Environment Variables

For production deployments, set these environment variables:

```bash
# Vercel/Netlify/Railway
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://www.figma.com
```

## 🌐 Deployment Platforms

### Vercel Deployment

1. **Fork/Clone** the tokenflow-bridge repository
2. **Navigate** to the bridge directory
3. **Deploy**:
   ```bash
   cd bridge
   vercel --prod
   ```

4. **Configure** environment variables in Vercel dashboard
5. **Get** your bridge URL: `https://your-bridge.vercel.app`

### Netlify Deployment

1. **Create** a new site from Git
2. **Set** build directory to `bridge`
3. **Set** publish directory to `bridge/public`
4. **Add** build command: `npm install && npm run build` (if needed)
5. **Deploy** and get your bridge URL

### Railway Deployment

1. **Connect** your GitHub repository
2. **Set** root directory to `bridge`
3. **Configure** environment variables
4. **Deploy** and get your bridge URL

## 🔐 Security Considerations

### Authentication (Optional)

For production deployments, consider adding authentication:

1. **API Keys**: Add `connectionKey` in plugin settings
2. **CORS**: Configure allowed origins
3. **Rate Limiting**: Add rate limiting middleware
4. **HTTPS**: Always use HTTPS in production

### Environment Variables

```bash
# Required
PORT=4000

# Optional (Security)
API_KEY=your-secret-key
CORS_ORIGIN=https://www.figma.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 📊 Project Isolation

### Using Project IDs

Each project can have its own isolated token data:

```javascript
// Figma Plugin
Bridge URL: https://your-bridge.vercel.app
Project ID: my-awesome-project

// MCP Server
/configureBridgeConnection bridgeUrl="https://your-bridge.vercel.app" projectId="my-awesome-project"
```

### Benefits

- **Isolation**: Projects don't interfere with each other
- **Organization**: Easy to manage multiple projects
- **Security**: Project-specific access control
- **Scalability**: Support for unlimited projects

## 🔄 Workflow Examples

### Local Development Workflow

1. **Start** local bridge server: `npm start`
2. **Configure** Figma plugin: `http://localhost:4000`
3. **Configure** Cursor MCP: `http://localhost:4000`
4. **Extract** tokens from Figma
5. **Generate** components in Cursor

### Team Workflow

1. **Deploy** shared bridge server to Vercel
2. **Share** bridge URL with team
3. **Each developer** configures their Figma plugin
4. **Each project** uses unique Project ID
5. **Real-time** collaboration via WebSocket

### Multi-Project Workflow

1. **Deploy** bridge server for each project
2. **Configure** Figma plugin per project
3. **Switch** MCP connections as needed
4. **Maintain** project-specific token libraries

## 🛠️ Troubleshooting

### Common Issues

**Connection Failed**
- Check bridge server is running
- Verify URL is correct
- Check firewall/network settings
- Ensure CORS is configured

**No Token Data**
- Extract tokens from Figma first
- Check project ID matches
- Verify WebSocket connection
- Check browser console for errors

**MCP Server Issues**
- Verify Node.js version (18+)
- Check MCP server is running
- Ensure bridge URL is accessible
- Check Cursor configuration

### Debug Commands

```bash
# Test bridge server
curl http://localhost:4000/health

# Test project-specific endpoint
curl http://localhost:4000/api/tokens?project=my-project

# List all projects
curl http://localhost:4000/api/projects

# Test WebSocket connection
wscat -c ws://localhost:4000
```

## 📈 Monitoring & Analytics

### Health Checks

- **Health Endpoint**: `GET /health`
- **Project Status**: `GET /api/projects`
- **Token History**: `GET /api/tokens/history`

### Metrics

- **Active Connections**: WebSocket client count
- **Token Counts**: Per project statistics
- **Update Frequency**: Real-time token updates
- **Error Rates**: Failed requests/connections

## 🎯 Best Practices

### Development

1. **Use Project IDs** for organization
2. **Test locally** before deploying
3. **Monitor** WebSocket connections
4. **Backup** token data regularly

### Production

1. **Use HTTPS** for all connections
2. **Implement** rate limiting
3. **Monitor** server health
4. **Set up** error tracking
5. **Configure** proper CORS

### Team Collaboration

1. **Document** project configurations
2. **Share** bridge URLs securely
3. **Use** consistent naming conventions
4. **Regular** token updates

## 🚀 Quick Start Checklist

- [ ] Deploy bridge server (local or remote)
- [ ] Configure Figma plugin with bridge URL
- [ ] Set up Cursor MCP server
- [ ] Configure MCP bridge connection
- [ ] Extract tokens from Figma
- [ ] Test component generation
- [ ] Share configuration with team

## 📞 Support

For issues and questions:

1. **Check** troubleshooting section
2. **Review** browser console logs
3. **Test** with health endpoints
4. **Open** GitHub issue with details

---

**🎉 You're now ready to use Tokenflow Bridge universally across all your projects!** 