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
 * @fileoverview Library to create tooltips for Blockly.
 * First, call Blockly.Tooltip.init() after onload.
 * Second, set the 'tooltip' property on any SVG element that needs a tooltip.
 * If the tooltip is a string, then that message will be displayed.
 * If the tooltip is an SVG element, then that object's tooltip will be used.
 * Third, call Blockly.Tooltip.bindMouseEvents(e) passing the SVG element.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

<<<<<<< HEAD
/**
 * @name Blockly.Tooltip
 * @namespace
 **/
goog.provide('Blockly.Tooltip');

goog.require('goog.dom');
goog.require('goog.dom.TagName');

=======
goog.provide('Blockly.Tooltip');

>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)

/**
 * Is a tooltip currently showing?
 */
Blockly.Tooltip.visible = false;

/**
<<<<<<< HEAD
 * Is someone else blocking the tooltip from being shown?
 * @type {boolean}
 * @private
 */
Blockly.Tooltip.blocked_ = false;

/**
 * Maximum width (in characters) of a tooltip.
 */
Blockly.Tooltip.LIMIT = 50;

/**
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * PID of suspended thread to clear tooltip on mouse out.
 * @private
 */
Blockly.Tooltip.mouseOutPid_ = 0;

/**
 * PID of suspended thread to show the tooltip.
 * @private
 */
Blockly.Tooltip.showPid_ = 0;

/**
<<<<<<< HEAD
 * Last observed X location of the mouse pointer (freezes when tooltip appears).
 * @private
 */
Blockly.Tooltip.lastX_ = 0;

/**
 * Last observed Y location of the mouse pointer (freezes when tooltip appears).
 * @private
 */
Blockly.Tooltip.lastY_ = 0;
=======
 * Last observed location of the mouse pointer (freezes when tooltip appears).
 * @private
 */
Blockly.Tooltip.lastXY_ = {x: 0, y: 0};
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)

/**
 * Current element being pointed at.
 * @private
 */
Blockly.Tooltip.element_ = null;

/**
 * Once a tooltip has opened for an element, that element is 'poisoned' and
 * cannot respawn a tooltip until the pointer moves over a different element.
 * @private
 */
Blockly.Tooltip.poisonedElement_ = null;

/**
<<<<<<< HEAD
=======
 * Tooltip's SVG group element.
 * @type {Element}
 * @private
 */
Blockly.Tooltip.svgGroup_ = null;

/**
 * Tooltip's SVG text element.
 * @type {SVGTextElement}
 * @private
 */
Blockly.Tooltip.svgText_ = null;

/**
 * Tooltip's SVG background rectangle.
 * @type {Element}
 * @private
 */
Blockly.Tooltip.svgBackground_ = null;

/**
 * Tooltip's SVG shadow rectangle.
 * @type {Element}
 * @private
 */
Blockly.Tooltip.svgShadow_ = null;

/**
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * Horizontal offset between mouse cursor and tooltip.
 */
Blockly.Tooltip.OFFSET_X = 0;

/**
 * Vertical offset between mouse cursor and tooltip.
 */
Blockly.Tooltip.OFFSET_Y = 10;

/**
 * Radius mouse can move before killing tooltip.
 */
Blockly.Tooltip.RADIUS_OK = 10;

/**
 * Delay before tooltip appears.
 */
<<<<<<< HEAD
Blockly.Tooltip.HOVER_MS = 750;

/**
 * Horizontal padding between tooltip and screen edge.
=======
Blockly.Tooltip.HOVER_MS = 1000;

/**
 * Horizontal padding between text and background.
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 */
Blockly.Tooltip.MARGINS = 5;

/**
<<<<<<< HEAD
 * The HTML container.  Set once by Blockly.Tooltip.createDom.
 * @type {Element}
 */
Blockly.Tooltip.DIV = null;

/**
 * Create the tooltip div and inject it onto the page.
 */
Blockly.Tooltip.createDom = function() {
  if (Blockly.Tooltip.DIV) {
    return;  // Already created.
  }
  // Create an HTML container for popup overlays (e.g. editor widgets).
  Blockly.Tooltip.DIV =
      goog.dom.createDom(goog.dom.TagName.DIV, 'blocklyTooltipDiv');
  document.body.appendChild(Blockly.Tooltip.DIV);
=======
 * Create the tooltip elements.  Only needs to be called once.
 * @return {!SVGGElement} The tooltip's SVG group.
 */
Blockly.Tooltip.createDom = function() {
  /*
  <g class="blocklyHidden">
    <rect class="blocklyTooltipShadow" x="2" y="2"/>
    <rect class="blocklyTooltipBackground"/>
    <text class="blocklyTooltipText"></text>
  </g>
  */
  var svgGroup = /** @type {!SVGGElement} */ (
      Blockly.createSvgElement('g', {'class': 'blocklyHidden'}, null));
  Blockly.Tooltip.svgGroup_ = svgGroup;
  Blockly.Tooltip.svgShadow_ = /** @type {!SVGRectElement} */ (
      Blockly.createSvgElement(
          'rect', {'class': 'blocklyTooltipShadow', 'x': 2, 'y': 2}, svgGroup));
  Blockly.Tooltip.svgBackground_ = /** @type {!SVGRectElement} */ (
      Blockly.createSvgElement(
          'rect', {'class': 'blocklyTooltipBackground'}, svgGroup));
  Blockly.Tooltip.svgText_ = /** @type {!SVGTextElement} */ (
      Blockly.createSvgElement(
          'text', {'class': 'blocklyTooltipText'}, svgGroup));
  return svgGroup;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Binds the required mouse events onto an SVG element.
 * @param {!Element} element SVG element onto which tooltip is to be bound.
 */
Blockly.Tooltip.bindMouseEvents = function(element) {
<<<<<<< HEAD
  Blockly.bindEvent_(element, 'mouseover', null,
      Blockly.Tooltip.onMouseOver_);
  Blockly.bindEvent_(element, 'mouseout', null,
      Blockly.Tooltip.onMouseOut_);

  // Don't use bindEvent_ for mousemove since that would create a
  // corresponding touch handler, even though this only makes sense in the
  // context of a mouseover/mouseout.
  element.addEventListener('mousemove', Blockly.Tooltip.onMouseMove_, false);
=======
  Blockly.bindEvent_(element, 'mouseover', null, Blockly.Tooltip.onMouseOver_);
  Blockly.bindEvent_(element, 'mouseout', null, Blockly.Tooltip.onMouseOut_);
  Blockly.bindEvent_(element, 'mousemove', null, Blockly.Tooltip.onMouseMove_);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Hide the tooltip if the mouse is over a different object.
 * Initialize the tooltip to potentially appear for this object.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.Tooltip.onMouseOver_ = function(e) {
<<<<<<< HEAD
  if (Blockly.Tooltip.blocked_) {
    // Someone doesn't want us to show tooltips.
    return;
  }
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  // If the tooltip is an object, treat it as a pointer to the next object in
  // the chain to look at.  Terminate when a string or function is found.
  var element = e.target;
  while (!goog.isString(element.tooltip) && !goog.isFunction(element.tooltip)) {
    element = element.tooltip;
  }
  if (Blockly.Tooltip.element_ != element) {
    Blockly.Tooltip.hide();
    Blockly.Tooltip.poisonedElement_ = null;
    Blockly.Tooltip.element_ = element;
  }
<<<<<<< HEAD
  // Forget about any immediately preceding mouseOut event.
  clearTimeout(Blockly.Tooltip.mouseOutPid_);
=======
  // Forget about any immediately preceeding mouseOut event.
  window.clearTimeout(Blockly.Tooltip.mouseOutPid_);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Hide the tooltip if the mouse leaves the object and enters the workspace.
<<<<<<< HEAD
 * @param {!Event} _e Mouse event.
 * @private
 */
Blockly.Tooltip.onMouseOut_ = function(_e) {
  if (Blockly.Tooltip.blocked_) {
    // Someone doesn't want us to show tooltips.
    return;
  }
=======
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.Tooltip.onMouseOut_ = function(e) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  // Moving from one element to another (overlapping or with no gap) generates
  // a mouseOut followed instantly by a mouseOver.  Fork off the mouseOut
  // event and kill it if a mouseOver is received immediately.
  // This way the task only fully executes if mousing into the void.
<<<<<<< HEAD
  Blockly.Tooltip.mouseOutPid_ = setTimeout(function() {
    Blockly.Tooltip.element_ = null;
    Blockly.Tooltip.poisonedElement_ = null;
    Blockly.Tooltip.hide();
  }, 1);
  clearTimeout(Blockly.Tooltip.showPid_);
=======
  Blockly.Tooltip.mouseOutPid_ = window.setTimeout(function() {
        Blockly.Tooltip.element_ = null;
        Blockly.Tooltip.poisonedElement_ = null;
        Blockly.Tooltip.hide();
      }, 1);
  window.clearTimeout(Blockly.Tooltip.showPid_);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * When hovering over an element, schedule a tooltip to be shown.  If a tooltip
 * is already visible, hide it if the mouse strays out of a certain radius.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.Tooltip.onMouseMove_ = function(e) {
  if (!Blockly.Tooltip.element_ || !Blockly.Tooltip.element_.tooltip) {
    // No tooltip here to show.
    return;
<<<<<<< HEAD
  } else if (Blockly.WidgetDiv.isVisible()) {
    // Don't display a tooltip if a widget is open (tooltip would be under it).
    return;
  } else if (Blockly.Tooltip.blocked_) {
    // Someone doesn't want us to show tooltips.  We are probably handling a
    // user gesture, such as a click or drag.
=======
  } else if ((Blockly.ContextMenu && Blockly.ContextMenu.visible) ||
             Blockly.Block.dragMode_ != 0) {
    // Don't display a tooltip when a context menu is active, or during a drag.
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    return;
  }
  if (Blockly.Tooltip.visible) {
    // Compute the distance between the mouse position when the tooltip was
    // shown and the current mouse position.  Pythagorean theorem.
<<<<<<< HEAD
    var dx = Blockly.Tooltip.lastX_ - e.pageX;
    var dy = Blockly.Tooltip.lastY_ - e.pageY;
    if (Math.sqrt(dx * dx + dy * dy) > Blockly.Tooltip.RADIUS_OK) {
=======
    var mouseXY = Blockly.mouseToSvg(e);
    var dx = Blockly.Tooltip.lastXY_.x - mouseXY.x;
    var dy = Blockly.Tooltip.lastXY_.y - mouseXY.y;
    var dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (dr > Blockly.Tooltip.RADIUS_OK) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
      Blockly.Tooltip.hide();
    }
  } else if (Blockly.Tooltip.poisonedElement_ != Blockly.Tooltip.element_) {
    // The mouse moved, clear any previously scheduled tooltip.
<<<<<<< HEAD
    clearTimeout(Blockly.Tooltip.showPid_);
    // Maybe this time the mouse will stay put.  Schedule showing of tooltip.
    Blockly.Tooltip.lastX_ = e.pageX;
    Blockly.Tooltip.lastY_ = e.pageY;
    Blockly.Tooltip.showPid_ =
        setTimeout(Blockly.Tooltip.show_, Blockly.Tooltip.HOVER_MS);
=======
    window.clearTimeout(Blockly.Tooltip.showPid_);
    // Maybe this time the mouse will stay put.  Schedule showing of tooltip.
    Blockly.Tooltip.lastXY_ = Blockly.mouseToSvg(e);
    Blockly.Tooltip.showPid_ =
        window.setTimeout(Blockly.Tooltip.show_, Blockly.Tooltip.HOVER_MS);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
};

/**
 * Hide the tooltip.
 */
Blockly.Tooltip.hide = function() {
  if (Blockly.Tooltip.visible) {
    Blockly.Tooltip.visible = false;
<<<<<<< HEAD
    if (Blockly.Tooltip.DIV) {
      Blockly.Tooltip.DIV.style.display = 'none';
    }
  }
  if (Blockly.Tooltip.showPid_) {
    clearTimeout(Blockly.Tooltip.showPid_);
  }
};

/**
 * Hide any in-progress tooltips and block showing new tooltips until the next
 * call to unblock().
 * @package
 */
Blockly.Tooltip.block = function() {
  Blockly.Tooltip.hide();
  Blockly.Tooltip.blocked_ = true;
};

/**
 * Unblock tooltips: allow them to be scheduled and shown according to their own
 * logic.
 * @package
 */
Blockly.Tooltip.unblock = function() {
  Blockly.Tooltip.blocked_ = false;
=======
    if (Blockly.Tooltip.svgGroup_) {
      Blockly.Tooltip.svgGroup_.style.display = 'none';
    }
  }
  window.clearTimeout(Blockly.Tooltip.showPid_);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Create the tooltip and show it.
 * @private
 */
Blockly.Tooltip.show_ = function() {
<<<<<<< HEAD
  if (Blockly.Tooltip.blocked_) {
    // Someone doesn't want us to show tooltips.
    return;
  }
  Blockly.Tooltip.poisonedElement_ = Blockly.Tooltip.element_;
  if (!Blockly.Tooltip.DIV) {
    return;
  }
  // Erase all existing text.
  goog.dom.removeChildren(/** @type {!Element} */ (Blockly.Tooltip.DIV));
  // Get the new text.
  var tip = Blockly.Tooltip.element_.tooltip;
  while (goog.isFunction(tip)) {
    tip = tip();
  }
  tip = Blockly.utils.wrap(tip, Blockly.Tooltip.LIMIT);
  // Create new text, line by line.
  var lines = tip.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(lines[i]));
    Blockly.Tooltip.DIV.appendChild(div);
  }
  var rtl = Blockly.Tooltip.element_.RTL;
  var windowSize = goog.dom.getViewportSize();
  // Display the tooltip.
  Blockly.Tooltip.DIV.style.direction = rtl ? 'rtl' : 'ltr';
  Blockly.Tooltip.DIV.style.display = 'block';
  Blockly.Tooltip.visible = true;
  // Move the tooltip to just below the cursor.
  var anchorX = Blockly.Tooltip.lastX_;
  if (rtl) {
    anchorX -= Blockly.Tooltip.OFFSET_X + Blockly.Tooltip.DIV.offsetWidth;
  } else {
    anchorX += Blockly.Tooltip.OFFSET_X;
  }
  var anchorY = Blockly.Tooltip.lastY_ + Blockly.Tooltip.OFFSET_Y;

  if (anchorY + Blockly.Tooltip.DIV.offsetHeight >
      windowSize.height + window.scrollY) {
    // Falling off the bottom of the screen; shift the tooltip up.
    anchorY -= Blockly.Tooltip.DIV.offsetHeight + 2 * Blockly.Tooltip.OFFSET_Y;
  }
  if (rtl) {
    // Prevent falling off left edge in RTL mode.
    anchorX = Math.max(Blockly.Tooltip.MARGINS - window.scrollX, anchorX);
  } else {
    if (anchorX + Blockly.Tooltip.DIV.offsetWidth >
        windowSize.width + window.scrollX - 2 * Blockly.Tooltip.MARGINS) {
      // Falling off the right edge of the screen;
      // clamp the tooltip on the edge.
      anchorX = windowSize.width - Blockly.Tooltip.DIV.offsetWidth -
          2 * Blockly.Tooltip.MARGINS;
    }
  }
  Blockly.Tooltip.DIV.style.top = anchorY + 'px';
  Blockly.Tooltip.DIV.style.left = anchorX + 'px';
=======
  Blockly.Tooltip.poisonedElement_ = Blockly.Tooltip.element_;
  if (!Blockly.Tooltip.svgGroup_) {
    return;
  }
  // Erase all existing text.
  goog.dom.removeChildren(
      /** @type {!Element} */ (Blockly.Tooltip.svgText_));
  // Create new text, line by line.
  var tip = Blockly.Tooltip.element_.tooltip;
  if (goog.isFunction(tip)) {
    tip = tip();
  }
  var lines = tip.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var tspanElement = Blockly.createSvgElement('tspan',
        {'dy': '1em', 'x': Blockly.Tooltip.MARGINS}, Blockly.Tooltip.svgText_);
    var textNode = document.createTextNode(lines[i]);
    tspanElement.appendChild(textNode);
  }
  // Display the tooltip.
  Blockly.Tooltip.visible = true;
  Blockly.Tooltip.svgGroup_.style.display = 'block';
  // Resize the background and shadow to fit.
  var bBox = Blockly.Tooltip.svgText_.getBBox();
  var width = 2 * Blockly.Tooltip.MARGINS + bBox.width;
  var height = bBox.height;
  Blockly.Tooltip.svgBackground_.setAttribute('width', width);
  Blockly.Tooltip.svgBackground_.setAttribute('height', height);
  Blockly.Tooltip.svgShadow_.setAttribute('width', width);
  Blockly.Tooltip.svgShadow_.setAttribute('height', height);
  if (Blockly.RTL) {
    // Right-align the paragraph.
    // This cannot be done until the tooltip is rendered on screen.
    var maxWidth = bBox.width;
    for (var x = 0, textElement;
         textElement = Blockly.Tooltip.svgText_.childNodes[x]; x++) {
      textElement.setAttribute('text-anchor', 'end');
      textElement.setAttribute('x', maxWidth + Blockly.Tooltip.MARGINS);
    }
  }
  // Move the tooltip to just below the cursor.
  var anchorX = Blockly.Tooltip.lastXY_.x;
  if (Blockly.RTL) {
    anchorX -= Blockly.Tooltip.OFFSET_X + width;
  } else {
    anchorX += Blockly.Tooltip.OFFSET_X;
  }
  var anchorY = Blockly.Tooltip.lastXY_.y + Blockly.Tooltip.OFFSET_Y;

  var svgSize = Blockly.svgSize();
  if (anchorY + bBox.height > svgSize.height) {
    // Falling off the bottom of the screen; shift the tooltip up.
    anchorY -= bBox.height + 2 * Blockly.Tooltip.OFFSET_Y;
  }
  if (Blockly.RTL) {
    // Prevent falling off left edge in RTL mode.
    anchorX = Math.max(Blockly.Tooltip.MARGINS, anchorX);
  } else {
    if (anchorX + bBox.width > svgSize.width - 2 * Blockly.Tooltip.MARGINS) {
      // Falling off the right edge of the screen;
      // clamp the tooltip on the edge.
      anchorX = svgSize.width - bBox.width - 2 * Blockly.Tooltip.MARGINS;
    }
  }
  Blockly.Tooltip.svgGroup_.setAttribute('transform',
      'translate(' + anchorX + ',' + anchorY + ')');
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};
