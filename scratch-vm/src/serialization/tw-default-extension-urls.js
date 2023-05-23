// If a project uses an extension but does not specify a URL, it will default to
// the URL given here, if any. This is useful for compatibility with other mods.

const defaults = {
    // Box2D (`griffpatch`) is not listed here because our extension is not actually
    // compatible with the original version due to fields vs inputs.

    text: 'https://extensions.turbowarp.org/lab/text.js'
};

module.exports = defaults;
