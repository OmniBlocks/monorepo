import defaultsDeep from 'lodash.defaultsdeep';
import {defineMessages} from 'react-intl';

import {
    blockColors as darkModeBlockColors,
    extensions as darkModeExtensions
} from './dark';
import {
    blockColors as highContrastBlockColors,
    extensions as highContrastExtensions
} from './high-contrast';
import {blockColors as defaultColors} from './default';

import twLightIcon from './tw/light.svg';
import twDarkIcon from './tw/dark.svg';
import scratchLightIcon from './default/icon.svg';
import scratchDarkIcon from './dark/icon.svg';
import highContrastIcon from './high-contrast/icon.svg';

const TW_LIGHT_THEME = 'tw-light';
const TW_DARK_THEME = 'tw-dark';
const SCRATCH_LIGHT_THEME = 'scratch-light';
const SCRATCH_DARK_THEME = 'scratch-dark';
const HIGH_CONTRAST_THEME = 'high-contrast';

const DEFAULT_THEME = SCRATCH_LIGHT_THEME;

const mergeWithDefaults = colors => defaultsDeep({}, colors, defaultColors);

const messages = defineMessages({
    [TW_LIGHT_THEME]: {
        id: 'tw.theme.twLight',
        defaultMessage: 'Light',
        description: 'Name of our light mode'
    },
    [TW_DARK_THEME]: {
        id: 'tw.theme.twDark',
        defaultMessage: 'Dark',
        description: 'Name of our dark mode'
    },
    [SCRATCH_LIGHT_THEME]: {
        id: 'tw.theme.scratchLight',
        defaultMessage: 'Scratch Light',
        description: 'Name of the light mode used by Scratch'
    },
    [SCRATCH_DARK_THEME]: {
        id: 'tw.theme.scratchDark',
        defaultMessage: 'Scratch Dark',
        description: 'Name of the alternative dark mode developed by Scratch but unused'
    },
    [HIGH_CONTRAST_THEME]: {
        id: 'gui.theme.highContrast',
        defaultMessage: 'High Contrast',
        description: 'label for high theme'
    }
});

const themeMap = {
    [TW_LIGHT_THEME]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: defaultColors,
        extensions: {},
        label: messages[TW_LIGHT_THEME],
        icon: twLightIcon
    },
    [TW_DARK_THEME]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: mergeWithDefaults(darkModeBlockColors),
        extensions: darkModeExtensions,
        label: messages[TW_DARK_THEME],
        icon: twDarkIcon
    },
    [SCRATCH_LIGHT_THEME]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: defaultColors,
        extensions: {},
        label: messages[SCRATCH_LIGHT_THEME],
        icon: scratchLightIcon
    },
    [SCRATCH_DARK_THEME]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: mergeWithDefaults(darkModeBlockColors),
        extensions: darkModeExtensions,
        label: messages[SCRATCH_DARK_THEME],
        icon: scratchDarkIcon
    },
    [HIGH_CONTRAST_THEME]: {
        blocksMediaFolder: 'blocks-media/high-contrast',
        colors: mergeWithDefaults(highContrastBlockColors),
        extensions: highContrastExtensions,
        label: messages[HIGH_CONTRAST_THEME],
        icon: highContrastIcon
    }
};

const getColorsForTheme = theme => {
    const themeInfo = themeMap[theme];

    if (!themeInfo) {
        throw new Error(`Undefined theme ${theme}`);
    }

    return themeInfo.colors;
};

export {
    DEFAULT_THEME,
    TW_LIGHT_THEME,
    TW_DARK_THEME,
    SCRATCH_LIGHT_THEME,
    SCRATCH_DARK_THEME,
    HIGH_CONTRAST_THEME,
    defaultColors,
    getColorsForTheme,
    themeMap
};
