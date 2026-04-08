const SET_THEME = 'scratch-paint/theme/SET_THEME';
const initialState = 'default';

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_THEME:
        return action.theme || 'default';
    default:
        return state;
    }
};

const setTheme = function (theme) {
    return {
        type: SET_THEME,
        theme
    };
};

export {
    reducer as default,
    setTheme
};
