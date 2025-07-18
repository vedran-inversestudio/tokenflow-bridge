import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function sanitizeTokens(rawData) {
  const sanitized = {
    tokenStudio: {},
    variables: {},
    styles: {},
    cleanTokens: {}
  };

  // Extract only meaningful Token Studio tokens (skip encoded blobs)
  if (rawData.tokenStudio) {
    Object.entries(rawData.tokenStudio).forEach(([key, value]) => {
      // Skip encoded blobs and metadata
      if (typeof value === 'string' && 
          !value.includes('ᯡ') && 
          !value.includes('䈌') && 
          !key.includes('Document_') &&
          !key.includes('_meta') &&
          value.length < 100) { // Skip very long encoded strings
        sanitized.tokenStudio[key] = value;
      }
    });
  }

  // Extract Variables
  if (rawData.variables) {
    Object.entries(rawData.variables).forEach(([key, value]) => {
      if (value && typeof value === 'object' && value.value !== undefined) {
        sanitized.variables[key] = {
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
        sanitized.styles[key] = {
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
  Object.entries(sanitized.tokenStudio).forEach(([key, value]) => {
    // Clean up the key name
    const cleanKey = key.replace('Type=Info_tokenStudio_', '').replace('tokenStudio_', '');
    cleanTokens[cleanKey] = value;
  });

  // Add Variables
  Object.entries(sanitized.variables).forEach(([key, value]) => {
    cleanTokens[`var_${key}`] = value.value;
  });

  // Add Styles
  Object.entries(sanitized.styles).forEach(([key, value]) => {
    cleanTokens[`style_${key}`] = value.name;
  });

  sanitized.cleanTokens = cleanTokens;
  
  return sanitized;
}

async function createSanitizedTokens() {
  try {
    console.log('🧹 Creating sanitized token data...\n');
    
    // Find the most recent token file
    const files = fs.readdirSync(DATA_DIR)
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        const timeA = parseInt(a.replace('tokens-', '').replace('.json', ''));
        const timeB = parseInt(b.replace('tokens-', '').replace('.json', ''));
        return timeB - timeA; // Most recent first
      });
    
    if (files.length === 0) {
      console.log('❌ No token files found in data directory');
      return;
    }
    
    const latestFile = files[0];
    const filepath = path.join(DATA_DIR, latestFile);
    const stats = fs.statSync(filepath);
    
    console.log(`📁 Processing: ${latestFile}`);
    console.log(`📅 Created: ${stats.mtime.toLocaleString()}`);
    console.log(`📊 Size: ${(stats.size / 1024).toFixed(1)} KB`);
    
    // Read the raw token data
    const rawData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    
    // Extract the actual token data (not the processed format)
    let tokenData = rawData;
    if (rawData.raw) {
      tokenData = rawData.raw;
    }
    
    // Sanitize the tokens
    const sanitized = sanitizeTokens(tokenData);
    
    // Create clean data structure for bridge server
    const cleanData = {
      tokens: sanitized,
      selection: rawData.selection || null,
      metadata: rawData.metadata || {},
      extractedAt: new Date().toISOString()
    };
    
    // Save sanitized version
    const sanitizedFilename = `sanitized-tokens-${Date.now()}.json`;
    const sanitizedFilepath = path.join(DATA_DIR, sanitizedFilename);
    fs.writeFileSync(sanitizedFilepath, JSON.stringify(cleanData, null, 2));
    
    console.log('\n✅ Sanitized token data created!');
    console.log(`📦 Saved as: ${sanitizedFilename}`);
    console.log(`📊 Clean Tokens: ${Object.keys(sanitized.cleanTokens).length}`);
    console.log(`🎨 Token Studio: ${Object.keys(sanitized.tokenStudio).length}`);
    console.log(`📝 Variables: ${Object.keys(sanitized.variables).length}`);
    console.log(`🎭 Styles: ${Object.keys(sanitized.styles).length}`);
    
    // Show some example tokens
    console.log('\n🔍 Example clean tokens:');
    Object.entries(sanitized.cleanTokens).slice(0, 5).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`);
    });
    
    return cleanData;
    
  } catch (error) {
    console.error('❌ Error sanitizing tokens:', error.message);
  }
}

// Run the script
createSanitizedTokens(); 