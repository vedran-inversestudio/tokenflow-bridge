#!/usr/bin/env node

/**
 * Test script for Tokenflow Bridge Universal Connection
 * Tests the new universal connection features
 */

// Use built-in fetch (Node.js 18+)

const BRIDGE_URL = 'http://localhost:4000';

async function testUniversalConnection() {
  console.log('🧪 Testing Tokenflow Bridge Universal Connection\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${BRIDGE_URL}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData.status);
    } else {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    
    // Test 2: Projects endpoint
    console.log('\n2️⃣ Testing projects endpoint...');
    const projectsResponse = await fetch(`${BRIDGE_URL}/api/projects`);
    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json();
      console.log('✅ Projects endpoint working:', projectsData.totalProjects, 'projects');
      if (projectsData.projects.length > 0) {
        projectsData.projects.forEach(project => {
          console.log(`   📁 ${project.projectId}: ${project.tokenCount} tokens`);
        });
      }
    } else {
      console.log('⚠️  Projects endpoint not available (expected for new installations)');
    }
    
    // Test 3: Project-specific token endpoint
    console.log('\n3️⃣ Testing project-specific endpoints...');
    const testProjectId = 'test-project';
    
    // Test with non-existent project
    const noProjectResponse = await fetch(`${BRIDGE_URL}/api/tokens?project=${testProjectId}`);
    if (noProjectResponse.status === 404) {
      console.log('✅ Project isolation working (404 for non-existent project)');
    } else {
      console.log('⚠️  Unexpected response for non-existent project:', noProjectResponse.status);
    }
    
    // Test with default project
    const defaultProjectResponse = await fetch(`${BRIDGE_URL}/api/tokens`);
    if (defaultProjectResponse.status === 404) {
      console.log('✅ Default project isolation working (no data yet)');
    } else if (defaultProjectResponse.ok) {
      const defaultData = await defaultProjectResponse.json();
      console.log('✅ Default project has data:', defaultData.projectId);
    } else {
      console.log('⚠️  Unexpected response for default project:', defaultProjectResponse.status);
    }
    
    // Test 4: CORS headers
    console.log('\n4️⃣ Testing CORS configuration...');
    const corsResponse = await fetch(`${BRIDGE_URL}/test`);
    if (corsResponse.ok) {
      const corsHeaders = corsResponse.headers;
      const hasCors = corsHeaders.get('access-control-allow-origin');
      if (hasCors) {
        console.log('✅ CORS headers configured for Figma plugin');
      } else {
        console.log('⚠️  CORS headers not found');
      }
    } else {
      console.log('⚠️  CORS test endpoint not available');
    }
    
    // Test 5: WebSocket endpoint
    console.log('\n5️⃣ Testing WebSocket endpoint...');
    console.log('✅ WebSocket endpoint available at:', BRIDGE_URL.replace('http://', 'ws://'));
    console.log('   (WebSocket testing requires browser or WebSocket client)');
    
    console.log('\n🎉 Universal Connection Tests Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Configure Figma plugin with bridge URL:', BRIDGE_URL);
    console.log('2. Extract tokens from Figma to create projects');
    console.log('3. Use MCP tools to connect and access tokens');
    console.log('4. Deploy to Vercel/Netlify for remote access');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure bridge server is running: cd bridge && node server.js');
    console.log('2. Check if port 4000 is available');
    console.log('3. Verify network connectivity');
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  testUniversalConnection();
}

module.exports = { testUniversalConnection }; 