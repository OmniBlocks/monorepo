import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import Input from '../forms/input.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';

import styles from './tw-color-readout.css';

const BufferedInput = BufferedInputHOC(Input);

class TWColorReadout extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSubmit'
        ]);
    }
    handleSubmit (value) {
        if (!isNaN(value)) {
            this.props.onChange(Math.min(100, Math.max(0, +value || 0)));
        }
    }
    render () {
        return (
            <BufferedInput
                className={styles.readout}
                onSubmit={this.handleSubmit}
                value={Math.round(this.props.value * 10) / 10}
                type="number"
                step="any"
                min={0}
                max={100}
            />
        );
    }
}

TWColorReadout.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func
};

export default TWColorReadout;
