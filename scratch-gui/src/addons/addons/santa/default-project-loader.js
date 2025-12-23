import defaultProject from '!!arraybuffer-loader!./christmas-default-project.sb3';
import AddonHooks from '../../hooks.js';

export default async function ({ addon, console, msg }) {
    const vm = addon.tab.traps.vm;
    try {
        // nuke vm first so it stops everything
        if (vm && typeof vm.quit === 'function') vm.quit();

        // If any targets remain, delete them by id (vm.deleteSprite expects an id)
        if (vm && vm.runtime && Array.isArray(vm.runtime.targets)) {
            const ids = vm.runtime.targets.slice().map(t => t.id).filter(Boolean);
            for (const id of ids) {
                try {
                    // deleteSprite may return a restore function; ignore return value here
                    vm.deleteSprite(id);
                } catch (e) {
                    // Non-fatal: log and continue deleting other targets
                    if (console && console.warn) console.warn('Failed to delete sprite', id, e);
                }
            }
        }

        // let my try something
        AddonHooks.willLoadDefaultProject = false;

// this isn't the problem, the import is wrong
        // hi 8to16 speaking here idk whats going on lol
        // void do you have an idea maybe a state hack or something
        // let me steal something from scratch addons
        // Load the new project (arraybuffer)
        await vm.loadProject(defaultProject);

        // draw once to ensure renderer shows the loaded project
        if (vm && vm.renderer && typeof vm.renderer.draw === 'function') {
            // allow renderer time to settle
            setTimeout(() => vm.renderer.draw(), 0);
        }

        // Start the project
        if (vm && typeof vm.greenFlag === 'function') vm.greenFlag(); // i know wwe probably, um PROBABLY shouldn't auto-start but c'mon it's christmas and cool animation thingy in the proect ;)
    } catch (err) {
        if (console && console.error) console.error('Failed to load default project', err);
        // Re-throw so callers can handle if needed
        throw err;
    }
}
