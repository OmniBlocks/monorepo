/** @module RenderConstants */

/**
 * Various constants meant for use throughout the renderer.
 * @enum
 */
module.exports = {
    /**
     * The ID value to use for "no item" or when an object has been disposed.
     * @const {int}
     */
    ID_NONE: -1,

    /**
     * @enum {string}
     */
    Events: {
        /**
         * Event for when the high quality render option is changed
         */
        UseHighQualityRenderChanged: 'UseHighQualityRenderChanged',

        /**
         * NativeSizeChanged event
         *
         * @event RenderWebGL#event:NativeSizeChanged
         * @type {object}
         * @property {Array<int>} newSize - the new size of the renderer
         */
        NativeSizeChanged: 'NativeSizeChanged'
    }
};
