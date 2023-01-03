// This list is a subset of `addons` and defines the order by which addon CSS should
// applied in. Items later in this list are given higher precedence. Addons not listed
// here are implied to have the lowest possible precedence.
const addonPrecedence = [
    'columns',
    'editor-stage-left',
    'editor-theme3'
];

/**
 * @param {string} addonId The addon ID
 * @returns {number} An integer >= 0
 */
const getPrecedence = addonId => addonPrecedence.indexOf(addonId) + 1;

export default getPrecedence;
