import bindAll from 'lodash.bindall';
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import VM from 'scratch-vm';
import Box from '../components/box/box.jsx';
import greenFlag from '../components/green-flag/icon--green-flag.svg';
import {setStartedState} from '../reducers/vm-status.js';

// CSS for hover effect
const hoverStyles = `
.green-flag-hover {
    transition: transform 0.2s ease-out;
    transform-origin: center;
}

.green-flag-hover:hover {
    transform: scale(1.15);
    cursor: pointer;
}
`;

class GreenFlagOverlay extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleClick'
        ]);
    }

    handleClick() {
        this.props.vm.start();
        this.props.vm.greenFlag();
        this.props.onStarted();
    }

    componentDidMount() {
       
        const styleTag = document.createElement('style');
        styleTag.innerHTML = hoverStyles;
        this.styleRef = styleTag;
        document.head.appendChild(styleTag);
    }

    componentWillUnmount() {

        if (this.styleRef) {
            document.head.removeChild(this.styleRef);
        }
    }

    render() {
        return (
            <Box
                className={this.props.wrapperClass}
                onClick={this.handleClick}
            >
               
                <div className={`${this.props.className} green-flag-hover`}>
                    <img
                        draggable={false}
                        src={greenFlag}
                    />
                </div>
            </Box>
        );
    }
}

GreenFlagOverlay.propTypes = {
    className: PropTypes.string,
    vm: PropTypes.instanceOf(VM),
    wrapperClass: PropTypes.string,
    onStarted: PropTypes.func
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    onStarted: () => dispatch(setStartedState(true))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GreenFlagOverlay);
