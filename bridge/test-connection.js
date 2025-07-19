import fetch from 'node-fetch';

async function testBridgeServer() {
  const baseUrl = 'http://localhost:4000';
  
  console.log('🧪 Testing Tokenflow Bridge Server...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData.status);
    
    // Test 2: Send sample token data
    console.log('\n2. Testing token data endpoint...');
    const sampleData = {
      tokens: {
        tokenStudio: {
          'button_primary_color': '#667eea',
          'button_primary_radius': '8px'
        },
        variables: {
          'spacing_small': '8px',
          'spacing_medium': '16px'
        },
        styles: {
          'text_heading': 'Inter, 24px, Bold'
        },
        rawData: [
          {
            name: 'Test Button',
            type: 'RECTANGLE',
            id: 'test-123',
            tokens: {
              tokenStudio_primary_color: '#667eea'
            }
          }
        ]
      },
      selection: [
        {
          name: 'Test Button',
          type: 'RECTANGLE',
          id: 'test-123'
        }
      ],
      metadata: {
        extractedAt: new Date().toISOString(),
        source: 'test-script',
        version: '1.0.0'
      }
    };
    
    const tokenResponse = await fetch(`${baseUrl}/api/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleData)
    });
    
    if (tokenResponse.ok) {
      const result = await tokenResponse.json();
      console.log('✅ Token data sent successfully:', result.message);
      console.log('   Saved as:', result.savedTo);
      console.log('   Clients notified:', result.clientsNotified);
    } else {
      throw new Error(`HTTP ${tokenResponse.status}: ${tokenResponse.statusText}`);
    }
    
    // Test 3: Retrieve the data
    console.log('\n3. Testing data retrieval...');
    const getResponse = await fetch(`${baseUrl}/api/tokens`);
    const retrievedData = await getResponse.json();
    console.log('✅ Data retrieved successfully');
    
    if (retrievedData.data.filtered) {
      const cleanTokenCount = Object.keys(retrievedData.data.filtered.cleanTokens || {}).length;
      const tokenStudioCount = Object.keys(retrievedData.data.filtered.tokenStudio || {}).length;
      console.log('   Clean tokens:', cleanTokenCount);
      console.log('   Token Studio tokens:', tokenStudioCount);
    } else {
      console.log('   No filtered data available');
    }
    
    // Test 4: Check history
    console.log('\n4. Testing history endpoint...');
    const historyResponse = await fetch(`${baseUrl}/api/tokens/history`);
    const historyData = await historyResponse.json();
    console.log('✅ History retrieved successfully');
    console.log('   History entries:', historyData.history.length);
    
    console.log('\n🎉 All tests passed! Bridge server is working correctly.');
    console.log('\n📊 Dashboard available at: http://localhost:4000');
    console.log('🔌 Ready to receive data from Figma plugin!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Make sure the bridge server is running:');
    console.log('   cd bridge');
    console.log('   npm run dev');
  }
}

// Run the test
testBridgeServer(); 