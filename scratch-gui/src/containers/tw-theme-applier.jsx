import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {applyGuiColors} from '../lib/themes/guiHelpers';

class TWThemeApplier extends React.Component {
    constructor (props) {
        super(props);
        applyGuiColors(props.theme);
    }
    componentDidUpdate () {
        applyGuiColors(this.props.theme);
    }
    render () {
        return null;
    }
}

TWThemeApplier.propTypes = {
    theme: PropTypes.string
};

const mapStateToProps = state => ({
    theme: state.scratchGui.theme.theme
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TWThemeApplier);
