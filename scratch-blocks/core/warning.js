/**
<<<<<<< HEAD
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
=======
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
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
 * @fileoverview Object representing a warning.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Warning');

goog.require('Blockly.Bubble');
<<<<<<< HEAD
goog.require('Blockly.Events.Ui');
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
goog.require('Blockly.Icon');


/**
 * Class for a warning.
 * @param {!Blockly.Block} block The block associated with this warning.
 * @extends {Blockly.Icon}
 * @constructor
 */
Blockly.Warning = function(block) {
  Blockly.Warning.superClass_.constructor.call(this, block);
<<<<<<< HEAD
  this.createIcon();
  // The text_ object can contain multiple warnings.
  this.text_ = {};
=======
  this.createIcon_();
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};
goog.inherits(Blockly.Warning, Blockly.Icon);

/**
<<<<<<< HEAD
 * Does this icon get hidden when the block is collapsed.
 */
Blockly.Warning.prototype.collapseHidden = false;

/**
 * Draw the warning icon.
 * @param {!Element} group The icon group.
 * @private
 */
Blockly.Warning.prototype.drawIcon_ = function(group) {
  // Triangle with rounded corners.
  Blockly.utils.createSvgElement('path',
      {
        'class': 'blocklyIconShape',
        'd': 'M2,15Q-1,15 0.5,12L6.5,1.7Q8,-1 9.5,1.7L15.5,12Q17,15 14,15z'
      },
      group);
  // Can't use a real '!' text character since different browsers and operating
  // systems render it differently.
  // Body of exclamation point.
  Blockly.utils.createSvgElement('path',
      {
        'class': 'blocklyIconSymbol',
        'd': 'm7,4.8v3.16l0.27,2.27h1.46l0.27,-2.27v-3.16z'
      },
      group);
  // Dot of exclamation point.
  Blockly.utils.createSvgElement('rect',
      {
        'class': 'blocklyIconSymbol',
        'x': '7',
        'y': '11',
        'height': '2',
        'width': '2'
      },
      group);
=======
 * Warning text (if bubble is not visible).
 * @private
 */
Blockly.Warning.prototype.text_ = '';

/**
 * Create the icon on the block.
 * @private
 */
Blockly.Warning.prototype.createIcon_ = function() {
  Blockly.Icon.prototype.createIcon_.call(this);
  /* Here's the markup that will be generated:
  <path class="blocklyIconShield" d="..."/>
  <text class="blocklyIconMark" x="8" y="13">!</text>
  */
  var iconShield = Blockly.createSvgElement('path',
      {'class': 'blocklyIconShield',
       'd': 'M 2,15 Q -1,15 0.5,12 L 6.5,1.7 Q 8,-1 9.5,1.7 L 15.5,12 ' +
       'Q 17,15 14,15 z'},
      this.iconGroup_);
  this.iconMark_ = Blockly.createSvgElement('text',
      {'class': 'blocklyIconMark',
       'x': Blockly.Icon.RADIUS,
       'y': 2 * Blockly.Icon.RADIUS - 3}, this.iconGroup_);
  this.iconMark_.appendChild(document.createTextNode('!'));
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Create the text for the warning's bubble.
 * @param {string} text The text to display.
 * @return {!SVGTextElement} The top-level node of the text.
 * @private
 */
<<<<<<< HEAD
Blockly.Warning.textToDom_ = function(text) {
  var paragraph = /** @type {!SVGTextElement} */
      (Blockly.utils.createSvgElement(
          'text',
          {
            'class': 'blocklyText blocklyBubbleText',
            'y': Blockly.Bubble.BORDER_WIDTH
          },
          null)
      );
  var lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var tspanElement = Blockly.utils.createSvgElement('tspan',
=======
Blockly.Warning.prototype.textToDom_ = function(text) {
  var paragraph = /** @type {!SVGTextElement} */ (
      Blockly.createSvgElement(
          'text', {'class': 'blocklyText', 'y': Blockly.Bubble.BORDER_WIDTH},
          null));
  var lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var tspanElement = Blockly.createSvgElement('tspan',
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
        {'dy': '1em', 'x': Blockly.Bubble.BORDER_WIDTH}, paragraph);
    var textNode = document.createTextNode(lines[i]);
    tspanElement.appendChild(textNode);
  }
  return paragraph;
};

/**
 * Show or hide the warning bubble.
 * @param {boolean} visible True if the bubble should be visible.
 */
Blockly.Warning.prototype.setVisible = function(visible) {
  if (visible == this.isVisible()) {
    // No change.
    return;
  }
<<<<<<< HEAD
  Blockly.Events.fire(
      new Blockly.Events.Ui(this.block_, 'warningOpen', !visible, visible));
  if (visible) {
    // Create the bubble to display all warnings.
    var paragraph = Blockly.Warning.textToDom_(this.getText());
    this.bubble_ = new Blockly.Bubble(
        /** @type {!Blockly.WorkspaceSvg} */ (this.block_.workspace),
        paragraph, this.block_.svgPath_, this.iconXY_, null, null);
    if (this.block_.RTL) {
      // Right-align the paragraph.
      // This cannot be done until the bubble is rendered on screen.
      var maxWidth = paragraph.getBBox().width;
      for (var i = 0, textElement; textElement = paragraph.childNodes[i]; i++) {
=======
  if (visible) {
    // Create the bubble.
    var paragraph = this.textToDom_(this.text_);
    this.bubble_ = new Blockly.Bubble(
        /** @type {!Blockly.Workspace} */ (this.block_.workspace),
        paragraph, this.block_.svg_.svgGroup_,
        this.iconX_, this.iconY_, null, null);
    if (Blockly.RTL) {
      // Right-align the paragraph.
      // This cannot be done until the bubble is rendered on screen.
      var maxWidth = paragraph.getBBox().width;
      for (var x = 0, textElement; textElement = paragraph.childNodes[x]; x++) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
        textElement.setAttribute('text-anchor', 'end');
        textElement.setAttribute('x', maxWidth + Blockly.Bubble.BORDER_WIDTH);
      }
    }
    this.updateColour();
    // Bump the warning into the right location.
    var size = this.bubble_.getBubbleSize();
    this.bubble_.setBubbleSize(size.width, size.height);
  } else {
    // Dispose of the bubble.
    this.bubble_.dispose();
    this.bubble_ = null;
    this.body_ = null;
<<<<<<< HEAD
=======
    this.foreignObject_ = null;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
};

/**
 * Bring the warning to the top of the stack when clicked on.
<<<<<<< HEAD
 * @param {!Event} _e Mouse up event.
 * @private
 */
Blockly.Warning.prototype.bodyFocus_ = function(_e) {
=======
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.Warning.prototype.bodyFocus_ = function(e) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  this.bubble_.promote_();
};

/**
 * Set this warning's text.
<<<<<<< HEAD
 * @param {string} text Warning text (or '' to delete).
 * @param {string} id An ID for this text entry to be able to maintain
 *     multiple warnings.
 */
Blockly.Warning.prototype.setText = function(text, id) {
  if (this.text_[id] == text) {
    return;
  }
  if (text) {
    this.text_[id] = text;
  } else {
    delete this.text_[id];
  }
=======
 * @param {string} text Warning text.
 */
Blockly.Warning.prototype.setText = function(text) {
  this.text_ = text;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  if (this.isVisible()) {
    this.setVisible(false);
    this.setVisible(true);
  }
};

/**
<<<<<<< HEAD
 * Get this warning's texts.
 * @return {string} All texts concatenated into one string.
 */
Blockly.Warning.prototype.getText = function() {
  var allWarnings = [];
  for (var id in this.text_) {
    allWarnings.push(this.text_[id]);
  }
  return allWarnings.join('\n');
};

/**
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * Dispose of this warning.
 */
Blockly.Warning.prototype.dispose = function() {
  this.block_.warning = null;
  Blockly.Icon.prototype.dispose.call(this);
};
