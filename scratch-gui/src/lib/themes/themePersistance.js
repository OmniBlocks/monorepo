import {
    TW_LIGHT_THEME,
    TW_DARK_THEME,
    SCRATCH_LIGHT_THEME,
    SCRATCH_DARK_THEME,
    HIGH_CONTRAST_THEME
} from '.';

const PREFERS_HIGH_CONTRAST_QUERY = '(prefers-contrast: more)';
const PREFERS_DARK_QUERY = '(prefers-color-scheme: dark)';
const STORAGE_KEY = 'tw:theme';

const isValidTheme = theme => [
    TW_LIGHT_THEME,
    TW_DARK_THEME,
    SCRATCH_LIGHT_THEME,
    SCRATCH_DARK_THEME,
    HIGH_CONTRAST_THEME
].includes(theme);

const systemPreferencesTheme = () => {
    if (window.matchMedia) {
        if (window.matchMedia(PREFERS_HIGH_CONTRAST_QUERY).matches) {
            return HIGH_CONTRAST_THEME;
        }
        if (window.matchMedia(PREFERS_DARK_QUERY).matches) {
            return TW_DARK_THEME;
        }
    }
    return TW_LIGHT_THEME;
};

const detectTheme = () => {
    try {
        const local = localStorage.getItem(STORAGE_KEY);

        // Migrate legacy preferences
        if (local === 'dark') {
            return TW_DARK_THEME;
        }
        if (local === 'light') {
            return TW_LIGHT_THEME;
        }

        if (isValidTheme(local)) {
            return local;
        }
    } catch (e) {
        // ignore
    }
    return systemPreferencesTheme();
};

const persistTheme = theme => {
    if (!isValidTheme(theme)) {
        throw new Error(`Invalid theme: ${theme}`);
    }
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
        // ignore
    }
};

export {
    detectTheme,
    persistTheme
};
