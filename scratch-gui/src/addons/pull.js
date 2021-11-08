/**
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable import/no-commonjs */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable no-console */

const fs = require('fs');
const childProcess = require('child_process');
const rimraf = require('rimraf');
const request = require('request');
const pathUtil = require('path');
const addons = require('./addons.json');

const walk = dir => {
    const children = fs.readdirSync(dir);
    const files = [];
    for (const child of children) {
        const path = pathUtil.join(dir, child);
        const stat = fs.statSync(path);
        if (stat.isDirectory()) {
            const childChildren = walk(path);
            for (const childChild of childChildren) {
                files.push(pathUtil.join(child, childChild));
            }
        } else {
            files.push(child);
        }
    }
    return files;
};

const repoPath = pathUtil.resolve(__dirname, 'ScratchAddons');
if (!process.argv.includes('-')) {
    rimraf.sync(repoPath);
    childProcess.execSync(`git clone --depth=1 https://github.com/TurboWarp/addons ${repoPath}`);
}

for (const folder of ['addons', 'addons-l10n', 'addons-l10n-settings', 'libraries']) {
    const path = pathUtil.resolve(__dirname, folder);
    rimraf.sync(path);
    fs.mkdirSync(path, {recursive: true});
}

const generatedPath = pathUtil.resolve(__dirname, 'generated');
rimraf.sync(generatedPath);
fs.mkdirSync(generatedPath, {recursive: true});

process.chdir(repoPath);
const commitHash = childProcess.execSync('git rev-parse --short HEAD')
    .toString()
    .trim();

request('https://raw.githubusercontent.com/ScratchAddons/contributors/master/.all-contributorsrc', (err, response, body) => {
    const parsed = JSON.parse(body);
    const contributors = parsed.contributors.filter(({contributions}) => contributions.includes('translation'));
    const contributorsPath = pathUtil.resolve(generatedPath, 'translators.json');
    fs.writeFileSync(contributorsPath, JSON.stringify(contributors, null, 4));
});

const matchAll = (str, regex) => {
    const matches = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        matches.push(match);
    }
    return matches;
};

const includeImportedLibraries = contents => {
    // Parse things like:
    // import { normalizeHex, getHexRegex } from "../../libraries/normalize-color.js";
    // import RateLimiter from "../../libraries/rate-limiter.js";
    const matches = matchAll(contents, /import +(?:{.*}|.*) +from +["']\.\.\/\.\.\/libraries\/([\w\d_\/-]+(?:\.esm)?\.js)["'];/g);
    for (const match of matches) {
        const libraryFile = match[1];
        const oldLibraryPath = pathUtil.resolve(__dirname, 'ScratchAddons', 'libraries', libraryFile);
        const newLibraryPath = pathUtil.resolve(__dirname, 'libraries', libraryFile);
        const libraryContents = fs.readFileSync(oldLibraryPath, 'utf-8');
        const newLibraryDirName = pathUtil.dirname(newLibraryPath);
        fs.mkdirSync(newLibraryDirName, {
            recursive: true
        });
        fs.writeFileSync(newLibraryPath, libraryContents);
    }
};

const includePolyfills = contents => {
    if (contents.includes('EventTarget')) {
        contents = `import EventTarget from "../../event-target.js"; /* inserted by pull.js */\n\n${contents}`;
    }
    return contents;
};

const includeImports = (folder, contents) => {
    const dynamicAssets = walk(folder)
        .filter(file => file.endsWith('.svg') || file.endsWith('.png'));

    const stringifyPath = path => JSON.stringify(path).replace(/\\\\/g, '/');

    // Then we'll generate some JS to import them.
    let header = '/* inserted by pull.js */\n';
    dynamicAssets.forEach((file, index) => {
        header += `import _twAsset${index} from ${stringifyPath(`!url-loader!./${file}`)};\n`;
    });
    header += `const _twGetAsset = (path) => {\n`;
    dynamicAssets.forEach((file, index) => {
        header += `  if (path === ${stringifyPath(`/${file}`)}) return _twAsset${index};\n`;
    });
    // eslint-disable-next-line no-template-curly-in-string
    header += '  throw new Error(`Unknown asset: ${path}`);\n';
    header += '};\n';
    header += '\n';

    // And now we reroute everything to use our imports.
    // Parse things like:
    // el.src = addon.self.dir + "/" + name + ".svg";
    //          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  match
    //                           ^^^^^^^^^^^^^^^^^^^  capture group 1
    contents = contents.replace(
        /\${addon\.self\.(?:dir|lib) *\+ *([^;\n]+)}/g,
        (_fullText, name) => `\${_twGetAsset(${name})}`
    );
    contents = contents.replace(
        /addon\.self\.(?:dir|lib) *\+ *([^;,\n]+)/g,
        (_fullText, name) => `_twGetAsset(${name})`
    );

    return header + contents;
};

const generateAddonEntry = manifest => {
    let result = '/* generated by pull.js */\n';
    result += 'const resources = {\n';
    for (const {url} of manifest.userscripts || []) {
        result += `  ${JSON.stringify(url)}: () => require(${JSON.stringify(`./${url}`)}),\n`;
    }
    for (const {url} of manifest.userstyles || []) {
        result += `  ${JSON.stringify(url)}: () => require(${JSON.stringify(`!css-loader!./${url}`)}),\n`;
    }
    result += '};\n';
    result += 'export {resources};\n';
    return result;
};

const removeUnusedPropertiesFromManifestInPlace = manifest => {
    delete manifest.versionAdded;
    delete manifest.libraries;
    delete manifest.injectAsStyleElt;
    if (manifest.userscripts) {
        for (const userscript of manifest.userscripts) {
            delete userscript.matches;
            delete userscript.runAtComplete;
        }
    }
    if (manifest.userstyles) {
        for (const userstyle of manifest.userstyles) {
            delete userstyle.matches;
        }
    }
};

const addonIdToManifest = {};
const processAddon = (id, oldDirectory, newDirectory) => {
    for (const file of walk(oldDirectory)) {
        const oldPath = pathUtil.join(oldDirectory, file);
        let contents = fs.readFileSync(oldPath);

        const newPath = pathUtil.join(newDirectory, file);
        fs.mkdirSync(pathUtil.dirname(newPath), {recursive: true});

        if (file === 'addon.json') {
            contents = contents.toString('utf-8');
            const parsedManifest = JSON.parse(contents);
            addonIdToManifest[id] = parsedManifest;
            removeUnusedPropertiesFromManifestInPlace(parsedManifest);
            contents = JSON.stringify(parsedManifest, null, 2);
            const entryPath = pathUtil.join(newDirectory, '_entry.js');
            fs.writeFileSync(entryPath, generateAddonEntry(parsedManifest));
        }

        if (file.endsWith('.js')) {
            contents = contents.toString('utf-8');
            includeImportedLibraries(contents);
            contents = includePolyfills(contents);
            if (contents.includes('addon.self.dir') || contents.includes('addon.self.lib')) {
                contents = includeImports(oldDirectory, contents);
            }
        }

        fs.writeFileSync(newPath, contents);
    }
};

const SKIP_MESSAGES = [
    'debugger/feedback-log',
    'debugger/feedback-log-link',
    'debugger/feedback-remove',
    'editor-devtools/help-by',
    'editor-devtools/extension-description-not-for-addon',
    'mediarecorder/added-by',
    'editor-theme3/@settings-name-sa-color',
    'block-switching/@settings-name-sa'
];

const parseMessages = localePath => {
    const settings = {};
    const runtime = {};
    for (const addon of addons) {
        const path = pathUtil.join(localePath, `${addon}.json`);
        try {
            const contents = fs.readFileSync(path, 'utf-8');
            const parsed = JSON.parse(contents);
            for (const id of Object.keys(parsed).sort()) {
                if (SKIP_MESSAGES.includes(id)) {
                    continue;
                }
                const value = parsed[id];
                if (id.includes('/@')) {
                    settings[id] = value;
                } else {
                    runtime[id] = value;
                }
            }
        } catch (e) {
            // Ignore
        }
    }
    return {
        settings,
        runtime
    };
};

const generateEntries = (items, callback) => {
    let result = '/* generated by pull.js */\n';
    result += 'export default {\n';
    for (const i of items.sort()) {
        const {src, name, async = true} = callback(i);
        if (async) {
            // eslint-disable-next-line max-len
            result += `  ${JSON.stringify(i)}: () => import(/* webpackChunkName: ${JSON.stringify(name)} */ ${JSON.stringify(src)}),\n`;
        } else {
            result += `  ${JSON.stringify(i)}: () => require(${JSON.stringify(src)}),\n`;
        }
    }
    result += '};\n';
    return result;
};

const generateL10nEntries = locales => generateEntries(
    locales.filter(i => i !== 'en'),
    locale => ({
        name: `addon-l10n-${locale}`,
        src: `../addons-l10n/${locale}.json`
    })
);

const generateL10nSettingsEntries = locales => generateEntries(
    locales.filter(i => i !== 'en'),
    locale => ({
        src: `../addons-l10n-settings/${locale}.json`,
        async: false
    })
);

const generateAddonEntries = () => generateEntries(
    addons,
    id => {
        const manifest = addonIdToManifest[id];
        return {
            src: `../addons/${id}/_entry.js`,
            // Include default addons in a single bundle
            name: manifest.enabledByDefault ? 'addon-default-entry' : `addon-entry-${id}`,
            // Include default addons useful outside of the editor in the original bundle, no request required
            async: !(manifest.enabledByDefault && !manifest.editorOnly)
        };
    }
);

const generateAddonManifestEntries = () => generateEntries(
    addons,
    id => ({
        src: `../addons/${id}/addon.json`,
        async: false
    })
);

for (const addon of addons) {
    const oldDirectory = pathUtil.resolve(__dirname, 'ScratchAddons', 'addons', addon);
    const newDirectory = pathUtil.resolve(__dirname, 'addons', addon);
    processAddon(addon, oldDirectory, newDirectory);
}

const l10nFiles = fs.readdirSync(pathUtil.resolve(__dirname, 'ScratchAddons', 'addons-l10n'));
const languages = [];
for (const file of l10nFiles) {
    const oldDirectory = pathUtil.resolve(__dirname, 'ScratchAddons', 'addons-l10n', file);
    // Ignore README
    if (!fs.statSync(oldDirectory).isDirectory()) {
        continue;
    }
    // Convert pt-br to just pt
    const fixedName = file === 'pt-br' ? 'pt' : file;
    languages.push(fixedName);
    const runtimePath = pathUtil.resolve(__dirname, 'addons-l10n', `${fixedName}.json`);
    const settingsPath = pathUtil.resolve(__dirname, 'addons-l10n-settings', `${fixedName}.json`);
    const {settings, runtime} = parseMessages(oldDirectory);
    fs.writeFileSync(runtimePath, JSON.stringify(runtime));
    if (fixedName !== 'en') {
        fs.writeFileSync(settingsPath, JSON.stringify(settings));
    }
}

fs.writeFileSync(pathUtil.resolve(generatedPath, 'l10n-entries.js'), generateL10nEntries(languages));
fs.writeFileSync(pathUtil.resolve(generatedPath, 'l10n-settings-entries.js'), generateL10nSettingsEntries(languages));
fs.writeFileSync(pathUtil.resolve(generatedPath, 'addon-entries.js'), generateAddonEntries(languages));
fs.writeFileSync(pathUtil.resolve(generatedPath, 'addon-manifests.js'), generateAddonManifestEntries(languages));

const extensionManifestPath = pathUtil.resolve(__dirname, 'ScratchAddons', 'manifest.json');
const upstreamMetaPath = pathUtil.resolve(generatedPath, 'upstream-meta.json');
const extensionManifest = JSON.parse(fs.readFileSync(extensionManifestPath, 'utf8'));
const versionName = extensionManifest.version_name;
fs.writeFileSync(upstreamMetaPath, JSON.stringify({
    version: versionName,
    commit: commitHash
}));
