// ob: We don't support this.
const selectAndUpdateMicroBit = () => {}


/**
 * Checks if the browser supports updating a micro:bit.
 * @returns {boolean} True if the browser appears to support updating a micro:bit.
 */
// ob: Always returns false.
const isMicroBitUpdateSupported = () =>
    false;

export {
    isMicroBitUpdateSupported,
    selectAndUpdateMicroBit
};
