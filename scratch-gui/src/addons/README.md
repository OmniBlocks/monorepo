# Addons

Addons and translations are from the [Scratch Addons browser extension](https://scratchaddons.com/). Feature requests should be sent [upstream](https://github.com/ScratchAddons/ScratchAddons/issues), but bug reports should be opened here first incase it's a bug caused by TurboWarp.

We apply some patches on top of the original source files. These patches are maintained in https://github.com/TurboWarp/addons.

entry.js exports a function that begins running addons.

pull.js is a magical script that automatically pulls code from GitHub, parses it with regex, applies some more automated patches, and copies everything to the proper folders.

Directory structure:

 - addons - the addons (managed by pull.js)
 - addons-l10n - addon translations used at runtime (managed by pull.js)
 - addons-l10n-settings - addon translations used by the settings page (managed by pull.js)
 - libraries - libraries used by addons (managed by pull.js)
 - generated - additional generated files (managed by pull.js)
 - settings - the settings page and its translations

# OmniBlocks

For OmniBlocks, we don't use pull.js to generate our updated addons. Since we make custom addons directly in this repository, they are to be manually made and added to each place.
To update an existing addon that _is_ from Scratch Addons, you'll have to copy the code from their userscript.js, and paste it in here. You'll have to manually fix it up for the way the addon system works here. Sorry :(