import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {applyGuiColors} from '../lib/themes/guiHelpers';
import {Theme} from '../lib/themes';

const TWThemeManagerHOC = function (WrappedComponent) {
    class TWThemeManagerComponent extends React.Component {
        constructor (props) {
            super(props);
            applyGuiColors(props.reduxTheme);
        }
        componentDidUpdate () {
            applyGuiColors(this.props.reduxTheme);
        }
        render () {
            const {
                // eslint-disable-next-line no-unused-vars
                reduxTheme,
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
        reduxTheme: PropTypes.instanceOf(Theme)
    };

    const mapStateToProps = state => ({
        reduxTheme: state.scratchGui.theme.theme
    });

    const mapDispatchToProps = () => ({});

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(TWThemeManagerComponent);
};

export default TWThemeManagerHOC;
