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

// Create the updated function that handles clean tokens
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

  // Handle the new clean token format from the plugin
  if (rawData.tokens && typeof rawData.tokens === 'object') {
    console.log('🔧 Processing clean tokens from plugin:', Object.keys(rawData.tokens).length, 'tokens');
    
    // Store tokens directly in cleanTokens
    Object.entries(rawData.tokens).forEach(([key, value]) => {
      filtered.cleanTokens[key] = value;
      
      // Also categorize them for backward compatibility
      if (typeof value === 'string' && value.includes('.')) {
        // This looks like a Token Studio reference
        filtered.tokenStudio[key] = value;
      } else {
        // This might be a variable or style
        filtered.variables[key] = {
          name: key,
          value: value,
          type: typeof value
        };
      }
    });
    
    return filtered;
  }

  // Original logic for backward compatibility
  // Extract Token Studio data
  if (rawData.tokenStudio) {
    Object.entries(rawData.tokenStudio).forEach(([key, value]) => {
      // Only include actual token values, skip metadata
      if (typeof value === 'string' && value.includes('.')) {
        filtered.tokenStudio[key] = value;
      }
    });
  }

  // Extract Variables
  if (rawData.variables) {
    Object.entries(rawData.variables).forEach(([key, value]) => {
      if (value && typeof value === 'object' && value.value !== undefined) {
        filtered.variables[key] = {
          name: value.name || key,
          value: value.value,
          type: value.type || 'unknown'
        };
      }
    });
  }

  // Extract Styles
  if (rawData.styles) {
    Object.entries(rawData.styles).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        filtered.styles[key] = {
          name: value.name || key,
          description: value.description || '',
          key: value.key || key
        };
      }
    });
  }

  // Create a clean, flattened token list
  const cleanTokens = {};
  
  // Add Token Studio tokens
  Object.entries(filtered.tokenStudio).forEach(([key, value]) => {
    cleanTokens[key] = value;
  });

  // Add Variables
  Object.entries(filtered.variables).forEach(([key, value]) => {
    cleanTokens[\`var_\${key}\`] = value.value;
  });

  // Add Styles
  Object.entries(filtered.styles).forEach(([key, value]) => {
    cleanTokens[\`style_\${key}\`] = value.name;
  });

  filtered.cleanTokens = cleanTokens;
  
  return filtered;
}`;

// Replace the function
const beforeFunction = content.substring(0, functionStart);
const afterFunction = content.substring(functionEnd);

const newContent = beforeFunction + newFunction + afterFunction;

// Write the updated content back
fs.writeFileSync('server.cjs', newContent, 'utf8');
console.log('✅ Updated bridge server to handle clean tokens from plugin!');
console.log('The server now properly processes the new token format.'); 