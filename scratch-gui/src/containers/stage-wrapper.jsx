import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {STAGE_DISPLAY_SIZES} from '../lib/layout-constants.js';
<<<<<<< HEAD
import {canActuallyUseWebGL} from '../lib/tw-environment-support-prober.js';
import StageWrapperComponent from '../components/stage-wrapper/stage-wrapper.jsx';

const StageWrapper = props => (
    <StageWrapperComponent
        {...props}
        canActuallyUseWebGL={canActuallyUseWebGL()}
    />
);
=======
import StageWrapperComponent from '../components/stage-wrapper/stage-wrapper.jsx';

const StageWrapper = props => <StageWrapperComponent {...props} />;
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571

StageWrapper.propTypes = {
    isRendererSupported: PropTypes.bool.isRequired,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default StageWrapper;
