import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import LibraryItem from '../../containers/library-item.jsx';
import Modal from '../../containers/modal.jsx';
import Divider from '../divider/divider.jsx';
import Filter from '../filter/filter.jsx';
import TagButton from '../../containers/tag-button.jsx';
import Spinner from '../spinner/spinner.jsx';
import Separator from '../tw-extension-separator/separator.jsx';
import SidebarNotice from '../ob-sidebar-notice/sidebar-notice.jsx';
import {APP_NAME} from '../../lib/brand';
import sidebarToggleIcon from './icon--sidebar-toggle.svg';

import styles from './library.css';

const messages = defineMessages({
    filterPlaceholder: {
        id: 'gui.library.filterPlaceholder',
        defaultMessage: 'Search',
        description: 'Placeholder text for library search field'
    },
    allTag: {
        id: 'gui.library.allTag',
        defaultMessage: 'All',
        description: 'Label for library tag to revert to all items after filtering by tag.'
    }
});

const ALL_TAG = {tag: 'all', intlLabel: messages.allTag};
const tagListPrefix = [];

class LibraryComponent extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleClose',
            'handleFilterChange',
            'handleFilterClear',
            'handleMouseEnter',
            'handleMouseLeave',
            'handlePlayingEnd',
            'handleSelect',
            'handleFavorite',
            'handleTagClick',
            'setFilteredDataRef'
        ]);
        const favorites = this.readFavoritesFromStorage();
        this.state = {
            playingItem: null,
            filterQuery: '',
            selectedTags: [ALL_TAG.tag],
            canDisplay: false,
            favorites,
            initialFavorites: favorites,
            isSidebarOpen: window.innerWidth > 1450
        };
    }
    componentDidMount() {
        // Rendering all the items in the library can take a bit, so we'll always
        // show one frame with a loading spinner.
        setTimeout(() => {
            this.setState({
                canDisplay: true
            });
        });
        if (this.props.setStopHandler) this.props.setStopHandler(this.handlePlayingEnd);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.filterQuery !== this.state.filterQuery || prevState.selectedTags !== this.state.selectedTags) {
            this.scrollToTop();
        }

        if (this.state.favorites !== prevState.favorites) {
            try {
                localStorage.setItem(this.getFavoriteStorageKey(), JSON.stringify(this.state.favorites));
            } catch (error) {
                // ignore
            }
        }
    }
    handleSelect(id) {
        this.handleClose();
        this.props.onItemSelected(this.getFilteredData()[id]);
    }
    readFavoritesFromStorage() {
        let data;
        try {
            data = JSON.parse(localStorage.getItem(this.getFavoriteStorageKey()));
        } catch (error) {
            // ignore
        }
        if (!Array.isArray(data)) {
            data = [];
        }
        return data;
    }
    getFavoriteStorageKey() {
        return `tw:library-favorites:${this.props.id}`;
    }
    handleFavorite(id) {
        const data = this.getFilteredData()[id];
        const key = data[this.props.persistableKey];
        this.setState(oldState => ({
            favorites: oldState.favorites.includes(key)
                ? oldState.favorites.filter(i => i !== key)
                : [...oldState.favorites, key]
        }));
    }
    handleClose() {
        this.props.onRequestClose();
    }
    handleTagClick(tag) {
        const tagLower = tag.toLowerCase();
        this.setState(oldState => {
            let selectedTags = oldState.selectedTags.filter(t => t !== ALL_TAG.tag);
            if (selectedTags.includes(tagLower)) {
                selectedTags = selectedTags.filter(t => t !== tagLower);
            } else {
                selectedTags = [...selectedTags, tagLower];
            }
            // If no tags selected, default to 'all'
            if (selectedTags.length === 0) selectedTags = [ALL_TAG.tag];
            return {
                selectedTags,
                playingItem: null
            };
        });
    }
    handleMouseEnter(id) {
        // don't restart if mouse over already playing item
        if (this.props.onItemMouseEnter && this.state.playingItem !== id) {
            this.props.onItemMouseEnter(this.getFilteredData()[id]);
            this.setState({
                playingItem: id
            });
        }
    }
    handleMouseLeave(id) {
        if (this.props.onItemMouseLeave) {
            this.props.onItemMouseLeave(this.getFilteredData()[id]);
            this.setState({
                playingItem: null
            });
        }
    }
    handlePlayingEnd() {
        if (this.state.playingItem !== null) {
            this.setState({
                playingItem: null
            });
        }
    }
    handleFilterChange(event) {
        if (this.state.playingItem === null) {
            this.setState({
                filterQuery: event.target.value
            });
        } else {
            this.props.onItemMouseLeave(this.getFilteredData()[[this.state.playingItem]]);
            this.setState({
                filterQuery: event.target.value,
                playingItem: null
            });
        }
    }
    handleFilterClear() {
        this.setState({filterQuery: ''});
    }
    getFilteredData() {
        // Helper: assign 'Other' tag if needed
        const assignOtherTag = dataArr =>
            dataArr.map(dataItem => {
                if (typeof dataItem !== 'object' || !dataItem) return dataItem;
                const tags = (dataItem.tags || []);
                const ignored = ['scratch', 'tw', 'ampmod'];
                const sidebarTags = this.props.tags.map(t => t.tag);

                // Only ignore the ignored tags when deciding if Other is needed
                const meaningfulTags = tags.filter(t => !ignored.includes(t));

                // If there are no meaningful tags in the sidebar, add Other
                if (!meaningfulTags.some(tag => sidebarTags.includes(tag))) {
                    return {...dataItem, tags: [...tags, 'Other']};
                }

                return dataItem;
            });

        // When no filtering, favorites get their own section
        if (this.state.selectedTags.length === 1 && this.state.selectedTags[0] === 'all' && !this.state.filterQuery) {
            const allData = assignOtherTag(this.props.data);
            const favoriteItems = allData
                .filter(dataItem => this.state.initialFavorites.includes(dataItem[this.props.persistableKey]))
                .map(dataItem => ({
                    ...dataItem,
                    key: `favorite-${dataItem[this.props.persistableKey]}`
                }));

            if (favoriteItems.length) {
                favoriteItems.push('---');
            }

            return [...favoriteItems, ...allData];
        }

        // When filtering, favorites are just listed first, not in a separate section.
        const allData = assignOtherTag(this.props.data);
        const favoriteItems = [];
        const nonFavoriteItems = [];
        for (const dataItem of allData) {
            if (dataItem === '---') {
                // ignore
            } else if (this.state.initialFavorites.includes(dataItem[this.props.persistableKey])) {
                favoriteItems.push(dataItem);
            } else {
                nonFavoriteItems.push(dataItem);
            }
        }

        let filteredItems = favoriteItems.concat(nonFavoriteItems);

        // Multi-tag filtering: must match ALL selected tags (except 'all')
        const activeTags = this.state.selectedTags.filter(t => t !== 'all');
        if (activeTags.length > 0) {
            filteredItems = filteredItems.filter(
                dataItem =>
                    dataItem.tags && activeTags.every(tag => dataItem.tags.map(i => i.toLowerCase()).includes(tag))
            );
        }

        if (this.state.filterQuery) {
            filteredItems = filteredItems.filter(dataItem => {
                const search = [...(dataItem.tags || [])];
                if (dataItem.name) {
                    // Use the name if it is a string, else use formatMessage to get the translated name
                    if (typeof dataItem.name === 'string') {
                        search.push(dataItem.name);
                    } else {
                        search.push(
                            this.props.intl.formatMessage(dataItem.name.props, {
                                APP_NAME
                            })
                        );
                    }
                }
                if (dataItem.description) {
                    search.push(dataItem.description);
                }
                return search.join('\n').toLowerCase().includes(this.state.filterQuery.toLowerCase());
            });
        }

        return filteredItems;
    }
    scrollToTop() {
        this.filteredDataRef.scrollTop = 0;
    }
    setFilteredDataRef(ref) {
        this.filteredDataRef = ref;
    }
    render() {
        const filteredData = this.state.canDisplay && this.props.data && this.getFilteredData();

        // Ensure 'Other' tag is present in sidebar
        let sidebarTags = Array.isArray(this.props.tags) ? [...this.props.tags] : [];
        if (!sidebarTags.some(t => t.tag && t.tag.toLowerCase() === 'other')) {
            sidebarTags.push('---');
            sidebarTags.push({
                tag: 'Other',
                intlLabel: {
                    id: 'gui.library.otherTag',
                    defaultMessage: 'Uncategorised'
                }
            });
        }

        return (
            <Modal fullScreen contentLabel={this.props.title} id={this.props.id} onRequestClose={this.handleClose}>
                <div className={styles.sidebarContainer}>
                    {(this.props.filterable || sidebarTags.length) && (
                        <div className={classNames(styles.filterBar, this.state.isSidebarOpen && styles.filterBarOpen)}>
                            <button
                                onClick={() => {this.setState({isSidebarOpen: !this.state.isSidebarOpen})}}
                                className=
                                    {classNames(styles.openButton, !this.state.isSidebarOpen && styles.openButtonClosed)} 
                                aria-label={`Filter bar is ${this.state.isSidebarOpen ? 'open' : 'closed'}, select to  ${this.state.isSidebarOpen ? 'close' : 'open'}`}
                                title={`${this.state.isSidebarOpen ? 'Close' : 'Open'} filter bar`}
                            >
                                <img src={sidebarToggleIcon} width={10} draggable='false' aria-hidden='true' />
                            </button>
                            {this.state.isSidebarOpen && <div className={styles.filterBarMain}>
                                {this.props.filterable && (
                                    <Filter
                                        className={classNames(styles.filterBarItem, styles.filter)}
                                        filterQuery={this.state.filterQuery}
                                        inputClassName={styles.filterInput}
                                        placeholderText={this.props.intl.formatMessage(messages.filterPlaceholder)}
                                        onChange={this.handleFilterChange}
                                        onClear={this.handleFilterClear}
                                    />
                                )}
                                {this.props.filterable && sidebarTags.length > 0 && (
                                    <div className={classNames(styles.filterBarItem, styles.divider)} />
                                )}
                                {sidebarTags.length > 0 && (
                                    <div className={styles.tagWrapper}>
                                        {tagListPrefix.concat(sidebarTags).map((tagProps, id) => {
                                            if (tagProps === '---') {
                                                return <Separator key={`separator-${id}`} />;
                                            }
                                            if (tagProps['heading']) {
                                                return (
                                                    <h4>
                                                        {typeof tagProps.heading === 'string'
                                                        ? tagProps.heading
                                                        : this.props.intl.formatMessage(tagProps.heading)}
                                                    </h4>
                                                );
                                            }
                                            return (
                                                <TagButton
                                                    active={this.state.selectedTags.includes(tagProps.tag.toLowerCase())}
                                                    className={classNames(
                                                        styles.filterBarItem,
                                                        styles.tagButton,
                                                        tagProps.className
                                                    )}
                                                    key={`tag-button-${id}`}
                                                    onClick={this.handleTagClick}
                                                    {...tagProps}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                                {this.props.sidebarNotice && (
                                    <React.Fragment>
                                        <Separator />
                                        <SidebarNotice message={this.props.intl.formatMessage(this.props.sidebarNotice)} />
                                    </React.Fragment>
                                )}
                            </div>}
                        </div>
                    )}
                    {this.state.isSidebarOpen && <div className={styles.libraryOverlay} onClick={() => {this.setState({isSidebarOpen: false})}} />}
                    <div
                        className={styles.libraryScrollGrid}
                        ref={this.setFilteredDataRef}
                    >
                        {filteredData &&
                            this.getFilteredData().map((dataItem, index) =>
                                dataItem === '---' ? (
                                    <Separator key={index} />
                                ) : (
                                    <LibraryItem
                                        bluetoothRequired={dataItem.bluetoothRequired}
                                        collaborator={dataItem.collaborator}
                                        description={dataItem.description}
                                        disabled={dataItem.disabled}
                                        tags={dataItem.tags}
                                        extensionId={dataItem.extensionId}
                                        href={dataItem.href}
                                        featured={dataItem.featured}
                                        hidden={dataItem.hidden}
                                        iconMd5={dataItem.costumes ? dataItem.costumes[0].md5ext : dataItem.md5ext}
                                        iconRawURL={dataItem.rawURL}
                                        icons={dataItem.costumes}
                                        id={index}
                                        incompatibleWithScratch={dataItem.incompatibleWithScratch}
                                        favorite={this.state.favorites.includes(dataItem[this.props.persistableKey])}
                                        onFavorite={this.handleFavorite}
                                        insetIconURL={dataItem.insetIconURL}
                                        insetIconBgColor={dataItem.insetIconBgColor}
                                        internetConnectionRequired={dataItem.internetConnectionRequired}
                                        requirements={dataItem.requirements}
                                        isPlaying={this.state.playingItem === index}
                                        key={
                                            dataItem.key ||
                                            (typeof dataItem.name === 'string' ? dataItem.name : dataItem.rawURL)
                                        }
                                        name={dataItem.name}
                                        credits={dataItem.credits}
                                        samples={dataItem.samples}
                                        docsURI={dataItem.docsURI}
                                        deprecated={dataItem.deprecated}
                                        showPlayButton={this.props.showPlayButton}
                                        onMouseEnter={this.handleMouseEnter}
                                        onMouseLeave={this.handleMouseLeave}
                                        onSelect={this.handleSelect}
                                    />
                                )
                            )}
                        {!filteredData && (
                            <div className={styles.spinnerWrapper}>
                                <Spinner large level="primary" />
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        );
    }
}

LibraryComponent.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                 
                // An item in the library
                PropTypes.shape({
                    // @todo remove md5/rawURL prop from library, refactor to use storage
                    md5: PropTypes.string,
                    name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
                    rawURL: PropTypes.string
                }),
                PropTypes.string
                 
            ])
        ),
        PropTypes.instanceOf(Promise)
    ]),
    filterable: PropTypes.bool,
    id: PropTypes.string.isRequired,
    persistableKey: PropTypes.string,
    intl: intlShape.isRequired,
    onItemMouseEnter: PropTypes.func,
    onItemMouseLeave: PropTypes.func,
    onItemSelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    setStopHandler: PropTypes.func,
    showPlayButton: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.shape(TagButton.propTypes)),
    title: PropTypes.string.isRequired,
    sidebarNotice: PropTypes.object
};

LibraryComponent.defaultProps = {
    filterable: true,
    persistableKey: 'name',
    showPlayButton: false
};

export default injectIntl(LibraryComponent);
