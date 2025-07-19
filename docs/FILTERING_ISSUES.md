# Token Filtering Issues Guide

## Problem Description

When using the TokenFlow Bridge plugin with an external MCP server, you may encounter unfiltered token data containing Japanese characters, encoded blobs, and other problematic content that should be sanitized.

## Root Cause Analysis

The issue occurs due to **inconsistent token filtering** between different usage scenarios:

1. **Within this project**: The bridge server properly filters tokens using the `filterTokenData()` function
2. **With external MCP server**: The MCP server might receive unfiltered data or the filtering isn't working properly

## Symptoms

- JSON files contain Japanese characters (ᯡ, 䈌, etc.)
- Token Studio document blobs in the output
- Encoded/binary data in token values
- Inconsistent filtering between different projects

## Solutions

### 1. Enhanced Filtering (Implemented)

The bridge server now includes enhanced filtering that removes:

- Japanese characters and other non-ASCII content
- Token Studio document blobs
- Encoded/binary data
- Extremely long values
- Emoji-only tokens
- Repeated pattern tokens

### 2. Diagnostic Tools

Run the diagnostic script to identify filtering issues:

```bash
cd bridge
npm run diagnose
```

This will:
- Check bridge server status
- Analyze current token data
- Identify problematic content
- Provide recommendations

### 3. Manual Verification

Check if filtering is working:

```bash
# Check current token data
curl http://localhost:4000/api/tokens

# Check raw data (should contain unfiltered content)
curl "http://localhost:4000/api/tokens?raw=true"
```

### 4. Restart Services

If filtering isn't working:

```bash
# Stop all services
pkill -f "node.*server.js"

# Restart bridge server
cd bridge
npm start

# Restart MCP server (in another terminal)
cd mcp-server
npm start
```

## Configuration

### Bridge Server Configuration

The bridge server automatically applies filtering when receiving token data. No additional configuration is needed.

### MCP Server Configuration

Ensure the MCP server is connecting to the correct bridge server:

```javascript
// In mcp-server/server.js
let BRIDGE_URL = 'http://localhost:4000'; // Verify this URL
```

### Plugin Configuration

The plugin should send data to the same bridge server that the MCP server is connecting to.

## Troubleshooting Steps

### Step 1: Verify Bridge Server

```bash
cd bridge
npm run diagnose
```

Look for:
- ✅ Bridge server is running
- ✅ Token data available
- ✅ Has filtered data: true
- ✅ Filtering version: 2.0

### Step 2: Check Token Data

If you see Japanese characters in the output:

1. **Restart the bridge server** to apply the new filtering
2. **Re-extract tokens** from Figma
3. **Verify the MCP server** is connecting to the same bridge server

### Step 3: Verify MCP Connection

```bash
# Test MCP server connection
cd mcp-server
node test.js
```

### Step 4: Check File Structure

Ensure the bridge server is saving both raw and filtered data:

```bash
ls -la bridge/data/
# Should see files like: tokens-1234567890.json
```

### Step 5: Manual Filtering

If automatic filtering fails, manually sanitize tokens:

```bash
cd bridge
npm run sanitize
npm run load-sanitized
```

## Common Issues

### Issue: MCP Server Gets Unfiltered Data

**Cause**: MCP server connecting to wrong bridge server or bridge server not filtering properly

**Solution**:
1. Verify MCP server URL configuration
2. Restart bridge server
3. Check that filtering is applied

### Issue: Japanese Characters Still Appear

**Cause**: Old token data or filtering not applied

**Solution**:
1. Clear old token data: `rm -rf bridge/data/*`
2. Restart bridge server
3. Re-extract tokens from Figma

### Issue: Filtering Too Aggressive

**Cause**: Filtering thresholds too strict

**Solution**:
1. Adjust thresholds in `bridge/server.js` `shouldFilterValue()` function
2. Restart bridge server
3. Test with new token data

## Best Practices

1. **Always restart services** after configuration changes
2. **Use the diagnostic script** to verify filtering is working
3. **Check bridge server logs** for filtering information
4. **Verify MCP server connection** to the correct bridge server
5. **Clear old data** if filtering issues persist

## Monitoring

Monitor filtering effectiveness:

```bash
# Check filtering statistics
curl http://localhost:4000/api/tokens | jq '.data.filteringStatus'

# Monitor bridge server logs
tail -f bridge/server.log
```

## Support

If issues persist:

1. Run the diagnostic script and share output
2. Check bridge server logs for errors
3. Verify all services are running on correct ports
4. Ensure no firewall is blocking connections 