# OmniBlocks/scratch-gui
![Build Status](https://github.com/OmniBlocks/scratch-gui/workflows/CI/badge.svg)
![GitHub issues](https://img.shields.io/github/issues/OmniBlocks/scratch-gui)
![GitHub](https://img.shields.io/badge/license-GPLv3-blue.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/OmniBlocks/scratch-gui)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![GitHub contributors](https://img.shields.io/github/contributors/OmniBlocks/scratch-gui)
[![Star History Chart](https://api.star-history.com/svg?repos=OmniBlocks/scratch-gui&type=Date)](https://www.star-history.com/#OmniBlocks/scratch-gui&Date)

> A fork of the Scratch 3.0 GUI, modified and enhanced for the [TurboWarp](https://turbowarp.org/) compiler and the [OmniBlocks](https://omniblocks.github.io) multi-language IDE.

This repository contains the frontend interface of the Block-Based editor for OmniBlocks and TurboWarp. It builds upon Scratch's foundation with significant performance improvements, addons, themes, and other features for an amazing coding experience.
## 📑 Table of Contents
- [🎮 Try It Out](#-try-it-out)
- [✨ Features & Enhancements](#-features--enhancements)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Project Architecture & Development Guide](#%EF%B8%8F-project-architecture--development-guide)
  - [Data Flow & Structure](#data-flow--structure)
  - [Key Workflows](#key-workflows)
  - [Integration Points](#integration-points)
- [📜 Licensing](#-licensing)
- [🤝 Contributing](#-contributing)
- [📝 The Super Strict Style Guide of Doom 😈](#-the-super-strict-style-guide-of-doom-)
- [❓ Frequently Asked Questions (FAQ)](#-frequently-asked-questions-faq)
  - [General Questions](#general-questions)
  - [Compatibility](#compatibility)
  - [Features & Development](#features--development)
  - [Technical Questions](#technical-questions)
  - [Contributions](#contributions)

## 🎮 Try It Out
Experience OmniBlocks live: [https://omniblocks.github.io](https://omniblocks.github.io)

## ✨ Features & Enhancements


*   **Plenty of Addons:** Dozens of community-built addons for custom blocks, UI tweaks, and new functionality. Many are inherited from TurboWarp and other mods from now, but we will implement some new ones soon.
*   **Themes:** Multiple color themes (Aqua, Blue, Rainbow, Red, Purple) to personalize your editor. The Aqua theme is the default, as it is the main brand color of OmniBlocks.
*   **OmniBlocks IDE:** OmniBlocks plans to be a full-featured IDE extending beyond blocks. There will be editors for text languages like Python and C in the future!
*   **Integrated Tools:** Includes a custom music editor and other quality-of-life improvements. Keep in mind that if you're seeing this, it means the music editor is currently not fully implemented. It works, you can go try it out, but it doesn't fully integrate with OmniBlocks just yet.

### A great feature inherited from TurboWarp: 
*   **High Performance:** This is a fork of TurboWarp, meaning it uses the compiler that TurboWarp uses, making projects run way faster than other projects. This isn't listed as an enhancement/feature since we didn't implement it; the team at TurboWarp did, and we don't claim to have written the TurboWarp compiler that makes OmniBlocks projects run so fast. 

## 🚀 Quick Start

Want to run a local copy of the OmniBlocks editor? Follow these steps.

### Prerequisites

*   Node.js version Node.js v22 (versions v18 or newer will probably work, but we can’t guarantee it)
*   npm (duhh)
*   Git
If you're using a GitHub Codespace, all these things come preinstalled.
### Dependencies
Some packages may want some additional things installed, so check the README in each package you want to develop.

OmniBlocks is a very large app that can require multiple gigabytes of disk space and memory to build.
 
Scratch is broken up into a bunch of different packages, each implementing one part of the app. Our dependencies are:

* scratch-gui implements much of the interface (eg. the sprite list), connects everything together, and is where addons live. There are instructions on most of that here :)
* scratch-vm runs projects. It's where the compiler lives, as well as the JavaScript definitions for any blocks. To add a new block, define the block there, and add the gui entry for the block here in scratch-gui.
* scratch-render is what displays things like the stage, sprites, text bubbles, and pen. It also implements blocks like "touching". Note that things that are rendered on top of sprites such as variable monitors are actually part of scratch-gui.
* scratch-svg-renderer helps fix various SVG rendering problems. If you don't know what an SVG is, it is essentially an image with theoretically infinite quality due to using mathematical equations to render instead of pixels.
* scratch-render-fonts contains all the fonts that SVG costumes can use
* scratch-paint is the costume editor. 
* scratch-parser extracts and validates sb2 and sb3 files
* scratch-storage is an abstraction around fetch() used for downloading (and theoretically uploading) files. It is the reason why you can add files to your workspace and they work without being uploaded to any cloud storage.
* scratch-l10n contains translations and localizations. This provides accessibility to people who speak other languages but want to use OmniBlocks.
* caffeine- wait- wha? how did this one get here?



### Installation & Running
To actually mod Scratch, you need to build the GUI, as it is the main package that connects everything. Here's how to do it:

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
    The GUI will open in your browser at `http://localhost:8601`. If you're using GitHub Codespaces, it will be `https://<codespace-name>-<codespace-hash>-8601.app.github.dev/`

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
- **Extensions:** Custom blocks and hardware integrations are in `src/lib/libraries/extensions/`. Extensions are in scratch-vm, an external dependency. You'll need to fork that separate repository with your changes there, and link the new forked repository to scratch-vm. This isn't very easy if you don't know much about NPM, so we're sorry about this, although we might move to the monorepo that doesn't require all these repos someday.
- **Translations:** Located in `src/lib/tw-translations/`.
- **Theming:** Theme definitions (Aqua, Blue, etc.) are in `src/lib/themes/accent/<theme>.js`. Global color variables are set in `src/css/colors.css` and overridden in JS as needed.

### Key Workflows
- **Syncing Addons:** Run `node pull.js` to fetch and patch the latest addons from upstream sources.
- **Adding a New Addon:** Create a new directory within `src/addons/` with all necessary files and ensure it's imported in `src/addons/entry.js`.
- **Modifying Themes:** Make a new file and title it "<color-name>.js". For example, if you want to make a new yellow theme, you can do "yellow.js". Then look for all the other JS files where the themes are imported, such as scratch-gui/src/lib/themes/index.js.
- **Debugging:** For build issues, inspect the output in the `build/` directory or check the console output from `npm run build`.


### Integration Points
- **Addon Entry Point:** `src/addons/entry.js`
- **Extensions:** `src/lib/libraries/extensions/`
- **Translations:** `src/lib/tw-translations/`
- **Static Assets:**  `static/`.


## 📜 Licensing

This project is licensed under multiple agreements due to its forked nature.

- **OmniBlocks & TurboWarp Modifications:** Licensed under the **GNU General Public License v3.0**. See the `LICENSE` file or [gnu.org/licenses](https://www.gnu.org/licenses/) for details.

- **Original Scratch Code (BSD License):** Copyright (c) 2016, Massachusetts Institute of Technology. The original license text is retained below as required.

- **Assets:**
  - `src/lib/default-project/dango.svg`: Based on Twemoji, licensed under CC BY 4.0.
  - **OmniBlocks Logo:** Licensed under CC BY-SA 4.0. Incorporates the Python logo (a trademark of the Python Software Foundation) for referential purposes. This project is not affiliated with or endorsed by the Python Software Foundation.
  - **OmniBlocks Mascot "Boxy":** Licensed under CC BY-SA 4.0.

<details>
<summary>Original Scratch (BSD) License</summary>

Copyright (c) 2016, Massachusetts Institute of Technology All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

</details>

## 🤝 Contributing

Contributions are welcome! We are especially interested in addons, bug fixes, and new features!

1. Fork the project.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Code your feature (make sure to follow our super strict style guide below)
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
5. Push to the branch (`git push origin feature/AmazingFeature`).
6. Open a Pull Request.
7. Sit and wait as it gets reviewed :)
8. (six seven)


## 📝 The Super Strict Style Guide of Doom 😈
As you may know from the earlier parts of the readme, this is all made in React JS, a modular JavaScript framework. We're pretty laid back, so we don't have a super strict style guide or coding conventions, just know the following:

-  Go all out on your code! It doesn't matter if you don't use proper indentation, or other stuff like that, just make sure to add comments explaining it. After all, this is JavaScript, not Python we're talking about, so any valid syntax is valid syntax.
-  Make sure your variables are readable. While everyone loves fun code, please make sure your variables are legible. For example, if you need a variable for a new multi-backpack feature you're planning to add (not quite sure what the feature would do, but it's just an example), we'd prefer "multibackpack" or even "backpackthing" over "qwnpvoitwegjk".
- Absolutely NO profanity. I have seen other repos have profanity in commit messages or comments, and while it is relatable and even hilarious to see how miserably we fail at code sometimes, there is no need to use profanity. Since our project is for All Ages and open source, we assume anyone of all ages will also see the code. Some words, however, are not considered profanity, such as crap or heck. If you snoop in _OUR_ commit messages, we have some pretty hilarious frustrations in there too! Just no bad words.

Other than that, Code On! We don't require much other than these rules. Have fun!


## ❓ Frequently Asked Questions (FAQ)

### General Questions

**Q: What is OmniBlocks?**  
A: OmniBlocks is an enhanced fork of TurboWarp for faster project execution, adds quality-of-life features, and constant updates.

**Q: How is OmniBlocks different from TurboWarp?**  
A: While we use TurboWarp's excellent compiler and extra features, OmniBlocks focuses on providing a more advanced, mature IDE. We plan to be able to be used by kids and adults alike, adding new advanced features for already knowledgeable coders, as well as being able to be booted up by children and/or beginners to explore programming. We will also be exploring additional features like alternative language editors (Python/C) in the future.

**Q: Is OmniBlocks free to use?**  
A: Yes! OmniBlocks is open-source and free forever! Unless you count paying your internet provider as an indirect fee ;)

### Compatibility

**Q: Can I use my Scratch account with OmniBlocks?**  
A: You can't log in with your Scratch Accounts for integration with OmniBlocks, and we don't have any planned features that would use such a thing. Please remember that giving your Scratch password to ANY site, even if it seems good, could be used as bait and take over your Scratch account. If we ever do implement such integration, it will be through secure Auths. 
Anyways, you can import/export `.sb3` project files to load a Scratch project into OmniBlocks and code there, and even use the new tools and features to aid development.

**Q: Will projects created in OmniBlocks work in vanilla Scratch?**  
A: Yes! As long as you don't use extensions that add custom blocks not available in vanilla Scratch, your projects will work perfectly. The TurboWarp compiler only affects runtime performance, not project compatibility.

**Q: Can I import my existing Scratch projects?**  
A: Absolutely! Just click "File > Load from your computer" and select your `.sb3` or `.sb2` file.

**Q: What about projects with cloud variables? Can I still play online games with OmniBlocks?**
A: Yup! The TurboWarp cloud data server is used to ensure that you can still play your favorite online games in OmniBlocks. Keep in mind that since we don't integrate with Scratch, you can choose any username that exists in Scratch (except for Scratch Team member names), so if you see someone claiming to be a famous Scratcher (e.g., griffpatch), it is most likely not actually that person.

### Features & Development

**Q: What's the status of the music editor feature?**  
A: The music editor is currently in development and not fully integrated. We're working on it, but for now, the traditional sound editor is available. You can go ahead and use it, but if you click out of the tab... well, say goodbye to your music. You can test the raw song editor [here](https://omniblocks.github.io/songeditor.html)

**Q: Can I create my own extensions?**  
A: Yes, but be aware that extension development is complex and requires understanding of Scratch's architecture. Check out the `scratch-vm` repository and our contributing guidelines for more information.

**Q: Can I request new features?**  
A: Yes! Open an issue on our GitHub repository with the "enhancement" label. We love hearing ideas from the community, though we can't guarantee implementation timelines or whether they are going to be added. For example, let's say you want a new feature to be added: the ability to collaborate live with other people. While this is a cool idea in theory, there are many flaws. The smaller problem is that maintaining the servers would cost money, and we want to keep OmniBlocks free. The other bigger problem is that it is simply a huge security risk. Since we want kids to be able to use OmniBlocks, adding such a feature would allow for private communication and other terrible things to happen. We don't want to turn OmniBlocks into a Roblox clone.

### Technical Questions

**Q: What are the system requirements?**  
A: OmniBlocks runs in any modern web browser (Chrome, Firefox, Safari, Edge). Keep in mind that for the best performance, Chromium-based browsers are significantly faster, such as Chrome or Edge. For development, you'll need Node.js 18+ and npm. If you don't have access to such tools (for example, if you want to develop on an iPad or tablet), you can start a GitHub Codespace, which is a free browser environment for coding.

**Q: Can I self-host OmniBlocks?**  
A: Yes! Follow the development setup instructions above, then build the project with `npm run build`. The output in the `build/` directory can be hosted on any static web server.

**Q: The editor is slow/laggy. What can I do?**  
A: Try these steps:
1. Close unnecessary browser tabs
2. Make sure you're using a modern browser
3. Check if your project has very large assets or complex scripts

**Q: I found a bug! Where do I report it?**  
A: Please open an issue on our GitHub repository with:
- A clear description of the bug
- Steps to reproduce it
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

### Contributions

**Q: I want to contribute! Where do I start?**  
A: Awesome! Read everything above for guidelines. Good starting points are:
- Fixing bugs labeled "good first issue"
- Improving documentation
- Adding tests
- Translating the interface

**Q: Do I need permission to fork OmniBlocks?**  
A: Not at all! That's what's so good about our open source license. You can use our code at the expense of anyone using your code too. Just make sure to follow the license terms and give proper attribution.

**Q: Can we talk to any of the maintainers or just have a chat?**
A: Totally! That's what you do in [the Discussion tab!](https://github.com/orgs/OmniBlocks/discussions) to talk to any of our maintainers.
Q: But aren't you busy?
A: True. I, supervoidcoder, the lead maintainer and creator of OmniBlocks, am very busy as I have to do school and other things too. But I'm not one of those people who is "onLy HeRe foR SeRiOuS sTuFF" or "iM a VeRy ImpOrtanT person With PrioRities, not your FrienD". I genuinely care about anyone that wants to reach out to me.
Most of the maintainers and contributors have our own personal Scratch Account too. Here are some:
@supervoidcoder: [scratchcode1_2_3](https://scratch.mit.edu/users/scratchcode1_2_3/)
@ampelectrecuted: [AmpElectrecuted](https://scratch.mit.edu/users/AmpElectrecuted/) or [8to16](https://scratch.mit.edu/users/8to16/) (banned, unfortunately)
@gvyt: [GvYoutube](https://scratch.mit.edu/users/GvYoutube/)
@NotTheBaton: [TheBaton](https://scratch.mit.edu/users/TheBaton/)




---

**Still have questions?** Feel free to open an issue here or start a discussion on our GitHub organization!

**Made a mod or a cool project?** We would love to see what people are creating! If you made your own mod of OmniBlocks or made a cool project in it, show it off in [the Discussion tab!](https://github.com/orgs/OmniBlocks/discussions)


---

**Note:** This is a fork designed specifically for OmniBlocks. If you want to make your own Scratch or TurboWarp mod, please refer to the [upstream scratch-gui repository](https://github.com/LLK/scratch-gui) or the [turbowarp scratch-gui repository](https://github.com/TurboWarp/scratch-gui) instead.
