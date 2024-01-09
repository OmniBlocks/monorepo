import {Theme} from '.';
import AddonHooks from '../../addons/hooks';

/**
 * @param {Theme} theme
 */
const applyGuiColors = theme => {
    const doc = document.documentElement;

    const defaultColors = Theme.light().getGuiColors();
    for (const [name, value] of Object.entries(defaultColors)) {
        doc.style.setProperty(`--${name}-default`, value);
    }

    const colors = theme.getGuiColors();
    for (const [name, value] of Object.entries(colors)) {
        doc.style.setProperty(`--${name}`, value);
    }

    // a horrible hack
    window.Recolor = {
        primary: colors['looks-secondary']
    };
    AddonHooks.recolorCallbacks.forEach(i => i());
};

export {
    applyGuiColors
};
