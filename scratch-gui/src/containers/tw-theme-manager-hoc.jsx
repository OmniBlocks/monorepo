import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import {applyGuiColors} from '../lib/themes/guiHelpers';
import {Theme} from '../lib/themes';
import {detectTheme, onSystemPreferenceChange} from '../lib/themes/themePersistance';
import {setTheme} from '../reducers/theme';

const TWThemeManagerHOC = function (WrappedComponent) {
    class TWThemeManagerComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'handleSystemThemeChange'
            ]);
            applyGuiColors(props.reduxTheme);
        }
        componentDidMount () {
            this.removeListeners = onSystemPreferenceChange(this.handleSystemThemeChange);
        }
        componentDidUpdate () {
            applyGuiColors(this.props.reduxTheme);
        }
        componentWillUnmount () {
            this.removeListeners();
        }
        handleSystemThemeChange () {
            this.props.onChangeTheme(detectTheme());
        }
        render () {
            const {
                /* eslint-disable no-unused-vars */
                reduxTheme,
                onChangeTheme,
                /* eslint-enable no-unused-vars */
                ...props
            } = this.props;
            return (
                <WrappedComponent
                    {...props}
                />
            );
        }
    }

    TWThemeManagerComponent.propTypes = {
        reduxTheme: PropTypes.instanceOf(Theme),
        onChangeTheme: PropTypes.func
    };

    const mapStateToProps = state => ({
        reduxTheme: state.scratchGui.theme.theme
    });

    const mapDispatchToProps = dispatch => ({
        onChangeTheme: theme => dispatch(setTheme(theme))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(TWThemeManagerComponent);
};

export default TWThemeManagerHOC;
