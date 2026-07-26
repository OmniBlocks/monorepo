// Based on https://github.com/webpack-contrib/worker-loader/tree/v2.0.0

module.exports.pitch = function (request) {
    // Technically this loader does work in other environments, but our use case does not want that.
    if (this.target !== 'web') {
        return 'throw new Error("Not supported in non-web environment");';
    }
    this.cacheable(false);
    const callback = this.async();

    const bundler = this._compiler.webpack || require('webpack');
    const EntryPlugin = bundler.EntryPlugin || bundler.SingleEntryPlugin;

    const compiler = this._compilation.createChildCompiler('extension worker', {});
    new EntryPlugin(this.context, `!!${request}`, 'extension worker').apply(compiler);
    compiler.runAsChild((err, entries, compilation) => {
        if (err) return callback(err);
        const file = Array.from(entries[0].files)[0];
        const source = `module.exports = ${JSON.stringify(compilation.assets[file].source())};`;
        return callback(null, source);
    });
};
