# 🔧 Troubleshooting Guide

Comprehensive solutions to common OmniBlocks issues.

## 🚨 Emergency Quick Fixes

### OmniBlocks Won't Load

**Symptoms:** Blank screen, infinite loading, error messages

**Quick Solutions:**
1. **Hard Refresh**: `Ctrl + F5` or `Cmd + Shift + R`
2. **Clear Cache**: Browser cache might be corrupted
3. **Try Incognito**: `Ctrl + Shift + N` (Chrome) or `Cmd + Shift + N` (Mac)
4. **Different Browser**: Try Chrome, Firefox, or Edge
5. **Check Console**: `F12` → Console tab for error messages

### Project Won't Run

**Symptoms:** Green flag doesn't work, scripts don't execute

**Quick Solutions:**
1. **Enable Turbo Mode**: Settings → Performance → Turbo Mode
2. **Simplify Project**: Remove complex scripts temporarily
3. **Check for Errors**: Look for red error indicators
4. **Restart OmniBlocks**: Close and reopen
5. **Try Different Browser**: Browser-specific issues

### Can't Save Projects

**Symptoms:** Save button doesn't work, errors when saving

**Quick Solutions:**
1. **Try Different Format**: File → Save As → Different format
2. **Different Location**: Save to different folder
3. **Browser Permissions**: Check if browser has file access
4. **Clear Cache**: Browser storage issues
5. **Use Export**: File → Export instead of Save

## 📥 Installation Issues

### Installation Fails

**Symptoms:** `npm install` fails, dependencies don't install

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with exact versions
npm ci

# If still failing, try legacy peer deps
npm install --legacy-peer-deps

# Check Node.js version
node -v  # Should be v22.x

# Try different Node.js version
nvm install 22
nvm use 22
```

**Common Causes:**
- **Node.js version mismatch**: Use Node.js 22
- **Permission issues**: Try `sudo` on Linux/Mac (not recommended)
- **Network problems**: Check internet connection
- **Corrupted cache**: Clear npm cache
- **Dependency conflicts**: Use `npm ci` for consistency

### Development Server Won't Start

**Symptoms:** `npm start` fails, server doesn't launch

**Solutions:**

```bash
# Check port availability
lsof -i :8601  # Linux/Mac
netstat -ano | findstr :8601  # Windows

# Use different port
PORT=8602 npm start

# Kill process on port
kill -9 $(lsof -t -i :8601)  # Linux/Mac

# Check for errors
npm start 2> error.log
cat error.log
```

**Common Causes:**
- **Port conflict**: Another process using port 8601
- **Missing dependencies**: Run `npm ci` first
- **Corrupted build**: Delete `build/` directory
- **Memory issues**: Close other applications
- **Webpack issues**: Update webpack dependencies

### Build Fails

**Symptoms:** `npm run build` fails, production build doesn't work

**Solutions:**

```bash
# Clean build artifacts
npm run clean

# Build with verbose output
npm run build -- --verbose

# Check specific errors
npm run build 2> build-error.log

# Try development build first
npm start

# Check Node.js memory
node --max-old-space-size=4096 node_modules/webpack/bin/webpack.js
```

**Common Causes:**
- **Memory limits**: Increase Node.js memory
- **Webpack version**: Check webpack compatibility
- **Babel issues**: Update babel dependencies
- **Asset problems**: Check image/sound files
- **Syntax errors**: Fix JavaScript errors

## 🎨 Interface Issues

### Blocks Missing

**Symptoms:** Blocks not appearing in palette, extensions not working

**Solutions:**

1. **Enable Extensions**: Click extensions button, enable required extensions
2. **Check Addons**: Settings → Addons, enable relevant addons
3. **Restart OmniBlocks**: Clear temporary state
4. **Clear Cache**: Browser cache might have old data
5. **Check Console**: Look for extension loading errors
6. **Reinstall**: Corrupted installation

**Debugging:**
```javascript
// Check loaded extensions
console.log(Scratch.extensions.getAll());

// Check enabled addons
console.log(addons.getEnabled());
```

### Theme Not Applying

**Symptoms:** Theme changes don't take effect, visual glitches

**Solutions:**

1. **Hard Refresh**: `Ctrl + F5` to clear cached styles
2. **Check Theme Files**: Verify theme files exist
3. **Console Errors**: Look for CSS loading errors
4. **Disable Addons**: Addons might override themes
5. **Clear LocalStorage**: Corrupted theme settings
6. **Reinstall**: Missing theme files

**Debugging:**
```javascript
// Check current theme
console.log('Current theme:', localStorage.getItem('theme'));

// List available themes
console.log('Available themes:', themes.getAll());
```

### UI Glitches

**Symptoms:** Overlapping elements, misaligned components, visual bugs

**Solutions:**

1. **Hard Refresh**: Clear cached styles
2. **Disable Addons**: Addons might cause conflicts
3. **Check Console**: CSS or layout errors
4. **Browser Zoom**: Reset to 100%
5. **Different Browser**: Browser-specific rendering issues
6. **Clear Cache**: Corrupted style data

**Debugging:**
```css
/* Add to browser devtools */
* { outline: 1px solid red !important; }
/* Shows element boundaries */
```

## ⚡ Performance Issues

### Slow Performance

**Symptoms:** Laggy interface, slow project execution, high CPU usage

**Solutions:**

1. **Enable Turbo Mode**: Settings → Performance → Turbo Mode
2. **Reduce Project Complexity**: Fewer sprites, simpler scripts
3. **Close Browser Tabs**: Free up memory
4. **Use Chrome/Edge**: Best performance on Chromium
5. **Check for Infinite Loops**: Common cause of slowdowns
6. **Optimize Assets**: Smaller images, compressed sounds

**Debugging:**
```javascript
// Check performance
console.time('operation');
// ... code to measure
console.timeEnd('operation');

// Memory usage
console.log('Memory:', performance.memory);
```

### High Memory Usage

**Symptoms:** Browser crashes, slow performance, memory warnings

**Solutions:**

1. **Close Other Tabs**: Free up browser memory
2. **Reduce Project Size**: Fewer assets, simpler scripts
3. **Enable Garbage Collection**: Settings → Advanced
4. **Restart Browser**: Clear memory
5. **Use 64-bit Browser**: Better memory handling
6. **Check for Memory Leaks**: Continuous memory growth

**Debugging:**
```javascript
// Monitor memory
setInterval(() => {
    console.log('Memory:', performance.memory.usedJSHeapSize / 1024 / 1024, 'MB');
}, 1000);
```

### Long Load Times

**Symptoms:** Slow startup, long project loading

**Solutions:**

1. **Clear Cache**: Browser cache might be large
2. **Disable Addons**: Addons slow down loading
3. **Use PWA**: Progressive Web App loads faster
4. **Check Network**: Slow internet connection
5. **Optimize Project**: Reduce asset sizes
6. **Preload Assets**: Settings → Performance

**Debugging:**
```javascript
// Check load times
performance.mark('start');
// ... loading code
performance.mark('end');
performance.measure('loadTime', 'start', 'end');
```

## 🧩 Project Issues

### Corrupted Projects

**Symptoms:** Projects won't load, error messages, missing data

**Solutions:**

1. **Try Auto-Recovery**: OmniBlocks might have backups
2. **Load from Backup**: Check browser local storage
3. **Export/Import**: Try exporting and re-importing
4. **Check Console**: Look for specific errors
5. **Use Different Browser**: Browser-specific issues
6. **Contact Support**: Provide project file for analysis

**Recovery Tools:**
```javascript
// Check local storage backups
console.log('Backups:', JSON.parse(localStorage.getItem('projectBackups')));

// Manual recovery
const corrupted = /* corrupted project data */;
const fixed = fixCorruptedProject(corrupted);
```

### Missing Assets

**Symptoms:** Images/sounds not loading, broken references

**Solutions:**

1. **Check File Paths**: Verify asset locations
2. **Reimport Assets**: Add assets again
3. **Check Project File**: Open `.sb3` in text editor
4. **Clear Cache**: Browser might have old references
5. **Use Different Browser**: Browser-specific asset issues
6. **Verify Permissions**: Browser might block assets

**Debugging:**
```javascript
// Check loaded assets
console.log('Assets:', vm.runtime.assets);

// Check missing assets
console.log('Missing:', vm.runtime.missingAssets);
```

### Script Errors

**Symptoms:** Red error indicators, scripts not running, error messages

**Solutions:**

1. **Check Error Messages**: Specific error details
2. **Simplify Scripts**: Remove complex parts temporarily
3. **Isolate Problem**: Find which script causes issues
4. **Check Blocks**: Verify block connections
5. **Restart Project**: Clear temporary state
6. **Use Debugger**: Step through scripts

**Debugging:**
```javascript
// Check script errors
console.log('Errors:', vm.runtime.errors);

// Monitor script execution
vm.runtime.on('SCRIPT_ERROR', (error) => {
    console.error('Script error:', error);
});
```

## 🔌 Extension Issues

### Extensions Not Loading

**Symptoms:** Extensions don't appear, blocks missing, extension errors

**Solutions:**

1. **Check Extension Registration**: Verify extension is registered
2. **Enable in Settings**: Extensions might be disabled
3. **Check Dependencies**: Missing scratch-vm dependencies
4. **Clear Cache**: Browser cache issues
5. **Reinstall**: Corrupted extension files
6. **Check Console**: Extension loading errors

**Debugging:**
```javascript
// Check loaded extensions
console.log('Extensions:', Scratch.extensions.getAll());

// Check registration
console.log('Registered:', Scratch.extensions.isLoaded('extensionId'));
```

### Extension Conflicts

**Symptoms:** Extensions interfere with each other, unexpected behavior

**Solutions:**

1. **Disable Conflicting Extensions**: Find which extensions conflict
2. **Check Dependencies**: Extension dependency issues
3. **Update Extensions**: Outdated extensions
4. **Isolate Problem**: Test extensions individually
5. **Check Console**: Conflict-related errors
6. **Contact Developers**: Report conflicts

**Debugging:**
```javascript
// Check extension interactions
Scratch.extensions.on('*', (event, data) => {
    console.log('Extension event:', event, data);
});
```

### Custom Extensions Not Working

**Symptoms:** Custom extensions fail to load, errors in implementation

**Solutions:**

1. **Check Registration**: Extension properly registered
2. **Verify Block Definitions**: Correct block specifications
3. **Test Implementation**: Block functions work correctly
4. **Check Dependencies**: All required dependencies present
5. **Validate Structure**: Extension follows correct structure
6. **Check Console**: Specific error messages

**Debugging:**
```javascript
// Test extension loading
try {
    const ext = new MyExtension();
    console.log('Extension info:', ext.getInfo());
} catch (error) {
    console.error('Extension error:', error);
}
```

## 🔧 Addon Issues

### Addons Not Appearing

**Symptoms:** Addons don't show in settings, addon features missing

**Solutions:**

1. **Check Registration**: Addon registered in `entry.js`
2. **Verify Structure**: Correct addon directory structure
3. **Enable in Settings**: Addons might be disabled
4. **Clear Cache**: Browser cache issues
5. **Check Console**: Addon loading errors
6. **Reinstall**: Corrupted addon files

**Debugging:**
```javascript
// Check registered addons
console.log('Addons:', addons.getAll());

// Check enabled addons
console.log('Enabled:', addons.getEnabled());
```

### Addon Conflicts

**Symptoms:** Addons interfere with each other, UI glitches, errors

**Solutions:**

1. **Disable Conflicting Addons**: Find problematic addons
2. **Check Dependencies**: Addon dependency issues
3. **Update Addons**: Outdated addons
4. **Isolate Problem**: Test addons individually
5. **Check Console**: Conflict errors
6. **Contact Developers**: Report issues

**Debugging:**
```javascript
// Monitor addon events
addons.on('*', (event, data) => {
    console.log('Addon event:', event, data);
});
```

### Custom Addons Not Working

**Symptoms:** Custom addons fail to load, errors in implementation

**Solutions:**

1. **Check Registration**: Addon properly registered
2. **Verify Structure**: Correct addon structure
3. **Test Implementation**: Addon functions work
4. **Check Dependencies**: All dependencies present
5. **Validate Settings**: Correct settings structure
6. **Check Console**: Specific errors

**Debugging:**
```javascript
// Test addon loading
try {
    const addon = require('./my-addon/addon.js');
    console.log('Addon loaded:', addon.info);
} catch (error) {
    console.error('Addon error:', error);
}
```

## 🌐 Network Issues

### Cloud Features Not Working

**Symptoms:** Cloud variables fail, online features don't work

**Solutions:**

1. **Check Internet Connection**: Verify network access
2. **Browser Permissions**: Allow network access
3. **Firewall Settings**: Allow OmniBlocks connections
4. **Clear Cache**: Corrupted network data
5. **Try Different Network**: Network-specific issues
6. **Check Service Status**: Cloud service might be down

**Debugging:**
```javascript
// Check network requests
fetch('https://cloud.omniblocks.org/status')
    .then(response => response.json())
    .then(data => console.log('Cloud status:', data))
    .catch(error => console.error('Network error:', error));
```

### Offline Features Not Working

**Symptoms:** Offline mode fails, local storage issues

**Solutions:**

1. **Enable Offline Mode**: Settings → Offline
2. **Check Browser Support**: Service worker support
3. **Clear Cache**: Corrupted offline data
4. **Reinstall PWA**: Progressive Web App issues
5. **Check Storage**: Sufficient local storage
6. **Browser Permissions**: Allow offline storage

**Debugging:**
```javascript
// Check offline status
console.log('Offline:', navigator.onLine);

// Check service worker
navigator.serviceWorker.getRegistrations()
    .then(registrations => console.log('Service workers:', registrations));
```

### CORS Errors

**Symptoms:** Cross-origin resource sharing errors, blocked requests

**Solutions:**

1. **Use Proxy**: Configure proxy for development
2. **Disable CORS**: Browser extensions for testing
3. **Configure Server**: Proper CORS headers
4. **Use Local Server**: Avoid cross-origin issues
5. **Check URLs**: Verify resource locations
6. **Update Configuration**: Webpack dev server settings

**Debugging:**
```javascript
// Check CORS headers
fetch('https://example.com/resource', { mode: 'cors' })
    .then(response => {
        console.log('Headers:', response.headers);
        return response.text();
    })
    .catch(error => console.error('CORS error:', error));
```

## 📱 Mobile Issues

### Touch Interface Problems

**Symptoms:** Touch not working, gestures not recognized, UI issues

**Solutions:**

1. **Enable Touch Mode**: Settings → Interface → Touch Mode
2. **Check Browser**: Use Chrome or Safari
3. **Update Browser**: Latest browser version
4. **Clear Cache**: Corrupted touch data
5. **Restart Device**: Temporary glitches
6. **Check Screen**: Clean touchscreen surface

**Debugging:**
```javascript
// Check touch events
document.addEventListener('touchstart', (e) => {
    console.log('Touch:', e.touches);
});
```

### Performance on Mobile

**Symptoms:** Slow on mobile devices, laggy interface, crashes

**Solutions:**

1. **Use Mobile Mode**: Settings → Interface → Mobile Mode
2. **Reduce Complexity**: Simpler projects for mobile
3. **Close Apps**: Free up device memory
4. **Use WiFi**: Better than mobile data
5. **Clear Cache**: Browser cache issues
6. **Update OS**: Latest operating system

**Debugging:**
```javascript
// Check mobile performance
console.log('Device:', {
    memory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    userAgent: navigator.userAgent
});
```

### Mobile Browser Issues

**Symptoms:** Browser-specific problems, rendering issues, crashes

**Solutions:**

1. **Try Different Browser**: Chrome, Safari, Firefox
2. **Update Browser**: Latest version
3. **Clear Cache**: Browser-specific issues
4. **Disable Extensions**: Browser extensions might conflict
5. **Use Desktop Mode**: Browser desktop mode
6. **Check Console**: Browser-specific errors

**Debugging:**
```javascript
// Check browser capabilities
console.log('Browser:', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    languages: navigator.languages
});
```

## 🎵 Music Editor Issues

### Music Editor Not Loading

**Symptoms:** Music editor fails to open, errors when accessing

**Solutions:**

1. **Check Extension**: Music extension enabled
2. **Clear Cache**: Browser cache issues
3. **Update Browser**: Latest browser version
4. **Check Console**: Loading errors
5. **Disable Addons**: Addon conflicts
6. **Reinstall**: Corrupted files

**Debugging:**
```javascript
// Check music editor status
console.log('Music editor:', {
    loaded: window.musicEditor?.loaded,
    error: window.musicEditor?.error
});
```

### Music Not Saving

**Symptoms:** Music doesn't save, export fails, data loss

**Solutions:**

1. **Use Export**: Export music files manually
2. **Check Permissions**: Browser file access
3. **Try Different Format**: Alternative export formats
4. **Clear Cache**: Corrupted music data
5. **Use Different Browser**: Browser-specific issues
6. **Check Storage**: Sufficient disk space

**Debugging:**
```javascript
// Check music data
console.log('Music project:', window.musicEditor?.getProject());
```

### Music Playback Issues

**Symptoms:** Music doesn't play, distorted audio, timing issues

**Solutions:**

1. **Check Audio Settings**: Browser audio permissions
2. **Update Browser**: Latest browser version
3. **Reduce Complexity**: Simpler music projects
4. **Check Instruments**: Instrument compatibility
5. **Clear Cache**: Corrupted audio data
6. **Use Different Device**: Audio device issues

**Debugging:**
```javascript
// Check audio context
console.log('Audio context:', {
    state: window.musicEditor?.audioContext?.state,
    sampleRate: window.musicEditor?.audioContext?.sampleRate
});
```

## 🔄 Update Issues

### Update Fails

**Symptoms:** Updates don't install, version mismatch, update errors

**Solutions:**

1. **Clear Cache**: Browser cache issues
2. **Hard Refresh**: `Ctrl + F5` or `Cmd + Shift + R`
3. **Check Connection**: Internet access required
4. **Disable Extensions**: Browser extensions might block
5. **Try Different Browser**: Browser-specific issues
6. **Manual Update**: Download latest version

**Debugging:**
```javascript
// Check update status
console.log('Update:', {
    current: VERSION,
    available: window.updateManager?.availableVersion,
    error: window.updateManager?.error
});
```

### Version Conflicts

**Symptoms:** Version mismatch errors, compatibility issues

**Solutions:**

1. **Clear Cache**: Old version cached
2. **Check Dependencies**: Version compatibility
3. **Update All**: Ensure all components updated
4. **Check Console**: Specific version errors
5. **Reinstall**: Clean installation
6. **Contact Support**: Version-specific issues

**Debugging:**
```javascript
// Check version compatibility
console.log('Versions:', {
    gui: VERSION,
    vm: Scratch.vm?.VERSION,
    addons: addons.VERSION
});
```

### Rollback to Previous Version

**Symptoms:** New version has issues, need to revert

**Solutions:**

1. **Clear Cache**: Remove new version cache
2. **Use Specific Version**: Load older version
3. **Check GitHub**: Download specific release
4. **Disable Auto-Update**: Prevent automatic updates
5. **Check Console**: Version-specific errors
6. **Report Issues**: Help fix problems

**Debugging:**
```javascript
// Force specific version
localStorage.setItem('forcedVersion', '1.0.0');
location.reload();
```

## 🧪 Debugging Techniques

### Browser Developer Tools

**Essential Tools:**

1. **Console**: Error messages and logging
2. **Elements**: Inspect and modify HTML/CSS
3. **Sources**: Debug JavaScript
4. **Network**: Monitor network requests
5. **Performance**: Analyze performance
6. **Memory**: Check memory usage
7. **Application**: Local storage and service workers

**Shortcuts:**
- `F12` or `Ctrl+Shift+I`: Open devtools
- `Ctrl+Shift+C`: Inspect element
- `Ctrl+Shift+J`: Open console
- `Ctrl+Shift+M`: Toggle device toolbar

### Common Debugging Commands

```javascript
// Check OmniBlocks state
console.log('OmniBlocks state:', {
    version: VERSION,
    environment: process.env.NODE_ENV,
    userAgent: navigator.userAgent
});

// Check Redux store
console.log('Redux state:', store.getState());

// Monitor Redux actions
store.subscribe(() => {
    console.log('Action:', store.getState());
});

// Check VM state
console.log('VM state:', vm.runtime);

// Monitor VM events
vm.runtime.on('*', (event, data) => {
    console.log('VM event:', event, data);
});

// Check addons
console.log('Addons:', addons.getAll());

// Check extensions
console.log('Extensions:', Scratch.extensions.getAll());
```

### Performance Profiling

```javascript
// CPU Profiling
console.profile('Performance Test');
// ... code to profile
console.profileEnd('Performance Test');

// Memory Profiling
console.memory; // Chrome only

// Timeline Recording
// Use Performance tab in devtools
```

### Network Debugging

```javascript
// Monitor network requests
fetch('/api/test')
    .then(response => response.json())
    .then(data => console.log('Response:', data))
    .catch(error => console.error('Error:', error));

// Check network status
console.log('Network:', {
    online: navigator.onLine,
    connection: navigator.connection,
    type: navigator.connection?.effectiveType
});
```

## 📚 Advanced Troubleshooting

### Reading Error Messages

**Error Types:**

1. **Syntax Errors**: Code structure problems
2. **Reference Errors**: Undefined variables/functions
3. **Type Errors**: Incorrect data types
4. **Range Errors**: Invalid value ranges
5. **Network Errors**: Connection problems
6. **Memory Errors**: Out of memory issues

**Error Structure:**
```
Error: Description of the error
    at functionName (file.js:line:column)
    at anotherFunction (another.js:line:column)
    ...
```

### Creating Minimal Repro

**Steps:**

1. **Identify Issue**: What exactly is broken
2. **Simplify Project**: Remove unrelated elements
3. **Isolate Problem**: Find minimal case that reproduces
4. **Document Steps**: Clear reproduction steps
5. **Share Repro**: Provide to developers

**Example:**
```
Steps to reproduce:
1. Create new project
2. Add sprite
3. Use [specific block]
4. Click green flag
5. Error occurs

Expected: [What should happen]
Actual: [What actually happens]
```

### Logging and Diagnostics

```javascript
// Enhanced logging
function logWithContext(message, context = {}) {
    console.log(`[${new Date().toISOString()}] ${message}`, {
        ...context,
        stack: new Error().stack
    });
}

// Error tracking
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', { message, source, lineno, colno, error });
    // Send to error tracking service
};

// Promise rejection tracking
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
});
```

## 🤝 Getting Help

### When to Ask for Help

**Ask when:**
- You've tried basic troubleshooting
- You can't find the issue in documentation
- The problem persists after multiple attempts
- You have specific error messages
- You can provide reproduction steps

**Provide:**
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots or videos
- Error messages and console logs
- Project file (if possible)

### Where to Get Help

**Support Channels:**

1. **GitHub Discussions**: [https://github.com/orgs/OmniBlocks/discussions](https://github.com/orgs/OmniBlocks/discussions)
   - Best for: General questions, feature discussions
   - Response time: Hours to days

2. **Issue Tracker**: [https://github.com/OmniBlocks/scratch-gui/issues](https://github.com/OmniBlocks/scratch-gui/issues)
   - Best for: Bug reports, feature requests
   - Response time: Days to weeks

3. **Community Forum**: Community-driven support
   - Best for: Peer support, project sharing
   - Response time: Varies

4. **Live Chat**: Real-time support (when available)
   - Best for: Urgent issues, quick questions
   - Response time: Immediate to minutes

### How to Report Bugs Effectively

**Bug Report Template:**
```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- **Browser**: [Chrome/Firefox/Safari/Edge]
- **Version**: [Browser version]
- **OS**: [Windows/macOS/Linux/iOS/Android]
- **OmniBlocks Version**: [Version number]
- **Device**: [Desktop/Tablet/Phone]

## Additional Information
- Screenshots
- Videos
- Error messages
- Console logs
- Project file (if applicable)

## Possible Solution
If you have ideas for fixing
```

## 📚 Additional Resources

### Official Documentation

- **Troubleshooting Guide**: This document
- **FAQ**: [FAQ.md](FAQ.md)
- **Development Setup**: [Development-Setup.md](Development-Setup.md)
- **Architecture**: [Architecture.md](Architecture.md)
- **GitHub Wiki**: Complete documentation

### Community Resources

- **Common Issues Database**: Community-reported problems
- **Solution Patterns**: Proven fixes for common issues
- **Debugging Tools**: Helper utilities
- **Performance Guides**: Optimization techniques
- **Compatibility Charts**: Browser/device support

### External Resources

- **MDN Web Docs**: [https://developer.mozilla.org](https://developer.mozilla.org)
- **React Documentation**: [https://reactjs.org/docs](https://reactjs.org/docs)
- **Redux Documentation**: [https://redux.js.org](https://redux.js.org)
- **Webpack Documentation**: [https://webpack.js.org](https://webpack.js.org)
- **Chrome DevTools**: [https://developer.chrome.com/docs/devtools](https://developer.chrome.com/docs/devtools)

## 🚧 Still Stuck?

If you've tried everything and still can't resolve your issue:

1. **Search thoroughly**: Use different keywords
2. **Check similar issues**: Might have solutions
3. **Ask for help**: Provide detailed information
4. **Be patient**: Complex issues take time
5. **Consider workarounds**: Temporary solutions
6. **Help improve docs**: Share your experience

**Remember:** Every issue you encounter helps make OmniBlocks better! By reporting problems and sharing solutions, you contribute to the community.

Happy debugging! 🐞