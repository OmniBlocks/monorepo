
import './import-first';

import React from 'react';
import {compose} from 'redux';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import TWEmbedFullScreenHOC from '../lib/tw-embed-fullscreen-hoc.jsx';
import TWStateManagerHOC from '../lib/tw-state-manager-hoc.jsx';
import runAddons from '../addons/entry';
import {Theme} from '../lib/themes/index.js';

import GUI from './render-gui.jsx';
import render from './app-target';

// Extract project ID from URL hash or pathname for OmniBlocks
const getProjectId = () => {
    // OmniBlocks expects #<id>/embed only (GH Pages)
    const hashMatch = location.hash.match(/^#(\d+)\/embed/);
    if (hashMatch) return hashMatch[1];

    // If custom domain support is added, uncomment below:
    // const pathMatch = location.pathname.match(/^\/(\d+)\/embed/);
    // if (pathMatch) return pathMatch[1];

    return null;
};

const projectId = getProjectId();

// Construct embed URL for OmniBlocks
let embedUrl;
if (projectId != null) {
    embedUrl = `${location.origin}/#${projectId}/embed`;
} else {
    console.warn('No project ID found: Embedding without a project.');
    embedUrl = location.href;
}

const urlParams = new URLSearchParams(location.search);

let vm;

const onVmInit = _vm => {
    vm = _vm;
};

const onProjectLoaded = () => {
    if (urlParams.has('autoplay')) {
        vm.start();
        vm.greenFlag();
    }
};

// Hide splash screen when GUI is ready
const hideSplash = () => {
    if (window.SplashEnd) window.SplashEnd();
};

// Wrap the GUI with HOCs
const WrappedGUI = compose(
    AppStateHOC,
    TWStateManagerHOC,
    TWEmbedFullScreenHOC
)(GUI);

// Render the embedded GUI
render(
    <WrappedGUI
        isEmbedded
        projectId={projectId}
        onVmInit={onVmInit}
        onProjectLoaded={() => {
            onProjectLoaded();
            hideSplash();
        }}
        routingStyle="none"
        theme={Theme.light}
    />
);

// Run addons if requested
if (urlParams.has('addons')) {
    runAddons();
}
