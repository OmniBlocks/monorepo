/**
<<<<<<< HEAD
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2013 Google Inc.
 * https://developers.google.com/blockly/
=======
 * Visual Blocks Editor
 *
 * Copyright 2013 Google Inc.
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
 * @fileoverview Object representing an icon on a block.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Icon');

<<<<<<< HEAD
goog.require('goog.dom');
goog.require('goog.math.Coordinate');


=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
/**
 * Class for an icon.
 * @param {Blockly.Block} block The block associated with this icon.
 * @constructor
 */
Blockly.Icon = function(block) {
  this.block_ = block;
};

/**
<<<<<<< HEAD
 * Does this icon get hidden when the block is collapsed.
 */
Blockly.Icon.prototype.collapseHidden = true;

/**
 * Height and width of icons.
 */
Blockly.Icon.prototype.SIZE = 17;
=======
 * Radius of icons.
 */
Blockly.Icon.RADIUS = 8;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)

/**
 * Bubble UI (if visible).
 * @type {Blockly.Bubble}
<<<<<<< HEAD
 * @protected
=======
 * @private
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 */
Blockly.Icon.prototype.bubble_ = null;

/**
<<<<<<< HEAD
 * Absolute coordinate of icon's center.
 * @type {goog.math.Coordinate}
 * @protected
 */
Blockly.Icon.prototype.iconXY_ = null;

/**
 * Create the icon on the block.
 */
Blockly.Icon.prototype.createIcon = function() {
  if (this.iconGroup_) {
    // Icon already exists.
    return;
  }
  /* Here's the markup that will be generated:
  <g class="blocklyIconGroup">
    ...
  </g>
  */
  this.iconGroup_ = Blockly.utils.createSvgElement('g',
      {'class': 'blocklyIconGroup'}, null);
  if (this.block_.isInFlyout) {
    Blockly.utils.addClass(
        /** @type {!Element} */ (this.iconGroup_), 'blocklyIconGroupReadonly');
  }
  this.drawIcon_(this.iconGroup_);

  this.block_.getSvgRoot().appendChild(this.iconGroup_);
  Blockly.bindEventWithChecks_(
      this.iconGroup_, 'mouseup', this, this.iconClick_);
=======
 * Absolute X coordinate of icon's center.
 * @private
 */
Blockly.Icon.prototype.iconX_ = 0;

/**
 * Absolute Y coordinate of icon's centre.
 * @private
 */
Blockly.Icon.prototype.iconY_ = 0;

/**
 * Create the icon on the block.
 * @private
 */
Blockly.Icon.prototype.createIcon_ = function() {
  /* Here's the markup that will be generated:
  <g class="blocklyIconGroup"></g>
  */
  this.iconGroup_ = Blockly.createSvgElement('g', {}, null);
  this.block_.getSvgRoot().appendChild(this.iconGroup_);
  Blockly.bindEvent_(this.iconGroup_, 'mouseup', this, this.iconClick_);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  this.updateEditable();
};

/**
 * Dispose of this icon.
 */
Blockly.Icon.prototype.dispose = function() {
  // Dispose of and unlink the icon.
  goog.dom.removeNode(this.iconGroup_);
  this.iconGroup_ = null;
  // Dispose of and unlink the bubble.
  this.setVisible(false);
  this.block_ = null;
};

/**
 * Add or remove the UI indicating if this icon may be clicked or not.
 */
Blockly.Icon.prototype.updateEditable = function() {
<<<<<<< HEAD
=======
  if (this.block_.isEditable() && !this.block_.isInFlyout) {
    Blockly.addClass_(/** @type {!Element} */ (this.iconGroup_),
                      'blocklyIconGroup');
  } else {
    Blockly.removeClass_(/** @type {!Element} */ (this.iconGroup_),
                         'blocklyIconGroup');
  }
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Is the associated bubble visible?
 * @return {boolean} True if the bubble is visible.
 */
Blockly.Icon.prototype.isVisible = function() {
  return !!this.bubble_;
};

/**
 * Clicking on the icon toggles if the bubble is visible.
 * @param {!Event} e Mouse click event.
<<<<<<< HEAD
 * @protected
 */
Blockly.Icon.prototype.iconClick_ = function(e) {
  if (this.block_.workspace.isDragging()) {
    // Drag operation is concluding.  Don't open the editor.
    return;
  }
  if (!this.block_.isInFlyout && !Blockly.utils.isRightButton(e)) {
=======
 * @private
 */
Blockly.Icon.prototype.iconClick_ = function(e) {
  if (this.block_.isEditable() && !this.block_.isInFlyout) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    this.setVisible(!this.isVisible());
  }
};

/**
 * Change the colour of the associated bubble to match its block.
 */
Blockly.Icon.prototype.updateColour = function() {
  if (this.isVisible()) {
<<<<<<< HEAD
    this.bubble_.setColour(this.block_.getColour());
=======
    var hexColour = Blockly.makeColour(this.block_.getColour());
    this.bubble_.setColour(hexColour);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
};

/**
 * Render the icon.
 * @param {number} cursorX Horizontal offset at which to position the icon.
 * @return {number} Horizontal offset for next item to draw.
 */
Blockly.Icon.prototype.renderIcon = function(cursorX) {
<<<<<<< HEAD
  if (this.collapseHidden && this.block_.isCollapsed()) {
=======
  if (this.block_.isCollapsed()) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    this.iconGroup_.setAttribute('display', 'none');
    return cursorX;
  }
  this.iconGroup_.setAttribute('display', 'block');

  var TOP_MARGIN = 5;
<<<<<<< HEAD
  var width = this.SIZE;
  if (this.block_.RTL) {
    cursorX -= width;
  }
  this.iconGroup_.setAttribute('transform',
      'translate(' + cursorX + ',' + TOP_MARGIN + ')');
  this.computeIconLocation();
  if (this.block_.RTL) {
    cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
  } else {
    cursorX += width + Blockly.BlockSvg.SEP_SPACE_X;
=======
  var diameter = 2 * Blockly.Icon.RADIUS;
  if (Blockly.RTL) {
    cursorX -= diameter;
  }
  this.iconGroup_.setAttribute('transform',
      'translate(' + cursorX + ', ' + TOP_MARGIN + ')');
  this.computeIconLocation();
  if (Blockly.RTL) {
    cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
  } else {
    cursorX += diameter + Blockly.BlockSvg.SEP_SPACE_X;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
  return cursorX;
};

/**
 * Notification that the icon has moved.  Update the arrow accordingly.
<<<<<<< HEAD
 * @param {!goog.math.Coordinate} xy Absolute location in workspace coordinates.
 */
Blockly.Icon.prototype.setIconLocation = function(xy) {
  this.iconXY_ = xy;
  if (this.isVisible()) {
    this.bubble_.setAnchorLocation(xy);
=======
 * @param {number} x Absolute horizontal location.
 * @param {number} y Absolute vertical location.
 */
Blockly.Icon.prototype.setIconLocation = function(x, y) {
  this.iconX_ = x;
  this.iconY_ = y;
  if (this.isVisible()) {
    this.bubble_.setAnchorLocation(x, y);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
};

/**
 * Notification that the icon has moved, but we don't really know where.
 * Recompute the icon's location from scratch.
 */
Blockly.Icon.prototype.computeIconLocation = function() {
  // Find coordinates for the centre of the icon and update the arrow.
  var blockXY = this.block_.getRelativeToSurfaceXY();
<<<<<<< HEAD
  var iconXY = Blockly.utils.getRelativeXY(this.iconGroup_);
  var newXY = new goog.math.Coordinate(
      blockXY.x + iconXY.x + this.SIZE / 2,
      blockXY.y + iconXY.y + this.SIZE / 2);
  if (!goog.math.Coordinate.equals(this.getIconLocation(), newXY)) {
    this.setIconLocation(newXY);
=======
  var iconXY = Blockly.getRelativeXY_(this.iconGroup_);
  var newX = blockXY.x + iconXY.x + Blockly.Icon.RADIUS;
  var newY = blockXY.y + iconXY.y + Blockly.Icon.RADIUS;
  if (newX !== this.iconX_ || newY !== this.iconY_) {
    this.setIconLocation(newX, newY);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
};

/**
 * Returns the center of the block's icon relative to the surface.
<<<<<<< HEAD
 * @return {!goog.math.Coordinate} Object with x and y properties in workspace
 *     coordinates.
 */
Blockly.Icon.prototype.getIconLocation = function() {
  return this.iconXY_;
=======
 * @return {!Object} Object with x and y properties.
 */
Blockly.Icon.prototype.getIconLocation = function() {
  return {x: this.iconX_, y: this.iconY_};
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};
