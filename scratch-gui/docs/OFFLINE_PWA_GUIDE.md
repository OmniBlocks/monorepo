# OmniBlocks Offline PWA Guide

OmniBlocks now supports full offline functionality as a Progressive Web App (PWA). This guide explains how to use the offline features and what's available when you're not connected to the internet.

## 🚀 Installation as PWA

### Desktop Installation
1. Open OmniBlocks in Chrome, Edge, or another Chromium-based browser</br>
2. Open the 3 dots menu and hover over "Cast, save, and share." GitHub is used here as an example.</br>
<img width="519" height="652" alt="Screenshot 2025-11-25 2 47 56 PM" src="https://github.com/user-attachments/assets/52bd3c88-8238-4cdb-878a-e4f9cd018e0b" /></br>
3. Click "Install" to add OmniBlocks to your desktop</br>
<img width="407" height="166" alt="Screenshot 2025-11-25 2 48 03 PM" src="https://github.com/user-attachments/assets/9fb2b478-4ee3-498d-a771-d586d3a7a8fe" /></br>
4. The app will now work offline and can be launched like a native application

https://github.com/user-attachments/assets/986de6a3-47e3-436b-91f5-e169a6a67a4a

We are working on a desktop app for more native access and integration, but this is the best you can get for now, and it is quite great.

### Mobile Installation
1. Open OmniBlocks in your mobile browser
2. Tap the browser menu (usually three dots)
3. Select "Add to Home Screen" or "Install App"
4. The app will be added to your home screen and work offline

## 📱 Offline Features

### What Works Offline
- ✅ **Full Editor**: Create and edit projects completely offline
- ✅ **Project Saving**: Projects are automatically saved locally
- ✅ **Asset Loading**: All sprites, sounds, and resources are cached
- ✅ **Code Execution**: Run and test your projects without internet
- ✅ **Paint Editor**: Create and edit sprites offline
- ✅ **Sound Editor**: Edit and create sounds offline
- ✅ **Music Editor**: Compose music offline
- ✅ **Project Export**: Export projects as files
- ✅ **Settings**: All preferences are stored locally

### What Requires Internet
- ❌ **Project Sharing**: Uploading projects to online galleries
- ❌ **Featured projects gallery**: Browsing featured projects
- ❌ **Extension Downloads**: Loading new extensions, unless you locally have the extension file
- ❌ **Updates**: Automatic app updates (manual refresh needed)

## 💾 Project Data Storage

OmniBlocks uses its existing **Restore Points system** (`tw-restore-point-api.js`) for offline project persistence:
- Projects are automatically saved to IndexedDB (`TW_RestorePoints` database)
- Manual restore points can be created via the UI
- Projects persist across sessions and work offline
- No additional storage implementation was needed

The service worker provides offline access to the app shell (HTML, CSS, JS), while the existing Restore Points system handles project data.

## 🔄 Offline Indicators

### Status Indicators
- **Red "Offline" badge**: Appears when you lose internet connection
- **Green "Online" badge**: Briefly shows when connection is restored
- **Update notification**: Appears when a new version is available

### Visual Cues
- Offline status is clearly indicated in the interface
- Disabled features are grayed out when offline
- Helpful messages explain what's not available offline

## 🛠️ Troubleshooting

### Common Issues

#### App Won't Work Offline
1. Ensure you've visited the site while online at least once
2. Check that service workers are enabled in your browser
3. Clear browser cache and revisit the site online
4. Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)

#### Projects Not Saving
1. Check available storage space on your device
2. Ensure the app has permission to store data
3. Try clearing old projects to free up space
4. Check browser settings for data storage permissions

#### Slow Performance Offline
1. Close other browser tabs to free up memory
2. Clear browser cache to remove old cached files
3. Restart the browser application
4. Check available device storage space

### Storage Management
- The app automatically manages cache size
- Old cached resources are cleaned up periodically
- You can manually clear data in browser settings if needed
- Storage usage is monitored to prevent quota issues

## 🔧 Developer Information

### Service Worker
- Implements cache-first strategy for static assets
- Network-first with cache fallback for dynamic content
- Automatic cache versioning and cleanup
- Background sync for project data
### Caching Strategy
- **Static Assets**: Cached indefinitely (JS, CSS, images, fonts)
- **HTML Pages**: Network-first with cache fallback
- **API Calls**: Network-first with offline fallback
- **User Projects**: Handled by existing Restore Points system
- **Cache API**: For static asset caching
## 📋 Best Practices

### For Users
1. **First Visit**: Always visit online first to cache essential resources
2. **Regular Updates**: Refresh the app periodically when online to get updates
3. **Storage Management**: Keep an eye on storage usage and clean up old projects
4. **Backup Important Projects**: Export important projects as files for backup

### For Developers
1. **Cache Strategy**: Different strategies for different resource types
2. **Error Handling**: Graceful degradation when offline
4. **Data Sync**: Reliable background synchronization

## 🆕 Version Updates

### Automatic Updates
- New versions are automatically downloaded when online
- Users are notified when updates are available
- Updates are applied on next app restart
- No manual intervention required

### Manual Updates
- Force update by refreshing the page (Ctrl+F5)
- Clear browser cache if automatic updates fail
- Reinstall the PWA if persistent issues occur

## 🔒 Privacy & Security

### Data Storage
- All data is stored locally on your device
- No personal data is transmitted without your consent
- Projects remain private unless explicitly shared
- Local storage is encrypted by the browser

### Permissions
- The app only requests necessary permissions
- Storage permission for saving projects
- Notification permission for update alerts (optional)
- No access to sensitive device features

## 📞 Support

If you encounter issues with offline functionality:

1. Check this guide for common solutions
2. Try the troubleshooting steps above
3. Report bugs on the project's GitHub repository
4. Include browser version and error details in reports

---

**Note**: Offline functionality requires a modern browser with service worker support. For the best experience, use Chrome, Firefox, Safari, or Edge.
