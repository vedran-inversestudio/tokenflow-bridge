figma.showUI(__html__, { width: 400, height: 600 });

// Try to run Token Studio plugin and extract data
async function tryRunTokenStudio() {
  try {
    console.log('Attempting to run Token Studio plugin...');
    
    // Try to run the Token Studio plugin
    // Note: This might not work due to plugin isolation, but worth trying
    const tokenStudioPluginId = 'figma-tokens';
    
    console.log('Token Studio plugin ID:', tokenStudioPluginId);
    console.log('Note: Plugin isolation might prevent direct access to Token Studio data');
    
    // Alternative: Check if we can access Token Studio data through the document
    console.log('Checking if Token Studio data is accessible through document...');
    
    // Try to access document metadata
    try {
      console.log('Checking document metadata for Token Studio data...');
      // Note: Figma doesn't provide direct access to document metadata through the plugin API
    } catch (e) {
      console.log('Cannot access document metadata:', e);
    }
    
    // NEW: Try to check if Token Studio plugin is installed and accessible
    console.log('Checking if Token Studio plugin is installed...');
    try {
      // Check if we can access any information about installed plugins
      console.log('Current plugin context:', {
        pluginId: figma.pluginId,
        pluginName: figma.pluginName,
        pluginType: figma.pluginType
      });
      
      // Try to access any global plugin data or settings
      console.log('Checking for global plugin data...');
      
    } catch (e) {
      console.log('Error checking plugin context:', e);
    }
    
  } catch (e) {
    console.log('Error trying to run Token Studio:', e);
  }
}

// Check if Token Studio plugin is available
function checkTokenStudioPlugin() {
  try {
    // Try to access Token Studio plugin data through the plugin system
    console.log('Checking for Token Studio plugin availability...');
    
    // Check if we can access any plugin data at all
    const testNode = figma.currentPage.selection[0];
    if (testNode && testNode.getPluginData) {
      console.log('getPluginData method is available');
      
      // Try to list all possible plugin data keys (if possible)
      // Note: Figma doesn't provide a way to list all keys, so we'll try common ones
      const commonKeys = [
        'tokens', 'tokenstudio', 'token_studio', 'design_tokens',
        'figma_tokens', 'figma_token_studio', 'tokenstudio_tokens',
        'design_system', 'ds_tokens', 'tokens_data',
        'figma_tokens_studio', 'token_studio_data', 'design_tokens_data',
        'token', 'studio', 'design', 'system'
      ];
      
      console.log('Testing common plugin data keys...');
      for (const key of commonKeys) {
        const data = testNode.getPluginData(key);
        if (data && data.trim()) {
          console.log(`Found data for key "${key}":`, data.substring(0, 100) + '...');
        }
      }
      
      // Try Token Studio specific plugin ID approach
      console.log('Trying Token Studio plugin ID approach...');
      const tokenStudioPluginId = 'figma-tokens';
      const tokenStudioData = testNode.getPluginData(tokenStudioPluginId);
      if (tokenStudioData && tokenStudioData.trim()) {
        console.log(`Found Token Studio data with plugin ID "${tokenStudioPluginId}":`, tokenStudioData.substring(0, 200) + '...');
      }
      
      // Try alternative Token Studio plugin IDs
      const alternativePluginIds = ['figma-tokens-studio', 'token-studio', 'design-tokens'];
      for (const pluginId of alternativePluginIds) {
        const data = testNode.getPluginData(pluginId);
        if (data && data.trim()) {
          console.log(`Found data with plugin ID "${pluginId}":`, data.substring(0, 100) + '...');
        }
      }
      
      // Check if there's any plugin data at all by trying random keys
      console.log('Checking for any plugin data with random keys...');
      const randomKeys = ['data', 'info', 'metadata', 'props', 'attributes', 'values'];
      for (const key of randomKeys) {
        const data = testNode.getPluginData(key);
        if (data && data.trim()) {
          console.log(`Found data with random key "${key}":`, data.substring(0, 100) + '...');
        }
      }
      
      // Try to access shared plugin data with Token Studio namespace
      console.log('Checking shared plugin data for Token Studio...');
      try {
        const sharedData = testNode.getSharedPluginData('figma-tokens', 'tokens');
        if (sharedData && sharedData.trim()) {
          console.log('Found shared plugin data for figma-tokens/tokens:', sharedData.substring(0, 200) + '...');
        }
      } catch (e) {
        console.log('No shared plugin data found for figma-tokens/tokens');
      }
      
    }
    
    // Check file-level variables and styles
    console.log('Checking file-level variables and styles...');
    try {
      console.log('File variables count:', figma.variables ? figma.variables.length : 'Not available');
      console.log('File styles count:', figma.getLocalPaintStyles().length + figma.getLocalTextStyles().length + figma.getLocalEffectStyles().length);
      
      // Check if any variables are bound to the selected nodes
      if (figma.variables && figma.variables.length > 0) {
        console.log('Available variables:', figma.variables.map(v => ({ id: v.id, name: v.name, key: v.key })));
      }
    } catch (e) {
      console.log('Error accessing file variables/styles:', e);
    }
    
    // Try to check if Token Studio plugin is running
    console.log('Checking if Token Studio plugin is running...');
    try {
      // Check if we can access any running plugins
      console.log('Current plugin ID:', figma.pluginId);
      
      // Try to access Token Studio through the plugin system
      // Note: This might not work due to plugin isolation
      console.log('Attempting to access Token Studio plugin...');
      
    } catch (e) {
      console.log('Error checking Token Studio plugin status:', e);
    }
    
    // Check for any other potential storage mechanisms
    console.log('Checking for alternative storage mechanisms...');
    try {
      // Check if there are any global variables or settings
      console.log('Checking document settings...');
      
      // Check if Token Studio data is stored in the document itself
      console.log('Checking document-level data...');
      
    } catch (e) {
      console.log('Error checking alternative storage:', e);
    }
    
  } catch (e) {
    console.log('Error checking Token Studio plugin:', e);
  }
}

function extractTokenData(node) {
  const tokens = {};
  
  // Debug: Log all available plugin data keys for this node
  console.log(`Checking plugin data for node: ${node.name} (${node.type})`);
  
  // NEW: Use the correct Token Studio shared plugin data approach
  console.log('Checking Token Studio shared plugin data...');
  try {
    if (node.getSharedPluginData) {
      // Get all available keys in the "tokens" namespace
      console.log('Checking for shared plugin data keys in "tokens" namespace...');
      try {
        const sharedKeys = node.getSharedPluginDataKeys('tokens');
        console.log('Available shared plugin data keys for "tokens":', sharedKeys);
        
        if (sharedKeys && sharedKeys.length > 0) {
          // Read each key to get the token data
          for (const key of sharedKeys) {
            const tokenData = node.getSharedPluginData('tokens', key);
            if (tokenData && tokenData.trim()) {
              console.log(`Found token data for key "${key}":`, tokenData.substring(0, 200) + '...');
              try {
                const parsedData = JSON.parse(tokenData);
                if (parsedData && Object.keys(parsedData).length > 0) {
                  tokens[`tokenStudio_${key}`] = parsedData;
                  console.log(`Successfully parsed Token Studio data for key "${key}":`, parsedData);
                }
              } catch (e) {
                tokens[`tokenStudio_${key}`] = tokenData;
                console.log(`Raw Token Studio data for key "${key}":`, tokenData);
              }
            }
          }
        } else {
          console.log('No shared plugin data keys found for "tokens" namespace');
        }
      } catch (e) {
        console.log('Error getting shared plugin data keys:', e);
      }
      
      // Also try the specific "values" key for document-level tokens
      try {
        const valuesData = node.getSharedPluginData('tokens', 'values');
        if (valuesData && valuesData.trim()) {
          console.log('Found Token Studio values data:', valuesData.substring(0, 200) + '...');
          try {
            const parsedValues = JSON.parse(valuesData);
            if (parsedValues && Object.keys(parsedValues).length > 0) {
              tokens.tokenStudioValues = parsedValues;
              console.log('Successfully parsed Token Studio values:', parsedValues);
            }
          } catch (e) {
            tokens.tokenStudioValues = valuesData;
          }
        }
      } catch (e) {
        console.log('No Token Studio values data found');
      }
    } else {
      console.log('Node does not support getSharedPluginData');
    }
  } catch (e) {
    console.log('Error checking Token Studio shared plugin data:', e);
  }
  
  // Check document-level Token Studio data
  console.log('Checking document-level Token Studio data...');
  try {
    if (figma.root.getSharedPluginData) {
      // Get all available keys in the "tokens" namespace at document level
      try {
        const documentKeys = figma.root.getSharedPluginDataKeys('tokens');
        console.log('Available document-level shared plugin data keys for "tokens":', documentKeys);
        
        if (documentKeys && documentKeys.length > 0) {
          for (const key of documentKeys) {
            const documentData = figma.root.getSharedPluginData('tokens', key);
            if (documentData && documentData.trim()) {
              console.log(`Found document token data for key "${key}":`, documentData.substring(0, 200) + '...');
              try {
                const parsedData = JSON.parse(documentData);
                if (parsedData && Object.keys(parsedData).length > 0) {
                  tokens[`tokenStudioDocument_${key}`] = parsedData;
                  console.log(`Successfully parsed document Token Studio data for key "${key}":`, parsedData);
                }
              } catch (e) {
                tokens[`tokenStudioDocument_${key}`] = documentData;
              }
            }
          }
        }
        
        // Try the specific "values" key for all defined tokens
        const documentValues = figma.root.getSharedPluginData('tokens', 'values');
        if (documentValues && documentValues.trim()) {
          console.log('Found document-level Token Studio values:', documentValues.substring(0, 200) + '...');
          try {
            const parsedValues = JSON.parse(documentValues);
            if (parsedValues && Object.keys(parsedValues).length > 0) {
              tokens.tokenStudioDocumentValues = parsedValues;
              console.log('Successfully parsed document-level Token Studio values:', parsedValues);
            }
          } catch (e) {
            tokens.tokenStudioDocumentValues = documentValues;
          }
        }
      } catch (e) {
        console.log('Error getting document-level shared plugin data keys:', e);
      }
    }
  } catch (e) {
    console.log('Error checking document-level Token Studio data:', e);
  }
  
  // Legacy checks (keeping for compatibility)
  try {
    // Check all possible Token Studio plugin data keys
    const possibleKeys = [
      'tokens', 'tokenstudio', 'token_studio', 'design_tokens',
      'figma_tokens', 'figma_token_studio', 'tokenstudio_tokens',
      'design_system', 'ds_tokens', 'tokens_data'
    ];
    
    for (const key of possibleKeys) {
      if (node.getPluginData) {
        const pluginData = node.getPluginData(key);
        if (pluginData && pluginData.trim()) {
          console.log(`Found legacy plugin data for key "${key}":`, pluginData.substring(0, 200) + '...');
          try {
            const parsedData = JSON.parse(pluginData);
            if (parsedData && Object.keys(parsedData).length > 0) {
              tokens[`legacy_${key}`] = parsedData;
              console.log(`Successfully parsed legacy Token Studio data for ${node.name}:`, parsedData);
              break;
            }
          } catch (e) {
            console.log(`Raw legacy plugin data for ${node.name} (${key}):`, pluginData);
            tokens[`legacy_${key}`] = pluginData;
            break;
          }
        }
      }
    }
    
    // Try Token Studio plugin ID approach
    const tokenStudioPluginId = 'figma-tokens';
    const tokenStudioData = node.getPluginData(tokenStudioPluginId);
    if (tokenStudioData && tokenStudioData.trim()) {
      console.log(`Found legacy Token Studio data with plugin ID "${tokenStudioPluginId}" for ${node.name}:`, tokenStudioData.substring(0, 200) + '...');
      try {
        const parsedData = JSON.parse(tokenStudioData);
        if (parsedData && Object.keys(parsedData).length > 0) {
          tokens.legacyTokenStudioPlugin = parsedData;
          console.log(`Successfully parsed legacy Token Studio plugin data for ${node.name}:`, parsedData);
        }
      } catch (e) {
        tokens.legacyTokenStudioPlugin = tokenStudioData;
      }
    }
    
    // Check shared plugin data with valid namespace/key combinations
    if (node.getSharedPluginData) {
      const validNamespaces = ['tokens', 'tokenstudio', 'figma_tokens', 'design_system'];
      const validKeys = ['tokens', 'tokenstudio', 'design_tokens'];
      
      for (const namespace of validNamespaces) {
        for (const key of validKeys) {
          try {
            const sharedData = node.getSharedPluginData(namespace, key);
            if (sharedData && sharedData.trim()) {
              console.log(`Found legacy shared plugin data for ${namespace}/${key}:`, sharedData.substring(0, 200) + '...');
              try {
                const parsedSharedData = JSON.parse(sharedData);
                if (parsedSharedData && Object.keys(parsedSharedData).length > 0) {
                  tokens[`legacy_${namespace}_${key}`] = parsedSharedData;
                  console.log(`Successfully parsed legacy shared Token Studio data for ${node.name}:`, parsedSharedData);
                  break;
                }
              } catch (e) {
                console.log(`Raw legacy shared plugin data for ${node.name} (${namespace}/${key}):`, sharedData);
                tokens[`legacy_${namespace}_${key}`] = sharedData;
                break;
              }
            }
          } catch (e) {
            // Skip invalid namespace/key combinations
            continue;
          }
        }
      }
    }
    
    // Alternative: Check if Token Studio data is stored in node properties or metadata
    if (node.getPluginData) {
      console.log(`Node ${node.name} has getPluginData method`);
      
      // Try some common Token Studio specific keys
      const tokenStudioKeys = ['figma_tokens_studio', 'token_studio_data', 'design_tokens_data'];
      for (const key of tokenStudioKeys) {
        const data = node.getPluginData(key);
        if (data && data.trim()) {
          console.log(`Found legacy Token Studio specific data for key "${key}":`, data.substring(0, 200) + '...');
          try {
            const parsedData = JSON.parse(data);
            if (parsedData && Object.keys(parsedData).length > 0) {
              tokens[`legacy_${key}`] = parsedData;
              console.log(`Successfully parsed legacy Token Studio specific data for ${node.name}:`, parsedData);
              break;
            }
          } catch (e) {
            tokens[`legacy_${key}`] = data;
            break;
          }
        }
      }
    }
    
  } catch (e) {
    console.log('Error reading legacy Token Studio data:', e);
  }
  
  // Fills tokens (Figma Variables)
  if ('fills' in node && node.fills !== figma.mixed && node.fills) {
    const fillTokens = node.fills
      .map(fill => fill.boundVariables ? fill.boundVariables : null)
      .filter(vars => vars && Object.keys(vars).length > 0);
    if (fillTokens.length > 0) {
      tokens.fills = fillTokens;
    }
  }
  
  // Strokes tokens (Figma Variables)
  if ('strokes' in node && node.strokes !== figma.mixed && node.strokes) {
    const strokeTokens = node.strokes
      .map(stroke => stroke.boundVariables ? stroke.boundVariables : null)
      .filter(vars => vars && Object.keys(vars).length > 0);
    if (strokeTokens.length > 0) {
      tokens.strokes = strokeTokens;
    }
  }
  
  // Style IDs as tokens (only if not empty)
  if ('fillStyleId' in node && node.fillStyleId && node.fillStyleId !== '') {
    tokens.fillStyleId = node.fillStyleId;
  }
  if ('strokeStyleId' in node && node.strokeStyleId && node.strokeStyleId !== '') {
    tokens.strokeStyleId = node.strokeStyleId;
  }
  if ('effectStyleId' in node && node.effectStyleId && node.effectStyleId !== '') {
    tokens.effectStyleId = node.effectStyleId;
  }
  if (node.type === 'TEXT' && node.textStyleId && node.textStyleId !== '') {
    tokens.textStudioId = node.textStyleId;
  }
  
  return tokens;
}

function extractStyleData(node) {
  const styles = {};
  
  // Basic dimensions with layout context
  if ('width' in node) {
    styles.width = node.width;
  }
  if ('height' in node) {
    styles.height = node.height;
  }
  
  // Layout properties to understand auto-sizing behavior
  if ('layoutMode' in node) {
    styles.layoutMode = node.layoutMode;
  }
  if ('primaryAxisSizingMode' in node) {
    styles.primaryAxisSizingMode = node.primaryAxisSizingMode;
  }
  if ('counterAxisSizingMode' in node) {
    styles.counterAxisSizingMode = node.counterAxisSizingMode;
  }
  if ('layoutAlign' in node) {
    styles.layoutAlign = node.layoutAlign;
  }
  if ('layoutGrow' in node) {
    styles.layoutGrow = node.layoutGrow;
  }
  
  // Fills
  if ('fills' in node && node.fills !== figma.mixed && node.fills) {
    styles.fills = node.fills;
  }
  if ('fillStyleId' in node && node.fillStyleId && node.fillStyleId !== '') {
    styles.fillStyleId = node.fillStyleId;
  }
  
  // Strokes
  if ('strokes' in node && node.strokes !== figma.mixed && node.strokes) {
    styles.strokes = node.strokes;
  }
  if ('strokeStyleId' in node && node.strokeStyleId && node.strokeStyleId !== '') {
    styles.strokeStyleId = node.strokeStyleId;
  }
  if ('strokeWeight' in node) {
    styles.strokeWeight = node.strokeWeight;
  }
  
  // Effects
  if ('effects' in node && node.effects !== figma.mixed && node.effects) {
    styles.effects = node.effects;
  }
  if ('effectStyleId' in node && node.effectStyleId && node.effectStyleId !== '') {
    styles.effectStyleId = node.effectStyleId;
  }
  
  // Text styles
  if (node.type === 'TEXT') {
    styles.fontName = node.fontName;
    styles.fontSize = node.fontSize;
    styles.textStyleId = node.textStyleId;
    styles.textCase = node.textCase;
    styles.textDecoration = node.textDecoration;
    styles.letterSpacing = node.letterSpacing;
    styles.lineHeight = node.lineHeight;
    styles.paragraphSpacing = node.paragraphSpacing;
    styles.paragraphIndent = node.paragraphIndent;
    styles.textAutoResize = node.textAutoResize;
    styles.textAlignHorizontal = node.textAlignHorizontal;
    styles.textAlignVertical = node.textAlignVertical;
  }
  
  return styles;
}

function extractNodeData(node) {
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    tokens: extractTokenData(node),
    styles: extractStyleData(node),
    children: node.children ? node.children.map(extractNodeData) : []
  };
}

if (figma.currentPage.selection.length === 0) {
  figma.ui.postMessage({ type: 'no-selection' });
} else {
  try {
    // Check Token Studio plugin availability first
    checkTokenStudioPlugin();
    
    // Try to run Token Studio plugin (but don't await it to avoid blocking)
    tryRunTokenStudio().catch(e => console.log('Token Studio check failed:', e));
    
    const data = figma.currentPage.selection.map(extractNodeData);
    
    // Check if we found any Token Studio data
    const hasTokenStudioData = data.some(node => 
      node.tokens && Object.keys(node.tokens).some(key => key.includes('tokenStudio') || key.includes('token'))
    );
    
    figma.ui.postMessage({ 
      type: 'selection-data', 
      data,
      hasTokenStudioData,
      message: hasTokenStudioData ? null : 'No Token Studio data found. Try running the Token Studio plugin first.'
    });
  } catch (error) {
    console.error('Error processing selection:', error);
    figma.ui.postMessage({ 
      type: 'error', 
      message: 'Error processing selection: ' + error.message 
    });
  }
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  } else if (msg.type === 'send-to-bridge') {
    // Handle sending data to bridge server
    try {
      const bridgeData = {
        tokens: {
          tokenStudio: {},
          variables: {},
          styles: {},
          rawData: msg.data
        },
        selection: msg.data.map(node => ({
          name: node.name,
          type: node.type,
          id: node.id
        })),
        metadata: {
          extractedAt: new Date().toISOString(),
          source: 'figma-plugin',
          version: '1.0.0'
        }
      };

      // Extract token data from the selection
      if (Array.isArray(msg.data)) {
        msg.data.forEach(node => {
          if (node.tokens) {
            Object.entries(node.tokens).forEach(([key, value]) => {
              if (key.includes('tokenStudio')) {
                bridgeData.tokens.tokenStudio[`${node.name}_${key}`] = value;
              } else if (key.includes('variable')) {
                bridgeData.tokens.variables[`${node.name}_${key}`] = value;
              } else if (key.includes('style')) {
                bridgeData.tokens.styles[`${node.name}_${key}`] = value;
              }
            });
          }
        });
      }

      // Send to bridge server using Node.js fetch (if available)
      // Note: This is a workaround since Figma plugins can't make direct HTTP requests
      figma.ui.postMessage({ 
        type: 'bridge-data-ready', 
        data: bridgeData,
        message: 'Data prepared for bridge server. Please copy and paste this data manually to http://localhost:8080/api/tokens'
      });
      
    } catch (error) {
      console.error('Error preparing bridge data:', error);
      figma.ui.postMessage({ 
        type: 'error', 
        message: 'Error preparing bridge data: ' + error.message 
      });
    }
  } else if (msg.type === 'refresh-selection') {
    // Handle refresh selection request
    try {
      if (figma.currentPage.selection.length === 0) {
        figma.ui.postMessage({ type: 'no-selection' });
      } else {
        // Check Token Studio plugin availability first
        checkTokenStudioPlugin();
        
        // Try to run Token Studio plugin (but don't await it to avoid blocking)
        tryRunTokenStudio().catch(e => console.log('Token Studio check failed:', e));
        
        const data = figma.currentPage.selection.map(extractNodeData);
        
        // Check if we found any Token Studio data
        const hasTokenStudioData = data.some(node => 
          node.tokens && Object.keys(node.tokens).some(key => key.includes('tokenStudio') || key.includes('token'))
        );
        
        figma.ui.postMessage({ 
          type: 'selection-data', 
          data,
          hasTokenStudioData,
          message: hasTokenStudioData ? null : 'No Token Studio data found. Try running the Token Studio plugin first.'
        });
      }
    } catch (error) {
      console.error('Error refreshing selection:', error);
      figma.ui.postMessage({ 
        type: 'error', 
        message: 'Error refreshing selection: ' + error.message 
      });
    }
  }
}; 