const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Create WebSocket server
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
}));
app.use(compression());
app.use(cors({
  origin: ['http://localhost:3000', 'https://www.figma.com', 'null'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for token data (project-specific)
const projectData = new Map(); // projectId -> { tokenData, lastUpdate }
const defaultProjectId = 'default';

// WebSocket connections
const clients = new Set();

// Function to filter and clean token data
function filterTokenData(rawData) {
  if (!rawData || typeof rawData !== 'object') {
    return null;
  }

  const filtered = {
    tokenStudio: {},
    variables: {},
    styles: {},
    cleanTokens: {}
  };

  // Handle clean tokens from plugin - store them directly
  if (rawData.tokens && typeof rawData.tokens === 'object') {
    console.log('🔧 Storing clean tokens from plugin:', Object.keys(rawData.tokens).length, 'tokens');
    
    // Store tokens directly in cleanTokens
    Object.entries(rawData.tokens).forEach(([key, value]) => {
      filtered.cleanTokens[key] = value;
    });
    
    return filtered;
  }

  // Fallback for backward compatibility (shouldn't be needed anymore)
  console.log('⚠️  Received legacy token format, but plugin should send clean tokens');
  return filtered;
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');
  clients.add(ws);

  // Send current token data for all projects to new client
  const allProjectData = {};
  for (const [projectId, data] of projectData.entries()) {
    allProjectData[projectId] = {
      data: data,
      timestamp: data.lastUpdate
    };
  }

  if (Object.keys(allProjectData).length > 0) {
    ws.send(JSON.stringify({
      type: 'allProjectData',
      projects: allProjectData
    }));
  }

  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Broadcast to all WebSocket clients
function broadcastToClients(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    clients: clients.size
  });
});

// Simple test endpoint for Figma plugin
app.get('/test', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.json({ message: 'Bridge server is running!', timestamp: new Date().toISOString() });
});

// Get current token data
app.get('/api/tokens', (req, res) => {
  const projectId = req.query.project || defaultProjectId;
  const project = projectData.get(projectId);

  if (!project || !project) {
    return res.status(404).json({
      error: 'No token data available',
      message: `No tokens have been extracted for project '${projectId}' yet. Run the Figma plugin first.`,
      projectId: projectId
    });
  }

  // Return filtered data by default, include raw data if requested
  const includeRaw = req.query.raw === 'true';
  const responseData = includeRaw ? project : {
    ...project,
    raw: undefined // Exclude raw data unless specifically requested
  };

  res.json({
    data: responseData,
    timestamp: project.lastUpdate,
    source: 'figma-plugin',
    projectId: projectId
  });
});

// Receive token data from Figma plugin
app.post('/api/tokens', (req, res) => {
  try {
    const { tokens, selection, metadata } = req.body;
    const projectId = req.query.project || metadata?.projectId || defaultProjectId;

    if (!tokens) {
      return res.status(400).json({
        error: 'Missing token data',
        message: 'Request body must contain tokens object'
      });
    }

    console.log('🔧 Storing clean tokens from plugin:', Object.keys(tokens).length, 'tokens');
    
    // Store the clean tokens directly - no filtering needed!
    const projectTokenData = {
      raw: tokens,  // The tokens are already clean from the plugin
      filtered: {
        tokenStudio: {},
        variables: {},
        styles: {},
        cleanTokens: tokens  // Store them directly in cleanTokens
      },
      selection: selection || null,
      metadata: { ...metadata, projectId },
      extractedAt: new Date().toISOString()
    };
    
    // Store the token data for the specific project
    projectData.set(projectId, projectTokenData);
    
    // Log the received data
    console.log('📦 Received token data:', {
      projectId,
      rawTokenCount: Object.keys(tokens).length,
      cleanTokenCount: Object.keys(tokens).length,  // Same as raw since they're already clean
      selection: selection || 'none',
      timestamp: projectTokenData.extractedAt
    });
    
    // Notify connected WebSocket clients
    const message = JSON.stringify({
      type: 'TOKENS_UPDATED',
      projectId,
      tokenCount: Object.keys(tokens).length,
      timestamp: projectTokenData.extractedAt
    });
    
    let clientsNotified = 0;
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        clientsNotified++;
      }
    });
    
    // Save to file
    const filename = `tokens-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(projectTokenData, null, 2));
    
    res.json({
      success: true,
      message: 'Token data received and stored',
      timestamp: projectTokenData.extractedAt,
      projectId,
      savedTo: filename,
      clientsNotified
    });
    
  } catch (error) {
    console.error('Error processing token data:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// List all projects
app.get('/api/projects', (req, res) => {
  const projects = [];
  
  for (const [projectId, data] of projectData.entries()) {
    projects.push({
      projectId: projectId,
      lastUpdate: data.lastUpdate,
      hasData: !!data,
      tokenCount: data?.filtered?.cleanTokens ? Object.keys(data.filtered.cleanTokens).length : 0
    });
  }
  
  res.json({
    projects: projects,
    totalProjects: projects.length
  });
});

// Get token data history
app.get('/api/tokens/history', (req, res) => {
  const dataDir = path.join(__dirname, 'data');
  
  if (!fs.existsSync(dataDir)) {
    return res.json({ history: [] });
  }

  try {
    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        const timeA = parseInt(a.replace('tokens-', '').replace('.json', ''));
        const timeB = parseInt(b.replace('tokens-', '').replace('.json', ''));
        return timeB - timeA; // Most recent first
      })
      .slice(0, 10); // Last 10 files

    const history = files.map(file => {
      const filepath = path.join(dataDir, file);
      const stats = fs.statSync(filepath);
      return {
        filename: file,
        timestamp: stats.mtime.toISOString(),
        size: stats.size
      };
    });

    res.json({ history });
  } catch (error) {
    console.error('Error reading history:', error);
    res.status(500).json({ error: 'Failed to read history' });
  }
});

// Get specific historical token data
app.get('/api/tokens/history/:filename', (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(__dirname, 'data', filename);

  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// Serve static files for web interface
app.use(express.static(path.join(__dirname, 'public')));

// Serve the web interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Tokenflow Bridge Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready on ws://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 API endpoint: http://localhost:${PORT}/api/tokens`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
}); 