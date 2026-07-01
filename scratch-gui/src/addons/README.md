# Addons

> **⚠️ CRITICAL WARNING ⚠️**
> `pull.js` has been **REMOVED** from OmniBlocks. Running this script would sync with upstream repositories and **DESTROY** all custom OmniBlocks additions, configuration, and custom addons. This file was a dangerous leftover from upstream TurboWarp that should never be used in OmniBlocks.

Addons and translations are from the [Scratch Addons browser extension](https://scratchaddons.com/). Feature requests should be sent [upstream](https://github.com/ScratchAddons/ScratchAddons/issues), but bug reports should be opened here first incase it's a bug caused by TurboWarp.

We apply some patches on top of the original source files. These patches are maintained in https://github.com/TurboWarp/addons.

entry.js exports a function that begins running addons.

⚠️ **DO NOT RUN pull.js** - This script has been removed from the repository as it would overwrite all OmniBlocks custom code with upstream TurboWarp/Scratch code.

Directory structure:

 - addons - the addons (**NO LONGER managed by pull.js - manually maintained**)
 - addons-l10n - addon translations used at runtime (**NO LONGER managed by pull.js - manually maintained**)
 - addons-l10n-settings - addon translations used by the settings page (**NO LONGER managed by pull.js - manually maintained**)
 - libraries - libraries used by addons (**NO LONGER managed by pull.js - manually maintained**)
 - generated - additional generated files (**NO LONGER managed by pull.js - manually maintained**)
 - settings - the settings page and its translations (manually maintained)

# OmniBlocks Custom Addon Management

For OmniBlocks, we **DO NOT** use `pull.js` to generate our updated addons. Since we make custom addons directly in this repository, they are to be manually made and added to each place.

**⚠️ DO NOT restore or run pull.js** - This script would sync with upstream and destroy:
- All custom OmniBlocks addons and features
- Custom configurations and settings  
- OmniBlocks-specific modifications
- Any custom themes or extensions

To update an existing addon that _is_ from Scratch Addons, you'll have to copy the code from their userscript.js, and paste it in here. You'll have to manually fix it up for the way the addon system works here. Sorry :(