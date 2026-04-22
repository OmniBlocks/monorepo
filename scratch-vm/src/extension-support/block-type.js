/**
 * Types of block
 * @enum {string}
 */
const BlockType = {
    /**
     * Boolean reporter with hexagonal shape
     */
    BOOLEAN: 'Boolean',

    /**
     * A button (not an actual block) for some special action, like making a variable
     */
    BUTTON: 'button',

    /**
<<<<<<< HEAD
     * A text label (not an actual block) for adding comments or labling blocks 
     */
    LABEL: 'label',


=======
     * A text label (not an actual block) for adding comments or labling blocks
     */
    LABEL: 'label',

>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
    /**
     * Command block
     */
    COMMAND: 'command',

    /**
     * Specialized command block which may or may not run a child branch
     * The thread continues with the next block whether or not a child branch ran.
     */
    CONDITIONAL: 'conditional',

    /**
     * Specialized hat block with no implementation function
     * This stack only runs if the corresponding event is emitted by other code.
     */
    EVENT: 'event',

    /**
     * Hat block which conditionally starts a block stack
     */
    HAT: 'hat',

    /**
     * Specialized command block which may or may not run a child branch
     * If a child branch runs, the thread evaluates the loop block again.
     */
    LOOP: 'loop',

    /**
     * General reporter with numeric or string value
     */
    REPORTER: 'reporter',

    /**
     * Arbitrary scratch-blocks XML.
     */
    XML: 'xml'
};

<<<<<<< HEAD
module.exports = BlockType;
=======
module.exports = BlockType;
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
