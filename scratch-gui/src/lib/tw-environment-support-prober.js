import Renderer from 'scratch-render';

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

export const isBrowserSupported = () => (
    isNewFunctionSupported() &&
    isRendererSupported()
);
