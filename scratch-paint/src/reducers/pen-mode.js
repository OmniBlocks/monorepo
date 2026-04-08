import log from '../log/log';

const CHANGE_PEN_SIMPLIFY_SIZE = 'scratch-paint/pen-mode/CHANGE_PEN_SIMPLIFY_SIZE';
const initialState = { simplifySize: 2 };

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case CHANGE_PEN_SIMPLIFY_SIZE:
            if (isNaN(action.simplifySize)) {
                log.warn(`Invalid simplify setting: ${action.simplifySize}`);
                return state;
            }
            return { simplifySize: Math.max(0, action.simplifySize) };
        default:
            return state;
    }
};

// Action creators ==================================
const changeSimplifySize = function (simplifySize) {
    return {
        type: CHANGE_PEN_SIMPLIFY_SIZE,
        simplifySize: simplifySize
    };
};

export {
    reducer as default,
    changeSimplifySize
};
