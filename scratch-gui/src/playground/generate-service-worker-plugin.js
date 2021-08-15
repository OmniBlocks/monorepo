/* eslint-disable import/no-commonjs */

const RawSource = require('webpack-sources').RawSource;

const PLUGIN_NAME = 'TWGenerateServiceWorkerPlugin';
const SW_NAME = 'sw.js';
const INCLUDE_HTML = [
    'index.html',
    'editor.html',
    'fullscreen.html',
    'addons.html'
];

class TWGenerateServiceWorkerPlugin {
    apply (compiler) {
        const allAssetNames = new Set();
        compiler.hooks.emit.tap(PLUGIN_NAME, compilation => {
            const newAssetNames = compilation.getAssets()
                .map(i => i.name);
            for (const name of newAssetNames) {
                allAssetNames.add(name);
            }
            const assetNames = Array.from(allAssetNames)
                .filter(name => {
                    // Don't cache ourselves, that doesn't make sense
                    if (name === SW_NAME) return false;
                    if (name.startsWith('static/blocks-media') || name.startsWith('static/assets')) {
                        const asset = compilation.getAsset(name);
                        if (!asset) return false;
                        // Don't cache overly large non-font assets
                        if (!name.endsWith('.ttf') && !name.endsWith('.otf')) {
                            const size = asset.source.size();
                            if (size > 10000) return false;
                        }
                        // Assets that are only used in horizontal mode
                        if (
                            name.includes('event_broadcast_') ||
                            name.includes('event_when-broadcast-received_') ||
                            name.includes('event_whenflagclicked')
                        ) return false;
                        // Assets that are useless without an internet connection
                        if (
                            name.includes('wedo_') ||
                            name.includes('set-led_') ||
                            name.includes('microbit-block-icon') ||
                            name.includes('wedo2-block-icon')
                        ) return false;
                        // Sounds
                        if (name.endsWith('.wav')) return false;
                        if (name.endsWith('.ogg')) return false;
                        if (name.endsWith('.mp3')) return false;
                        // Assets that are extremely unlikely to be used
                        if (name.endsWith('.cur')) return false;
                        return true;
                    }
                    // Webmanifest
                    if (name.startsWith('images/')) return false;
                    if (name.endsWith('.webmanifest')) return false;
                    // Icons
                    if (name.endsWith('.ico')) return false;
                    if (name.startsWith('js/')) {
                        // Sourcemaps
                        if (name.endsWith('.map')) return false;
                        // Extension worker
                        if (name.includes('worker')) return false;
                        // Unnecessary pages
                        if (name.startsWith('js/embed')) return false;
                        if (name.startsWith('js/credits')) return false;
                        // Features that won't work offline anyways
                        if (name.startsWith('js/library-')) return false;
                        return true;
                    }
                    if (INCLUDE_HTML.includes(name)) return true;
                    return false;
                })
                .sort();
            const workerFile = compilation.getAsset(SW_NAME);
            const workerSource = workerFile.source.source().toString();
            const stringifiedAssets = JSON.stringify(assetNames);
            const newSource = workerSource.replace('[/* __EDITOR_ASSETS__ */]', stringifiedAssets);
            compilation.updateAsset(SW_NAME, new RawSource(newSource));
        });
    }
}

module.exports = TWGenerateServiceWorkerPlugin;
