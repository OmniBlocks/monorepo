// Perlin and simplex noise for all of us
// MPL 2.0 License

const iconURI =
    "data:image/jpeg;base64,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";

(async () => {
    const module = await Scratch.external.importModule(
        "https://cdn.jsdelivr.net/npm/fastnoise-lite@1.1.1/FastNoiseLite.min.js",
    );

    const FastNoiseLite = module.default;

    const noise = new FastNoiseLite();

    const NOISE_TYPES = Object.values(FastNoiseLite.NoiseType);
    const FRACTAL_TYPES = Object.values(FastNoiseLite.FractalType);

    /** @param {string} type */
    function setNoiseType(type) {
        if (NOISE_TYPES.includes(type)) {
            noise.SetNoiseType(type);
        }
    }

    /** @param {number} seed */
    function setSeed(seed) {
        noise.SetSeed(seed);
    }

    /** @param {number} frequency */
    function setFrequency(frequency) {
        noise.SetFrequency(frequency);
    }

    /** @param {number} octaves */
    function setFractalOctaves(octaves) {
        noise.SetFractalOctaves(octaves);
    }

    function getNoise2D(x, y) {
        return noise.GetNoise(x, y);
    }

    function getNoise3D(x, y, z) {
        return noise.GetNoise(x, y, z);
    }

    class Noise {
        getInfo() {
            return {
                id: "noise",
                name: "Noise",
                blocks: [
                    {
                        opcode: "setNoiseType",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set noise type to [TYPE]",
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "noiseType",
                                defaultValue: "OpenSimplex2",
                            },
                        },
                    },
                    {
                        opcode: "setSeed",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set noise seed to [SEED]",
                        arguments: {
                            SEED: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1337,
                            },
                        },
                    },
                    {
                        opcode: "setFrequency",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set noise frequency to [FREQ]",
                        arguments: {
                            FREQ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.01,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "setFractalType",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set fractal type to [TYPE]",
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "fractalType",
                                defaultValue: "None",
                            },
                        },
                    },
                    {
                        opcode: "setFractalOctaves",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set fractal octaves to [OCTAVES]",
                        arguments: {
                            OCTAVES: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 3,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "noise2D",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "noise at x: [X] y: [Y]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                        },
                    },
                    {
                        opcode: "noise3D",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "noise at x: [X] y: [Y] z: [Z]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                        },
                    },
                ],
                menus: {
                    noiseType: {
                        acceptReporters: true,
                        items: [
                            { text: "OpenSimplex2", value: "OpenSimplex2" },
                            { text: "OpenSimplex2S", value: "OpenSimplex2S" },
                            { text: "Cellular", value: "Cellular" },
                            { text: "Perlin", value: "Perlin" },
                            { text: "Value Cubic", value: "ValueCubic" },
                            { text: "Value", value: "Value" },
                        ],
                    },
                    fractalType: {
                        acceptReporters: true,
                        items: [
                            { text: "None", value: "None" },
                            { text: "FBm", value: "FBm" },
                            { text: "Ridged", value: "Ridged" },
                            { text: "Ping Pong", value: "PingPong" },
                        ],
                    },
                },
            };
        }

        setNoiseType({ TYPE }) {
            setNoiseType(TYPE);
        }

        setSeed({ SEED }) {
            setSeed(SEED);
        }

        setFrequency({ FREQ }) {
            setFrequency(FREQ);
        }

        setFractalOctaves({ OCTAVES }) {
            setFractalOctaves(OCTAVES);
        }

        noise2D({ X, Y }) {
            return getNoise2D(X, Y);
        }

        noise3D({ X, Y, Z }) {
            return getNoise3D(X, Y, Z);
        }
    }

    Scratch.extensions.register(new Noise());
})().catch(console.error);
