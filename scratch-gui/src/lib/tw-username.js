const generateRandomUsername = () => {
    const DIGITS = 4;
<<<<<<< HEAD
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
        // Use rejection sampling for unbiased random integer in [0, max)
        const UINT32_MAX = 0xFFFFFFFF;
        const limit = UINT32_MAX - (UINT32_MAX % max);
        let rand;
        do {
            rand = crypto.randomBytes(4).readUInt32BE(0);
        } while (rand >= limit);
        randomNumber = rand % max;
    } else {
        // Fallback to Math.random (not secure - but not recommended)
        randomNumber = Math.floor(Math.random() * max);
    }
=======
    const randomNumber = Math.round(Math.random() * (10 ** DIGITS));
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
    const randomId = randomNumber.toString().padStart(DIGITS, '0');
    const randomUsername = `player${randomId}`;
    return randomUsername;
};

export {
    generateRandomUsername
};
