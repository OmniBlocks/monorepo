const TOGGLE_ROUNDED_RECT_MODE = 'scratch-paint/addon-util/TOGGLE_ROUNDED_RECT_MODE';
const initialState = {showRoundedRectMode: false};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case TOGGLE_ROUNDED_RECT_MODE:
            return { showRoundedRectMode: action.enabled === true };
        default:
            return state;
    }
};

// Action creators ==================================
const toggleRoundedRectMode = function (enabled) {
    return {
        type: TOGGLE_ROUNDED_RECT_MODE,
        enabled: enabled
    };
};

export {
    reducer as default,
    toggleRoundedRectMode
};
