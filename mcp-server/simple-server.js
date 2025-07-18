import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WebSocket } from 'ws';
import fetch from 'node-fetch';

// Bridge server configuration
const BRIDGE_URL = 'http://localhost:4000';
const BRIDGE_WS_URL = 'ws://localhost:4000';

// Bridge server connection
let bridgeWebSocket = null;
let lastTokenData = null;
let isConnected = false;

// Connect to bridge server WebSocket for real-time updates
function connectToBridge() {
  try {
    bridgeWebSocket = new WebSocket(BRIDGE_WS_URL);
    
    bridgeWebSocket.on('open', () => {
      console.log('🔌 Connected to Tokenflow Bridge WebSocket');
      isConnected = true;
    });
    
    bridgeWebSocket.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'tokenData') {
          lastTokenData = message.data;
          console.log('📦 Received token data update:', {
            cleanTokenCount: lastTokenData.filtered ? Object.keys(lastTokenData.filtered.cleanTokens || {}).length : 0,
            timestamp: message.timestamp
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    bridgeWebSocket.on('close', () => {
      console.log('🔌 Disconnected from Tokenflow Bridge WebSocket');
      isConnected = false;
      // Attempt to reconnect after 5 seconds
      setTimeout(connectToBridge, 5000);
    });
    
    bridgeWebSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
      isConnected = false;
    });
  } catch (error) {
    console.error('Failed to connect to bridge WebSocket:', error);
  }
}

// Initialize bridge connection
connectToBridge();

// Component generation function
function generateComponentCode(componentType, componentName, tokens) {
  const tokenEntries = Object.entries(tokens);
  
  // Extract common token patterns
  const colors = tokenEntries.filter(([key, value]) => 
    key.includes('color') || key.includes('fill') || value.startsWith('#')
  );
  const spacing = tokenEntries.filter(([key, value]) => 
    key.includes('spacing') || key.includes('padding') || key.includes('margin')
  );
  const typography = tokenEntries.filter(([key, value]) => 
    key.includes('font') || key.includes('text') || key.includes('size')
  );
  const borders = tokenEntries.filter(([key, value]) => 
    key.includes('border') || key.includes('radius')
  );
  
  // Generate component based on type
  switch (componentType.toLowerCase()) {
    case 'button':
      return generateButtonComponent(componentName, tokens, colors, spacing, borders);
    case 'card':
      return generateCardComponent(componentName, tokens, colors, spacing, borders);
    case 'input':
      return generateInputComponent(componentName, tokens, colors, spacing, borders);
    default:
      return generateGenericComponent(componentName, tokens);
  }
}

function generateButtonComponent(name, tokens, colors, spacing, borders) {
  const primaryColor = colors.find(([key]) => key.includes('primary'))?.[1] || '#667eea';
  const borderRadius = borders.find(([key]) => key.includes('radius'))?.[1] || '8px';
  const padding = spacing.find(([key]) => key.includes('padding'))?.[1] || '12px 24px';
  
  return `import React from 'react';

interface ${name}Props {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
}

export const ${name}: React.FC<${name}Props> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false
}) => {
  const baseStyles = {
    borderRadius: '${borderRadius}',
    padding: '${padding}',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 500,
  };

  const variantStyles = {
    primary: {
      backgroundColor: '${primaryColor}',
      color: 'white',
      '&:hover': {
        backgroundColor: '${primaryColor}dd',
      }
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '${primaryColor}',
      border: \`1px solid \${primaryColor}\`,
      '&:hover': {
        backgroundColor: '${primaryColor}11',
      }
    },
    outline: {
      backgroundColor: 'transparent',
      color: '${primaryColor}',
      border: \`1px solid \${primaryColor}\`,
      '&:hover': {
        backgroundColor: '${primaryColor}11',
      }
    }
  };

  const sizeStyles = {
    small: { padding: '8px 16px', fontSize: '12px' },
    medium: { padding: '${padding}', fontSize: '14px' },
    large: { padding: '16px 32px', fontSize: '16px' }
  };

  const styles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <button
      style={styles}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};`;
}

function generateCardComponent(name, tokens, colors, spacing, borders) {
  const backgroundColor = colors.find(([key]) => key.includes('background'))?.[1] || '#ffffff';
  const borderRadius = borders.find(([key]) => key.includes('radius'))?.[1] || '12px';
  const padding = spacing.find(([key]) => key.includes('padding'))?.[1] || '24px';
  
  return `import React from 'react';

interface ${name}Props {
  children: React.ReactNode;
  title?: string;
  shadow?: boolean;
}

export const ${name}: React.FC<${name}Props> = ({
  children,
  title,
  shadow = true
}) => {
  const styles = {
    backgroundColor: '${backgroundColor}',
    borderRadius: '${borderRadius}',
    padding: '${padding}',
    boxShadow: shadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
    border: '1px solid #e5e7eb',
  };

  return (
    <div style={styles}>
      {title && (
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};`;
}

function generateInputComponent(name, tokens, colors, spacing, borders) {
  const borderColor = colors.find(([key]) => key.includes('border'))?.[1] || '#d1d5db';
  const borderRadius = borders.find(([key]) => key.includes('radius'))?.[1] || '6px';
  const padding = spacing.find(([key]) => key.includes('padding'))?.[1] || '12px';
  
  return `import React from 'react';

interface ${name}Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  disabled?: boolean;
}

export const ${name}: React.FC<${name}Props> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false
}) => {
  const styles = {
    width: '100%',
    padding: '${padding}',
    border: \`1px solid \${borderColor}\`,
    borderRadius: '${borderRadius}',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    '&:focus': {
      borderColor: '${colors.find(([key]) => key.includes('primary'))?.[1] || '#667eea'}',
    },
    '&:disabled': {
      backgroundColor: '#f9fafb',
      cursor: 'not-allowed',
    }
  };

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={styles}
    />
  );
};`;
}

function generateGenericComponent(name, tokens) {
  const tokenEntries = Object.entries(tokens);
  
  return `import React from 'react';

// Generated component using design tokens
// Available tokens: ${tokenEntries.length}

interface ${name}Props {
  children?: React.ReactNode;
}

export const ${name}: React.FC<${name}Props> = ({ children }) => {
  // Design tokens from Figma:
  ${tokenEntries.map(([key, value]) => `  // ${key}: ${value}`).join('\n')}
  
  const styles = {
    // Apply your design tokens here
    // Example: backgroundColor: tokens.primaryColor,
  };

  return (
    <div style={styles}>
      {children}
    </div>
  );
};`;
}

// Create MCP server
const server = new Server(
  {
    name: 'tokenflow-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {
        listChanged: () => Promise.resolve(),
        list: () => Promise.resolve([
          {
            name: 'getCurrentTokens',
            description: 'Retrieve current token data from the bridge server',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'getTokenData',
            description: 'Get the current token data that was extracted from Figma',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'generateComponent',
            description: 'Generate a React component using current design tokens',
            inputSchema: {
              type: 'object',
              properties: {
                componentType: {
                  type: 'string',
                  enum: ['button', 'card', 'input', 'generic'],
                  description: 'Type of component to generate'
                },
                componentName: {
                  type: 'string',
                  description: 'Name of the component'
                }
              },
              required: []
            }
          },
          {
            name: 'getBridgeStatus',
            description: 'Check the status of the bridge server and WebSocket connection',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'watchForUpdates',
            description: 'Start watching for real-time token updates from Figma',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          }
        ])
      }
    }
  }
);

// Set up request handlers
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'getCurrentTokens': {
        const response = await fetch(`${BRIDGE_URL}/api/tokens`);
        if (!response.ok) {
          throw new Error(`Bridge server error: ${response.status}`);
        }
        
        const data = await response.json();
        lastTokenData = data.data;
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ Retrieved current token data from bridge server.\n\n` +
                    `📊 Token Summary:\n` +
                    `- Clean Tokens: ${Object.keys(data.data.filtered?.cleanTokens || {}).length}\n` +
                    `- Token Studio: ${Object.keys(data.data.filtered?.tokenStudio || {}).length}\n` +
                    `- Variables: ${Object.keys(data.data.filtered?.variables || {}).length}\n` +
                    `- Styles: ${Object.keys(data.data.filtered?.styles || {}).length}\n` +
                    `- Last Updated: ${data.timestamp}\n\n` +
                    `🔗 Bridge Server: ${BRIDGE_URL}\n` +
                    `📊 Dashboard: ${BRIDGE_URL}`
            }
          ]
        };
      }
      
      case 'getTokenData': {
        if (!lastTokenData) {
          return {
            content: [
              {
                type: 'text',
                text: '❌ No token data available. Please extract tokens from Figma first using the Tokenflow Bridge plugin.'
              }
            ]
          };
        }
        
        const filtered = lastTokenData.filtered || {};
        const cleanTokens = filtered.cleanTokens || {};
        
        let tokenList = '';
        if (Object.keys(cleanTokens).length > 0) {
          tokenList = '\n\n**Clean Tokens:**\n' + 
            Object.entries(cleanTokens)
              .map(([key, value]) => `- \`${key}\`: \`${value}\``)
              .join('\n');
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `📦 Current Token Data\n\n` +
                    `**Token Studio:** ${Object.keys(filtered.tokenStudio || {}).length} tokens\n` +
                    `**Variables:** ${Object.keys(filtered.variables || {}).length} variables\n` +
                    `**Styles:** ${Object.keys(filtered.styles || {}).length} styles\n` +
                    `**Clean Tokens:** ${Object.keys(cleanTokens).length} tokens` +
                    tokenList
            }
          ]
        };
      }
      
      case 'generateComponent': {
        const { componentType = 'button', componentName = 'MyComponent' } = args;
        
        if (!lastTokenData || !lastTokenData.filtered) {
          return {
            content: [
              {
                type: 'text',
                text: '❌ No token data available. Please extract tokens from Figma first.'
              }
            ]
          };
        }
        
        const tokens = lastTokenData.filtered.cleanTokens || {};
        const componentCode = generateComponentCode(componentType, componentName, tokens);
        
        return {
          content: [
            {
              type: 'text',
              text: `🎨 Generated ${componentType} component with current design tokens:\n\n` +
                    `**Component:** ${componentName}\n` +
                    `**Type:** ${componentType}\n` +
                    `**Tokens Used:** ${Object.keys(tokens).length}\n\n` +
                    `\`\`\`tsx\n${componentCode}\n\`\`\``
            }
          ]
        };
      }
      
      case 'getBridgeStatus': {
        const healthResponse = await fetch(`${BRIDGE_URL}/health`);
        const healthData = await healthResponse.json();
        
        return {
          content: [
            {
              type: 'text',
              text: `🔌 Bridge Server Status\n\n` +
                    `**Status:** ${healthData.status}\n` +
                    `**Uptime:** ${Math.round(healthData.uptime)}s\n` +
                    `**WebSocket:** ${isConnected ? '✅ Connected' : '❌ Disconnected'}\n` +
                    `**Clients:** ${healthData.clients}\n` +
                    `**Last Update:** ${lastTokenData ? '✅ Available' : '❌ None'}\n\n` +
                    `🔗 Dashboard: ${BRIDGE_URL}`
            }
          ]
        };
      }
      
      case 'watchForUpdates': {
        return {
          content: [
            {
              type: 'text',
              text: `👀 Watching for token updates...\n\n` +
                    `**WebSocket Status:** ${isConnected ? '✅ Connected' : '❌ Disconnected'}\n` +
                    `**Bridge Server:** ${BRIDGE_URL}\n\n` +
                    `The MCP server is now monitoring for real-time token updates from the Figma plugin.\n` +
                    `When you extract tokens in Figma, they will automatically be available here.\n\n` +
                    `Use \`getTokenData\` to see the latest tokens or \`generateComponent\` to create components.`
            }
          ]
        };
      }
      
      default:
        return {
          content: [
            {
              type: 'text',
              text: `❌ Unknown tool: ${name}`
            }
          ]
        };
    }
  } catch (error) {
    console.error(`Error in tool ${name}:`, error);
    return {
      content: [
        {
          type: 'text',
          text: `❌ Error: ${error.message}`
        }
      ]
    };
  }
});

// Start the MCP server
const transport = new StdioServerTransport();
await server.connect(transport);

console.log('🚀 Tokenflow MCP Server started');
console.log('🔌 Connecting to bridge server...');
console.log('📊 Available tools:');
console.log('  - getCurrentTokens: Get latest tokens from bridge');
console.log('  - getTokenData: Get current token data');
console.log('  - generateComponent: Generate Storybook component');
console.log('  - getBridgeStatus: Check bridge server status');
console.log('  - watchForUpdates: Monitor for real-time updates'); 