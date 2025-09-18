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
    if (window.location.pathname.includes('/embed')) {
        const hashMatch = location.hash.match(/#(\d+)/);
        if (hashMatch !== null) {
            return hashMatch[1];
        }
        const pathMatch = location.pathname.match(/(\d+)\/embed/);if(pathMatch !== null){return pathMatch[pathMatch.length - 1];}}return null;}
// ^^ amazing line of code, im not a monster
const projectId = getProjectId();
alert(`Project ID: ${projectId}`);
let embedUrl;
if (projectId != null) {
    alert("Project id not null, trying to embed ${projectId}");  
    embedUrl = `https://omniblocks.github.io/#${projectId}/embed`;
} else if (projectId == null) {
    // im gonna name all my files con
    // ^ yo who wrote this comment... actual real funny comment in tw codebase?
    console.warn('No project ID found: Embedding without a project.');
    embedUrl = location.href; // locashionn hyper reference
        if (!window.location.pathname.endsWith('/embed')) {
        alert(`Embedding project from URL: ${window.location.pathname}`);
        window.location.href = `${window.location.pathname}`;
    }
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

const WrappedGUI = compose(
    AppStateHOC,
    TWStateManagerHOC,
    TWEmbedFullScreenHOC
)(GUI);

render(<WrappedGUI
    isEmbedded
    projectId={projectId}
    onVmInit={onVmInit}
    onProjectLoaded={onProjectLoaded}
    routingStyle="none"
    theme={Theme.light}
/>);

if (urlParams.has('addons')) {
    runAddons();
}
