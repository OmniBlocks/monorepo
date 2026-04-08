/**
 * If an SVG has width and height set to 100%, as some tools like Affinity Designer
 * output, then vanilla scratch-svg-renderer will fail to draw anything on the stage.
 * Based on: https://github.com/ScratchAddons/ScratchAddons/pull/748
 * Upstream bug: https://github.com/scratchfoundation/scratch-svg-renderer/issues/124
 * Example: https://scratch.mit.edu/projects/447085841/
 * @param {SVGSVGElement} svgTag <svg> element, modified in-place.
 * @returns {boolean} True if a change was made.
 */
const removeWidthAndHeight100Percent = svgTag => {
    if (svgTag.getAttribute('width') === '100%' && svgTag.getAttribute('height') === '100%') {
        svgTag.removeAttribute('width');
        svgTag.removeAttribute('height');
        return true;
    }
    return false;
};

/**
 * The paper.js used by vanilla doesn't handle rounded <rect> properly when they have only rx/ry
 * set instead of both. While this is fixed in our paper.js fork, to ensure the project looks
 * correct if someone imports the project into vanilla, we'll add the missing attribute.
 * Upstream bug: https://github.com/paperjs/paper.js/issues/1863
 * @param {SVGSVGElement} svgTag <svg> element, modified in-place.
 * @returns {boolean} True if a change was made.
 */
const workaroundPaperRoundedRectangleBug = svgTag => {
    let changed = false;

    /**
     * @param {SVGElement} element SVG element, modified in-place.
     */
    const recurse = element => {
        if (element.tagName === 'rect') {
            if (element.hasAttribute('rx') && !element.hasAttribute('ry')) {
                changed = true;
                element.setAttribute('ry', element.getAttribute('rx'));
            } else if (element.hasAttribute('ry') && !element.hasAttribute('rx')) {
                changed = true;
                element.setAttribute('rx', element.getAttribute('ry'));
            }
        }

        const childNodes = element.childNodes;
        if (childNodes) {
            for (let i = 0; i < childNodes.length; i++) {
                recurse(childNodes[i]);
            }
        }
    };

    recurse(svgTag);
    return changed;
};

/**
 * Applies fixes to an SVG to improve how it will behave in vanilla Scratch.
 * Unlike the regular loadSvgString(), this should be called once when the SVG
 * is first imported instead of each time the SVG loads.
 * @param {Uint8Array} rawData Raw SVG bytes
 * @returns {Uint8Array} Fixed SVG bytes. Could be the same object as `rawData`
 */
const fixForVanilla = rawData => {
    const decoded = new TextDecoder().decode(rawData);
    const svgDom = new DOMParser().parseFromString(decoded, 'image/svg+xml');
    const svgTag = svgDom.documentElement;

    let changed = false;
    // To avoid short-circuiting, call the function on the left side of the ||
    changed = removeWidthAndHeight100Percent(svgTag) || changed;
    changed = workaroundPaperRoundedRectangleBug(svgTag) || changed;

    if (changed) {
        const svgText = new XMLSerializer().serializeToString(svgDom);
        return new TextEncoder().encode(svgText);
    }

    // No reason to serialize and re-encode
    return rawData;
};

module.exports = fixForVanilla;
