const fs = require('fs');

// Read the bridge server file
let content = fs.readFileSync('server.cjs', 'utf8');

// Find the API endpoint that calls filterTokenData
const endpointStart = content.indexOf('app.post(\'/api/tokens\'');
if (endpointStart === -1) {
  console.log('❌ Could not find /api/tokens endpoint');
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

// Create the simplified endpoint that directly stores clean tokens
const newEndpoint = `app.post('/api/tokens', (req, res) => {
  try {
    const { tokens, selection, metadata } = req.body;
    const projectId = req.query.project || metadata?.projectId || defaultProjectId;

    if (!tokens) {
      return res.status(400).json({
        error: 'Missing token data',
        message: 'Request body must contain tokens object'
      });
    }

    console.log('🔧 Storing clean tokens from plugin:', Object.keys(tokens).length, 'tokens');
    
    // Store the clean tokens directly - no filtering needed!
    const projectTokenData = {
      raw: tokens,  // The tokens are already clean from the plugin
      filtered: {
        tokenStudio: {},
        variables: {},
        styles: {},
        cleanTokens: tokens  // Store them directly in cleanTokens
      },
      selection: selection || null,
      metadata: { ...metadata, projectId },
      extractedAt: new Date().toISOString()
    };
    
    // Store the token data for the specific project
    projectTokens.set(projectId, projectTokenData);
    
    // Log the received data
    console.log('📦 Received token data:', {
      projectId,
      rawTokenCount: Object.keys(tokens).length,
      cleanTokenCount: Object.keys(tokens).length,  // Same as raw since they're already clean
      selection: selection || 'none',
      timestamp: projectTokenData.extractedAt
    });
    
    // Notify connected WebSocket clients
    const message = JSON.stringify({
      type: 'TOKENS_UPDATED',
      projectId,
      tokenCount: Object.keys(tokens).length,
      timestamp: projectTokenData.extractedAt
    });
    
    let clientsNotified = 0;
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        clientsNotified++;
      }
    });
    
    // Save to file
    const filename = \`tokens-\${Date.now()}.json\`;
    fs.writeFileSync(filename, JSON.stringify(projectTokenData, null, 2));
    
    res.json({
      success: true,
      message: 'Token data received and stored',
      timestamp: projectTokenData.extractedAt,
      projectId,
      savedTo: filename,
      clientsNotified
    });
    
  } catch (error) {
    console.error('Error processing token data:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});`;

// Replace the endpoint
const beforeEndpoint = content.substring(0, endpointStart);
const afterEndpoint = content.substring(endpointEnd);

const newContent = beforeEndpoint + newEndpoint + afterEndpoint;

// Write the updated content back
fs.writeFileSync('server.cjs', newContent, 'utf8');
console.log('✅ Fixed API endpoint! Now it directly stores clean tokens without any filtering.');
console.log('The plugin handles all filtering, server just stores the clean tokens.'); 