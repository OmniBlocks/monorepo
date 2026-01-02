# 🛠️ Development Setup Guide

Complete guide to setting up your development environment for OmniBlocks.

## 🎯 System Requirements

### Minimum Requirements

- **Operating System**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **CPU**: Dual-core 2GHz or better
- **RAM**: 8GB (16GB recommended for large projects)
- **Storage**: 10GB free space (SSD recommended)
- **Internet**: Broadband connection for dependencies

### Recommended Setup

- **OS**: Latest stable version of your preferred OS
- **CPU**: Quad-core 3GHz+ processor
- **RAM**: 16GB+ for optimal performance
- **Storage**: 20GB+ SSD with fast I/O
- **Browser**: Chrome/Edge for development and testing

## 📦 Software Prerequisites

### Required Software

1. **Node.js**: Version 22.x (LTS recommended)
   - Download: [https://nodejs.org](https://nodejs.org)
   - Verify: `node -v` and `npm -v`

2. **Git**: Version control system
   - Download: [https://git-scm.com](https://git-scm.com)
   - Verify: `git --version`

3. **Code Editor**: VS Code recommended
   - Download: [https://code.visualstudio.com](https://code.visualstudio.com)
   - Extensions: ESLint, Prettier, React Developer Tools

### Optional Software

- **Yarn**: Alternative package manager
- **Docker**: For containerized development
- **Postman**: API testing and debugging
- **GitHub Desktop**: GUI for Git operations

## 🚀 Getting Started

### 1. Clone the Repository

```bash
# Clone the main repository
git clone https://github.com/OmniBlocks/scratch-gui.git
cd scratch-gui

# For contributors with write access
git clone git@github.com:OmniBlocks/scratch-gui.git
```

### 2. Install Dependencies

```bash
# Recommended: Use exact versions from package-lock.json
npm ci

# Alternative: Regular install (may update dependencies)
npm install --legacy-peer-deps
```

**Troubleshooting:**
- If you get dependency conflicts, try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- For permission issues, try `sudo chown -R $USER:$USER .` on Linux/macOS

### 3. Start Development Server

```bash
npm start
```

This will:
- Compile the source code
- Start the webpack development server
- Open the application in your default browser at `http://localhost:8601`
- Enable hot-reloading for faster development

## 🔧 Development Workflow

### Basic Commands

```bash
# Start development server
npm start

# Create production build
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Clean build artifacts
npm run clean
```

### File Structure Overview

```
scratch-gui/
├── src/                  # Main source code
│   ├── components/       # React components
│   ├── containers/       # Redux-connected components
│   ├── lib/              # Core libraries and utilities
│   ├── addons/           # Addon system
│   ├── examples/         # Extension examples
│   ├── playground/       # Development playground
│   └── ...
├── static/               # Static assets
├── test/                 # Test files
├── docs/                 # Documentation (you're here!)
├── webpack.config.js     # Build configuration
├── package.json          # Project configuration
└── ...
```

## 🧪 Development Tools

### Built-in Tools

- **Webpack Dev Server**: Hot reloading and live preview
- **React DevTools**: Component inspection and debugging
- **Redux DevTools**: State management visualization
- **ESLint**: Code quality and style checking
- **Jest**: Testing framework
- **Playwright**: End-to-end testing

### Recommended VS Code Extensions

1. **ESLint**: JavaScript linting
2. **Prettier**: Code formatting
3. **React Developer Tools**: React component tools
4. **GitLens**: Enhanced Git integration
5. **Debugger for Chrome**: Browser debugging
6. **Path Intellisense**: File path autocompletion

## 🔄 Version Control Workflow

### Branching Strategy

```
main          # Stable production-ready code
├── develop    # Integration branch for features
├── feature/*  # Individual feature branches
├── fix/*      # Bug fix branches
├── docs/*     # Documentation updates
└── release/*  # Release preparation branches
```

### Commit Guidelines

```bash
# Good commit messages
git commit -m "feat: add new music editor integration"
git commit -m "fix: resolve sprite rendering issue in Firefox"
git commit -m "docs: update contributing guidelines"
git commit -m "refactor: optimize block rendering performance"

# Use imperative mood: "Add feature" not "Added feature"
# Keep first line under 72 characters
# Add detailed description in body if needed
```

### Pull Request Process

1. **Create feature branch**: `git checkout -b feature/your-feature-name`
2. **Make changes**: Implement your feature or fix
3. **Test thoroughly**: Run tests and verify functionality
4. **Commit changes**: Follow commit message guidelines
5. **Push branch**: `git push origin feature/your-feature-name`
6. **Create PR**: Open pull request on GitHub
7. **Review process**: Address feedback and make improvements
8. **Merge**: Once approved, your code will be merged

## 🏗️ Build System

### Build Configuration

The project uses Webpack 4 with custom configuration:

- **Entry Points**: Multiple entry points for different modes
- **Loaders**: Babel for JSX/ES6, PostCSS for styles
- **Plugins**: HTML generation, asset optimization
- **Environment**: Development vs. production configurations

### Customizing the Build

Edit `webpack.config.js` to modify:
- **Entry points**: Add new application modes
- **Loaders**: Support additional file types
- **Plugins**: Add build optimizations
- **Environment variables**: Configure build behavior

### Build Modes

```bash
# Development build (default)
npm start

# Production build
npm run build

# Standalone build (self-contained HTML)
npm run build:standalone

# Library build (for integration)
npm run build:dist
```

## 🧩 Working with Components

### Component Structure

```jsx
// Typical component structure
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './MyComponent.css';

class MyComponent extends React.Component {
    static propTypes = {
        // Prop type definitions
    };

    render() {
        return (
            <div className={styles.container}>
                {/* Component content */}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyComponent);
```

### Creating New Components

1. **Create component file**: `src/components/MyComponent.jsx`
2. **Create styles**: `src/components/MyComponent.css`
3. **Add to index**: Export from `src/components/index.js`
4. **Import and use**: `import MyComponent from './components/MyComponent'`

## 🔌 Working with Addons

### Addon Structure

```
src/addons/
├── my-addon/            # Addon directory
│   ├── addon.js         # Main addon code
│   ├── settings.js      # Addon settings
│   ├── styles.css       # Addon styles
│   └── package.json     # Addon metadata
└── entry.js             # Addon entry point
```

### Creating an Addon

1. **Create directory**: `mkdir src/addons/my-addon`
2. **Add main file**: Implement your addon functionality
3. **Register addon**: Add to `src/addons/entry.js`
4. **Add settings**: Configure addon options
5. **Test**: Verify addon works in development mode

## 🎨 Working with Themes

### Theme Structure

```
src/lib/themes/
├── accent/              # Accent color themes
│   ├── aqua.js          # Default OmniBlocks theme
│   ├── blue.js          # Blue theme
│   └── ...
├── index.js             # Theme registry
└── theme-utils.js       # Theme utilities
```

### Creating a Theme

1. **Create theme file**: `src/lib/themes/accent/mytheme.js`
2. **Define colors**: Export color palette and styles
3. **Register theme**: Add to theme registry
4. **Test theme**: Verify theme appears in settings

## 🔧 Debugging and Testing

### Debugging Techniques

```javascript
// Console debugging
console.log('Debug message', variable);
console.warn('Warning message');
console.error('Error message');

// Debugger statements
debugger; // Pauses execution in devtools

// Performance profiling
console.time('operation');
// ... code to measure
console.timeEnd('operation');
```

### Testing Framework

- **Unit Tests**: Jest for component testing
- **Integration Tests**: Testing component interactions
- **E2E Tests**: Playwright for end-to-end testing
- **Snapshot Tests**: Visual regression testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/components/MyComponent.test.js

# Run in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 📦 Dependency Management

### Adding Dependencies

```bash
# Add production dependency
npm install package-name --save

# Add development dependency
npm install package-name --save-dev

# Add exact version
npm install package-name@1.2.3 --save-exact
```

### Updating Dependencies

```bash
# Update specific package
npm update package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated
```

## 🚀 Performance Optimization

### Code Optimization

- **Memoization**: Use `React.memo()` for pure components
- **Virtualization**: Implement virtual scrolling for lists
- **Debouncing**: Optimize event handlers
- **Lazy Loading**: Load components on demand
- **Code Splitting**: Split bundles for better caching

### Build Optimization

- **Tree Shaking**: Remove unused code
- **Minification**: Reduce bundle size
- **Compression**: Enable gzip/brotli
- **Caching**: Configure proper cache headers
- **CDN**: Use content delivery networks

## 🌐 Internationalization

### Translation System

- **Translation Files**: Located in `src/lib/tw-translations/`
- **Format**: JSON files with language codes
- **Integration**: Use translation hooks in components

### Adding Translations

1. **Create translation file**: `src/lib/tw-translations/xx.json`
2. **Add translations**: Map keys to translated strings
3. **Update registry**: Add language to supported languages
4. **Test**: Verify translations work in UI

## 📱 Mobile Development

### Mobile-Specific Considerations

- **Touch Targets**: Ensure adequate size for touch
- **Responsive Design**: Test on various screen sizes
- **Performance**: Optimize for mobile devices
- **Offline Support**: Implement service workers
- **Installation**: Configure PWA manifest

## 🔄 Continuous Integration

### CI/CD Pipeline

The project uses GitHub Actions for:
- **Automated Testing**: Run tests on push/pull request
- **Code Quality**: Linting and formatting checks
- **Build Verification**: Ensure build succeeds
- **Deployment**: Automated deployment to GitHub Pages

### CI Configuration

Edit `.github/workflows/` to customize:
- **Test matrix**: Different Node.js versions
- **Build targets**: Multiple build configurations
- **Deployment**: Custom deployment workflows

## 📚 Documentation Guidelines

### Writing Documentation

- **Markdown Format**: Use GitHub Flavored Markdown
- **Code Examples**: Include practical examples
- **Screenshots**: Add visual aids where helpful
- **Cross-references**: Link to related documentation
- **Versioning**: Keep documentation up-to-date

### Documentation Structure

```
docs/
├── Home.md                  # Main landing page
├── Installation.md          # Installation guide
├── Development-Setup.md     # Development setup
├── Architecture.md          # Technical architecture
├── Addons-System.md         # Addon documentation
├── Extensions.md            # Extension development
├── Theming.md               # Theme system
├── Troubleshooting.md       # Common issues
├── FAQ.md                   # Frequently asked questions
└── ...
```

## 🤝 Community Resources

### Getting Help

- **GitHub Discussions**: [https://github.com/orgs/OmniBlocks/discussions](https://github.com/orgs/OmniBlocks/discussions)
- **Issue Tracker**: Report bugs and request features
- **Documentation**: This wiki and README files
- **Code Reviews**: Learn from pull request feedback

### Contributing Back

- **Documentation**: Improve existing docs
- **Tutorials**: Create learning resources
- **Code Examples**: Share useful patterns
- **Bug Reports**: Help identify issues
- **Feature Requests**: Suggest improvements

## 🚧 Common Development Issues

### Dependency Conflicts

- **Solution**: Use `npm ci` for consistent installations
- **Prevention**: Keep `package-lock.json` updated
- **Debugging**: Check `npm ls` for dependency tree

### Build Failures

- **Solution**: Clear cache with `npm cache clean --force`
- **Prevention**: Regularly update dependencies
- **Debugging**: Check webpack output for specific errors

### Performance Problems

- **Solution**: Profile with Chrome DevTools
- **Prevention**: Follow performance best practices
- **Debugging**: Use React Profiler for component analysis

## 📖 Additional Resources

- **React Documentation**: [https://reactjs.org/docs](https://reactjs.org/docs)
- **Redux Documentation**: [https://redux.js.org](https://redux.js.org)
- **Webpack Documentation**: [https://webpack.js.org](https://webpack.js.org)
- **Scratch VM Documentation**: [https://github.com/LLK/scratch-vm](https://github.com/LLK/scratch-vm)
- **TurboWarp Documentation**: [https://docs.turbowarp.org](https://docs.turbowarp.org)

For more information, check our [Architecture Guide](Architecture.md) and [Contributing Guide](Contributing.md).