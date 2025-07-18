# Tokenflow MCP Server

A Model Context Protocol (MCP) server that connects Cursor to the Tokenflow Bridge, enabling seamless design token extraction from Figma and automatic component generation.

## 🚀 Features

- **Real-time Token Access**: Get design tokens directly from Figma via the bridge server
- **Component Generation**: Automatically generate React/TypeScript components with accurate styling
- **WebSocket Integration**: Real-time updates when tokens are extracted in Figma
- **Multiple Component Types**: Support for buttons, cards, inputs, and generic components
- **Bridge Server Monitoring**: Check bridge server status and connection health

## 🏗️ Architecture

```
Figma Plugin → Bridge Server → MCP Server → Cursor → Storybook Components
```

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- Tokenflow Bridge server running on `localhost:4000`
- Cursor with MCP support

## 🛠️ Installation

1. **Navigate to the MCP server directory**:
   ```bash
   cd mcp-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the MCP server**:
   ```bash
   npm start
   ```

## 🔧 Cursor Configuration

Add the MCP server to your Cursor configuration:

### Option 1: Global Configuration
Add to your Cursor settings:

```json
{
  "mcpServers": {
    "tokenflow": {
      "command": "node",
      "args": ["/path/to/tokenflow-bridge/mcp-server/server.js"],
      "env": {}
    }
  }
}
```

### Option 2: Project-specific Configuration
Create `.cursorrules` in your project root:

```json
{
  "mcpServers": {
    "tokenflow": {
      "command": "node",
      "args": ["../mcp-server/server.js"],
      "env": {}
    }
  }
}
```

## 🛠️ Available Tools

### `getCurrentTokens`
Retrieves the latest token data from the bridge server.

**Usage in Cursor:**
```
/getCurrentTokens
```

**Response:**
```
✅ Retrieved current token data from bridge server.

📊 Token Summary:
- Clean Tokens: 18
- Token Studio: 8
- Variables: 5
- Styles: 5
- Last Updated: 2024-01-15T10:30:00.000Z

🔗 Bridge Server: http://localhost:4000
📊 Dashboard: http://localhost:4000
```

### `getTokenData`
Gets the current token data with detailed breakdown.

**Usage in Cursor:**
```
/getTokenData
```

**Response:**
```
📦 Current Token Data

**Token Studio:** 8 tokens
**Variables:** 5 variables
**Styles:** 5 styles
**Clean Tokens:** 18 tokens

**Clean Tokens:**
- `pds-Button_tokenStudio_borderRadius`: `pillow.border-radius.container.pill`
- `pds-Button_tokenStudio_height`: `pillow.dimension.action.height.1_5x`
- `pds-Button_tokenStudio_verticalPadding`: `pillow.spacing.container.none`
...
```

### `generateComponent`
Generates a React/TypeScript component using current design tokens.

**Usage in Cursor:**
```
/generateComponent componentType="button" componentName="PrimaryButton"
```

**Parameters:**
- `componentType`: Type of component to generate (`button`, `card`, `input`, or generic)
- `componentName`: Name for the generated component

**Response:**
```
🎨 Generated button component with current design tokens:

**Component:** PrimaryButton
**Type:** button
**Tokens Used:** 18

```tsx
import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false
}) => {
  const baseStyles = {
    borderRadius: 'pillow.border-radius.container.pill',
    padding: 'pillow.spacing.container.0_5x',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 500,
  };

  // ... rest of component code
};
```

### `getBridgeStatus`
Checks the status of the bridge server and WebSocket connection.

**Usage in Cursor:**
```
/getBridgeStatus
```

**Response:**
```
🔌 Bridge Server Status

**Status:** ok
**Uptime:** 3600s
**WebSocket:** ✅ Connected
**Clients:** 2
**Last Update:** ✅ Available

🔗 Dashboard: http://localhost:4000
```

### `watchForUpdates`
Monitors for real-time token updates from the Figma plugin.

**Usage in Cursor:**
```
/watchForUpdates
```

**Response:**
```
👀 Watching for token updates...

**WebSocket Status:** ✅ Connected
**Bridge Server:** http://localhost:4000

The MCP server is now monitoring for real-time token updates from the Figma plugin.
When you extract tokens in Figma, they will automatically be available here.

Use `getTokenData` to see the latest tokens or `generateComponent` to create components.
```

## 🎨 Component Generation

The MCP server can generate several types of components:

### Button Components
- Primary, secondary, and outline variants
- Small, medium, and large sizes
- Hover states and disabled states
- Uses color, spacing, and border radius tokens

### Card Components
- Clean card layout with shadow
- Configurable title and content
- Uses background color, border radius, and padding tokens

### Input Components
- Text, email, and password types
- Focus states and disabled states
- Uses border color, border radius, and padding tokens

### Generic Components
- Template with all available tokens listed
- Ready for custom styling implementation

## 🔄 Workflow

### 1. Extract Tokens in Figma
1. Select objects in Figma with design tokens
2. Run the Tokenflow Bridge plugin
3. Upload the JSON data to the bridge server dashboard

### 2. Generate Components in Cursor
1. Use `/getCurrentTokens` to fetch latest tokens
2. Use `/generateComponent` to create components
3. Copy the generated code to your Storybook project

### 3. Real-time Updates
1. Use `/watchForUpdates` to monitor for changes
2. Extract new tokens in Figma
3. Automatically get updated data in Cursor

## 🚨 Troubleshooting

### Bridge Server Not Running
If you get connection errors:
```bash
# Start the bridge server
cd bridge
npm run dev
```

### MCP Server Connection Issues
Check that the MCP server is properly configured in Cursor:
1. Verify the path to `server.js` is correct
2. Ensure Node.js is available in the PATH
3. Check Cursor's MCP configuration

### No Token Data Available
1. Extract tokens from Figma using the plugin
2. Upload the data to the bridge server dashboard
3. Use `/getCurrentTokens` to fetch the data

### WebSocket Connection Issues
The MCP server will automatically attempt to reconnect to the bridge server every 5 seconds if the connection is lost.

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Testing
```bash
npm test
```

### Logs
The MCP server provides detailed console logging:
- 🔌 WebSocket connections
- 📦 Token data updates
- ❌ Errors and issues
- 🛠️ Tool usage

## 📁 File Structure

```
mcp-server/
├── package.json          # Dependencies and scripts
├── server.js            # Main MCP server file
├── README.md           # This file
└── test.js             # Test script
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Cursor
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ for the design token community** 