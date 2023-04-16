import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Button from '../button/button.jsx';
import Dropdown from '../dropdown/dropdown.jsx';
import InputGroup from '../input-group/input-group.jsx';
import Fonts from '../../lib/fonts';
import styles from './font-dropdown.css';

const ModeToolsComponent = props => (
    <Dropdown
        className={classNames(styles.modUnselect, styles.fontDropdown)}
        enterExitTransitionDurationMs={60}
        popoverContent={
            <InputGroup className={styles.modContextMenu}>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverSansSerif}
                >
                    <span className={styles.sansSerif}>
                        {props.getFontName(Fonts.SANS_SERIF)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverSerif}
                >
                    <span className={styles.serif}>
                        {props.getFontName(Fonts.SERIF)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverHandwriting}
                >
                    <span className={styles.handwriting}>
                        {props.getFontName(Fonts.HANDWRITING)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverMarker}
                >
                    <span className={styles.marker}>
                        {props.getFontName(Fonts.MARKER)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverCurly}
                >
                    <span className={styles.curly}>
                        {props.getFontName(Fonts.CURLY)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverPixel}
                >
                    <span className={styles.pixel}>
                        {props.getFontName(Fonts.PIXEL)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverPlayful}
                >
                    <span className={styles.playful}>
                        {props.getFontName(Fonts.PLAYFUL)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverBubbly}
                >
                    <span className={styles.bubbly}>
                        {props.getFontName(Fonts.BUBBLY)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverArcade}
                >
                    <span className={styles.arcade}>
                        {props.getFontName(Fonts.ARCADE)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverBitsAndBytes}
                >
                    <span className={styles.bitsandbytes} style={{ transform: "scaleX(0.5)", transformOrigin: "left" }}>
                        {props.getFontName(Fonts.BITSANDBYTES)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverTechnological}
                >
                    <span className={styles.technological}>
                        {props.getFontName(Fonts.TECHNOLOGICAL)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverScratch}
                >
                    <span className={styles.scratch}>
                        {props.getFontName(Fonts.SCRATCH)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverChinese}
                >
                    <span className={styles.chinese}>
                        {props.getFontName(Fonts.CHINESE)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverJapanese}
                >
                    <span className={styles.japanese}>
                        {props.getFontName(Fonts.JAPANESE)}
                    </span>
                </Button>
                <Button
                    className={classNames(styles.modMenuItem)}
                    onClick={props.onChoose}
                    onMouseOver={props.onHoverKorean}
                >
                    <span className={styles.korean}>
                        {props.getFontName(Fonts.KOREAN)}
                    </span>
                </Button>
            </InputGroup>
        }
        ref={props.componentRef}
        tipSize={.01}
        onOpen={props.onOpenDropdown}
        onOuterAction={props.onClickOutsideDropdown}
    >
        <span className={classNames(props.getFontStyle(props.font), styles.displayedFontName)} style={props.font === "Bits and Bytes" ? { transform: "scale(0.5)", transformOrigin: "left" } : {}}>
            {props.getFontName(props.font)}
        </span>
    </Dropdown>
);

ModeToolsComponent.propTypes = {
    componentRef: PropTypes.func.isRequired,
    font: PropTypes.string,
    getFontName: PropTypes.func.isRequired,
    getFontStyle: PropTypes.func.isRequired,
    onChoose: PropTypes.func.isRequired,
    onClickOutsideDropdown: PropTypes.func,
    onHoverChinese: PropTypes.func,
    onHoverCurly: PropTypes.func,
    onHoverHandwriting: PropTypes.func,
    onHoverJapanese: PropTypes.func,
    onHoverKorean: PropTypes.func,
    onHoverMarker: PropTypes.func,
    onHoverPixel: PropTypes.func,
    onHoverPlayful: PropTypes.func,
    onHoverBubbly: PropTypes.func,
    onHoverBitsAndBytes: PropTypes.func,
    onHoverTechnological: PropTypes.func,
    onHoverArcade: PropTypes.func,
    onHoverScratch: PropTypes.func,
    onHoverSansSerif: PropTypes.func,
    onHoverSerif: PropTypes.func,
    onOpenDropdown: PropTypes.func
};
export default ModeToolsComponent;
