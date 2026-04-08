const SET_CUSTOM_FONTS = 'scratch-paint/tw/custom-fonts/SET_CUSTOM_FONTS';
const initialState = [];

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_CUSTOM_FONTS:
        return action.fonts;
    default:
        return state;
    }
};

const setCustomFonts = fonts => ({
    type: SET_CUSTOM_FONTS,
    fonts
});

export {
    reducer as default,
    setCustomFonts
};
