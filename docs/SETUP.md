# 🚀 Setup Guide

Complete setup instructions for the Tokenflow Bridge system.

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **Figma Desktop**: For plugin installation
- **Cursor IDE**: For MCP integration (optional)
- **Git**: For version control

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd tokenflow-bridge
```

### 2. Install Dependencies

```bash
# Install bridge server dependencies
cd bridge
npm install

# Install MCP server dependencies
cd ../mcp-server
npm install

# Return to root directory
cd ..
```

### 3. Configure Environment

Create environment files if needed:

```bash
# Bridge server environment (optional)
cd bridge
cp .env.example .env
# Edit .env with your configuration

# MCP server environment (optional)
cd ../mcp-server
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start the System

#### Option A: Using the Startup Script (Recommended)

```bash
# Make script executable
chmod +x start-tokenflow-bridge.sh

# Start the entire system
./start-tokenflow-bridge.sh
```

#### Option B: Manual Startup

```bash
# Terminal 1: Start bridge server
cd bridge
node server.js

# Terminal 2: Start MCP server
cd mcp-server
node server.js
```

### 5. Install Figma Plugin

1. **Open Figma Desktop**
2. **Go to Plugins** → **Development** → **Import plugin from manifest**
3. **Select** `plugin/manifest.json` from this project
4. **Run the plugin** from the Plugins menu

### 6. Configure Cursor IDE (Optional)

1. **Open Cursor Settings** (`Cmd+,`)
2. **Search for "MCP"**
3. **Add MCP server configuration**:

```json
{
  "mcpServers": {
    "tokenflow-bridge": {
      "command": "node",
      "args": ["/path/to/tokenflow-bridge/mcp-server/server.js"]
    }
  }
}
```

4. **Restart Cursor**

## 🔍 Verification

### Check Bridge Server

```bash
# Test health endpoint
curl http://localhost:4000/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-07-18T13:00:00.000Z",
  "version": "1.0.0"
}
```

### Check Dashboard

1. **Open browser** to `http://localhost:4000`
2. **Verify dashboard loads** with connection status
3. **Check WebSocket connection** shows as active

### Test Figma Plugin

1. **Open Figma**
2. **Select some layers** with Token Studio assignments
3. **Run the plugin**
4. **Check connection status** shows green dot
5. **Send tokens** to bridge server

### Test MCP Integration

```bash
# In Cursor, test MCP tools
/getBridgeStatus
/getCurrentTokens
```

## 🎯 Configuration Options

### Bridge Server Configuration

Edit `bridge/server.js`:

```javascript
// Port configuration
const PORT = process.env.PORT || 4000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true
}));

// Authentication (optional)
const AUTH_KEY = process.env.AUTH_KEY || null;
```

### MCP Server Configuration

Edit `mcp-server/server.js`:

```javascript
// Bridge server connection
const BRIDGE_URL = process.env.BRIDGE_URL || 'http://localhost:4000';

// Tool configuration
const TOOLS = {
  // Customize available tools
};
```

### Plugin Configuration

The plugin stores settings in localStorage:

```javascript
// Connection settings
{
  bridgeUrl: 'http://localhost:4000',
  projectId: 'my-project',
  connectionKey: 'optional-key',
  isConnected: true
}
```

## 🔧 Development Setup

### Development Mode

```bash
# Install nodemon for development
npm install -g nodemon

# Start bridge server in development mode
cd bridge
npm run dev

# Start MCP server in development mode
cd ../mcp-server
npm run dev
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* node bridge/server.js
DEBUG=* node mcp-server/server.js
```

### Testing

```bash
# Run all tests
npm test

# Test specific components
npm run test:bridge
npm run test:mcp
npm run test:plugin
```

## 🚀 Production Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy bridge server
cd bridge
vercel --prod

# Deploy MCP server (if needed)
cd ../mcp-server
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy bridge server
cd bridge
netlify deploy --prod
```

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy bridge server
cd bridge
railway up
```

## 🔍 Troubleshooting

### Common Issues

**Port 4000 already in use:**
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or change port in bridge/server.js
```

**MCP server not connecting:**
```bash
# Check bridge server is running
curl http://localhost:4000/health

# Check MCP server logs
cd mcp-server
node server.js
```

**Plugin connection issues:**
```bash
# Check CORS settings
# Verify bridge server URL
# Check browser console for errors
```

**Token data not appearing:**
```bash
# Ensure Token Studio plugin is running
# Check token assignments in Figma
# Verify data sanitization
```

### Debug Commands

```bash
# Check system status
./scripts/check-system-status.sh

# Test universal connection
node scripts/test-universal-connection.js

# Validate token data
node scripts/validate-tokens.js
```

## 📞 Support

If you encounter issues:

1. **Check the logs** for error messages
2. **Verify all prerequisites** are installed
3. **Test each component** individually
4. **Create an issue** with detailed error information

## 🎉 Success!

Once setup is complete, you should have:

- ✅ Bridge server running on port 4000
- ✅ Dashboard accessible at http://localhost:4000
- ✅ Figma plugin installed and connected
- ✅ MCP server running (if using Cursor)
- ✅ Token data flowing through the system

You're ready to start extracting tokens and generating components! 🚀 