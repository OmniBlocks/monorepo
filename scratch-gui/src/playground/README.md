# Development Playground

The playground is a development environment for testing, debugging, and experimenting with OmniBlocks components in isolation. It provides various entry points and configurations for different development scenarios.

## 📁 Directory Structure

```
src/playground/
├── README.md                    # This file
├── addon-settings.jsx           # Addon configuration interface
├── app-target.js               # Application rendering target
├── credits/                    # Credits system components
│   ├── credits.css            # Credits styling
│   ├── credits.jsx            # Credits interface
│   └── users.js               # Contributor information
├── editor.jsx                  # Full editor playground
├── embed.ejs                   # Embedded player template
├── embed.jsx                   # Embedded player component
├── fullscreen.jsx              # Fullscreen mode playground
├── import-first.js             # Essential imports and setup
├── index.ejs                   # Main playground template
├── interface.css               # Playground interface styling
├── load-service-worker.js      # Service worker loader
├── player.jsx                  # Standalone player playground
├── public-path.js              # Webpack public path configuration
├── render-gui.jsx              # GUI rendering utilities
├── render-interface.jsx        # Interface rendering utilities
├── service-worker.js           # Offline functionality
└── simple.ejs                  # Minimal playground template
```

## 🚀 Available Playground Modes

### 1. Full Editor (`editor.jsx`)
Complete OmniBlocks editor interface for testing all features.

**Use cases:**
- Testing new features in the full editor context
- Debugging editor-specific issues
- Addon development and testing

**Access:** Available through webpack dev server routing

### 2. Standalone Player (`player.jsx`)
Isolated project player without editing capabilities.

**Use cases:**
- Testing project playback performance
- Debugging runtime issues
- Embedded player development

**Features:**
- Project loading and execution
- Minimal UI for focus on runtime
- Performance profiling capabilities

### 3. Embedded Mode (`embed.jsx`)
Lightweight embeddable player for integration into other websites.

**Use cases:**
- Testing embed functionality
- Developing iframe-safe features
- Third-party integration testing

**Features:**
- Minimal footprint
- Configurable interface elements
- Cross-origin compatibility

### 4. Fullscreen Mode (`fullscreen.jsx`)
Fullscreen presentation mode for projects.

**Use cases:**
- Testing fullscreen behavior
- Presentation mode development
- Immersive experience testing

## 🛠️ Development Workflow

### Starting the Playground

The playground is automatically available when you run the development server:

```bash
npm start
```

Different playground modes are accessible through URL routing:
- `/editor` - Full editor interface
- `/player` - Standalone player
- `/embed` - Embedded player
- `/fullscreen` - Fullscreen mode

### Configuration

#### Addon Settings (`addon-settings.jsx`)
Configure which addons are enabled in the playground environment:

```javascript
// Example addon configuration
const addonSettings = {
    'editor-devtools': true,
    'debugger': true,
    'custom-theme': false
};
```

#### Service Worker (`service-worker.js`)
Provides offline functionality and caching:

- **Asset Caching:** Static resources for offline use
- **Project Caching:** Save projects locally
- **Update Management:** Handle app updates gracefully

### Customizing the Playground

#### Adding New Playground Modes

1. **Create a new JSX file** following the existing pattern:
```javascript
import './import-first';
import React from 'react';
import render from './app-target';
import MyCustomInterface from './my-custom-interface.jsx';

render(<MyCustomInterface />);
```

2. **Add webpack entry point** in `webpack.config.js`
3. **Create corresponding EJS template** if needed
4. **Update routing** to make it accessible

#### Modifying Interface Components

The playground uses modular components that can be mixed and matched:

- **`render-gui.jsx`** - Core GUI rendering
- **`render-interface.jsx`** - Interface layout and controls
- **`app-target.js`** - Application mounting and setup

## 🧪 Testing and Debugging

### Debug Features

#### Developer Tools Integration
The playground includes enhanced debugging capabilities:

- **Redux DevTools:** State inspection and time travel debugging
- **React DevTools:** Component hierarchy and props inspection
- **Performance Profiling:** Runtime performance analysis

#### Console Debugging
Access debugging information through browser console:

```javascript
// Access playground state
window.playground.getState();

// Enable debug logging
window.playground.setDebugMode(true);

// Access addon system
window.playground.addons.getEnabled();
```

### Performance Testing

#### Metrics Collection
The playground can collect performance metrics:

- **Render Times:** Component rendering performance
- **Project Load Times:** Asset loading and parsing
- **Runtime Performance:** Script execution speed
- **Memory Usage:** Memory consumption patterns

#### Profiling Tools
Built-in profiling for development:

```javascript
// Start performance profiling
window.playground.profiler.start();

// Stop and get results
const results = window.playground.profiler.stop();
console.log('Performance results:', results);
```

## 🎨 Credits System

The playground includes a comprehensive credits system (`credits/`) that acknowledges contributors:

### Features
- **Contributor Profiles:** Display contributor information
- **Contribution Types:** Code, design, translation, testing
- **Dynamic Loading:** Fetch contributor data from GitHub API
- **Customizable Display:** Various layout options

### Adding Contributors

Edit `credits/users.js` to add new contributors:

```javascript
export const contributors = [
    {
        username: 'contributor-name',
        contributions: ['code', 'documentation'],
        role: 'Developer',
        avatar: 'https://github.com/contributor-name.png'
    }
];
```

## 🔧 Advanced Configuration

### Service Worker Configuration

Customize offline behavior in `service-worker.js`:

```javascript
// Cache configuration
const CACHE_CONFIG = {
    version: '1.0.0',
    staticAssets: [
        '/static/js/bundle.js',
        '/static/css/main.css'
    ],
    dynamicAssets: {
        projects: { maxAge: 86400000 }, // 24 hours
        images: { maxAge: 604800000 }   // 7 days
    }
};
```

### Public Path Configuration

Adjust asset loading paths in `public-path.js`:

```javascript
// For different deployment environments
if (process.env.NODE_ENV === 'production') {
    __webpack_public_path__ = '/omniblocks/';
} else {
    __webpack_public_path__ = '/';
}
```

## 🐛 Troubleshooting

### Common Issues

**Playground won't load:**
- Check browser console for JavaScript errors
- Verify all dependencies are installed (`npm ci`)
- Ensure development server is running (`npm start`)

**Service worker issues:**
- Clear browser cache and service worker registration
- Check service worker console for errors
- Verify HTTPS is used (required for service workers)

**Addon conflicts:**
- Disable problematic addons in `addon-settings.jsx`
- Check addon compatibility with playground mode
- Review addon console output for errors

### Debug Mode

Enable enhanced debugging:

```javascript
// In browser console
localStorage.setItem('playground-debug', 'true');
location.reload();
```

This enables:
- Verbose console logging
- Performance monitoring
- State change tracking
- Error boundary details

## 🔗 Related Documentation

- [Main OmniBlocks README](../../README.md) - Project overview and setup
- [Addons Documentation](../addons/README.md) - Addon system integration
- [Examples Documentation](../examples/README.md) - Extension development
- [Testing Documentation](../../test/README.md) - Testing infrastructure

## 🤝 Contributing

The playground is a crucial development tool. Contributions are welcome:

### Areas for Improvement
- **New playground modes** for specific testing scenarios
- **Enhanced debugging tools** and profiling capabilities
- **Better performance monitoring** and metrics collection
- **Improved offline functionality** and caching strategies

### Contribution Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/playground-enhancement`)
3. Make your changes and test thoroughly
4. Submit a pull request with detailed description

---

**Need help with playground development?** Open an issue or start a discussion in the [OmniBlocks GitHub organization](https://github.com/orgs/OmniBlocks/discussions)!