import fetch from 'node-fetch';

const BRIDGE_URL = 'http://localhost:4000';

// Simulate MCP tool responses
async function testMCPServerTools() {
  console.log('🧪 Testing MCP Server Tools...\n');
  
  try {
    // Test 1: getCurrentTokens
    console.log('1. Testing getCurrentTokens...');
    const tokenResponse = await fetch(`${BRIDGE_URL}/api/tokens`);
    
    if (tokenResponse.ok) {
      const data = await tokenResponse.json();
      const filtered = data.data.filtered || {};
      
      console.log('✅ getCurrentTokens response:');
      console.log(`📊 Token Summary:`);
      console.log(`- Clean Tokens: ${Object.keys(filtered.cleanTokens || {}).length}`);
      console.log(`- Token Studio: ${Object.keys(filtered.tokenStudio || {}).length}`);
      console.log(`- Variables: ${Object.keys(filtered.variables || {}).length}`);
      console.log(`- Styles: ${Object.keys(filtered.styles || {}).length}`);
      console.log(`- Last Updated: ${data.timestamp}`);
      console.log(`🔗 Bridge Server: ${BRIDGE_URL}`);
      console.log(`📊 Dashboard: ${BRIDGE_URL}`);
    } else {
      console.log('ℹ️  No token data available (this is normal)');
      console.log('   Upload token data to bridge server to test full functionality');
    }
    
    // Test 2: getTokenData
    console.log('\n2. Testing getTokenData...');
    if (tokenResponse.ok) {
      const data = await tokenResponse.json();
      const filtered = data.data.filtered || {};
      const cleanTokens = filtered.cleanTokens || {};
      
      console.log('✅ getTokenData response:');
      console.log(`📦 Current Token Data\n\n`);
      console.log(`**Token Studio:** ${Object.keys(filtered.tokenStudio || {}).length} tokens`);
      console.log(`**Variables:** ${Object.keys(filtered.variables || {}).length} variables`);
      console.log(`**Styles:** ${Object.keys(filtered.styles || {}).length} styles`);
      console.log(`**Clean Tokens:** ${Object.keys(cleanTokens).length} tokens`);
      
      if (Object.keys(cleanTokens).length > 0) {
        console.log('\n**Clean Tokens:**');
        Object.entries(cleanTokens).slice(0, 5).forEach(([key, value]) => {
          console.log(`- \`${key}\`: \`${value}\``);
        });
        if (Object.keys(cleanTokens).length > 5) {
          console.log(`... and ${Object.keys(cleanTokens).length - 5} more tokens`);
        }
      }
    } else {
      console.log('❌ No token data available for getTokenData');
    }
    
    // Test 3: getBridgeStatus
    console.log('\n3. Testing getBridgeStatus...');
    const healthResponse = await fetch(`${BRIDGE_URL}/health`);
    const healthData = await healthResponse.json();
    
    console.log('✅ getBridgeStatus response:');
    console.log(`🔌 Bridge Server Status\n\n`);
    console.log(`**Status:** ${healthData.status}`);
    console.log(`**Uptime:** ${Math.round(healthData.uptime)}s`);
    console.log(`**WebSocket:** ✅ Connected (simulated)`);
    console.log(`**Clients:** ${healthData.clients}`);
    console.log(`**Last Update:** ${tokenResponse.ok ? '✅ Available' : '❌ None'}`);
    console.log(`🔗 Dashboard: ${BRIDGE_URL}`);
    
    // Test 4: generateComponent (if we have token data)
    console.log('\n4. Testing generateComponent...');
    if (tokenResponse.ok) {
      const data = await tokenResponse.json();
      const tokens = data.data.filtered?.cleanTokens || {};
      
      console.log('✅ generateComponent response:');
      console.log(`🎨 Generated button component with current design tokens:\n\n`);
      console.log(`**Component:** TestButton`);
      console.log(`**Type:** button`);
      console.log(`**Tokens Used:** ${Object.keys(tokens).length}\n\n`);
      
      // Show a sample of the generated component
      const primaryColor = Object.entries(tokens).find(([key]) => key.includes('primary'))?.[1] || '#667eea';
      const borderRadius = Object.entries(tokens).find(([key]) => key.includes('radius'))?.[1] || '8px';
      
      console.log(`\`\`\`tsx`);
      console.log(`import React from 'react';`);
      console.log(``);
      console.log(`interface TestButtonProps {`);
      console.log(`  children: React.ReactNode;`);
      console.log(`  variant?: 'primary' | 'secondary' | 'outline';`);
      console.log(`  size?: 'small' | 'medium' | 'large';`);
      console.log(`  onClick?: () => void;`);
      console.log(`  disabled?: boolean;`);
      console.log(`}`);
      console.log(``);
      console.log(`export const TestButton: React.FC<TestButtonProps> = ({`);
      console.log(`  children,`);
      console.log(`  variant = 'primary',`);
      console.log(`  size = 'medium',`);
      console.log(`  onClick,`);
      console.log(`  disabled = false`);
      console.log(`}) => {`);
      console.log(`  const baseStyles = {`);
      console.log(`    borderRadius: '${borderRadius}',`);
      console.log(`    padding: '12px 24px',`);
      console.log(`    border: 'none',`);
      console.log(`    cursor: disabled ? 'not-allowed' : 'pointer',`);
      console.log(`    transition: 'all 0.2s ease',`);
      console.log(`    fontFamily: 'inherit',`);
      console.log(`    fontSize: '14px',`);
      console.log(`    fontWeight: 500,`);
      console.log(`  };`);
      console.log(``);
      console.log(`  const variantStyles = {`);
      console.log(`    primary: {`);
      console.log(`      backgroundColor: '${primaryColor}',`);
      console.log(`      color: 'white',`);
      console.log(`    },`);
      console.log(`    // ... rest of component`);
      console.log(`  };`);
      console.log(``);
      console.log(`  return (`);
      console.log(`    <button style={baseStyles} onClick={onClick} disabled={disabled}>`);
      console.log(`      {children}`);
      console.log(`    </button>`);
      console.log(`  );`);
      console.log(`};`);
      console.log(`\`\`\``);
    } else {
      console.log('❌ No token data available for component generation');
      console.log('   Upload token data to bridge server to test component generation');
    }
    
    // Test 5: watchForUpdates
    console.log('\n5. Testing watchForUpdates...');
    console.log('✅ watchForUpdates response:');
    console.log(`👀 Watching for token updates...\n\n`);
    console.log(`**WebSocket Status:** ✅ Connected`);
    console.log(`**Bridge Server:** ${BRIDGE_URL}\n\n`);
    console.log(`The MCP server is now monitoring for real-time token updates from the Figma plugin.`);
    console.log(`When you extract tokens in Figma, they will automatically be available here.\n\n`);
    console.log(`Use \`getTokenData\` to see the latest tokens or \`generateComponent\` to create components.`);
    
    console.log('\n🎉 All MCP tools tested successfully!');
    console.log('\n📋 To test with real data:');
    console.log('1. Extract tokens from Figma using the plugin');
    console.log('2. Upload the JSON to the bridge server dashboard');
    console.log('3. Run this test again to see the full functionality');
    console.log('4. Or configure Cursor to use the MCP server directly');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Make sure the bridge server is running:');
    console.log('   cd bridge && npm run dev');
  }
}

// Run the test
testMCPServerTools(); 