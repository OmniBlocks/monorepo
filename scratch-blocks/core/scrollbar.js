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
 * @fileoverview Library for creating scrollbars.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Scrollbar');
goog.provide('Blockly.ScrollbarPair');

<<<<<<< HEAD
goog.require('goog.dom');
goog.require('goog.events');


/**
 * A note on units: most of the numbers that are in CSS pixels are scaled if the
 * scrollbar is in a mutator.
 */

/**
=======
goog.require('goog.userAgent');


/**
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * Class for a pair of scrollbars.  Horizontal and vertical.
 * @param {!Blockly.Workspace} workspace Workspace to bind the scrollbars to.
 * @constructor
 */
Blockly.ScrollbarPair = function(workspace) {
  this.workspace_ = workspace;
<<<<<<< HEAD
  this.hScroll = new Blockly.Scrollbar(
      workspace, true, true, 'blocklyMainWorkspaceScrollbar');
  this.vScroll = new Blockly.Scrollbar(
      workspace, false, true, 'blocklyMainWorkspaceScrollbar');
  this.corner_ = Blockly.utils.createSvgElement(
      'rect',
      {
        'height': Blockly.Scrollbar.scrollbarThickness,
        'width': Blockly.Scrollbar.scrollbarThickness,
        'class': 'blocklyScrollbarBackground'
      },
      null);
  Blockly.utils.insertAfter(this.corner_, workspace.getBubbleCanvas());
};

/**
 * Previously recorded metrics from the workspace.
 * @type {Object}
 * @private
 */
Blockly.ScrollbarPair.prototype.oldHostMetrics_ = null;

/**
=======
  this.oldHostMetrics_ = null;
  this.hScroll = new Blockly.Scrollbar(workspace, true, true);
  this.vScroll = new Blockly.Scrollbar(workspace, false, true);
  this.corner_ = Blockly.createSvgElement('rect',
      {'height': Blockly.Scrollbar.scrollbarThickness,
      'width': Blockly.Scrollbar.scrollbarThickness,
      'style': 'fill: #fff'}, null);
  Blockly.Scrollbar.insertAfter_(this.corner_, workspace.getBubbleCanvas());
};

/**
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * Dispose of this pair of scrollbars.
 * Unlink from all DOM elements to prevent memory leaks.
 */
Blockly.ScrollbarPair.prototype.dispose = function() {
<<<<<<< HEAD
=======
  Blockly.unbindEvent_(this.onResizeWrapper_);
  this.onResizeWrapper_ = null;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  goog.dom.removeNode(this.corner_);
  this.corner_ = null;
  this.workspace_ = null;
  this.oldHostMetrics_ = null;
  this.hScroll.dispose();
  this.hScroll = null;
  this.vScroll.dispose();
  this.vScroll = null;
};

/**
 * Recalculate both of the scrollbars' locations and lengths.
 * Also reposition the corner rectangle.
 */
Blockly.ScrollbarPair.prototype.resize = function() {
  // Look up the host metrics once, and use for both scrollbars.
  var hostMetrics = this.workspace_.getMetrics();
  if (!hostMetrics) {
    // Host element is likely not visible.
    return;
  }

  // Only change the scrollbars if there has been a change in metrics.
  var resizeH = false;
  var resizeV = false;
  if (!this.oldHostMetrics_ ||
      this.oldHostMetrics_.viewWidth != hostMetrics.viewWidth ||
      this.oldHostMetrics_.viewHeight != hostMetrics.viewHeight ||
      this.oldHostMetrics_.absoluteTop != hostMetrics.absoluteTop ||
      this.oldHostMetrics_.absoluteLeft != hostMetrics.absoluteLeft) {
    // The window has been resized or repositioned.
    resizeH = true;
    resizeV = true;
  } else {
    // Has the content been resized or moved?
    if (!this.oldHostMetrics_ ||
        this.oldHostMetrics_.contentWidth != hostMetrics.contentWidth ||
        this.oldHostMetrics_.viewLeft != hostMetrics.viewLeft ||
        this.oldHostMetrics_.contentLeft != hostMetrics.contentLeft) {
      resizeH = true;
    }
    if (!this.oldHostMetrics_ ||
        this.oldHostMetrics_.contentHeight != hostMetrics.contentHeight ||
        this.oldHostMetrics_.viewTop != hostMetrics.viewTop ||
        this.oldHostMetrics_.contentTop != hostMetrics.contentTop) {
      resizeV = true;
    }
  }
  if (resizeH) {
    this.hScroll.resize(hostMetrics);
  }
  if (resizeV) {
    this.vScroll.resize(hostMetrics);
  }

  // Reposition the corner square.
  if (!this.oldHostMetrics_ ||
      this.oldHostMetrics_.viewWidth != hostMetrics.viewWidth ||
      this.oldHostMetrics_.absoluteLeft != hostMetrics.absoluteLeft) {
<<<<<<< HEAD
    this.corner_.setAttribute('x', this.vScroll.position_.x);
=======
    this.corner_.setAttribute('x', this.vScroll.xCoordinate);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
  if (!this.oldHostMetrics_ ||
      this.oldHostMetrics_.viewHeight != hostMetrics.viewHeight ||
      this.oldHostMetrics_.absoluteTop != hostMetrics.absoluteTop) {
<<<<<<< HEAD
    this.corner_.setAttribute('y', this.hScroll.position_.y);
=======
    this.corner_.setAttribute('y', this.hScroll.yCoordinate);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }

  // Cache the current metrics to potentially short-cut the next resize event.
  this.oldHostMetrics_ = hostMetrics;
};

/**
<<<<<<< HEAD
 * Set the handles of both scrollbars to be at a certain position in CSS pixels
 * relative to their parents.
=======
 * Set the sliders of both scrollbars to be at a certain position.
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * @param {number} x Horizontal scroll value.
 * @param {number} y Vertical scroll value.
 */
Blockly.ScrollbarPair.prototype.set = function(x, y) {
<<<<<<< HEAD
  // This function is equivalent to:
  //   this.hScroll.set(x);
  //   this.vScroll.set(y);
  // However, that calls setMetrics twice which causes a chain of
  // getAttribute->setAttribute->getAttribute resulting in an extra layout pass.
  // Combining them speeds up rendering.
  var xyRatio = {};

  var hHandlePosition = x * this.hScroll.ratio_;
  var vHandlePosition = y * this.vScroll.ratio_;

  var hBarLength = this.hScroll.scrollViewSize_;
  var vBarLength = this.vScroll.scrollViewSize_;

  xyRatio.x = this.getRatio_(hHandlePosition, hBarLength);
  xyRatio.y = this.getRatio_(vHandlePosition, vBarLength);
  this.workspace_.setMetrics(xyRatio);

  this.hScroll.setHandlePosition(hHandlePosition);
  this.vScroll.setHandlePosition(vHandlePosition);
};

/**
 * Helper to calculate the ratio of handle position to scrollbar view size.
 * @param {number} handlePosition The value of the handle.
 * @param {number} viewSize The total size of the scrollbar's view.
 * @return {number} Ratio.
 * @private
 */
Blockly.ScrollbarPair.prototype.getRatio_ = function(handlePosition, viewSize) {
  var ratio = handlePosition / viewSize;
  if (isNaN(ratio)) {
    return 0;
  }
  return ratio;
=======
  /* HACK:
   Two scrollbars are about to have their sliders moved.  Moving a scrollbar
   will normally result in its onScroll function being called.  That function
   will update the contents.  At issue is what happens when two scrollbars are
   moved.  Calling onScroll twice may result in two rerenderings of the content
   and increase jerkiness during dragging.
   In the case of native scrollbars (currently used only by Firefox), onScroll
   is called as an event, which means two separate renderings of the content are
   performed.  However in the case of SVG scrollbars (currently used by all
   other browsers), onScroll is called as a function and the browser only
   rerenders the contents once at the end of the thread.
  */
  if (Blockly.Scrollbar === Blockly.ScrollbarNative) {
    // Native scrollbar mode.
    // Set both scrollbars and suppress their two separate onScroll events.
    this.hScroll.set(x, false);
    this.vScroll.set(y, false);
    // Redraw the surface once with the new settings for both scrollbars.
    var xyRatio = {};
    xyRatio.x = (this.hScroll.outerDiv_.scrollLeft /
                 this.hScroll.innerImg_.offsetWidth) || 0;
    xyRatio.y = (this.vScroll.outerDiv_.scrollTop /
                 this.vScroll.innerImg_.offsetHeight) || 0;
    this.workspace_.setMetrics(xyRatio);
  } else {
    // SVG scrollbars.
    // Set both scrollbars and allow each to call a separate onScroll execution.
    this.hScroll.set(x, true);
    this.vScroll.set(y, true);
  }
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

// --------------------------------------------------------------------

/**
<<<<<<< HEAD
 * Class for a pure SVG scrollbar.
 * This technique offers a scrollbar that is guaranteed to work, but may not
 * look or behave like the system's scrollbars.
 * @param {!Blockly.Workspace} workspace Workspace to bind the scrollbar to.
 * @param {boolean} horizontal True if horizontal, false if vertical.
 * @param {boolean=} opt_pair True if scrollbar is part of a horiz/vert pair.
 * @param {string=} opt_class A class to be applied to this scrollbar.
 * @constructor
 */
Blockly.Scrollbar = function(workspace, horizontal, opt_pair, opt_class) {
  this.workspace_ = workspace;
  this.pair_ = opt_pair || false;
  this.horizontal_ = horizontal;
  this.oldHostMetrics_ = null;

  this.createDom_(opt_class);

  /**
   * The upper left corner of the scrollbar's SVG group in CSS pixels relative
   * to the scrollbar's origin.  This is usually relative to the injection div
   * origin.
   * @type {goog.math.Coordinate}
   * @private
   */
  this.position_ = new goog.math.Coordinate(0, 0);

  // Store the thickness in a temp variable for readability.
  var scrollbarThickness = Blockly.Scrollbar.scrollbarThickness;
  if (horizontal) {
    this.svgBackground_.setAttribute('height', scrollbarThickness);
    this.outerSvg_.setAttribute('height', scrollbarThickness);
    this.svgHandle_.setAttribute('height', scrollbarThickness - 5);
    this.svgHandle_.setAttribute('y', 2.5);

    this.lengthAttribute_ = 'width';
    this.positionAttribute_ = 'x';
  } else {
    this.svgBackground_.setAttribute('width', scrollbarThickness);
    this.outerSvg_.setAttribute('width', scrollbarThickness);
    this.svgHandle_.setAttribute('width', scrollbarThickness - 5);
    this.svgHandle_.setAttribute('x', 2.5);

    this.lengthAttribute_ = 'height';
    this.positionAttribute_ = 'y';
  }
  var scrollbar = this;
  this.onMouseDownBarWrapper_ = Blockly.bindEventWithChecks_(
      this.svgBackground_, 'mousedown', scrollbar, scrollbar.onMouseDownBar_);
  this.onMouseDownHandleWrapper_ = Blockly.bindEventWithChecks_(this.svgHandle_,
      'mousedown', scrollbar, scrollbar.onMouseDownHandle_);
};

/**
 * The location of the origin of the workspace that the scrollbar is in,
 * measured in CSS pixels relative to the injection div origin.  This is usually
 * (0, 0).  When the scrollbar is in a flyout it may have a different origin.
 * @type {goog.math.Coordinate}
 * @private
 */
Blockly.Scrollbar.prototype.origin_ = new goog.math.Coordinate(0, 0);

/**
   * Whether or not the origin of the scrollbar has changed. Used
   * to help decide whether or not the reflow/resize calls need to happen.
   * @type {boolean}
   * @private
   */
Blockly.Scrollbar.prototype.originHasChanged_ = true;

/**
 * The size of the area within which the scrollbar handle can move, in CSS
 * pixels.
 * @type {number}
 * @private
 */
Blockly.Scrollbar.prototype.scrollViewSize_ = 0;

/**
 * The length of the scrollbar handle in CSS pixels.
 * @type {number}
 * @private
 */
Blockly.Scrollbar.prototype.handleLength_ = 0;

/**
 * The offset of the start of the handle from the scrollbar position, in CSS
 * pixels.
 * @type {number}
 * @private
 */
Blockly.Scrollbar.prototype.handlePosition_ = 0;

/**
 * Whether the scrollbar handle is visible.
 * @type {boolean}
 * @private
 */
Blockly.Scrollbar.prototype.isVisible_ = true;

/**
 * Whether the workspace containing this scrollbar is visible.
 * @type {boolean}
 * @private
 */
Blockly.Scrollbar.prototype.containerVisible_ = true;

/**
 * Width of vertical scrollbar or height of horizontal scrollbar in CSS pixels.
 * Scrollbars should be larger on touch devices.
 */
Blockly.Scrollbar.scrollbarThickness = 11;
if (goog.events.BrowserFeature.TOUCH_ENABLED) {
  Blockly.Scrollbar.scrollbarThickness = 14;
}

/**
 * @param {!Object} first An object containing computed measurements of a
 *    workspace.
 * @param {!Object} second Another object containing computed measurements of a
 *    workspace.
 * @return {boolean} Whether the two sets of metrics are equivalent.
 * @private
 */
Blockly.Scrollbar.metricsAreEquivalent_ = function(first, second) {
  if (!(first && second)) {
    return false;
  }

  if (first.viewWidth != second.viewWidth ||
      first.viewHeight != second.viewHeight ||
      first.viewLeft != second.viewLeft ||
      first.viewTop != second.viewTop ||
      first.absoluteTop != second.absoluteTop ||
      first.absoluteLeft != second.absoluteLeft ||
      first.contentWidth != second.contentWidth ||
      first.contentHeight != second.contentHeight ||
      first.contentLeft != second.contentLeft ||
      first.contentTop != second.contentTop) {
    return false;
  }

  return true;
=======
 * Common properties and methods for ScrollbarNative and ScrollbarSvg.
 * Prevents the compiler from choosing incompatible names for properties on
 * each.
 * @interface
 */
Blockly.ScrollbarInterface = function() {};
/**
 * Dispose of this scrollbar.
 */
Blockly.ScrollbarInterface.prototype.dispose = function() {};
/**
 * Recalculate the scrollbar's location and its length.
 */
Blockly.ScrollbarInterface.prototype.resize = function() {};
/**
 * Is the scrollbar visible.
 * @return {boolean} True if visible.
 */
Blockly.ScrollbarInterface.prototype.isVisible = function() {};
/**
 * Set whether the scrollbar is visible.
 * @param {boolean} visible True if visible.
 */
Blockly.ScrollbarInterface.prototype.setVisible = function(visible) {};
/**
 * Set the scrollbar slider's position.
 * @param {number} value The distance from the top/left end of the bar.
 * @param {boolean} fireEvents True if onScroll events should be fired.
 */
Blockly.ScrollbarInterface.prototype.set = function(value, fireEvents) {};

// --------------------------------------------------------------------

/**
 * Class for a native widget scrollbar nested in a foreignObject element.
 * This technique offers a scrollbar that looks and behaves like the system's
 * scrollbars.  However it isn't well supported at the moment.
 * @param {!Blockly.Workspace} workspace Workspace to bind the scrollbar to.
 * @param {?boolean} horizontal True if horizontal, false if vertical.
 *     Null is used to create a test scrollbar to measure thickness.
 * @param {boolean=} opt_pair True if the scrollbar is part of a
 *     horizontal/vertical pair.
 * @constructor
 * @implements {Blockly.ScrollbarInterface}
 */
Blockly.ScrollbarNative = function(workspace, horizontal, opt_pair) {
  this.workspace_ = workspace;
  this.pair_ = opt_pair || false;
  this.horizontal_ = horizontal;

  this.createDom_();
  if (horizontal === null) {
    // Just return a bare-bones scrollbar DOM for thickness testing.
    return;
  }
  if (!Blockly.Scrollbar.scrollbarThickness) {
    // The first time a scrollbar is created, we need to measure the thickness.
    Blockly.ScrollbarNative.measureScrollbarThickness_(workspace);
  }

  if (horizontal) {
    this.foreignObject_.setAttribute('height',
        Blockly.Scrollbar.scrollbarThickness);
    this.outerDiv_.style.height =
        Blockly.Scrollbar.scrollbarThickness + 'px';
    this.outerDiv_.style.overflowX = 'scroll';
    this.outerDiv_.style.overflowY = 'hidden';
    this.innerImg_.style.height = '1px';
  } else {
    this.foreignObject_.setAttribute('width',
        Blockly.Scrollbar.scrollbarThickness);
    this.outerDiv_.style.width =
        Blockly.Scrollbar.scrollbarThickness + 'px';
    this.outerDiv_.style.overflowX = 'hidden';
    this.outerDiv_.style.overflowY = 'scroll';
    this.innerImg_.style.width = '1px';
  }
  var scrollbar = this;
  this.onScrollWrapper_ = Blockly.bindEvent_(this.outerDiv_, 'scroll',
      scrollbar, function() {scrollbar.onScroll_();});
  Blockly.bindEvent_(this.foreignObject_, 'mousedown', null,
      function(e) {Blockly.hideChaff(true); Blockly.noEvent(e);});
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Dispose of this scrollbar.
 * Unlink from all DOM elements to prevent memory leaks.
 */
<<<<<<< HEAD
Blockly.Scrollbar.prototype.dispose = function() {
  this.cleanUp_();
  Blockly.unbindEvent_(this.onMouseDownBarWrapper_);
  this.onMouseDownBarWrapper_ = null;
  Blockly.unbindEvent_(this.onMouseDownHandleWrapper_);
  this.onMouseDownHandleWrapper_ = null;

  goog.dom.removeNode(this.outerSvg_);
  this.outerSvg_ = null;
  this.svgGroup_ = null;
  this.svgBackground_ = null;
  this.svgHandle_ = null;
  this.workspace_ = null;
};

/**
 * Set the length of the scrollbar's handle and change the SVG attribute
 * accordingly.
 * @param {number} newLength The new scrollbar handle length in CSS pixels.
 */
Blockly.Scrollbar.prototype.setHandleLength_ = function(newLength) {
  this.handleLength_ = newLength;
  this.svgHandle_.setAttribute(this.lengthAttribute_, this.handleLength_);
};

/**
 * Set the offset of the scrollbar's handle from the scrollbar's position, and
 * change the SVG attribute accordingly.
 * @param {number} newPosition The new scrollbar handle offset in CSS pixels.
 */
Blockly.Scrollbar.prototype.setHandlePosition = function(newPosition) {
  this.handlePosition_ = newPosition;
  this.svgHandle_.setAttribute(this.positionAttribute_, this.handlePosition_);
};

/**
 * Set the size of the scrollbar's background and change the SVG attribute
 * accordingly.
 * @param {number} newSize The new scrollbar background length in CSS pixels.
 * @private
 */
Blockly.Scrollbar.prototype.setScrollViewSize_ = function(newSize) {
  this.scrollViewSize_ = newSize;
  this.outerSvg_.setAttribute(this.lengthAttribute_, this.scrollViewSize_);
  this.svgBackground_.setAttribute(this.lengthAttribute_, this.scrollViewSize_);
};

/**
 * Set whether this scrollbar's container is visible.
 * @param {boolean} visible Whether the container is visible.
 */
Blockly.ScrollbarPair.prototype.setContainerVisible = function(visible) {
  this.hScroll.setContainerVisible(visible);
  this.vScroll.setContainerVisible(visible);
};

/**
 * Set the position of the scrollbar's SVG group in CSS pixels relative to the
 * scrollbar's origin.  This sets the scrollbar's location within the workspace.
 * @param {number} x The new x coordinate.
 * @param {number} y The new y coordinate.
 * @private
 */
Blockly.Scrollbar.prototype.setPosition_ = function(x, y) {
  this.position_.x = x;
  this.position_.y = y;

  var tempX = this.position_.x + this.origin_.x;
  var tempY = this.position_.y + this.origin_.y;
  var transform = 'translate(' + tempX + 'px,' + tempY + 'px)';
  Blockly.utils.setCssTransform(this.outerSvg_, transform);
=======
Blockly.ScrollbarNative.prototype.dispose = function() {
  Blockly.unbindEvent_(this.onResizeWrapper_);
  this.onResizeWrapper_ = null;
  Blockly.unbindEvent_(this.onScrollWrapper_);
  this.onScrollWrapper_ = null;
  goog.dom.removeNode(this.foreignObject_);
  this.foreignObject_ = null;
  this.workspace_ = null;
  this.outerDiv_ = null;
  this.innerImg_ = null;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Recalculate the scrollbar's location and its length.
 * @param {Object=} opt_metrics A data structure of from the describing all the
 * required dimensions.  If not provided, it will be fetched from the host
 * object.
 */
<<<<<<< HEAD
Blockly.Scrollbar.prototype.resize = function(opt_metrics) {
=======
Blockly.ScrollbarNative.prototype.resize = function(opt_metrics) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  // Determine the location, height and width of the host element.
  var hostMetrics = opt_metrics;
  if (!hostMetrics) {
    hostMetrics = this.workspace_.getMetrics();
    if (!hostMetrics) {
      // Host element is likely not visible.
      return;
    }
  }
<<<<<<< HEAD

  // If the origin has changed (e.g. the toolbox is moving from start to end)
  // we want to continue with the resize even if workspace metrics haven't.
  if (this.originHasChanged_) {
    this.originHasChanged_ = false;
  } else if (Blockly.Scrollbar.metricsAreEquivalent_(hostMetrics,
      this.oldHostMetrics_)) {
    return;
  }
  this.oldHostMetrics_ = hostMetrics;

=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  /* hostMetrics is an object with the following properties.
   * .viewHeight: Height of the visible rectangle,
   * .viewWidth: Width of the visible rectangle,
   * .contentHeight: Height of the contents,
   * .contentWidth: Width of the content,
   * .viewTop: Offset of top edge of visible rectangle from parent,
   * .viewLeft: Offset of left edge of visible rectangle from parent,
   * .contentTop: Offset of the top-most content from the y=0 coordinate,
   * .contentLeft: Offset of the left-most content from the x=0 coordinate,
   * .absoluteTop: Top-edge of view.
   * .absoluteLeft: Left-edge of view.
   */
  if (this.horizontal_) {
<<<<<<< HEAD
    this.resizeHorizontal_(hostMetrics);
  } else {
    this.resizeVertical_(hostMetrics);
  }
  // Resizing may have caused some scrolling.
  this.onScroll_();
};

/**
 * Recalculate a horizontal scrollbar's location and length.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 * @private
 */
Blockly.Scrollbar.prototype.resizeHorizontal_ = function(hostMetrics) {
  // TODO: Inspect metrics to determine if we can get away with just a content
  // resize.
  this.resizeViewHorizontal(hostMetrics);
};

/**
 * Recalculate a horizontal scrollbar's location on the screen and path length.
 * This should be called when the layout or size of the window has changed.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 */
Blockly.Scrollbar.prototype.resizeViewHorizontal = function(hostMetrics) {
  var viewSize = hostMetrics.viewWidth - 1;
  if (this.pair_) {
    // Shorten the scrollbar to make room for the corner square.
    viewSize -= Blockly.Scrollbar.scrollbarThickness;
  }
  this.setScrollViewSize_(Math.max(0, viewSize));

  var xCoordinate = hostMetrics.absoluteLeft + 0.5;
  if (this.pair_ && this.workspace_.RTL) {
    xCoordinate += Blockly.Scrollbar.scrollbarThickness;
  }

  // Horizontal toolbar should always be just above the bottom of the workspace.
  var yCoordinate = hostMetrics.absoluteTop + hostMetrics.viewHeight -
      Blockly.Scrollbar.scrollbarThickness - 0.5;
  this.setPosition_(xCoordinate, yCoordinate);

  // If the view has been resized, a content resize will also be necessary.  The
  // reverse is not true.
  this.resizeContentHorizontal(hostMetrics);
};

/**
 * Recalculate a horizontal scrollbar's location within its path and length.
 * This should be called when the contents of the workspace have changed.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 */
Blockly.Scrollbar.prototype.resizeContentHorizontal = function(hostMetrics) {
  if (!this.pair_) {
    // Only show the scrollbar if needed.
    // Ideally this would also apply to scrollbar pairs, but that's a bigger
    // headache (due to interactions with the corner square).
    this.setVisible(this.scrollViewSize_ < hostMetrics.contentWidth);
  }

  this.ratio_ = this.scrollViewSize_ / hostMetrics.contentWidth;
  if (this.ratio_ == -Infinity || this.ratio_ == Infinity ||
      isNaN(this.ratio_)) {
    this.ratio_ = 0;
  }

  var handleLength = hostMetrics.viewWidth * this.ratio_;
  this.setHandleLength_(Math.max(0, handleLength));

  var handlePosition = (hostMetrics.viewLeft - hostMetrics.contentLeft) *
      this.ratio_;
  this.setHandlePosition(this.constrainHandle_(handlePosition));
};

/**
 * Recalculate a vertical scrollbar's location and length.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 * @private
 */
Blockly.Scrollbar.prototype.resizeVertical_ = function(hostMetrics) {
  // TODO: Inspect metrics to determine if we can get away with just a content
  // resize.
  this.resizeViewVertical(hostMetrics);
};

/**
 * Recalculate a vertical scrollbar's location on the screen and path length.
 * This should be called when the layout or size of the window has changed.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 */
Blockly.Scrollbar.prototype.resizeViewVertical = function(hostMetrics) {
  var viewSize = hostMetrics.viewHeight - 1;
  if (this.pair_) {
    // Shorten the scrollbar to make room for the corner square.
    viewSize -= Blockly.Scrollbar.scrollbarThickness;
  }
  this.setScrollViewSize_(Math.max(0, viewSize));

  var xCoordinate = hostMetrics.absoluteLeft + 0.5;
  if (!this.workspace_.RTL) {
    xCoordinate += hostMetrics.viewWidth -
        Blockly.Scrollbar.scrollbarThickness - 1;
  }
  var yCoordinate = hostMetrics.absoluteTop + 0.5;
  this.setPosition_(xCoordinate, yCoordinate);

  // If the view has been resized, a content resize will also be necessary.  The
  // reverse is not true.
  this.resizeContentVertical(hostMetrics);
};

/**
 * Recalculate a vertical scrollbar's location within its path and length.
 * This should be called when the contents of the workspace have changed.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 */
Blockly.Scrollbar.prototype.resizeContentVertical = function(hostMetrics) {
  if (!this.pair_) {
    // Only show the scrollbar if needed.
    this.setVisible(this.scrollViewSize_ < hostMetrics.contentHeight);
  }

  this.ratio_ = this.scrollViewSize_ / hostMetrics.contentHeight;
  if (this.ratio_ == -Infinity || this.ratio_ == Infinity ||
      isNaN(this.ratio_)) {
    this.ratio_ = 0;
  }

  var handleLength = hostMetrics.viewHeight * this.ratio_;
  this.setHandleLength_(Math.max(0, handleLength));

  var handlePosition = (hostMetrics.viewTop - hostMetrics.contentTop) *
      this.ratio_;
  this.setHandlePosition(this.constrainHandle_(handlePosition));
=======
    var outerLength = hostMetrics.viewWidth;
    if (this.pair_) {
      // Shorten the scrollbar to make room for the corner square.
      outerLength -= Blockly.Scrollbar.scrollbarThickness;
    } else {
      // Only show the scrollbar if needed.
      // Ideally this would also apply to scrollbar pairs, but that's a bigger
      // headache (due to interactions with the corner square).
      this.setVisible(outerLength < hostMetrics.contentWidth);
    }
    this.ratio_ = outerLength / hostMetrics.viewWidth;
    var innerLength = this.ratio_ * hostMetrics.contentWidth;
    var innerOffset = (hostMetrics.viewLeft - hostMetrics.contentLeft) *
        this.ratio_;
    this.outerDiv_.style.width = outerLength + 'px';
    this.innerImg_.style.width = innerLength + 'px';
    this.xCoordinate = hostMetrics.absoluteLeft;
    if (this.pair_ && Blockly.RTL) {
      this.xCoordinate += Blockly.Scrollbar.scrollbarThickness;
    }
    this.yCoordinate = hostMetrics.absoluteTop + hostMetrics.viewHeight -
        Blockly.Scrollbar.scrollbarThickness;
    this.foreignObject_.setAttribute('x', this.xCoordinate);
    this.foreignObject_.setAttribute('y', this.yCoordinate);
    this.foreignObject_.setAttribute('width', Math.max(0, outerLength));
    this.outerDiv_.scrollLeft = Math.round(innerOffset);
  } else {
    var outerLength = hostMetrics.viewHeight;
    if (this.pair_) {
      // Shorten the scrollbar to make room for the corner square.
      outerLength -= Blockly.Scrollbar.scrollbarThickness;
    } else {
      // Only show the scrollbar if needed.
      this.setVisible(outerLength < hostMetrics.contentHeight);
    }
    this.ratio_ = outerLength / hostMetrics.viewHeight;
    var innerLength = this.ratio_ * hostMetrics.contentHeight;
    var innerOffset = (hostMetrics.viewTop - hostMetrics.contentTop) *
        this.ratio_;
    this.outerDiv_.style.height = outerLength + 'px';
    this.innerImg_.style.height = innerLength + 'px';
    this.xCoordinate = hostMetrics.absoluteLeft;
    if (!Blockly.RTL) {
      this.xCoordinate += hostMetrics.viewWidth -
          Blockly.Scrollbar.scrollbarThickness;
    }
    this.yCoordinate = hostMetrics.absoluteTop;
    this.foreignObject_.setAttribute('x', this.xCoordinate);
    this.foreignObject_.setAttribute('y', this.yCoordinate);
    this.foreignObject_.setAttribute('height', Math.max(0, outerLength));
    this.outerDiv_.scrollTop = Math.round(innerOffset);
  }
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Create all the DOM elements required for a scrollbar.
 * The resulting widget is not sized.
<<<<<<< HEAD
 * @param {string=} opt_class A class to be applied to this scrollbar.
 * @private
 */
Blockly.Scrollbar.prototype.createDom_ = function(opt_class) {
  /* Create the following DOM:
  <svg class="blocklyScrollbarHorizontal  optionalClass">
    <g>
      <rect class="blocklyScrollbarBackground" />
      <rect class="blocklyScrollbarHandle" rx="8" ry="8" />
    </g>
  </svg>
  */
  var className = 'blocklyScrollbar' +
      (this.horizontal_ ? 'Horizontal' : 'Vertical');
  if (opt_class) {
    className += ' ' + opt_class;
  }
  this.outerSvg_ = Blockly.utils.createSvgElement(
      'svg', {'class': className}, null);
  this.svgGroup_ = Blockly.utils.createSvgElement('g', {}, this.outerSvg_);
  this.svgBackground_ = Blockly.utils.createSvgElement(
      'rect', {'class': 'blocklyScrollbarBackground'}, this.svgGroup_);
  var radius = Math.floor((Blockly.Scrollbar.scrollbarThickness - 5) / 2);
  this.svgHandle_ = Blockly.utils.createSvgElement(
      'rect',
      {
        'class': 'blocklyScrollbarHandle',
        'rx': radius,
        'ry': radius
      },
      this.svgGroup_);
  Blockly.utils.insertAfter(this.outerSvg_, this.workspace_.getParentSvg());
=======
 * @private
 */
Blockly.ScrollbarNative.prototype.createDom_ = function() {
  /* Create the following DOM:
  <foreignObject xmlns="http://www.w3.org/2000/svg">
    <body xmlns="http://www.w3.org/1999/xhtml" class="blocklyMinimalBody">
      <div>
        <img src="media/1x1.gif">
      </div>
    </body>
  </foreignObject>
  */
  this.foreignObject_ = Blockly.createSvgElement('foreignObject', {}, null);
  var body = document.createElementNS(Blockly.HTML_NS, 'body');
  body.setAttribute('xmlns', Blockly.HTML_NS);
  body.setAttribute('class', 'blocklyMinimalBody');
  var outer = document.createElementNS(Blockly.HTML_NS, 'div');
  this.outerDiv_ = outer;
  var inner = document.createElementNS(Blockly.HTML_NS, 'img');
  inner.setAttribute('src', Blockly.pathToBlockly + 'media/1x1.gif');
  this.innerImg_ = inner;

  outer.appendChild(inner);
  body.appendChild(outer);
  this.foreignObject_.appendChild(body);
  Blockly.Scrollbar.insertAfter_(this.foreignObject_,
                                 this.workspace_.getBubbleCanvas());
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Is the scrollbar visible.  Non-paired scrollbars disappear when they aren't
 * needed.
 * @return {boolean} True if visible.
 */
<<<<<<< HEAD
Blockly.Scrollbar.prototype.isVisible = function() {
  return this.isVisible_;
};

/**
 * Set whether the scrollbar's container is visible and update
 * display accordingly if visibility has changed.
 * @param {boolean} visible Whether the container is visible
 */
Blockly.Scrollbar.prototype.setContainerVisible = function(visible) {
  var visibilityChanged = (visible != this.containerVisible_);

  this.containerVisible_ = visible;
  if (visibilityChanged) {
    this.updateDisplay_();
  }
=======
Blockly.ScrollbarNative.prototype.isVisible = function() {
  return this.foreignObject_.style.display != 'none';
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Set whether the scrollbar is visible.
 * Only applies to non-paired scrollbars.
 * @param {boolean} visible True if visible.
 */
<<<<<<< HEAD
Blockly.Scrollbar.prototype.setVisible = function(visible) {
  var visibilityChanged = (visible != this.isVisible());

=======
Blockly.ScrollbarNative.prototype.setVisible = function(visible) {
  if (visible == this.isVisible()) {
    return;
  }
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  // Ideally this would also apply to scrollbar pairs, but that's a bigger
  // headache (due to interactions with the corner square).
  if (this.pair_) {
    throw 'Unable to toggle visibility of paired scrollbars.';
  }
<<<<<<< HEAD
  this.isVisible_ = visible;
  if (visibilityChanged) {
    this.updateDisplay_();
=======
  if (visible) {
    this.foreignObject_.style.display = 'block';
    /* HACK:
    For some reason Firefox requires the metrics to be recalculated after
    displaying the scrollbar.  Even though the metrics are identical and
    calculating these metrics has no side effects.  Failure to do so
    results in a scrollbar that's crushed to 0 in an off-scale range.
    */
    this.workspace_.getMetrics();
  } else {
    // Hide the scrollbar.
    this.workspace_.setMetrics({x: 0, y: 0});
    this.foreignObject_.style.display = 'none';
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
};

/**
<<<<<<< HEAD
 * Update visibility of scrollbar based on whether it thinks it should
 * be visible and whether its containing workspace is visible.
 * We cannot rely on the containing workspace being hidden to hide us
 * because it is not necessarily our parent in the DOM.
 */
Blockly.Scrollbar.prototype.updateDisplay_ = function() {
  var show = true;
  // Check whether our parent/container is visible.
  if (!this.containerVisible_) {
    show = false;
  } else {
    show = this.isVisible();
  }
  if (show) {
    this.outerSvg_.setAttribute('display', 'block');
  } else {
    this.outerSvg_.setAttribute('display', 'none');
=======
 * Called when scrollbar is dragged.
 * @private
 */
Blockly.ScrollbarNative.prototype.onScroll_ = function() {
  var xyRatio = {};
  if (this.horizontal_) {
    xyRatio.x = (this.outerDiv_.scrollLeft / this.innerImg_.offsetWidth) || 0;
  } else {
    xyRatio.y = (this.outerDiv_.scrollTop / this.innerImg_.offsetHeight) || 0;
  }
  this.workspace_.setMetrics(xyRatio);
};

/**
 * Set the scrollbar slider's position.
 * @param {number} value The distance from the top/left end of the bar.
 * @param {boolean} fireEvents True if onScroll events should be fired.
 */
Blockly.ScrollbarNative.prototype.set = function(value, fireEvents) {
  // If the scrollbar is part of a pair, it is slightly shorter than the view
  // and the value needs to be scaled accordingly.
  if (!fireEvents && this.onScrollWrapper_) {
    // Temporarily suppress the onscroll event handler.
    var scrollFunc = Blockly.unbindEvent_(this.onScrollWrapper_);
  }
  // Move the scrollbar slider.
  if (this.horizontal_) {
    this.outerDiv_.scrollLeft = value * this.ratio_;
  } else {
    this.outerDiv_.scrollTop = value * this.ratio_;
  }
  if (scrollFunc) {
    // Re-enable the onscroll event handler.
    var scrollbar = this;
    this.onScrollWrapper_ = Blockly.bindEvent_(this.outerDiv_, 'scroll',
        scrollbar, scrollFunc);
  }
};

/**
 * Mutilate this scrollbar to measure the thickness of an HTML scrollbar.
 * @param {!Blockly.Workspace} workspace Workspace to bind the scrollbar to.
 * @private
 */
Blockly.ScrollbarNative.measureScrollbarThickness_ = function(workspace) {
  var testBar = new Blockly.ScrollbarNative(workspace, null, false);

  testBar.outerDiv_.style.width = '100px';
  testBar.outerDiv_.style.height = '100px';
  testBar.innerImg_.style.width = '100%';
  testBar.innerImg_.style.height = '200px';
  // Trivia: failure to set a height and width results in Firefox returning
  // a scrollbar width of -85 instead of 15.
  testBar.foreignObject_.setAttribute('width', 1);
  testBar.foreignObject_.setAttribute('height', 1);

  // Measure the width of the inner-most div.
  testBar.outerDiv_.style.overflowY = 'scroll';
  var w1 = testBar.innerImg_.offsetWidth;
  // Turn off scrollbars and remeasure.
  testBar.outerDiv_.style.overflowY = 'hidden';
  var w2 = testBar.innerImg_.offsetWidth;

  // Dispose of the test scrollbar.
  goog.dom.removeNode(testBar.foreignObject_);

  var thickness = w2 - w1;
  if (thickness <= 0) {
    // Chrome for OS X 10.7 (Lion) floats scrollbars over the content, meaning
    // that there is no way to measure the thickness.  Pick a default.
    thickness = 15;
  }
  Blockly.Scrollbar.scrollbarThickness = thickness;
};

// --------------------------------------------------------------------

/**
 * Class for a pure SVG scrollbar.
 * This technique offers a scrollbar that is guaranteed to work, but may not
 * look or behave like the system's scrollbars.
 * @param {!Blockly.Workspace} workspace Workspace to bind the scrollbar to.
 * @param {boolean} horizontal True if horizontal, false if vertical.
 * @param {boolean} opt_pair True if the scrollbar is part of a horiz/vert pair.
 * @constructor
 * @implements {Blockly.ScrollbarInterface}
 */
Blockly.ScrollbarSvg = function(workspace, horizontal, opt_pair) {
  this.workspace_ = workspace;
  this.pair_ = opt_pair || false;
  this.horizontal_ = horizontal;

  this.createDom_();

  if (horizontal) {
    this.svgBackground_.setAttribute('height',
        Blockly.Scrollbar.scrollbarThickness);
    this.svgKnob_.setAttribute('height',
        Blockly.Scrollbar.scrollbarThickness - 6);
    this.svgKnob_.setAttribute('y', 3);
  } else {
    this.svgBackground_.setAttribute('width',
        Blockly.Scrollbar.scrollbarThickness);
    this.svgKnob_.setAttribute('width',
        Blockly.Scrollbar.scrollbarThickness - 6);
    this.svgKnob_.setAttribute('x', 3);
  }
  var scrollbar = this;
  this.onMouseDownBarWrapper_ = Blockly.bindEvent_(this.svgBackground_,
      'mousedown', scrollbar, scrollbar.onMouseDownBar_);
  this.onMouseDownKnobWrapper_ = Blockly.bindEvent_(this.svgKnob_,
      'mousedown', scrollbar, scrollbar.onMouseDownKnob_);
};

/**
 * Dispose of this scrollbar.
 * Unlink from all DOM elements to prevent memory leaks.
 */
Blockly.ScrollbarSvg.prototype.dispose = function() {
  this.onMouseUpKnob_();
  if (this.onResizeWrapper_) {
    Blockly.unbindEvent_(this.onResizeWrapper_);
    this.onResizeWrapper_ = null;
  }
  Blockly.unbindEvent_(this.onMouseDownBarWrapper_);
  this.onMouseDownBarWrapper_ = null;
  Blockly.unbindEvent_(this.onMouseDownKnobWrapper_);
  this.onMouseDownKnobWrapper_ = null;

  goog.dom.removeNode(this.svgGroup_);
  this.svgGroup_ = null;
  this.svgBackground_ = null;
  this.svgKnob_ = null;
  this.workspace_ = null;
};

/**
 * Recalculate the scrollbar's location and its length.
 * @param {Object=} opt_metrics A data structure of from the describing all the
 * required dimensions.  If not provided, it will be fetched from the host
 * object.
 */
Blockly.ScrollbarSvg.prototype.resize = function(opt_metrics) {
  // Determine the location, height and width of the host element.
  var hostMetrics = opt_metrics;
  if (!hostMetrics) {
    hostMetrics = this.workspace_.getMetrics();
    if (!hostMetrics) {
      // Host element is likely not visible.
      return;
    }
  }
  /* hostMetrics is an object with the following properties.
   * .viewHeight: Height of the visible rectangle,
   * .viewWidth: Width of the visible rectangle,
   * .contentHeight: Height of the contents,
   * .contentWidth: Width of the content,
   * .viewTop: Offset of top edge of visible rectangle from parent,
   * .viewLeft: Offset of left edge of visible rectangle from parent,
   * .contentTop: Offset of the top-most content from the y=0 coordinate,
   * .contentLeft: Offset of the left-most content from the x=0 coordinate,
   * .absoluteTop: Top-edge of view.
   * .absoluteLeft: Left-edge of view.
   */
  if (this.horizontal_) {
    var outerLength = hostMetrics.viewWidth;
    if (this.pair_) {
      // Shorten the scrollbar to make room for the corner square.
      outerLength -= Blockly.Scrollbar.scrollbarThickness;
    } else {
      // Only show the scrollbar if needed.
      // Ideally this would also apply to scrollbar pairs, but that's a bigger
      // headache (due to interactions with the corner square).
      this.setVisible(outerLength < hostMetrics.contentHeight);
    }
    this.ratio_ = outerLength / hostMetrics.contentWidth;
    if (this.ratio_ === -Infinity || this.ratio_ === Infinity ||
        isNaN(this.ratio_)) {
      this.ratio_ = 0;
    }
    var innerLength = hostMetrics.viewWidth * this.ratio_;
    var innerOffset = (hostMetrics.viewLeft - hostMetrics.contentLeft) *
        this.ratio_;
    this.svgKnob_.setAttribute('width', Math.max(0, innerLength));
    this.xCoordinate = hostMetrics.absoluteLeft;
    if (this.pair_ && Blockly.RTL) {
      this.xCoordinate += hostMetrics.absoluteLeft +
          Blockly.Scrollbar.scrollbarThickness;
    }
    this.yCoordinate = hostMetrics.absoluteTop + hostMetrics.viewHeight -
        Blockly.Scrollbar.scrollbarThickness;
    this.svgGroup_.setAttribute('transform',
        'translate(' + this.xCoordinate + ', ' + this.yCoordinate + ')');
    this.svgBackground_.setAttribute('width', Math.max(0, outerLength));
    this.svgKnob_.setAttribute('x', this.constrainKnob_(innerOffset));
  } else {
    var outerLength = hostMetrics.viewHeight;
    if (this.pair_) {
      // Shorten the scrollbar to make room for the corner square.
      outerLength -= Blockly.Scrollbar.scrollbarThickness;
    } else {
      // Only show the scrollbar if needed.
      this.setVisible(outerLength < hostMetrics.contentHeight);
    }
    this.ratio_ = outerLength / hostMetrics.contentHeight;
    if (this.ratio_ === -Infinity || this.ratio_ === Infinity ||
        isNaN(this.ratio_)) {
      this.ratio_ = 0;
    }
    var innerLength = hostMetrics.viewHeight * this.ratio_;
    var innerOffset = (hostMetrics.viewTop - hostMetrics.contentTop) *
        this.ratio_;
    this.svgKnob_.setAttribute('height', Math.max(0, innerLength));
    this.xCoordinate = hostMetrics.absoluteLeft;
    if (!Blockly.RTL) {
      this.xCoordinate += hostMetrics.viewWidth -
          Blockly.Scrollbar.scrollbarThickness;
    }
    this.yCoordinate = hostMetrics.absoluteTop;
    this.svgGroup_.setAttribute('transform',
        'translate(' + this.xCoordinate + ', ' + this.yCoordinate + ')');
    this.svgBackground_.setAttribute('height', Math.max(0, outerLength));
    this.svgKnob_.setAttribute('y', this.constrainKnob_(innerOffset));
  }
  // Resizing may have caused some scrolling.
  this.onScroll_();
};

/**
 * Create all the DOM elements required for a scrollbar.
 * The resulting widget is not sized.
 * @private
 */
Blockly.ScrollbarSvg.prototype.createDom_ = function() {
  /* Create the following DOM:
  <g>
    <rect class="blocklyScrollbarBackground" />
    <rect class="blocklyScrollbarKnob" rx="7" ry="7" />
  </g>
  */
  this.svgGroup_ = Blockly.createSvgElement('g', {}, null);
  this.svgBackground_ = Blockly.createSvgElement('rect',
      {'class': 'blocklyScrollbarBackground'}, this.svgGroup_);
  var radius = Math.floor((Blockly.Scrollbar.scrollbarThickness - 6) / 2);
  this.svgKnob_ = Blockly.createSvgElement('rect',
      {'class': 'blocklyScrollbarKnob', 'rx': radius, 'ry': radius},
      this.svgGroup_);
  Blockly.Scrollbar.insertAfter_(this.svgGroup_,
                                 this.workspace_.getBubbleCanvas());
};

/**
 * Is the scrollbar visible.  Non-paired scrollbars disappear when they aren't
 * needed.
 * @return {boolean} True if visible.
 */
Blockly.ScrollbarSvg.prototype.isVisible = function() {
  return this.svgGroup_.getAttribute('display') != 'none';
};

/**
 * Set whether the scrollbar is visible.
 * Only applies to non-paired scrollbars.
 * @param {boolean} visible True if visible.
 */
Blockly.ScrollbarSvg.prototype.setVisible = function(visible) {
  if (visible == this.isVisible()) {
    return;
  }
  // Ideally this would also apply to scrollbar pairs, but that's a bigger
  // headache (due to interactions with the corner square).
  if (this.pair_) {
    throw 'Unable to toggle visibility of paired scrollbars.';
  }
  if (visible) {
    this.svgGroup_.setAttribute('display', 'block');
  } else {
    // Hide the scrollbar.
    this.workspace_.setMetrics({x: 0, y: 0});
    this.svgGroup_.setAttribute('display', 'none');
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
};

/**
 * Scroll by one pageful.
 * Called when scrollbar background is clicked.
 * @param {!Event} e Mouse down event.
 * @private
 */
<<<<<<< HEAD
Blockly.Scrollbar.prototype.onMouseDownBar_ = function(e) {
  this.workspace_.markFocused();
  Blockly.Touch.clearTouchIdentifier();  // This is really a click.
  this.cleanUp_();
  if (Blockly.utils.isRightButton(e)) {
=======
Blockly.ScrollbarSvg.prototype.onMouseDownBar_ = function(e) {
  Blockly.hideChaff(true);
  if (Blockly.isRightButton(e)) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    // Right-click.
    // Scrollbars have no context menu.
    e.stopPropagation();
    return;
  }
<<<<<<< HEAD
  var mouseXY = Blockly.utils.mouseToSvg(e, this.workspace_.getParentSvg(),
      this.workspace_.getInverseScreenCTM());
  var mouseLocation = this.horizontal_ ? mouseXY.x : mouseXY.y;

  var handleXY = Blockly.utils.getInjectionDivXY_(this.svgHandle_);
  var handleStart = this.horizontal_ ? handleXY.x : handleXY.y;
  var handlePosition = this.handlePosition_;

  var pageLength = this.handleLength_ * 0.95;
  if (mouseLocation <= handleStart) {
    // Decrease the scrollbar's value by a page.
    handlePosition -= pageLength;
  } else if (mouseLocation >= handleStart + this.handleLength_) {
    // Increase the scrollbar's value by a page.
    handlePosition += pageLength;
  }
  // When the scrollbars are clicked, hide the WidgetDiv/DropDownDiv without
  // animation in anticipation of a workspace move.
  Blockly.WidgetDiv.hide(true);
  Blockly.DropDownDiv.hideWithoutAnimation();

  this.setHandlePosition(this.constrainHandle_(handlePosition));
  this.onScroll_();
  e.stopPropagation();
  e.preventDefault();
=======
  var mouseXY = Blockly.mouseToSvg(e);
  var mouseLocation = this.horizontal_ ? mouseXY.x : mouseXY.y;

  var knobXY = Blockly.getSvgXY_(this.svgKnob_);
  var knobStart = this.horizontal_ ? knobXY.x : knobXY.y;
  var knobLength = parseFloat(
      this.svgKnob_.getAttribute(this.horizontal_ ? 'width' : 'height'));
  var knobValue = parseFloat(
      this.svgKnob_.getAttribute(this.horizontal_ ? 'x' : 'y'));

  var pageLength = knobLength * 0.95;
  if (mouseLocation <= knobStart) {
    // Decrease the scrollbar's value by a page.
    knobValue -= pageLength;
  } else if (mouseLocation >= knobStart + knobLength) {
    // Increase the scrollbar's value by a page.
    knobValue += pageLength;
  }
  this.svgKnob_.setAttribute(this.horizontal_ ? 'x' : 'y',
                             this.constrainKnob_(knobValue));
  this.onScroll_();
  e.stopPropagation();
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Start a dragging operation.
<<<<<<< HEAD
 * Called when scrollbar handle is clicked.
 * @param {!Event} e Mouse down event.
 * @private
 */
Blockly.Scrollbar.prototype.onMouseDownHandle_ = function(e) {
  this.workspace_.markFocused();
  this.cleanUp_();
  if (Blockly.utils.isRightButton(e)) {
=======
 * Called when scrollbar knob is clicked.
 * @param {!Event} e Mouse down event.
 * @private
 */
Blockly.ScrollbarSvg.prototype.onMouseDownKnob_ = function(e) {
  Blockly.hideChaff(true);
  this.onMouseUpKnob_();
  if (Blockly.isRightButton(e)) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    // Right-click.
    // Scrollbars have no context menu.
    e.stopPropagation();
    return;
  }
  // Look up the current translation and record it.
<<<<<<< HEAD
  this.startDragHandle = this.handlePosition_;

  // Tell the workspace to setup its drag surface since it is about to move.
  // onMouseMoveHandle will call onScroll which actually tells the workspace
  // to move.
  this.workspace_.setupDragSurface();

  // Record the current mouse position.
  this.startDragMouse_ = this.horizontal_ ? e.clientX : e.clientY;
  Blockly.Scrollbar.onMouseUpWrapper_ = Blockly.bindEventWithChecks_(document,
      'mouseup', this, this.onMouseUpHandle_);
  Blockly.Scrollbar.onMouseMoveWrapper_ = Blockly.bindEventWithChecks_(document,
      'mousemove', this, this.onMouseMoveHandle_);
  // When the scrollbars are clicked, hide the WidgetDiv/DropDownDiv without
  // animation in anticipation of a workspace move.
  Blockly.WidgetDiv.hide(true);
  Blockly.DropDownDiv.hideWithoutAnimation();

  e.stopPropagation();
  e.preventDefault();
};

/**
 * Drag the scrollbar's handle.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.Scrollbar.prototype.onMouseMoveHandle_ = function(e) {
  var currentMouse = this.horizontal_ ? e.clientX : e.clientY;
  var mouseDelta = currentMouse - this.startDragMouse_;
  var handlePosition = this.startDragHandle + mouseDelta;
  // Position the bar.
  this.setHandlePosition(this.constrainHandle_(handlePosition));
=======
  this.startDragKnob = parseFloat(
      this.svgKnob_.getAttribute(this.horizontal_ ? 'x' : 'y'));
  // Record the current mouse position.
  this.startDragMouse = this.horizontal_ ? e.clientX : e.clientY;
  Blockly.ScrollbarSvg.onMouseUpWrapper_ = Blockly.bindEvent_(document,
      'mouseup', this, this.onMouseUpKnob_);
  Blockly.ScrollbarSvg.onMouseMoveWrapper_ = Blockly.bindEvent_(document,
      'mousemove', this, this.onMouseMoveKnob_);
  e.stopPropagation();
};

/**
 * Drag the scrollbar's knob.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.ScrollbarSvg.prototype.onMouseMoveKnob_ = function(e) {
  var currentMouse = this.horizontal_ ? e.clientX : e.clientY;
  var mouseDelta = currentMouse - this.startDragMouse;
  var knobValue = this.startDragKnob + mouseDelta;
  // Position the bar.
  this.svgKnob_.setAttribute(this.horizontal_ ? 'x' : 'y',
                             this.constrainKnob_(knobValue));
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  this.onScroll_();
};

/**
<<<<<<< HEAD
 * Release the scrollbar handle and reset state accordingly.
 * @private
 */
Blockly.Scrollbar.prototype.onMouseUpHandle_ = function() {
  // Tell the workspace to clean up now that the workspace is done moving.
  this.workspace_.resetDragSurface();
  Blockly.Touch.clearTouchIdentifier();
  this.cleanUp_();
};

/**
 * Hide chaff and stop binding to mouseup and mousemove events.  Call this to
 * wrap up lose ends associated with the scrollbar.
 * @private
 */
Blockly.Scrollbar.prototype.cleanUp_ = function() {
  Blockly.hideChaff(true);
  if (Blockly.Scrollbar.onMouseUpWrapper_) {
    Blockly.unbindEvent_(Blockly.Scrollbar.onMouseUpWrapper_);
    Blockly.Scrollbar.onMouseUpWrapper_ = null;
  }
  if (Blockly.Scrollbar.onMouseMoveWrapper_) {
    Blockly.unbindEvent_(Blockly.Scrollbar.onMouseMoveWrapper_);
    Blockly.Scrollbar.onMouseMoveWrapper_ = null;
=======
 * Stop binding to the global mouseup and mousemove events.
 * @private
 */
Blockly.ScrollbarSvg.prototype.onMouseUpKnob_ = function() {
  if (Blockly.ScrollbarSvg.onMouseUpWrapper_) {
    Blockly.unbindEvent_(Blockly.ScrollbarSvg.onMouseUpWrapper_);
    Blockly.ScrollbarSvg.onMouseUpWrapper_ = null;
  }
  if (Blockly.ScrollbarSvg.onMouseMoveWrapper_) {
    Blockly.unbindEvent_(Blockly.ScrollbarSvg.onMouseMoveWrapper_);
    Blockly.ScrollbarSvg.onMouseMoveWrapper_ = null;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
};

/**
<<<<<<< HEAD
 * Constrain the handle's position within the minimum (0) and maximum
 * (length of scrollbar) values allowed for the scrollbar.
 * @param {number} value Value that is potentially out of bounds, in CSS pixels.
 * @return {number} Constrained value, in CSS pixels.
 * @private
 */
Blockly.Scrollbar.prototype.constrainHandle_ = function(value) {
  if (value <= 0 || isNaN(value) || this.scrollViewSize_ < this.handleLength_) {
    value = 0;
  } else {
    value = Math.min(value, this.scrollViewSize_ - this.handleLength_);
=======
 * Constrain the knob's position within the minimum (0) and maximum
 * (length of scrollbar) values allowed for the scrollbar.
 * @param {number} value Value that is potentially out of bounds.
 * @return {number} Constrained value.
 * @private
 */
Blockly.ScrollbarSvg.prototype.constrainKnob_ = function(value) {
  if (value <= 0 || isNaN(value)) {
    value = 0;
  } else {
    var axis = this.horizontal_ ? 'width' : 'height';
    var barLength = parseFloat(this.svgBackground_.getAttribute(axis));
    var knobLength = parseFloat(this.svgKnob_.getAttribute(axis));
    value = Math.min(value, barLength - knobLength);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
  return value;
};

/**
 * Called when scrollbar is moved.
 * @private
 */
<<<<<<< HEAD
Blockly.Scrollbar.prototype.onScroll_ = function() {
  var ratio = this.handlePosition_ / this.scrollViewSize_;
=======
Blockly.ScrollbarSvg.prototype.onScroll_ = function() {
  var knobValue = parseFloat(
      this.svgKnob_.getAttribute(this.horizontal_ ? 'x' : 'y'));
  var barLength = parseFloat(
      this.svgBackground_.getAttribute(this.horizontal_ ? 'width' : 'height'));
  var ratio = knobValue / barLength;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  if (isNaN(ratio)) {
    ratio = 0;
  }
  var xyRatio = {};
  if (this.horizontal_) {
    xyRatio.x = ratio;
  } else {
    xyRatio.y = ratio;
  }
  this.workspace_.setMetrics(xyRatio);
};

/**
<<<<<<< HEAD
 * Set the scrollbar handle's position.
 * @param {number} value The distance from the top/left end of the bar, in CSS
 *     pixels.  It may be larger than the maximum allowable position of the
 *     scrollbar handle.
 */
Blockly.Scrollbar.prototype.set = function(value) {
  this.setHandlePosition(this.constrainHandle_(value * this.ratio_));
  this.onScroll_();
};

/**
 * Record the origin of the workspace that the scrollbar is in, in pixels
 * relative to the injection div origin. This is for times when the scrollbar is
 * used in an object whose origin isn't the same as the main workspace
 * (e.g. in a flyout.)
 * @param {number} x The x coordinate of the scrollbar's origin, in CSS pixels.
 * @param {number} y The y coordinate of the scrollbar's origin, in CSS pixels.
 */
Blockly.Scrollbar.prototype.setOrigin = function(x, y) {
  if (x != this.origin_.x || y != this.origin_.y) {
    this.origin_ = new goog.math.Coordinate(x, y);
    this.originHasChanged_ = true;
=======
 * Set the scrollbar slider's position.
 * @param {number} value The distance from the top/left end of the bar.
 * @param {boolean} fireEvents True if onScroll events should be fired.
 */
Blockly.ScrollbarSvg.prototype.set = function(value, fireEvents) {
  // Move the scrollbar slider.
  this.svgKnob_.setAttribute(this.horizontal_ ? 'x' : 'y', value * this.ratio_);

  if (fireEvents) {
    this.onScroll_();
  }
};

// --------------------------------------------------------------------

/**
 * Choose between the native and the SVG implementations.  The native one is
 * preferred, provided that the browser supports it.
 * To test, see: tests/native_scrollbar_test.html
 * Known good user agents:
 * Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:10.0.2)
 *     Gecko/20100101 Firefox/10.0.2
 * Mozilla/5.0 (Ubuntu; X11; Linux x86_64; rv:9.0.1)
 *     Gecko/20100101 Firefox/9.0.1
 */
if (goog.userAgent.GECKO &&
    (goog.userAgent.MAC || goog.userAgent.LINUX)) {
  /**
   * Class for a scrollbar.
   */
  Blockly.Scrollbar = Blockly.ScrollbarNative;
  /**
   * Width of vertical scrollbar or height of horizontal scrollbar.
   * Automatically measured and set after first scrollbar is created.
   */
  Blockly.Scrollbar.scrollbarThickness = 0;
} else {
  /**
   * Class for a scrollbar.
   */
  Blockly.Scrollbar = Blockly.ScrollbarSvg;
  /**
   * Width of vertical scrollbar or height of horizontal scrollbar.
   */
  Blockly.Scrollbar.scrollbarThickness = 15;
}

/**
 * Insert a node after a reference node.
 * Contrast with node.insertBefore function.
 * @param {!Element} newNode New element to insert.
 * @param {!Element} refNode Existing element to precede new node.
 * @private
 */
Blockly.Scrollbar.insertAfter_ = function(newNode, refNode) {
  var siblingNode = refNode.nextSibling;
  var parentNode = refNode.parentNode;
  if (!parentNode) {
    throw 'Reference node has no parent.';
  }
  if (siblingNode) {
    parentNode.insertBefore(newNode, siblingNode);
  } else {
    parentNode.appendChild(newNode);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
};
