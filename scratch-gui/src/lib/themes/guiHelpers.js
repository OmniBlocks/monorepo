import {themeMap} from '.';

const applyGuiColors = theme => {
    const doc = document.documentElement;
    const themeObject = themeMap[theme];

    for (const [name, value] of Object.entries(themeObject.guiColors)) {
        doc.style.setProperty(`--${name}`, value);
    }

    doc.style.colorScheme = themeObject.isDark ? 'dark' : 'light';

    window.Recolor = {
        primary: themeObject.guiColors['looks-secondary']
    };
};

export {
    applyGuiColors
};
