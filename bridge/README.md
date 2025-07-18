# Tokenflow Bridge Server

A local Node.js/Express server that receives design token data from the Tokenflow Bridge Figma plugin and exposes it via REST API and WebSocket endpoints for integration with design token pipelines.

## 🚀 Features

- **REST API**: Receive and serve token data via HTTP endpoints
- **WebSocket Support**: Real-time token data streaming
- **Token History**: Automatic storage and retrieval of historical token data
- **Web Dashboard**: Beautiful real-time interface to view extracted tokens
- **CORS Support**: Configured for Figma plugin integration
- **File Storage**: Automatic backup of token data to JSON files
- **Health Monitoring**: Built-in health check endpoint

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager

## 🛠️ Installation

1. **Navigate to the bridge directory**:
   ```bash
   cd bridge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Access the dashboard**:
   - Open your browser to `http://localhost:3000`
   - You should see the Tokenflow Bridge dashboard

## 🔌 API Endpoints

### Health Check
```http
GET /health
```
Returns server status and connection information.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "clients": 2
}
```

### Get Current Token Data
```http
GET /api/tokens
```
Retrieves the most recently extracted token data.

**Response:**
```json
{
  "data": {
    "tokens": {
      "tokenStudio": { ... },
      "variables": { ... },
      "styles": { ... },
      "rawData": { ... }
    },
    "selection": [...],
    "metadata": { ... },
    "extractedAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "figma-plugin"
}
```

### Send Token Data (from Figma Plugin)
```http
POST /api/tokens
Content-Type: application/json

{
  "tokens": {
    "tokenStudio": { ... },
    "variables": { ... },
    "styles": { ... },
    "rawData": { ... }
  },
  "selection": [...],
  "metadata": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token data received and stored",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "savedTo": "tokens-1705312200000.json",
  "clientsNotified": 2
}
```

### Get Token History
```http
GET /api/tokens/history
```
Returns a list of historical token extractions (last 10).

**Response:**
```json
{
  "history": [
    {
      "filename": "tokens-1705312200000.json",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "size": 2048
    }
  ]
}
```

### Get Specific Historical Data
```http
GET /api/tokens/history/:filename
```
Retrieves token data from a specific historical file.

## 🔌 WebSocket API

Connect to `ws://localhost:3000` for real-time updates.

### Message Format
```json
{
  "type": "tokenData",
  "data": {
    "tokens": { ... },
    "selection": [...],
    "metadata": { ... },
    "extractedAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🎨 Web Dashboard

The server includes a beautiful web dashboard at `http://localhost:3000` that provides:

- **Real-time token display** with WebSocket updates
- **Token history** with clickable entries
- **Connection status** indicators
- **API documentation** reference
- **Responsive design** for all devices

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

### CORS Configuration

The server is configured to accept requests from:
- `http://localhost:3000`
- `https://www.figma.com`

To modify CORS settings, edit the `cors` configuration in `server.js`.

## 📁 File Structure

```
bridge/
├── package.json          # Dependencies and scripts
├── server.js            # Main server file
├── public/
│   └── index.html       # Web dashboard
├── data/                # Token data storage (auto-created)
└── README.md           # This file
```

## 🔗 Integration Examples

### With Tokenflow
```javascript
// Fetch token data from bridge server
const response = await fetch('http://localhost:3000/api/tokens');
const tokenData = await response.json();

// Process with Tokenflow
const processedTokens = await tokenflow.process(tokenData.data.tokens);
```

### With WebSocket (Real-time)
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = function(event) {
  const message = JSON.parse(event.data);
  if (message.type === 'tokenData') {
    console.log('New token data:', message.data);
    // Process in real-time
  }
};
```

### With cURL
```bash
# Get current tokens
curl http://localhost:3000/api/tokens

# Send token data
curl -X POST http://localhost:3000/api/tokens \
  -H "Content-Type: application/json" \
  -d '{"tokens": {...}}'

# Health check
curl http://localhost:3000/health
```

## 🚨 Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Use a different port
PORT=3001 npm start
```

### CORS Issues
If you encounter CORS errors, check that your Figma plugin is sending requests from an allowed origin.

### WebSocket Connection Issues
- Ensure the server is running
- Check browser console for connection errors
- Verify WebSocket URL is correct

### File Permission Issues
If the server can't create the `data/` directory:
```bash
# Create directory manually
mkdir data
chmod 755 data
```

## 🔄 Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restart on file changes.

### Testing
```bash
npm test
```

### Logs
The server provides detailed console logging:
- 🔌 WebSocket connections
- 📦 Token data received
- ❌ Errors and issues
- 🛑 Graceful shutdown

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Made with ❤️ for the design token community** 