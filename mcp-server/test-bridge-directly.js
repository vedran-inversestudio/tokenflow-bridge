import fetch from 'node-fetch';

const BRIDGE_URL = 'http://localhost:4000';

async function testBridgeDirectly() {
  try {
    console.log('🧪 Testing Bridge Server Directly...\n');
    
    // Test health endpoint
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${BRIDGE_URL}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Bridge server is healthy:', healthData);
    } else {
      console.log('❌ Bridge server health check failed');
      return;
    }
    
    // Test tokens endpoint
    console.log('\n2️⃣ Testing tokens endpoint...');
    const tokensResponse = await fetch(`${BRIDGE_URL}/api/tokens`);
    if (tokensResponse.ok) {
      const tokensData = await tokensResponse.json();
      console.log('✅ Token data retrieved successfully!');
      console.log('📊 Token Summary:');
      console.log(`  - Clean Tokens: ${Object.keys(tokensData.data.filtered?.cleanTokens || {}).length}`);
      console.log(`  - Token Studio: ${Object.keys(tokensData.data.filtered?.tokenStudio || {}).length}`);
      console.log(`  - Variables: ${Object.keys(tokensData.data.filtered?.variables || {}).length}`);
      console.log(`  - Styles: ${Object.keys(tokensData.data.filtered?.styles || {}).length}`);
      
      // Show the actual tokens
      const cleanTokens = tokensData.data.filtered?.cleanTokens || {};
      if (Object.keys(cleanTokens).length > 0) {
        console.log('\n🔍 Available tokens:');
        Object.entries(cleanTokens).forEach(([key, value]) => {
          console.log(`  - ${key}: ${value}`);
        });
      }
    } else {
      const errorData = await tokensResponse.json();
      console.log('❌ Token data not available:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error testing bridge server:', error.message);
  }
}

// Run the test
testBridgeDirectly(); 