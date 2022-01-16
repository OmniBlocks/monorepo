const SET_WIDTH = 'custom-stage-size/SET_WIDTH';
const SET_HEIGHT = 'custom-stage-size/SET_HEIGHT';

const getDimensions = () => {
    // Running in node.js
    if (typeof URLSearchParams === 'undefined') {
        return null;
    }

    const urlParameters = new URLSearchParams(location.search);
    const dimensionsQuery = urlParameters.get('size');
    if (dimensionsQuery === null) {
        return null;
    }
    const match = dimensionsQuery.match(/^(\d+)[^\d]+(\d+)$/);
    if (!match) {
        // eslint-disable-next-line no-alert
        alert('Could not parse custom stage size');
        return null;
    }
    const [_, widthText, heightText] = match;
    if (!widthText || !heightText) {
        return null;
    }

    const width = Math.max(0, Math.min(4096, +widthText));
    const height = Math.max(0, Math.min(4096, +heightText));
    return {
        width,
        height
    };
};

const initialState = getDimensions() || {
    width: 480,
    height: 360
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_WIDTH:
        return Object.assign({}, state, {
            width: action.width
        });
    case SET_HEIGHT:
        return Object.assign({}, state, {
            height: action.height
        });
    default:
        return state;
    }
};

const setWidth = function (width) {
    return {
        type: SET_WIDTH,
        width: width
    };
};

const setHeight = function (height) {
    return {
        type: SET_HEIGHT,
        height: height
    };
};

export {
    reducer as default,
    initialState as customStageSizeInitialState,
    setWidth,
    setHeight
};
