const fs = require('fs');

// Read the plugin UI file
let content = fs.readFileSync('ui.html', 'utf8');

// Find the sendToConnectedBridge function
const functionStart = content.indexOf('    async function sendToConnectedBridge(tokenData) {');
if (functionStart === -1) {
  console.log('❌ Could not find sendToConnectedBridge function');
  process.exit(1);
}

// Find the end of the function
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

// Create the corrected function with proper payload format
const newFunction = `    async function sendToConnectedBridge(tokenData) {
      if (!connectionConfig.isConnected) {
        alert('❌ Not connected to bridge server. Please configure connection first.');
        return;
      }
      
      try {
        console.log("Sending token data to bridge server...");
        console.log("Original data size:", JSON.stringify(tokenData).length);
        
        // Extract tokens directly from the raw data structure
        const cleanTokens = {};
        let tokenCount = 0;
        
        // Handle different data structures
        if (tokenData && tokenData.raw && Array.isArray(tokenData.raw)) {
          console.log("Processing raw array data...");
          tokenData.raw.forEach(item => {
            if (item && item.tokens && typeof item.tokens === "object") {
              Object.entries(item.tokens).forEach(([key, value]) => {
                // Look for tokenStudio_ keys (actual design tokens)
                if (key.startsWith('tokenStudio_') && !key.startsWith('tokenStudioDocument_')) {
                  if (typeof value === "string" && value.length > 0) {
                    // Clean the token name (remove tokenStudio_ prefix)
                    const cleanKey = key.replace('tokenStudio_', '');
                    cleanTokens[cleanKey] = value;
                    tokenCount++;
                    console.log("Found token:", cleanKey, "=", value);
                  }
                }
              });
            }
          });
        } else if (tokenData && typeof tokenData === "object") {
          console.log("Processing object data...");
          // Try to find tokens in the object structure
          const findTokens = (obj, path = '') => {
            if (!obj || typeof obj !== 'object') return;
            
            Object.entries(obj).forEach(([key, value]) => {
              if (key.startsWith('tokenStudio_') && !key.startsWith('tokenStudioDocument_')) {
                if (typeof value === "string" && value.length > 0) {
                  const cleanKey = key.replace('tokenStudio_', '');
                  cleanTokens[cleanKey] = value;
                  tokenCount++;
                  console.log("Found token:", cleanKey, "=", value);
                }
              } else if (typeof value === 'object' && value !== null) {
                findTokens(value, path + key + '.');
              }
            });
          };
          
          findTokens(tokenData);
        }
        
        console.log("Extracted", tokenCount, "clean tokens");
        
        // Create payload in the format the bridge server expects
        const payload = {
          tokens: cleanTokens,  // Bridge server expects 'tokens' property
          tokenCount,
          timestamp: new Date().toISOString(),
          source: 'figma-plugin'
        };
        
        console.log("Clean payload size:", JSON.stringify(payload).length);
        console.log("Data reduction:", Math.round((1 - JSON.stringify(payload).length / JSON.stringify(tokenData).length) * 100) + "%");
        
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
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          const result = await response.json();
          alert(\`✅ Tokens sent successfully!\\n\\nBridge: \${connectionConfig.bridgeUrl}\\nProject: \${connectionConfig.projectId || 'Default'}\\nTokens: \${result.tokenCount || payload.tokenCount}\`);
        } else {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          alert(\`❌ Failed to send tokens! Status: \${response.status}\\n\\nError: \${errorText}\`);
        }
      } catch (error) {
        console.error('Error sending tokens:', error);
        alert(\`❌ Failed to send tokens!\\n\\nError: \${error.message}\`);
      }
    }`;

// Replace the function
const beforeFunction = content.substring(0, functionStart);
const afterFunction = content.substring(functionEnd);

const newContent = beforeFunction + newFunction + afterFunction;

// Write the updated content back
fs.writeFileSync('ui.html', newContent, 'utf8');
console.log('✅ Fixed payload format! The plugin now sends tokens in the correct format.');
console.log('The bridge server expects "tokens" property, not "cleanTokens".'); 