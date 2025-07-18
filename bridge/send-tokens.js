const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function sendTokensToBridge(tokenData) {
  try {
            const response = await fetch('http://localhost:4000/api/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Successfully sent to bridge server!');
      console.log(`📁 Saved as: ${result.savedTo}`);
      console.log(`🔌 Clients notified: ${result.clientsNotified}`);
      console.log(`🌐 Dashboard: http://localhost:8080`);
      return true;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error sending to bridge server:', error.message);
    return false;
  }
}

function saveToFile(tokenData) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `tokens-${timestamp}.json`;
  const filepath = path.join(__dirname, 'data', filename);
  
  // Ensure data directory exists
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(filepath, JSON.stringify(tokenData, null, 2));
  console.log(`💾 Saved to file: ${filepath}`);
  return filepath;
}

async function main() {
  console.log('🎨 Tokenflow Bridge - Token Sender');
  console.log('=====================================\n');
  
  console.log('📋 Instructions:');
  console.log('1. Copy the JSON data from the Figma plugin');
  console.log('2. Paste it here and press Enter');
  console.log('3. The script will send it to the bridge server\n');
  console.log('💡 Or provide a file path to load from file\n');
  
  rl.question('Paste the JSON data or enter a file path (e.g., ~/Downloads/tokenflow-tokens-*.json):\n', async (input) => {
    try {
      let tokenData;
      
      // Check if input looks like a file path
      if (input.trim().includes('/') || input.trim().includes('\\')) {
        // It's a file path
        const filepath = input.trim();
        console.log(`📁 Reading from file: ${filepath}`);
        
        if (!fs.existsSync(filepath)) {
          throw new Error(`File not found: ${filepath}`);
        }
        
        const fileContent = fs.readFileSync(filepath, 'utf8');
        tokenData = JSON.parse(fileContent);
        console.log('✅ File loaded successfully');
      } else {
        // It's JSON data
        tokenData = JSON.parse(input);
      }
      
      console.log('\n📦 Processing token data...');
      console.log(`📊 Token count: ${Object.keys(tokenData.tokens?.tokenStudio || {}).length}`);
      
      // Save to file first
      const filepath = saveToFile(tokenData);
      
      // Send to bridge server
      console.log('\n🚀 Sending to bridge server...');
      const success = await sendTokensToBridge(tokenData);
      
      if (success) {
        console.log('\n🎉 All done! Check the dashboard at http://localhost:8080');
      } else {
        console.log('\n💡 Data was saved to file but bridge server connection failed.');
        console.log('Make sure the bridge server is running: npm run dev');
      }
      
    } catch (error) {
      console.error('\n❌ Error parsing JSON:', error.message);
      console.log('Make sure you copied the complete JSON data from the plugin.');
    }
    
    rl.close();
  });
}

// Handle Ctrl+C gracefully
rl.on('SIGINT', () => {
  console.log('\n👋 Goodbye!');
  rl.close();
  process.exit(0);
});

main(); 