const UPDATE_MONITORS = 'scratch-gui/monitors/UPDATE_MONITORS';
<<<<<<< HEAD
import {OrderedMap} from 'immutable';

const initialState = OrderedMap();
=======

const initialState = null;
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case UPDATE_MONITORS:
        return action.monitors;
    default:
        return state;
    }
};

const updateMonitors = function (monitors) {
    return {
        type: UPDATE_MONITORS,
        monitors: monitors
    };
};

export {
    reducer as default,
    initialState as monitorsInitialState,
    updateMonitors
};
