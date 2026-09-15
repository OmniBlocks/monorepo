import React from 'react';
import PropTypes from 'prop-types';

// slop shim so webpack stops whining because the ancient artifacts from the ancient beings who once roamed the intenret

const ModernIntlContext = React.createContext(null);

export const intlShape = PropTypes.shape({
    formatMessage: PropTypes.func,
    formatHTMLMessage: PropTypes.func,
    formatDate: PropTypes.func,
    formatTime: PropTypes.func,
    formatRelative: PropTypes.func,
    formatNumber: PropTypes.func,
    formatPlural: PropTypes.func
});

/**
 * Creates a lightweight, React 19-compatible intl formatter object
 */
function createIntl(props = {}) {
    const locale = props.locale || 'en';
    const messages = props.messages || {};

    const formatMessage = (descriptor, values) => {
        if (!descriptor) return '';
        const id = typeof descriptor === 'string' ? descriptor : descriptor.id;
        const defaultMsg = (descriptor && descriptor.defaultMessage) || id || '';
        const rawMsg = (messages && messages[id]) || defaultMsg;

        if (!values) return rawMsg;

        // Replace ICU-style template tags like {variable}
        return String(rawMsg).replace(/\{(\w+)\}/g, (match, key) => {
            return values[key] !== undefined && values[key] !== null ? values[key] : match;
        });
    };

    return {
        locale,
        messages,
        formatMessage,
        formatHTMLMessage: formatMessage,
        formatNumber: (val) => (typeof val === 'number' ? val.toLocaleString(locale) : val),
        formatDate: (val) => new Date(val).toLocaleDateString(locale),
        formatTime: (val) => new Date(val).toLocaleTimeString(locale),
        formatRelative: (val) => String(val),
        formatPlural: (val) => String(val),
        now: () => Date.now()
    };
}

// Fallback intl instance for components rendered before or outside <IntlProvider>
const fallbackIntl = createIntl({ locale: 'en', messages: {} });

export class IntlProvider extends React.Component {
    render() {
        const intl = createIntl(this.props);
        return (
            <ModernIntlContext.Provider value={intl}>
                {this.props.children}
            </ModernIntlContext.Provider>
        );
    }
}

export function injectIntl(WrappedComponent, options = {}) {
    const WithIntl = React.forwardRef((props, ref) => {
        const intl = React.useContext(ModernIntlContext) || fallbackIntl;
        return <WrappedComponent {...props} intl={intl} ref={ref} />;
    });
    WithIntl.displayName = `InjectIntl(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    WithIntl.WrappedComponent = WrappedComponent;
    return WithIntl;
}

export function FormattedMessage(props) {
    const intl = React.useContext(ModernIntlContext) || fallbackIntl;
    const id = props.id;
    const defaultMessage = props.defaultMessage || id || '';
    const values = props.values;

    const formatted = intl.formatMessage({ id, defaultMessage }, values);

    if (typeof props.children === 'function') {
        return props.children(formatted);
    }
    return <span>{formatted}</span>;
}

export function FormattedHTMLMessage(props) {
    const intl = React.useContext(ModernIntlContext) || fallbackIntl;
    const formatted = intl.formatMessage({ id: props.id, defaultMessage: props.defaultMessage }, props.values);
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
}

export function FormattedNumber(props) {
    const intl = React.useContext(ModernIntlContext) || fallbackIntl;
    return <span>{intl.formatNumber(props.value)}</span>;
}

export function FormattedDate(props) {
    const intl = React.useContext(ModernIntlContext) || fallbackIntl;
    return <span>{intl.formatDate(props.value)}</span>;
}

export function FormattedTime(props) {
    const intl = React.useContext(ModernIntlContext) || fallbackIntl;
    return <span>{intl.formatTime(props.value)}</span>;
}

export function FormattedRelative(props) {
    const intl = React.useContext(ModernIntlContext) || fallbackIntl;
    return <span>{intl.formatRelative(props.value)}</span>;
}

export function FormattedPlural(props) {
    const intl = React.useContext(ModernIntlContext) || fallbackIntl;
    return <span>{intl.formatPlural(props.value)}</span>;
}

export const addLocaleData = () => {};
export const defineMessages = (msgs) => msgs;

export default {
    IntlProvider,
    injectIntl,
    FormattedMessage,
    FormattedHTMLMessage,
    FormattedNumber,
    FormattedDate,
    FormattedTime,
    FormattedRelative,
    FormattedPlural,
    addLocaleData,
    defineMessages,
    intlShape
};