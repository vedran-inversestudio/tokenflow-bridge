# Tokenflow Bridge - Complete Setup Guide

This guide walks you through setting up the complete Tokenflow Bridge workflow: Figma plugin → Bridge server → MCP server → Cursor integration.

## 🎯 What You'll Build

A complete design-to-code pipeline that allows you to:
1. Extract design tokens from Figma selections
2. Stream tokens to a local bridge server
3. Generate React/TypeScript components in Cursor with accurate styling
4. Use the components in your Storybook project

## 📋 Prerequisites

- **Figma**: Desktop app or web version
- **Node.js**: 18.0.0 or higher
- **Cursor**: With MCP support
- **Token Studio plugin**: Installed in Figma (optional but recommended)

## 🚀 Step-by-Step Setup

### Step 1: Clone and Setup Repository

```bash
git clone https://github.com/yourusername/tokenflow-bridge.git
cd tokenflow-bridge
```

### Step 2: Install Figma Plugin

1. **Open Figma**
2. **Go to Plugins** → **Development** → **Import plugin from manifest**
3. **Select** `plugin/manifest.json` from the cloned repository
4. **Verify** the plugin appears in your development plugins list

### Step 3: Start Bridge Server

```bash
cd bridge
npm install
npm run dev
```

**Verify it's working:**
- Open `http://localhost:4000` in your browser
- You should see the Tokenflow Bridge dashboard
- Status should show "Connected" with WebSocket active

### Step 4: Setup MCP Server

```bash
cd ../mcp-server
npm install
```

**Test the setup:**
```bash
node test.js
```

You should see:
- ✅ Bridge server connection successful
- ✅ WebSocket connection successful
- ✅ MCP server configuration ready

### Step 5: Configure Cursor

Add the MCP server to your Cursor configuration:

**Option A: Global Configuration**
Add to your Cursor settings:
```json
{
  "mcpServers": {
    "tokenflow": {
      "command": "node",
      "args": ["/full/path/to/tokenflow-bridge/mcp-server/server.js"]
    }
  }
}
```

**Option B: Project-specific**
Create `.cursorrules` in your project root:
```json
{
  "mcpServers": {
    "tokenflow": {
      "command": "node",
      "args": ["../mcp-server/server.js"]
    }
  }
}
```

### Step 6: Test the Complete Workflow

1. **Extract tokens in Figma:**
   - Select objects with design tokens in Figma
   - Run the Tokenflow Bridge plugin
   - Copy the JSON data

2. **Send to bridge server:**
   - Go to `http://localhost:4000`
   - Use the file upload feature
   - Upload your token JSON file

3. **Generate components in Cursor:**
   - Open Cursor in your project
   - Use MCP tools:
     ```
     /getCurrentTokens
     /getTokenData
     /generateComponent componentType="button" componentName="MyButton"
     ```

4. **Use in Storybook:**
   - Copy the generated component code
   - Paste into your Storybook component file
   - The component will use the exact design tokens from Figma

## 🔧 Configuration Options

### Bridge Server Configuration

**Environment Variables:**
```bash
PORT=4000              # Server port (default: 4000)
NODE_ENV=development   # Environment mode
```

**CORS Settings** (in `bridge/server.js`):
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://www.figma.com', 'null'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### MCP Server Configuration

**Bridge Server URL** (in `mcp-server/server.js`):
```javascript
const BRIDGE_URL = 'http://localhost:4000';
const BRIDGE_WS_URL = 'ws://localhost:4000';
```

## 🎨 Component Generation

The MCP server can generate several types of components:

### Button Components
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
}
```

### Card Components
```typescript
interface CardProps {
  children: React.ReactNode;
  title?: string;
  shadow?: boolean;
}
```

### Input Components
```typescript
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  disabled?: boolean;
}
```

## 🔄 Real-time Workflow

1. **Extract tokens in Figma** → Plugin extracts and displays tokens
2. **Upload to bridge** → Dashboard receives and processes tokens
3. **MCP server updates** → WebSocket connection receives new data
4. **Cursor gets tokens** → Use `/getCurrentTokens` to fetch latest data
5. **Generate components** → Use `/generateComponent` with current tokens
6. **Copy to Storybook** → Paste generated code into your project

## 🚨 Troubleshooting

### Bridge Server Issues
```bash
# Check if server is running
curl http://localhost:4000/health

# Restart server
cd bridge
npm run dev
```

### MCP Server Issues
```bash
# Test MCP server
cd mcp-server
node test.js

# Check Cursor configuration
# Verify the path to server.js is correct
```

### Figma Plugin Issues
- Ensure Token Studio plugin is installed
- Check that selected objects have design tokens
- Try refreshing the plugin

### Cursor MCP Issues
- Verify MCP server is configured correctly
- Check that Node.js is available in PATH
- Restart Cursor after configuration changes

## 📊 Monitoring

### Bridge Server Dashboard
- **URL**: `http://localhost:4000`
- **Features**: Real-time token display, file upload, history

### MCP Server Status
Use `/getBridgeStatus` in Cursor to check:
- Bridge server health
- WebSocket connection status
- Token data availability

### Logs
- **Bridge server**: Console output in terminal
- **MCP server**: Console output when running
- **Figma plugin**: Browser console (F12)

## 🎯 Next Steps

Once the basic setup is working:

1. **Customize component templates** in `mcp-server/server.js`
2. **Add more token sources** in `plugin/code.js`
3. **Extend the bridge server** with additional endpoints
4. **Create Storybook stories** for your generated components
5. **Set up automated workflows** for continuous token updates

## 🌐 Using MCP Server in Other Projects

The Tokenflow Bridge MCP server can be used in any project to generate components from design tokens. Here are the different approaches:

### Option 1: Global MCP Server (Recommended)

Use the MCP server from the tokenflow-bridge project across all your projects:

```bash
# Start the global MCP server (from tokenflow-bridge directory)
cd /path/to/tokenflow-bridge/mcp-server
npm start

# In any other project, just connect the Figma plugin to:
Bridge URL: http://localhost:4000
```

**Advantages:**
- ✅ Only one server to manage
- ✅ Works across all projects
- ✅ No additional installation needed
- ✅ Consistent connection URL

### Option 2: Project-Specific MCP Server

Install the MCP server directly in your project:

```bash
# 1. Copy MCP server to your project
cp -r /path/to/tokenflow-bridge/mcp-server ./mcp-server

# 2. Install dependencies
cd mcp-server
npm install

# 3. Add script to your project's package.json
{
  "scripts": {
    "mcp": "cd mcp-server && npm start",
    "storybook": "storybook dev -p 6006"
  }
}

# 4. Start the MCP server
npm run mcp
```

**When to use this option:**
- Project-specific token workflows
- Custom MCP tool modifications
- Isolated development environments

### Setup Steps for Any Project

1. **Start the MCP server** (either global or project-specific):
   ```bash
   # Global (from tokenflow-bridge)
   cd /path/to/tokenflow-bridge/mcp-server && npm start
   
   # OR Project-specific (from your project)
   npm run mcp
   ```

2. **Start your development server**:
   ```bash
   npm run storybook  # or your preferred dev server
   ```

3. **Connect the Figma plugin** to `http://localhost:4000`

4. **Use Cursor IDE** to generate components using MCP tools:
   - `/getCurrentTokens` - Get latest tokens from Figma
   - `/generateComponent button primary` - Generate React components
   - `/getBridgeStatus` - Check system status

### Cursor Configuration for Other Projects

**For Global MCP Server:**
Add to your Cursor settings (works for all projects):
```json
{
  "mcpServers": {
    "tokenflow": {
      "command": "node",
      "args": ["/full/path/to/tokenflow-bridge/mcp-server/server.js"]
    }
  }
}
```

**For Project-Specific MCP Server:**
Create `.cursorrules` in your project root:
```json
{
  "mcpServers": {
    "tokenflow": {
      "command": "node",
      "args": ["./mcp-server/server.js"]
    }
  }
}
```

### Troubleshooting Multi-Project Setup

**"npm run mcp" not found:**
```bash
# Make sure you're in the correct directory
cd /path/to/your-project
# Add the script to package.json as shown above
```

**Port 4000 already in use:**
```bash
# Check what's using the port
lsof -i :4000
# Kill existing process or use a different port
```

**MCP server not starting:**
```bash
# Check dependencies are installed
cd mcp-server && npm install
# Verify Node.js version (requires v18+)
node --version
```

**Cursor not recognizing MCP tools:**
```bash
# Restart Cursor after configuration changes
# Verify the path to server.js is correct
# Check that Node.js is available in PATH
```

## 🤝 Support

- **Issues**: Open a GitHub issue
- **Questions**: Use GitHub Discussions
- **Contributions**: Pull requests welcome!

---

**Happy coding with design tokens! 🎨** 