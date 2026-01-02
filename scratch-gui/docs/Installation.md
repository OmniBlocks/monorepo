# 📥 Installation Guide

This guide will help you install and run OmniBlocks for both users and developers.

## 🎯 Quick Installation (Users)

### Web Version

The easiest way to use OmniBlocks is through our web version:

1. **Visit**: [https://omniblocks.github.io](https://omniblocks.github.io)
2. **Install as PWA**: Click the install button in your browser to add OmniBlocks to your desktop
3. **Start coding**: Begin creating projects immediately!

### System Requirements

- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet Connection**: Required for initial load (PWA works offline after installation)
- **Storage**: Minimum 50MB for caching

## 🛠️ Developer Installation

### Prerequisites

- **Node.js**: Version 22 (v18+ may work but not guaranteed)
- **npm**: Comes with Node.js
- **Git**: For version control
- **Disk Space**: Several GB for dependencies and build artifacts

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/OmniBlocks/scratch-gui
   cd scratch-gui
   ```

2. **Install dependencies**:
   ```bash
   npm ci  # Recommended - uses exact versions from package-lock.json
   ```
   
   *If you prefer `npm install`, use:*
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start development server**:
   ```bash
   npm start
   ```
   
   The application will open at `http://localhost:8601`

### Alternative: GitHub Codespaces

For cloud-based development:

1. Navigate to the OmniBlocks repository
2. Click "Code" → "Codespaces" tab
3. Click "Create codespace on main"
4. Wait 5-10 minutes for setup
5. Start coding in the browser-based VS Code environment

## 📦 Production Build

To create a production build:

```bash
npm run build
```

This creates optimized files in the `build/` directory ready for deployment.

## 🎨 Standalone Build

For self-contained HTML files:

```bash
npm run build:standalone
```

This creates standalone HTML files in the `standalone/` directory that work without a web server.

## 🔧 Self-Hosting

To host OmniBlocks on your own server:

1. Build the production version: `npm run build`
2. Copy the contents of `build/` to your web server
3. Ensure proper MIME types are configured
4. Set up HTTPS for service worker functionality

## 🐳 Docker Installation (Advanced)

For containerized deployment:

```dockerfile
FROM node:22
WORKDIR /app
COPY . .
RUN npm ci
CMD ["npm", "start"]
```

## 🧪 Verifying Installation

Check that everything works:

1. Open the application in your browser
2. Create a new project
3. Add a few blocks and run the project
4. Test basic features like saving/loading projects
5. Verify addons are working

## 🔄 Updating OmniBlocks

To update to the latest version:

```bash
cd scratch-gui
git pull origin main
npm ci
npm start
```

## 🚧 Troubleshooting Installation

**Common issues and solutions:**

- **Node.js version issues**: Use `nvm` to manage Node.js versions
- **Dependency conflicts**: Use `npm ci` instead of `npm install`
- **Build failures**: Check Node.js and npm versions, clear cache with `npm cache clean --force`
- **Port conflicts**: Change the port in webpack configuration or use `PORT=8602 npm start`

See our [Troubleshooting Guide](Troubleshooting.md) for more detailed solutions.