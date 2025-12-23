/**
 * Based on https://github.com/scratchfoundation/scratch-blocks/compare/hotfix/totally-normal-2021 (Apache 2.0)
 * Modified to use custom SVG paths for a Santa Hat theme.
 */

export default async function ({ addon, console }) {
  const Blockly = await addon.tab.traps.getBlockly();
  // Set to true if you want the hat to lean toward the mouse (requires extra logic)
  const shouldWatchMouseCursor = false; 

  Blockly.BlockSvg.prototype.CAT_BLOCKS = true;
  Blockly.BlockSvg.START_HAT_HEIGHT = 36;


Blockly.BlockSvg.START_HAT_PATH = "M0,0";

  Blockly.BlockSvg.TOP_LEFT_CORNER_DEFINE_HAT =
    "M10,15 c0,0 60,0.7 80,7.4 c20,7.8 60,24.5 60,24.5 l-140,0 c0,0 15.1,-5.9 14.1,-11.8 c-1.4,-8.1 -27.1,-20.1 -27.1,-20.1 z";


  Blockly.BlockSvg.prototype.renderCatFace_ = function () {
    if (!this.santaHat_) {
      // Create a group and position it. 
      // We translate it to -25 to move it up onto the hat area and scale it down.
this.santaHat_ = Blockly.utils.createSvgElement("g", {
  "transform": "translate(-70, -97) scale(0.4)"
}, this.svgFace_);


      // Red Hat Body
      const hatBody = Blockly.utils.createSvgElement("path", {
        "d": "M172.5,143 c0,0 109.3,1.9 144.6,18.6 c41.2,19.4 108.8,61.3 108.8,61.3 l-221,0 c0,0 37.9,-14.9 35.3,-29.5 c-3.5,-20.2 -67.8,-50.4 -67.8,-50.4 z",
        "fill": "#ff0000",
        "stroke": "#550000",
        "stroke-width": "4"
      }, this.santaHat_);

      // White Pompom
      const pompom = Blockly.utils.createSvgElement("path", {
        "d": "M206,143.5 c0,13.5 -11.1,24.5 -25,24.5 c-13.8,0 -25,-11 -25,-24.5 c0,-13.5 11.1,-24.5 25,-24.5 c13.8,0 25,11 25,24.5 z",
        "fill": "#ffffff",
        "stroke": "#9f9f9fff",
        "stroke-width": "4"
      }, this.santaHat_);

      // White Brim
      const brim = Blockly.utils.createSvgElement("path", {
        "d": "M177,243 c-1.1,0 -2,-0.8 -2,-2 v-21 c0,-1.1 0.8,-2 2,-2 h266 c1.1,0 2,0.8 2,2 v21 c0,1.1 -0.8,2 -2,2 z",
        "fill": "#ffffff",
        "stroke": "#9f9f9fff",
        "stroke-width": "4"
      }, this.santaHat_);
    }
  };

  Blockly.BlockSvg.prototype.initCatStuff = function () {
    if (this.hasInitCatStuff) return;
    this.hasInitCatStuff = true;

    // These group elements are required by Scratch's internal logic for Cat Blocks
    this.catPath_.ear = Blockly.utils.createSvgElement("g", {}, this.catPath_);
    this.catPath_.ear2 = Blockly.utils.createSvgElement("g", {}, this.catPath_);
  };

  // Helper to decide if we should update animation (currently off)
  Blockly.BlockSvg.prototype.shouldWatchMouse = function () {
    if (!shouldWatchMouseCursor) return false;
    return this.startHat_ && !this.isGlowingStack_;
  };

  // Standard Scratch getCatFacePosition logic
  Blockly.BlockSvg.prototype.getCatFacePosition = function () {
    var xy = this.getRelativeToSurfaceXY(this.svgGroup_);
    xy.x -= 43.5;
    xy.y -= 4;
    return xy;
  };

  // Wrap the renderDraw_ function to inject our hat rendering
  const originalRenderDraw = Blockly.BlockSvg.prototype.renderDraw_;
  Blockly.BlockSvg.prototype.renderDraw_ = function (...args) {
    if (!this.svgFace_) {
      this.sa_catBlockConstructor();
    }
    const r = originalRenderDraw.call(this, ...args);
    if (!this.outputConnection && !this.previousConnection) {
      this.initCatStuff();
    }
    if (this.startHat_ && !this.svgFace_.firstChild) {
      this.renderCatFace_();
    }
    return r;
  };

  // Cleanup logic
  const originalDispose = Blockly.BlockSvg.prototype.dispose;
  Blockly.BlockSvg.prototype.dispose = function (...args) {
    if (this.windowListener) {
      document.removeEventListener("mousemove", this.windowListener);
    }
    return originalDispose.call(this, ...args);
  };

  // Constructor for the hat containers
  Blockly.BlockSvg.prototype.sa_catBlockConstructor = function () {
    this.catPath_ = Blockly.utils.createSvgElement("g", {}, this.svgGroup_);
    this.svgFace_ = Blockly.utils.createSvgElement("g", {}, this.catPath_);
    this.catPath_.svgFace = this.svgFace_;
    this.catPath_.svgBody = this.svgPath_;
    this.lastCallTime = 0;
    this.CALL_FREQUENCY_MS = 60;
  };

  // Refresh the workspace to show changes immediately
  const workspace = Blockly.getMainWorkspace();
  if (workspace) {
    const vm = addon.tab.traps.vm;
    if (vm && vm.emitWorkspaceUpdate) {
      vm.emitWorkspaceUpdate();
    }
  }
}