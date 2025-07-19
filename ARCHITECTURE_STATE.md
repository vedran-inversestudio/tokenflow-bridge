# Tokenflow Bridge - Current Architecture State

## 🎯 **Project Overview**
Tokenflow Bridge is a real-time bridge service that connects Figma design tokens to development workflows. It consists of a bridge server that receives tokens from the Figma plugin and provides API endpoints for token access, plus an MCP (Model Context Protocol) server for integration with development tools.

## 📁 **Current Project Structure**

```
tokenflow-bridge/
├── bridge/                  # Bridge server (main token receiver)
│   ├── server.cjs          # Main bridge server implementation
│   ├── package.json        # Bridge server dependencies
│   ├── public/             # Dashboard and static files
│   │   ├── index.html      # Dashboard UI
│   │   ├── dashboard.js    # Dashboard functionality
│   │   └── styles.css      # Dashboard styling
│   └── node_modules/       # Dependencies
├── mcp-server/             # MCP server for development tools
│   ├── simple-server.js    # MCP server implementation
│   ├── package.json        # MCP server dependencies
│   ├── .env               # Environment configuration
│   └── node_modules/       # Dependencies
└── README.md              # Project documentation
```

## 🔧 **Core Functionality**

### 1. **Bridge Server (bridge/)**
- **Token Reception**: Receives filtered tokens from Figma plugin
- **API Endpoints**: RESTful API for token access and management
- **WebSocket Server**: Real-time notifications for token updates
- **Dashboard**: Web UI for monitoring token status
- **Data Storage**: In-memory token storage (temporary)

### 2. **MCP Server (mcp-server/)**
- **Model Context Protocol**: Integration with development tools
- **Bridge Connection**: Connects to bridge server for token access
- **Real-time Monitoring**: WebSocket connection for live updates
- **Token Functions**: API functions for token retrieval and management

### 3. **Figma Plugin Integration**
- **Token Extraction**: Extracts design tokens from Figma
- **Data Filtering**: Removes binary blobs and irrelevant data
- **Clean Payload**: Sends sanitized token data to bridge server
- **Real-time Sending**: Immediate token transmission on extraction

## 📊 **Current API Endpoints**

### Bridge Server (http://localhost:4000)
```
GET  /health              # Server health check
GET  /api/tokens          # Get all stored tokens
POST /api/tokens          # Store new tokens
GET  /api/projects        # Get project status and token count
WS   /ws                  # WebSocket for real-time updates
```

### MCP Server Functions
```
getCurrentTokens()        # Get latest tokens from bridge
getTokenData()           # Get current token data
getBridgeStatus()        # Check bridge server status
watchForUpdates()        # Monitor for real-time updates
configureBridge()        # Configure connection settings
```

## 🔄 **Data Flow**

### 1. **Token Extraction Flow**
```
Figma Plugin → Extract Tokens → Filter Data → Send to Bridge → Store Tokens
```

### 2. **Token Access Flow**
```
Dashboard/API → Request Tokens → Bridge Server → Return Token Data
```

### 3. **Real-time Updates**
```
Token Update → WebSocket Notification → Connected Clients → UI Update
```

## 📈 **Current Status**

### ✅ **Working Features**
1. **Token Reception**: Successfully receives tokens from Figma plugin
2. **Data Filtering**: Plugin-side filtering removes 100% of binary data
3. **API Endpoints**: All endpoints functional and tested
4. **Dashboard**: Web UI shows token count and status
5. **WebSocket**: Real-time connection for updates
6. **MCP Integration**: Development tool integration working

### 🔄 **In Progress**
1. **Persistent Storage**: Database integration for token persistence
2. **Multi-project Support**: Support for multiple Figma projects
3. **Enhanced Dashboard**: More detailed token visualization
4. **Error Handling**: Comprehensive error management

### 📋 **Planned Architecture Refactor**
1. **Database Layer**: Persistent token storage (PostgreSQL/MongoDB)
2. **Authentication**: User and project authentication
3. **Project Management**: Multi-project support with project isolation
4. **Enhanced API**: More comprehensive token management endpoints
5. **Real-time Features**: Advanced WebSocket features and notifications
6. **Monitoring**: Logging and analytics for token usage

## 🛠 **Technical Stack**

### Bridge Server
- **Node.js**: Server runtime
- **Express.js**: Web framework for API endpoints
- **WebSocket**: Real-time communication
- **CORS**: Cross-origin resource sharing

### MCP Server
- **Node.js**: Server runtime
- **WebSocket Client**: Connection to bridge server
- **Environment Variables**: Configuration management
- **Reconnection Logic**: Robust connection handling

### Frontend
- **HTML/CSS/JavaScript**: Dashboard implementation
- **WebSocket Client**: Real-time updates
- **Fetch API**: REST API communication

## 📝 **Key Files**

### Bridge Server
- `bridge/server.cjs`: Main server implementation
- `bridge/public/index.html`: Dashboard UI
- `bridge/public/dashboard.js`: Dashboard functionality
- `bridge/package.json`: Server dependencies

### MCP Server
- `mcp-server/simple-server.js`: MCP server implementation
- `mcp-server/.env`: Environment configuration
- `mcp-server/package.json`: MCP dependencies

### Configuration
- `package.json`: Root project configuration
- `README.md`: Project documentation

## 🔍 **Current Implementation Details**

### Token Storage
```javascript
// In-memory storage (temporary)
let projectTokens = [];
let projectData = {
  id: 'default',
  name: 'Default Project',
  tokenCount: 0,
  lastUpdated: null
};
```

### API Response Format
```javascript
// GET /api/tokens
{
  "tokens": [...],
  "count": 11,
  "timestamp": "2024-07-19T..."
}

// GET /api/projects
{
  "projects": [{
    "id": "default",
    "name": "Default Project", 
    "tokenCount": 11,
    "lastUpdated": "2024-07-19T..."
  }]
}
```

### WebSocket Events
```javascript
// Token update notification
{
  "type": "tokens_updated",
  "data": {
    "count": 11,
    "timestamp": "2024-07-19T..."
  }
}
```

## 🎯 **Next Steps for Architecture Refactor**

1. **Database Integration**: Add persistent storage layer
2. **Authentication System**: User and project authentication
3. **Project Management**: Multi-project support
4. **Enhanced API**: More comprehensive endpoints
5. **Real-time Features**: Advanced WebSocket functionality
6. **Monitoring & Logging**: Comprehensive observability
7. **Testing**: Unit and integration tests
8. **Documentation**: API documentation and guides

## 🔍 **Current Limitations**

1. **In-memory Storage**: Tokens lost on server restart
2. **Single Project**: No multi-project support
3. **No Authentication**: No user or project authentication
4. **Basic Dashboard**: Limited token visualization
5. **No Persistence**: No database integration
6. **Limited Error Handling**: Basic error management

## 🚀 **Deployment Status**

### Current Setup
- **Bridge Server**: Running on localhost:4000
- **MCP Server**: Running on localhost:3000
- **Dashboard**: Accessible at http://localhost:4000
- **Figma Plugin**: Connected and sending tokens

### Production Considerations
- **Environment Variables**: Configuration management
- **Process Management**: PM2 or similar for production
- **Load Balancing**: Multiple server instances
- **Monitoring**: Health checks and logging
- **Security**: Authentication and authorization

---

**Last Updated**: July 19, 2024
**Status**: Functional Pipeline, Ready for Architecture Refactor
**Next Phase**: Database Integration and Multi-project Support 