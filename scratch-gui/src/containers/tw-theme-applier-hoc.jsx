import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {applyGuiColors} from '../lib/themes/guiHelpers';

const TWThemeApplierHOC = function (WrappedComponent) {
    class TWThemeApplierComponent extends React.Component {
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

    TWThemeApplierComponent.propTypes = {
        reduxTheme: PropTypes.string
    };

    const mapStateToProps = state => ({
        reduxTheme: state.scratchGui.theme.theme
    });

    const mapDispatchToProps = () => ({});

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(TWThemeApplierComponent);
};

export default TWThemeApplierHOC;
