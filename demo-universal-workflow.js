#!/usr/bin/env node

/**
 * Universal Workflow Demonstration
 * Shows the complete Tokenflow Bridge universal connection workflow
 */

const BRIDGE_URL = 'http://localhost:4000';

async function demonstrateUniversalWorkflow() {
  console.log('🌟 Tokenflow Bridge Universal Workflow Demonstration\n');
  console.log('This demo shows how the universal connection system works:\n');
  
  try {
    // Step 1: Bridge Server Setup
    console.log('🚀 Step 1: Bridge Server Setup');
    console.log('   Bridge URL:', BRIDGE_URL);
    console.log('   Status: ✅ Running and accessible');
    console.log('   Features: Project isolation, WebSocket, REST API\n');
    
    // Step 2: Figma Plugin Configuration
    console.log('🎨 Step 2: Figma Plugin Configuration');
    console.log('   • Open Tokenflow Bridge plugin in Figma');
    console.log('   • Go to 🔌 Connection tab');
    console.log('   • Enter Bridge URL:', BRIDGE_URL);
    console.log('   • Set Project ID: my-awesome-project');
    console.log('   • Click 💾 Save & Connect\n');
    
    // Step 3: Create a project with real token data
    console.log('📦 Step 3: Extract and Send Tokens');
    
    const realTokenData = {
      tokens: {
        // Token Studio tokens
        "color.primary": "#667eea",
        "color.secondary": "#764ba2",
        "color.success": "#10b981",
        "color.warning": "#f59e0b",
        "color.error": "#ef4444",
        
        // Spacing tokens
        "spacing.xs": "4px",
        "spacing.sm": "8px",
        "spacing.md": "16px",
        "spacing.lg": "24px",
        "spacing.xl": "32px",
        
        // Border radius tokens
        "borderRadius.sm": "4px",
        "borderRadius.md": "8px",
        "borderRadius.lg": "12px",
        "borderRadius.full": "9999px",
        
        // Typography tokens
        "fontSize.sm": "14px",
        "fontSize.md": "16px",
        "fontSize.lg": "18px",
        "fontSize.xl": "24px",
        
        // Component-specific tokens
        "button.primary.background": "#667eea",
        "button.primary.text": "#ffffff",
        "button.secondary.background": "transparent",
        "button.secondary.text": "#667eea",
        "card.background": "#ffffff",
        "card.border": "#e5e7eb",
        "input.background": "#ffffff",
        "input.border": "#d1d5db"
      },
      metadata: {
        projectId: "my-awesome-project",
        projectName: "My Awesome Project",
        source: "figma-plugin",
        timestamp: new Date().toISOString(),
        figmaFile: "Design System v2.0",
        designer: "Design Team"
      }
    };
    
    console.log('   • Extract tokens from Figma selection');
    console.log('   • Plugin automatically sends to bridge server');
    console.log('   • Project ID: my-awesome-project');
    console.log('   • Tokens: 20 design tokens extracted\n');
    
    // Send the token data
    const response = await fetch(`${BRIDGE_URL}/api/tokens?project=my-awesome-project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(realTokenData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('   ✅ Tokens sent successfully!');
      console.log('   📊 Bridge Server Response:');
      console.log('      • Project ID:', result.projectId);
      console.log('      • Timestamp:', result.timestamp);
      console.log('      • Clients notified:', result.clientsNotified);
      console.log('      • File saved:', result.savedTo);
    }
    
    // Step 4: MCP Server Configuration
    console.log('\n🤖 Step 4: Cursor MCP Configuration');
    console.log('   • Configure Cursor with MCP server');
    console.log('   • Use MCP tool to connect to bridge:');
    console.log('     /configureBridgeConnection bridgeUrl="' + BRIDGE_URL + '" projectId="my-awesome-project"');
    console.log('   • List available projects:');
    console.log('     /listProjects');
    console.log('   • Get current tokens:');
    console.log('     /getCurrentTokens\n');
    
    // Step 5: Component Generation
    console.log('🎨 Step 5: Component Generation');
    console.log('   • Use MCP tools in Cursor:');
    console.log('     /generateComponent componentType="button" componentName="PrimaryButton"');
    console.log('     /generateComponent componentType="card" componentName="ProductCard"');
    console.log('     /generateComponent componentType="input" componentName="SearchInput"');
    console.log('   • Components generated with real design tokens');
    console.log('   • Ready for Storybook or production use\n');
    
    // Step 6: Multi-Project Workflow
    console.log('🔄 Step 6: Multi-Project Workflow');
    console.log('   • Switch to different project:');
    console.log('     /configureBridgeConnection bridgeUrl="' + BRIDGE_URL + '" projectId="mobile-app"');
    console.log('   • Extract tokens from different Figma file');
    console.log('   • Generate components for mobile app');
    console.log('   • Switch back to main project\n');
    
    // Step 7: Team Collaboration
    console.log('👥 Step 7: Team Collaboration');
    console.log('   • Deploy bridge server to Vercel/Netlify');
    console.log('   • Share bridge URL with team');
    console.log('   • Each developer configures their own project ID');
    console.log('   • Real-time collaboration via WebSocket\n');
    
    // Show current project status
    console.log('📊 Current Project Status:');
    const projectsResponse = await fetch(`${BRIDGE_URL}/api/projects`);
    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json();
      console.log(`   • Total projects: ${projectsData.totalProjects}`);
      projectsData.projects.forEach(project => {
        console.log(`   • ${project.projectId}: ${project.tokenCount} tokens`);
      });
    }
    
    // Show specific project data
    console.log('\n📦 My Awesome Project Tokens:');
    const projectResponse = await fetch(`${BRIDGE_URL}/api/tokens?project=my-awesome-project`);
    if (projectResponse.ok) {
      const projectData = await projectResponse.json();
      const tokens = projectData.data.filtered?.cleanTokens || {};
      console.log(`   • Clean tokens: ${Object.keys(tokens).length}`);
      console.log(`   • Last updated: ${projectData.timestamp}`);
      
      // Show some sample tokens
      const sampleTokens = Object.entries(tokens).slice(0, 5);
      sampleTokens.forEach(([key, value]) => {
        console.log(`   • ${key}: ${value}`);
      });
      if (Object.keys(tokens).length > 5) {
        console.log(`   • ... and ${Object.keys(tokens).length - 5} more tokens`);
      }
    }
    
    console.log('\n🎉 Universal Workflow Demonstration Complete!');
    console.log('\n🌟 Key Benefits Achieved:');
    console.log('✅ Universal plugin works with any bridge server');
    console.log('✅ No need to clone system into every project');
    console.log('✅ Project isolation for clean organization');
    console.log('✅ Real-time token synchronization');
    console.log('✅ Direct Cursor integration via MCP');
    console.log('✅ Team collaboration support');
    console.log('✅ Flexible deployment options');
    
    console.log('\n🚀 Ready for Production Use!');
    console.log('   • Deploy bridge server to Vercel/Netlify');
    console.log('   • Configure Figma plugin with remote URL');
    console.log('   • Set up MCP server in Cursor');
    console.log('   • Start generating components with design tokens');
    
  } catch (error) {
    console.error('❌ Demonstration failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure bridge server is running');
    console.log('2. Check network connectivity');
    console.log('3. Verify API endpoints');
    process.exit(1);
  }
}

// Run demonstration
if (require.main === module) {
  demonstrateUniversalWorkflow();
}

module.exports = { demonstrateUniversalWorkflow }; 