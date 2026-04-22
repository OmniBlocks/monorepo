import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants.js';
import StageHeader from '../../containers/stage-header.jsx';
import Stage from '../../containers/stage.jsx';
import Loader from '../loader/loader.jsx';
<<<<<<< HEAD
import WebGlBrokenModal from '../../containers/webgl-broken-modal.jsx'; 
=======

>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
import styles from './stage-wrapper.css';

const StageWrapperComponent = function (props) {
    const {
        isEmbedded,
        isFullScreen,
        isRtl,
        isRendererSupported,
        loading,
        stageSize,
        vm
    } = props;

    return (
        <Box
            className={classNames(
                styles.stageWrapper,
                {
                    [styles.embedded]: isEmbedded,
                    [styles.fullScreen]: isFullScreen,
                    [styles.loading]: loading,
                    [styles.offsetControls]: !(isEmbedded || isFullScreen)
                }
            )}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            <Box className={styles.stageMenuWrapper}>
                <StageHeader
                    stageSize={stageSize}
                    vm={vm}
                />
            </Box>
            <Box className={styles.stageCanvasWrapper}>
<<<<<<< HEAD
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
=======
                {
                    isRendererSupported ?
                        <Stage
                            stageSize={stageSize}
                            vm={vm}
                        /> :
                        null
                }
            </Box>
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
            {loading ? (
                <Loader isFullScreen={isFullScreen} />
            ) : null}
        </Box>
    );
};

StageWrapperComponent.propTypes = {
    isEmbedded: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isRendererSupported: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default StageWrapperComponent;
