import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    FormattedMessage,
    defineMessages,
    injectIntl,
    intlShape
} from 'react-intl';
import DragConstants from '../../lib/drag-constants';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import SpriteSelectorItem from '../../containers/sprite-selector-item.jsx';
import styles from './backpack.css';

// TODO make sprite selector item not require onClick
const noop = () => {};

const dragTypeMap = { // Keys correspond with the backpack‑server item types
    costume: DragConstants.BACKPACK_COSTUME,
    sound: DragConstants.BACKPACK_SOUND,
    script: DragConstants.BACKPACK_CODE,
    sprite: DragConstants.BACKPACK_SPRITE
};

const labelMap = defineMessages({
    costume: {
        id: 'gui.backpack.costumeLabel',
        defaultMessage: 'costume',
        description: 'Label for costume backpack item'
    },
    sound: {
        id: 'gui.backpack.soundLabel',
        defaultMessage: 'sound',
        description: 'Label for sound backpack item'
    },
    script: {
        id: 'gui.backpack.scriptLabel',
        defaultMessage: 'script',
        description: 'Label for script backpack item'
    },
    sprite: {
        id: 'gui.backpack.spriteLabel',
        defaultMessage: 'sprite',
        description: 'Label for sprite backpack item'
    }
});

/**
 * Backpack – a small panel that can expand/collapse with a smooth height
 * transition. The list is **rendered only while it is visible**; after a
 * collapse the DOM node is removed (null) so it does not stay in the layout.
 */
const Backpack = ({
    blockDragOver,
    containerRef,
    contents,
    dragOver,
    error,
    expanded,
    intl,
    loading,
    showMore,
    onToggle,
    onDelete,
    onRename,
    onMouseEnter,
    onMouseLeave,
    onMore
}) => {
    /**
     * `shouldRenderList` controls whether the list container exists in the DOM.
     * - When `expanded` becomes true we render it immediately.
     * - When `expanded` becomes false we keep it rendered **until** the CSS
     *   transition ends, then we set it to false (null).
     */
    const [shouldRenderList, setShouldRenderList] = useState(expanded);

    /**
     * `isExpandedClassAdded` – do we actually have the `.expanded` CSS class?
     *   * becomes true **after** the element has been painted (next animation frame)
     *   * becomes false immediately when we start collapsing
     */
    const [isExpandedClassAdded, setIsExpandedClassAdded] = useState(false);

    // Keep the list rendered as soon as we start expanding.
    useEffect(() => {
        if (expanded) {
            setShouldRenderList(true);
        } else {
            setIsExpandedClassAdded(false);
        }
    }, [expanded]);

    // Use layout effect to schedule class addition after DOM update
    useLayoutEffect(() => {
        if (expanded && shouldRenderList) {
            // Schedule class addition in next animation frame
            const rafId = requestAnimationFrame(() => {
                setIsExpandedClassAdded(true);
            });
            
            return () => cancelAnimationFrame(rafId);
        }
    }, [expanded, shouldRenderList]);

    /**
     * Called when the transition on the list container finishes.
     * If we are collapsing (`expanded === false`) we can safely un‑mount it.
     */
    const handleTransitionEnd = useCallback(
        (e) => {
            // Guard against unrelated transitions (e.g. max‑height of a child)
            if (e.target !== e.currentTarget) return;
            if (!expanded) {
                setShouldRenderList(false);
            }
        },
        [expanded]
    );

    return (
        <div className={styles.backpackContainer}>
            <div
                className={styles.backpackHeader}
                onClick={onToggle}
            >
                {onToggle ? (
                    <FormattedMessage
                        defaultMessage="Backpack"
                        description="Button to open the backpack"
                        id="gui.backpack.header"
                    />
                ) : (
                    <ComingSoonTooltip
                        place="top"
                        tooltipId="backpack-tooltip"
                    >
                        <FormattedMessage
                            defaultMessage="Backpack"
                            description="Button to open the backpack"
                            id="gui.backpack.header"
                        />
                    </ComingSoonTooltip>
                )}
            </div>

            {/* -------------------------------------------------------------
                 The list is conditionally rendered based on `shouldRenderList`.
                 The `expanded` prop only toggles the CSS class – the DOM node
                 stays alive for the duration of the transition.
                 ------------------------------------------------------------- */}
            {shouldRenderList ? (
                <div
                    className={classNames(styles.backpackList, {
                        [styles.expanded]: isExpandedClassAdded,
                        [styles.dragOver]: dragOver || blockDragOver
                    })}
                    ref={containerRef}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {/* eslint-disable-next-line no-negated-condition */}
                    {error !== false ? (
                        <div className={styles.statusMessage}>
                            <FormattedMessage
                                defaultMessage="Error loading backpack"
                                description="Error backpack message"
                                id="gui.backpack.errorBackpack"
                            />
                            <div className={styles.errorMessage}>{error}</div>
                        </div>
                    ) : (
                        loading ? (
                            <div className={styles.statusMessage}>
                                <FormattedMessage
                                    defaultMessage="Loading..."
                                    description="Loading backpack message"
                                    id="gui.backpack.loadingBackpack"
                                />
                            </div>
                        ) : (
                            contents.length > 0 ? (
                                <div className={styles.backpackListInner}>
                                    {contents.map(item => (
                                        <SpriteSelectorItem
                                            className={styles.backpackItem}
                                            costumeURL={item.thumbnailUrl}
                                            details={item.name}
                                            dragPayload={item}
                                            dragType={dragTypeMap[item.type]}
                                            id={item.id}
                                            key={item.id}
                                            name={intl.formatMessage(labelMap[item.type])}
                                            selected={false}
                                            onClick={noop}
                                            onDeleteButtonClick={onDelete}
                                            // Currently, renaming sprites is not supported.
                                            onRenameButtonClick={item.type === 'sprite' ? null : onRename}
                                        />
                                    ))}
                                    {showMore && (
                                        <button
                                            className={styles.more}
                                            onClick={onMore}
                                        >
                                            <FormattedMessage
                                                defaultMessage="More"
                                                description="Load more from backpack"
                                                id="gui.backpack.more"
                                            />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.statusMessage}>
                                    <FormattedMessage
                                        defaultMessage="Backpack is empty"
                                        description="Empty backpack message"
                                        id="gui.backpack.emptyBackpack"
                                    />
                                </div>
                            )
                        ) 
                    ) }
                </div>
            ) : null }
        </div>
    );
};

Backpack.propTypes = {
    blockDragOver: PropTypes.bool,
    containerRef: PropTypes.func,
    contents: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        thumbnailUrl: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string
    })),
    dragOver: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    expanded: PropTypes.bool,
    intl: intlShape,
    loading: PropTypes.bool,
    onDelete: PropTypes.func,
    onRename: PropTypes.func,
    onMore: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onToggle: PropTypes.func,
    showMore: PropTypes.bool
};

Backpack.defaultProps = {
    blockDragOver: false,
    contents: [],
    dragOver: false,
    expanded: false,
    loading: false,
    showMore: false,
    onMore: null,
    onToggle: null
};

export default injectIntl(Backpack);
