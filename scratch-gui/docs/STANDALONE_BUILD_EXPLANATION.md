# Standalone Build Implementation Guide

## Overview
The standalone build creates self-contained HTML files that can be opened directly in a browser without requiring a web server. Each HTML file contains all JavaScript, CSS, and assets inlined.

## How It Works

### 1. Architecture Components

#### A. New Template File: `src/playground/standalone.ejs`
This template is designed for standalone builds with:
- Inline JavaScript (no external script tags)
- Inline CSS (all styles embedded)
- Base64-encoded assets
- No external dependencies
- Self-contained execution environment

#### B. Webpack Configuration Changes

**Key Modifications to `webpack.config.js`:**

1. **BUILD_MODE Environment Variable**
   ```javascript
   process.env.BUILD_MODE === 'standalone'
   ```
   This flag activates standalone-specific configuration.

2. **Output Configuration**
   ```javascript
   output: {
     path: path.resolve(__dirname, 'standalone'),
     filename: 'js/[name].js',
     chunkFilename: 'js/[name].js',
     publicPath: ''  // Empty for relative paths
   }
   ```

3. **Optimization Changes**
   ```javascript
   optimization: {
     splitChunks: false,  // Disable code splitting
     runtimeChunk: false  // Inline webpack runtime
   }
   ```
   This ensures all code goes into a single bundle per entry point.

4. **Asset Handling**
   ```javascript
   {
     test: /\.(svg|png|wav|mp3|gif|jpg|woff2|hex)$/,
     loader: 'url-loader',
     options: {
       limit: Infinity,  // Inline ALL assets regardless of size
       esModule: false
     }
   }
   ```
   The `limit: Infinity` setting means everything gets base64-encoded.

5. **HTML Generation**
   ```javascript
   new HtmlWebpackPlugin({
     chunks: ['editor'],
     template: 'src/playground/standalone.ejs',
     filename: 'editor.html',
     inject: 'body',
     inlineSource: '.(js|css)$'  // Pattern for inlining
   })
   ```

6. **Inline Plugin** (requires installation)
   ```javascript
   new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)
   ```
   This plugin processes the HTML after generation and inlines script/style tags.

### 2. Package.json Script Changes

```json
{
  "scripts": {
    "clean": "rimraf ./build && mkdirp build && rimraf ./dist && mkdirp dist && rimraf ./standalone && mkdirp standalone",
    "build:standalone": "BUILD_MODE=standalone webpack --colors --bail"
  }
}
```

**What happens:**
1. `clean` script now removes and recreates `standalone/` directory
2. `build:standalone` sets BUILD_MODE env var and runs webpack
3. Webpack detects `BUILD_MODE=standalone` and uses standalone configuration

### 3. Conditional Configuration Pattern

The webpack config uses this pattern:

```javascript
module.exports = [
  // Regular build (editor, player, fullscreen)
  defaultsDeep({}, base, { /* regular config */ }),
  
  // Library build (scratch-gui)
  process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'dist' ? (
    defaultsDeep({}, base, { /* library config */ })
  ) : []
].concat(
  // Standalone build (NEW)
  process.env.BUILD_MODE === 'standalone' ? [
    defaultsDeep({}, base, {
      entry: {
        'editor': './src/playground/editor.jsx',
        'player': './src/playground/player.jsx',
        'fullscreen': './src/playground/fullscreen.jsx'
      },
      output: {
        path: path.resolve(__dirname, 'standalone'),
        filename: 'js/[name].js',
        publicPath: ''
      },
      optimization: {
        splitChunks: false,
        runtimeChunk: false
      },
      module: {
        rules: base.module.rules.concat([
          {
            test: /\.(svg|png|wav|mp3|gif|jpg|woff2|hex)$/,
            loader: 'url-loader',
            options: {
              limit: Infinity,  // Inline everything
              esModule: false
            }
          }
        ])
      },
      plugins: base.plugins.concat([
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
          'process.env.STANDALONE': 'true'
        }),
        new HtmlWebpackPlugin({
          chunks: ['editor'],
          template: 'src/playground/standalone.ejs',
          filename: 'editor.html',
          inject: 'body',
          inlineSource: '.(js|css)$'
        }),
        new HtmlWebpackPlugin({
          chunks: ['player'],
          template: 'src/playground/standalone.ejs',
          filename: 'player.html',
          inject: 'body',
          inlineSource: '.(js|css)$'
        }),
        new HtmlWebpackPlugin({
          chunks: ['fullscreen'],
          template: 'src/playground/standalone.ejs',
          filename: 'fullscreen.html',
          inject: 'body',
          inlineSource: '.(js|css)$'
        }),
        new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)
      ])
    })
  ] : []
);
```

### 4. The Standalone Template

`src/playground/standalone.ejs` differs from `index.ejs`:

**Key Differences:**
- No external resource references (manifest, apple-touch-icon paths)
- Simplified splash screen (no service worker integration)
- No localStorage/theme persistence features (optional)
- Inline-friendly structure
- No external script/link tags expected

**Basic Structure:**
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
    <!-- HtmlWebpackInlineSourcePlugin will inline the bundle here -->
  </body>
</html>
```

### 5. Git Ignore Update

`.gitignore` addition: