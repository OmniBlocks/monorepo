import OpcodeLabels from './opcode-labels.js';
<<<<<<< HEAD
=======
import {safeStringify} from './tw-safe-stringify.js';
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571

const isUndefined = a => typeof a === 'undefined';

/**
 * Convert monitors from VM format to what the GUI needs to render.
 * - Convert opcode to a label and a category
 * @param {string} block.id - The id of the monitor block
 * @param {string} block.spriteName - Present only if the monitor applies only to the sprite
 *     with given target ID. The name of the target sprite when the monitor was created
 * @param {string} block.opcode - The opcode of the monitor
 * @param {object} block.params - Extra params to the monitor block
 * @param {string|number|Array} block.value - The monitor value
 * @param {VirtualMachine} block.vm - the VM instance which owns the block
 * @return {object} The adapted monitor with label and category
 */
<<<<<<< HEAD
export default function ({id, spriteName, opcode, params, value, vm}) {
=======
export default function ({id, mode, spriteName, opcode, params, value, vm}) {
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
    // Extension monitors get their labels from the Runtime through `getLabelForOpcode`.
    // Other monitors' labels are hard-coded in `OpcodeLabels`.
    let {label, category, labelFn} = (vm && vm.runtime.getLabelForOpcode(opcode)) || OpcodeLabels.getLabel(opcode);

    // Use labelFn if provided for dynamic labelling (e.g. variables)
    if (!isUndefined(labelFn)) label = labelFn(params);

    // Append sprite name for sprite-specific monitors
    if (spriteName) {
        label = `${spriteName}: ${label}`;
    }

<<<<<<< HEAD
    // If value is a number, round it to six decimal places
    if (typeof value === 'number') {
        value = Number(value.toFixed(6));
    }

    // Turn the value to a string, for handle boolean values
    if (typeof value === 'boolean') {
        value = value.toString();
    }

    // Lists can contain booleans, which should also be turned to strings
    if (Array.isArray(value)) {
        value = value.slice();
        for (let i = 0; i < value.length; i++) {
            const item = value[i];
            if (typeof item === 'boolean') {
                value[i] = item.toString();
            }
        }
=======
    // If value is a normal, round it to six decimal places. -0 is handled in safeStringify, so don't break it here.
    if (typeof value === 'number' && !Object.is(value, -0)) {
        value = Number(value.toFixed(6));
    }

    // Convert scalars to a string now. That should help avoid unnecessary re-renders in a few edge cases.
    // For lists, we stringify when we display the list row instead of doing a full list copy on every change.
    if (mode !== 'list') {
        value = safeStringify(value);
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
    }

    return {id, label, category, value};
}
