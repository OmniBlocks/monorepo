/**
 * @fileOverview Import bitmap data into Scratch 3.0, resizing image as necessary.
 */
const getFonts = require('scratch-render-fonts');

const xmlEscape = str => str.replace(/[<>&'"]/g, c => {
    switch (c) {
    case '<': return '&lt;';
    case '>': return '&gt;';
    case '&': return '&amp;';
    case '\'': return '&apos;';
    case '"': return '&quot;';
    }
});

/**
 * Given SVG data, inline the fonts. This allows them to be rendered correctly when set
 * as the source of an HTMLImageElement. Here is a note from tmickel:
 *   // Inject fonts that are needed.
 *   // It would be nice if there were another way to get the SVG-in-canvas
 *   // to render the correct font family, but I couldn't find any other way.
 *   // Other things I tried:
 *   // Just injecting the font-family into the document: no effect.
 *   // External stylesheet linked to by SVG: no effect.
 *   // Using a <link> or <style>@import</style> to link to font-family
 *   // injected into the document: no effect.
 * @param {string} svgString The string representation of the svg to modify
 * @param {object} [customFontFaces] Object mapping custom font families to @font-face statements.
 * @return {string} The svg with any needed fonts inlined
 */
const inlineSvgFonts = function (svgString, customFontFaces = {}) {
    // Make it clear that this function only operates on strings.
    // If we don't explicitly throw this here, the function silently fails.
    if (typeof svgString !== 'string') {
        throw new Error('SVG to be inlined is not a string');
    }

    const FONTS = {};
    if (customFontFaces && typeof customFontFaces === 'object') {
        // The fonts in the document will be XML escaped
        for (const [families, style] of Object.entries(customFontFaces)) {
            FONTS[xmlEscape(families)] = style;
        }
    }
    try {
        // We already know these don't need to be XML escaped
        Object.assign(FONTS, getFonts());
    } catch (e) {
        // getFonts fails in tests because it uses some webpack tricks. This is safe to ignore.
    }

    // Collect fonts that need injection.
    const fontsNeeded = new Set();
    const fontRegex = /font-family="([^"]*)"/g;
    let matches = fontRegex.exec(svgString);
    while (matches) {
        fontsNeeded.add(matches[1]);
        matches = fontRegex.exec(svgString);
    }
    if (fontsNeeded.size > 0) {
        let str = '<defs><style>';
        for (const font of fontsNeeded) {
            if (Object.prototype.hasOwnProperty.call(FONTS, font)) {
                str += `${FONTS[font]}`;
            }
        }
        str += '</style></defs>';
        svgString = svgString.replace(/<svg[^>]*>/, `$&${str}`);
        return svgString;
    }
    return svgString;
};

module.exports = inlineSvgFonts;
