import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const BRIDGE_URL = 'http://localhost:4000';
const DATA_DIR = path.join(process.cwd(), 'data');

async function diagnoseFiltering() {
  try {
    console.log('🔍 Diagnosing token filtering issues...\n');
    
    // Check bridge server status
    console.log('1. Checking bridge server status...');
    try {
      const healthResponse = await fetch(`${BRIDGE_URL}/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log(`✅ Bridge server is running (uptime: ${Math.round(healthData.uptime)}s)`);
      } else {
        console.log('❌ Bridge server is not responding');
        return;
      }
    } catch (error) {
      console.log('❌ Cannot connect to bridge server:', error.message);
      return;
    }
    
    // Check current token data
    console.log('\n2. Checking current token data...');
    try {
      const response = await fetch(`${BRIDGE_URL}/api/tokens`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Token data available');
        console.log(`   - Project ID: ${data.projectId}`);
        console.log(`   - Timestamp: ${data.timestamp}`);
        console.log(`   - Has filtered data: ${!!data.data.filtered}`);
        console.log(`   - Has raw data: ${!!data.data.raw}`);
        
        if (data.data.filteringStatus) {
          console.log(`   - Filtering version: ${data.data.filteringStatus.version}`);
          console.log(`   - Filtering applied: ${data.data.filteringStatus.applied}`);
        }
        
        // Analyze filtered vs raw data
        if (data.data.filtered && data.data.raw) {
          const rawTokenCount = Object.keys(data.data.raw.tokenStudio || {}).length;
          const filteredTokenCount = Object.keys(data.data.filtered.tokenStudio || {}).length;
          const cleanTokenCount = Object.keys(data.data.filtered.cleanTokens || {}).length;
          
          console.log(`   - Raw Token Studio tokens: ${rawTokenCount}`);
          console.log(`   - Filtered Token Studio tokens: ${filteredTokenCount}`);
          console.log(`   - Clean tokens: ${cleanTokenCount}`);
          console.log(`   - Filtering ratio: ${((filteredTokenCount / rawTokenCount) * 100).toFixed(1)}%`);
          
          // Check for problematic data in raw tokens
          console.log('\n3. Analyzing raw token data for problematic content...');
          const rawTokens = data.data.raw.tokenStudio || {};
          let problematicCount = 0;
          let japaneseCount = 0;
          let encodedCount = 0;
          
          Object.entries(rawTokens).forEach(([key, value]) => {
            if (typeof value === 'string') {
              // Check for Japanese characters
              const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
              if (japaneseRegex.test(value)) {
                japaneseCount++;
                console.log(`   - Japanese chars in "${key}": ${value.substring(0, 50)}...`);
              }
              
              // Check for encoded/binary data
              const specialCharRatio = value.split('').filter(char => {
                const code = char.charCodeAt(0);
                return !((code >= 48 && code <= 57) || // 0-9
                         (code >= 65 && code <= 90) || // A-Z
                         (code >= 97 && code <= 122) || // a-z
                         (code === 32) || // space
                         (code >= 33 && code <= 47) || // common punctuation
                         (code >= 58 && code <= 64) ||
                         (code >= 91 && code <= 96) ||
                         (code >= 123 && code <= 126));
              }).length / value.length;
              
              if (specialCharRatio > 0.6) {
                encodedCount++;
                console.log(`   - Encoded data in "${key}": ${value.substring(0, 50)}...`);
              }
              
              // Check for Token Studio document blobs
              if (key.includes('tokenStudioDocument') || value.includes('tokenStudioDocument')) {
                problematicCount++;
                console.log(`   - Token Studio blob in "${key}": ${value.substring(0, 50)}...`);
              }
            }
          });
          
          console.log(`\n   Summary of problematic data:`);
          console.log(`   - Japanese character tokens: ${japaneseCount}`);
          console.log(`   - Encoded/binary tokens: ${encodedCount}`);
          console.log(`   - Token Studio blobs: ${problematicCount}`);
          console.log(`   - Total problematic: ${japaneseCount + encodedCount + problematicCount}`);
        }
      } else {
        console.log('❌ No token data available');
      }
    } catch (error) {
      console.log('❌ Error checking token data:', error.message);
    }
    
    // Check file system for token files
    console.log('\n4. Checking token files on disk...');
    if (fs.existsSync(DATA_DIR)) {
      const files = fs.readdirSync(DATA_DIR)
        .filter(file => file.endsWith('.json'))
        .sort((a, b) => {
          const timeA = parseInt(a.replace('tokens-', '').replace('.json', ''));
          const timeB = parseInt(b.replace('tokens-', '').replace('.json', ''));
          return timeB - timeA; // Most recent first
        });
      
      if (files.length > 0) {
        console.log(`✅ Found ${files.length} token files`);
        console.log(`   - Latest: ${files[0]}`);
        
        // Analyze the latest file
        const latestFile = path.join(DATA_DIR, files[0]);
        const fileData = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
        
        if (fileData.filtered && fileData.raw) {
          const rawTokenCount = Object.keys(fileData.raw.tokenStudio || {}).length;
          const filteredTokenCount = Object.keys(fileData.filtered.tokenStudio || {}).length;
          console.log(`   - File has filtered data: ✅`);
          console.log(`   - Raw tokens: ${rawTokenCount}`);
          console.log(`   - Filtered tokens: ${filteredTokenCount}`);
        } else {
          console.log(`   - File structure: ${Object.keys(fileData).join(', ')}`);
        }
      } else {
        console.log('❌ No token files found');
      }
    } else {
      console.log('❌ Data directory does not exist');
    }
    
    console.log('\n5. Recommendations:');
    console.log('   - If filtering is not working, restart the bridge server');
    console.log('   - If you see Japanese characters, the filtering should remove them');
    console.log('   - Check that the plugin is sending data to the correct bridge server');
    console.log('   - Verify the MCP server is connecting to the same bridge server');
    
  } catch (error) {
    console.error('❌ Error during diagnosis:', error.message);
  }
}

// Run the diagnosis
diagnoseFiltering(); 