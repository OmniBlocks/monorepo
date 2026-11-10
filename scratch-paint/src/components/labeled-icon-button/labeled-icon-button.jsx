/* @todo This file should be pulled out into a shared library with scratch-gui,
consolidating this component with icon-button.jsx in gui.
See #13 */

import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import Button from '../button/button.jsx';
import TWRenderRecoloredImage from '../../tw-recolor/render.jsx';

import styles from './labeled-icon-button.css';

const LabeledIconButton = ({
    className,
    hideLabel,
    imgAlt,
    imgSrc,
    onClick,
    title,
    gray,
    ...props
}) => (
    <Button
        className={classNames(className, styles.modEditField)}
        onClick={onClick}
        {...props}
    >
        <TWRenderRecoloredImage
            alt={imgAlt || title}
            className={classNames(styles.editFieldIcon, {[styles.gray]: gray})}
            draggable={false}
            src={imgSrc}
            title={title}
        />
        {!hideLabel && <span className={styles.editFieldTitle}>{title}</span>}
    </Button>
);

LabeledIconButton.propTypes = {
    className: PropTypes.string,
    hideLabel: PropTypes.bool,
    highlighted: PropTypes.bool,
    imgAlt: PropTypes.string,
    imgSrc: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    gray: PropTypes.bool
};

export default LabeledIconButton;
