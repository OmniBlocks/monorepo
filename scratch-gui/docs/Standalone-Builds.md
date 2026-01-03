# 📦 Standalone Builds Guide

Comprehensive guide to creating and using standalone OmniBlocks builds.

## 🎯 Overview

Standalone builds create self-contained HTML files that work without requiring a web server. Each HTML file contains all JavaScript, CSS, and assets inlined, making it perfect for offline use, distribution, and environments without web hosting.

## 🚀 When to Use Standalone Builds

### Ideal Use Cases

- **Offline Demos**: Presentations and workshops without internet
- **Distribution**: Share projects on USB drives or local networks
- **Education**: Classroom environments with restricted internet
- **Embedded Systems**: Devices without web server capabilities
- **File-based CMS**: Systems that work with static HTML files

### Limitations

- **Large File Size**: 5-15MB per file (vs ~500KB for normal builds)
- **No Caching**: All assets loaded on each page visit
- **Slower Initial Load**: Browser must parse large inline content
- **No Updates**: Static files require manual updates

## 🛠️ Creating Standalone Builds

### Prerequisites

- Node.js 22+ installed
- OmniBlocks repository cloned
- Dependencies installed (`npm ci`)
- `html-webpack-inline-source-plugin` installed

### Installation

```bash
# Install the required plugin
npm install --save-dev html-webpack-inline-source-plugin
```

### Build Process

```bash
# Create standalone build
npm run build:standalone
```

This command:
1. Sets `BUILD_MODE=standalone` environment variable
2. Runs webpack with standalone configuration
3. Creates self-contained HTML files in `standalone/` directory
4. Inlines all JavaScript, CSS, and assets

### Build Output

```
standalone/
├── editor.html          # Full editor (5-10MB)
├── player.html          # Project player (3-8MB)
└── fullscreen.html      # Fullscreen mode (2-6MB)
```

## 🔧 Technical Implementation

### Key Technologies

1. **url-loader with `limit: Infinity`**
   - Converts ALL assets to base64 data URLs
   - Images, fonts, sounds become inline data
   - Example: `data:image/png;base64,iVBORw0KG...`

2. **Webpack Optimization**
   ```javascript
   optimization: {
     splitChunks: false,    // Single bundle per entry
     runtimeChunk: false    // Inline webpack runtime
   }
   ```

3. **HTML Inline Plugin**
   - Replaces `<script src="bundle.js">` with inline `<script>code</script>`
   - Eliminates separate JavaScript files
   - Reduces HTTP requests to zero

4. **Relative Paths**
   - `publicPath: ''` for offline compatibility
   - No dependency on specific domain or path

### Webpack Configuration

The standalone configuration extends the base webpack config:

```javascript
// In webpack.config.js
module.exports = [
  // Regular build configurations...
].concat(
  process.env.BUILD_MODE === 'standalone' ? [
    {
      entry: {
        'editor': './src/playground/editor.jsx',
        'player': './src/playground/player.jsx',
        'fullscreen': './src/playground/fullscreen.jsx'
      },
      output: {
        path: path.resolve(__dirname, 'standalone'),
        filename: 'js/[name].js',
        publicPath: ''  // Critical for offline use
      },
      optimization: {
        splitChunks: false,    // No code splitting
        runtimeChunk: false    // No separate runtime
      },
      module: {
        rules: [
          // Inline ALL assets regardless of size
          {
            test: /\.(svg|png|wav|mp3|gif|jpg|woff2|hex)$/,
            loader: 'url-loader',
            options: {
              limit: Infinity,  // Inline everything!
              esModule: false
            }
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
          'process.env.STANDALONE': 'true'
        }),
        // Create HTML files with inline source pattern
        new HtmlWebpackPlugin({
          chunks: ['editor'],
          template: 'src/playground/standalone.ejs',
          filename: 'editor.html',
          inlineSource: '.(js|css)$'  // Pattern for inlining
        }),
        // Additional HtmlWebpackPlugin instances for player/fullscreen
        new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)
      ]
    }
  ] : []
);
```

### Standalone Template

The `src/playground/standalone.ejs` template differs from regular templates:

- **No External Resources**: No manifest, service worker, or external script tags
- **Simplified Structure**: Minimal HTML structure for inlining
- **No LocalStorage Dependencies**: Works in restricted environments
- **Inline-Friendly**: Designed for script/style inlining

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title><%= htmlWebpackPlugin.options.title %></title>
    <style>
      /* All critical CSS inlined here */
      .splash-screen { /* ... */ }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <!-- Scripts will be inlined here by HtmlWebpackInlineSourcePlugin -->
  </body>
</html>
```

## 📊 Build Comparison

### Normal Build vs Standalone Build

| Aspect | Normal Build | Standalone Build |
|--------|--------------|------------------|
| **File Count** | 100+ files | 1-3 files |
| **Total Size** | ~5MB | ~15MB |
| **HTML Size** | 5KB | 5-10MB |
| **JS Files** | Multiple chunks | Inlined |
| **CSS Files** | Separate files | Inlined |
| **Assets** | Separate files | Base64 encoded |
| **HTTP Requests** | 20-50 | 1 |
| **Offline Ready** | ❌ No | ✅ Yes |
| **Caching** | ✅ Yes | ❌ No |
| **Load Time** | Fast (cached) | Slow (parse large file) |

### Asset Conversion Example

**Normal Build:**
```html
<img src="static/assets/logo.abc123.png">
<!-- Separate file: static/assets/logo.abc123.png (500KB) -->
```

**Standalone Build:**
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...">
<!-- Inline: ~667KB base64 string, no separate file -->
```

## 🎨 Customizing Standalone Builds

### Configuration Options

Edit `webpack.config.js` to customize:

```javascript
// Customize standalone build
standaloneConfig: {
  entry: {
    // Add custom entry points
    'custom': './src/playground/custom.jsx'
  },
  output: {
    // Custom output directory
    path: path.resolve(__dirname, 'custom-standalone')
  },
  optimization: {
    // Adjust optimization settings
    minimize: true,  // Minify output
    usedExports: true  // Tree shaking
  }
}
```

### Template Customization

Modify `src/playground/standalone.ejs`:

- **Add Custom Meta Tags**: For better PWA support
- **Modify Splash Screen**: Custom loading experience
- **Add Analytics**: Optional tracking (respect privacy)
- **Custom Title**: Project-specific branding

### Asset Handling

Control which assets get inlined:

```javascript
// In webpack.config.js
{
  test: /\.(svg|png|wav|mp3|gif|jpg|woff2|hex)$/,
  loader: 'url-loader',
  options: {
    limit: 10240,  // Only inline assets < 10KB
    fallback: 'file-loader',  // Larger assets as separate files
    esModule: false
  }
}
```

## 🚀 Using Standalone Builds

### Distribution Methods

1. **Direct File Sharing**: Email, USB drives, file sharing services
2. **Web Hosting**: Upload to any static web hosting
3. **Local Network**: Serve from local file server
4. **Embedded Systems**: Include in device firmware
5. **Offline Apps**: Bundle with electron or similar

### Deployment Examples

```bash
# Copy to web server
scp standalone/*.html user@server:/var/www/html/

# Serve locally with Python
python3 -m http.server 8000 --directory standalone

# Create ZIP archive for distribution
zip -r omniblocks-standalone.zip standalone/
```

### Browser Compatibility

Standalone builds work in:

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (with limitations)

**Note**: Some features may be limited in older browsers due to large file parsing.

## 🔧 Advanced Configuration

### Multiple Entry Points

Create different standalone versions:

```javascript
// In webpack.config.js
entry: {
  'editor-full': './src/playground/editor.jsx',
  'editor-lite': './src/playground/editor-lite.jsx',  // Reduced feature set
  'player': './src/playground/player.jsx',
  'player-embed': './src/playground/player-embed.jsx'  // Embed-friendly
}
```

### Environment Variables

Use different configurations:

```bash
# Development standalone build
BUILD_MODE=standalone NODE_ENV=development npm run build:standalone

# Production standalone build
BUILD_MODE=standalone NODE_ENV=production npm run build:standalone
```

### Custom Plugins

Add additional webpack plugins:

```javascript
// Example: Add compression plugin
const CompressionPlugin = require('compression-webpack-plugin');

plugins: [
  // ... existing plugins
  new CompressionPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.8
  })
]
```

## 🧪 Testing Standalone Builds

### Verification Checklist

1. **Offline Functionality**: Test without internet connection
2. **File Size**: Verify expected file sizes
3. **Feature Parity**: Compare with normal build
4. **Performance**: Test load times and responsiveness
5. **Browser Compatibility**: Test in target browsers
6. **Error Handling**: Test error recovery

### Automated Testing

```javascript
// Example test for standalone build
describe('Standalone Build', () => {
  it('should load without network requests', async () => {
    // Mock all network requests to fail
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    
    // Load standalone HTML
    const html = fs.readFileSync('standalone/editor.html', 'utf8');
    
    // Verify all resources are inlined
    expect(html).not.toContain('src="');
    expect(html).not.toContain('href="');
    expect(html).toContain('data:image/png;base64');
    expect(html).toContain('<script>');
  });
});
```

## 🔄 Updating Standalone Builds

### Update Process

1. **Pull Latest Changes**: `git pull origin main`
2. **Update Dependencies**: `npm ci`
3. **Rebuild**: `npm run build:standalone`
4. **Test**: Verify new build works
5. **Distribute**: Replace old files with new ones

### Version Management

- **Semantic Versioning**: Include version in filenames
- **Build Metadata**: Add commit hash and timestamp
- **Changelog**: Document changes between versions

## 🚧 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Build fails** | Missing plugin | `npm install html-webpack-inline-source-plugin` |
| **Large file size** | All assets inlined | Use `limit` option to exclude large assets |
| **Slow loading** | Browser parsing large file | Optimize asset compression, reduce bundle size |
| **White screen** | JavaScript error | Check browser console, verify inlining worked |
| **Missing features** | Standalone mode limitations | Check `process.env.STANDALONE` conditions |
| **CORS errors** | External resource references | Ensure all resources are inlined or local |

### Debugging Tips

```bash
# Build with verbose output
BUILD_MODE=standalone npm run build -- --verbose

# Check inlined content
grep -c "data:image" standalone/editor.html

# Verify file size
ls -lh standalone/

# Test in browser with devtools
open standalone/editor.html
```

## 📊 Performance Optimization

### Reducing File Size

1. **Compression**: Enable gzip/brotli compression
2. **Minification**: Ensure webpack minification
3. **Tree Shaking**: Remove unused code
4. **Asset Optimization**: Compress images and sounds
5. **Code Splitting**: Strategic code splitting (limited)

### Improving Load Time

1. **Preload**: Use `<link rel="preload">` hints
2. **Lazy Parsing**: Defer non-critical script parsing
3. **Progressive Loading**: Show loading indicators
4. **Web Workers**: Offload heavy initialization
5. **Service Workers**: Cache for repeat visits

## 🌐 Standalone vs Other Build Types

### Build Type Comparison

| Feature | Standalone | Normal | Library | Embed |
|---------|------------|--------|---------|-------|
| **Self-contained** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Offline Ready** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Single File** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **HTTP Caching** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Code Splitting** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best For** | Distribution | Web hosting | Integration | Embedding |

## 📚 Best Practices

### Development Best Practices

1. **Test Regularly**: Verify standalone builds during development
2. **Monitor Size**: Keep track of file size growth
3. **Document Limitations**: Note standalone-specific behaviors
4. **Conditional Code**: Use `process.env.STANDALONE` for platform-specific code
5. **Performance Budget**: Set size and load time targets

### Distribution Best Practices

1. **Compress Files**: Use ZIP or other compression
2. **Version Files**: Include version information
3. **Document Requirements**: Browser and system requirements
4. **Provide Fallbacks**: Offer alternative for unsupported browsers
5. **Update Mechanism**: Plan for future updates

## 🔮 Future Enhancements

### Planned Improvements

1. **Selective Inlining**: Choose which assets to inline
2. **Lazy Loading**: Load non-critical assets on demand
3. **Delta Updates**: Patch existing standalone files
4. **Custom Templates**: More template options
5. **Size Optimization**: Better compression algorithms

### Community Contributions

Opportunities to improve standalone builds:

- **Better Compression**: Implement advanced compression
- **Performance Profiling**: Analyze and optimize load times
- **Feature Parity**: Ensure all features work standalone
- **Documentation**: Improve standalone build guides
- **Testing**: Expand test coverage for standalone mode

## 📖 Additional Resources

- **Webpack Documentation**: [https://webpack.js.org](https://webpack.js.org)
- **url-loader Documentation**: [https://github.com/webpack-contrib/url-loader](https://github.com/webpack-contrib/url-loader)
- **HtmlWebpackPlugin**: [https://github.com/jantimon/html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)
- **HtmlWebpackInlineSourcePlugin**: [https://github.com/DustinJackson/html-webpack-inline-source-plugin](https://github.com/DustinJackson/html-webpack-inline-source-plugin)
- **TurboWarp Standalone**: [https://docs.turbowarp.org/standalone](https://docs.turbowarp.org/standalone)

For more information about the build system, see our [Build System Documentation](Build-System.md) and [Development Setup Guide](Development-Setup.md).