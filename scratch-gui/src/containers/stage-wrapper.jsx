import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {STAGE_DISPLAY_SIZES} from '../lib/layout-constants.js';
import StageWrapperComponent from '../components/stage-wrapper/stage-wrapper.jsx';
import WebGlBrokenModal from '../../containers/webgl-broken-modal.jsx';

// In the component, replace the stage canvas section:
<Box className={styles.stageCanvasWrapper}>
    {
        !isRendererSupported ? null :
        !props.canActuallyUseWebGL ? (
            <WebGlBrokenModal isRtl={isRtl} />
        ) : (
            <Stage
                stageSize={stageSize}
                vm={vm}
            />
        )
    }
</Box>