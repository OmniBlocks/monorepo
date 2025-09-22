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


const getProjectId = () => {
    
    const hashMatch = location.hash.match(/#(\d+)/);
    if (hashMatch) return hashMatch[1];

   
    const pathMatch = location.pathname.match(/(\d+)\/embed/);
    if (pathMatch) return pathMatch[1];

    
    return null;
};

const projectId = getProjectId();
alert(`Project ID: ${projectId} (don't panic, it's fine)`);

// Construct embed URL for OmniBlocks mod
let embedUrl;
if (projectId != null) {
    // Use /embed path, but keep the hash style for OmniBlocks
    embedUrl = `${location.origin}/#${projectId}/embed`;
    alert(`Embedding project ${projectId} at ${embedUrl} (please work pls)`);
} else {
    console.warn('No project ID found: Embedding without a project. Brace yourself.');
    embedUrl = location.href; // locashionn hyper reference 
    // (what the heck is locashionn hyper)
}

const urlParams = new URLSearchParams(location.search);

let vm;

const onVmInit = _vm => {
    vm = _vm;
    // vm is alive. feed it coffee ☕
};

const onProjectLoaded = () => {
    if (urlParams.has('autoplay')) {
        vm.start(); // i lived my whole life without KNOWING THERE WAS AN AUTOPLAY FEATURE???
        vm.greenFlag(); 
    }
};

// Wrap the GUI with your HOCs
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
        onProjectLoaded={onProjectLoaded}
        routingStyle="none"
        theme={Theme.light} // force light theme for embeds because i'm EVIL MWAHAHHA
        /* wait normally with omniblocks it autosaves your last used theme to local storage so why doesn't the same apply here??? */
    />
);

// Run addons if requested
if (urlParams.has('addons')) {
    runAddons(); // addons are fun 
}
