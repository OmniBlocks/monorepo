# Standalone Build Implementation Guide

## Overview
The standalone build creates self-contained HTML files with all JavaScript, CSS, and assets inlined.
Each HTML file can be opened directly in a browser without requiring a web server.

## How It Works

### 1. Key Technologies

**url-loader with limit: Infinity**
- Converts ALL assets (images, fonts, etc.) to base64 data URLs
- Instead of separate asset files, everything becomes data:image/png;base64,...

**webpack optimization: { splitChunks: false, runtimeChunk: false }**
- Disables code splitting - creates single bundle per entry point
- Inlines webpack runtime into the bundle

**html-webpack-inline-source-plugin**
- Takes generated <script src="bundle.js"> tags
- Reads bundle.js content and replaces tag with inline <script>code</script>

**publicPath: ''**
- Uses relative paths to avoid breaking offline usage

### 2. Implementation Steps

**Step 1: Install plugin**
**Step 1: Install plugin**
```bash
npm install --save-dev html-webpack-inline-source-plugin

**Step 2: Update .gitignore**
Add: /standalone

**Step 3: Update package.json scripts**
- Modify clean script to include: rimraf ./standalone && mkdirp standalone
- Add: "build:standalone": "BUILD_MODE=standalone webpack --colors --bail"

**Step 4: Create src/playground/standalone.ejs template**
- Simplified HTML template without external resource references
- No manifest, no service worker integration
- Basic splash screen

**Step 5: Extend webpack.config.js**
Add standalone configuration that activates when BUILD_MODE=standalone:

- entry: editor, player, fullscreen
- output.path: standalone/
- output.publicPath: ''
- optimization: { splitChunks: false, runtimeChunk: false }
- url-loader with limit: Infinity (inline all assets)
- HtmlWebpackPlugin instances for each entry (template: standalone.ejs)
- HtmlWebpackInlineSourcePlugin to inline the scripts

### 3. The Build Process

When you run: npm run build:standalone

1. BUILD_MODE=standalone environment variable is set
2. Webpack detects this and uses standalone configuration
3. Assets are bundled with url-loader (limit: Infinity)
   - Images become: data:image/png;base64,iVBORw0KG...
   - Fonts become: data:font/woff2;base64,...
4. Code splitting is disabled, creating single bundle per entry
5. HtmlWebpackPlugin generates HTML with <script src="editor.js">
6. HtmlWebpackInlineSourcePlugin:
   - Reads editor.js file
   - Replaces <script src="editor.js"> with <script>/* bundle content */</script>
   - Deletes the separate .js file
7. Result: standalone/editor.html (single file, 5-10MB)

### 4. Technical Details

**Normal Build vs Standalone:**

Normal:
  build/
    index.html (5KB)
    js/editor.abc123.js (2MB)
    js/vendor.def456.js (3MB)
    static/assets/image.png (500KB)

Standalone:
  standalone/
    editor.html (5.5MB) - Everything inside!

**Asset Conversion Example:**

500KB image in normal build:
  - Separate file: static/assets/logo.abc123.png
  - HTML: <img src="static/assets/logo.abc123.png">

Same image in standalone:
  - Converted to ~667KB base64 string
  - HTML: <img src="data:image/png;base64,iVBORw0KGgoAAAA...">
  - No separate file

### 5. Why This Configuration?

**limit: Infinity**
- Normal: limit: 2048 (only inline files < 2KB)
- Standalone: limit: Infinity (inline EVERYTHING)

**splitChunks: false**
- Normal: splits code into chunks for caching
- Standalone: single bundle, nothing to cache

**publicPath: ''**
- Normal: publicPath: '/' or '/static/'
- Standalone: empty string for relative paths

### 6. Use Cases

Good for:
- Offline demos and presentations
- Distribution to non-technical users
- USB drive deployment
- Environments without web servers
- File-based CMS systems

Not good for:
- Production websites (use regular build)
- Frequently updated content
- Mobile/low-bandwidth users
- Sites needing HTTP caching

### 7. Trade-offs

Advantages:
  + Works offline immediately
  + Single file distribution
  + No server configuration
  + No CORS issues

Disadvantages:
  - Large file size (5-15MB each)
  - Slower initial load/parse
  - No HTTP caching benefits
  - No resource sharing between pages

## Summary

The standalone build creates self-contained HTML files through:
1. Inlining all assets as base64 (url-loader limit: Infinity)
2. Creating single JavaScript bundles (splitChunks: false)
3. Inlining scripts into HTML (HtmlWebpackInlineSourcePlugin)
4. Using relative paths (publicPath: '')

Result: HTML files that work anywhere, no server required!