import {Theme} from '.';

const PREFERS_HIGH_CONTRAST_QUERY = '(prefers-contrast: more)';
const PREFERS_DARK_QUERY = '(prefers-color-scheme: dark)';
const STORAGE_KEY = 'tw:theme';

/**
 * @returns {Theme} detected theme
 */
const systemPreferencesTheme = () => {
    if (window.matchMedia) {
        if (window.matchMedia(PREFERS_HIGH_CONTRAST_QUERY).matches) {
            return Theme.highContrast;
        }
        if (window.matchMedia(PREFERS_DARK_QUERY).matches) {
            return Theme.dark;
        }
    }
    return Theme.light;
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
    detectTheme,
    persistTheme
};
