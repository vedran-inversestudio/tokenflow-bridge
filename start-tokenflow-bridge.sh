#!/bin/bash

echo "🚀 Starting Tokenflow Bridge System..."
echo "======================================"

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Kill existing processes
echo "🔄 Stopping existing processes..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f nodemon 2>/dev/null

# Wait a moment
sleep 2

# Start bridge server
echo "🌉 Starting Bridge Server..."
cd /Users/vedran/Documents/GitHub/tokenflow-bridge/bridge
if check_port 4000; then
    echo "❌ Port 4000 is already in use"
else
    node server.js &
    BRIDGE_PID=$!
    echo "✅ Bridge server started (PID: $BRIDGE_PID)"
fi

# Wait for bridge server to start
echo "⏳ Waiting for bridge server to start..."
sleep 5

# Load sanitized tokens
echo "🧹 Loading sanitized token data..."
node load-sanitized-tokens.js

# Start MCP server
echo "🔌 Starting MCP Server..."
cd /Users/vedran/Documents/GitHub/tokenflow-bridge/mcp-server
if check_port 3001; then
    echo "❌ Port 3001 is already in use"
else
    node simple-server.js &
    MCP_PID=$!
    echo "✅ MCP server started (PID: $MCP_PID)"
fi

echo ""
echo "🎉 Tokenflow Bridge System Started!"
echo "=================================="
echo "🌉 Bridge Server: http://localhost:4000"
echo "📊 Dashboard: http://localhost:4000"
echo "🔌 MCP Server: Running (stdio transport)"
echo ""
echo "📋 Available MCP Tools:"
echo "  - getCurrentTokens: Get latest tokens from Figma"
echo "  - getTokenData: View current token data"
echo "  - generateComponent: Generate React components"
echo "  - getBridgeStatus: Check system status"
echo "  - watchForUpdates: Monitor for real-time updates"
echo ""
echo "💡 Next Steps:"
echo "  1. Configure Cursor with the MCP server"
echo "  2. Use MCP tools in Cursor for component generation"
echo "  3. Extract new tokens from Figma for real-time updates"
echo ""
echo "🛑 To stop: Press Ctrl+C or run 'pkill -f tokenflow-bridge'"

# Keep script running
wait 