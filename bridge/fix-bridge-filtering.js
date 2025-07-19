const fs = require('fs');

// Read the server file
let content = fs.readFileSync('server.js', 'utf8');

// Replace the restrictive regex check for tokenStudio_ values with a more permissive approach
const oldPattern = `    // For tokenStudio_ keys (actual tokens), be more permissive
    if (key && key.startsWith('tokenStudio_') && !key.startsWith('tokenStudioDocument_')) {
      // Allow common token name characters: letters, numbers, dots, hyphens, underscores
      const validChars = /^[a-zA-Z0-9._-]+$/;
      return !validChars.test(value);
    }`;

const newPattern = `    // For tokenStudio_ keys (actual tokens), be more permissive
    if (key && key.startsWith('tokenStudio_') && !key.startsWith('tokenStudioDocument_')) {
      // For tokenStudio_ values, be very permissive - just filter out obvious binary data
      if (typeof value === 'string' && value.length > 1000) {
        return true; // Filter out very long values
      }
      if (typeof value === 'string') {
        const asciiRatio = value.split('').filter(char => char.charCodeAt(0) < 128).length / value.length;
        if (asciiRatio < 0.3) {
          return true; // Filter out mostly non-ASCII values
        }
      }
      return false; // Keep all other tokenStudio_ values
    }`;

content = content.replace(oldPattern, newPattern);

// Write the updated content back
fs.writeFileSync('server.js', content);

console.log('✅ Bridge server filtering function updated successfully!');
console.log('🔄 Restart the bridge server for changes to take effect.'); 