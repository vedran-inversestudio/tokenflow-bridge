# tokenflow-bridge

A Figma plugin and optional local API bridge to extract, export, and expose all design tokens (variables, Token Studio assignments, etc.) applied to selected objects in your Figma file.

## Purpose
- Quickly retrieve all tokens used on any Figma selection (names, values, references).
- Export token data as JSON or expose it via a local API for integration with design token pipelines (e.g., Tokenflow) or AI assistants.
- Bridge the gap between Figma’s design data and your codebase for perfect design-token alignment.

## Architecture
- **/plugin/** — Figma plugin code (TypeScript/JavaScript)
  - Reads the current selection and extracts all token assignments.
  - UI to copy, download, or send token data.
- **/bridge/** — (Optional) Local Node.js/Express/WebSocket server
  - Receives token data from the plugin and exposes it via a local API endpoint.
- **/README.md** — Setup, usage, and integration instructions.

## Example Workflow
1. User selects an object in Figma and runs the plugin.
2. Plugin extracts all tokens/variables applied to the selection.
3. Plugin exposes the data (copy, download, or send to local API).
4. Tokenflow or an AI assistant fetches the data from the local API or uses the exported file.

## Getting Started
1. Clone this repo:
   ```sh
   git clone https://github.com/your-org/tokenflow-bridge.git
   cd tokenflow-bridge
   ```
2. Follow the `/plugin/` README for Figma plugin setup and usage.
3. (Optional) Follow the `/bridge/` README to run the local API bridge.
4. Integrate with your design token pipeline (e.g., Tokenflow) or automation tools.

## Status
- **Scaffold only.**
- Plugin and bridge code to be implemented.

---

For questions or contributions, open an issue or PR! 