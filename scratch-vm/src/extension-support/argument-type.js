/**
 * Block argument types
 * @enum {string}
 */
const ArgumentType = {
    /**
     * Numeric value with angle picker
     */
    ANGLE: 'angle',

    /**
     * Boolean value with hexagonal placeholder
     */
    BOOLEAN: 'Boolean',

    /**
     * Numeric value with color picker
     */
    COLOR: 'color',

    /**
     * Numeric value with text field
     */
    NUMBER: 'number',

    /**
     * String value with text field
     */
    STRING: 'string',

    /**
     * String value with matrix field
     */
    MATRIX: 'matrix',

    /**
     * MIDI note number with note picker (piano) field
     */
    NOTE: 'note',

    /**
     * Inline image on block (as part of the label)
     */
    IMAGE: 'image',

    /**
<<<<<<< HEAD
     * pm: creates an input with n x,y inputs
     */
    POLYGON: 'polygon',

    /**
     * pm: creates an user-defined DOM input
     */
    CUSTOM: 'custom',

    /**
     * Costume menu (taken from tw)
=======
     * Name of costume in the current target
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
     */
    COSTUME: 'costume',

    /**
<<<<<<< HEAD
     * Sound menu (taken from tw)
     */
    SOUND: 'sound',

    /**
     * pm: Variable menu
     * @deprecated Not functioning as intended
     * @todo Fix args returning variable value instead of object
     */
    VARIABLE: 'variable',

    /**
     * pm: List menu
     * @deprecated Not functioning as intended
     * @todo Fix menu resetting on update & args returning "[object Object]" instead of object
     */
    LIST: 'list',

    /**
     * pm: Broadcast menu
     * @deprecated Not functioning as intended
     * @todo Fix menu resetting on update
     */
    BROADCAST: 'broadcast',

    /**
     * pm: Vertical seperator
     */
    SEPERATOR: 'seperator'
};

module.exports = ArgumentType;
=======
     * Name of sound in the current target
     */
    SOUND: 'sound'
};

module.exports = ArgumentType;
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
