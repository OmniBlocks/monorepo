import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';

import check from './check.svg';
import dropdownCaret from './dropdown-caret.svg';
import {MenuItem, Submenu} from '../menu/menu.jsx';
import {BLOCKS_DARK, BLOCKS_HIGH_CONTRAST, BLOCKS_THREE, Theme} from '../../lib/themes/index.js';
import {openBlocksThemeMenu, blocksThemeMenuOpen, closeSettingsMenu} from '../../reducers/menus.js';
import {setTheme} from '../../reducers/theme.js';
import {persistTheme} from '../../lib/themes/themePersistance.js';
import styles from './settings-menu.css';
import threeIcon from './tw-blocks-three.svg';
import highContrastIcon from './tw-blocks-high-contrast.svg';

const options = defineMessages({
    [BLOCKS_THREE]: {
        defaultMessage: 'Original',
        description: 'Name of normal Scratch block colors.',
        id: 'tw.blockColors.three'
    },
    [BLOCKS_HIGH_CONTRAST]: {
        defaultMessage: 'High Contrast',
        description: 'Name of the high contrast block colors.',
        id: 'tw.blockColors.highContrast'
    },
    [BLOCKS_DARK]: {
        defaultMessage: 'Dark REMOVE BEFORE MERGE',
        description: 'Name of Scratch\'s experimental dark block colors',
        id: 'tw.blockColors.dark'
    }
});

const ThemeIcon = props => (
    <img
        src={props.id === BLOCKS_HIGH_CONTRAST ? highContrastIcon : threeIcon}
        draggable={false}
        width={24}
    />
);

ThemeIcon.propTypes = {
    id: PropTypes.string
};

const ThemeMenuItem = props => (
    <MenuItem onClick={props.onClick}>
        <div className={styles.option}>
            <img
                className={classNames(styles.check, {[styles.selected]: props.isSelected})}
                src={check}
                draggable={false}
            />
            <ThemeIcon id={props.id} />
            <FormattedMessage {...options[props.id]} />
        </div>
    </MenuItem>
);

ThemeMenuItem.propTypes = {
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
};

const BlocksThemeMenu = ({
    isOpen,
    isRtl,
    onChangeTheme,
    onOpen,
    theme
}) => (
    <MenuItem expanded={isOpen}>
        <div
            className={styles.option}
            onClick={onOpen}
        >
            <ThemeIcon id={theme.blocks} />
            <span className={styles.submenuLabel}>
                <FormattedMessage
                    defaultMessage="Block Colors"
                    description="Label for to choose what color blocks should be, eg. original or high contrast"
                    id="tw.menuBar.blockColors"
                />
            </span>
            <img
                className={styles.expandCaret}
                src={dropdownCaret}
                draggable={false}
            />
        </div>
        <Submenu place={isRtl ? 'left' : 'right'}>
            {Object.keys(options).map(item => (
                <ThemeMenuItem
                    key={item}
                    id={item}
                    isSelected={theme.blocks === item}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => onChangeTheme(theme.set('blocks', item))}
                />
            ))}
        </Submenu>
    </MenuItem>
);

BlocksThemeMenu.propTypes = {
    isOpen: PropTypes.bool,
    isRtl: PropTypes.bool,
    onChangeTheme: PropTypes.func,
    onOpen: PropTypes.func,
    theme: PropTypes.instanceOf(Theme)
};

const mapStateToProps = state => ({
    isOpen: blocksThemeMenuOpen(state),
    isRtl: state.locales.isRtl,
    theme: state.scratchGui.theme.theme
});

const mapDispatchToProps = dispatch => ({
    onChangeTheme: theme => {
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    },
    onOpen: () => dispatch(openBlocksThemeMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BlocksThemeMenu);
