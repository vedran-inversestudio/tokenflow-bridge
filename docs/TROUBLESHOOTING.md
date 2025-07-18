# 🔧 Troubleshooting Guide

Complete troubleshooting guide for the Tokenflow Bridge system.

## 🚨 Common Issues

### Bridge Server Issues

#### Port 4000 Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solutions:**
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=4001 node bridge/server.js
```

#### Bridge Server Not Starting

**Symptoms:**
```
node:internal/modules/cjs/loader:1404
  throw err;
  ^
Error: Cannot find module 'express'
```

**Solutions:**
```bash
# Install dependencies
cd bridge
npm install

# Check Node.js version
node --version  # Should be 18+

# Clear npm cache
npm cache clean --force
```

#### CORS Errors

**Symptoms:**
```
Access to fetch at 'http://localhost:4000/api/tokens' from origin 'null' has been blocked by CORS policy
```

**Solutions:**
```javascript
// Update CORS configuration in bridge/server.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### MCP Server Issues

#### MCP Server Not Starting

**Symptoms:**
```
TypeError: Cannot read properties of undefined (reading 'method')
```

**Solutions:**
```bash
# Check MCP SDK version
cd mcp-server
npm list @modelcontextprotocol/sdk

# Update to latest version
npm update @modelcontextprotocol/sdk

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Tools Not Appearing in Cursor

**Symptoms:**
- MCP tools don't show up in Cursor
- No response from MCP commands

**Solutions:**
```bash
# Restart Cursor after configuration
# Check MCP configuration in settings
# Verify server is running
node mcp-server/server.js

# Test MCP connection
node mcp-server/test-mcp.js
```

#### Component Generation Failing

**Symptoms:**
```
Error: No token data available
```

**Solutions:**
```bash
# Check token data availability
/getTokenData

# Verify bridge connection
/getBridgeStatus

# Load token data
node bridge/load-sanitized-tokens.js
```

### Figma Plugin Issues

#### Plugin Connection Failing

**Symptoms:**
- Connection status shows red dot
- "Disconnected" tooltip
- Connection test fails

**Solutions:**
```bash
# Check bridge server is running
curl http://localhost:4000/health

# Verify URL in plugin settings
# Check CORS configuration
# Try refreshing plugin
```

#### Token Extraction Not Working

**Symptoms:**
- No tokens found in selection
- Empty token list
- "No tokens detected" message

**Solutions:**
```bash
# Ensure Token Studio plugin is running
# Check token assignments in Figma
# Verify selection has tokens
# Check plugin permissions
```

#### File Upload Issues

**Symptoms:**
- File upload fails
- "Invalid file format" error
- Upload progress stuck

**Solutions:**
```bash
# Check file format (must be JSON)
# Verify file size (max 10MB)
# Check network connection
# Try different browser
```

## 🔍 Debug Commands

### System Status Check

```bash
# Check all components
./scripts/check-system-status.sh

# Test bridge server
curl http://localhost:4000/health

# Test MCP server
node mcp-server/test-mcp.js

# Test universal connection
node scripts/test-universal-connection.js
```

### Log Analysis

```bash
# View bridge server logs
tail -f bridge/server.log

# View MCP server logs
tail -f mcp-server/mcp.log

# View system logs
journalctl -u tokenflow-bridge -f
```

### Network Diagnostics

```bash
# Test WebSocket connection
wscat -c ws://localhost:4000

# Test HTTP endpoints
curl -X POST http://localhost:4000/api/tokens \
  -H "Content-Type: application/json" \
  -d '{"tokens":[],"metadata":{"source":"test"}}'

# Check port availability
netstat -tulpn | grep :4000
```

## 🛠️ Manual Fixes

### Reset Connection Settings

```bash
# Clear plugin localStorage
# In Figma plugin console:
localStorage.clear();

# Reset bridge server data
rm -rf bridge/data/*
rm -rf bridge/uploads/*

# Restart servers
./start-tokenflow-bridge.sh
```

### Reinstall Dependencies

```bash
# Bridge server
cd bridge
rm -rf node_modules package-lock.json
npm install

# MCP server
cd ../mcp-server
rm -rf node_modules package-lock.json
npm install
```

### Fix File Permissions

```bash
# Make scripts executable
chmod +x start-tokenflow-bridge.sh
chmod +x scripts/*.sh

# Fix data directory permissions
mkdir -p bridge/data bridge/uploads
chmod 755 bridge/data bridge/uploads
```

## 📊 Performance Issues

### Slow Token Processing

**Symptoms:**
- Token extraction takes >5 seconds
- Component generation is slow
- Dashboard loads slowly

**Solutions:**
```bash
# Check system resources
htop
df -h
free -h

# Optimize token data
node scripts/sanitize-tokens.js

# Enable compression
# Add to bridge/server.js:
const compression = require('compression');
app.use(compression());
```

### Memory Issues

**Symptoms:**
- High memory usage
- Server crashes
- Slow response times

**Solutions:**
```bash
# Monitor memory usage
node -e "console.log(process.memoryUsage())"

# Garbage collection
node --expose-gc server.js

# Limit token storage
# Add to bridge/server.js:
const MAX_TOKENS = 1000;
```

### WebSocket Connection Issues

**Symptoms:**
- Real-time updates not working
- Connection drops frequently
- High latency

**Solutions:**
```javascript
// Add reconnection logic
const ws = new WebSocket('ws://localhost:4000');

ws.onclose = () => {
  setTimeout(() => {
    // Reconnect after 5 seconds
    connectWebSocket();
  }, 5000);
};
```

## 🔐 Security Issues

### Authentication Failures

**Symptoms:**
- 401 Unauthorized errors
- Connection key rejected
- Access denied

**Solutions:**
```bash
# Check authentication key
echo $AUTH_KEY

# Generate new key
openssl rand -hex 32

# Update environment variables
export AUTH_KEY=new-key-here
```

### CORS Configuration

**Symptoms:**
- Cross-origin request blocked
- Plugin can't connect
- API calls fail

**Solutions:**
```javascript
// Update CORS in bridge/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-domain.com',
    'https://www.figma.com'
  ],
  credentials: true
}));
```

## 🐛 Known Bugs

### MCP SDK Version Issues

**Issue:** MCP server fails with SDK version conflicts

**Workaround:**
```bash
# Use specific SDK version
npm install @modelcontextprotocol/sdk@1.0.0

# Or update to latest
npm install @modelcontextprotocol/sdk@latest
```

### Figma Plugin CSP Issues

**Issue:** Content Security Policy blocks requests

**Workaround:**
```javascript
// Use file upload instead of direct requests
// Plugin uploads JSON file to dashboard
```

### Node.js Version Compatibility

**Issue:** Server fails with older Node.js versions

**Solution:**
```bash
# Update to Node.js 18+
nvm install 18
nvm use 18

# Or use Docker
docker run -it --rm node:18-alpine
```

## 📞 Getting Help

### Before Asking for Help

1. **Check this guide** for your specific issue
2. **Run debug commands** to gather information
3. **Check logs** for error messages
4. **Test components** individually

### Information to Provide

When reporting issues, include:

```bash
# System information
node --version
npm --version
uname -a

# Error logs
tail -n 50 bridge/server.log
tail -n 50 mcp-server/mcp.log

# Configuration
cat bridge/.env
cat mcp-server/.env

# Test results
curl http://localhost:4000/health
node mcp-server/test-mcp.js
```

### Support Channels

- **GitHub Issues**: Create detailed issue reports
- **Discussions**: Ask questions in GitHub discussions
- **Documentation**: Check docs folder for guides
- **Examples**: See examples folder for usage patterns

## 🔄 Recovery Procedures

### Complete System Reset

```bash
# Stop all processes
pkill -f tokenflow-bridge
pkill -f "node.*server.js"

# Clear all data
rm -rf bridge/data/*
rm -rf bridge/uploads/*
rm -rf mcp-server/cache/*

# Reinstall dependencies
cd bridge && npm install
cd ../mcp-server && npm install

# Restart system
./start-tokenflow-bridge.sh
```

### Data Recovery

```bash
# Restore from backup
cp backup/tokens-*.json bridge/data/

# Load sanitized tokens
node bridge/load-sanitized-tokens.js

# Verify data
curl http://localhost:4000/api/tokens
```

### Configuration Recovery

```bash
# Restore configuration files
cp backup/.env bridge/
cp backup/.env mcp-server/

# Update paths if needed
sed -i 's|old-path|new-path|g' bridge/.env
sed -i 's|old-path|new-path|g' mcp-server/.env
```

## 🎯 Prevention

### Regular Maintenance

```bash
# Daily checks
./scripts/daily-health-check.sh

# Weekly cleanup
./scripts/weekly-cleanup.sh

# Monthly updates
npm update
```

### Monitoring

```bash
# Set up monitoring
./scripts/setup-monitoring.sh

# Check system health
./scripts/health-check.sh

# Monitor logs
./scripts/monitor-logs.sh
```

### Backup Strategy

```bash
# Create backups
./scripts/create-backup.sh

# Schedule automatic backups
crontab -e
# Add: 0 2 * * * /path/to/tokenflow-bridge/scripts/create-backup.sh
```

## 🎉 Success Indicators

When everything is working correctly:

- ✅ Bridge server responds to health checks
- ✅ Dashboard loads without errors
- ✅ Figma plugin shows green connection dot
- ✅ MCP tools work in Cursor
- ✅ Token data flows through the system
- ✅ Component generation produces valid code
- ✅ Real-time updates work via WebSocket

If you see all these indicators, your Tokenflow Bridge is working perfectly! 🚀 