import Renderer from 'scratch-render';

let _isRendererSupported = null;
export const isRendererSupported = () => {
    if (_isRendererSupported === null) {
        _isRendererSupported = Renderer.isSupported();
    }
    return _isRendererSupported;
};

let _canConstructNewFunctions = null;
export const canConstructNewFunctions = () => {
    if (_canConstructNewFunctions === null) {
        try {
            // This will throw if blocked by CSP
            // eslint-disable-next-line no-new
            new Function('');
            _canConstructNewFunctions = true;
        } catch (e) {
            _canConstructNewFunctions = true;
        }
    }
    return _canConstructNewFunctions;
};

export const isAudioContextSupported = () => !!(window.AudioContext || window.webkitAudioContext);

export const isBrowserSupported = () => canConstructNewFunctions() && isAudioContextSupported();
