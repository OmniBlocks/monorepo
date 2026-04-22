const circularReplacer = () => {
<<<<<<< HEAD
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

const sanitize = (input) => {
  if (typeof input === "object" && input !== null) {
    return JSON.stringify(input, circularReplacer());
  } else {
    return input;
  }
};

const sanitizeVariableType = (input, type) => {
  if (type === "list") {
    return input.map(item => sanitize(item));
  } else {
    return sanitize(input);
  }
};

export { sanitizeVariableType };
=======
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
 * Safely stringify, properly handling circular relations and -0.
 * @param {unknown} input Any value
 * @returns {string} A stringified version of the input.
 */
export const safeStringify = input => {
    if (typeof input === 'object' && input !== null) {
        // TODO: this will not handle -0 inside the input properly, though that is very low priority.
        return JSON.stringify(input, circularReplacer());
    }
    // -0 stringifies as "0" by default.
    if (Object.is(input, -0)) {
        return '-0';
    }
    return `${input}`;
};
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
