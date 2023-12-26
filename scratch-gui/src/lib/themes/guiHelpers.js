import {themeMap} from '.';

const applyGuiColors = theme => {
    const doc = document.documentElement;
    const themeObject = themeMap[theme];

    for (const [name, value] of Object.entries(themeObject.guiColors)) {
        doc.style.setProperty(`--${name}`, value);
    }

    doc.style.setProperty('--paint-ui-pane-border', 'var(--ui-black-transparent)');
    doc.style.setProperty('--paint-text-primary', 'var(--text-primary)');
    doc.style.setProperty('--paint-form-border', 'var(--ui-black-transparent)');
    doc.style.setProperty('--paint-looks-secondary', 'var(--looks-secondary)');
    doc.style.setProperty('--paint-looks-transparent', 'var(--looks-transparent)');

    doc.style.colorScheme = themeObject.isDark ? 'dark' : 'light';

    window.Recolor = {
        primary: themeObject.guiColors['looks-secondary']
    };
};

export {
    applyGuiColors
};
