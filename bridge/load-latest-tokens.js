import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const BRIDGE_URL = 'http://localhost:4000';
const DATA_DIR = path.join(process.cwd(), 'data');

async function loadLatestTokens() {
  try {
    console.log('🔄 Loading latest token data back into bridge server...\n');
    
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
    
    console.log(`📁 Loading: ${latestFile}`);
    console.log(`📅 Created: ${stats.mtime.toLocaleString()}`);
    console.log(`📊 Size: ${(stats.size / 1024).toFixed(1)} KB`);
    
    // Read the token data
    const tokenData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    
    // Send to bridge server
    console.log('\n🚀 Sending to bridge server...');
    
    // If the data has the processed structure, extract the original format
    let dataToSend = tokenData;
    if (tokenData.raw && tokenData.filtered) {
      // This is the processed format, extract the original tokens
      dataToSend = {
        tokens: tokenData.raw,
        selection: tokenData.selection,
        metadata: tokenData.metadata
      };
    } else if (tokenData.tokenStudio || tokenData.variables || tokenData.styles) {
      // This is the raw token data, send it directly
      dataToSend = {
        tokens: tokenData,
        selection: null,
        metadata: {}
      };
    }
    
    const response = await fetch(`${BRIDGE_URL}/api/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Successfully loaded token data!');
      console.log(`📦 Saved as: ${result.savedTo}`);
      console.log(`🔌 Clients notified: ${result.clientsNotified}`);
      console.log(`🌐 Dashboard: ${BRIDGE_URL}`);
      
      // Verify the data is now available
      console.log('\n🔍 Verifying data availability...');
      const verifyResponse = await fetch(`${BRIDGE_URL}/api/tokens`);
      if (verifyResponse.ok) {
        const data = await verifyResponse.json();
        const filtered = data.data.filtered || {};
        console.log('✅ Token data is now available:');
        console.log(`- Clean Tokens: ${Object.keys(filtered.cleanTokens || {}).length}`);
        console.log(`- Token Studio: ${Object.keys(filtered.tokenStudio || {}).length}`);
        console.log(`- Variables: ${Object.keys(filtered.variables || {}).length}`);
        console.log(`- Styles: ${Object.keys(filtered.styles || {}).length}`);
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error loading token data:', error.message);
  }
}

// Run the script
loadLatestTokens(); 