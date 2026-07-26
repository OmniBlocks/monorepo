const { rspack } = require('@rspack/core');
const defaultsDeep = require('lodash.defaultsdeep');
const path = require('path');

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    bail: true,
    devServer: {
        static: false,
        host: '0.0.0.0',
        port: process.env.PORT || 8073
    },
    devtool: 'cheap-module-source-map',
    output: {
        library: 'VirtualMachine',
        filename: '[name].js'
    },
    resolve: {
        fallback: {
            buffer: require.resolve('buffer/')
        }
    },
    resolveLoader: {
        alias: {
            'worker-loader': 'worker-rspack-loader'
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'builtin:swc-loader',
            include: path.resolve(__dirname, 'src'),
            options: {
                jsc: {
                    parser: {
                        syntax: 'ecmascript'
                    }
                },
                env: {}
            }
        },
        {
            test: /\.mp3$/,
            type: 'asset/resource',
            generator: {
                filename: 'media/music/[hash][ext]'
            }
        }]
    },
    plugins: [
// alias
        new rspack.DefinePlugin({
            global: 'globalThis'
        })
    ]
};

// Dependencies of index.js that are hard to bundle
const nodeExternals = {
    'decode-html': true,
    'format-message': true,
    'htmlparser2': true,
    'scratch-parser': true,
    'socket.io-client': true,
    'text-encoding': true
};

module.exports = [
    // Web-compatible
    defaultsDeep({}, base, {
        target: 'web',
        entry: {
            'scratch-vm': './src/index.js',
            'scratch-vm.min': './src/index.js'
        },
        output: {
            libraryTarget: 'umd',
            path: path.resolve('dist', 'web')
        },
        module: {
            rules: base.module.rules.concat([
                {
                    test: require.resolve('./src/index.js'),
                    loader: 'expose-loader',
                    options: {
                        exposes: ['VirtualMachine']
                    }
                }
            ])
        }
    }),
    // Node-compatible
    defaultsDeep({}, base, {
        target: 'node',
        entry: {
            'scratch-vm': './src/index.js'
        },
        output: {
            libraryTarget: 'commonjs2',
            path: path.resolve('dist', 'node')
        },
        // it must be set explicitly here.
        externalsType: 'commonjs2',
        externals: nodeExternals
    }),
    // Server
    defaultsDeep({}, base, {
        target: 'node',
        entry: {
            cli: './src/server/cli.js'
        },
        output: {
            library: undefined,
            libraryTarget: 'commonjs2',
            path: path.resolve('dist', 'server')
        },
        externalsType: 'commonjs2',
        externals: Object.assign({}, nodeExternals, {
            // keep it external.
            jsdom: true,
            'scratch-storage': true
        }),
        plugins: base.plugins.concat([
            new rspack.BannerPlugin({
                banner: '#!/usr/bin/env node',
                raw: true,
                entryOnly: true
            })
        ])
    }),
    // Playground
    defaultsDeep({}, base, {
        target: 'web',
        entry: {
            'benchmark': './src/playground/benchmark',
            'video-sensing-extension-debug': './src/extensions/scratch3_video_sensing/debug'
        },
        output: {
            path: path.resolve(__dirname, 'playground'),
            filename: '[name].js'
        },
        module: {
            rules: base.module.rules.concat([
                {
                    test: require.resolve('./src/index.js'),
                    loader: 'expose-loader',
                    options: {
                        exposes: ['VirtualMachine']
                    }
                },
                {
                    test: require.resolve('./src/extensions/scratch3_video_sensing/debug.js'),
                    loader: 'expose-loader',
                    options: {
                        exposes: ['Scratch3VideoSensingDebug']
                    }
                },
                {
                    test: require.resolve('stats.js/build/stats.min.js'),
                    loader: 'script-loader'
                },
                {
                    test: require.resolve('scratch-blocks/dist/vertical.js'),
                    loader: 'expose-loader',
                    options: {
                        exposes: ['Blockly']
                    }
                },
                {
                    test: require.resolve('scratch-audio/src/index.js'),
                    loader: 'expose-loader',
                    options: {
                        exposes: ['AudioEngine']
                    }
                },
                {
                    test: require.resolve('scratch-storage/src/index.js'),
                    loader: 'expose-loader',
                    options: {
                        exposes: ['ScratchStorage']
                    }
                },
                {
                    test: require.resolve('scratch-render/src/index.js'),
                    loader: 'expose-loader',
                    options: {
                        exposes: ['ScratchRender']
                    }
                }
            ])
        },
        performance: {
            hints: false
        },
        plugins: base.plugins.concat([
            new rspack.CopyRspackPlugin({
                patterns: [{
                    from: 'node_modules/scratch-blocks/media',
                    to: 'media'
                }, {
                    from: 'node_modules/scratch-storage/dist/web',
                    to: '.'
                }, {
                    from: 'node_modules/scratch-render/dist/web',
                    to: '.'
                }, {
                    from: path.join(
                        path.dirname(require.resolve('@turbowarp/scratch-svg-renderer/package.json')),
                        'dist',
                        'web'
                    ),
                    to: '.'
                }, {
                    from: 'src/playground',
                    to: '.'
                }]
            })
        ])
    })
];
