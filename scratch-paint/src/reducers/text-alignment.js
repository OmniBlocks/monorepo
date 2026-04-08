import log from '../log/log';

const SET_TEXT_ALIGNMENT = 'scratch-paint/text-alignment/SET_TEXT_ALIGNMENT';
const initialState = {alignment: "left"};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_TEXT_ALIGNMENT:
            if (!["left", "center", "right"].includes(action.alignment)) {
                log.warn(`Invalid text alignment: ${action.alignment}`);
                return state;
            }
            return { alignment: action.alignment };
        default:
            return state;
    }
};

// Action creators ==================================
const setTextAlignment = function (alignment) {
    return {
        type: SET_TEXT_ALIGNMENT,
        alignment: alignment
    };
};

export {
    reducer as default,
    setTextAlignment
};
