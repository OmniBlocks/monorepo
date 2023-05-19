import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {FormattedMessage} from 'react-intl';
import styles from './file-input.css';

class FileInput extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChange',
            'handleClick'
        ]);
        this.state = {
            file: props.file
        };
    }
    handleChange (e) {
        const file = e.target.files[0];
        this.props.onChange(file);
    }
    handleClick () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = this.props.accept;
        input.addEventListener('change', this.handleChange);
        document.body.appendChild(input);
        input.click();
        input.remove();
    }
    render () {
        return (
            <button
                className={styles.container}
                onClick={this.handleClick}
            >
                {this.props.file ? (
                    <FormattedMessage
                        defaultMessage="Selected: {name}"
                        // eslint-disable-next-line max-len
                        description="Appears in a file selector when a file is selected. {name} could be a string like 'fetch.js'"
                        id="tw.fileInput.selected"
                        values={{
                            name: this.props.file.name
                        }}
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="No file selected."
                        description="Appears in a file selector when no file is selected."
                        id="tw.fileInput.none"
                    />
                )}
            </button>
        );
    }
}

FileInput.propTypes = {
    file: PropTypes.instanceOf(File),
    accept: PropTypes.string,
    onChange: PropTypes.func
};

export default FileInput;
