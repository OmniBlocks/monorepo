import log from '../lib/log';

/**
 * Registers PWA file handler for .sb3 files
 * Enables "Open with OmniBlocks" functionality on desktop
 * Only works in installed Chromium-based PWAs
 * Based off sb-file-uploader-hoc.jsx logic
 */
const loadFileHandler = (vm, onSetProjectTitle, store) => {
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
        
        let fileName = 'file';
        try {
            const file = await fileHandle.getFile();
            fileName = file.name || fileName;
            
            // Validate it's a .sb3 file
            if (!file.name.toLowerCase().endsWith('.sb3')) {
                log.warn('File handler: Not an .sb3 file:', file.name);
                return;
            }

            log.info(`Loading file from PWA handler: ${file.name} (${file.size} bytes)`);

            // Show loading screen via Redux if store available
            if (store) {
                try {
                    const {openLoadingProject} = await import('../reducers/modals');
                    store.dispatch(openLoadingProject());
                } catch (e) {
                    log.warn('Could not open loading modal:', e);
                }
            }

            // Read file as ArrayBuffer (same as sb-file-uploader-hoc.jsx does)
            const arrayBuffer = await file.arrayBuffer();
            
            // Wait for VM to be ready (with timeout)
            const maxWaitTime = 10000; // 10 seconds
            const startTime = Date.now();
            while (!vm || !vm.runtime || !vm.loadProject) {
                if (Date.now() - startTime > maxWaitTime) {
                    throw new Error('VM failed to initialize within timeout period');
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
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

            // Hide loading screen
            if (store) {
                try {
                    const {closeLoadingProject} = await import('../reducers/modals');
                    store.dispatch(closeLoadingProject());
                } catch (e) {
                    log.warn('Could not close loading modal:', e);
                }
            }
        } catch (err) {
            log.error('Failed to handle file from launch queue:', err);

            // Hide loading screen on error
            if (store) {
                try {
                    const {closeLoadingProject} = await import('../reducers/modals');
                    store.dispatch(closeLoadingProject());
                } catch (e) {
                    log.warn('Could not close loading modal after error:', e);
                }
            }

            // Show user-friendly error
            alert(`Failed to open ${fileName}: ${err.message}`);
        }
    });
};

export {loadFileHandler};