import parseColorLib from 'parse-color';

/**
 * @typedef ParsedColor
 * @property {[number, number, number, number]} rgba red, green, and blue from 0-255, alpha from 0-1
 * @property {string} hex Color in the format "#abc123", no alpha channel
 */

const TRANSPARENT_BLACK = {
    rgba: [0, 0, 0, 0],
    hex: '#000000'
};

/**
 * @param {string} color Color in any format.
 * @returns {ParsedColor} Parsed color object.
 */
const parseColor = color => {
    if (/^#[a-f0-9]{3,8}$/i.test(color)) {
        // parse-color does not handle opacity well in hex colors, so we will parse them ourselves.
        let hexPart = color.substring(1).toLowerCase();

        if (hexPart.length === 3 || hexPart.length === 4) {
            // Double each character, eg. 08A -> 0088AA
            hexPart = hexPart
                .split('')
                .map(char => char + char)
                .join('');
        }

        const red = parseInt(hexPart.substring(0, 2), 16);
        const green = parseInt(hexPart.substring(2, 4), 16);
        const blue = parseInt(hexPart.substring(4, 6), 16);
        let alpha = 1;
        if (hexPart.length === 8) {
            alpha = parseInt(hexPart.substring(6, 8), 16) / 255;
        }

        return {
            rgba: [red, green, blue, alpha],
            hex: `#${hexPart.substring(0, 6)}`
        };
    }

    const result = parseColorLib(color);
    if (!result.rgba) {
        return TRANSPARENT_BLACK;
    }
    return result;
};

/**
 * @param {number} alpha Alpha channel from 0-1
 * @returns {string} String to use for creating an 8-digit hex color code.
 */
const makeAlphaComponent = alpha => Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');

/**
 * @param {string} color Color in any format.
 * @returns {string} Color as either a 6-digit hex code or 8-digit hex code if it has an alpha channel.
 */
const colorToHex = color => {
    const parsed = parseColor(color);
    const hex = parsed.hex;
    const alpha = parsed.rgba[3];
    if (alpha < 1) {
        return `${hex}${makeAlphaComponent(alpha)}`;
    }
    return hex;
};

export {
    makeAlphaComponent,
    colorToHex
};
