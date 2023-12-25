import {themeMap} from '.';

const applyGuiColors = theme => {
    const themeObject = themeMap[theme];

    for (const [name, value] of Object.entries(themeObject.guiColors)) {
        document.documentElement.style.setProperty(`--${name}`, value);
    }

    document.documentElement.style.colorScheme = themeObject.isDark ? 'dark' : 'light';

    window.Recolor = {
        primary: themeObject.guiColors['looks-secondary']
    };
};

export {
    applyGuiColors
};
