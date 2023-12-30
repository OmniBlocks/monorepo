import classNames from 'classnames';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import ToggleButtons from '../toggle-buttons/toggle-buttons.jsx';
import Controls from '../../containers/controls.jsx';
import {getStageDimensions} from '../../lib/screen-utils';
import {STAGE_SIZE_MODES} from '../../lib/layout-constants';

import fullScreenIcon from './icon--fullscreen.svg';
import largeStageIcon from '!../../lib/tw-recolor/build!./icon--large-stage.svg';
import smallStageIcon from '!../../lib/tw-recolor/build!./icon--small-stage.svg';
import unFullScreenIcon from './icon--unfullscreen.svg';
import settingsIcon from './icon--settings.svg';

import styles from './stage-header.css';

import FullscreenAPI from '../../lib/tw-fullscreen-api';

const messages = defineMessages({
    largeStageSizeMessage: {
        defaultMessage: 'Switch to large stage',
        description: 'Button to change stage size to large',
        id: 'gui.stageHeader.stageSizeLarge'
    },
    smallStageSizeMessage: {
        defaultMessage: 'Switch to small stage',
        description: 'Button to change stage size to small',
        id: 'gui.stageHeader.stageSizeSmall'
    },
    fullStageSizeMessage: {
        defaultMessage: 'Enter full screen mode',
        description: 'Button to change stage size to full screen',
        id: 'gui.stageHeader.stageSizeFull'
    },
    unFullStageSizeMessage: {
        defaultMessage: 'Exit full screen mode',
        description: 'Button to get out of full screen mode',
        id: 'gui.stageHeader.stageSizeUnFull'
    },
    fullscreenControl: {
        defaultMessage: 'Full Screen Control',
        description: 'Button to enter/exit full screen mode',
        id: 'gui.stageHeader.fullscreenControl'
    },
    openSettingsMessage: {
        defaultMessage: 'Open advanced settings',
        description: 'Button to open advanced settings in embeds',
        id: 'tw.openAdvanced'
    }
});

const enableSettingsButton = new URLSearchParams(location.search).has('settings-button');

const StageHeaderComponent = function (props) {
    const {
        customStageSize,
        isFullScreen,
        isPlayerOnly,
        onKeyPress,
        onSetStageLarge,
        onSetStageSmall,
        onSetStageFull,
        onSetStageUnFull,
        onOpenSettings,
        isEmbedded,
        stageSizeMode,
        vm
    } = props;

    let header = null;

    if (isFullScreen || isEmbedded) {
        const stageDimensions = getStageDimensions(null, customStageSize, true);
        const settingsButton = isEmbedded && enableSettingsButton ? (
            <div className={styles.unselectWrapper}>
                <Button
                    className={styles.stageButton}
                    onClick={onOpenSettings}
                >
                    <img
                        alt={props.intl.formatMessage(messages.openSettingsMessage)}
                        className={styles.stageButtonIcon}
                        draggable={false}
                        src={settingsIcon}
                        title={props.intl.formatMessage(messages.openSettingsMessage)}
                    />
                </Button>
            </div>
        ) : null;
        const fullscreenButton = isFullScreen ? (
            <div className={styles.unselectWrapper}>
                <Button
                    className={styles.stageButton}
                    onClick={onSetStageUnFull}
                    onKeyPress={onKeyPress}
                >
                    <img
                        alt={props.intl.formatMessage(messages.unFullStageSizeMessage)}
                        className={styles.stageButtonIcon}
                        draggable={false}
                        src={unFullScreenIcon}
                        title={props.intl.formatMessage(messages.fullscreenControl)}
                    />
                </Button>
            </div>
        ) : FullscreenAPI.available() ? (
            <div className={styles.unselectWrapper}>
                <Button
                    className={styles.stageButton}
                    onClick={onSetStageFull}
                >
                    <img
                        alt={props.intl.formatMessage(messages.fullStageSizeMessage)}
                        className={styles.stageButtonIcon}
                        draggable={false}
                        src={fullScreenIcon}
                        title={props.intl.formatMessage(messages.fullscreenControl)}
                    />
                </Button>
            </div>
        ) : null;
        header = (
            <Box
                className={classNames(styles.stageHeaderWrapperOverlay, {
                    [styles.embedded]: isEmbedded
                })}
            >
                <Box
                    className={styles.stageMenuWrapper}
                    style={{width: stageDimensions.width}}
                >
                    <Controls vm={vm} />
                    <div
                        className={styles.fullscreenButtonsRow}
                        key="fullscreen" // addons require the HTML element to be not be re-used by in-editor buttons
                    >
                        {settingsButton}
                        {fullscreenButton}
                    </div>
                </Box>
            </Box>
        );
    } else {
        const stageControls =
            isPlayerOnly ? (
                []
            ) : (
                <div className={styles.stageSizeToggleGroup}>
                    <ToggleButtons
                        buttons={[
                            {
                                handleClick: onSetStageSmall,
                                icon: smallStageIcon,
                                iconClassName: styles.stageButtonIcon,
                                isSelected: stageSizeMode === STAGE_SIZE_MODES.small,
                                title: props.intl.formatMessage(messages.smallStageSizeMessage)
                            },
                            {
                                handleClick: onSetStageLarge,
                                icon: largeStageIcon,
                                iconClassName: styles.stageButtonIcon,
                                isSelected: stageSizeMode === STAGE_SIZE_MODES.large,
                                title: props.intl.formatMessage(messages.largeStageSizeMessage)
                            }
                        ]}
                    />
                </div>
            );
        header = (
            <Box className={styles.stageHeaderWrapper}>
                <Box className={styles.stageMenuWrapper}>
                    <Controls
                        vm={vm}
                        isSmall={stageSizeMode === STAGE_SIZE_MODES.small}
                    />
                    <div
                        className={styles.stageSizeRow}
                        key="editor" // addons require the HTML element to be not be re-used by in-editor buttons
                    >
                        {stageControls}
                        <div>
                            <Button
                                className={styles.stageButton}
                                onClick={onSetStageFull}
                            >
                                <img
                                    alt={props.intl.formatMessage(messages.fullStageSizeMessage)}
                                    className={styles.stageButtonIcon}
                                    draggable={false}
                                    src={fullScreenIcon}
                                    title={props.intl.formatMessage(messages.fullscreenControl)}
                                />
                            </Button>
                        </div>
                    </div>
                </Box>
            </Box>
        );
    }

    return header;
};

const mapStateToProps = state => ({
    customStageSize: state.scratchGui.customStageSize,
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize
});

StageHeaderComponent.propTypes = {
    intl: intlShape,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    isFullScreen: PropTypes.bool.isRequired,
    isPlayerOnly: PropTypes.bool.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onSetStageFull: PropTypes.func.isRequired,
    onSetStageLarge: PropTypes.func.isRequired,
    onSetStageSmall: PropTypes.func.isRequired,
    onSetStageUnFull: PropTypes.func.isRequired,
    onOpenSettings: PropTypes.func.isRequired,
    isEmbedded: PropTypes.bool.isRequired,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    vm: PropTypes.instanceOf(VM).isRequired
};

StageHeaderComponent.defaultProps = {
    stageSizeMode: STAGE_SIZE_MODES.large
};

export default injectIntl(connect(
    mapStateToProps
)(StageHeaderComponent));
