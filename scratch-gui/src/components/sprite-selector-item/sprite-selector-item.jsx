import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

<<<<<<< HEAD
=======
import DeleteButton from '../delete-button/delete-button.jsx';
import styles from './sprite-selector-item.css';
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
import {ContextMenuTrigger} from 'react-contextmenu';
import {DangerousMenuItem, ContextMenu, MenuItem} from '../context-menu/context-menu.jsx';
import {FormattedMessage} from 'react-intl';

<<<<<<< HEAD
import DeleteButton from '../delete-button/delete-button.jsx';
import styles from './sprite-selector-item.css';

// react-contextmenu requires unique id to match trigger and context menu
let contextMenuId = 0;

const SpriteSelectorItem = props => {
    const showContextMenu = Boolean(
        props.onDuplicateButtonClick ||
        props.onDeleteButtonClick ||
        props.onExportButtonClick ||
        props.onExportJustButtonClick
    );

    return (
        <ContextMenuTrigger
            attributes={{
                className: classNames(props.className, styles.spriteSelectorItem, {
                    [styles.isSelected]: props.selected
                }),
                onClick: props.onClick,
                onMouseEnter: props.onMouseEnter,
                onMouseLeave: props.onMouseLeave,
                onMouseDown: props.onMouseDown,
                onTouchStart: props.onMouseDown
            }}
            disable={props.preventContextMenu}
            id={`${props.name}-${contextMenuId}`}
            ref={props.componentRef}
        >
            {typeof props.number === 'undefined' ? null : (
                <div className={styles.number}>{props.number}</div>
            )}
            {props.costumeURL ? (
                <div className={styles.spriteImageOuter}>
                    <div className={styles.spriteImageInner}>
                        <img
                            className={styles.spriteImage}
                            draggable={false}
                            loading="lazy"
                            src={props.costumeURL}
                        />
                    </div>
                </div>
            ) : null}
            <div className={styles.spriteInfo}>
                <div className={styles.spriteName}>{props.name}</div>
                {props.details ? (
                    <div className={styles.spriteDetails}>{props.details}</div>
                ) : null}
            </div>
            {(props.selected && props.onDeleteButtonClick) ? (
                <DeleteButton
                    className={styles.deleteButton}
                    onClick={props.onDeleteButtonClick}
                />
            ) : null }
            {showContextMenu ? (
                <ContextMenu id={`${props.name}-${contextMenuId++}`}>
                    {props.onDuplicateButtonClick ? (
                        <MenuItem onClick={props.onDuplicateButtonClick}>
                            <FormattedMessage
                                defaultMessage="duplicate"
                                description="Menu item to duplicate in the right click menu"
                                id="gui.spriteSelectorItem.contextMenuDuplicate"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onExportButtonClick ? (
                        <MenuItem onClick={props.onExportButtonClick}>
                            <FormattedMessage
                                defaultMessage="export"
                                description="Menu item to export the selected item"
                                id="gui.spriteSelectorItem.contextMenuExport"
                            />
                        </MenuItem>
                    ) : null }
                    {props.onRenameButtonClick ? (
                        <MenuItem onClick={props.onRenameButtonClick}>
                            <FormattedMessage
                                defaultMessage="rename"
                                description="Menu item to rename an item"
                                id="tw.spriteSelectorItem.rename"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onExportJustButtonClick ? (
                        <MenuItem onClick={props.onExportJustButtonClick}>
                            <FormattedMessage
                                defaultMessage="export just..."
                                description="Menu item to open export modal for costumes or sounds"
                                id="gui.spriteSelectorItem.exportJust"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onDeleteButtonClick ? (
                        <DangerousMenuItem onClick={props.onDeleteButtonClick}>
                            <FormattedMessage
                                defaultMessage="delete"
                                description="Menu item to delete in the right click menu"
                                id="gui.spriteSelectorItem.contextMenuDelete"
                            />
                        </DangerousMenuItem>
                    ) : null }
                </ContextMenu>
            ) : null}
        </ContextMenuTrigger>
    );
};
=======
// react-contextmenu requires unique id to match trigger and context menu
let contextMenuId = 0;

const SpriteSelectorItem = props => (
    <ContextMenuTrigger
        attributes={{
            className: classNames(props.className, styles.spriteSelectorItem, {
                [styles.isSelected]: props.selected
            }),
            onClick: props.onClick,
            onMouseEnter: props.onMouseEnter,
            onMouseLeave: props.onMouseLeave,
            onMouseDown: props.onMouseDown,
            onTouchStart: props.onMouseDown
        }}
        disable={props.preventContextMenu}
        id={`${props.name}-${contextMenuId}`}
        ref={props.componentRef}
    >
        {typeof props.number === 'undefined' ? null : (
            <div className={styles.number}>{props.number}</div>
        )}
        {props.costumeURL ? (
            <div className={styles.spriteImageOuter}>
                <div className={styles.spriteImageInner}>
                    <img
                        className={styles.spriteImage}
                        draggable={false}
                        loading="lazy"
                        src={props.costumeURL}
                    />
                </div>
            </div>
        ) : null}
        <div className={styles.spriteInfo}>
            <div className={styles.spriteName}>{props.name}</div>
            {props.details ? (
                <div className={styles.spriteDetails}>{props.details}</div>
            ) : null}
        </div>
        {(props.selected && props.onDeleteButtonClick) ? (
            <DeleteButton
                className={styles.deleteButton}
                onClick={props.onDeleteButtonClick}
            />
        ) : null }
        {props.onDuplicateButtonClick || props.onDeleteButtonClick || props.onExportButtonClick ? (
            <ContextMenu id={`${props.name}-${contextMenuId++}`}>
                {props.onDuplicateButtonClick ? (
                    <MenuItem onClick={props.onDuplicateButtonClick}>
                        <FormattedMessage
                            defaultMessage="duplicate"
                            description="Menu item to duplicate in the right click menu"
                            id="gui.spriteSelectorItem.contextMenuDuplicate"
                        />
                    </MenuItem>
                ) : null}
                {props.onExportButtonClick ? (
                    <MenuItem onClick={props.onExportButtonClick}>
                        <FormattedMessage
                            defaultMessage="export"
                            description="Menu item to export the selected item"
                            id="gui.spriteSelectorItem.contextMenuExport"
                        />
                    </MenuItem>
                ) : null }
                {props.onRenameButtonClick ? (
                    <MenuItem onClick={props.onRenameButtonClick}>
                        <FormattedMessage
                            defaultMessage="rename"
                            description="Menu item to rename an item"
                            id="tw.spriteSelectorItem.rename"
                        />
                    </MenuItem>
                ) : null}
                {props.onDeleteButtonClick ? (
                    <DangerousMenuItem onClick={props.onDeleteButtonClick}>
                        <FormattedMessage
                            defaultMessage="delete"
                            description="Menu item to delete in the right click menu"
                            id="gui.spriteSelectorItem.contextMenuDelete"
                        />
                    </DangerousMenuItem>
                ) : null }
            </ContextMenu>
        ) : null}
    </ContextMenuTrigger>
);
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571

SpriteSelectorItem.propTypes = {
    className: PropTypes.string,
    componentRef: PropTypes.func,
    costumeURL: PropTypes.string,
    details: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    name: PropTypes.any,
    number: PropTypes.number,
    onClick: PropTypes.func,
    onDeleteButtonClick: PropTypes.func,
    onDuplicateButtonClick: PropTypes.func,
    onExportButtonClick: PropTypes.func,
<<<<<<< HEAD
    onExportJustButtonClick: PropTypes.func,
=======
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
    onRenameButtonClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    preventContextMenu: PropTypes.bool,
    selected: PropTypes.bool.isRequired
};

export default SpriteSelectorItem;
