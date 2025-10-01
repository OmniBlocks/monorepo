# Copilot Instructions for scratch-gui (OmniBlocks/TurboWarp)
## OmniBlocks Project Description & Licensing
OmniBlocks is a developing Multi‑Language IDE. Currently based on TurboWarp, which is a mod of Scratch 3, for the block editor.
Text editors are also planned for languages like Python or C, but they are not implemented yet.
OmniBlocks adds some cool things to the classic block editor, such as a music editor or extra features.
OmniBlocks' and TurboWarp's modifications to Scratch are licensed under the GNU General Public License v3.0.
The OmniBlocks logo is licensed under CC BY‑SA 4.0. The logo incorporates the Python logo, which is a trademark of the Python Software Foundation, used here solely to reference the Python programming language. This project is not affiliated with or endorsed by the Python Software Foundation.
The OmniBlocks mascot "Boxy" is licensed under CC BY‑SA 4.0.

## Project Overview

## Architecture & Data Flow
- GUI logic is in `src/`, with Redux for state management (`src/reducers/`).
- Addons are managed in `src/addons/`, with code pulled and patched via `pull.js`.
- Extensions and translations are in `src/lib/libraries/extensions/` and `src/lib/tw-translations/`.
- Themes and color variables are set in `src/lib/themes/accent/<theme>.js` and `src/css/colors.css`. <theme> stands for what theme is. The current ones are aqua, blue, rainbow, red, and purple.

## Developer Workflows
- **Install dependencies:** `npm ci` (do not use `npm install` unless necessary since it modifies package-lock.json)
- **Build:** `npm run build` (outputs to `build/`)
- **Test:** `npm start` opens local server at `localhost:8601`
- **Addons:** Use `pull.js` to sync and patch addon sources from upstream

## Conventions & Patterns
- Addons and translations are managed by scripts, which can be manually edited.
- Custom patches for addons are maintained in TurboWarp/addons repo.
- Static assets and generated files are in `build/` and `static/`.
- License and mascot info is in `README.md` and `TRADEMARK`.
- Color and theme variables use CSS custom properties, overridden in JS when needed, such as when a theme is selected. A theme is always going to be on.

## Integration Points
- Addons: `src/addons/entry.js` is the main entry point.
- Extensions: `src/lib/libraries/extensions/`
- Translations: `src/lib/tw-translations/`
- Micro:bit: `static/microbit/` (hex files downloaded at prepublish)

## Examples
- To add a new addon, add a new folder and all the necessary files for the addon to function..
- To change theme colors, edit `src/lib/themes/guiHelpers.js` and `src/css/colors.css`.
- To debug build output, inspect files in `build/` or just read the error messages in the console when running `npm run build`.



