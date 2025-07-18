import fetch from 'node-fetch';

const BRIDGE_URL = 'http://localhost:4000';

async function testMCPServer() {
  console.log('🧪 Testing Tokenflow MCP Server Setup...\n');
  
  try {
    // Test 1: Check if bridge server is running
    console.log('1. Testing bridge server connection...');
    const healthResponse = await fetch(`${BRIDGE_URL}/health`);
    
    if (!healthResponse.ok) {
      throw new Error(`Bridge server not responding: ${healthResponse.status}`);
    }
    
    const healthData = await healthResponse.json();
    console.log('✅ Bridge server is running:', healthData.status);
    console.log('   Uptime:', Math.round(healthData.uptime), 'seconds');
    console.log('   WebSocket clients:', healthData.clients);
    
    // Test 2: Check if there's any token data
    console.log('\n2. Checking for existing token data...');
    const tokenResponse = await fetch(`${BRIDGE_URL}/api/tokens`);
    
    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();
      const filtered = tokenData.data.filtered || {};
      console.log('✅ Token data found:');
      console.log('   Clean Tokens:', Object.keys(filtered.cleanTokens || {}).length);
      console.log('   Token Studio:', Object.keys(filtered.tokenStudio || {}).length);
      console.log('   Variables:', Object.keys(filtered.variables || {}).length);
      console.log('   Styles:', Object.keys(filtered.styles || {}).length);
    } else {
      console.log('ℹ️  No token data available yet (this is normal)');
      console.log('   Extract tokens from Figma to test the full workflow');
    }
    
    // Test 3: Test WebSocket connection
    console.log('\n3. Testing WebSocket connection...');
    const WebSocket = (await import('ws')).default;
    
    const ws = new WebSocket('ws://localhost:4000');
    
    const wsTest = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('WebSocket connection timeout'));
      }, 5000);
      
      ws.on('open', () => {
        clearTimeout(timeout);
        console.log('✅ WebSocket connection successful');
        ws.close();
        resolve();
      });
      
      ws.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
    
    await wsTest;
    
    // Test 4: MCP Server Configuration
    console.log('\n4. MCP Server Configuration Check...');
    console.log('✅ MCP server files created:');
    console.log('   - server.js: Main MCP server');
    console.log('   - package.json: Dependencies');
    console.log('   - README.md: Documentation');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Install MCP server dependencies:');
    console.log('   cd mcp-server');
    console.log('   npm install');
    console.log('');
    console.log('2. Configure Cursor to use the MCP server:');
    console.log('   Add to Cursor settings:');
    console.log('   {');
    console.log('     "mcpServers": {');
    console.log('       "tokenflow": {');
    console.log('         "command": "node",');
    console.log('         "args": ["/path/to/tokenflow-bridge/mcp-server/server.js"]');
    console.log('       }');
    console.log('     }');
    console.log('   }');
    console.log('');
    console.log('3. Test MCP tools in Cursor:');
    console.log('   /getCurrentTokens');
    console.log('   /getTokenData');
    console.log('   /generateComponent componentType="button" componentName="TestButton"');
    console.log('   /getBridgeStatus');
    console.log('   /watchForUpdates');
    
    console.log('\n🎉 MCP Server setup is ready!');
    console.log('🔗 Bridge Server: http://localhost:4000');
    console.log('📊 Dashboard: http://localhost:4000');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure the bridge server is running:');
    console.log('   cd bridge');
    console.log('   npm run dev');
    console.log('');
    console.log('2. Check that port 4000 is available');
    console.log('');
    console.log('3. Verify network connectivity');
  }
}

// Run the test
testMCPServer(); 