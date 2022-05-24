const optimize = audioEngine => {
    if (!audioEngine.effects) {
        // This is a mock audio engine used by tests
        return;
    }
    audioEngine.effects.forEach(Effect => {
        const originalSet = Effect.prototype._set;
        Effect.prototype._set = function (value) {
            if (this.__value === value) {
                return;
            }
            this.__value = value;
            originalSet.call(this, value);
        };
    });
};

module.exports = optimize;
