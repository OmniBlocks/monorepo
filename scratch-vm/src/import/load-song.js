const StringUtil = require('../util/string-util');

const loadSong = function (song, runtime) {
    const storage = runtime.storage;
    if (!storage) {
        return Promise.reject(new Error('No storage module present; cannot load song asset.'));
    }

    if (song.asset) {
        song.assetId = song.asset.assetId;
        song.dataFormat = storage.DataFormat.JSON;
        song.md5 = `${song.asset.assetId}.${storage.DataFormat.JSON}`;
        return Promise.resolve(song);
    }

    const md5ext = song.md5 || song.md5ext;
    if (typeof md5ext !== 'string') {
        return Promise.reject(new Error('Song asset is missing its md5 extension.'));
    }

    const [assetId, extension] = StringUtil.splitFirst(md5ext, '.');
    if (extension && extension.toLowerCase() !== storage.DataFormat.JSON) {
        return Promise.reject(new Error(`Unexpected song format: ${extension}`));
    }

    return storage.load(storage.AssetType.Song, assetId, storage.DataFormat.JSON).then(asset => {
        if (!asset) {
            throw new Error(`Failed to find song data: ${md5ext}`);
        }
        song.asset = asset;
        song.assetId = asset.assetId;
        song.dataFormat = storage.DataFormat.JSON;
        song.md5 = `${asset.assetId}.${storage.DataFormat.JSON}`;
        return song;
    });
};

module.exports = loadSong;
