const fs = require('fs');

// Read the server file
let content = fs.readFileSync('server.js', 'utf8');

// Find the POST /api/tokens endpoint
const endpointStart = content.indexOf('app.post(\'/api/tokens\'');
if (endpointStart === -1) {
  console.log('❌ Could not find POST /api/tokens endpoint');
  process.exit(1);
}

// Find the end of the endpoint function
let braceCount = 0;
let endpointEnd = endpointStart;
let inFunction = false;

for (let i = endpointStart; i < content.length; i++) {
  if (content[i] === '{') {
    if (!inFunction) inFunction = true;
    braceCount++;
  } else if (content[i] === '}') {
    braceCount--;
    if (inFunction && braceCount === 0) {
      endpointEnd = i + 1;
      break;
    }
  }
}

// Create the new simplified endpoint
const newEndpoint = `app.post('/api/tokens', (req, res) => {
  try {
    const { project = 'default' } = req.query;
    const tokenData = req.body;
    
    console.log('📥 Received token data from plugin');
    console.log('Project:', project);
    console.log('Data type:', typeof tokenData);
    
    // Handle the new clean payload format from plugin
    if (tokenData && tokenData.cleanTokens && tokenData.source === 'figma-plugin') {
      // Plugin is already sending clean tokens
      const cleanTokens = tokenData.cleanTokens;
      const tokenCount = Object.keys(cleanTokens).length;
      
      console.log('✅ Received clean tokens from plugin:', tokenCount, 'tokens');
      
      // Store the clean tokens
      const projectData = {
        cleanTokens,
        tokenCount,
        timestamp: tokenData.timestamp || new Date().toISOString(),
        source: 'figma-plugin',
        lastUpdated: new Date().toISOString()
      };
      
      // Save to file
      const dataDir = \`data/\${project}\`;
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const filename = \`tokens-\${Date.now()}.json\`;
      fs.writeFileSync(\`\${dataDir}/\${filename}\`, JSON.stringify(projectData, null, 2));
      
      // Update current tokens
      currentTokens[project] = projectData;
      
      // Broadcast to WebSocket clients
      broadcastToClients({
        type: 'tokens_updated',
        project,
        tokenCount,
        timestamp: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: 'Clean tokens received and stored',
        tokenCount,
        project
      });
    } else {
      // Fallback for old format or other sources
      console.log('⚠️ Received legacy format, applying filtering...');
      
      const filteredData = filterTokenData(tokenData);
      const cleanTokens = extractCleanTokens(filteredData);
      const tokenCount = Object.keys(cleanTokens).length;
      
      const projectData = {
        cleanTokens,
        tokenCount,
        timestamp: new Date().toISOString(),
        source: 'bridge-filtered',
        lastUpdated: new Date().toISOString()
      };
      
      // Save to file
      const dataDir = \`data/\${project}\`;
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const filename = \`tokens-\${Date.now()}.json\`;
      fs.writeFileSync(\`\${dataDir}/\${filename}\`, JSON.stringify(projectData, null, 2));
      
      // Update current tokens
      currentTokens[project] = projectData;
      
      res.json({
        success: true,
        message: 'Tokens filtered and stored',
        tokenCount,
        project
      });
    }
  } catch (error) {
    console.error('❌ Error processing tokens:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
})`;

// Replace the endpoint
const beforeEndpoint = content.substring(0, endpointStart);
const afterEndpoint = content.substring(endpointEnd);

const newContent = beforeEndpoint + newEndpoint + afterEndpoint;

// Write the updated content back
fs.writeFileSync('server.js', newContent, 'utf8');
console.log('✅ Bridge server updated to handle clean plugin payload!');
console.log('The server will now properly process the clean tokens from the plugin.'); 