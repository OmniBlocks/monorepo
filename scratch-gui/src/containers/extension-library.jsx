import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import {setSearchParams} from '../lib/tw-navigation-utils';

import extensionLibraryContent from '../lib/libraries/extensions/index.jsx';

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    },
    extensionUrl: {
        defaultMessage: 'Enter the URL of the extension',
        description: 'Prompt for unoffical extension url',
        id: 'gui.extensionLibrary.extensionUrl'
    },
    incompatible: {
        // eslint-disable-next-line max-len
        defaultMessage: 'This extension is incompatible with Scratch. Projects made with it cannot be uploaded to the Scratch website. Are you sure you want to enable it?',
        description: 'Confirm loading Scratch-incompatible extension',
        id: 'tw.confirmIncompatibleExtension'
    }
});

export const parseExtensionURL = url => {
    // Parse real extension URL from scratchx.org URL
    const match = url.match(/^https?:\/\/scratchx\.org\/\?url=(.*)$/);
    if (match) {
        return match[1];
    }
    return url;
};

class ExtensionLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
    }
    handleItemSelect (item) {
        // eslint-disable-next-line no-alert
        if (item.incompatibleWithScratch && !confirm(this.props.intl.formatMessage(messages.incompatible))) {
            return;
        }
        const id = item.extensionId;
        let url = item.extensionURL ? item.extensionURL : id;
        const isCustomURL = !item.disabled && !id;
        if (isCustomURL) {
            // eslint-disable-next-line no-alert
            url = prompt(this.props.intl.formatMessage(messages.extensionUrl));
        }
        if (url && !item.disabled) {
            if (this.props.vm.extensionManager.isExtensionLoaded(url)) {
                this.props.onCategorySelected(id);
            } else {
                const parsedURL = isCustomURL ? parseExtensionURL(url) : url;
                this.props.vm.extensionManager.loadExtensionURL(parsedURL)
                    .then(() => {
                        this.props.onCategorySelected(id);
                        if (isCustomURL) {
                            const searchParams = new URLSearchParams(location.search);
                            searchParams.append('extension', url);
                            setSearchParams(searchParams);
                        }
                    })
                    .catch(err => {
                        // eslint-disable-next-line no-alert
                        alert(err);
                    });
            }
        }
    }
    render () {
        const extensionLibraryThumbnailData = extensionLibraryContent.map(extension => ({
            rawURL: extension.iconURL || extensionIcon,
            ...extension
        }));
        return (
            <LibraryComponent
                data={extensionLibraryThumbnailData}
                filterable={false}
                id="extensionLibrary"
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
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired // eslint-disable-line react/no-unused-prop-types
};

export default injectIntl(ExtensionLibrary);
