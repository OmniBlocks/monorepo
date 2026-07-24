const defaultsDeep = require("lodash.defaultsdeep");
const path = require("path");
const { rspack } = require("@rspack/core");

// Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");

// PostCss
const autoprefixer = require("autoprefixer");
const postcssVars = require("postcss-simple-vars");
const postcssImport = require("postcss-import");

const STATIC_PATH = process.env.STATIC_PATH || "/static";
const { APP_NAME } = require("./src/lib/brand");
const { version } = require("./package.json");

const root = process.env.ROOT || "";
if (root.length > 0 && !root.endsWith("/")) {
    throw new Error("If ROOT is defined, it must have a trailing slash.");
}

const htmlWebpackPluginCommon = {
    root: root,
    meta: JSON.parse(process.env.EXTRA_META || "{}"),
    APP_NAME,
};

// bypass any HTTP caches
const CACHE_EPOCH = "pentapod";

// fetched at runtime
const IFRAME_EXTENSION_WORKER_ENTRY_NAME = "tw-iframe-extension-worker-entry";
const IFRAME_EXTENSION_WORKER_ENTRY_PATH = path.resolve(
    __dirname,
    "node_modules/scratch-vm/src/extension-support/tw-iframe-extension-worker-entry.js",
);

// Keep in sync with .browserslistrc.
const BROWSERSLIST_TARGETS = [
    "chrome >= 102",
    "chromeandroid >= 70",
    "ios >= 12",
    "safari >= 12",
    "edge >= 18",
    "firefox >= 68",
];

const base = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    devtool:
        process.env.SOURCEMAP ||
        (process.env.NODE_ENV === "production"
            ? false
            : "cheap-module-source-map"),
    devServer: {
        static: {
            directory: path.resolve(__dirname, "build"),
        },
        host: "0.0.0.0",
        allowedHosts: "all",
        compress: true,
        port: process.env.PORT || 8601,
        headers: {
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin",
        },
        // allows ROUTING_STYLE=wildcard to work properly
        historyApiFallback: {
            rewrites: [
                { from: /^\/\d+\/?$/, to: "/index.html" },
                { from: /^\/\d+\/fullscreen\/?$/, to: "/fullscreen.html" },
                { from: /^\/\d+\/editor\/?$/, to: "/editor.html" },
                { from: /^\/\d+\/embed\/?$/, to: "/embed.html" },
                { from: /^\/addons\/?$/, to: "/addons.html" },
            ],
        },
        hot: true,
    },
    output: {
        library: "GUI",
        filename: (pathData) =>
            pathData.chunk.name === IFRAME_EXTENSION_WORKER_ENTRY_NAME
                ? `js/${IFRAME_EXTENSION_WORKER_ENTRY_NAME}.js`
                : process.env.NODE_ENV === "production"
                  ? `js/${CACHE_EPOCH}/[name].[contenthash].js`
                  : "js/[name].js",
        chunkFilename:
            process.env.NODE_ENV === "production"
                ? `js/${CACHE_EPOCH}/[name].[contenthash].js`
                : "js/[name].js",
        publicPath: root,
    },
    resolve: {
        symlinks: false,
        alias: {
            "text-encoding$": path.resolve(
                __dirname,
                "src/lib/tw-text-encoder",
            ),
            "scratch-render-fonts$": path.resolve(
                __dirname,
                "src/lib/tw-scratch-render-fonts",
            ),
        },
        // empty shim is fine.
        fallback: {
            crypto: false,
        },
    },
    resolveLoader: {
        alias: {
            // See scripts/stub-worker-loader.js for why this is stubbed out.
            "worker-loader": path.resolve(
                __dirname,
                "scripts/stub-worker-loader.js",
            ),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "builtin:swc-loader",
                include: [
                    path.resolve(__dirname, "src"),
                    /node_modules[\\/]scratch-[^\\/]+[\\/]src/,
                    /node_modules[\\/]pify/,
                    /node_modules[\\/]@vernier[\\/]godirect/,
                    /node_modules[\\/]vscode-jsonrpc/,
                    /node_modules[\\/]vscode-languageserver-protocol/,
                    /node_modules[\\/]vscode-languageserver-types/,
                ],
                options: {
                    jsc: {
                        parser: {
                            syntax: "ecmascript",
                            jsx: true,
                        },
                        transform: {
                            react: {
                                runtime: "classic",
                            },
                        },
                    },
                    env: {
                        targets: BROWSERSLIST_TARGETS,
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                namedExport: false,
                                localIdentName:
                                    "[name]_[local]_[hash:base64:5]",
                                exportLocalsConvention: "camelCase",
                            },
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    postcssImport,
                                    postcssVars,
                                    autoprefixer,
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new rspack.CopyRspackPlugin({
            patterns: [
                {
                    from: "node_modules/scratch-blocks/media",
                    to: "static/blocks-media/default",
                },
                {
                    from: "node_modules/scratch-blocks/media",
                    to: "static/blocks-media/high-contrast",
                },
                {
                    from: "src/lib/themes/blocks/high-contrast-media/blocks-media",
                    to: "static/blocks-media/high-contrast",
                    force: true,
                },
            ],
        }),
        // See python-tab.jsx.
        new rspack.CopyRspackPlugin({
            patterns: [
                {
                    from: "node_modules/monaco-editor/min/vs",
                    to: "static/vs",
                },
                {
                    from: "node_modules/browser-basedpyright/dist",
                    to: "static/pyright",
                },
            ],
        }),
    ],
};

if (!process.env.CI) {
    base.plugins.push(new rspack.ProgressPlugin());
    base.plugins.push(new rspack.HotModuleReplacementPlugin());
}

module.exports = [
    // to run editor examples
    defaultsDeep({}, base, {
        entry: {
            editor: "./src/playground/editor.jsx",
            player: "./src/playground/player.jsx",
            fullscreen: "./src/playground/fullscreen.jsx",
            embed: "./src/playground/embed.jsx",
            "addon-settings": "./src/playground/addon-settings.jsx",
            [IFRAME_EXTENSION_WORKER_ENTRY_NAME]:
                IFRAME_EXTENSION_WORKER_ENTRY_PATH,
        },
        output: {
            path: path.resolve(__dirname, "build"),
        },
        module: {
            rules: base.module.rules.concat([
                {
                    test: /\.(svg|png|wav|mp3|gif|jpg|woff2|hex)$/,
                    loader: "url-loader",
                    options: {
                        limit: 2048,
                        outputPath: "static/assets/",
                        esModule: false,
                    },
                },
            ]),
        },
        optimization: {
            splitChunks: {
                // Exclude the iframe worker entry: it's fetched and executed standalone
                // with no bundler runtime available to load a separate shared chunk.
                chunks: (chunk) =>
                    chunk.name !== IFRAME_EXTENSION_WORKER_ENTRY_NAME,
                minChunks: 2,
                minSize: 50000,
                maxInitialRequests: 5,
            },
        },
        plugins: base.plugins.concat([
            new rspack.DefinePlugin({
                "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
                "process.env.DEBUG": Boolean(process.env.DEBUG),
                "process.env.ENABLE_SERVICE_WORKER": JSON.stringify(
                    process.env.ENABLE_SERVICE_WORKER || "",
                ),
                "process.env.ROOT": JSON.stringify(root),
                "process.env.ROUTING_STYLE": JSON.stringify(
                    process.env.ROUTING_STYLE || "filehash",
                ),
                "process.env.APP_VERSION": JSON.stringify(version || ""),
            }),
            new HtmlWebpackPlugin({
                chunks: ["editor"],
                template: "src/playground/index.ejs",
                filename: "editor.html",
                title: `${APP_NAME} - The Ultimate MultiLanguage IDE | Editor`,
                isEditor: true,
                ...htmlWebpackPluginCommon,
            }),
            new HtmlWebpackPlugin({
                chunks: ["player"],
                template: "src/playground/index.ejs",
                filename: "index.html",
                title: `${APP_NAME} - The Ultimate MultiLanguage IDE`,
                ...htmlWebpackPluginCommon,
            }),
            new HtmlWebpackPlugin({
                chunks: ["fullscreen"],
                template: "src/playground/index.ejs",
                filename: "fullscreen.html",
                title: `${APP_NAME} - The Ultimate MultiLanguage IDE`,
                ...htmlWebpackPluginCommon,
            }),
            new HtmlWebpackPlugin({
                chunks: ["embed"],
                template: "src/playground/embed.ejs",
                filename: "embed.html",
                title: `Embedded Project - ${APP_NAME}`,
                ...htmlWebpackPluginCommon,
            }),
            new HtmlWebpackPlugin({
                chunks: ["addon-settings"],
                template: "src/playground/simple.ejs",
                filename: "addons.html",
                title: `Addon Settings - ${APP_NAME}`,
                ...htmlWebpackPluginCommon,
            }),
            new rspack.CopyRspackPlugin({
                patterns: [
                    {
                        from: "static",
                        to: "",
                        // Kept on disk, but not shipped
                        globOptions: {
                            ignore: ["**/credits.html"],
                        },
                    },
                ],
            }),
            new rspack.CopyRspackPlugin({
                patterns: [
                    {
                        from: "extensions/**",
                        to: "static",
                        context: "src/examples",
                    },
                ],
            }),
        ]),
    }),
].concat(
    process.env.NODE_ENV === "production" || process.env.BUILD_MODE === "dist" // export as library
        ? defaultsDeep({}, base, {
              target: "web",
              entry: {
                  "scratch-gui": "./src/index.js",
                  [IFRAME_EXTENSION_WORKER_ENTRY_NAME]:
                      IFRAME_EXTENSION_WORKER_ENTRY_PATH,
              },
              output: {
                  libraryTarget: "umd",
                  filename: "js/[name].js",
                  chunkFilename: "js/[name].js",
                  path: path.resolve("dist"),
                  publicPath: `${STATIC_PATH}/`,
              },
              externals: {
                  react: "react",
                  "react-dom": "react-dom",
              },
              module: {
                  rules: base.module.rules.concat([
                      {
                          test: /\.(svg|png|wav|mp3|gif|jpg|woff2|hex)$/,
                          loader: "url-loader",
                          options: {
                              limit: 2048,
                              outputPath: "static/assets/",
                              publicPath: `${STATIC_PATH}/assets/`,
                              esModule: false,
                          },
                      },
                  ]),
              },
              plugins: base.plugins.concat([
                  new rspack.CopyRspackPlugin({
                      patterns: [
                          {
                              from: "extension-worker.js",
                              context: "node_modules/scratch-vm/dist/web",
                              noErrorOnMissing: true,
                          },
                          {
                              from: "extension-worker.js.map",
                              context: "node_modules/scratch-vm/dist/web",
                              noErrorOnMissing: true,
                          },
                      ],
                  }),
                  // Include library JSON files for scratch-desktop to use for downloading
                  new rspack.CopyRspackPlugin({
                      patterns: [
                          {
                              from: "src/lib/libraries/*.json",
                              to: "libraries/[name][ext]",
                          },
                      ],
                  }),
              ]),
          })
        : [],
);
