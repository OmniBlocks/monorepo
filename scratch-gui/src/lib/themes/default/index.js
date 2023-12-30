const blockColors = {
    motion: {
        primary: '#4C97FF',
        secondary: '#4280D7',
        tertiary: '#3373CC',
        quaternary: '#3373CC'
    },
    looks: {
        primary: '#9966FF',
        secondary: '#855CD6',
        tertiary: '#774DCB',
        quaternary: '#774DCB'
    },
    sounds: {
        primary: '#CF63CF',
        secondary: '#C94FC9',
        tertiary: '#BD42BD',
        quaternary: '#BD42BD'
    },
    control: {
        primary: '#FFAB19',
        secondary: '#EC9C13',
        tertiary: '#CF8B17',
        quaternary: '#CF8B17'
    },
    event: {
        primary: '#FFBF00',
        secondary: '#E6AC00',
        tertiary: '#CC9900',
        quaternary: '#CC9900'
    },
    sensing: {
        primary: '#5CB1D6',
        secondary: '#47A8D1',
        tertiary: '#2E8EB8',
        quaternary: '#2E8EB8'
    },
    pen: {
        primary: '#0fBD8C',
        secondary: '#0DA57A',
        tertiary: '#0B8E69',
        quaternary: '#0B8E69'
    },
    operators: {
        primary: '#59C059',
        secondary: '#46B946',
        tertiary: '#389438',
        quaternary: '#389438'
    },
    data: {
        primary: '#FF8C1A',
        secondary: '#FF8000',
        tertiary: '#DB6E00',
        quaternary: '#DB6E00'
    },
    // This is not a new category, but rather for differentiation
    // between lists and scalar variables.
    data_lists: {
        primary: '#FF661A',
        secondary: '#FF5500',
        tertiary: '#E64D00',
        quaternary: '#E64D00'
    },
    more: {
        primary: '#FF6680',
        secondary: '#FF4D6A',
        tertiary: '#FF3355',
        quaternary: '#FF3355'
    },
    text: '#FFFFFF',
    workspace: '#F9F9F9',
    toolboxHover: '#4C97FF',
    toolboxSelected: '#E9EEF2',
    toolboxText: '#575E75',
    toolbox: '#FFFFFF',
    flyout: '#F9F9F9',
    scrollbar: '#CECDCE',
    scrollbarHover: '#CECDCE',
    textField: '#FFFFFF',
    textFieldText: '#575E75',
    insertionMarker: '#000000',
    insertionMarkerOpacity: 0.2,
    dragShadowOpacity: 0.6,
    stackGlow: '#FFF200',
    stackGlowSize: 4,
    stackGlowOpacity: 1,
    replacementGlow: '#FFFFFF',
    replacementGlowSize: 2,
    replacementGlowOpacity: 1,
    colourPickerStroke: '#FFFFFF',
    // CSS colours: support RGBA
    fieldShadow: 'rgba(255, 255, 255, 0.3)',
    dropDownShadow: 'rgba(0, 0, 0, .3)',
    numPadBackground: '#547AB2',
    numPadBorder: '#435F91',
    numPadActiveBackground: '#435F91',
    numPadText: 'white', // Do not use hex here, it cannot be inlined with data-uri SVG
    valueReportBackground: '#FFFFFF',
    valueReportBorder: '#AAAAAA',
    valueReportForeground: '#000000',
    menuHover: 'rgba(0, 0, 0, 0.2)',
    contextMenuBackground: '#ffffff',
    contextMenuBorder: '#cccccc',
    contextMenuForeground: '#000000',
    contextMenuActiveBackground: '#d6e9f8',
    contextMenuDisabledForeground: '#cccccc',
    flyoutLabelColor: '#575E75',
    checkboxInactiveBackground: '#ffffff',
    checkboxInactiveBorder: '#c8c8c8',
    checkboxActiveBackground: '#4C97FF',
    checkboxActiveBorder: '#3373CC',
    checkboxCheck: '#ffffff',
    buttonBorder: '#c6c6c6',
    buttonActiveBackground: '#ffffff',
    buttonForeground: '#575E75',
    gridColor: '#dddddd'
};

const guiColors = {
    'ui-primary': 'hsla(215, 100%, 95%, 1)', /* #E5F0FF */
    'ui-secondary': 'hsla(215, 75%, 95%, 1)', /* #E9F1FC */
    'ui-tertiary': 'hsla(215, 50%, 90%, 1)', /* #D9E3F2 */

    'ui-modal-overlay': 'hsla(215, 100%, 65%, 0.9)', /* 90% transparent version of motion-primary */
    'ui-modal-background': 'hsla(0, 100%, 100%, 1)', /* #FFFFFF */
    'ui-modal-foreground': 'hsla(225, 15%, 40%, 1)', /* #575E75 */
    'ui-modal-header-background': 'hsla(260, 60%, 60%, 1)', /* #855CD6 */
    'ui-modal-header-foreground': 'hsla(0, 100%, 100%, 1)', /* #FFFFFF */

    'ui-white': 'hsla(0, 100%, 100%, 1)', /* #FFFFFF */
    'ui-white-dim': 'hsla(0, 100%, 100%, 0.75)', /* 25% transparent version of ui-white */
    'ui-white-transparent': 'hsla(0, 100%, 100%, 0.25)', /* 25% transparent version of ui-white */
    'ui-transparent': 'hsla(0, 100%, 100%, 0)', /* 25% transparent version of ui-white */

    'ui-black-transparent': 'hsla(0, 0%, 0%, 0.15)', /* 15% transparent version of black */

    'text-primary': 'hsla(225, 15%, 40%, 1)', /* #575E75 */
    'text-primary-transparent': 'hsla(225, 15%, 40%, 0.75)',

    'motion-primary': 'hsla(215, 100%, 65%, 1)', /* #4C97FF */
    'motion-tertiary': 'hsla(215, 60%, 50%, 1)', /* #3373CC */

    'looks-secondary': 'hsla(260, 60%, 60%, 1)', /* #855CD6 */
    'looks-transparent': 'hsla(260, 60%, 60%, 0.35)', /* 35% transparent version of looks-tertiary */
    'looks-light-transparent': 'hsla(260, 60%, 60%, 0.15)', /* 15% transparent version of looks-tertiary */
    'looks-secondary-dark': 'hsla(260, 42%, 51%, 1)', /* #714EB6 */

    'red-primary': 'hsla(20, 100%, 55%, 1)', /* #FF661A */
    'red-tertiary': 'hsla(20, 100%, 45%, 1)', /* #E64D00 */

    'sound-primary': 'hsla(300, 53%, 60%, 1)', /* #CF63CF */
    'sound-tertiary': 'hsla(300, 48%, 50%, 1)', /* #BD42BD */

    'control-primary': 'hsla(38, 100%, 55%, 1)', /* #FFAB19 */

    'data-primary': 'hsla(30, 100%, 55%, 1)', /* #FF8C1A */

    'pen-primary': 'hsla(163, 85%, 40%, 1)', /* #0FBD8C */
    'pen-transparent': 'hsla(163, 85%, 40%, 0.25)', /* #0FBD8C */
    'pen-tertiary': 'hsla(163, 86%, 30%, 1)', /* #0B8E69 */

    'error-primary': 'hsla(30, 100%, 55%, 1)', /* #FF8C1A */
    'error-light': 'hsla(30, 100%, 70%, 1)', /* #FFB366 */
    'error-transparent': 'hsla(30, 100%, 55%, 0.25)', /* #FF8C1A */

    'extensions-primary': 'hsla(163, 85%, 40%, 1)', /* #0FBD8C */
    'extensions-tertiary': 'hsla(163, 85%, 30%, 1)', /* #0B8E69 */
    'extensions-transparent': 'hsla(163, 85%, 40%, 0.35)', /* 35% transparent version of extensions-primary */
    'extensions-light': 'hsla(163, 57%, 85%, 1)', /* opaque version of extensions-transparent, on white bg */

    'drop-highlight': 'hsla(215, 100%, 77%, 1)', /* lighter than motion-primary */

    'menu-bar-background': 'hsla(260, 60%, 60%, 1)', /* #855CD6 */
    'menu-bar-foreground': '#ffffff',

    'assets-background': '#ffffff',

    'input-background': '#ffffff',

    'popover-background': '#ffffff',

    'badge-background': '#dbebff',
    'badge-border': '#b9d6ff',

    'fullscreen-background': '#ffffff',
    'fullscreen-accent': '#e8edf1',

    'page-background': '#ffffff',
    'page-foreground': '#000000',

    'link-color': '#2255dd',

    'filter-icon-black': 'none',

    'paint-ui-pane-border': 'var(--ui-black-transparent)',
    'paint-text-primary': 'var(--text-primary)',
    'paint-form-border': 'var(--ui-black-transparent)',
    'paint-looks-secondary': 'var(--looks-secondary)',
    'paint-looks-transparent': 'var(--looks-transparent)',
    'paint-input-background': 'var(--input-background)',
    'paint-popover-background': '#ffffff',
    'paint-filter-icon-gray': 'none'
};

export {
    blockColors,
    guiColors
};
