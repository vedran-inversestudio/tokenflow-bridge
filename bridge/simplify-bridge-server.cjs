const fs = require('fs');

// Read the bridge server file
let content = fs.readFileSync('server.cjs', 'utf8');

// Find the filterTokenData function
const functionStart = content.indexOf('function filterTokenData(rawData) {');
if (functionStart === -1) {
  console.log('❌ Could not find filterTokenData function');
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

// Create a simplified function that just stores clean tokens directly
const newFunction = `function filterTokenData(rawData) {
  if (!rawData || typeof rawData !== 'object') {
    return null;
  }

  const filtered = {
    tokenStudio: {},
    variables: {},
    styles: {},
    cleanTokens: {}
  };

  // Handle clean tokens from plugin - store them directly
  if (rawData.tokens && typeof rawData.tokens === 'object') {
    console.log('🔧 Storing clean tokens from plugin:', Object.keys(rawData.tokens).length, 'tokens');
    
    // Store tokens directly in cleanTokens
    Object.entries(rawData.tokens).forEach(([key, value]) => {
      filtered.cleanTokens[key] = value;
    });
    
    return filtered;
  }

  // Fallback for backward compatibility (shouldn't be needed anymore)
  console.log('⚠️  Received legacy token format, but plugin should send clean tokens');
  return filtered;
}`;

// Replace the function
const beforeFunction = content.substring(0, functionStart);
const afterFunction = content.substring(functionEnd);

const newContent = beforeFunction + newFunction + afterFunction;

// Write the updated content back
fs.writeFileSync('server.cjs', newContent, 'utf8');
console.log('✅ Simplified bridge server! Now it just stores clean tokens directly.');
console.log('No more complex filtering - the plugin handles all the filtering.'); 