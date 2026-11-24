import React from 'react';

// MORE SLOP SHIMS SHIM SLOP SHIM SLOP SHIM STUPID REACT 3UIPCHRPEIOVNRERT

export default class ReactTooltip extends React.Component {
    static rebuild() {}
    static hide() {}
    static show() {}

    render() {
        // Render nothing, effectively disabling legacy tooltips without breaking the app
        return null; 
    }
}