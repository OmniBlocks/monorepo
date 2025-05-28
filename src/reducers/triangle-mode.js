import log from '../log/log';
import TriangleTool from '../helper/tools/triangle-tool';

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
            const value = Math.floor(Math.max(3, action.trianglePolyCount));
            TriangleTool.sideCount = value;
            return { trianglePolyCount: value, trianglePointCount: state.trianglePointCount };

        case CHANGE_TRIANGLE_POINT_COUNT:
            if (isNaN(action.trianglePointCount)) {
                log.warn(`Invalid side count: ${action.trianglePointCount}`);
                return state;
            }
            const value2 = Math.floor(Math.max(1, action.trianglePointCount));
            TriangleTool.pointCount = value2;
            return { trianglePointCount: value2, trianglePolyCount: state.trianglePolyCount };
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
