import defaultProject from '!!arraybuffer-loader!./christmas-default-project.sb3';
import AddonHooks from '../../hooks.js';

export default async function ({ addon, console, msg }) {
    const vm = addon.tab.traps.vm;
async function waitForProjectState(addon) {
    let currentState;
    while (true) {
        currentState = addon.tab.redux.state.scratchGui.projectState.loadingState;

        if (currentState === "SHOWING_WITHOUT_ID") break;

        await new Promise(resolve => setTimeout(resolve, 0)); // this works actually
    }
}

// Usage
await waitForProjectState(addon);
        // let me find the state we use
        await vm.loadProject(defaultProject);

        // draw once to ensure renderer shows the loaded project
        if (vm && vm.renderer && typeof vm.renderer.draw === 'function') {
            // allow renderer time to settle
            setTimeout(() => vm.renderer.draw(), 0);
        }
try {
        // Start the project
        if (vm && typeof vm.greenFlag === 'function') vm.greenFlag(); // i know wwe probably, um PROBABLY shouldn't auto-start but c'mon it's christmas and cool animation thingy in the proect ;)
    } catch (err) {
        if (console && console.error) console.error('Failed to load default project', err);
        // Re-throw so callers can handle if needed
        throw err;
    }
}
