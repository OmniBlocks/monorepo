import log from '../log/log';

const CHANGE_TRIANGLE_SIDE_COUNT = 'scratch-paint/triangle-mode/CHANGE_TRIANGLE_SIDE_COUNT';
const CHANGE_TRIANGLE_POINT_COUNT = 'scratch-paint/triangle-mode/CHANGE_TRIANGLE_POINT_COUNT';
const initialState = { trianglePolyCount: 3, trianglePointCount: 1 };

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case CHANGE_TRIANGLE_SIDE_COUNT:
            if (isNaN(action.trianglePolyCount)) {
                log.warn(`Invalid side count: ${action.trianglePolyCount}`);
                return state;
            }
            return { trianglePolyCount: Math.floor(Math.max(3, action.trianglePolyCount)), trianglePointCount: state.trianglePointCount };

        case CHANGE_TRIANGLE_POINT_COUNT:
            if (isNaN(action.trianglePointCount)) {
                log.warn(`Invalid spike ratio: ${action.trianglePointCount}`);
                return state;
            }
            return { trianglePointCount: Math.max(0.01, action.trianglePointCount), trianglePolyCount: state.trianglePolyCount };
        default:
            return state;
    }
};

// Action creators ===================================
const changeTrianglePolyCount = function (trianglePolyCount) {
    return {
        type: CHANGE_TRIANGLE_SIDE_COUNT,
        trianglePolyCount: trianglePolyCount
    };
};

const changeTrianglePointCount = function (trianglePointCount) {
    return {
        type: CHANGE_TRIANGLE_POINT_COUNT,
        trianglePointCount: trianglePointCount
    };
};

export {
    reducer as default,
    changeTrianglePolyCount,
    changeTrianglePointCount
};
