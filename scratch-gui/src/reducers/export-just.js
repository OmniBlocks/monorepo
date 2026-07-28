const SET_EXPORT_JUST_ID = 'scratch-gui/export-just/SET_EXPORT_JUST_ID';

const initialState = {
    exportingSpriteId: null
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_EXPORT_JUST_ID:
        return Object.assign({}, state, {
            exportingSpriteId: action.spriteId
        });
    default:
        return state;
    }
};

const setExportJustId = function (spriteId) {
    return {
        type: SET_EXPORT_JUST_ID,
        spriteId: spriteId
    };
};

export {
    reducer as default,
    initialState as exportJustInitialState,
    setExportJustId
};
