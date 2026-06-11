/**
<<<<<<< HEAD
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2011 Google Inc.
 * https://developers.google.com/blockly/
=======
 * Visual Blocks Editor
 *
 * Copyright 2011 Google Inc.
 * http://blockly.googlecode.com/
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Core JavaScript library for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

<<<<<<< HEAD
/**
 * The top level namespace used to access the Blockly library.
 * @namespace Blockly
 **/
goog.provide('Blockly');

goog.require('Blockly.BlockSvg.render');
goog.require('Blockly.DropDownDiv');
goog.require('Blockly.Events');
goog.require('Blockly.FieldAngle');
goog.require('Blockly.FieldCheckbox');
goog.require('Blockly.FieldCheckboxOriginal');
goog.require('Blockly.FieldColour');
goog.require('Blockly.FieldColourSlider');
// Date picker commented out since it increases footprint by 60%.
// Add it only if you need it.
//goog.require('Blockly.FieldDate');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldExpandableAdd');
goog.require('Blockly.FieldExpandableRemove');
goog.require('Blockly.FieldIconMenu');
goog.require('Blockly.FieldImage');
goog.require('Blockly.FieldNote');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldTextInputRemovable');
goog.require('Blockly.FieldTextDropdown');
goog.require('Blockly.FieldNumber');
goog.require('Blockly.FieldNumberDropdown');
goog.require('Blockly.FieldMatrix');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.FieldVerticalSeparator');
goog.require('Blockly.FieldCustom');
goog.require('Blockly.Generator');
goog.require('Blockly.Msg');
goog.require('Blockly.Procedures');
goog.require('Blockly.ScratchMsgs');
goog.require('Blockly.Toolbox');
goog.require('Blockly.Touch');
goog.require('Blockly.WidgetDiv');
goog.require('Blockly.WorkspaceSvg');
goog.require('Blockly.constants');
goog.require('Blockly.inject');
goog.require('Blockly.utils');
goog.require('goog.color');


// Turn off debugging when compiled.
/* eslint-disable no-unused-vars */
var CLOSURE_DEFINES = {'goog.DEBUG': false};
/* eslint-enable no-unused-vars */

/**
 * The main workspace most recently used.
 * Set by Blockly.WorkspaceSvg.prototype.markFocused
 * @type {Blockly.Workspace}
 */
Blockly.mainWorkspace = null;
=======
// Top level object for Blockly.
goog.provide('Blockly');

// Blockly core dependencies.
goog.require('Blockly.Block');
goog.require('Blockly.Connection');
goog.require('Blockly.FieldAngle');
goog.require('Blockly.FieldCheckbox');
goog.require('Blockly.FieldColour');
goog.require('Blockly.FieldDropdown');
goog.require('Blockly.FieldImage');
goog.require('Blockly.FieldTextInput');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.Generator');
goog.require('Blockly.Msg');
goog.require('Blockly.Procedures');
goog.require('Blockly.Toolbox');
goog.require('Blockly.WidgetDiv');
goog.require('Blockly.Workspace');
goog.require('Blockly.inject');
goog.require('Blockly.utils');

// Closure dependencies.
goog.require('goog.dom');
goog.require('goog.color');
goog.require('goog.events');
goog.require('goog.string');
goog.require('goog.ui.ColorPicker');
goog.require('goog.ui.tree.TreeControl');
goog.require('goog.userAgent');


/**
 * Path to Blockly's directory.  Can be relative, absolute, or remote.
 * Used for loading additional resources.
 */
Blockly.pathToBlockly = './';

/**
 * Required name space for SVG elements.
 * @const
 */
Blockly.SVG_NS = 'http://www.w3.org/2000/svg';
/**
 * Required name space for HTML elements.
 * @const
 */
Blockly.HTML_NS = 'http://www.w3.org/1999/xhtml';

/**
 * The richness of block colours, regardless of the hue.
 * Must be in the range of 0 (inclusive) to 1 (exclusive).
 */
Blockly.HSV_SATURATION = 0.45;
/**
 * The intensity of block colours, regardless of the hue.
 * Must be in the range of 0 (inclusive) to 1 (exclusive).
 */
Blockly.HSV_VALUE = 0.65;

/**
 * Convert a hue (HSV model) into an RGB hex triplet.
 * @param {number} hue Hue on a colour wheel (0-360).
 * @return {string} RGB code, e.g. '#5ba65b'.
 */
Blockly.makeColour = function(hue) {
  return goog.color.hsvToHex(hue, Blockly.HSV_SATURATION,
      Blockly.HSV_VALUE * 256);
};

/**
 * ENUM for a right-facing value input.  E.g. 'test' or 'return'.
 * @const
 */
Blockly.INPUT_VALUE = 1;
/**
 * ENUM for a left-facing value output.  E.g. 'call random'.
 * @const
 */
Blockly.OUTPUT_VALUE = 2;
/**
 * ENUM for a down-facing block stack.  E.g. 'then-do' or 'else-do'.
 * @const
 */
Blockly.NEXT_STATEMENT = 3;
/**
 * ENUM for an up-facing block stack.  E.g. 'close screen'.
 * @const
 */
Blockly.PREVIOUS_STATEMENT = 4;
/**
 * ENUM for an dummy input.  Used to add title(s) with no input.
 * @const
 */
Blockly.DUMMY_INPUT = 5;

/**
 * ENUM for left alignment.
 * @const
 */
Blockly.ALIGN_LEFT = -1;
/**
 * ENUM for centre alignment.
 * @const
 */
Blockly.ALIGN_CENTRE = 0;
/**
 * ENUM for right alignment.
 * @const
 */
Blockly.ALIGN_RIGHT = 1;

/**
 * Lookup table for determining the opposite type of a connection.
 * @const
 */
Blockly.OPPOSITE_TYPE = [];
Blockly.OPPOSITE_TYPE[Blockly.INPUT_VALUE] = Blockly.OUTPUT_VALUE;
Blockly.OPPOSITE_TYPE[Blockly.OUTPUT_VALUE] = Blockly.INPUT_VALUE;
Blockly.OPPOSITE_TYPE[Blockly.NEXT_STATEMENT] = Blockly.PREVIOUS_STATEMENT;
Blockly.OPPOSITE_TYPE[Blockly.PREVIOUS_STATEMENT] = Blockly.NEXT_STATEMENT;

/**
 * Database of pre-loaded sounds.
 * @private
 * @const
 */
Blockly.SOUNDS_ = Object.create(null);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)

/**
 * Currently selected block.
 * @type {Blockly.Block}
 */
Blockly.selected = null;

/**
<<<<<<< HEAD
 * All of the connections on blocks that are currently being dragged.
 * @type {!Array.<!Blockly.Connection>}
 * @private
 */
Blockly.draggingConnections_ = [];
=======
 * Is Blockly in a read-only, non-editable mode?
 * Note that this property may only be set before init is called.
 * It can't be used to dynamically toggle editability on and off.
 */
Blockly.readOnly = false;

/**
 * Currently highlighted connection (during a drag).
 * @type {Blockly.Connection}
 * @private
 */
Blockly.highlightedConnection_ = null;

/**
 * Connection on dragged block that matches the highlighted connection.
 * @type {Blockly.Connection}
 * @private
 */
Blockly.localConnection_ = null;

/**
 * Number of pixels the mouse must move before a drag starts.
 * @const
 */
Blockly.DRAG_RADIUS = 5;

/**
 * Maximum misalignment between connections for them to snap together.
 * @const
 */
Blockly.SNAP_RADIUS = 15;

/**
 * Delay in ms between trigger and bumping unconnected block out of alignment.
 * @const
 */
Blockly.BUMP_DELAY = 250;

/**
 * Number of characters to truncate a collapsed block to.
 * @const
 */
Blockly.COLLAPSE_CHARS = 30;

/**
 * The main workspace (defined by inject.js).
 * @type {Blockly.Workspace}
 */
Blockly.mainWorkspace = null;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)

/**
 * Contents of the local clipboard.
 * @type {Element}
 * @private
 */
<<<<<<< HEAD
Blockly.clipboardXml_ = null;

/**
 * Source of the local clipboard.
 * @type {Blockly.WorkspaceSvg}
 * @private
 */
Blockly.clipboardSource_ = null;

/**
 * Cached value for whether 3D is supported.
 * @type {!boolean}
 * @private
 */
Blockly.cache3dSupported_ = null;

/**
 * Convert a hue (HSV model) into an RGB hex triplet.
 * @param {number} hue Hue on a colour wheel (0-360).
 * @return {string} RGB code, e.g. '#5ba65b'.
 */
Blockly.hueToRgb = function(hue) {
  return goog.color.hsvToHex(hue, Blockly.HSV_SATURATION,
      Blockly.HSV_VALUE * 255);
};

/**
 * constrains a number to a specified range
 * @param {Number} number the number to constrain
 * @param {Number} min the lower wall
 * @param {Number} max the uper wall
 * @returns {Number} the constrained number
 */
goog.constrain = function(number, min, max) {
  var num = Math.min(Math.max(number, min), max)
  if (!num && num !== 0) num = 0
  return num
}

/**
 * converts hsva to rgba
 * @param {Number} hue the color
 * @param {Number} saturation the saturation
 * @param {Number} value the brightness
 * @param {Number} alpha the transparency
 * @returns {Number} the hex color
 */
goog.color.hsvaToHex = function(hue, saturation, value, alpha) {
  var hex = goog.color.hsvToHex(hue, saturation, value)
  var alpha = goog.constrain(Math.floor(alpha * 255), 0, 255).toString(16)
  if (alpha.length === 1) alpha = '0' + alpha
  return hex + alpha
}

/**
 * convert hex to hsva
 * @param {String|Number} hex the hex 
 * @returns {Array} the hsva
 */
goog.color.hexToHsva = function(decimal) {
  var alpha = (() => {
    if (typeof decimal === 'string') return parseInt(decimal.slice(7, 9), 16)
    return decimal & 0xFF
  })() / 255
  
  var [hue, saturation, value] = goog.color.hexToHsv(decimal.slice(0, 7))
  return [hue,saturation,value,alpha];
}

/**
 * Returns the dimensions of the specified SVG image.
 * @param {!Element} svg SVG image.
 * @return {!Object} Contains width and height properties.
 */
Blockly.svgSize = function(svg) {
  return {
    width: svg.cachedWidth_,
    height: svg.cachedHeight_
  };
};

/**
 * Size the workspace when the contents change.  This also updates
 * scrollbars accordingly.
 * @param {!Blockly.WorkspaceSvg} workspace The workspace to resize.
 */
Blockly.resizeSvgContents = function(workspace) {
  workspace.resizeContents();
};

/**
 * Size the SVG image to completely fill its container. Call this when the view
 * actually changes sizes (e.g. on a window resize/device orientation change).
 * See Blockly.resizeSvgContents to resize the workspace when the contents
 * change (e.g. when a block is added or removed).
 * Record the height/width of the SVG image.
 * @param {!Blockly.WorkspaceSvg} workspace Any workspace in the SVG.
 */
Blockly.svgResize = function(workspace) {
  var mainWorkspace = workspace;
  while (mainWorkspace.options.parentWorkspace) {
    mainWorkspace = mainWorkspace.options.parentWorkspace;
  }
  var svg = mainWorkspace.getParentSvg();
  var div = svg.parentNode;
  if (!div) {
    // Workspace deleted, or something.
    return;
  }
=======
Blockly.clipboard_ = null;

/**
 * Returns the dimensions of the current SVG image.
 * @return {!Object} Contains width, height, top and left properties.
 */
Blockly.svgSize = function() {
  return {width: Blockly.svg.cachedWidth_,
          height: Blockly.svg.cachedHeight_};
};

/**
 * Size the SVG image to completely fill its container.  Record both
 * the height/width and the absolute position of the SVG image.
 */
Blockly.svgResize = function() {
  var svg = Blockly.svg;
  var div = svg.parentNode;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  var width = div.offsetWidth;
  var height = div.offsetHeight;
  if (svg.cachedWidth_ != width) {
    svg.setAttribute('width', width + 'px');
    svg.cachedWidth_ = width;
  }
  if (svg.cachedHeight_ != height) {
    svg.setAttribute('height', height + 'px');
    svg.cachedHeight_ = height;
  }
<<<<<<< HEAD
  mainWorkspace.resize();
};

/**
 * Handle a key-down on SVG drawing surface. Does nothing if the main workspace is not visible.
 * @param {!Event} e Key down event.
 * @private
 */
// TODO (https://github.com/google/blockly/issues/1998) handle cases where there are multiple workspaces
// and non-main workspaces are able to accept input.
Blockly.onKeyDown_ = function(e) {
  if (Blockly.mainWorkspace.options.readOnly || Blockly.utils.isTargetInput(e)
      || (Blockly.mainWorkspace.rendered && !Blockly.mainWorkspace.isVisible())) {
    // No key actions on readonly workspaces.
    // When focused on an HTML text input widget, don't trap any keys.
    // Ignore keypresses on rendered workspaces that have been explicitly
    // hidden.
    return;
  }
  var deleteBlock = false;
  if (e.keyCode == 27) {
    // Pressing esc closes the context menu and any drop-down
    Blockly.hideChaff();
    Blockly.DropDownDiv.hide();
  } else if (e.keyCode == 8 || e.keyCode == 46) {
    // Delete or backspace.
    // Stop the browser from going back to the previous page.
    // Do this first to prevent an error in the delete code from resulting in
    // data loss.
    e.preventDefault();
    // Don't delete while dragging.  Jeez.
    if (Blockly.mainWorkspace.isDragging()) {
      return;
    }
    if (Blockly.selected && Blockly.selected.isDeletable()) {
      deleteBlock = true;
    }
  } else if (e.altKey || e.ctrlKey || e.metaKey) {
    // Don't use meta keys during drags.
    if (Blockly.mainWorkspace.isDragging()) {
      return;
    }
    if (Blockly.selected &&
        Blockly.selected.isDeletable() && Blockly.selected.isMovable()) {
      // Don't allow copying immovable or undeletable blocks. The next step
      // would be to paste, which would create additional undeletable/immovable
      // blocks on the workspace.
      if (e.keyCode == 67) {
        // 'c' for copy.
        Blockly.hideChaff();
        Blockly.copy_(Blockly.selected);
      } else if (e.keyCode == 88 && !Blockly.selected.workspace.isFlyout) {
        // 'x' for cut, but not in a flyout.
        // Don't even copy the selected item in the flyout.
        Blockly.copy_(Blockly.selected);
        deleteBlock = true;
=======
  // Update the scrollbars (if they exist).
  if (Blockly.mainWorkspace.scrollbar) {
    Blockly.mainWorkspace.scrollbar.resize();
  }
};

/**
 * Handle a mouse-down on SVG drawing surface.
 * @param {!Event} e Mouse down event.
 * @private
 */
Blockly.onMouseDown_ = function(e) {
  Blockly.terminateDrag_(); // In case mouse-up event was lost.
  Blockly.hideChaff();
  var isTargetSvg = e.target && e.target.nodeName &&
      e.target.nodeName.toLowerCase() == 'svg';
  if (!Blockly.readOnly && Blockly.selected && isTargetSvg) {
    // Clicking on the document clears the selection.
    Blockly.selected.unselect();
  }
  if (Blockly.isRightButton(e)) {
    // Right-click.
    if (Blockly.ContextMenu) {
      Blockly.showContextMenu_(Blockly.mouseToSvg(e));
    }
  } else if ((Blockly.readOnly || isTargetSvg) &&
             Blockly.mainWorkspace.scrollbar) {
    // If the workspace is editable, only allow dragging when gripping empty
    // space.  Otherwise, allow dragging when gripping anywhere.
    Blockly.mainWorkspace.dragMode = true;
    // Record the current mouse position.
    Blockly.mainWorkspace.startDragMouseX = e.clientX;
    Blockly.mainWorkspace.startDragMouseY = e.clientY;
    Blockly.mainWorkspace.startDragMetrics =
        Blockly.mainWorkspace.getMetrics();
    Blockly.mainWorkspace.startScrollX = Blockly.mainWorkspace.scrollX;
    Blockly.mainWorkspace.startScrollY = Blockly.mainWorkspace.scrollY;
  }
};

/**
 * Handle a mouse-up on SVG drawing surface.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.onMouseUp_ = function(e) {
  Blockly.setCursorHand_(false);
  Blockly.mainWorkspace.dragMode = false;
};

/**
 * Handle a mouse-move on SVG drawing surface.
 * @param {!Event} e Mouse move event.
 * @private
 */
Blockly.onMouseMove_ = function(e) {
  if (Blockly.mainWorkspace.dragMode) {
    Blockly.removeAllRanges();
    var dx = e.clientX - Blockly.mainWorkspace.startDragMouseX;
    var dy = e.clientY - Blockly.mainWorkspace.startDragMouseY;
    var metrics = Blockly.mainWorkspace.startDragMetrics;
    var x = Blockly.mainWorkspace.startScrollX + dx;
    var y = Blockly.mainWorkspace.startScrollY + dy;
    x = Math.min(x, -metrics.contentLeft);
    y = Math.min(y, -metrics.contentTop);
    x = Math.max(x, metrics.viewWidth - metrics.contentLeft -
                 metrics.contentWidth);
    y = Math.max(y, metrics.viewHeight - metrics.contentTop -
                 metrics.contentHeight);

    // Move the scrollbars and the page will scroll automatically.
    Blockly.mainWorkspace.scrollbar.set(-x - metrics.contentLeft,
                                        -y - metrics.contentTop);
  }
};

/**
 * Handle a key-down on SVG drawing surface.
 * @param {!Event} e Key down event.
 * @private
 */
Blockly.onKeyDown_ = function(e) {
  if (Blockly.isTargetInput_(e)) {
    // When focused on an HTML text input widget, don't trap any keys.
    return;
  }
  // TODO: Add keyboard support for cursoring around the context menu.
  if (e.keyCode == 27) {
    // Pressing esc closes the context menu.
    Blockly.hideChaff();
  } else if (e.keyCode == 8 || e.keyCode == 46) {
    // Delete or backspace.
    try {
      if (Blockly.selected && Blockly.selected.isDeletable()) {
        Blockly.hideChaff();
        Blockly.selected.dispose(true, true);
      }
    } finally {
      // Stop the browser from going back to the previous page.
      // Use a finally so that any error in delete code above doesn't disappear
      // from the console when the page rolls back.
      e.preventDefault();
    }
  } else if (e.altKey || e.ctrlKey || e.metaKey) {
    if (Blockly.selected && Blockly.selected.isDeletable() &&
        Blockly.selected.workspace == Blockly.mainWorkspace) {
      Blockly.hideChaff();
      if (e.keyCode == 67) {
        // 'c' for copy.
        Blockly.copy_(Blockly.selected);
      } else if (e.keyCode == 88) {
        // 'x' for cut.
        Blockly.copy_(Blockly.selected);
        Blockly.selected.dispose(true, true);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
      }
    }
    if (e.keyCode == 86) {
      // 'v' for paste.
<<<<<<< HEAD
      if (Blockly.clipboardXml_) {
        Blockly.Events.setGroup(true);
        // Pasting always pastes to the main workspace, even if the copy started
        // in a flyout workspace.
        var workspace = Blockly.clipboardSource_;
        if (workspace.isFlyout) {
          workspace = workspace.targetWorkspace;
        }
        workspace.paste(Blockly.clipboardXml_);
        Blockly.Events.setGroup(false);
      }
    } else if (e.keyCode == 90 || e.keyCode === 89) {
      // 'z' for undo 'Z' is for redo. 'y' is always redo.
      e.preventDefault();
      Blockly.hideChaff();
      Blockly.mainWorkspace.undo(e.shiftKey || e.keyCode === 89);
    }
  }
  // Common code for delete and cut.
  // Don't delete in the flyout.
  if (deleteBlock && !Blockly.selected.workspace.isFlyout) {
    Blockly.Events.setGroup(true);
    Blockly.hideChaff();
    Blockly.selected.dispose(/* heal */ true, true);
    Blockly.Events.setGroup(false);
  }
};

/**
 * Copy a block or workspace comment onto the local clipboard.
 * @param {!Blockly.Block | !Blockly.WorkspaceComment} toCopy Block or Workspace Comment
 *    to be copied.
 * @private
 */
Blockly.copy_ = function(toCopy) {
  if (toCopy.isComment) {
    var xml = toCopy.toXmlWithXY();
  } else {
    var xml = Blockly.Xml.blockToDom(toCopy);
    // Encode start position in XML.
    var xy = toCopy.getRelativeToSurfaceXY();
    xml.setAttribute('x', toCopy.RTL ? -xy.x : xy.x);
    xml.setAttribute('y', xy.y);
  }
  Blockly.clipboardXml_ = xml;
  Blockly.clipboardSource_ = toCopy.workspace;
};

/**
 * Duplicate this block and its children, or a workspace comment.
 * @param {!Blockly.Block | !Blockly.WorkspaceComment} toDuplicate Block or
 *     Workspace Comment to be copied.
 * @private
 */
Blockly.duplicate_ = function(toDuplicate) {
  // Save the clipboard.
  var clipboardXml = Blockly.clipboardXml_;
  var clipboardSource = Blockly.clipboardSource_;

  // Create a duplicate via a copy/paste operation.
  Blockly.copy_(toDuplicate);
  toDuplicate.workspace.paste(Blockly.clipboardXml_);

  // Restore the clipboard.
  Blockly.clipboardXml_ = clipboardXml;
  Blockly.clipboardSource_ = clipboardSource;
=======
      if (Blockly.clipboard_) {
        Blockly.mainWorkspace.paste(Blockly.clipboard_);
      }
    }
  }
};

/**
 * Stop binding to the global mouseup and mousemove events.
 * @private
 */
Blockly.terminateDrag_ = function() {
  Blockly.Block.terminateDrag_();
  Blockly.Flyout.terminateDrag_();
};

/**
 * Copy a block onto the local clipboard.
 * @param {!Blockly.Block} block Block to be copied.
 * @private
 */
Blockly.copy_ = function(block) {
  var xmlBlock = Blockly.Xml.blockToDom_(block);
  Blockly.Xml.deleteNext(xmlBlock);
  // Encode start position in XML.
  var xy = block.getRelativeToSurfaceXY();
  xmlBlock.setAttribute('x', Blockly.RTL ? -xy.x : xy.x);
  xmlBlock.setAttribute('y', xy.y);
  Blockly.clipboard_ = xmlBlock;
};

/**
 * Show the context menu for the workspace.
 * @param {!Object} xy Coordinates of mouse click, contains x and y properties.
 * @private
 */
Blockly.showContextMenu_ = function(xy) {
  if (Blockly.readOnly) {
    return;
  }
  var options = [];

  if (Blockly.collapse) {
    var hasCollapsedBlocks = false;
    var hasExpandedBlocks = false;
    var topBlocks = Blockly.mainWorkspace.getTopBlocks(false);
    for (var i = 0; i < topBlocks.length; i++) {
      if (topBlocks[i].isCollapsed()) {
        hasCollapsedBlocks = true;
      } else {
        hasExpandedBlocks = true;
      }
    }

    // Option to collapse top blocks.
    var collapseOption = {enabled: hasExpandedBlocks};
    collapseOption.text = Blockly.Msg.COLLAPSE_ALL;
    collapseOption.callback = function() {
      for (var i = 0; i < topBlocks.length; i++) {
        topBlocks[i].setCollapsed(true);
      }
    };
    options.push(collapseOption);

    // Option to expand top blocks.
    var expandOption = {enabled: hasCollapsedBlocks};
    expandOption.text = Blockly.Msg.EXPAND_ALL;
    expandOption.callback = function() {
      for (var i = 0; i < topBlocks.length; i++) {
        topBlocks[i].setCollapsed(false);
      }
    };
    options.push(expandOption);
  }

  // Option to get help.
  var helpOption = {enabled: false};
  helpOption.text = Blockly.Msg.HELP;
  helpOption.callback = function() {};
  options.push(helpOption);

  Blockly.ContextMenu.show(xy, options);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Cancel the native context menu, unless the focus is on an HTML input widget.
 * @param {!Event} e Mouse down event.
 * @private
 */
Blockly.onContextMenu_ = function(e) {
<<<<<<< HEAD
  if (!Blockly.utils.isTargetInput(e)) {
=======
  if (!Blockly.isTargetInput_(e) && Blockly.ContextMenu) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    // When focused on an HTML text input widget, don't cancel the context menu.
    e.preventDefault();
  }
};

/**
 * Close tooltips, context menus, dropdown selections, etc.
 * @param {boolean=} opt_allowToolbox If true, don't close the toolbox.
 */
Blockly.hideChaff = function(opt_allowToolbox) {
<<<<<<< HEAD
  Blockly.hideChaffInternal_(opt_allowToolbox);
  Blockly.WidgetDiv.hide(true);
};

/**
 * Close tooltips, context menus, dropdown selections, etc.
 * For some elements (e.g. field text inputs), rather than hiding, it will
 * move them.
 * @param {boolean=} opt_allowToolbox If true, don't close the toolbox.
 */
Blockly.hideChaffOnResize = function(opt_allowToolbox) {
  Blockly.hideChaffInternal_(opt_allowToolbox);
  Blockly.WidgetDiv.repositionForWindowResize();
};

/**
 * Does a majority of the work for hideChaff including tooltips, dropdowns,
 * toolbox, etc. It does not deal with the WidgetDiv.
 * @param {boolean=} opt_allowToolbox If true, don't close the toolbox.
 * @private
 */
Blockly.hideChaffInternal_ = function(opt_allowToolbox) {
  Blockly.Tooltip.hide();
  Blockly.DropDownDiv.hideWithoutAnimation();
  if (!opt_allowToolbox) {
    var workspace = Blockly.getMainWorkspace();
    if (workspace.toolbox_ &&
        workspace.toolbox_.flyout_ &&
        workspace.toolbox_.flyout_.autoClose) {
      workspace.toolbox_.clearSelection();
=======
  Blockly.Tooltip && Blockly.Tooltip.hide();
  Blockly.ContextMenu && Blockly.ContextMenu.hide();
  Blockly.FieldDropdown && Blockly.FieldDropdown.hide();
  Blockly.WidgetDiv.hide();
  if (!opt_allowToolbox &&
      Blockly.Toolbox.flyout_ && Blockly.Toolbox.flyout_.autoClose) {
    Blockly.Toolbox.clearSelection();
  }
};

/**
 * Deselect any selections on the webpage.
 * Chrome will select text outside the SVG when double-clicking.
 * Deselect this text, so that it doesn't mess up any subsequent drag.
 */
Blockly.removeAllRanges = function() {
  if (window.getSelection) {  // W3
    var sel = window.getSelection();
    if (sel && sel.removeAllRanges) {
      sel.removeAllRanges();
      window.setTimeout(function() {
          window.getSelection().removeAllRanges();
        }, 0);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    }
  }
};

/**
<<<<<<< HEAD
 * Returns the main workspace.  Returns the last used main workspace (based on
 * focus).  Try not to use this function, particularly if there are multiple
 * Blockly instances on a page.
=======
 * Is this event targeting a text input widget?
 * @param {!Event} e An event.
 * @return {boolean} True if text input.
 * @private
 */
Blockly.isTargetInput_ = function(e) {
  return e.target.type == 'textarea' || e.target.type == 'text';
};

/**
 * Load an audio file.  Cache it, ready for instantaneous playing.
 * @param {!Array.<string>} filenames List of file types in decreasing order of
 *   preference (i.e. increasing size).  E.g. ['media/go.mp3', 'media/go.wav']
 *   Filenames include path from Blockly's root.  File extensions matter.
 * @param {string} name Name of sound.
 * @private
 */
Blockly.loadAudio_ = function(filenames, name) {
  if (!window['Audio'] || !filenames.length) {
    // No browser support for Audio.
    return;
  }
  var sound;
  var audioTest = new window['Audio']();
  for (var i = 0; i < filenames.length; i++) {
    var filename = filenames[i];
    var ext = filename.match(/\.(\w+)$/);
    if (ext && audioTest.canPlayType('audio/' + ext[1])) {
      // Found an audio format we can play.
      sound = new window['Audio'](Blockly.pathToBlockly + filename);
      break;
    }
  }
  // To force the browser to load the sound, play it, but at nearly zero volume.
  if (sound && sound.play) {
    sound.volume = 0.01;
    sound.play();
    Blockly.SOUNDS_[name] = sound;
  }
};

/**
 * Play an audio file at specified value.  If volume is not specified,
 * use full volume (1).
 * @param {string} name Name of sound.
 * @param {?number} opt_volume Volume of sound (0-1).
 */
Blockly.playAudio = function(name, opt_volume) {
  var sound = Blockly.SOUNDS_[name];
  if (sound) {
    var mySound;
    var ie9 = goog.userAgent.DOCUMENT_MODE &&
              goog.userAgent.DOCUMENT_MODE === 9;
    if (ie9 || goog.userAgent.IPAD || goog.userAgent.ANDROID) {
      // Creating a new audio node causes lag in IE9, Android and iPad. Android
      // and IE9 refetch the file from the server, iPad uses a singleton audio
      // node which must be deleted and recreated for each new audio tag.
      mySound = sound;
    } else {
      mySound = sound.cloneNode();
    }
    mySound.volume = (opt_volume === undefined ? 1 : opt_volume);
    mySound.play();
  }
};

/**
 * Set the mouse cursor to be either a closed hand or the default.
 * @param {boolean} closed True for closed hand.
 * @private
 */
Blockly.setCursorHand_ = function(closed) {
  if (Blockly.readOnly) {
    return;
  }
  /* Hotspot coordinates are baked into the CUR file, but they are still
     required due to a Chrome bug.
     http://code.google.com/p/chromium/issues/detail?id=1446 */
  var cursor = '';
  if (closed) {
    cursor = 'url(' + Blockly.pathToBlockly + 'media/handclosed.cur) 7 3, auto';
  }
  if (Blockly.selected) {
    Blockly.selected.getSvgRoot().style.cursor = cursor;
  }
  // Set cursor on the SVG surface as well as block so that rapid movements
  // don't result in cursor changing to an arrow momentarily.
  Blockly.svg.style.cursor = cursor;
};

/**
 * Return an object with all the metrics required to size scrollbars for the
 * main workspace.  The following properties are computed:
 * .viewHeight: Height of the visible rectangle,
 * .viewWidth: Width of the visible rectangle,
 * .contentHeight: Height of the contents,
 * .contentWidth: Width of the content,
 * .viewTop: Offset of top edge of visible rectangle from parent,
 * .viewLeft: Offset of left edge of visible rectangle from parent,
 * .contentTop: Offset of the top-most content from the y=0 coordinate,
 * .contentLeft: Offset of the left-most content from the x=0 coordinate.
 * .absoluteTop: Top-edge of view.
 * .absoluteLeft: Left-edge of view.
 * @return {Object} Contains size and position metrics of main workspace.
 * @private
 */
Blockly.getMainWorkspaceMetrics_ = function() {
  var svgSize = Blockly.svgSize();
  svgSize.width -= Blockly.Toolbox.width;  // Zero if no Toolbox.
  var viewWidth = svgSize.width - Blockly.Scrollbar.scrollbarThickness;
  var viewHeight = svgSize.height - Blockly.Scrollbar.scrollbarThickness;
  try {
    var blockBox = Blockly.mainWorkspace.getCanvas().getBBox();
  } catch (e) {
    // Firefox has trouble with hidden elements (Bug 528969).
    return null;
  }
  if (Blockly.mainWorkspace.scrollbar) {
    // Add a border around the content that is at least half a screenful wide.
    var leftEdge = Math.min(blockBox.x - viewWidth / 2,
                            blockBox.x + blockBox.width - viewWidth);
    var rightEdge = Math.max(blockBox.x + blockBox.width + viewWidth / 2,
                             blockBox.x + viewWidth);
    var topEdge = Math.min(blockBox.y - viewHeight / 2,
                           blockBox.y + blockBox.height - viewHeight);
    var bottomEdge = Math.max(blockBox.y + blockBox.height + viewHeight / 2,
                              blockBox.y + viewHeight);
  } else {
    var leftEdge = blockBox.x;
    var rightEdge = leftEdge + blockBox.width;
    var topEdge = blockBox.y;
    var bottomEdge = topEdge + blockBox.height;
  }
  var absoluteLeft = Blockly.RTL ? 0 : Blockly.Toolbox.width;
  return {
    viewHeight: svgSize.height,
    viewWidth: svgSize.width,
    contentHeight: bottomEdge - topEdge,
    contentWidth: rightEdge - leftEdge,
    viewTop: -Blockly.mainWorkspace.scrollY,
    viewLeft: -Blockly.mainWorkspace.scrollX,
    contentTop: topEdge,
    contentLeft: leftEdge,
    absoluteTop: 0,
    absoluteLeft: absoluteLeft
  };
};

/**
 * Sets the X/Y translations of the main workspace to match the scrollbars.
 * @param {!Object} xyRatio Contains an x and/or y property which is a float
 *     between 0 and 1 specifying the degree of scrolling.
 * @private
 */
Blockly.setMainWorkspaceMetrics_ = function(xyRatio) {
  if (!Blockly.mainWorkspace.scrollbar) {
    throw 'Attempt to set main workspace scroll without scrollbars.';
  }
  var metrics = Blockly.getMainWorkspaceMetrics_();
  if (goog.isNumber(xyRatio.x)) {
    Blockly.mainWorkspace.scrollX = -metrics.contentWidth * xyRatio.x -
        metrics.contentLeft;
  }
  if (goog.isNumber(xyRatio.y)) {
    Blockly.mainWorkspace.scrollY = -metrics.contentHeight * xyRatio.y -
        metrics.contentTop;
  }
  var translation = 'translate(' +
      (Blockly.mainWorkspace.scrollX + metrics.absoluteLeft) + ',' +
      (Blockly.mainWorkspace.scrollY + metrics.absoluteTop) + ')';
  Blockly.mainWorkspace.getCanvas().setAttribute('transform', translation);
  Blockly.mainWorkspace.getBubbleCanvas().setAttribute('transform',
                                                       translation);
};

/**
 * When something in Blockly's workspace changes, call a function.
 * @param {!Function} func Function to call.
 * @return {!Array.<!Array>} Opaque data that can be passed to
 *     removeChangeListener.
 */
Blockly.addChangeListener = function(func) {
  return Blockly.bindEvent_(Blockly.mainWorkspace.getCanvas(),
                            'blocklyWorkspaceChange', null, func);
};

/**
 * Stop listening for Blockly's workspace changes.
 * @param {!Array.<!Array>} bindData Opaque data from addChangeListener.
 */
Blockly.removeChangeListener = function(bindData) {
  Blockly.unbindEvent_(bindData);
};

/**
 * Returns the main workspace.
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * @return {!Blockly.Workspace} The main workspace.
 */
Blockly.getMainWorkspace = function() {
  return Blockly.mainWorkspace;
};

<<<<<<< HEAD
/**
 * Wrapper to window.alert() that app developers may override to
 * provide alternatives to the modal browser window.
 * @param {string} message The message to display to the user.
 * @param {function()=} opt_callback The callback when the alert is dismissed.
 */
Blockly.alert = function(message, opt_callback) {
  window.alert(message);
  if (opt_callback) {
    opt_callback();
  }
};

/**
 * Wrapper to window.confirm() that app developers may override to
 * provide alternatives to the modal browser window.
 * @param {string} message The message to display to the user.
 * @param {!function(boolean)} callback The callback for handling user response.
 */
Blockly.confirm = function(message, callback) {
  callback(window.confirm(message));
};

/**
 * Wrapper to window.prompt() that app developers may override to provide
 * alternatives to the modal browser window. Built-in browser prompts are
 * often used for better text input experience on mobile device. We strongly
 * recommend testing mobile when overriding this.
 * @param {string} message The message to display to the user.
 * @param {string} defaultValue The value to initialize the prompt with.
 * @param {!function(string)} callback The callback for handling user response.
 * @param {?string} _opt_title An optional title for the prompt.
 * @param {?string} _opt_varType An optional variable type for variable specific
 *     prompt behavior.
 */
Blockly.prompt = function(message, defaultValue, callback, _opt_title,
    _opt_varType) {
  // opt_title and opt_varType are unused because we only need them to pass
  // information to the scratch-gui, which overwrites this function
  callback(window.prompt(message, defaultValue));
};

/**
 * Custom Modal API, overwritten in penguinmod.github.io repo
 * @param {{title:string, scrollable:boolean?}} config The config for the modal
 * @param {{content:CSSStyleDeclaration?, overlay:CSSStyleDeclaration?}?} styles Sets styles on parts of the modal. If specified, at least one of the parts should have styles.
 * @param {Array<{
 *      name:string,
 *      role:"ok"|"close"|null,
 *      class:"ok"|"cancel"|null,
 *      style:CSSStyleDeclaration?,
 *      dontClose:boolean?,
 *      callback:function():void
 * }>?} buttons Buttons to place onto the modal. `role` makes the button callback run for other types of interactions.
 * @returns {Promise<HTMLElement>}
 */
Blockly.customPrompt = function (config, styles, enterInfo, closeInfo) {
    throw new Error("Custom Modal API not implemented here");
};

/**
 * A callback for status buttons. The window.alert is here for testing and
 * should be overridden.
 * @param {string} id An identifier.
 */
Blockly.statusButtonCallback = function(id) {
  window.alert('status button was pressed for ' + id);
};

/**
 * Refresh the visual state of a status button in all extension category headers.
 * @param {Blockly.Workspace} workspace A workspace.
 */
Blockly.refreshStatusButtons = function(workspace) {
  var buttons = workspace.getFlyout().buttons_;
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i] instanceof Blockly.FlyoutExtensionCategoryHeader) {
      buttons[i].refreshStatus();
    }
  }
};

/**
 * Helper function for defining a block from JSON.  The resulting function has
 * the correct value of jsonDef at the point in code where jsonInit is called.
 * @param {!Object} jsonDef The JSON definition of a block.
 * @return {function()} A function that calls jsonInit with the correct value
 *     of jsonDef.
 * @private
 */
Blockly.jsonInitFactory_ = function(jsonDef) {
  return function() {
    this.jsonInit(jsonDef);
  };
};

/**
 * Define blocks from an array of JSON block definitions, as might be generated
 * by the Blockly Developer Tools.
 * @param {!Array.<!Object>} jsonArray An array of JSON block definitions.
 */
Blockly.defineBlocksWithJsonArray = function(jsonArray, ignoreOverites) {
  for (var i = 0; i < jsonArray.length; i++) {
    var elem = jsonArray[i];
    if (!elem) {
      console.warn(
          'Block definition #' + i + ' in JSON array is ' + elem + '. ' +
          'Skipping.');
    } else {
      var typename = elem.type;
      if (typename == null || typename === '') {
        console.warn(
            'Block definition #' + i +
            ' in JSON array is missing a type attribute. Skipping.');
      } else {
        if (Blockly.Blocks[typename]) {
          if (!ignoreOverites) {
            console.warn(
                'Block definition #' + i + ' in JSON array' +
                ' overwrites prior definition of "' + typename + '".');
          }
        }
        Blockly.Blocks[typename] = {
          init: Blockly.jsonInitFactory_(elem)
        };
      }
    }
  }
};

/**
 * Bind an event to a function call.  When calling the function, verifies that
 * it belongs to the touch stream that is currently being processed, and splits
 * multitouch events into multiple events as needed.
 * @param {!EventTarget} node Node upon which to listen.
 * @param {string} name Event name to listen to (e.g. 'mousedown').
 * @param {Object} thisObject The value of 'this' in the function.
 * @param {!Function} func Function to call when event is triggered.
 * @param {boolean=} opt_noCaptureIdentifier True if triggering on this event
 *     should not block execution of other event handlers on this touch or other
 *     simultaneous touches.
 * @param {boolean=} opt_noPreventDefault True if triggering on this event
 *     should prevent the default handler.  False by default.  If
 *     opt_noPreventDefault is provided, opt_noCaptureIdentifier must also be
 *     provided.
 * @return {!Array.<!Array>} Opaque data that can be passed to unbindEvent_.
 */
Blockly.bindEventWithChecks_ = function(node, name, thisObject, func,
    opt_noCaptureIdentifier, opt_noPreventDefault) {
  var handled = false;
  var wrapFunc = function(e) {
    var captureIdentifier = !opt_noCaptureIdentifier;
    // Handle each touch point separately.  If the event was a mouse event, this
    // will hand back an array with one element, which we're fine handling.
    var events = Blockly.Touch.splitEventByTouches(e);
    for (var i = 0, event; event = events[i]; i++) {
      if (captureIdentifier && !Blockly.Touch.shouldHandleEvent(event)) {
        continue;
      }
      Blockly.Touch.setClientFromTouch(event);
      if (thisObject) {
        func.call(thisObject, event);
      } else {
        func(event);
      }
      handled = true;
    }
  };

  node.addEventListener(name, wrapFunc, false);
  var bindData = [[node, name, wrapFunc]];

  // Add equivalent touch event.
  if (name in Blockly.Touch.TOUCH_MAP) {
    var touchWrapFunc = function(e) {
      wrapFunc(e);
      // Calling preventDefault stops the browser from scrolling/zooming the
      // page.
      var preventDef = !opt_noPreventDefault;
      if (handled && preventDef) {
        e.preventDefault();
      }
    };
    for (var i = 0, type; type = Blockly.Touch.TOUCH_MAP[name][i]; i++) {
      node.addEventListener(type, touchWrapFunc, false);
      bindData.push([node, type, touchWrapFunc]);
    }
  }
  return bindData;
};


/**
 * Bind an event to a function call.  Handles multitouch events by using the
 * coordinates of the first changed touch, and doesn't do any safety checks for
 * simultaneous event processing.
 * @deprecated in favor of bindEventWithChecks_, but preserved for external
 * users.
 * @param {!EventTarget} node Node upon which to listen.
 * @param {string} name Event name to listen to (e.g. 'mousedown').
 * @param {Object} thisObject The value of 'this' in the function.
 * @param {!Function} func Function to call when event is triggered.
 * @return {!Array.<!Array>} Opaque data that can be passed to unbindEvent_.
 * @private
 */
Blockly.bindEvent_ = function(node, name, thisObject, func) {
  var wrapFunc = function(e) {
    if (thisObject) {
      func.call(thisObject, e);
    } else {
      func(e);
    }
  };

  node.addEventListener(name, wrapFunc, false);
  var bindData = [[node, name, wrapFunc]];

  // Add equivalent touch event.
  if (name in Blockly.Touch.TOUCH_MAP) {
    var touchWrapFunc = function(e) {
      // Punt on multitouch events.
      if (e.changedTouches.length == 1) {
        // Map the touch event's properties to the event.
        var touchPoint = e.changedTouches[0];
        e.clientX = touchPoint.clientX;
        e.clientY = touchPoint.clientY;
      }
      wrapFunc(e);

      // Stop the browser from scrolling/zooming the page.
      e.preventDefault();
    };
    for (var i = 0, type; type = Blockly.Touch.TOUCH_MAP[name][i]; i++) {
      node.addEventListener(type, touchWrapFunc, false);
      bindData.push([node, type, touchWrapFunc]);
    }
  }
  return bindData;
};

/**
 * Unbind one or more events event from a function call.
 * @param {!Array.<!Array>} bindData Opaque data from bindEvent_.
 *     This list is emptied during the course of calling this function.
 * @return {!Function} The function call.
 * @private
 */
Blockly.unbindEvent_ = function(bindData) {
  while (bindData.length) {
    var bindDatum = bindData.pop();
    var node = bindDatum[0];
    var name = bindDatum[1];
    var func = bindDatum[2];
    node.removeEventListener(name, func, false);
  }
  return func;
};

/**
 * Is the given string a number (includes negative and decimals).
 * @param {string} str Input string.
 * @return {boolean} True if number, false otherwise.
 */
Blockly.isNumber = function(str) {
  return !!str.match(/^\s*-?\d+(\.\d+)?\s*$/);
};

// IE9 does not have a console.  Create a stub to stop errors.
if (!goog.global['console']) {
  goog.global['console'] = {
    'log': function() {},
    'warn': function() {}
  };
}

// Export symbols that would otherwise be renamed by Closure compiler.
if (!goog.global['Blockly']) {
  goog.global['Blockly'] = {};
}
goog.global['Blockly']['getMainWorkspace'] = Blockly.getMainWorkspace;
goog.global['Blockly']['goog'] = goog;
goog.global['ScratchBlocks'] = goog.global['Blockly'];
Blockly.goog = goog;
=======
// Export symbols that would otherwise be renamed by Closure compiler.
window['Blockly'] = Blockly;
Blockly['getMainWorkspace'] = Blockly.getMainWorkspace;
Blockly['addChangeListener'] = Blockly.addChangeListener;
Blockly['removeChangeListener'] = Blockly.removeChangeListener;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
