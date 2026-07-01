import log from '../log/log';

const CHANGE_ROUNDED_CORNER_SIZE = 'scratch-paint/rounded-rect-mode/CHANGE_ROUNDED_CORNER_SIZE';
const initialState = {roundedCornerSize: 0};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case CHANGE_ROUNDED_CORNER_SIZE:
            if (isNaN(action.roundedCornerSize)) {
                log.warn(`Invalid rounded corner size: ${action.roundedCornerSize}`);
                return state;
            }
            return { roundedCornerSize: Math.floor(Math.max(0, action.roundedCornerSize)) };
        default:
            return state;
    }
};

// Action creators ==================================
const changeRoundedRectCornerSize = function (roundedCornerSize) {
    return {
        type: CHANGE_ROUNDED_CORNER_SIZE,
        roundedCornerSize: roundedCornerSize
    };
};

export {
    reducer as default,
    changeRoundedRectCornerSize
};
