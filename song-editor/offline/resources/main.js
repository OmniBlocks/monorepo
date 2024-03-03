function setTray() {
    let tray = {
        icon: "/resources/icons/trayIcon.png",
        menuItems: [
            {id: "VERSION", text: "Get version"},
            {id: "SEP", text: "-"},
            {id: "QUIT", text: "Quit"}
        ]
    };
    Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "VERSION":
            Neutralino.os.showMessageBox("Version information",
                `UltraBox: v${NL_APPVERSION} | Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
            break;
        case "QUIT":
            Neutralino.app.exit();
            break;
    }
}

async function onWindowClose() {
    let button = await Neutralino.os
            .showMessageBox('Confirm',
                            'Are you sure you want to quit?\nAll unsaved data will be lost.',
                            'YES_NO', 'QUESTION');
    // do YES_NO_CANCEL instead if we ever wanted "would you like to save before you quit?" instead
    if (button == 'YES')
        Neutralino.app.exit();
}

Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);
Neutralino.events.on("appClientConnect", appClientConnect);

if(NL_OS != "Darwin") {
    setTray();
}

async function appClientConnect() {
    if (window.localStorage.getItem("ignoreAutoUpdate") != "true") {
        try {
            let url = "https://raw.githubusercontent.com/ultraabox/UB-Offline-Files/main/neutralino.update.json";
            let manifest = await Neutralino.updater.checkForUpdates(url);
        
            if (manifest.version != NL_APPVERSION) {
                let button = await Neutralino.os
                .showMessageBox('Confirm',
                                'A new update of UB Offline has released.\nWould you like to update?',
                                'YES_NO_CANCEL', 'QUESTION');
                if (button == 'YES') {
                    await Neutralino.updater.install();
                    await Neutralino.app.restartProcess();
                } else if (button == 'NO') {
                    // Ignore this update from now on
                    window.localStorage.setItem("ignoreAutoUpdate", "true");
                    location.reload();
                }
            }
        }
        catch(err) {
            // Handle errors
        }
    }
}