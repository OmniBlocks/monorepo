# scratch-gui for OmniBlocks & TurboWarp

![GitHub](https://img.shields.io/badge/license-GPLv3-blue.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

> A fork of the Scratch 3.0 GUI, modified and enhanced for the [TurboWarp](https://turbowarp.org/) compiler and the [OmniBlocks](https://omniblocks.github.io) multi-language IDE.

This repository contains the frontend interface of the Block-Based editor for OmniBlocks and TurboWarp. It builds upon Scratch's foundation with significant performance improvements, addons, themes, and other features for an amazing coding experience.

## ✨ Features & Enhancements


*   **Plenty of Addons:** Dozens of community-built addons for custom blocks, UI tweaks, and new functionality. Many are inherited from TurboWarp and other mods from now, but we will implement some new ones soon.
*   **Themes:** Multiple color themes (Aqua, Blue, Rainbow, Red, Purple) to personalize your editor. The Aqua theme is the default, as it is the main brand color of OmniBlocks.
*   **OmniBlocks IDE:** OmniBlocks plans to be a full-featured IDE extending beyond blocks. There will be editors for text languages like Python and C in the future!
*   **Integrated Tools:** Includes a custom music editor and other quality-of-life improvements. Keep in mind that if you're seeing this, it means the music editor is currently not fully implemented. It works, you can go try it out, but it doesn't fully integrate with OmniBlocks just yet.

### A great feature inherited from TurboWarp: 
*   **High Performance:** This is a fork of TurboWarp, meaning it uses the compiler that TurboWarp uses, making projects run way faster than other projects. This isn't listed as an enhancement/feature since we didn't implemented, the team at TurboWarp did, and we don't claim to have written the TurboWarp compiler that makes OmniBlocks projects run so fast. 

## 🚀 Quick Start

Want to run a local copy of the OmniBlocks editor? Follow these steps.

### Prerequisites

*   Node.js (version specified in `.nvmrc`)
*   npm (duhh)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/OmniBlocks/scratch-gui # you can add a .git extension if you want, but it should work fine without it. 
    cd scratch-gui
    ```

2.  **Install dependencies (recommended method):**
    ```bash
    npm ci  # We prefer this as it doesn't modify package-lock.json, which keeps the dependencies the same.
    ```
    *(Use `npm install` only if you need to update dependencies, which may cause breaking changes you need to fix)*

3.  **Start the development server:**
    ```bash
    npm start
    ```
    The GUI will open in your browser at `http://localhost:8601`. If you're using GitHub Codespaces, it will be https://<codespace-name>-<codespace-hash>-8601.app.github.dev/

4.  **To create a production build:**
    ```bash
    npm run build
    ```
    Output will be in the `build/` directory. You can then use this output with a GitHub Actions workflow to push to a website or something like that.

## 🏗️ Project Architecture & Development Guide

This section is for developers looking to understand, modify, or contribute to the codebase.

### Data Flow & Structure
- **State Management:** Uses Redux. Reducers are located in `src/reducers/`.
- **Core GUI Logic:** Located in `src/`.
- **Addons:** Managed in `src/addons/`. Synced and patched from upstream repositories using `pull.js`. If you try hard enough you can make your own by making all the files you need yourself.
- **Extensions:** Custom blocks and hardware integrations are in `src/lib/libraries/extensions/`. Extensions are in scratch-vm, an external dependency. You'l
- **Translations:** Located in `src/lib/tw-translations/`.
- **Theming:** Theme definitions (Aqua, Blue, etc.) are in `src/lib/themes/accent/<theme>.js`. Global color variables are set in `src/css/colors.css` and overridden in JS as needed.

### Key Workflows
- **Syncing Addons:** Run `node pull.js` to fetch and patch the latest addons from upstream sources.
- **Adding a New Addon:** Create a new directory within `src/addons/` with all necessary files and ensure it's imported in `src/addons/entry.js`.
- **Modifying Themes:** Edit color variables in `src/css/colors.css` and update the theme definitions in `src/lib/themes/guiHelpers.js`.
- **Debugging:** For build issues, inspect the output in the `build/` directory or check the console output from `npm run build`.

### Integration Points
- **Addon Entry Point:** `src/addons/entry.js`
- **Extensions:** `src/lib/libraries/extensions/`
- **Translations:** `src/lib/tw-translations/`
- **Static Assets:** Pre-downloaded hex files for micro:bit are stored in `static/microbit/`.

## 📜 Licensing

This project is licensed under multiple agreements due to its forked nature.

- **OmniBlocks & TurboWarp Modifications:** Licensed under the **GNU General Public License v3.0**. See the `LICENSE` file or [gnu.org/licenses](https://www.gnu.org/licenses/) for details.

- **Original Scratch Code (MIT License):** Copyright (c) 2016, Massachusetts Institute of Technology. The original license text is retained below as required.

- **Assets:**
  - `src/lib/default-project/dango.svg`: Based on Twemoji, licensed under CC BY 4.0.
  - **OmniBlocks Logo:** Licensed under CC BY-SA 4.0. Incorporates the Python logo (a trademark of the Python Software Foundation) for referential purposes. This project is not affiliated with or endorsed by the Python Software Foundation.
  - **Mascot "Boxy":** Licensed under CC BY-SA 4.0.

<details>
<summary>Original Scratch (MIT) License</summary>

Copyright (c) 2016, Massachusetts Institute of Technology All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

</details>

## 🤝 Contributing

Contributions are welcome! We are especially int pplerested in addons, bug fixes, and accessibility improvements.

1. Fork the project.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please ensure your code follows the existing patterns and conventions used in the project.

---

**Note:** This is a fork designed for specific use cases. For general Scratch development, please refer to the [upstream scratch-gui repository](https://github.com/LLK/scratch-gui).