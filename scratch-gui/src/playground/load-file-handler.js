import log from '../lib/log';

/**
 * Registers PWA file handler for .sb3 files
 * Enables "Open with OmniBlocks" functionality on desktop
 * Only works in installed Chromium-based PWAs
 * Based off sb-file-uploader-hoc.jsx logic
 */
const loadFileHandler = vm => {
    if (!('launchQueue' in window)) {
        log.info('Unfortunately, file handling not supported in this browser');
        return;
    }

    log.info('Registering PWA file handler for .sb3 files');
    
    window.launchQueue.setConsumer(async launchParams => {
        // Handle only if files are present
        if (!launchParams.files || launchParams.files.length === 0) {
            return;
        }

        // Only handle the first file (can't load multiple projects)
        const fileHandle = launchParams.files[0];
        
        try {
            const file = await fileHandle.getFile();
            
            // Validate it's a .sb3 file
            if (!file.name.toLowerCase().endsWith('.sb3')) {
                log.warn('File handler: Not an .sb3 file:', file.name);
                return;
            }

            log.info(`Loading file from PWA handler: ${file.name} (${file.size} bytes)`);

            // Read file as ArrayBuffer (same as sb-file-uploader-hoc.jsx does)
            const arrayBuffer = await file.arrayBuffer();
            
            // Stop current project and load new one
            vm.quit();
            
            await vm.loadProject(arrayBuffer);
            
            // Update project title from filename
            const projectTitle = file.name.replace(/\.sb3$/i, '').substring(0, 100);
            if (onSetProjectTitle) {
                onSetProjectTitle(projectTitle);
            }
            
            // Force a render
            vm.renderer.draw();
            
            log.info('Project loaded successfully from file handler');

        } catch (err) {
            log.error('Failed to handle file from launch queue:', err);
            // Show user-friendly error
            const fileName = file?.name || 'file';
            alert(`Failed to open ${fileName}: ${err.message}`);
        }
    });
};

export {loadFileHandler};