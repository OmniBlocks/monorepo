'use strict';

goog.provide('Blockly.IntersectionObserver');

Blockly.IntersectionObserver = function(workspace) {
  this.workspace = workspace;
  this.observing = [];
  this.checkForIntersections = this.checkForIntersections.bind(this);
};

Blockly.IntersectionObserver.prototype.observe = function(block) {
  var index = this.observing.indexOf(block);
  if (index === -1) {
    this.observing.push(block);
  }
};

Blockly.IntersectionObserver.prototype.unobserve = function(block) {
  var index = this.observing.indexOf(block);
  if (index !== -1) {
    this.observing = this.observing.filter(function(i) {
      return i !== block;
    });
  }
};

Blockly.IntersectionObserver.prototype.dispose = function() {
  this.observing = [];
  this.workspace = null;
};

Blockly.IntersectionObserver.prototype.queueIntersectionCheck = function() {
  if (this.intersectionCheckQueued) {
    return;
  }
  this.intersectionCheckQueued = true;
  // Check for intersections on the next microtick
  // Prefer to use the native method when available, otherwise fallback to a Promise-based polyfill
  // Otherwise, use a polyfill based on Promise
  if (window.queueMicrotask) {
    window.queueMicrotask(this.checkForIntersections);
  } else {
    // eslint-disable-next-line no-undef
    Promise.resolve().then(this.checkForIntersections);
  }
};

Blockly.IntersectionObserver.prototype.checkForIntersections = function() {
  this.intersectionCheckQueued = false;

  if (!this.workspace) {
    return;
  }

  // Allow blocks to go slightly offscreen so that effects such as glow do not get cut off.
  var PADDING = 10;

  var workspace = this.workspace;
  var workspaceScale = workspace.scale;
  var workspaceHeight = workspace.getParentSvg().height.baseVal.value;
  var workspaceWidth = workspace.getParentSvg().width.baseVal.value;
  if (workspace.isDragSurfaceActive_) {
    var canvasPos = Blockly.utils.getRelativeXY(workspace.workspaceDragSurface_.SVG_);
  } else {
    var canvasPos = Blockly.utils.getRelativeXY(workspace.getCanvas());
  }

  for (var i = 0; i < this.observing.length; i++) {
    var block = this.observing[i];
    var blockPos = block.getRelativeToSurfaceXY();
    blockPos.x *= workspaceScale;
    blockPos.y *= workspaceScale;

    var visible = true;
    if (canvasPos.y + blockPos.y - PADDING > workspaceHeight) {
      visible = false;
    } else if (canvasPos.x + blockPos.x - PADDING > workspaceWidth) {
      visible = false;
    } else {
      var blockSize = block.getHeightWidth();
      blockSize.width *= workspaceScale;
      blockSize.height *= workspaceScale;
      if (canvasPos.x + blockPos.x + blockSize.width + PADDING < 0) {
        visible = false;
      } else if (canvasPos.y + blockPos.y + blockSize.height + PADDING < 0) {
        visible = false;
      }
    }

    block.setIntersects(visible);
  }
};
