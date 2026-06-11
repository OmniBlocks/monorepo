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
 * @fileoverview Angle input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldAngle');

<<<<<<< HEAD
goog.require('Blockly.DropDownDiv');
goog.require('Blockly.FieldTextInput');
goog.require('goog.math');
goog.require('goog.userAgent');
=======
goog.require('Blockly.FieldTextInput');
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)


/**
 * Class for an editable angle field.
<<<<<<< HEAD
 * @param {(string|number)=} opt_value The initial content of the field. The
 *     value should cast to a number, and if it does not, '0' will be used.
 * @param {Function=} opt_validator An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns the accepted text or null to abort
 *     the change.
 * @extends {Blockly.FieldTextInput}
 * @constructor
 */
Blockly.FieldAngle = function(opt_value, opt_validator) {
  // Add degree symbol: '360°' (LTR) or '°360' (RTL)
  this.symbol_ = Blockly.utils.createSvgElement('tspan', {}, null);
  this.symbol_.appendChild(document.createTextNode('\u00B0'));
  
  var numRestrictor = new RegExp("[\\d]|[\\.]|[-]|[eE]");

  opt_value = (opt_value && !isNaN(opt_value)) ? String(opt_value) : '0';
  Blockly.FieldAngle.superClass_.constructor.call(
      this, opt_value, opt_validator, numRestrictor);
  this.addArgType('angle');
=======
 * @param {string} text The initial content of the field.
 * @param {Function} opt_changeHandler An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns the accepted text or null to abort
 *     the change.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldAngle = function(text, opt_changeHandler) {
  var changeHandler;
  if (opt_changeHandler) {
    // Wrap the user's change handler together with the angle validator.
    var thisObj = this;
    changeHandler = function(value) {
      value = Blockly.FieldAngle.angleValidator.call(thisObj, value);
      if (value !== null) {
        opt_changeHandler.call(thisObj, value);
      }
      return value;
    };
  } else {
    changeHandler = Blockly.FieldAngle.angleValidator;
  }

  // Add degree symbol: "360°" (LTR) or "°360" (RTL)
  this.symbol_ = Blockly.createSvgElement('tspan', {}, null);
  this.symbol_.appendChild(document.createTextNode('\u00B0'));

  Blockly.FieldAngle.superClass_.constructor.call(this,
      text, changeHandler);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};
goog.inherits(Blockly.FieldAngle, Blockly.FieldTextInput);

/**
<<<<<<< HEAD
 * Construct a FieldAngle from a JSON arg object.
 * @param {!Object} options A JSON object with options (angle).
 * @returns {!Blockly.FieldAngle} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldAngle.fromJson = function(options) {
  return new Blockly.FieldAngle(options['angle']);
};

/**
 * Round angles to the nearest 15 degrees when using mouse.
 * Set to 0 to disable rounding.
 */
Blockly.FieldAngle.ROUND = 15;

/**
 * Half the width of protractor image.
 */
Blockly.FieldAngle.HALF = 120 / 2;

/* The following two settings work together to set the behaviour of the angle
 * picker.  While many combinations are possible, two modes are typical:
 * Math mode.
 *   0 deg is right, 90 is up.  This is the style used by protractors.
 *   Blockly.FieldAngle.CLOCKWISE = false;
 *   Blockly.FieldAngle.OFFSET = 0;
 * Compass mode.
 *   0 deg is up, 90 is right.  This is the style used by maps.
 *   Blockly.FieldAngle.CLOCKWISE = true;
 *   Blockly.FieldAngle.OFFSET = 90;
 */

/**
 * Angle increases clockwise (true) or counterclockwise (false).
 */
Blockly.FieldAngle.CLOCKWISE = true;

/**
 * Offset the location of 0 degrees (and all angles) by a constant.
 * Usually either 0 (0 = right) or 90 (0 = up).
 */
Blockly.FieldAngle.OFFSET = 90;

/**
 * Maximum allowed angle before wrapping.
 * Usually either 360 (for 0 to 359.9) or 180 (for -179.9 to 180).
 */
Blockly.FieldAngle.WRAP = 180;

/**
 * Radius of drag handle
 */
Blockly.FieldAngle.HANDLE_RADIUS = 10;

/**
 * Width of drag handle arrow
 */
Blockly.FieldAngle.ARROW_WIDTH = Blockly.FieldAngle.HANDLE_RADIUS;

/**
 * Half the stroke-width used for the "glow" around the drag handle, rounded up to nearest whole pixel
 */

Blockly.FieldAngle.HANDLE_GLOW_WIDTH = 3;
=======
 * Half the width of protractor image.
 */
Blockly.FieldAngle.HALF = 100 / 2;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)

/**
 * Radius of protractor circle.  Slightly smaller than protractor size since
 * otherwise SVG crops off half the border at the edges.
 */
<<<<<<< HEAD
Blockly.FieldAngle.RADIUS = Blockly.FieldAngle.HALF
    - Blockly.FieldAngle.HANDLE_RADIUS - Blockly.FieldAngle.HANDLE_GLOW_WIDTH;

/**
 * Radius of central dot circle.
 */
Blockly.FieldAngle.CENTER_RADIUS = 2;

/**
 * SVG path data for arrow icon.
 */
Blockly.FieldAngle.ARROW_SVG_PATH_DATA =
    'M 0.0189 -1.3178' +
    ' L -4.4901 -0.5663' +
    ' C -4.7532 -0.5224 -4.9811 -0.2606 -4.9811 0.0156' +
    ' C -4.9811 0.2836 -4.7613 0.5522 -4.4901 0.5974' +
    ' L 0.0189 1.3489' +
    ' L 0.0189 3.0185' +
    ' C 0.0189 3.5625 0.3833 3.752 0.8327 3.4269' +
    ' L 4.641 0.6721' +
    ' C 5.0982 0.3414 5.0957 -0.1853 4.6527 -0.5168' +
    ' L 0.821 -3.3842' +
    ' C 0.3756 -3.7175 0.0189 -3.5381 0.0189 -2.9874' +
    ' L 0.0189 -1.3178' +
    ' Z';
=======
Blockly.FieldAngle.RADIUS = Blockly.FieldAngle.HALF - 1;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)

/**
 * Clean up this FieldAngle, as well as the inherited FieldTextInput.
 * @return {!Function} Closure to call on destruction of the WidgetDiv.
 * @private
 */
Blockly.FieldAngle.prototype.dispose_ = function() {
  var thisField = this;
  return function() {
    Blockly.FieldAngle.superClass_.dispose_.call(thisField)();
    thisField.gauge_ = null;
<<<<<<< HEAD
    if (thisField.mouseDownWrapper_) {
      Blockly.unbindEvent_(thisField.mouseDownWrapper_);
    }
    if (thisField.mouseUpWrapper_) {
      Blockly.unbindEvent_(thisField.mouseUpWrapper_);
    }
    if (thisField.mouseMoveWrapper_) {
      Blockly.unbindEvent_(thisField.mouseMoveWrapper_);
=======
    if (thisField.clickWrapper_) {
      Blockly.unbindEvent_(thisField.clickWrapper_);
    }
    if (thisField.moveWrapper1_) {
      Blockly.unbindEvent_(thisField.moveWrapper1_);
    }
    if (thisField.moveWrapper2_) {
      Blockly.unbindEvent_(thisField.moveWrapper2_);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    }
  };
};

/**
 * Show the inline free-text editor on top of the text.
 * @private
 */
Blockly.FieldAngle.prototype.showEditor_ = function() {
<<<<<<< HEAD
  // Mobile browsers have issues with in-line textareas (focus & keyboards).
  Blockly.FieldAngle.superClass_.showEditor_.call(this, this.useTouchInteraction_);
  // If there is an existing drop-down someone else owns, hide it immediately and clear it.
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();
  var div = Blockly.DropDownDiv.getContentDiv();
  // Build the SVG DOM.
  var parentBlock = this.sourceBlock_.parentBlock_;
  var svg = Blockly.utils.createSvgElement('svg', {
=======
  Blockly.FieldAngle.superClass_.showEditor_.call(this);
  var div = Blockly.WidgetDiv.DIV;
  if (!div.firstChild) {
    // Mobile interface uses window.prompt.
    return;
  }
  // Build the SVG DOM.
  var svg = Blockly.createSvgElement('svg', {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlns:html': 'http://www.w3.org/1999/xhtml',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'version': '1.1',
    'height': (Blockly.FieldAngle.HALF * 2) + 'px',
    'width': (Blockly.FieldAngle.HALF * 2) + 'px'
  }, div);
<<<<<<< HEAD
  Blockly.utils.createSvgElement('circle', {
    'cx': Blockly.FieldAngle.HALF, 'cy': Blockly.FieldAngle.HALF,
    'r': Blockly.FieldAngle.RADIUS,
    'fill': parentBlock.getColourSecondary(),
    'stroke': parentBlock.getColourTertiary(),
    'class': 'blocklyAngleCircle'
  }, svg);
  this.gauge_ = Blockly.utils.createSvgElement('path',
      {'class': 'blocklyAngleGauge'}, svg);
  // The moving line, x2 and y2 are set in updateGraph_
  this.line_ = Blockly.utils.createSvgElement('line',{
    'x1': Blockly.FieldAngle.HALF,
    'y1': Blockly.FieldAngle.HALF,
    'class': 'blocklyAngleLine'
  }, svg);
  // The fixed vertical line at the offset
  var offsetRadians = Math.PI * Blockly.FieldAngle.OFFSET / 180;
  Blockly.utils.createSvgElement('line', {
    'x1': Blockly.FieldAngle.HALF,
    'y1': Blockly.FieldAngle.HALF,
    'x2': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS * Math.cos(offsetRadians),
    'y2': Blockly.FieldAngle.HALF - Blockly.FieldAngle.RADIUS * Math.sin(offsetRadians),
    'class': 'blocklyAngleLine'
  }, svg);
  // Draw markers around the edge.
  for (var angle = 0; angle < 360; angle += 15) {
    Blockly.utils.createSvgElement('line', {
      'x1': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS - 13,
      'y1': Blockly.FieldAngle.HALF,
      'x2': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS - 7,
      'y2': Blockly.FieldAngle.HALF,
      'class': 'blocklyAngleMarks',
      'transform': 'rotate(' + angle + ',' +
          Blockly.FieldAngle.HALF + ',' + Blockly.FieldAngle.HALF + ')'
    }, svg);
  }
  // Center point
  Blockly.utils.createSvgElement('circle', {
    'cx': Blockly.FieldAngle.HALF, 'cy': Blockly.FieldAngle.HALF,
    'r': Blockly.FieldAngle.CENTER_RADIUS,
    'class': 'blocklyAngleCenterPoint'
  }, svg);
  // Handle group: a circle and the arrow image
  this.handle_ = Blockly.utils.createSvgElement('g', {}, svg);
  Blockly.utils.createSvgElement('circle', {
    'cx': 0,
    'cy': 0,
    'r': Blockly.FieldAngle.HANDLE_RADIUS,
    'class': 'blocklyAngleDragHandle'
  }, this.handle_);
  this.arrowSvg_ = Blockly.utils.createSvgElement('path',
      {
        'width': Blockly.FieldAngle.ARROW_WIDTH,
        'height': Blockly.FieldAngle.ARROW_WIDTH,
        'x': -Blockly.FieldAngle.ARROW_WIDTH / 2,
        'y': -Blockly.FieldAngle.ARROW_WIDTH / 2,
        'class': 'blocklyAngleDragArrow',
        'fill': parentBlock.getColour(),
        'd': Blockly.FieldAngle.ARROW_SVG_PATH_DATA
      },
      this.handle_);

  Blockly.DropDownDiv.setColour(parentBlock.getColour(), this.sourceBlock_.getColourTertiary());
  Blockly.DropDownDiv.setCategory(parentBlock.getCategory());
  Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);

  this.mouseDownWrapper_ =
      Blockly.bindEvent_(this.handle_, 'mousedown', this, this.onMouseDown);

  this.updateGraph_();
};
/**
 * Set the angle to match the mouse's position.
 * @param {!Event} e Mouse move event.
 */
Blockly.FieldAngle.prototype.onMouseDown = function() {
  this.mouseMoveWrapper_ = Blockly.bindEvent_(document.body, 'mousemove', this, this.onMouseMove);
  this.mouseUpWrapper_ = Blockly.bindEvent_(document.body, 'mouseup', this, this.onMouseUp);
};

/**
 * Set the angle to match the mouse's position.
 * @param {!Event} e Mouse move event.
 */
Blockly.FieldAngle.prototype.onMouseUp = function() {
  Blockly.unbindEvent_(this.mouseMoveWrapper_);
  Blockly.unbindEvent_(this.mouseUpWrapper_);
=======
  var circle = Blockly.createSvgElement('circle', {
    'cx': Blockly.FieldAngle.HALF, 'cy': Blockly.FieldAngle.HALF,
    'r': Blockly.FieldAngle.RADIUS,
    'class': 'blocklyAngleCircle'
  }, svg);
  this.gauge_ =
      Blockly.createSvgElement('path', {'class': 'blocklyAngleGuage'}, svg);
  // Draw markers around the edge.
  for (var a = 0; a < 360; a += 15) {
    Blockly.createSvgElement('line', {
      'x1': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS,
      'y1': Blockly.FieldAngle.HALF,
      'x2': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS -
          (a % 45 == 0 ? 10 : 5),
      'y2': Blockly.FieldAngle.HALF,
      'class': 'blocklyAngleMarks',
      'transform': 'rotate(' + a + ', ' +
          Blockly.FieldAngle.HALF + ', ' + Blockly.FieldAngle.HALF + ')'
    }, svg);
  }
  svg.style.marginLeft = '-35px';
  this.clickWrapper_ =
      Blockly.bindEvent_(svg, 'click', this, Blockly.WidgetDiv.hide);
  this.moveWrapper1_ =
      Blockly.bindEvent_(circle, 'mousemove', this, this.onMouseMove);
  this.moveWrapper2_ =
      Blockly.bindEvent_(this.gauge_, 'mousemove', this, this.onMouseMove);
  this.updateGraph();
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Set the angle to match the mouse's position.
 * @param {!Event} e Mouse move event.
 */
Blockly.FieldAngle.prototype.onMouseMove = function(e) {
<<<<<<< HEAD
  e.preventDefault();
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  var bBox = this.gauge_.ownerSVGElement.getBoundingClientRect();
  var dx = e.clientX - bBox.left - Blockly.FieldAngle.HALF;
  var dy = e.clientY - bBox.top - Blockly.FieldAngle.HALF;
  var angle = Math.atan(-dy / dx);
  if (isNaN(angle)) {
<<<<<<< HEAD
    // This shouldn't happen, but let's not let this error propagate further.
    return;
  }
  angle = goog.math.toDegrees(angle);
=======
    // This shouldn't happen, but let's not let this error propogate further.
    return;
  }
  angle = angle / Math.PI * 180;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  // 0: East, 90: North, 180: West, 270: South.
  if (dx < 0) {
    angle += 180;
  } else if (dy > 0) {
    angle += 360;
  }
<<<<<<< HEAD
  if (Blockly.FieldAngle.CLOCKWISE) {
    angle = Blockly.FieldAngle.OFFSET + 360 - angle;
  } else {
    angle -= Blockly.FieldAngle.OFFSET;
  }
  if (Blockly.FieldAngle.ROUND) {
    angle = Math.round(angle / Blockly.FieldAngle.ROUND) *
        Blockly.FieldAngle.ROUND;
  }
  angle = this.callValidator(angle);
  Blockly.FieldTextInput.htmlInput_.value = angle;
  this.setValue(angle);
  this.validate_();
  this.resizeEditor_();
=======
  angle = String(Math.round(angle));
  Blockly.FieldTextInput.htmlInput_.value = angle;
  this.setText(angle);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Insert a degree symbol.
 * @param {?string} text New text.
 */
Blockly.FieldAngle.prototype.setText = function(text) {
  Blockly.FieldAngle.superClass_.setText.call(this, text);
<<<<<<< HEAD
  if (!this.textElement_) {
    // Not rendered yet.
    return;
  }
  this.updateGraph_();
=======
  this.updateGraph();
  // Insert degree symbol.
  if (Blockly.RTL) {
    this.textElement_.insertBefore(this.symbol_, this.textElement_.firstChild);
  } else {
    this.textElement_.appendChild(this.symbol_);
  }
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  // Cached width is obsolete.  Clear it.
  this.size_.width = 0;
};

/**
<<<<<<< HEAD
 * Redraw the graph with the current angle.
 * @private
 */
Blockly.FieldAngle.prototype.updateGraph_ = function() {
  if (!this.gauge_) {
    return;
  }
  var angleDegrees = Number(this.getText()) % 360 + Blockly.FieldAngle.OFFSET;
  var angleRadians = goog.math.toRadians(angleDegrees);
  var path = ['M ', Blockly.FieldAngle.HALF, ',', Blockly.FieldAngle.HALF];
  var x2 = Blockly.FieldAngle.HALF;
  var y2 = Blockly.FieldAngle.HALF;
  if (!isNaN(angleRadians)) {
    var angle1 = goog.math.toRadians(Blockly.FieldAngle.OFFSET);
    var x1 = Math.cos(angle1) * Blockly.FieldAngle.RADIUS;
    var y1 = Math.sin(angle1) * -Blockly.FieldAngle.RADIUS;
    if (Blockly.FieldAngle.CLOCKWISE) {
      angleRadians = 2 * angle1 - angleRadians;
    }
    x2 += Math.cos(angleRadians) * Blockly.FieldAngle.RADIUS;
    y2 -= Math.sin(angleRadians) * Blockly.FieldAngle.RADIUS;
    // Use large arc only if input value is greater than wrap
    var largeFlag = Math.abs(angleDegrees - Blockly.FieldAngle.OFFSET) > 180 ? 1 : 0;
    var sweepFlag = Number(Blockly.FieldAngle.CLOCKWISE);
    if (angleDegrees < Blockly.FieldAngle.OFFSET) {
      sweepFlag = 1 - sweepFlag; // Sweep opposite direction if less than the offset
    }
    path.push(' l ', x1, ',', y1,
        ' A ', Blockly.FieldAngle.RADIUS, ',', Blockly.FieldAngle.RADIUS,
        ' 0 ', largeFlag, ' ', sweepFlag, ' ', x2, ',', y2, ' z');

    // Image rotation needs to be set in degrees
    if (Blockly.FieldAngle.CLOCKWISE) {
      var imageRotation = angleDegrees + 2 * Blockly.FieldAngle.OFFSET;
    } else {
      var imageRotation = -angleDegrees;
    }
    this.arrowSvg_.setAttribute('transform', 'rotate(' + (imageRotation) + ')');
  }
  this.gauge_.setAttribute('d', path.join(''));
  this.line_.setAttribute('x2', x2);
  this.line_.setAttribute('y2', y2);
  this.handle_.setAttribute('transform', 'translate(' + x2 + ',' + y2 + ')');
};

/**
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * Ensure that only an angle may be entered.
 * @param {string} text The user's text.
 * @return {?string} A string representing a valid angle, or null if invalid.
 */
<<<<<<< HEAD
Blockly.FieldAngle.prototype.classValidator = function(text) {
  if (text === null) {
    return null;
  }
  var n = parseFloat(text || 0);
  if (isNaN(n)) {
    return null;
  }
  n = n % 360;
  if (n < 0) {
    n += 360;
  }
  if (n > Blockly.FieldAngle.WRAP) {
    n -= 360;
  }
  return String(n);
};

Blockly.Field.register('field_angle', Blockly.FieldAngle);
=======
Blockly.FieldAngle.prototype.updateGraph = function() {
  if (this.gauge_) {
    var angleRadians = Number(this.getText()) / 180 * Math.PI;
    if (isNaN(angleRadians)) {
      this.gauge_.setAttribute('d',
          'M ' + Blockly.FieldAngle.HALF + ', ' + Blockly.FieldAngle.HALF);
    } else {
      var x = Blockly.FieldAngle.HALF + Math.cos(angleRadians) *
          Blockly.FieldAngle.RADIUS;
      var y = Blockly.FieldAngle.HALF + Math.sin(angleRadians) *
          -Blockly.FieldAngle.RADIUS;
      var largeFlag = (angleRadians > Math.PI) ? 1 : 0;
      this.gauge_.setAttribute('d',
          'M ' + Blockly.FieldAngle.HALF + ', ' + Blockly.FieldAngle.HALF +
          ' h ' + Blockly.FieldAngle.RADIUS +
          ' A ' + Blockly.FieldAngle.RADIUS + ',' + Blockly.FieldAngle.RADIUS +
          ' 0 ' + largeFlag + ' 0 ' + x + ',' + y + ' z');
    }
  }
};

/**
 * Ensure that only an angle may be entered.
 * @param {string} text The user's text.
 * @return {?string} A string representing a valid angle, or null if invalid.
 */
Blockly.FieldAngle.angleValidator = function(text) {
  var n = Blockly.FieldTextInput.numberValidator(text);
  if (n !== null) {
    n = n % 360;
    if (n < 0) {
      n += 360;
    }
    n = String(n);
   }
  return n;
};
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
