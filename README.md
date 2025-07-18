# Tokenflow Bridge

A Figma plugin that extracts, exports, and exposes all design tokens (variables, Token Studio assignments, etc.) applied to selected objects in your Figma file. Perfect for bridging the gap between Figma's design data and your codebase for seamless design-token integration.

## ✨ Features

- **Comprehensive Token Extraction**: Extracts all tokens used on any Figma selection (names, values, references)
- **Token Studio Integration**: Reads Token Studio plugin data and shared plugin data
- **Variable Support**: Extracts Figma variables and their values
- **Style Extraction**: Captures applied styles (paint, text, effect styles)
- **Modern UI**: Beautiful, responsive interface with tabbed organization
- **Multiple Export Options**: Copy to clipboard, download as JSON, or send to local API
- **Real-time Updates**: Refresh button to extract tokens from new selections

## 🏗️ Architecture

- **`/plugin/`** — Complete Figma plugin implementation
  - `manifest.json` — Plugin configuration and metadata
  - `code.js` — Main plugin logic for token extraction
  - `ui.html` — Modern, responsive user interface
- **`/bridge/`** — (Planned) Local Node.js/Express/WebSocket server
  - Will receive token data from the plugin and expose it via local API endpoints
- **`/README.md`** — Setup, usage, and integration instructions

## 🚀 Getting Started

### Prerequisites
- Figma desktop app or Figma web
- Token Studio plugin installed (optional, for enhanced token extraction)

### Installation

1. **Clone this repository**:
   ```sh
   git clone https://github.com/yourusername/tokenflow-bridge.git
   cd tokenflow-bridge
   ```

2. **Install the plugin in Figma**:
   - Open Figma
   - Go to **Plugins** → **Development** → **Import plugin from manifest**
   - Select the `plugin/manifest.json` file from this repository
   - The plugin will appear in your development plugins list

3. **Run the plugin**:
   - Select objects in your Figma file that have tokens applied
   - Go to **Plugins** → **Development** → **Tokenflow Bridge**
   - The plugin will extract and display all tokens from your selection

## 📖 Usage

### Basic Token Extraction
1. **Select objects** in your Figma file that have design tokens applied
2. **Run the plugin** from the Plugins menu
3. **View extracted tokens** in the organized tabs:
   - **Token Studio**: Token Studio plugin data and assignments
   - **Variables**: Figma variables and their values
   - **Styles**: Applied paint, text, and effect styles
   - **Raw Data**: Complete JSON data for integration

### Export Options
- **Copy to Clipboard**: Quick copy of token data
- **Download JSON**: Save token data as a JSON file
- **Send to API**: (Coming soon) Send data to local bridge server

### Token Types Extracted
- **Token Studio Data**: All Token Studio plugin assignments and values
- **Figma Variables**: Local and remote variables with their resolved values
- **Style References**: Applied styles with their properties
- **Node Properties**: Fill, stroke, text, and effect properties

## 🔧 Development

### Plugin Structure
```
plugin/
├── manifest.json    # Plugin configuration
├── code.js         # Main plugin logic
└── ui.html         # User interface
```

### Key Functions
- `extractTokenData()`: Extracts Token Studio shared plugin data
- `extractVariableData()`: Extracts Figma variables and their values
- `extractStyleData()`: Extracts applied styles and their properties
- `extractNodeData()`: Comprehensive node property extraction

### Adding New Token Sources
The plugin is designed to be extensible. To add support for new token sources:
1. Add extraction logic in `code.js`
2. Update the UI tabs in `ui.html`
3. Include the new data in the export functions

## 🔗 Integration

### With Tokenflow
This plugin is specifically designed to work with Tokenflow design token pipelines:
1. Extract tokens from Figma using this plugin
2. Export the JSON data
3. Import into Tokenflow for processing and distribution

### With Other Tools
The exported JSON format is designed to be compatible with:
- Design token pipelines
- Style dictionary generators
- CSS-in-JS libraries
- Design system documentation tools

## 🛠️ Future Enhancements

- [ ] **Local Bridge Server**: Node.js/Express server for real-time token streaming
- [ ] **WebSocket Support**: Real-time updates between Figma and external tools
- [ ] **Token Validation**: Validate token consistency across selections
- [ ] **Batch Processing**: Extract tokens from multiple selections at once
- [ ] **Custom Export Formats**: Support for CSS, SCSS, and other formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Questions**: Use GitHub Discussions for general questions
- **Contributions**: Pull requests are welcome!

---

**Made with ❤️ for the design token community** 