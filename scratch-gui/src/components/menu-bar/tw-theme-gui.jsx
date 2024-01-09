import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';

import {MenuItem} from '../menu/menu.jsx';
import {GUI_DARK, GUI_LIGHT, Theme} from '../../lib/themes/index.js';
import {closeSettingsMenu} from '../../reducers/menus.js';
import {setTheme} from '../../reducers/theme.js';
import {persistTheme} from '../../lib/themes/themePersistance.js';
import lightModeIcon from './tw-moon.svg';
import darkModeIcon from './tw-moon.svg';
import styles from './settings-menu.css';

const GuiThemeMenu = ({
    onChangeTheme,
    theme
}) => (
    <MenuItem>
        <div
            className={styles.option}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => onChangeTheme(theme.set('gui', theme.gui === GUI_DARK ? GUI_LIGHT : GUI_DARK))}
        >
            <img
                src={theme.gui === GUI_DARK ? darkModeIcon : lightModeIcon}
                draggable={false}
                width={24}
            />
            <span className={styles.submenuLabel}>
                {theme.gui === GUI_DARK ? (
                    <FormattedMessage
                        defaultMessage="Dark Mode"
                        description="The name of dark mode"
                        id="tw.darkMode"
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="Light Mode"
                        description="The name of light mode"
                        id="tw.lightMode"
                    />
                )}
            </span>
        </div>
    </MenuItem>
);

GuiThemeMenu.propTypes = {
    onChangeTheme: PropTypes.func,
    theme: PropTypes.instanceOf(Theme)
};

const mapStateToProps = state => ({
    theme: state.scratchGui.theme.theme
});

const mapDispatchToProps = dispatch => ({
    onChangeTheme: theme => {
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GuiThemeMenu);
