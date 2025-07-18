# 🔌 API Documentation

Complete API reference for the Tokenflow Bridge server.

## 🌐 Base URL

```
http://localhost:4000
```

## 📊 Health Check

### GET /health

Check server health and status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-18T13:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "memory": {
    "used": "45.2 MB",
    "total": "512 MB"
  }
}
```

## 🔌 Token Management

### POST /api/tokens

Receive and store token data from Figma plugin.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <connection-key> (optional)
```

**Query Parameters:**
- `project` (optional): Project ID for data isolation

**Request Body:**
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

**Response:**
```json
{
  "success": true,
  "tokenCount": 15,
  "projectId": "my-project",
  "timestamp": "2025-07-18T13:00:00.000Z"
}
```

### GET /api/tokens

Retrieve current token data.

**Query Parameters:**
- `project` (optional): Project ID to filter data
- `format` (optional): Response format (`json`, `css`, `scss`)

**Response:**
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
    "projectId": "my-project",
    "lastUpdated": "2025-07-18T13:00:00.000Z",
    "tokenCount": 15
  }
}
```

### DELETE /api/tokens

Clear all token data.

**Query Parameters:**
- `project` (optional): Project ID to clear specific project data

**Response:**
```json
{
  "success": true,
  "message": "Token data cleared",
  "projectId": "my-project"
}
```

## 📊 Project Management

### GET /api/projects

List all available projects.

**Response:**
```json
{
  "projects": [
    {
      "id": "my-project",
      "tokenCount": 15,
      "lastUpdated": "2025-07-18T13:00:00.000Z",
      "connectionCount": 2
    },
    {
      "id": "another-project",
      "tokenCount": 8,
      "lastUpdated": "2025-07-18T12:30:00.000Z",
      "connectionCount": 1
    }
  ]
}
```

### GET /api/projects/:projectId

Get specific project details.

**Response:**
```json
{
  "id": "my-project",
  "tokenCount": 15,
  "lastUpdated": "2025-07-18T13:00:00.000Z",
  "connectionCount": 2,
  "tokens": [
    {
      "name": "Button/Primary/Background",
      "type": "color",
      "value": "#667eea"
    }
  ]
}
```

## 🔌 Connection Management

### GET /api/connections

Get active WebSocket connections.

**Response:**
```json
{
  "connections": [
    {
      "id": "ws-123",
      "projectId": "my-project",
      "connectedAt": "2025-07-18T13:00:00.000Z",
      "lastActivity": "2025-07-18T13:05:00.000Z"
    }
  ],
  "totalConnections": 1
}
```

### POST /api/connections/test

Test connection to bridge server.

**Request Body:**
```json
{
  "url": "http://localhost:4000",
  "projectId": "test-project",
  "connectionKey": "optional-key"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connection successful",
  "health": {
    "status": "healthy",
    "version": "1.0.0"
  }
}
```

## 🌐 WebSocket API

### Connection

Connect to WebSocket endpoint:

```
ws://localhost:4000
```

### Events

#### Client to Server

**token-update**
```json
{
  "type": "token-update",
  "data": {
    "tokens": [...],
    "metadata": {...}
  }
}
```

**project-switch**
```json
{
  "type": "project-switch",
  "projectId": "new-project"
}
```

#### Server to Client

**token-updated**
```json
{
  "type": "token-updated",
  "data": {
    "tokenCount": 15,
    "projectId": "my-project",
    "timestamp": "2025-07-18T13:00:00.000Z"
  }
}
```

**connection-status**
```json
{
  "type": "connection-status",
  "status": "connected",
  "projectId": "my-project"
}
```

**error**
```json
{
  "type": "error",
  "message": "Invalid token data",
  "code": "INVALID_DATA"
}
```

## 📁 File Upload

### POST /api/upload

Upload token data file.

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: JSON file with token data
- `projectId` (optional): Project ID for data isolation

**Response:**
```json
{
  "success": true,
  "filename": "tokens-2025-07-18.json",
  "tokenCount": 15,
  "projectId": "my-project"
}
```

## 🔐 Authentication

### Bearer Token

Add authentication header:

```
Authorization: Bearer your-connection-key
```

### Environment Variables

Set authentication in environment:

```bash
AUTH_KEY=your-secret-key
```

## 📊 Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid token data",
  "code": "INVALID_DATA",
  "details": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

### 404 Not Found
```json
{
  "error": "Project not found",
  "code": "PROJECT_NOT_FOUND",
  "projectId": "missing-project"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR",
  "message": "Database connection failed"
}
```

## 🔧 CORS Configuration

Default CORS settings:

```javascript
{
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## 📈 Rate Limiting

- **Requests per minute**: 100
- **WebSocket connections**: 10 per IP
- **File uploads**: 10 per minute

## 🔍 Monitoring

### GET /api/stats

Get server statistics.

**Response:**
```json
{
  "uptime": 3600,
  "requests": {
    "total": 1500,
    "perMinute": 25
  },
  "connections": {
    "active": 5,
    "total": 150
  },
  "tokens": {
    "total": 250,
    "projects": 3
  },
  "memory": {
    "used": "45.2 MB",
    "total": "512 MB"
  }
}
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:4000/health
```

### Token Upload
```bash
curl -X POST http://localhost:4000/api/tokens \
  -H "Content-Type: application/json" \
  -d '{"tokens":[],"metadata":{"source":"test"}}'
```

### Project List
```bash
curl http://localhost:4000/api/projects
```

### WebSocket Test
```bash
# Using wscat
npm install -g wscat
wscat -c ws://localhost:4000
```

## 📝 Examples

### JavaScript Client

```javascript
// Fetch tokens
const response = await fetch('http://localhost:4000/api/tokens?project=my-project');
const data = await response.json();

// Upload tokens
const uploadResponse = await fetch('http://localhost:4000/api/tokens', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-key'
  },
  body: JSON.stringify(tokenData)
});

// WebSocket connection
const ws = new WebSocket('ws://localhost:4000');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### Python Client

```python
import requests
import websocket

# Fetch tokens
response = requests.get('http://localhost:4000/api/tokens?project=my-project')
tokens = response.json()

# Upload tokens
upload_response = requests.post(
    'http://localhost:4000/api/tokens',
    json=token_data,
    headers={'Authorization': 'Bearer your-key'}
)

# WebSocket connection
ws = websocket.WebSocketApp('ws://localhost:4000')
ws.run_forever()
```

## 🔄 Webhooks

### POST /api/webhooks

Configure webhooks for token updates.

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["token-updated", "project-switched"],
  "secret": "webhook-secret"
}
```

**Response:**
```json
{
  "success": true,
  "webhookId": "webhook-123",
  "url": "https://your-app.com/webhook"
}
``` 