const fs = require('fs');

// Read the plugin UI file
let content = fs.readFileSync('ui.html', 'utf8');

// Find the sendToConnectedBridge function
const functionStart = content.indexOf('    async function sendToConnectedBridge(tokenData) {');
if (functionStart === -1) {
  console.log('❌ Could not find sendToConnectedBridge function');
  process.exit(1);
}

// Find the end of the function (look for the closing brace)
let braceCount = 0;
let functionEnd = functionStart;
let inFunction = false;

for (let i = functionStart; i < content.length; i++) {
  if (content[i] === '{') {
    if (!inFunction) inFunction = true;
    braceCount++;
  } else if (content[i] === '}') {
    braceCount--;
    if (inFunction && braceCount === 0) {
      functionEnd = i + 1;
      break;
    }
  }
}

// Extract the current function
const currentFunction = content.substring(functionStart, functionEnd);

// Create the new enhanced function
const newFunction = `    async function sendToConnectedBridge(tokenData) {
      if (!connectionConfig.isConnected) {
        alert('❌ Not connected to bridge server. Please configure connection first.');
        return;
      }
      
      try {
        console.log("Sending token data to bridge server...");
        console.log("Original data size:", JSON.stringify(tokenData).length);
        
        // Use the existing extractAllTokens function to get clean tokens
        const allTokens = extractAllTokens(tokenData);
        console.log("Extracted", allTokens.length, "clean tokens");
        
        // Create a clean, minimal payload
        const cleanPayload = {
          cleanTokens: {},
          tokenCount: allTokens.length,
          timestamp: new Date().toISOString(),
          source: 'figma-plugin'
        };
        
        // Convert the extracted tokens to a clean format
        allTokens.forEach(token => {
          if (token.name && token.name !== '[Filtered Token Studio Document Data]') {
            cleanPayload.cleanTokens[token.type] = token.name;
          }
        });
        
        console.log("Clean payload size:", JSON.stringify(cleanPayload).length);
        console.log("Data reduction:", Math.round((1 - JSON.stringify(cleanPayload).length / JSON.stringify(tokenData).length) * 100) + "%");
        
        const url = connectionConfig.projectId 
          ? \`\${connectionConfig.bridgeUrl}/api/tokens?project=\${connectionConfig.projectId}\`
          : \`\${connectionConfig.bridgeUrl}/api/tokens\`;
        
        const headers = {
          'Content-Type': 'application/json',
          ...(connectionConfig.connectionKey && { 'Authorization': \`Bearer \${connectionConfig.connectionKey}\` })
        };
        
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(cleanPayload)
        });
        
        if (response.ok) {
          const result = await response.json();
          alert(\`✅ Tokens sent successfully!\\n\\nBridge: \${connectionConfig.bridgeUrl}\\nProject: \${connectionConfig.projectId || 'Default'}\\nTokens: \${result.tokenCount || cleanPayload.tokenCount}\`);
        } else {
          alert(\`❌ Failed to send tokens! Status: \${response.status}\`);
        }
      } catch (error) {
        alert(\`❌ Failed to send tokens!\\n\\nError: \${error.message}\`);
      }
    }`;

// Replace the function
const beforeFunction = content.substring(0, functionStart);
const afterFunction = content.substring(functionEnd);

const newContent = beforeFunction + newFunction + afterFunction;

// Write the updated content back
fs.writeFileSync('ui.html', newContent, 'utf8');
console.log('✅ Enhanced sending function installed successfully!');
console.log('The plugin will now extract clean tokens using the existing filtering system.'); 