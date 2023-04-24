import log from '../log/log';
import RoundedRectTool from '../helper/tools/rounded-rect-tool';

const CHANGE_ROUNDED_CORNER_SIZE = 'scratch-paint/rounded-rect-mode/CHANGE_ROUNDED_CORNER_SIZE';
const initialState = {roundedCornerSize: 8};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case CHANGE_ROUNDED_CORNER_SIZE:
            if (isNaN(action.roundedCornerSize)) {
                log.warn(`Invalid rounded corner size: ${action.roundedCornerSize}`);
                return state;
            }
            const value = Math.max(1, action.roundedCornerSize);
            RoundedRectTool.cornerSize = value;
            return {roundedCornerSize: value};
        default:
            return state;
    }
};

// Action creators ==================================
const changeRoundedCornerSize = function (roundedCornerSize) {
    return {
        type: CHANGE_ROUNDED_CORNER_SIZE,
        roundedCornerSize: roundedCornerSize
    };
};

export {
    reducer as default,
    changeRoundedCornerSize
};
