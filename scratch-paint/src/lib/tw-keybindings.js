import Modes from './modes';

const VECTOR_KEYBINDINGS = {
    v: Modes.SELECT,
    h: Modes.RESHAPE,
    b: Modes.BRUSH,
    e: Modes.ERASER,
    f: Modes.FILL,
    t: Modes.TEXT,
    l: Modes.LINE,
    c: Modes.OVAL,
    r: Modes.RECT
};

const BITMAP_KEYBINDINGS = {
    b: Modes.BIT_BRUSH,
    l: Modes.BIT_LINE,
    c: Modes.BIT_OVAL,
    r: Modes.BIT_RECT,
    t: Modes.BIT_TEXT,
    f: Modes.BIT_FILL,
    e: Modes.BIT_ERASER,
    v: Modes.BIT_SELECT
};

export {
    VECTOR_KEYBINDINGS,
    BITMAP_KEYBINDINGS
};
