import React from 'react';
import PropTypes from 'prop-types';
import styles from './fonts-modal.css';
import bindAll from 'lodash.bindall';

class FontName extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChange',
            'handleFlush',
            'handleKeyPress'
        ]);
    }

    handleChange (e) {
        this.props.onChange(e.target.value);
    }

    handleFlush () {
        this.props.onChange(this.props.fontManager.getSafeName(this.props.name));
    }

    handleKeyPress (e) {
        if (e.key === 'Enter') {
            this.handleFlush();
            e.target.blur();
        }
    }

    render () {
        const {
            /* eslint-disable no-unused-vars */
            name,
            onChange,
            fontManager,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return (
            <input
                {...props}
                type="text"
                autoFocus
                className={styles.fontInput}
                value={this.props.name}
                onChange={this.handleChange}
                onBlur={this.handleFlush}
                onKeyPress={this.handleKeyPress}
            />
        );
    }
}

FontName.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    fontManager: PropTypes.shape({
        getSafeName: PropTypes.func.isRequired
    }).isRequired
};

export default FontName;
