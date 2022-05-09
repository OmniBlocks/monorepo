## TurboWarp/scratch-vm

Modified Scratch VM with a JIT compiler and more features.

The public API of TurboWarp/scratch-vm should be compatible with LLK/scratch-vm. See "Public API" section below for more information.

## Setup

See https://github.com/TurboWarp/scratch-gui/wiki/Getting-Started to setup the complete TurboWarp environment.

If you just want to play with the VM then it's the same process as upstream scratch-vm.

## Extension authors

If you only use the standard reporter, boolean, and command block types, everything should just work without any changes.

## Compiler Overview

For a high-level overview of how the compiler works, see https://docs.turbowarp.org/how

For more technical information, read the code in src/compiler.

## Public API

**This section has not been updated in a while and is probably out of date.**

Any public-facing API in LLK/scratch-vm *should* work just fine in TurboWarp/scratch-vm. Anything that doesn't is a bug. TurboWarp adds some new methods to the public API.

### Runtime.setFramerate / VirtualMachine.setFramerate

setCompatibilityMode is deprecated (but still works) in favor of a generic setFramerate method.

```js
runtime.setFramerate(60);
```

There is an event for framerate changes on Runtime and VirtualMachine: FRAMERATE_CHANGED (emitted with new framerate as only argument)

### Runtime.setInterpolation / VirtualMachine.setInterpolation

Toggles frame interpolation, an experimental feature that tries to make project motion smoother without changing the script tick rate.

There is an event for changes on Runtime and VirtualMachine: INTERPOLATION_CHANGED

### Runtime.setCompilerOptions / VirtualMachine.setCompilerOptions

This lets you change the behavior of the compiler. This method takes an object with the following arguments:

 - enabled (boolean; default true) - controls whether the JIT compiler is enabled
 - warpTimer (boolean; default false) - controls whether to use a warp timer to limit how long warp scripts can run. Can have significant performance impact

```js
runtime.setCompilerOptions({
  enabled: true,
  warpTimer: true
});
// Partial updates are also supported -- this will only change `enabled` and not any other properties
runtime.setCompilerOptions({ enabled: false });
```

There is an event for compiler option changes on Runtime and VirtualMachine: COMPILER_OPTIONS_CHANGED (called with current options)

### Runtime.setRuntimeOptions / VirtualMachine.setRuntimeOptions

Similar to setCompilerOption. This lets you control some behavior of the runtime.

 - maxClones (number; default 300) - controls the clone limit; Infinity to disable
 - miscLimits (boolean; default true) - controls various limits such as pitch, pan, etc.
 - fencing (number; default true) - controls whether sprite fencing should be enabled

There is an event for runtime option changes on Runtime and VirtualMachine: RUNTIME_OPTIONS_CHANGED (called with current options)

### Runtime.stop / VirtualMachine.stop

Stops the tick loop. This does not touch the active thread list. Anything currently active will be resumed when start is called again.

There is an event for stop on Runtime and VirtualMachine: RUNTIME_STOPPED (similar to RUNTIME_STARTED)

### Runtime.stageWidth / Runtime.stageHeight

These control the width and height of the stage. Set them to values other than 480 and 360 respectively to get custom stage sizes. Keep in mind that you need to manually resize the renderer as well.

### COMPILE_ERROR event

A COMPILE_ERROR is fired on Runtime and VirtualMachine when a script couldn't be compiled.

<!--

## scratch-vm
#### Scratch VM is a library for representing, running, and maintaining the state of computer programs written using [Scratch Blocks](https://github.com/LLK/scratch-blocks).

[![Build Status](https://travis-ci.org/LLK/scratch-vm.svg?branch=develop)](https://travis-ci.org/LLK/scratch-vm)
[![Coverage Status](https://coveralls.io/repos/github/LLK/scratch-vm/badge.svg?branch=develop)](https://coveralls.io/github/LLK/scratch-vm?branch=develop)

## Installation
This requires you to have Git and Node.js installed.

To install as a dependency for your own application:
```bash
npm install scratch-vm
```
To set up a development environment to edit scratch-vm yourself:
```bash
git clone https://github.com/LLK/scratch-vm.git
cd scratch-vm
npm install
```

## Development Server
This requires Node.js to be installed.

For convenience, we've included a development server with the VM. This is sometimes useful when running in an environment that's loading remote resources (e.g., SVGs from the Scratch server). If you would like to use your modified VM with the full Scratch 3.0 GUI, [follow the instructions to link the VM to the GUI](https://github.com/LLK/scratch-gui/wiki/Getting-Started).

## Running the Development Server
Open a Command Prompt or Terminal in the repository and run:
```bash
npm start
```

## Playground
To view the Playground, make sure the dev server's running and go to [http://localhost:8073/playground/](http://localhost:8073/playground/) - you will be directed to the playground, which demonstrates various tools and internal state.

![VM Playground Screenshot](https://i.imgur.com/nOCNqEc.gif)


## Standalone Build
```bash
npm run build
```

```html
<script src="/path/to/dist/web/scratch-vm.js"></script>
<script>
    var vm = new window.VirtualMachine();
    // do things
</script>
```

## How to include in a Node.js App
For an extended setup example, check out the /src/playground directory, which includes a fully running VM instance.
```js
var VirtualMachine = require('scratch-vm');
var vm = new VirtualMachine();

// Block events
Scratch.workspace.addChangeListener(vm.blockListener);

// Run threads
vm.start();
```

## Abstract Syntax Tree

#### Overview
The Virtual Machine constructs and maintains the state of an [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST) by listening to events emitted by the [scratch-blocks](https://github.com/LLK/scratch-blocks) workspace via the `blockListener`. Each target (code-running object, for example, a sprite) keeps an AST for its blocks. At any time, the current state of an AST can be viewed by inspecting the `vm.runtime.targets[...].blocks` object.

#### Anatomy of a Block
The VM's block representation contains all the important information for execution and storage. Here's an example representing the "when key pressed" script on a workspace:
```json
{
  "_blocks": {
    "Q]PK~yJ@BTV8Y~FfISeo": {
      "id": "Q]PK~yJ@BTV8Y~FfISeo",
      "opcode": "event_whenkeypressed",
      "inputs": {
      },
      "fields": {
        "KEY_OPTION": {
          "name": "KEY_OPTION",
          "value": "space"
        }
      },
      "next": null,
      "topLevel": true,
      "parent": null,
      "shadow": false,
      "x": -69.333333333333,
      "y": 174
    }
  },
  "_scripts": [
    "Q]PK~yJ@BTV8Y~FfISeo"
  ]
}
```

## Testing
```bash
npm test
```

```bash
npm run coverage
```

## Publishing to GitHub Pages
```bash
npm run deploy
```

This will push the currently built playground to the gh-pages branch of the
currently tracked remote.  If you would like to change where to push to, add
a repo url argument:
```bash
npm run deploy -- -r <your repo url>
```

## Donate
We provide [Scratch](https://scratch.mit.edu) free of charge, and want to keep it that way! Please consider making a [donation](https://secure.donationpay.org/scratchfoundation/) to support our continued engineering, design, community, and resource development efforts. Donations of any size are appreciated. Thank you!

-->
