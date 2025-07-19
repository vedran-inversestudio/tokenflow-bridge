import { WebSocket } from 'ws';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const config = {
  bridgeUrl: process.env.BRIDGE_URL || 'http://localhost:4000',
  bridgeWsUrl: process.env.BRIDGE_WS_URL || 'ws://localhost:4000',
  projectId: process.env.PROJECT_ID || 'default',
  reconnectInterval: parseInt(process.env.RECONNECT_INTERVAL) || 5000,
  maxReconnectAttempts: parseInt(process.env.MAX_RECONNECT_ATTEMPTS) || 10
};

// Load local config if exists
const configPath = join(process.cwd(), '.mcp-bridge-config.json');
if (fs.existsSync(configPath)) {
  try {
    const localConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    Object.assign(config, localConfig);
  } catch (error) {
    console.warn('⚠️  Could not load local config:', error.message);
  }
}

// Bridge server connection
let bridgeWebSocket = null;
let lastTokenData = null;
let isConnected = false;
let reconnectAttempts = 0;

// Connect to bridge server WebSocket for real-time updates
function connectToBridge() {
  try {
    console.log(`🔌 Connecting to bridge server at ${config.bridgeWsUrl}...`);
    bridgeWebSocket = new WebSocket(config.bridgeWsUrl);
    
    bridgeWebSocket.on('open', () => {
      console.log('✅ Connected to Tokenflow Bridge WebSocket');
      isConnected = true;
      reconnectAttempts = 0;
    });
    
    bridgeWebSocket.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'tokenData') {
          lastTokenData = message.data;
          console.log('📦 Received token data update:', {
            cleanTokenCount: lastTokenData.filtered ? Object.keys(lastTokenData.filtered.cleanTokens || {}).length : 0,
            timestamp: message.timestamp
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    bridgeWebSocket.on('close', () => {
      console.log('🔌 Disconnected from Tokenflow Bridge WebSocket');
      isConnected = false;
      
      // Attempt to reconnect
      if (reconnectAttempts < config.maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`🔄 Reconnecting in ${config.reconnectInterval/1000}s (attempt ${reconnectAttempts}/${config.maxReconnectAttempts})...`);
        setTimeout(connectToBridge, config.reconnectInterval);
      } else {
        console.error('❌ Max reconnection attempts reached. Please check bridge server status.');
      }
    });
    
    bridgeWebSocket.on('error', (error) => {
      console.error('WebSocket error:', error.message);
      isConnected = false;
    });
  } catch (error) {
    console.error('Failed to connect to bridge WebSocket:', error.message);
  }
}

// Initialize bridge connection
connectToBridge();

// Function to get current tokens
async function getCurrentTokens() {
  try {
    const url = config.projectId !== 'default' 
      ? `${config.bridgeUrl}/api/tokens?project=${config.projectId}`
      : `${config.bridgeUrl}/api/tokens`;
      
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Bridge server error: ${response.status}`);
    }
    
    const data = await response.json();
    lastTokenData = data.data;
    
    console.log('✅ Retrieved current token data from bridge server.');
    console.log('📊 Token Summary:');
    console.log(`- Clean Tokens: ${Object.keys(data.data.filtered?.cleanTokens || {}).length}`);
    console.log(`- Token Studio: ${Object.keys(data.data.filtered?.tokenStudio || {}).length}`);
    console.log(`- Variables: ${Object.keys(data.data.filtered?.variables || {}).length}`);
    console.log(`- Styles: ${Object.keys(data.data.filtered?.styles || {}).length}`);
    console.log(`- Last Updated: ${data.timestamp}`);
    console.log(`- Project ID: ${data.projectId || config.projectId}`);
    console.log(`🔗 Bridge Server: ${config.bridgeUrl}`);
    console.log(`📊 Dashboard: ${config.bridgeUrl}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error getting tokens:', error.message);
    return null;
  }
}

// Function to get token data
function getTokenData() {
  if (!lastTokenData) {
    console.log('❌ No token data available. Please extract tokens from Figma first using the Tokenflow Bridge plugin.');
    return null;
  }
  
  const filtered = lastTokenData.filtered || {};
  const cleanTokens = filtered.cleanTokens || {};
  
  console.log('📦 Current Token Data');
  console.log(`**Token Studio:** ${Object.keys(filtered.tokenStudio || {}).length} tokens`);
  console.log(`**Variables:** ${Object.keys(filtered.variables || {}).length} variables`);
  console.log(`**Styles:** ${Object.keys(filtered.styles || {}).length} styles`);
  console.log(`**Clean Tokens:** ${Object.keys(cleanTokens).length} tokens`);
  
  if (Object.keys(cleanTokens).length > 0) {
    console.log('\n**Clean Tokens:**');
    Object.entries(cleanTokens).forEach(([key, value]) => {
      console.log(`- \`${key}\`: \`${value}\``);
    });
  }
  
  return lastTokenData;
}

// Function to get bridge status
async function getBridgeStatus() {
  try {
    const healthResponse = await fetch(`${config.bridgeUrl}/health`);
    const healthData = await healthResponse.json();
    
    console.log('🔌 Bridge Server Status');
    console.log(`**Status:** ${healthData.status}`);
    console.log(`**Uptime:** ${Math.round(healthData.uptime)}s`);
    console.log(`**WebSocket:** ${isConnected ? '✅ Connected' : '❌ Disconnected'}`);
    console.log(`**Clients:** ${healthData.clients}`);
    console.log(`**Last Update:** ${lastTokenData ? '✅ Available' : '❌ None'}`);
    console.log(`🔗 Dashboard: ${config.bridgeUrl}`);
    
    return healthData;
  } catch (error) {
    console.error('❌ Error getting bridge status:', error.message);
    return null;
  }
}

// Function to watch for updates
function watchForUpdates() {
  console.log('👀 Watching for token updates...');
  console.log(`**WebSocket Status:** ${isConnected ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`**Bridge Server:** ${config.bridgeUrl}`);
  console.log(`**Project ID:** ${config.projectId}`);
  console.log('\nThe MCP server is now monitoring for real-time token updates from the Figma plugin.');
  console.log('When you extract tokens in Figma, they will automatically be available here.');
  console.log('\nUse `getTokenData()` to see the latest tokens.');
}

// Function to configure bridge
function configureBridge(bridgeUrl, projectId) {
  if (bridgeUrl) {
    config.bridgeUrl = bridgeUrl;
    config.bridgeWsUrl = bridgeUrl.replace('http', 'ws');
  }
  
  if (projectId) {
    config.projectId = projectId;
  }
  
  // Save to local config
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('✅ Configuration saved to .mcp-bridge-config.json');
  } catch (error) {
    console.error('❌ Could not save configuration:', error.message);
  }
  
  // Reconnect with new settings
  if (bridgeWebSocket) {
    bridgeWebSocket.close();
  }
  
  console.log(`✅ Bridge configuration updated!`);
  console.log(`**Bridge URL:** ${config.bridgeUrl}`);
  console.log(`**Project ID:** ${config.projectId}`);
  console.log(`**Status:** Reconnecting...`);
}

// Start the service
console.log('🚀 MCP-Bridge Service started');
console.log(`🔌 Bridge URL: ${config.bridgeUrl}`);
console.log(`📊 Project ID: ${config.projectId}`);
console.log('📊 Available functions:');
console.log('  - getCurrentTokens(): Get latest tokens from bridge');
console.log('  - getTokenData(): Get current token data');
console.log('  - getBridgeStatus(): Check bridge server status');
console.log('  - watchForUpdates(): Monitor for real-time updates');
console.log('  - configureBridge(bridgeUrl, projectId): Configure connection');

// Export functions for use
export { getCurrentTokens, getTokenData, getBridgeStatus, watchForUpdates, configureBridge };

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down MCP-Bridge Service...');
  if (bridgeWebSocket) {
    bridgeWebSocket.close();
  }
  process.exit(0);
});

// Test connection on startup
setTimeout(async () => {
  console.log('\n🧪 Testing bridge connection...');
  await getCurrentTokens();
  await getBridgeStatus();
}, 2000); 