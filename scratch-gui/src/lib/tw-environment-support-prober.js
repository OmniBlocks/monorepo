import Renderer from 'scratch-render';
import log from './log';

let cachedRendererSupport = null;
export const isRendererSupported = () => {
    if (cachedRendererSupport === null) {
        cachedRendererSupport = Renderer.isSupported();
    }
    return cachedRendererSupport;
};

let cachedNewFunctionSupport = null;
export const isNewFunctionSupported = () => {
    if (cachedNewFunctionSupport === null) {
        try {
            // This will throw if blocked by CSP
            // eslint-disable-next-line no-new
            new Function('');
            cachedNewFunctionSupport = true;
        } catch (e) {
            cachedNewFunctionSupport = false;
        }
    }
    return cachedNewFunctionSupport;
};

export const findIncompatibleUserscripts = () => {
    /* eslint-disable max-len */

    /** @type {string[]} */
    const errors = [];

    // Chibi < v4 breaks extensionURLs in project.json
    // Check suggested by SinanShiki
    if (typeof window.chibi === 'object' && Number(window.chibi.version) <= 3) {
        errors.push('You are using an old version of the "Chibi" userscript that has known project corruption bugs. Please disable it, uninstall it, or update to version 4.');
    }

    // For debugging incompatibilities, allow ignoring the errors with an undocumented URL parameter.
    if (errors.length > 0) {
        const params = new URLSearchParams(location.search);
        if (params.get('ignore_unsupported_userscripts') === 'i_will_not_ask_for_help_if_something_breaks') {
            log.error('Ignoring unsupported userscripts', errors);
            return [];
        }
    }

    /* eslint-enable max-len */
    return errors;
};

export const isBrowserSupported = () => (
    isNewFunctionSupported() &&
    isRendererSupported() &&
    findIncompatibleUserscripts().length === 0
);
<<<<<<< HEAD

let cachedWebGLActuallyWorks = null;
export const canActuallyUseWebGL = () => {
    if (cachedWebGLActuallyWorks === null) {
        // First check if renderer thinks it's supported
        if (!isRendererSupported()) {
            cachedWebGLActuallyWorks = false; // apple recently (as of oct-nov 2025) broke ALL of webgl somehow, but OmniBlocks vm crashes instead of reporting a modal because the browser claims it's supported (which its not)
            return false;
        }

        // Now do a real smoke test
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) {
                cachedWebGLActuallyWorks = false;
                return false;
            }

            // Test 1: Check VERSION string
            const version = gl.getParameter(gl.VERSION);
            if (!version) {
                cachedWebGLActuallyWorks = false;
                return false;
            }

            // Test 2: Create and bind a buffer
            const buffer = gl.createBuffer();
            if (!buffer) {
                cachedWebGLActuallyWorks = false;
                return false;
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 2, 3]), gl.STATIC_DRAW);

            // Test 3: Create a framebuffer
            const framebuffer = gl.createFramebuffer();
            if (!framebuffer) {
                cachedWebGLActuallyWorks = false;
                return false;
            }

            // Test 4: Compile minimal shaders
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, 'attribute vec4 a;void main(){gl_Position=a;}');
            gl.compileShader(vertexShader);
            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                cachedWebGLActuallyWorks = false;
                return false;
            }

            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, 'void main(){gl_FragColor=vec4(1.0);}');
            gl.compileShader(fragmentShader);
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                cachedWebGLActuallyWorks = false;
                return false;
            }

            // Test 5: Link program
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                cachedWebGLActuallyWorks = false;
                return false;
            }

            // All tests passed!
            cachedWebGLActuallyWorks = true;
            return true;
        } catch (e) {
            log.error('WebGL smoke test failed', e);
            cachedWebGLActuallyWorks = false;
            return false;
        }
    }
    return cachedWebGLActuallyWorks;
};
=======
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
