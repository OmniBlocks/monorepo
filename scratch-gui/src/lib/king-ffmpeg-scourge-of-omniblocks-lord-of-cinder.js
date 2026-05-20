let ffmpegInstance = null;
let loadPromise = null;

export const getFFmpeg = async () => {
    if (ffmpegInstance) return ffmpegInstance;
    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "/ffmpeg/ffmpeg.min.js";
        
        script.onload = async () => {
            try {
                const { FFmpeg } = window.FFmpegWASM || window.FFmpeg || {};
                if (!FFmpeg) {
                    throw new Error("FFmpeg UMD bundle not found on window");
                }
                
                const ff = new FFmpeg();
                ff.on('log', ({ message }) => console.log('FFmpeg:', message));
                
                
                const useMt = window.crossOriginIsolated;
                const coreType = useMt ? 'core-mt' : 'core';
                // now hopefully, multithreaded one will work due to the sketchy hack with the crossorigin isolated
                await ff.load({
                    coreURL: `/ffmpeg/${coreType}/ffmpeg-core.js`,
                    wasmURL: `/ffmpeg/${coreType}/ffmpeg-core.wasm`,
                    workerURL: useMt ? `/ffmpeg/${coreType}/ffmpeg-core.worker.js` : undefined
                });
                
                ffmpegInstance = ff;
                resolve(ff);
            } catch (error) {
                console.error('FFmpeg load error:', error);
                reject(error);
            } finally {
                loadPromise = null; 
            }
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });

    return loadPromise;
};
