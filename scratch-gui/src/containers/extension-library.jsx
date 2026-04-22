import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import log from '../lib/log';

import extensionLibraryContent, {
    galleryError,
    galleryLoading,
<<<<<<< HEAD
    galleryMore,
    galleryLoadingOB,
    galleryMoreOB,
    galleryErrorOB
=======
    galleryMore
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
} from '../lib/libraries/extensions/index.jsx';
import extensionTags from '../lib/libraries/tw-extension-tags';

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    }
});

const toLibraryItem = extension => {
    if (typeof extension === 'object') {
        return ({
            rawURL: extension.iconURL || extensionIcon,
            ...extension
        });
    }
    return extension;
};

const translateGalleryItem = (extension, locale) => ({
    ...extension,
    name: extension.nameTranslations[locale] || extension.name,
    description: extension.descriptionTranslations[locale] || extension.description
});

<<<<<<< HEAD
// Timeout constant for gallery loading
const GALLERY_TIMEOUT_MS = 750;

// Common gallery fetcher function to reduce code duplication
let cachedGalleryTW = null;
let cachedGalleryOB = null;

const fetchLibraryTW = async () => {
=======
let cachedGallery = null;

const fetchLibrary = async () => {
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
    const res = await fetch('https://extensions.turbowarp.org/generated-metadata/extensions-v0.json');
    if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
    }
    const data = await res.json();
    return data.extensions.map(extension => ({
        name: extension.name,
        nameTranslations: extension.nameTranslations || {},
        description: extension.description,
        descriptionTranslations: extension.descriptionTranslations || {},
        extensionId: extension.id,
        extensionURL: `https://extensions.turbowarp.org/${extension.slug}.js`,
        iconURL: `https://extensions.turbowarp.org/${extension.image || 'images/unknown.svg'}`,
        tags: ['tw'],
        credits: [
            ...(extension.original || []),
            ...(extension.by || [])
        ].map(credit => {
            if (credit.link) {
                return (
                    <a
                        href={credit.link}
                        target="_blank"
                        rel="noreferrer"
                        key={credit.name}
                    >
                        {credit.name}
                    </a>
                );
            }
            return credit.name;
        }),
        docsURI: extension.docs ? `https://extensions.turbowarp.org/${extension.slug}` : null,
        samples: extension.samples ? extension.samples.map(sample => ({
            href: `${process.env.ROOT}editor?project_url=https://extensions.turbowarp.org/samples/${encodeURIComponent(sample)}.sb3`,
            text: sample
        })) : null,
        incompatibleWithScratch: !extension.scratchCompatible,
        featured: true
    }));
};

<<<<<<< HEAD
const fetchLibraryOB = async () => {
    const res = await fetch('https://omniblocks.github.io/extensions/generated-metadata/extensions-v0.json');
    if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
    }
    const data = await res.json();
    return data.extensions.map(extension => ({
        name: extension.name,
        nameTranslations: extension.nameTranslations || {},
        description: extension.description,
        descriptionTranslations: extension.descriptionTranslations || {},
        extensionId: extension.id,
        extensionURL: `https://omniblocks.github.io/extensions/${extension.slug}.js`,
        iconURL: `https://omniblocks.github.io/extensions/${extension.image || 'images/unknown.svg'}`,
        tags: ['ob'],
        credits: [
            ...(extension.original || []),
            ...(extension.by || [])
        ].map(credit => {
            if (credit.link) {
                return (
                    <a
                        href={credit.link}
                        target="_blank"
                        rel="noreferrer"
                        key={credit.name}
                    >
                        {credit.name}
                    </a>
                );
            }
            return credit.name;
        }),
        docsURI: extension.docs ? `https://omniblocks.github.io/extensions/${extension.slug}` : null,
        samples: extension.samples ? extension.samples.map(sample => ({
            href: `${process.env.ROOT}editor?project_url=https://omniblocks.github.io/extensions/samples/${encodeURIComponent(sample)}.sb3`,
            text: sample
        })) : null,
        incompatibleWithScratch: !extension.scratchCompatible,
        featured: true
    }));
};

// Helper function to handle gallery loading with timeout
const loadGalleryWithTimeout = (fetchFunction, timeoutCallback, successCallback, errorCallback) => {
    let timeoutFired = false;
    const timeout = setTimeout(() => {
        timeoutFired = true;
        timeoutCallback();
    }, GALLERY_TIMEOUT_MS);

    fetchFunction()
        .then(gallery => {
            if (!timeoutFired) {
                successCallback(gallery);
            }
            clearTimeout(timeout);
        })
        .catch(error => {
            if (!timeoutFired) {
                log.error(error);
                errorCallback(error);
            }
            clearTimeout(timeout);
        });
};

=======
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
class ExtensionLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
        this.state = {
<<<<<<< HEAD
            galleryTW: cachedGalleryTW,
            galleryOB: cachedGalleryOB,
            galleryTWError: null,
            galleryOBError: null,
            galleryTWTimedOut: false,
            galleryOBTimedOut: false
        };
    }
    componentDidMount () {
        // Fetch TurboWarp gallery if not cached
        if (!this.state.galleryTW) {
            loadGalleryWithTimeout(
                fetchLibraryTW,
                () => this.setState({galleryTWTimedOut: true}),
                gallery => {
                    cachedGalleryTW = gallery;
                    this.setState({galleryTW: gallery});
                },
                error => this.setState({galleryTWError: error})
            );
        }

        // Fetch OmniBlocks gallery if not cached
        if (!this.state.galleryOB) {
            loadGalleryWithTimeout(
                fetchLibraryOB,
                () => this.setState({galleryOBTimedOut: true}),
                gallery => {
                    cachedGalleryOB = gallery;
                    this.setState({galleryOB: gallery});
                },
                error => this.setState({galleryOBError: error})
            );
=======
            gallery: cachedGallery,
            galleryError: null,
            galleryTimedOut: false
        };
    }
    componentDidMount () {
        if (!this.state.gallery) {
            const timeout = setTimeout(() => {
                this.setState({
                    galleryTimedOut: true
                });
            }, 750);

            fetchLibrary()
                .then(gallery => {
                    cachedGallery = gallery;
                    this.setState({
                        gallery
                    });
                    clearTimeout(timeout);
                })
                .catch(error => {
                    log.error(error);
                    this.setState({
                        galleryError: error
                    });
                    clearTimeout(timeout);
                });
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
        }
    }
    handleItemSelect (item) {
        if (item.href) {
            return;
        }

        const extensionId = item.extensionId;

        if (extensionId === 'custom_extension') {
            this.props.onOpenCustomExtensionModal();
            return;
        }

        if (extensionId === 'procedures_enable_return') {
            this.props.onEnableProcedureReturns();
            this.props.onCategorySelected('myBlocks');
            return;
        }

        const url = item.extensionURL ? item.extensionURL : extensionId;
        if (!item.disabled) {
            if (this.props.vm.extensionManager.isExtensionLoaded(extensionId)) {
                this.props.onCategorySelected(extensionId);
            } else {
                this.props.vm.extensionManager.loadExtensionURL(url)
                    .then(() => {
                        this.props.onCategorySelected(extensionId);
                    })
                    .catch(err => {
                        log.error(err);
                        // eslint-disable-next-line no-alert
                        alert(err);
                    });
            }
        }
    }
    render () {
<<<<<<< HEAD
        const library = extensionLibraryContent.map(toLibraryItem);
        library.push('---');
        
        const locale = this.props.intl.locale;
        
        // Add TurboWarp gallery items
        if (this.state.galleryTW) {
            library.push(toLibraryItem(galleryMore));
            library.push(
                ...this.state.galleryTW
                    .map(i => translateGalleryItem(i, locale))
                    .map(toLibraryItem)
            );
        } else if (this.state.galleryTWError) {
            library.push(toLibraryItem(galleryError));
        } else if (this.state.galleryTWTimedOut) {
            library.push(toLibraryItem(galleryLoading));
        }
        
        // Add separator between galleries
        library.push('---');
        
        // Add OmniBlocks gallery items
        if (this.state.galleryOB) {
            library.push(toLibraryItem(galleryMoreOB));
            library.push(
                ...this.state.galleryOB
                    .map(i => translateGalleryItem(i, locale))
                    .map(toLibraryItem)
            );
        } else if (this.state.galleryOBError) {
            library.push(toLibraryItem(galleryErrorOB));
        } else if (this.state.galleryOBTimedOut) {
            library.push(toLibraryItem(galleryLoadingOB));
=======
        let library = null;
        if (this.state.gallery || this.state.galleryError || this.state.galleryTimedOut) {
            library = extensionLibraryContent.map(toLibraryItem);
            library.push('---');
            if (this.state.gallery) {
                library.push(toLibraryItem(galleryMore));
                const locale = this.props.intl.locale;
                library.push(
                    ...this.state.gallery
                        .filter(i => i.extensionId !== 'faceSensing')
                        .map(i => translateGalleryItem(i, locale))
                        .map(toLibraryItem)
                );
            } else if (this.state.galleryError) {
                library.push(toLibraryItem(galleryError));
            } else {
                library.push(toLibraryItem(galleryLoading));
            }
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
        }

        return (
            <LibraryComponent
                data={library}
                filterable
                persistableKey="extensionId"
                id="extensionLibrary"
                tags={extensionTags}
                title={this.props.intl.formatMessage(messages.extensionTitle)}
                visible={this.props.visible}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

ExtensionLibrary.propTypes = {
    intl: intlShape.isRequired,
    onCategorySelected: PropTypes.func,
    onEnableProcedureReturns: PropTypes.func,
    onOpenCustomExtensionModal: PropTypes.func,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired // eslint-disable-line react/no-unused-prop-types
};

export default injectIntl(ExtensionLibrary);
