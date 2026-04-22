import bindAll from 'lodash.bindall';
import React from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
=======

>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
import {connect} from 'react-redux';
import VM from 'scratch-vm';
import Box from '../components/box/box.jsx';
import greenFlag from '../components/green-flag/icon--green-flag.svg';
import {setStartedState} from '../reducers/vm-status.js';

<<<<<<< HEAD
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
=======
class GreenFlagOverlay extends React.Component {
    constructor (props) {
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
        super(props);
        bindAll(this, [
            'handleClick'
        ]);
    }

<<<<<<< HEAD
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
=======
    handleClick () {
        this.props.vm.start();
        this.props.vm.greenFlag();

        // FIXME: some unknown edge cases are causing start() to be called but for the
        // RUNTIME_STARTED listener to not update redux, causing this to always be
        // shown and never go away. this is a temporary hack to avoid that...
        this.props.onStarted();
    }

    render () {
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
        return (
            <Box
                className={this.props.wrapperClass}
                onClick={this.handleClick}
            >
<<<<<<< HEAD
               
                <div className={`${this.props.className} green-flag-hover`}>
=======
                <div className={this.props.className}>
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
                    <img
                        draggable={false}
                        src={greenFlag}
                    />
                </div>
            </Box>
<<<<<<< HEAD
=======

>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
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
