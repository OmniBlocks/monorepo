import log from '../log/log';
import TriangleTool from '../helper/tools/triangle-tool';

const CHANGE_TRIANGLE_SIDE_COUNT = 'scratch-paint/triangle-mode/CHANGE_TRIANGLE_SIDE_COUNT';
const initialState = { trianglePolyCount: 3 };

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case CHANGE_TRIANGLE_SIDE_COUNT:
            if (isNaN(action.trianglePolyCount)) {
                log.warn(`Invalid side count: ${action.trianglePolyCount}`);
                return state;
            }
            const value = Math.max(3, action.trianglePolyCount);
            TriangleTool.sideCount = value;
            return { trianglePolyCount: value };
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

export {
    reducer as default,
    changeTrianglePolyCount
};
