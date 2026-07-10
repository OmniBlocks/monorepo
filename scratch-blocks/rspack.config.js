// patch 'fs' to fix EMFILE errors, for example on WSL
var realFs = require("fs");
var gracefulFs = require("graceful-fs");
gracefulFs.gracefulify(realFs);

var path = require("path");
var { rspack } = require("@rspack/core");

module.exports = [
  {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: {
      horizontal: "./shim/horizontal.js",
      vertical: "./shim/vertical.js",
    },
    output: {
      library: "ScratchBlocks",
      libraryTarget: "commonjs2",
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },
    optimization: {
      minimize: false,
    },
    performance: {
      hints: false,
    },
  },
  {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: {
      horizontal: "./shim/horizontal.js",
      vertical: "./shim/vertical.js",
    },
    output: {
      library: "Blockly",
      libraryTarget: "umd",
      path: path.resolve(__dirname, "dist", "web"),
      filename: "[name].js",
    },
    plugins: [],
  },
  {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: "./shim/gh-pages.js",
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "gh-pages"),
    },
    optimization: {
      minimize: false,
    },
    performance: {
      hints: false,
    },
    plugins: [
      new rspack.CopyRspackPlugin({
        patterns: [
          {
            from: path.dirname(
              require.resolve("google-closure-library/package.json"),
            ),
            to: "closure-library",
          },
          {
            from: "blocks_common",
            to: "playgrounds/blocks_common",
          },
          {
            from: "blocks_horizontal",
            to: "playgrounds/blocks_horizontal",
          },
          {
            from: "blocks_vertical",
            to: "playgrounds/blocks_vertical",
          },
          {
            from: "core",
            to: "playgrounds/core",
          },
          {
            from: "media",
            to: "playgrounds/media",
          },
          {
            from: "msg",
            to: "playgrounds/msg",
          },
          {
            from: "tests",
            to: "playgrounds/tests",
          },
          {
            from: "*.js",
            to: "playgrounds",
          },
        ],
      }),
    ],
  },
];
