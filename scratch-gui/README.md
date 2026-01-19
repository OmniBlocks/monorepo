# OmniBlocks - The Ultimate MultiLanguage IDE
# OmniBlocks/scratch-gui
![Build Status](https://github.com/OmniBlocks/scratch-gui/workflows/CI/badge.svg)
![GitHub issues](https://img.shields.io/github/issues/OmniBlocks/scratch-gui)
![GitHub](https://img.shields.io/badge/license-GPLv3-blue.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/OmniBlocks/scratch-gui)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![GitHub contributors](https://img.shields.io/github/contributors/OmniBlocks/scratch-gui)
![GitHub package.json version](https://img.shields.io/github/package-json/v/OmniBlocks/scratch-gui)
![GitHub repo size](https://img.shields.io/github/repo-size/OmniBlocks/scratch-gui)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/OmniBlocks/scratch-gui)
![GitHub pull requests](https://img.shields.io/github/issues-pr/OmniBlocks/scratch-gui)
![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)
![Powered by Webpack](https://img.shields.io/badge/Powered%20by-Webpack-8DD6F9?logo=webpack)
![GitHub Repo stars](https://img.shields.io/github/stars/OmniBlocks/scratch-gui?style=flat)
![GitHub forks](https://img.shields.io/github/forks/OmniBlocks/scratch-gui?style=flat)
![Website](https://img.shields.io/website?down_message=offline&up_message=online&url=https%3A%2F%2Fomniblocks.github.io)
![GitHub language count](https://img.shields.io/github/languages/count/OmniBlocks/scratch-gui)
![GitHub top language](https://img.shields.io/github/languages/top/OmniBlocks/scratch-gui)
![GitHub Created At](https://img.shields.io/github/created-at/OmniBlocks/scratch-gui)
![GitHub Release Date](https://img.shields.io/github/release-date-pre/OmniBlocks/scratch-gui)
![GitHub Sponsors](https://img.shields.io/github/sponsors/OmniBlocks?logo=githubsponsors)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/OmniBlocks/scratch-gui)
![GitHub number of milestones](https://img.shields.io/github/milestones/closed/OmniBlocks/scratch-gui)
![GitHub License](https://img.shields.io/github/license/OmniBlocks/scratch-gui)
![GitHub followers](https://img.shields.io/github/followers/OmniBlocks?style=flat&logo=github)


<a href="https://www.star-history.com/#OmniBlocks/scratch-gui&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=OmniBlocks/scratch-gui&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=OmniBlocks/scratch-gui&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=OmniBlocks/scratch-gui&type=date&legend=top-left" />
 </picture>
</a>

> A fork of the Scratch 3.0 GUI, modified and enhanced for the [TurboWarp](https://turbowarp.org/) compiler and the [OmniBlocks](https://omniblocks.github.io) multi-language IDE.

This repository contains the frontend interface of the Block-Based editor for OmniBlocks and TurboWarp. It builds upon Scratch and TurboWarp's foundation with improvements, addons, themes, and other features for an amazing coding experience.

## Important for Developers!
If you want to fork this repo or contribute with PR's (or modify OmniBlocks as your own), you must follow the following rules from the AGPLv3 license, or you are in violation of it.
* 1. Your fork/mod must be public and open-source.
* 2. Your fork/mod can be paid, but must be licensed under the same AGPLv3 license.
### Notice about rule 2
While it does say your fork/mod can be paid, the <b>main software</b> cannot be paid. Here are acceptable uses for requiring payment:
* 1. Premium features
  2. Support services
  3. Subscriptions.


## Try It Out
Try out OmniBlocks: [https://omniblocks.github.io](https://omniblocks.github.io)


### Installation as PWA

1. Open OmniBlocks in Chrome, Edge, or another Chromium-based browser</br>
2. Open the 3 dots menu and hover over "Cast, save, and share." GitHub is used here as an example.</br>
<img width="519" height="652" alt="Screenshot 2025-11-25 2 47 56 PM" src="https://github.com/user-attachments/assets/52bd3c88-8238-4cdb-878a-e4f9cd018e0b" /></br>
3. Click "Install" to add OmniBlocks to your desktop</br>
<img width="407" height="166" alt="Screenshot 2025-11-25 2 48 03 PM" src="https://github.com/user-attachments/assets/9fb2b478-4ee3-498d-a771-d586d3a7a8fe" /></br>
4. The app will now work offline and can be launched like a native application

https://github.com/user-attachments/assets/986de6a3-47e3-436b-91f5-e169a6a67a4a

We are working on a desktop app for more native access and integration, but this is the best you can get for now, but it is quite great for what it has.

### Enhancements and Improvements
*   **Plenty of Addons:** Dozens of community-built addons for custom blocks, UI tweaks, and new functionality. Many are inherited from TurboWarp and other mods from now, but we will implement some new ones soon.
<!--*   **Themes:** Multiple color themes (Aqua, Blue, Rainbow, Red, Purple) to personalize your editor. The Aqua theme is the default, as it is the main brand color of OmniBlocks.
note: this part of the readme got removed because we didn't really make the theme system, turbowarp did, and we just inherited it and added our Aqua theme-->
*   **OmniBlocks IDE:** OmniBlocks plans to be a full-featured IDE extending beyond blocks. There will be editors for text languages like Python and C in the future!
*   **Integrated Tools:** Includes a custom music editor and other quality-of-life improvements. Keep in mind that if you're seeing this, it means the music editor is currently not fully implemented. It works, you can go try it out, but it doesn't fully integrate with OmniBlocks just yet.
*   **Quality of Life**: As said earlier, we add a bunch of subtle, but definitely cool or useful quality-of-life additions, even if they seem niche or workaroundable. Most of these stem from mild annoyances that we ourselves have had, and don't hesitate to report yours too in the issues tab!

### A great feature inherited from TurboWarp: 
*   **High Performance:** This is a fork of TurboWarp, meaning it uses the compiler that TurboWarp uses, making projects run way faster than other projects. This isn't listed as an enhancement/feature since we didn't implement it; the team at TurboWarp did, and we don't claim to have written the TurboWarp compiler that makes OmniBlocks projects run so fast. 

## Quick Start

Want to create your own modification/fork of OmniBlocks, or help contribute to it? Follow the following steps:


### Prerequisites

*   Node.js version Node.js v22 (versions v18 or newer will probably work, but we can’t guarantee it)
*   npm 
*   Git (duhh) 
If you're using a GitHub Codespace, all these things come preinstalled.
**Note about GitHub Codespaces**: to create a GitHub codespace, make sure you are on the repo you want to code in, such as your fork of OmniBlocks. When you are there, click the big green button that says "Code". On the Codespace tab, click the button saying "Create codespace on main". Now, just wait a few minutes, and it will install everything for you. 
<!-- wait like 6 or 7 minutes lol !-->
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
* scratch-caffeine /j

Here's a diagram to help you understand how these are connected:

```mermaid
graph TD
    A["scratch-gui<br/>Main Editor Interface"] --> B["scratch-vm<br/>Virtual Machine"]
    A --> C["scratch-render<br/>WebGL Renderer"]
    A --> D["scratch-paint<br/>Vector Editor"]
    A --> E["scratch-blocks<br/>Block Editor"]
    A --> F["scratch-audio<br/>Audio Engine"]
    B --> G["scratch-storage<br/>Asset Manager"]
    C --> H["scratch-svg-renderer<br/>SVG Processor"]
    B --> I["scratch-parser<br/>Project Parser"]
    B --> J["scratch-l10n<br/>i18n System"]
    
    style A fill:#4C97FF,color:#fff
    style B fill:#FF6680,color:#fff
    style C fill:#FFAB19,color:#fff
    style D fill:#0FBD8C,color:#fff
    style E fill:#CF63CF,color:#fff
    style F fill:#9966FF,color:#fff
    style G fill:#FF6680,color:#fff
    style H fill:#FFAB19,color:#fff
    style I fill:#FF6680,color:#fff
    style J fill:#FF6680,color:#fff
```



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
    *(If you do decide to use `npm install`, it has to be `npm install --legacy-peer-deps` so it doesn't error)*

3.  **Start the development server:**
    ```bash
    npm start
    ```
    The GUI will open in your browser at `http://localhost:8601`. If you're using GitHub Codespaces, it will be `https://<codespace-name>-<codespace-hash>-8601.app.github.dev/`

4.  **To create a production build:**
    ```bash
    npm run build
    ```
    Output will be in the `build/` directory. You can then use this output with a GitHub Actions workflow or other CI to push to a website or something like that. If you go to our [site build repo,](https://github.com/OmniBlocks/omniblocks.github.io) you can use the `sh` script and `yml` workflow from there 😁


## Development Guide

This section is for developers looking to understand, modify, or contribute to the codebase.

### Data Flow & Structure
- **State Management:** Uses Redux. Reducers are located in `src/reducers/`.
- **Core GUI Logic:** Located in `src/`.
- **Addons:** Managed in `src/addons/`. Synced and patched from upstream repositories using `pull.js`. If you try hard enough you can make your own by making all the files you need yourself, which is what we do here.
- **Extensions:** Custom blocks and hardware integrations are in `src/lib/libraries/extensions/`. Extensions are in scratch-vm, an external dependency. You'll need to fork that separate repository with your changes there, and link the new forked repository to scratch-vm. This isn't very easy if you don't know much about NPM, so we're sorry about this, although we might move to the monorepo that doesn't require all these repos someday. You can still do it manually by editing the `package.json` file.
- **Translations:** Located in `src/lib/tw-translations/`.
- **Theming:** Theme definitions (Aqua, Blue, etc.) are in `src/lib/themes/accent/<theme>.js`. Global color variables are set in `src/css/colors.css` and overridden in JS as needed.

### Key Workflows
- **Adding a New Addon:** Create a new directory within `src/addons/` with all necessary files and ensure it's imported in the `.js` files located in `src/addons/generated`.
- **Modifying Themes:** Make a new file and title it "<color-name>.js". For example, if you want to make a new yellow theme, you can do "yellow.js". Then look for all the other JS files where the themes are imported, such as scratch-gui/src/lib/themes/index.js.
- **Debugging:** For build issues, inspect the output in the `build/` directory or check the console output from `npm run build`.


### Integration Points
- **Extension Gallery:** `src/lib/libraries/extensions/`
- **Static Assets:**  `static/`.

## Licensing

This project is licensed under multiple agreements due to its forked nature.

- **OmniBlocks & TurboWarp Modifications:** Licensed under the **GNU Affero General Public License v3.0**. See the `LICENSE` file or [gnu.org/licenses](https://www.gnu.org/licenses/) for details.

- **Original TurboWarp Code (BSD License):** Copyright (c) TurboWarp contributors. The original license text is retained below as required.

- **Original Scratch Code (BSD License):** Copyright (c) 2016, Massachusetts Institute of Technology. The original license text is retained below as required.

- **Assets:**
  - `src/lib/default-project/dango.svg`: Based on Twemoji, licensed under CC BY 4.0.
  - **OmniBlocks Logo:** Licensed under CC BY-SA 4.0. Incorporates the Python logo (a trademark of the Python Software Foundation) for referential purposes. This project is not affiliated with or endorsed by the Python Software Foundation.
  - **OmniBlocks Mascot "Boxy":** Licensed under CC BY-SA 4.0.
 
While the Logo and Mascot are open source, please do not attempt to impersonate us or try to act on "our behalf" and claim something is endorsed by us when it is not.

<details>
<summary>Original Scratch (BSD) License</summary>

Copyright (c) 2016, Massachusetts Institute of Technology All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

</details>

<details>
<summary>Original TurboWarp (GPL-3.0) License</summary>

```
                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU General Public License is a free, copyleft license for
software and other kinds of works.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
the GNU General Public License is intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.  We, the Free Software Foundation, use the
GNU General Public License for most of our software; it applies also to
any other work released this way by its authors.  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

  To protect your rights, we need to prevent others from denying you
these rights or asking you to surrender the rights.  Therefore, you have
certain responsibilities if you distribute copies of the software, or if
you modify it: responsibilities to respect the freedom of others.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must pass on to the recipients the same
freedoms that you received.  You must make sure that they, too, receive
or can get the source code.  And you must show them these terms so they
know their rights.

  Developers that use the GNU GPL protect your rights with two steps:
(1) assert copyright on the software, and (2) offer you this License
giving you legal permission to copy, distribute and/or modify it.

  For the developers' and authors' protection, the GPL clearly explains
that there is no warranty for this free software.  For both users' and
authors' sake, the GPL requires that modified versions be marked as
changed, so that their problems will not be attributed erroneously to
authors of previous versions.

  Some devices are designed to deny users access to install or run
modified versions of the software inside them, although the manufacturer
can do so.  This is fundamentally incompatible with the aim of
protecting users' freedom to change the software.  The systematic
pattern of such abuse occurs in the area of products for individuals to
use, which is precisely where it is most unacceptable.  Therefore, we
have designed this version of the GPL to prohibit the practice for those
products.  If such problems arise substantially in other domains, we
stand ready to extend this provision to those domains in future versions
of the GPL, as needed to protect the freedom of users.

  Finally, every program is threatened constantly by software patents.
States should not allow patents to restrict development and use of
software on general-purpose computers, but in those that do, we wish to
avoid the special danger that patents applied to a free program could
make it effectively proprietary.  To prevent this, the GPL assures that
patents cannot be used to render the program non-free.

  The precise terms and conditions for copying, distribution and
modification follow.

                       TERMS AND CONDITIONS

  0. Definitions.

  "This License" refers to version 3 of the GNU General Public License.

  "Copyright" also means copyright-like laws that apply to other kinds of
works, such as semiconductor masks.

  "The Program" refers to any copyrightable work licensed under this
License.  Each licensee is addressed as "you".  "Licensees" and
"recipients" may be individuals or organizations.

  To "modify" a work means to copy from or adapt all or part of the work
in a fashion requiring copyright permission, other than the making of an
exact copy.  The resulting work is called a "modified version" of the
earlier work or a work "based on" the earlier work.

  A "covered work" means either the unmodified Program or a work based
on the Program.

  To "propagate" a work means to do anything with it that, without
permission, would make you directly or secondarily liable for
infringement under applicable copyright law, except executing it on a
computer or modifying a private copy.  Propagation includes copying,
distribution (with or without modification), making available to the
public, and in some countries other activities as well.

  To "convey" a work means any kind of propagation that enables other
parties to make or receive copies.  Mere interaction with a user through
a computer network, with no transfer of a copy, is not conveying.

  An interactive user interface displays "Appropriate Legal Notices"
to the extent that it includes a convenient and prominently visible
feature that (1) displays an appropriate copyright notice, and (2)
tells the user that there is no warranty for the work (except to the
extent that warranties are provided), that licensees may convey the
work under this License, and how to view a copy of this License.  If
the interface presents a list of user commands or options, such as a
menu, a prominent item in the list meets this criterion.

  1. Source Code.

  The "source code" for a work means the preferred form of the work
for making modifications to it.  "Object code" means any non-source
form of a work.

  A "Standard Interface" means an interface that either is an official
standard defined by a recognized standards body, or, in the case of
interfaces specified for a particular programming language, one that
is widely used among developers working in that language.

  The "System Libraries" of an executable work include anything, other
than the work as a whole, that (a) is included in the normal form of
packaging a Major Component, but which is not part of that Major
Component, and (b) serves only to enable use of the work with that
Major Component, or to implement a Standard Interface for which an
implementation is available to the public in source code form.  A
"Major Component", in this context, means a major essential component
(kernel, window system, and so on) of the specific operating system
(if any) on which the executable work runs, or a compiler used to
produce the work, or an object code interpreter used to run it.

  The "Corresponding Source" for a work in object code form means all
the source code needed to generate, install, and (for an executable
work) run the object code and to modify the work, including scripts to
control those activities.  However, it does not include the work's
System Libraries, or general-purpose tools or generally available free
programs which are used unmodified in performing those activities but
which are not part of the work.  For example, Corresponding Source
includes interface definition files associated with source files for
the work, and the source code for shared libraries and dynamically
linked subprograms that the work is specifically designed to require,
such as by intimate data communication or control flow between those
subprograms and other parts of the work.

  The Corresponding Source need not include anything that users
can regenerate automatically from other parts of the Corresponding
Source.

  The Corresponding Source for a work in source code form is that
same work.

  2. Basic Permissions.

  All rights granted under this License are granted for the term of
copyright on the Program, and are irrevocable provided the stated
conditions are met.  This License explicitly affirms your unlimited
permission to run the unmodified Program.  The output from running a
covered work is covered by this License only if the output, given its
content, constitutes a covered work.  This License acknowledges your
rights of fair use or other equivalent, as provided by copyright law.

  You may make, run and propagate covered works that you do not
convey, without conditions so long as your license otherwise remains
in force.  You may convey covered works to others for the sole purpose
of having them make modifications exclusively for you, or provide you
with facilities for running those works, provided that you comply with
the terms of this License in conveying all material for which you do
not control copyright.  Those thus making or running the covered works
for you must do so exclusively on your behalf, under your direction
and control, on terms that prohibit them from making any copies of
your copyrighted material outside their relationship with you.

  Conveying under any other circumstances is permitted solely under
the conditions stated below.  Sublicensing is not allowed; section 10
makes it unnecessary.

  3. Protecting Users' Legal Rights From Anti-Circumvention Law.

  No covered work shall be deemed part of an effective technological
measure under any applicable law fulfilling obligations under article
11 of the WIPO copyright treaty adopted on 20 December 1996, or
similar laws prohibiting or restricting circumvention of such
measures.

  When you convey a covered work, you waive any legal power to forbid
circumvention of technological measures to the extent such circumvention
is effected by exercising rights under this License with respect to
the covered work, and you disclaim any intention to limit operation or
modification of the work as a means of enforcing, against the work's
users, your or third parties' legal rights to forbid circumvention of
technological measures.

  4. Conveying Verbatim Copies.

  You may convey verbatim copies of the Program's source code as you
receive it, in any medium, provided that you conspicuously and
appropriately publish on each copy an appropriate copyright notice;
keep intact all notices stating that this License and any
non-permissive terms added in accord with section 7 apply to the code;
keep intact all notices of the absence of any warranty; and give all
recipients a copy of this License along with the Program.

  You may charge any price or no price for each copy that you convey,
and you may offer support or warranty protection for a fee.

  5. Conveying Modified Source Versions.

  You may convey a work based on the Program, or the modifications to
produce it from the Program, in the form of source code under the
terms of section 4, provided that you also meet all of these conditions:

    a) The work must carry prominent notices stating that you modified
    it, and giving a relevant date.

    b) The work must carry prominent notices stating that it is
    released under this License and any conditions added under section
    7.  This requirement modifies the requirement in section 4 to
    "keep intact all notices".

    c) You must license the entire work, as a whole, under this
    License to anyone who comes into possession of a copy.  This
    License will therefore apply, along with any applicable section 7
    additional terms, to the whole of the work, and all its parts,
    regardless of how they are packaged.  This License gives no
    permission to license the work in any other way, but it does not
    invalidate such permission if you have separately received it.

    d) If the work has interactive user interfaces, each must display
    Appropriate Legal Notices; however, if the Program has interactive
    interfaces that do not display Appropriate Legal Notices, your
    work need not make them do so.

  A compilation of a covered work with other separate and independent
works, which are not by their nature extensions of the covered work,
and which are not combined with it such as to form a larger program,
in or on a volume of a storage or distribution medium, is called an
"aggregate" if the compilation and its resulting copyright are not
used to limit the access or legal rights of the compilation's users
beyond what the individual works permit.  Inclusion of a covered work
in an aggregate does not cause this License to apply to the other
parts of the aggregate.

  6. Conveying Non-Source Forms.

  You may convey a covered work in object code form under the terms
of sections 4 and 5, provided that you also convey the
machine-readable Corresponding Source under the terms of this License,
in one of these ways:

    a) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by the
    Corresponding Source fixed on a durable physical medium
    customarily used for software interchange.

    b) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by a
    written offer, valid for at least three years and valid for as
    long as you offer spare parts or customer support for that product
    model, to give anyone who possesses the object code either (1) a
    copy of the Corresponding Source for all the software in the
    product that is covered by this License, on a durable physical
    medium customarily used for software interchange, for a price no
    more than your reasonable cost of physically performing this
    conveying of source, or (2) access to copy the
    Corresponding Source from a network server at no charge.

    c) Convey individual copies of the object code with a copy of the
    written offer to provide the Corresponding Source.  This
    alternative is allowed only occasionally and noncommercially, and
    only if you received the object code with such an offer, in accord
    with subsection 6b.

    d) Convey the object code by offering access from a designated
    place (gratis or for a charge), and offer equivalent access to the
    Corresponding Source in the same way through the same place at no
    further charge.  You need not require recipients to copy the
    Corresponding Source along with the object code.  If the place to
    copy the object code is a network server, the Corresponding Source
    may be on a different server (operated by you or a third party)
    that supports equivalent copying facilities, provided you maintain
    clear directions next to the object code saying where to find the
    Corresponding Source.  Regardless of what server hosts the
    Corresponding Source, you remain obligated to ensure that it is
    available for as long as needed to satisfy these requirements.

    e) Convey the object code using peer-to-peer transmission, provided
    you inform other peers where the object code and Corresponding
    Source of the work are being offered to the general public at no
    charge under subsection 6d.

  A separable portion of the object code, whose source code is excluded
from the Corresponding Source as a System Library, need not be
included in conveying the object code work.

  A "User Product" is either (1) a "consumer product", which means any
tangible personal property which is normally used for personal, family,
or household purposes, or (2) anything designed or sold for incorporation
into a dwelling.  In determining whether a product is a consumer product,
doubtful cases shall be resolved in favor of coverage.  For a particular
product received by a particular user, "normally used" refers to a
typical or common use of that class of product, regardless of the status
of the particular user or of the way in which the particular user
actually uses, or expects or is expected to use, the product.  A product
is a consumer product regardless of whether the product has substantial
commercial, industrial or non-consumer uses, unless such uses represent
the only significant mode of use of the product.

  "Installation Information" for a User Product means any methods,
procedures, authorization keys, or other information required to install
and execute modified versions of a covered work in that User Product from
a modified version of its Corresponding Source.  The information must
suffice to ensure that the continued functioning of the modified object
code is in no case prevented or interfered with solely because
modification has been made.

  If you convey an object code work under this section in, or with, or
specifically for use in, a User Product, and the conveying occurs as
part of a transaction in which the right of possession and use of the
User Product is transferred to the recipient in perpetuity or for a
fixed term (regardless of how the transaction is characterized), the
Corresponding Source conveyed under this section must be accompanied
by the Installation Information.  But this requirement does not apply
if neither you nor any third party retains the ability to install
modified object code on the User Product (for example, the work has
been installed in ROM).

  The requirement to provide Installation Information does not include a
requirement to continue to provide support service, warranty, or updates
for a work that has been modified or installed by the recipient, or for
the User Product in which it has been modified or installed.  Access to a
network may be denied when the modification itself materially and
adversely affects the operation of the network or violates the rules and
protocols for communication across the network.

  Corresponding Source conveyed, and Installation Information provided,
in accord with this section must be in a format that is publicly
documented (and with an implementation available to the public in
source code form), and must require no special password or key for
unpacking, reading or copying.

  7. Additional Terms.

  "Additional permissions" are terms that supplement the terms of this
License by making exceptions from one or more of its conditions.
Additional permissions that are applicable to the entire Program shall
be treated as though they were included in this License, to the extent
that they are valid under applicable law.  If additional permissions
apply only to part of the Program, that part may be used separately
under those permissions, but the entire Program remains governed by
this License without regard to the additional permissions.

  When you convey a copy of a covered work, you may at your option
remove any additional permissions from that copy, or from any part of
it.  (Additional permissions may be written to require their own
removal in certain cases when you modify the work.)  You may place
additional permissions on material, added by you to a covered work,
for which you have or can give appropriate copyright permission.

  Notwithstanding any other provision of this License, for material you
add to a covered work, you may (if authorized by the copyright holders of
that material) supplement the terms of this License with terms:

    a) Disclaiming warranty or limiting liability differently from the
    terms of sections 15 and 16 of this License; or

    b) Requiring preservation of specified reasonable legal notices or
    author attributions in that material or in the Appropriate Legal
    Notices displayed by works containing it; or

    c) Prohibiting misrepresentation of the origin of that material, or
    requiring that modified versions of such material be marked in
    reasonable ways as different from the original version; or

    d) Limiting the use for publicity purposes of names of licensors or
    authors of the material; or

    e) Declining to grant rights under trademark law for use of some
    trade names, trademarks, or service marks; or

    f) Requiring indemnification of licensors and authors of that
    material by anyone who conveys the material (or modified versions of
    it) with contractual assumptions of liability to the recipient, for
    any liability that these contractual assumptions directly impose on
    those licensors and authors.

  All other non-permissive additional terms are considered "further
restrictions" within the meaning of section 10.  If the Program as you
received it, or any part of it, contains a notice stating that it is
governed by this License along with a term that is a further
restriction, you may remove that term.  If a license document contains
a further restriction but permits relicensing or conveying under this
License, you may add to a covered work material governed by the terms
of that license document, provided that the further restriction does
not survive such relicensing or conveying.

  If you add terms to a covered work in accord with this section, you
must place, in the relevant source files, a statement of the
additional terms that apply to those files, or a notice indicating
where to find the applicable terms.

  Additional terms, permissive or non-permissive, may be stated in the
form of a separately written license, or stated as exceptions;
the above requirements apply either way.

  8. Termination.

  You may not propagate or modify a covered work except as expressly
provided under this License.  Any attempt otherwise to propagate or
modify it is void, and will automatically terminate your rights under
this License (including any patent licenses granted under the third
paragraph of section 11).

  However, if you cease all violation of this License, then your
license from a particular copyright holder is reinstated (a)
provisionally, unless and until the copyright holder explicitly and
finally terminates your license, and (b) permanently, if the copyright
holder fails to notify you of the violation by some reasonable means
prior to 60 days after the cessation.

  Moreover, your license from a particular copyright holder is
reinstated permanently if the copyright holder notifies you of the
violation by some reasonable means, this is the first time you have
received notice of violation of this License (for any work) from that
copyright holder, and you cure the violation prior to 30 days after
your receipt of the notice.

  Termination of your rights under this section does not terminate the
licenses of parties who have received copies or rights from you under
this License.  If your rights have been terminated and not permanently
reinstated, you do not qualify to receive new licenses for the same
material under section 10.

  9. Acceptance Not Required for Having Copies.

  You are not required to accept this License in order to receive or
run a copy of the Program.  Ancillary propagation of a covered work
occurring solely as a consequence of using peer-to-peer transmission
to receive a copy likewise does not require acceptance.  However,
nothing other than this License grants you permission to propagate or
modify any covered work.  These actions infringe copyright if you do
not accept this License.  Therefore, by modifying or propagating a
covered work, you indicate your acceptance of this License to do so.

  10. Automatic Licensing of Downstream Recipients.

  Each time you convey a covered work, the recipient automatically
receives a license from the original licensors, to run, modify and
propagate that work, subject to this License.  You are not responsible
for enforcing compliance by third parties with this License.

  An "entity transaction" is a transaction transferring control of an
organization, or substantially all assets of one, or subdividing an
organization, or merging organizations.  If propagation of a covered
work results from an entity transaction, each party to that
transaction who receives a copy of the work also receives whatever
licenses to the work the party's predecessor in interest had or could
give under the previous paragraph, plus a right to possession of the
Corresponding Source of the work from the predecessor in interest, if
the predecessor has it or can get it with reasonable efforts.

  You may not impose any further restrictions on the exercise of the
rights granted or affirmed under this License.  For example, you may
not impose a license fee, royalty, or other charge for exercise of
rights granted under this License, and you may not initiate litigation
(including a cross-claim or counterclaim in a lawsuit) alleging that
any patent claim is infringed by making, using, selling, offering for
sale, or importing the Program or any portion of it.

  11. Patents.

  A "contributor" is a copyright holder who authorizes use under this
License of the Program or a work on which the Program is based.  The
work thus licensed is called the contributor's "contributor version".

  A contributor's "essential patent claims" are all patent claims
owned or controlled by the contributor, whether already acquired or
hereafter acquired, that would be infringed by some manner, permitted
by this License, of making, using, or selling its contributor version,
but do not include claims that would be infringed only as a
consequence of further modification of the contributor version.  For
purposes of this definition, "control" includes the right to grant
patent sublicenses in a manner consistent with the requirements of
this License.

  Each contributor grants you a non-exclusive, worldwide, royalty-free
patent license under the contributor's essential patent claims, to
make, use, sell, offer for sale, import and otherwise run, modify and
propagate the contents of its contributor version.

  In the following three paragraphs, a "patent license" is any express
agreement or commitment, however denominated, not to enforce a patent
(such as an express permission to practice a patent or covenant not to
sue for patent infringement).  To "grant" such a patent license to a
party means to make such an agreement or commitment not to enforce a
patent against the party.

  If you convey a covered work, knowingly relying on a patent license,
and the Corresponding Source of the work is not available for anyone
to copy, free of charge and under the terms of this License, through a
publicly available network server or other readily accessible means,
then you must either (1) cause the Corresponding Source to be so
available, or (2) arrange to deprive yourself of the benefit of the
patent license for this particular work, or (3) arrange, in a manner
consistent with the requirements of this License, to extend the patent
license to downstream recipients.  "Knowingly relying" means you have
actual knowledge that, but for the patent license, your conveying the
covered work in a country, or your recipient's use of the covered work
in a country, would infringe one or more identifiable patents in that
country that you have reason to believe are valid.

  If, pursuant to or in connection with a single transaction or
arrangement, you convey, or propagate by procuring conveyance of, a
covered work, and grant a patent license to some of the parties
receiving the covered work authorizing them to use, propagate, modify
or convey a specific copy of the covered work, then the patent license
you grant is automatically extended to all recipients of the covered
work and works based on it.

  A patent license is "discriminatory" if it does not include within
the scope of its coverage, prohibits the exercise of, or is
conditioned on the non-exercise of one or more of the rights that are
specifically granted under this License.  You may not convey a covered
work if you are a party to an arrangement with a third party that is
in the business of distributing software, under which you make payment
to the third party based on the extent of your activity of conveying
the work, and under which the third party grants, to any of the
parties who would receive the covered work from you, a discriminatory
patent license (a) in connection with copies of the covered work
conveyed by you (or copies made from those copies), or (b) primarily
for and in connection with specific products or compilations that
contain the covered work, unless you entered into that arrangement,
or that patent license was granted, prior to 28 March 2007.

  Nothing in this License shall be construed as excluding or limiting
any implied license or other defenses to infringement that may
otherwise be available to you under applicable patent law.

  12. No Surrender of Others' Freedom.

  If conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot convey a
covered work so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you may
not convey it at all.  For example, if you agree to terms that obligate you
to collect a royalty for further conveying from those to whom you convey
the Program, the only way you could satisfy both those terms and this
License would be to refrain entirely from conveying the Program.

  13. Use with the GNU Affero General Public License.

  Notwithstanding any other provision of this License, you have
permission to link or combine any covered work with a work licensed
under version 3 of the GNU Affero General Public License into a single
combined work, and to convey the resulting work.  The terms of this
License will continue to apply to the part which is the covered work,
but the special requirements of the GNU Affero General Public License,
section 13, concerning interaction through a network will apply to the
combination as such.

  14. Revised Versions of this License.

  The Free Software Foundation may publish revised and/or new versions of
the GNU General Public License from time to time.  Such new versions will
be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

  Each version is given a distinguishing version number.  If the
Program specifies that a certain numbered version of the GNU General
Public License "or any later version" applies to it, you have the
option of following the terms and conditions either of that numbered
version or of any later version published by the Free Software
Foundation.  If the Program does not specify a version number of the
GNU General Public License, you may choose any version ever published
by the Free Software Foundation.

  If the Program specifies that a proxy can decide which future
versions of the GNU General Public License can be used, that proxy's
public statement of acceptance of a version permanently authorizes you
to choose that version for the Program.

  Later license versions may give you additional or different
permissions.  However, no additional obligations are imposed on any
author or copyright holder as a result of your choosing to follow a
later version.

  15. Disclaimer of Warranty.

  THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
IS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
ALL NECESSARY SERVICING, REPAIR OR CORRECTION.

  16. Limitation of Liability.

  IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES AND/OR CONVEYS
THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY
GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE
USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO LOSS OF
DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD
PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS),
EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF
SUCH DAMAGES.

  17. Interpretation of Sections 15 and 16.

  If the disclaimer of warranty and limitation of liability provided
above cannot be given local legal effect according to their terms,
reviewing courts shall apply local law that most closely approximates
an absolute waiver of all civil liability in connection with the
Program, unless a warranty or assumption of liability accompanies a
copy of the Program in return for a fee.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
state the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

  If the program does terminal interaction, make it output a short
notice like this when it starts in an interactive mode:

    <program>  Copyright (C) <year>  <name of author>
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.

The hypothetical commands `show w' and `show c' should show the appropriate
parts of the General Public License.  Of course, your program's commands
might be different; for a GUI interface, you would use an "about box".

  You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU GPL, see
<https://www.gnu.org/licenses/>.

  The GNU General Public License does not permit incorporating your program
into proprietary programs.  If your program is a subroutine library, you
may consider it more useful to permit linking proprietary applications with
the library.  If this is what you want to do, use the GNU Lesser General
Public License instead of this License.  But first, please read
<https://www.gnu.org/licenses/why-not-lgpl.html>.
```

</details>

## Contributing

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
As you may know from the earlier parts of the readme, this is all made in React JS, a modular JavaScript UI framework. We're pretty laid back, so we don't have a super strict style guide or coding conventions, just know the following:

-  Go all out on your code! It doesn't matter if you don't use proper indentation, or other stuff like that, just make sure to add comments explaining it. After all, this is JavaScript, not Python we're talking about, so any valid syntax is valid syntax.
-  Make sure your variables are readable. While everyone loves fun code, please make sure your variables are legible. For example, if you need a variable for a new multi-backpack feature you're planning to add (not quite sure what the feature would do, but it's just an example), we'd prefer "multibackpack" or even "backpackthing" over "qwnpvoitwegjk".
- Absolutely NO profanity. I have seen other repos have profanity in commit messages or comments, and while it is relatable and even hilarious to see how miserably we fail at code sometimes, there is no need to use profanity. Since our project is for All Ages and open source, we assume anyone of all ages will also see the code. Some words, however, are not considered profanity, such as crap or heck. If you snoop in _OUR_ commit messages, we have some pretty hilarious frustrations in there too! Just no bad words.
Other than that, Code On! We don't require much other than these rules. Have fun!


## ❓ Frequently Asked Questions (FAQ)

### General Questions

**Q: What is OmniBlocks?**  
A: OmniBlocks is an enhanced fork of TurboWarp for faster project execution, adds quality-of-life features, and constant updates. We hope to become a full-fledged IDE one day!

**Q: How is OmniBlocks different from TurboWarp?**  
A: While we use TurboWarp's excellent compiler and extra features, OmniBlocks focuses on providing a more advanced, mature IDE. We plan to be able to be used by kids and adults alike, adding new advanced features for already knowledgeable coders, as well as being able to be booted up by children and/or beginners to explore programming. We will also be exploring additional features like alternative language editors (Python/C) in the future.

**Q: Is OmniBlocks free to use?**  
A: Yes! OmniBlocks is open-source and free forever! Unless you count paying your internet provider as an indirect fee ;)

**Q: I hate Ommiblocks**  
A: 67

### Compatibility

**Q: Can I use my Scratch account with OmniBlocks?**  
A: You can't log in with your Scratch Accounts for integration with OmniBlocks, and we don't have any planned features that would use such a thing. Please remember that giving your Scratch password to ANY site, even if it seems good, could be used as bait and take over your Scratch account. If we ever do implement such integration, it will be through secure authentication services, such as ScratchAuth. 
Anyways, you can import/export `.sb3` project files to load a Scratch project into OmniBlocks and code there, and even use the new tools and features to aid development.

**Q: Will projects created in OmniBlocks work in vanilla Scratch?**  
A: Yes! As long as you don't use extensions that add custom blocks not available in vanilla Scratch, your projects will work perfectly. The TurboWarp compiler only affects runtime performance, not project compatibility.

**Q: Can I import my existing Scratch projects?**  
A: Absolutely! Just click "File > Load from your computer" and select your `.sb3` or `.sb2` file. Or even `.sb` if you still use 1.x, ~unc~.

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
A: OmniBlocks runs in any modern web browser (Chrome, Firefox, Safari, Edge). Keep in mind that for the best performance and features, Chromium-based browsers are significantly faster, such as Chrome or Edge. For development, you'll need Node.js 18+ and npm. If you don't have access to such tools (for example, if you want to develop on an iPad or tablet), you can start a GitHub Codespace, which is a free browser environment for coding.
For best feature support, install on Microsoft Edge/Chrome as a PWA. As a Firefox user myself, yes, this is painful.

**Q: Can I self-host OmniBlocks?**  
A: Yes! Follow the development setup instructions above, then build the project with `npm run build`. The output in the `build/` directory can be hosted on any static web server.

**Q: The editor is slow/laggy. What can I do?**  
A: Try these steps:
1. Close unnecessary browser tabs
2. Make sure you're using a modern browser
3. Check if your project has very large assets or complex scripts
4. Check for infinite loops in your code or scripts running under custom blocks with "Run without screen refresh" enabled

**Q: I found a bug! Where do I report it?**  
A: Please open an issue on our GitHub repository with:
- A clear description of the bug
- Steps to reproduce it
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable, screen video recordings are even better

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
- @supervoidcoder: [scratchcode1_2_3](https://scratch.mit.edu/users/scratchcode1_2_3/)
- @8to16: [AmpElectrecuted](https://scratch.mit.edu/users/AmpElectrecuted/) or [8to16](https://scratch.mit.edu/users/8to16/) (banned, unfortunately)
- @Graison-P: [GvYoutube](https://scratch.mit.edu/users/GvYoutube/)
- @NotTheBaton: [TheBaton](https://scratch.mit.edu/users/TheBaton/)

**Q: I tried submitting a pull request for OmniBlocks, but I got tons of lint errors.**
A: Ignore lint. It's only there because it is from upstream, but we don't actually use it. As long as the code itself compiles and runs and is, well, functional, I could literally NOT care LESS if you're indenting with tabs, spaces, or you put 6 or 7 indents instead of 4. Just make sure your code works 😎

## Roadmap

### Current Focus
- [ ] JavaScript Extension
- [ ] Complete music editor integration 

Update: As of 11/12/2025, there is even better integration with the music editor, but it is still largely lacking. The music editor still doesn't have blocks to play your songs with or are stored in the project, but the Iframe is styled way better so it doesn't look like an iframe anymore, and using postmessage, it allows for you to download your songs using the existing export buttons in the song editor, as well as a fullscreen button, so it is far more usable than before where you had to go to omniblocks.github.io/songeditor just for it to be useful (as it's the standalone html instead of the iframe.) We got this working by using a function in the HTML that if detected it was an iframe, it intercepted incoming downloaded files and sent them using postmessage to the mainwindow as payload to be downloaded.


### Short-term Goals (Next 3-6 months)
- [ ] Add monaco react editor

### Long-term Vision
- [ ] Full Python/C++ IDE integration
- [ ] Plugin system for community extensions
- [ ] Advanced debugging tools
- [ ] Specialized Mobile app version
- [ ] Electron App for even deeper integration that PWA's just can't have

### Completed ✅
- [x] Add a bunch of small QoL features




**Still have questions?** Feel free to open an issue here or start a discussion on our GitHub organization!

**Made a mod or a cool project?** We would love to see what people are creating! If you made your own mod of OmniBlocks or made a cool project in it, show it off in [the Discussion tab!](https://github.com/orgs/OmniBlocks/discussions)

<!-- thisi is not a six seeven joke !-->
---
## Vibe Coding
As you can tell by some of the slop in this codebase, I have, for the past month, been experimenting with different AI tools to aid in development of OmniBlocks. I can confirm that it sucks, and I apologize for polluting the codebase with slop. I am in progress of writing about this in an article about my stance on AI that I will show to everyone soon. I will also start to write more code by myself and my fellow human contributors, as it AI is detrimental to my own skills as well.
If you are planning to contribute to OmniBlocks, please don't vibe code large features, or preferably, anything at all. From my experience, AI is best for repetitive, mild tasks, like updating things across files quickly or adding small features, but even these have to go through a review process that takes about 2 days for me. Please don't make PRs with features that are entirely AI-generated, especially if you didn't test the code or review it.


**Note:** This is a fork designed specifically for OmniBlocks. If you want to make your own Scratch or TurboWarp mod, please refer to the [upstream scratch-gui repository](https://github.com/LLK/scratch-gui) or the [TurboWarp scratch-gui repository](https://github.com/TurboWarp/scratch-gui) instead.

<details><summary>NASA Secret Information</summary>
:egg:
</details>
