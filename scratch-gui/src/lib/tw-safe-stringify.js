const circularReplacer = () => {
    const seen = new WeakSet();
    return (_, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return Array.isArray(value) ? '[...]' : '{...}';
            }
            seen.add(value);
        }
        return value;
    };
};

/**
 * Safely stringify, properly handling circular relations.
 * @param {unknown} input Any value
 * @returns {string} A stringified version of the input.
 */
export const safeStringify = input => {
    if (typeof input === 'object' && input !== null) {
        return JSON.stringify(input, circularReplacer());
    }
    return `${input}`;
};
