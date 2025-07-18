# �� Tokenflow Bridge

A universal design token bridge system that connects Figma to any project's development workflow. Extract design tokens from Figma selections and seamlessly integrate them with your local development environment, MCP servers, and Cursor IDE.

## ✨ Features

- **🔌 Universal Connection**: Connect to any project's bridge server
- **🎯 Real-time Token Extraction**: Extract tokens from Figma selections instantly
- **🔍 Smart Linting**: Detect hardcoded styles without token assignments
- **📊 Live Dashboard**: Visualize and manage token data in real-time
- **🤖 MCP Integration**: Generate components directly in Cursor IDE
- **🌐 WebSocket Support**: Real-time updates across all connected clients
- **📦 Token Sanitization**: Clean and optimize token data automatically
- **🔐 Project Isolation**: Separate token data by project ID

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Figma Plugin  │───▶│  Bridge Server  │───▶│   MCP Server    │
│                 │    │                 │    │                 │
│ • Token Extract │    │ • REST API      │    │ • Cursor Tools  │
│ • Connection UI │    │ • WebSocket     │    │ • Component Gen │
│ • Status Display│    │ • Dashboard     │    │ • Real-time     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Cursor IDE    │
                       │                 │
                       │ • MCP Tools     │
                       │ • Code Gen      │
                       │ • Token Access  │
                       └─────────────────┘
```

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd tokenflow-bridge
```

### 2. Install Dependencies

```bash
# Bridge server dependencies
cd bridge
npm install

# MCP server dependencies  
cd ../mcp-server
npm install
```

### 3. Start the System

```bash
# From the root directory
./start-tokenflow-bridge.sh
```

This will start:
- Bridge server on `http://localhost:4000`
- Dashboard at `http://localhost:4000`
- MCP server (stdio transport)

### 4. Install Figma Plugin

1. Open Figma
2. Go to Plugins → Development → Import plugin from manifest
3. Select `plugin/manifest.json` from this project
4. Run the plugin and configure connection settings

## 📁 Project Structure

```
tokenflow-bridge/
├── plugin/                 # Figma plugin
│   ├── manifest.json      # Plugin configuration
│   ├── code.js           # Plugin logic
│   └── ui.html           # Plugin interface
├── bridge/                # Bridge server
│   ├── server.js         # Main server
│   ├── package.json      # Dependencies
│   └── public/           # Dashboard files
├── mcp-server/           # MCP server
│   ├── server.js         # MCP server logic
│   ├── package.json      # Dependencies
│   └── tools/            # MCP tools
├── scripts/              # Utility scripts
├── docs/                 # Documentation
└── README.md            # This file
```

## 🔧 Configuration

### Bridge Server Configuration

The bridge server runs on port 4000 by default. You can configure:

- **Port**: Change in `bridge/server.js`
- **CORS**: Configure allowed origins
- **Project Isolation**: Use project IDs for data separation
- **Authentication**: Add connection keys for security

### MCP Server Configuration

Configure Cursor to use the MCP server:

1. Open Cursor settings
2. Add MCP server configuration:
```json
{
  "mcpServers": {
    "tokenflow-bridge": {
      "command": "node",
      "args": ["/path/to/tokenflow-bridge/mcp-server/server.js"]
    }
  }
}
```

### Figma Plugin Configuration

The plugin automatically detects bridge servers and stores connection settings in localStorage. Configure:

- **Bridge URL**: Your project's bridge server URL
- **Project ID**: Unique identifier for project isolation
- **Connection Key**: Optional authentication key

## 🎯 Usage Guide

### Extracting Tokens from Figma

1. **Select Elements**: Select layers in Figma that have Token Studio assignments
2. **Run Plugin**: Open the Tokenflow Bridge plugin
3. **View Overview**: See token statistics and coverage
4. **Send to Bridge**: Click "Send to Bridge Server" to transmit tokens

### Using the Dashboard

1. **Access Dashboard**: Visit `http://localhost:4000`
2. **View Token Data**: See all received tokens and metadata
3. **Upload Files**: Drag and drop JSON files for manual upload
4. **Monitor Connections**: View active WebSocket connections

### Using MCP Tools in Cursor

Once configured, use these MCP tools in Cursor:

- `getCurrentTokens`: Get latest tokens from Figma
- `getTokenData`: View current token data
- `generateComponent`: Generate React components from tokens
- `getBridgeStatus`: Check system status
- `watchForUpdates`: Monitor for real-time updates

### Component Generation

Generate components using the MCP tools:

```bash
# In Cursor, use MCP tools to generate components
/generateComponent button primary
/generateComponent card with-shadow
/generateComponent input text-field
```

## 🔍 Linting Features

The plugin includes smart linting to detect design issues:

- **Hardcoded Styles**: Find elements with styles but no tokens
- **Focus States**: Detect accessibility overlay issues
- **Auto-sized Elements**: Identify elements that should be tokenized
- **Instance Inheritance**: Check component inheritance patterns

### Linting Options

Configure linting behavior:
- ✅ Ignore focus state elements
- ✅ Ignore instance inheritance issues  
- ✅ Ignore auto-sized elements

## 🌐 Universal Connection System

### Local Development

```bash
# Use localhost for development
Bridge URL: http://localhost:4000
Project ID: my-project
```

### Remote Projects

```bash
# Deploy bridge server to Vercel/Netlify
Bridge URL: https://my-project-bridge.vercel.app
Project ID: production
Connection Key: your-secret-key
```

### Multiple Projects

Each project can have its own bridge server:

- **Project A**: `http://localhost:4000` (Project ID: project-a)
- **Project B**: `https://project-b-bridge.vercel.app` (Project ID: project-b)
- **Project C**: `http://localhost:4001` (Project ID: project-c)

## 📊 Token Data Format

### Raw Token Structure

```json
{
  "tokens": [
    {
      "name": "Button/Primary/Background",
      "type": "color",
      "value": "#667eea",
      "node": "Button > Primary",
      "nodeType": "FRAME"
    }
  ],
  "metadata": {
    "source": "figma-plugin",
    "timestamp": "2025-07-18T13:00:00.000Z",
    "selection": "3 objects",
    "projectId": "my-project"
  }
}
```

### Sanitized Tokens

The system automatically sanitizes tokens by:
- Removing encoded blobs and metadata
- Filtering non-ASCII characters
- Truncating extremely long values
- Cleaning up Token Studio internal data

## 🛠️ Development

### Running in Development Mode

```bash
# Start bridge server with nodemon
cd bridge
npm run dev

# Start MCP server
cd ../mcp-server
npm run dev
```

### Testing

```bash
# Test bridge server
curl http://localhost:4000/health

# Test MCP server
node mcp-server/test-mcp.js

# Test universal connection
node scripts/test-universal-connection.js
```

### Building for Production

```bash
# Build bridge server
cd bridge
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

## 🔧 Troubleshooting

### Common Issues

**Port 4000 already in use:**
```bash
# Kill existing processes
pkill -f tokenflow-bridge
# Or change port in bridge/server.js
```

**MCP server not starting:**
```bash
# Check Node.js version (requires v18+)
node --version
# Reinstall dependencies
cd mcp-server && npm install
```

**Plugin connection issues:**
- Check bridge server is running
- Verify URL is correct
- Check CORS settings
- Try refreshing plugin

**Token data not appearing:**
- Ensure Token Studio plugin is running
- Check token assignments in Figma
- Verify data sanitization settings

### Debug Mode

Enable debug logging:

```bash
# Bridge server
DEBUG=* node bridge/server.js

# MCP server  
DEBUG=* node mcp-server/server.js
```

## 📈 Performance

### Optimization Features

- **Token Sanitization**: Reduces data size by ~99%
- **WebSocket Compression**: Efficient real-time updates
- **Project Isolation**: Prevents data conflicts
- **Caching**: Local storage for connection settings

### Benchmarks

- **Token Extraction**: ~100ms for typical selections
- **Data Transmission**: ~50ms for sanitized tokens
- **Component Generation**: ~200ms for React components
- **WebSocket Latency**: <10ms for real-time updates

## 🔐 Security

### Authentication

- **Connection Keys**: Optional Bearer token authentication
- **Project Isolation**: Data separation by project ID
- **CORS Protection**: Configurable origin restrictions
- **Input Validation**: Sanitized token data

### Best Practices

- Use HTTPS for production deployments
- Implement connection keys for sensitive projects
- Regular security updates
- Monitor access logs

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Use consistent formatting
- Add comments for complex logic
- Follow existing patterns
- Test thoroughly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Figma Plugin API**: For design token extraction
- **Model Context Protocol**: For MCP server implementation
- **WebSocket**: For real-time communication
- **Cursor IDE**: For MCP client integration

## 📞 Support

- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Documentation**: Check this README and docs folder
- **Examples**: See the examples folder for usage patterns

---

**Made with ❤️ for the design system community** 