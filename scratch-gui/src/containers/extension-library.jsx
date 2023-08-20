import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import log from '../lib/log';

import extensionLibraryContent, {
    galleryError,
    galleryLoading,
    galleryMore
} from '../lib/libraries/extensions/index.jsx';
import extensionTags from '../lib/libraries/tw-extension-tags';

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';
import Separator from '../components/tw-extension-separator/separator.jsx';

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    }
});

const toLibraryItem = extension => ({
    rawURL: extension.iconURL || extensionIcon,
    ...extension
});

let cachedGallery = null;

const fetchLibrary = async () => {
    const res = await fetch('https://extensions.turbowarp.org/generated-metadata/extensions-v0.json');
    if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
    }
    const data = await res.json();
    return data.extensions.map(extension => {
        const allCredits = [
            ...(extension.by || []),
            ...(extension.original || [])
        ];
        return {
            name: extension.name,
            description: extension.description,
            extensionId: extension.id,
            extensionURL: `https://extensions.turbowarp.org/${extension.slug}.js`,
            iconURL: `https://extensions.turbowarp.org/${extension.image || 'images/unknown.svg'}`,
            iconAspectRatio: 2,
            tags: ['tw'],
            credits: allCredits.map(credit => {
                if (credit.link) {
                    return (
                        <a
                            href={credit.link}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {credit.name}
                        </a>
                    );
                }
                return credit.name;
            }),
            incompatibleWithScratch: true,
            featured: true
        };
    });
};

class ExtensionLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
        this.state = {
            gallery: cachedGallery,
            galleryError: null
        };
    }
    componentDidMount () {
        if (!this.state.gallery) {
            fetchLibrary()
                .then(gallery => {
                    cachedGallery = gallery;
                    this.setState({
                        gallery
                    });
                })
                .catch(error => {
                    log.error(error);
                    this.setState({
                        galleryError: error
                    });
                });
        }
    }
    handleItemSelect (item) {
        if (item.href) {
            return;
        }

        const extensionId = item.extensionId;

        // Don't warn about Scratch compatibility before showing modal
        const isCustomURL = !item.disabled && !extensionId;
        if (isCustomURL) {
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
        const library = extensionLibraryContent.map(toLibraryItem);
        library.push(<Separator />);
        if (this.state.gallery) {
            library.push(...this.state.gallery.map(toLibraryItem));
            library.push(toLibraryItem(galleryMore));
        } else if (this.state.galleryError) {
            library.push(toLibraryItem(galleryError));
        } else {
            library.push(toLibraryItem(galleryLoading));
        }

        return (
            <LibraryComponent
                data={library}
                filterable
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
