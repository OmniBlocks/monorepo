import parseColor from 'parse-color';

const TRANSPARENT_BLACK = '#00000000';

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

const colorToHex8 = color => {
    const hex = color.hex;
    const alpha = color.rgba[3] || 1;
    if (alpha < 1) {
        return `${hex}${makeAlphaComponent(alpha)}`;
    }
    return hex;
};

const normalizeToHex8 = color => {
    const parsed = safeParseColor(color);
    return colorToHex8(parsed);
};

const removeAlpha = color => {
    const parsed = safeParseColor(color);
    return parsed.hex.substr(0, 7);
};

export {
    makeAlphaComponent,
    colorToHex8,
    normalizeToHex8,
    removeAlpha
};
