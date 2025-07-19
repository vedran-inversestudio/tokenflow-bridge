const fs = require('fs');

// Read the plugin UI file
let content = fs.readFileSync('ui.html', 'utf8');

// New enhanced filtering function that extracts clean tokens
const newFilterFunction = `    function filterTokenData(tokenData) {
      if (!tokenData || typeof tokenData !== "object") return tokenData;
      
      // Extract clean tokens from the raw data
      const cleanTokens = {};
      let tokenCount = 0;
      
      if (tokenData.raw && Array.isArray(tokenData.raw)) {
        tokenData.raw.forEach(item => {
          if (item && item.tokens && typeof item.tokens === "object") {
            for (const [key, value] of Object.entries(item.tokens)) {
              // Extract tokenStudio_ keys (actual design tokens)
              if (key.startsWith('tokenStudio_') && !key.startsWith('tokenStudioDocument_')) {
                if (typeof value === "string" && value.length > 0) {
                  // Clean the token name (remove tokenStudio_ prefix)
                  const cleanKey = key.replace('tokenStudio_', '');
                  cleanTokens[cleanKey] = value;
                  tokenCount++;
                }
              }
            }
          }
        });
      }
      
      // Return a much smaller, clean payload
      const filteredData = {
        cleanTokens,
        tokenCount,
        timestamp: new Date().toISOString(),
        source: 'figma-plugin'
      };
      
      console.log("Extracted", tokenCount, "clean tokens");
      return filteredData;
    }`;

// Find and replace the old filtering function
const oldFunctionStart = content.indexOf('    function filterTokenData(tokenData) {');
const oldFunctionEnd = content.indexOf('    }', oldFunctionStart) + 4;

if (oldFunctionStart !== -1 && oldFunctionEnd !== -1) {
  const beforeFunction = content.substring(0, oldFunctionStart);
  const afterFunction = content.substring(oldFunctionEnd);
  
  const newContent = beforeFunction + newFilterFunction + afterFunction;
  
  // Write the updated content back
  fs.writeFileSync('ui.html', newContent, 'utf8');
  console.log('✅ Enhanced filtering function installed successfully!');
  console.log('The plugin will now extract clean token names before sending to bridge server.');
} else {
  console.log('❌ Could not find the filtering function to replace');
} 