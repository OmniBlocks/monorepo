import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import styles from './tag-button.css';

const TagButtonComponent = ({
    active,
    className,
    tag,  
    intlLabel,
    ...props
}) => (
    <button
        className={classNames(styles.tagButton, className)}
        aria-checked={active}
        {...props}
    >
        <div className={styles.checkbox}></div>
        <div>{typeof intlLabel === 'string' ? intlLabel : <FormattedMessage {...intlLabel} />}</div>
    </button>
);

TagButtonComponent.propTypes = {
    active: PropTypes.bool,
    intlLabel: PropTypes.oneOfType([
        PropTypes.shape({
            defaultMessage: PropTypes.string,
            description: PropTypes.string,
            id: PropTypes.string
        }),
        PropTypes.string
    ]).isRequired,
    tag: PropTypes.string.isRequired
};

TagButtonComponent.defaultProps = {
    active: false
};

export default TagButtonComponent;
