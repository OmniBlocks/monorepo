const generateRandomUsername = () => {
    const DIGITS = 4;
    // Generate a cryptographically secure random number in [0, 10^DIGITS)
    let max = 10 ** DIGITS;
    let randomNumber;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        // Get a random 32-bit value and reduce modulo max for unbiased range
        let randArr = new Uint32Array(1);
        window.crypto.getRandomValues(randArr);
        randomNumber = randArr[0] % max;
    } else if (typeof require === 'function') {
        // NodeJS fallback
        const crypto = require('crypto');
        // Generate enough bytes for a secure random integer
        // 4 bytes: up to 32 bits
        randomNumber = crypto.randomBytes(4).readUInt32BE(0) % max;
    } else {
        // Fallback to Math.random (not secure - but not recommended)
        randomNumber = Math.floor(Math.random() * max);
    }
    const randomId = randomNumber.toString().padStart(DIGITS, '0');
    const randomUsername = `player${randomId}`;
    return randomUsername;
};

export {
    generateRandomUsername
};
