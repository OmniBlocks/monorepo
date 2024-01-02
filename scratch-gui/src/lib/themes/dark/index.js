const blockColors = {
    motion: {
        primary: '#0F1E33',
        secondary: '#4C4C4C',
        tertiary: '#4C97FF',
        quaternary: '#4C97FF'
    },
    looks: {
        primary: '#1E1433',
        secondary: '#4C4C4C',
        tertiary: '#9966FF',
        quaternary: '#9966FF'
    },
    sounds: {
        primary: '#291329',
        secondary: '#4C4C4C',
        tertiary: '#CF63CF',
        quaternary: '#CF63CF'
    },
    control: {
        primary: '#332205',
        secondary: '#4C4C4C',
        tertiary: '#FFAB19',
        quaternary: '#FFAB19'
    },
    event: {
        primary: '#332600',
        secondary: '#4C4C4C',
        tertiary: '#FFBF00',
        quaternary: '#FFBF00'
    },
    sensing: {
        primary: '#12232A',
        secondary: '#4C4C4C',
        tertiary: '#5CB1D6',
        quaternary: '#5CB1D6'
    },
    pen: {
        primary: '#03251C',
        secondary: '#4C4C4C',
        tertiary: '#0fBD8C',
        quaternary: '#0fBD8C'
    },
    operators: {
        primary: '#112611',
        secondary: '#4C4C4C',
        tertiary: '#59C059',
        quaternary: '#59C059'
    },
    data: {
        primary: '#331C05',
        secondary: '#4C4C4C',
        tertiary: '#FF8C1A',
        quaternary: '#FF8C1A'
    },
    data_lists: {
        primary: '#331405',
        secondary: '#4C4C4C',
        tertiary: '#FF661A',
        quaternary: '#FF661A'
    },
    more: {
        primary: '#331419',
        secondary: '#4C4C4C',
        tertiary: '#FF6680',
        quaternary: '#FF6680'
    },
    text: 'rgba(255, 255, 255, .7)',
    textFieldText: '#E5E5E5',
    workspace: '#121212',
    toolboxSelected: '#4C4C4C',
    toolboxText: '#E5E5E5',
    toolbox: '#121212',
    flyout: '#121212',
    textField: '#4C4C4C',
    menuHover: 'rgba(255, 255, 255, 0.3)'
};

const extensions = {};

const guiColors = {
    'ui-primary': '#111111',
    'ui-secondary': '#1e1e1e',
    'ui-tertiary': '#2e2e2e',

    'ui-modal-overlay': '#333333aa',
    'ui-modal-background': '#111111',
    'ui-modal-foreground': '#eeeeee',
    'ui-modal-header-background': '#333333',
    'ui-modal-header-foreground': '#ffffff',

    'ui-white': '#1e1e1e',

    'ui-black-transparent': '#ffffff26',

    'text-primary': '#eeeeee',

    'menu-bar-background': '#333333',

    'assets-background': '#111111',

    'input-background': '#1e1e1e',

    'popover-background': '#333333',

    'badge-background': '#16202c',
    'badge-border': '#203652',

    'fullscreen-background': '#111111',
    'fullscreen-accent': '#111111',

    'page-background': '#111111',
    'page-foreground': '#eeeeee',

    'link-color': '#44aaff',

    'filter-icon-black': 'invert(100%)',
    'filter-icon-gray': 'grayscale(100%) brightness(1.7)',
    'filter-icon-white': 'brightness(0) invert(100%)',

    'paint-popover-background': '#333333',
    'paint-filter-icon-gray': 'brightness(1.7)'
};

export {
    blockColors,
    extensions,
    guiColors
};
