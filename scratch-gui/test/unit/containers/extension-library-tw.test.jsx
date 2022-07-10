import {parseExtensionURL} from '../../../src/containers/extension-library.jsx';

test('extension URL parsing', () => {
    expect(parseExtensionURL('https://extensions.turbowarp.org/fetch.js')).toBe('https://extensions.turbowarp.org/fetch.js');
    expect(parseExtensionURL('http://scratchx.org/?url=https://sayamindu.github.io/scratch-extensions/text-to-speech/text_to_speech_extension.js')).toBe('https://sayamindu.github.io/scratch-extensions/text-to-speech/text_to_speech_extension.js');
});
