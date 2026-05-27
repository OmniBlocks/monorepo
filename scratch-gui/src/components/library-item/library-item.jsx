import {FormattedMessage, intlShape, defineMessages} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import PlayButton from '../../containers/play-button.jsx';
import styles from './library-item.css';
import classNames from 'classnames';

import bluetoothIconURL from './bluetooth.svg';
import internetConnectionIconURL from './internet-connection.svg';
import nfcIconURL from './nfc.svg';
import packagedIconURL from './packaged.svg';
import favoriteInactiveIcon from './favorite-inactive.svg';
import favoriteActiveIcon from './favorite-active.svg';

const messages = defineMessages({
    favorite: {
        defaultMessage: 'Favorite',
        description: 'Alt text of icon in costume, sound, and extension libraries to mark an item as favorite.',
        id: 'tw.favorite'
    },
    unfavorite: {
        defaultMessage: 'Unfavorite',
        description: 'Alt text of icon in costume, sound, and extension libraries to unmark an item as favorite.',
        id: 'tw.unfavorite'
    }
});

 
class LibraryItemComponent extends React.PureComponent {
    render() {
        const favoriteMessage = this.props.intl.formatMessage(
            this.props.favorite ? messages.unfavorite : messages.favorite
        );
        const favorite = (
            <button
                className={classNames(styles.favoriteContainer, {
                    [styles.active]: this.props.favorite
                })}
                onClick={this.props.onFavorite}
            >
                <img
                    src={this.props.favorite ? favoriteActiveIcon : favoriteInactiveIcon}
                    className={styles.favoriteIcon}
                    draggable={false}
                    alt={favoriteMessage}
                    title={favoriteMessage}
                />
            </button>
        );

        if (this.props.hidden) {
            return null;
        }

        return this.props.featured ? (
            <div
                className={classNames(
                    styles.libraryItem,
                    styles.featuredItem,
                    {
                        [styles.disabled]: this.props.disabled,
                    },
                    typeof this.props.extensionId === 'string' ? styles.libraryItemExtension : null
                )}
                onClick={this.props.onClick}
            >
                <div className={styles.featuredImageContainer}>
                    {this.props.disabled ? (
                        <div className={styles.comingSoonText}>
                            <FormattedMessage
                                defaultMessage="Coming Soon"
                                description="Label for extensions that are not yet implemented"
                                id="gui.extensionLibrary.comingSoon"
                            />
                        </div>
                    ) : null}
                    <img className={styles.featuredImage} loading="lazy" draggable={false} src={this.props.iconURL} />
                </div>
                {this.props.insetIconURL ? (
                    <div
                        className={styles.libraryItemInsetImageContainer}
                        style={{
                            backgroundColor: this.props.insetIconBgColor || '#0fbd8c'
                        }}
                    >
                        <img className={styles.libraryItemInsetImage} src={this.props.insetIconURL} draggable={false} />
                    </div>
                ) : null}
                <div
                    className={
                        typeof this.props.extensionId === 'string'
                            ? classNames(styles.featuredExtensionText, styles.featuredText)
                            : styles.featuredText
                    }
                >
                    <span className={styles.libraryItemName}>{this.props.name}</span>
                    <br />
                    <span className={styles.featuredDescription}>{this.props.description}</span>
                </div>

                {this.props.deprecated && (
                    <div className={[styles.deprecatedWarning, styles.featuredText].join(' ')}>
                        <FormattedMessage
                            defaultMessage="Deprecated: {reason}"
                            description="Warning message for deprecated extensions"
                            id="amp.deprecatedExtension"
                            values={{reason: this.props.deprecated}}
                        />
                    </div>
                )}

                {this.props.bluetoothRequired ||
                this.props.internetConnectionRequired ||
                this.props.requirements ||
                this.props.collaborator ||
                this.props.credits ? (
                    <div className={styles.featuredExtensionMetadata}>
                        <div className={styles.featuredExtensionRequirement}>
                            {this.props.bluetoothRequired ||
                            this.props.internetConnectionRequired ||
                            this.props.requirements ? (
                                <div>
                                    <div>
                                        <FormattedMessage
                                            defaultMessage="Requires"
                                            description="Label for extension hardware requirements"
                                            id="gui.extensionLibrary.requires"
                                        />
                                    </div>
                                    <div className={styles.featuredExtensionMetadataDetail}>
                                        {this.props.bluetoothRequired ||
                                        this.props.requirements?.includes('bluetooth') ? (
                                            <img
                                                src={bluetoothIconURL}
                                                draggable={false}
                                                title={'Bluetooth'}
                                                height={16}
                                                className={styles.requirementsIcon}
                                            />
                                        ) : null}
                                        {this.props.internetConnectionRequired ||
                                        this.props.requirements?.includes('internet') ? (
                                            <img
                                                src={internetConnectionIconURL}
                                                draggable={false}
                                                title={'Internet'}
                                                height={16}
                                                className={styles.requirementsIcon}
                                            />
                                        ) : null}
                                        {this.props.requirements?.includes('nfc') ? (
                                            <img
                                                src={nfcIconURL}
                                                draggable={false}
                                                title={'NFC'}
                                                height={16}
                                                className={styles.requirementsIcon}
                                            />
                                        ) : null}
                                        {this.props.requirements?.includes('packaged') ? (
                                            <img
                                                src={packagedIconURL}
                                                draggable={false}
                                                title={'Packaged project'}
                                                height={16}
                                                className={styles.requirementsIcon}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            ) : (this.props.docsURI || this.props.samples) && (
                                <div className={styles.extensionLinks}>
                                    {this.props.docsURI && (
                                        <a href={this.props.docsURI} className={styles.docsLink} target="_blank" rel="noreferrer">
                                            <FormattedMessage
                                                defaultMessage="Docs"
                                                
                                                description="Appears in the extension list. Links to additional extension documentation."
                                                id="tw.documentation"
                                            />
                                        </a>
                                    )}

                                    {this.props.samples && (
                                        <a href={this.props.samples[0].href} className={styles.sampleLink} target="_blank" rel="noreferrer">
                                            <FormattedMessage
                                                defaultMessage="Sample project"
                                                
                                                description="Appears in the extension list. Links to a sample project for an extension."
                                                id="tw.sample"
                                            />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.featuredExtensionCollaboration}>
                            {this.props.collaborator ? (
                                <div>
                                    <div>
                                        <FormattedMessage
                                            defaultMessage="Collaboration with"
                                            description="Label for extension collaboration"
                                            id="gui.extensionLibrary.collaboration"
                                        />
                                    </div>
                                    <div className={styles.featuredExtensionMetadataDetail}>
                                        {this.props.collaborator}
                                    </div>
                                </div>
                            ) : this.props.credits && this.props.credits.length > 0 && (
                                <div>
                                    <div><FormattedMessage
                                        defaultMessage="Created by:"
                                        description="Appears in the extension list. Followed by a list of names."
                                        id="tw.createdBy"
                                    /></div>
                                    <div className={styles.featuredExtensionMetadataDetail}>
                                    {this.props.credits.map((credit, index) => (
                                        <React.Fragment key={index}>
                                            {credit}
                                            {index !== this.props.credits.length - 1 && ', '}
                                        </React.Fragment>
                                    ))}
                                    </div>
                                </div>
                        )}
                        </div>
                    </div>
                ) : null}

                {favorite}
            </div>
        ) : (
            <Box
                className={classNames(styles.libraryItem, {
                    [styles.hidden]: this.props.hidden
                })}
                role="button"
                tabIndex="0"
                onBlur={this.props.onBlur}
                onClick={this.props.onClick}
                onFocus={this.props.onFocus}
                onKeyPress={this.props.onKeyPress}
                onMouseEnter={this.props.showPlayButton ? null : this.props.onMouseEnter}
                onMouseLeave={this.props.showPlayButton ? null : this.props.onMouseLeave}
            >
                {/* Layers of wrapping is to prevent layout thrashing on animation */}
                <Box className={styles.libraryItemImageContainerWrapper}>
                    <Box
                        className={styles.libraryItemImageContainer}
                        onMouseEnter={this.props.showPlayButton ? this.props.onMouseEnter : null}
                        onMouseLeave={this.props.showPlayButton ? this.props.onMouseLeave : null}
                    >
                        <img
                            className={styles.libraryItemImage}
                            loading="lazy"
                            src={this.props.iconURL}
                            draggable={false}
                        />
                    </Box>
                </Box>
                <span className={styles.libraryItemName}>{this.props.name}</span>
                {this.props.showPlayButton ? (
                    <PlayButton
                        isPlaying={this.props.isPlaying}
                        onPlay={this.props.onPlay}
                        onStop={this.props.onStop}
                    />
                ) : null}

                {favorite}
            </Box>
        );
    }
}
 

LibraryItemComponent.propTypes = {
    intl: intlShape,
    bluetoothRequired: PropTypes.bool,
    collaborator: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    disabled: PropTypes.bool,
    extensionId: PropTypes.string,
    featured: PropTypes.bool,
    hidden: PropTypes.bool,
    iconURL: PropTypes.string,
    insetIconURL: PropTypes.string,
    insetIconBgColor: PropTypes.string,
    internetConnectionRequired: PropTypes.bool,
    requirements: PropTypes.array,
    isPlaying: PropTypes.bool,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    credits: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.node])),
    docsURI: PropTypes.string,
    samples: PropTypes.arrayOf(
        PropTypes.shape({
            href: PropTypes.string,
            text: PropTypes.string
        })
    ),
    favorite: PropTypes.bool,
    onFavorite: PropTypes.func,
    onBlur: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    showPlayButton: PropTypes.bool
};

LibraryItemComponent.defaultProps = {
    disabled: false,
    showPlayButton: false
};

export default LibraryItemComponent;
