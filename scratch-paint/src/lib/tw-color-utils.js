import parseColor from 'parse-color';

/**
 * @typedef ParsedColor
 * @property {[number, number, number, number]} rgba red, green, and blue from 0-255, alpha from 0-1
 * @property {string} hex Color in the format "#abc123", no alpha channel
 */

const TRANSPARENT_BLACK = '#00000000';

/**
 * @param {string} color Color in almost any format.
 * @returns {ParsedColor} Parsed color object.
 */
const safeParseColor = color => {
    let result = parseColor(color);
    if (!result.rgba) {
        result = parseColor(`#${color}`);
        if (!result.rgba) {
            return parseColor(TRANSPARENT_BLACK);
        }
    }
    return result;
};

const makeAlphaComponent = alpha => Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');

const colorToHex = color => {
    const parsed = safeParseColor(color);
    const hex = parsed.hex;
    const alpha = parsed.rgba[3] || 1;
    if (alpha < 1) {
        return `${hex}${makeAlphaComponent(alpha)}`;
    }
    return hex;
};

export {
    makeAlphaComponent,
    colorToHex
};
