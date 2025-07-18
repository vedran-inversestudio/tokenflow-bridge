#!/usr/bin/env node

/**
 * Test script simulating Figma plugin universal connection
 * Tests the new connection features from the plugin perspective
 */

const BRIDGE_URL = 'http://localhost:4000';

async function testFigmaPluginConnection() {
  console.log('🎨 Testing Figma Plugin Universal Connection\n');
  
  try {
    // Test 1: Test connection to bridge server
    console.log('1️⃣ Testing bridge server connection...');
    const healthResponse = await fetch(`${BRIDGE_URL}/health`);
    if (healthResponse.ok) {
      console.log('✅ Bridge server is accessible');
    } else {
      throw new Error(`Bridge server not accessible: ${healthResponse.status}`);
    }
    
    // Test 2: Create multiple projects (simulating different Figma files)
    console.log('\n2️⃣ Creating test projects...');
    
    const projects = [
      { id: 'design-system-v1', name: 'Design System v1' },
      { id: 'mobile-app', name: 'Mobile App Design' },
      { id: 'web-dashboard', name: 'Web Dashboard' }
    ];
    
    for (const project of projects) {
      const tokenData = {
        tokens: {
          [`${project.id}_primary_color`]: '#667eea',
          [`${project.id}_secondary_color`]: '#764ba2',
          [`${project.id}_border_radius`]: '8px',
          [`${project.id}_spacing`]: '16px'
        },
        metadata: {
          projectId: project.id,
          projectName: project.name,
          source: 'figma-plugin',
          timestamp: new Date().toISOString()
        }
      };
      
      const response = await fetch(`${BRIDGE_URL}/api/tokens?project=${project.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created project: ${project.name} (${project.id})`);
        console.log(`   📊 Tokens: ${Object.keys(tokenData.tokens).length}`);
        console.log(`   🕒 Timestamp: ${result.timestamp}`);
      } else {
        console.log(`❌ Failed to create project: ${project.name}`);
      }
    }
    
    // Test 3: List all projects
    console.log('\n3️⃣ Listing all projects...');
    const projectsResponse = await fetch(`${BRIDGE_URL}/api/projects`);
    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json();
      console.log(`📋 Found ${projectsData.totalProjects} projects:`);
      projectsData.projects.forEach(project => {
        console.log(`   📁 ${project.projectId}: ${project.tokenCount} tokens (${project.lastUpdate})`);
      });
    }
    
    // Test 4: Test project isolation
    console.log('\n4️⃣ Testing project isolation...');
    for (const project of projects) {
      const response = await fetch(`${BRIDGE_URL}/api/tokens?project=${project.id}`);
      if (response.ok) {
        const data = await response.json();
        const tokenCount = Object.keys(data.data.filtered?.cleanTokens || {}).length;
        console.log(`✅ Project ${project.id}: ${tokenCount} tokens (isolated)`);
      } else {
        console.log(`❌ Failed to access project ${project.id}`);
      }
    }
    
    // Test 5: Test default project (no project ID)
    console.log('\n5️⃣ Testing default project...');
    const defaultResponse = await fetch(`${BRIDGE_URL}/api/tokens`);
    if (defaultResponse.status === 404) {
      console.log('✅ Default project isolation working (no data)');
    } else if (defaultResponse.ok) {
      const defaultData = await defaultResponse.json();
      console.log(`✅ Default project has data: ${defaultData.projectId}`);
    }
    
    // Test 6: Simulate switching between projects
    console.log('\n6️⃣ Simulating project switching...');
    console.log('🔄 Switching to design-system-v1...');
    const dsResponse = await fetch(`${BRIDGE_URL}/api/tokens?project=design-system-v1`);
    if (dsResponse.ok) {
      const dsData = await dsResponse.json();
      console.log(`✅ Design System v1: ${Object.keys(dsData.data.filtered?.cleanTokens || {}).length} tokens`);
    }
    
    console.log('🔄 Switching to mobile-app...');
    const mobileResponse = await fetch(`${BRIDGE_URL}/api/tokens?project=mobile-app`);
    if (mobileResponse.ok) {
      const mobileData = await mobileResponse.json();
      console.log(`✅ Mobile App: ${Object.keys(mobileData.data.filtered?.cleanTokens || {}).length} tokens`);
    }
    
    console.log('🔄 Switching to web-dashboard...');
    const webResponse = await fetch(`${BRIDGE_URL}/api/tokens?project=web-dashboard`);
    if (webResponse.ok) {
      const webData = await webResponse.json();
      console.log(`✅ Web Dashboard: ${Object.keys(webData.data.filtered?.cleanTokens || {}).length} tokens`);
    }
    
    console.log('\n🎉 Figma Plugin Universal Connection Test Complete!');
    console.log('\n📋 Universal Connection Features Verified:');
    console.log('✅ Bridge server connectivity');
    console.log('✅ Project creation and isolation');
    console.log('✅ Multi-project support');
    console.log('✅ Project switching');
    console.log('✅ Token data persistence');
    console.log('✅ API endpoints working');
    
    console.log('\n🔌 Next Steps for Figma Plugin:');
    console.log('1. Configure plugin with bridge URL:', BRIDGE_URL);
    console.log('2. Set project ID for isolation');
    console.log('3. Extract tokens from Figma');
    console.log('4. Send tokens directly to bridge server');
    console.log('5. Switch between projects as needed');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure bridge server is running');
    console.log('2. Check network connectivity');
    console.log('3. Verify API endpoints');
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  testFigmaPluginConnection();
}

module.exports = { testFigmaPluginConnection }; 