import './import-first';

import React from 'react';
import { compose } from 'redux';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import TWEmbedFullScreenHOC from '../lib/tw-embed-fullscreen-hoc.jsx';
import TWStateManagerHOC from '../lib/tw-state-manager-hoc.jsx';
import runAddons from '../addons/entry';
import { Theme } from '../lib/themes/index.js';

import GUI from './render-gui.jsx';
import render from './app-target';

console.log("📌 Embed script loaded!");

// ✅ FIX: Only detect project IDs for /embed URLs (ignore index.html or other non-project pages)
const getProjectId = () => {
    const path = window.location.pathname;
    console.log(`📂 Current Path: ${path}`);

    // Ensure we only run this logic on embed URLs that are NOT the song editor
    if (path.includes('/embed') && !path.endsWith('/index.html')) {
        console.log("🔍 Checking for project ID in URL...");

        const hashMatch = location.hash.match(/#(\d+)/);
        if (hashMatch !== null) {
            console.log(`✅ Found project ID in hash: ${hashMatch[1]}`);
            return hashMatch[1];
        }

        const pathMatch = path.match(/(\d+)\/embed/);
        if (pathMatch !== null) {
            console.log(`✅ Found project ID in path: ${pathMatch[pathMatch.length - 1]}`);
            return pathMatch[pathMatch.length - 1];
        }
    }

    console.log("❌ No project ID found (non-project embed or invalid URL)");
    return null; // Return null for non-project cases
};

const projectId = getProjectId();
console.log(`🎯 Final project ID: ${projectId}`);

let embedUrl;

if (projectId != null) {
    console.log(`🌍 Embedding project ID: ${projectId}`);
    embedUrl = `https://turbowarp.org/${projectId}/embed`;
} else {
    console.warn("⚠️ No project ID found! Handling non-project embedding.");
    embedUrl = location.href; // Default to the current URL

    // Prevent infinite loop of redirects
    if (!window.location.pathname.endsWith('/embed')) {
        console.log(`🔄 Redirecting to embed-safe URL: ${window.location.pathname}`);
        window.location.href = `${window.location.pathname}`;
    }
}

const urlParams = new URLSearchParams(location.search);
console.log(`🔎 URL Params: ${urlParams.toString()}`);

let vm;

const onVmInit = (_vm) => {
    console.log("🖥️ VM Initialized!");
    vm = _vm;
};

const onProjectLoaded = () => {
    console.log("✅ Project successfully loaded!");
    if (urlParams.has('autoplay')) {
        console.log("▶️ Autoplay enabled! Starting project...");
        vm.start();
        vm.greenFlag();
    }
};

// 🎨 Wrapped GUI Component with all necessary HOCs
const WrappedGUI = compose(
    AppStateHOC,
    TWStateManagerHOC,
    TWEmbedFullScreenHOC
)(GUI);

console.log("🎬 Rendering GUI...");
render(
    <WrappedGUI
        isEmbedded
        projectId={projectId}
        onVmInit={onVmInit}
        onProjectLoaded={onProjectLoaded}
        routingStyle="none"
        theme={Theme.light}
    />
);

if (urlParams.has('addons')) {
    console.log("🔌 Running Addons...");
    runAddons();
    console.log("🚀 Addons executed!");
}
