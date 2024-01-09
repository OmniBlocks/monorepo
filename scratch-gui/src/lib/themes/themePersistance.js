import {Theme} from '.';

const matchMedia = query => (window.matchMedia ? window.matchMedia(query) : null);
const PREFERS_HIGH_CONTRAST_QUERY = matchMedia('(prefers-contrast: more)');
const PREFERS_DARK_QUERY = matchMedia('(prefers-color-scheme: dark)');

const STORAGE_KEY = 'tw:theme';

/**
 * @returns {Theme} detected theme
 */
const systemPreferencesTheme = () => {
    if (PREFERS_HIGH_CONTRAST_QUERY && PREFERS_HIGH_CONTRAST_QUERY.matches) {
        return Theme.highContrast;
    }
    if (PREFERS_DARK_QUERY && PREFERS_DARK_QUERY.matches) {
        return Theme.dark;
    }
    return Theme.light;
};

/**
 * @param {function} onChange callback; no guarantees about arguments
 * @returns {function} call to remove event listeners to prevent memory leak
 */
const onSystemPreferenceChange = onChange => {
    if (
        !PREFERS_HIGH_CONTRAST_QUERY ||
        !PREFERS_DARK_QUERY ||
        // Some old browsers don't support addEventListener on media queries
        !PREFERS_HIGH_CONTRAST_QUERY.addEventListener ||
        !PREFERS_DARK_QUERY.addEventListener
    ) {
        return () => {};
    }

    PREFERS_HIGH_CONTRAST_QUERY.addEventListener('change', onChange);
    PREFERS_DARK_QUERY.addEventListener('change', onChange);

    return () => {
        PREFERS_HIGH_CONTRAST_QUERY.removeEventListener('change', onChange);
        PREFERS_DARK_QUERY.removeEventListener('change', onChange);
    };
};

/**
 * @returns {Theme} the theme
 */
const detectTheme = () => {
    try {
        const local = localStorage.getItem(STORAGE_KEY);

        // Migrate legacy preferences
        if (local === 'dark') {
            return Theme.dark;
        }
        if (local === 'light') {
            return Theme.light;
        }

        const parsed = JSON.parse(local);
        // Values are validated by Theme itself
        return new Theme(
            parsed.accent,
            parsed.gui,
            parsed.blocks
        );
    } catch (e) {
        // ignore
    }

    return systemPreferencesTheme();
};

/**
 * @param {Theme} theme the theme
 */
const persistTheme = theme => {
    if (JSON.stringify(theme) === JSON.stringify(systemPreferencesTheme())) {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            // ignore
        }
        return;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch (e) {
        // ignore
    }
};

export {
    onSystemPreferenceChange,
    detectTheme,
    persistTheme
};
