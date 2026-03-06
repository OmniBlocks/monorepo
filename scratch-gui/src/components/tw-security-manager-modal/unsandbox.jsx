import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {APP_NAME} from '../../lib/brand';

const UnsandboxModal = props => (
    <div>
        <p>
            <FormattedMessage
                defaultMessage="The extension {extensionName} wants to run without the sandbox."
                description="Part of modal shown when an extension asks to run unsandboxed"
                id="tw.unsandbox.title"
                values={{
                    extensionName: props.extensionName
                }}
            />
        </p>
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="Running without the sandbox is dangerous. It can delete your projects, steal credentials, install malware, or perform other harmful actions. Only allow this if you trust the extension author. The {APP_NAME} developers are not responsible for any resulting issues."
                description="Part of modal shown when an extension asks to run unsandboxed"
                // garbomuffin level of fearmongering lol
                // ok sorry garbomuffin it's just that literally all the modals made by garbomuffin are so exaggeratedly dramatic that I can't help but poke fun at it
                id="tw.unsandbox.warning"
                values={{
                    APP_NAME
                }}
            />
        </p>
    </div>
);

UnsandboxModal.propTypes = {
    extensionName: PropTypes.string.isRequired
};

export default UnsandboxModal;
