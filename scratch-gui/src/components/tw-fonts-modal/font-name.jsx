import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import styles from './fonts-modal.css';
import FontDropdownItem from './font-dropdown-item.jsx';

class FontName extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setInputRef',
            'handleChange',
            'handleFocus',
            'handleBlur',
            'handleResize',
            'handleSelectFont',
            'handleKeyDown'
        ]);
        this.state = {
            focused: false,
            rect: null
        };
    }

    componentDidMount () {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.handleResize);
    }

    setInputRef (input) {
        this.input = input;

        // can't use autoFocus because handleFocus relies on the ref existing already
        if (input) {
            input.focus();
        }
    }

    handleChange (e) {
        this.props.onChange(e.target.value);
    }

    handleFocus () {
        this.setState({
            focused: true,
            rect: this.input.getBoundingClientRect()
        });
    }

    handleBlur () {
        this.props.onChange(this.props.fontManager.getSafeName(this.props.name));
        this.setState({
            focused: false
        });
    }

    handleResize () {
        if (this.state.focused) {
            this.setState({
                rect: this.input.getBoundingClientRect()
            });
        }
    }

    handleSelectFont (font) {
        this.props.onChange(font);
    }

    handleKeyDown (e) {
        if (e.key === 'Enter') {
            this.handleBlur();
            e.target.blur();
        }
    }

    getFilteredOptions () {
        if (!this.state.focused || !this.props.options) {
            return [];
        }
        const name = this.props.name.toLowerCase();
        const candidates = this.props.options
            .filter(family => family.toLowerCase().includes(name));
        if (candidates.length === 0 && candidates[0] === this.props.name) {
            return [];
        }
        return candidates;
    }

    render () {
        const {
            /* eslint-disable no-unused-vars */
            name,
            onChange,
            fontManager,
            options,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;

        const filteredOptions = this.getFilteredOptions();
        return (
            <div className={styles.fontInputOuter}>
                <input
                    {...props}
                    type="text"
                    className={styles.fontInput}
                    value={this.props.name}
                    ref={this.setInputRef}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onKeyDown={this.handleKeyDown}
                />

                {/* We need to use a portal to get out of the modal's overflow: hidden, unfortunately */}
                {filteredOptions.length > 0 && ReactDOM.createPortal(
                    <div
                        className={styles.fontDropdownOuter}
                        style={{
                            left: `${this.state.rect.left - 4}px`,
                            top: `${this.state.rect.top + this.state.rect.height + 4}px`,
                            width: `${this.state.rect.width + 8}px`
                        }}
                    >
                        {this.getFilteredOptions().map(family => (
                            <FontDropdownItem
                                key={family}
                                family={family}
                                onSelect={this.handleSelectFont}
                            />
                        ))}
                    </div>,
                    document.body
                )}
            </div>
        );
    }
}

FontName.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    fontManager: PropTypes.shape({
        getSafeName: PropTypes.func.isRequired
    }).isRequired,
    options: PropTypes.arrayOf(PropTypes.string.isRequired)
};

export default FontName;
