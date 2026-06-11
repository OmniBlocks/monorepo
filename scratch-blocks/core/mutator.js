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
 * @fileoverview Object representing a mutator dialog.  A mutator allows the
 * user to change the shape of a block using a nested blocks editor.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Mutator');

goog.require('Blockly.Bubble');
<<<<<<< HEAD
goog.require('Blockly.Events.BlockChange');
goog.require('Blockly.Events.Ui');
goog.require('Blockly.Icon');
goog.require('Blockly.WorkspaceSvg');
goog.require('goog.dom');
=======
goog.require('Blockly.Icon');
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)


/**
 * Class for a mutator dialog.
 * @param {!Array.<string>} quarkNames List of names of sub-blocks for flyout.
 * @extends {Blockly.Icon}
 * @constructor
 */
Blockly.Mutator = function(quarkNames) {
  Blockly.Mutator.superClass_.constructor.call(this, null);
<<<<<<< HEAD
  this.quarkNames_ = quarkNames;
=======
  this.quarkXml_ = [];
  // Convert the list of names into a list of XML objects for the flyout.
  for (var x = 0; x < quarkNames.length; x++) {
    var element = goog.dom.createDom('block', {'type': quarkNames[x]});
    this.quarkXml_[x] = element;
  }
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};
goog.inherits(Blockly.Mutator, Blockly.Icon);

/**
 * Width of workspace.
 * @private
 */
Blockly.Mutator.prototype.workspaceWidth_ = 0;

/**
 * Height of workspace.
 * @private
 */
Blockly.Mutator.prototype.workspaceHeight_ = 0;

/**
<<<<<<< HEAD
 * Draw the mutator icon.
 * @param {!Element} group The icon group.
 * @private
 */
Blockly.Mutator.prototype.drawIcon_ = function(group) {
  // Square with rounded corners.
  Blockly.utils.createSvgElement('rect',
      {
        'class': 'blocklyIconShape',
        'rx': '4',
        'ry': '4',
        'height': '16',
        'width': '16'
      },
      group);
  // Gear teeth.
  Blockly.utils.createSvgElement('path',
      {
        'class': 'blocklyIconSymbol',
        'd': 'm4.203,7.296 0,1.368 -0.92,0.677 -0.11,0.41 0.9,1.559 0.41,' +
             '0.11 1.043,-0.457 1.187,0.683 0.127,1.134 0.3,0.3 1.8,0 0.3,' +
             '-0.299 0.127,-1.138 1.185,-0.682 1.046,0.458 0.409,-0.11 0.9,' +
             '-1.559 -0.11,-0.41 -0.92,-0.677 0,-1.366 0.92,-0.677 0.11,' +
             '-0.41 -0.9,-1.559 -0.409,-0.109 -1.046,0.458 -1.185,-0.682 ' +
             '-0.127,-1.138 -0.3,-0.299 -1.8,0 -0.3,0.3 -0.126,1.135 -1.187,' +
             '0.682 -1.043,-0.457 -0.41,0.11 -0.899,1.559 0.108,0.409z'
      },
      group);
  // Axle hole.
  Blockly.utils.createSvgElement(
      'circle',
      {
        'class': 'blocklyIconShape',
        'r': '2.7',
        'cx': '8',
        'cy': '8'
      },
      group);
};

/**
 * Clicking on the icon toggles if the mutator bubble is visible.
 * Disable if block is uneditable.
 * @param {!Event} e Mouse click event.
 * @private
 * @override
 */
Blockly.Mutator.prototype.iconClick_ = function(e) {
  if (this.block_.isEditable()) {
    Blockly.Icon.prototype.iconClick_.call(this, e);
  }
=======
 * Create the icon on the block.
 */
Blockly.Mutator.prototype.createIcon = function() {
  Blockly.Icon.prototype.createIcon_.call(this);
  /* Here's the markup that will be generated:
  <rect class="blocklyIconShield" width="16" height="16" rx="4" ry="4"/>
  <text class="blocklyIconMark" x="8" y="12">★</text>
  */
  var quantum = Blockly.Icon.RADIUS / 2;
  var iconShield = Blockly.createSvgElement('rect',
      {'class': 'blocklyIconShield',
       'width': 4 * quantum,
       'height': 4 * quantum,
       'rx': quantum,
       'ry': quantum}, this.iconGroup_);
  this.iconMark_ = Blockly.createSvgElement('text',
      {'class': 'blocklyIconMark',
       'x': Blockly.Icon.RADIUS,
       'y': 2 * Blockly.Icon.RADIUS - 4}, this.iconGroup_);
  this.iconMark_.appendChild(document.createTextNode('\u2605'));
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Create the editor for the mutator's bubble.
 * @return {!Element} The top-level node of the editor.
 * @private
 */
Blockly.Mutator.prototype.createEditor_ = function() {
  /* Create the editor.  Here's the markup that will be generated:
  <svg>
<<<<<<< HEAD
    [Workspace]
  </svg>
  */
  this.svgDialog_ = Blockly.utils.createSvgElement('svg',
      {'x': Blockly.Bubble.BORDER_WIDTH, 'y': Blockly.Bubble.BORDER_WIDTH},
      null);
  // Convert the list of names into a list of XML objects for the flyout.
  if (this.quarkNames_.length) {
    var quarkXml = goog.dom.createDom('xml');
    for (var i = 0, quarkName; quarkName = this.quarkNames_[i]; i++) {
      quarkXml.appendChild(goog.dom.createDom('block', {'type': quarkName}));
    }
  } else {
    var quarkXml = null;
  }
  var workspaceOptions = {
    languageTree: quarkXml,
    parentWorkspace: this.block_.workspace,
    pathToMedia: this.block_.workspace.options.pathToMedia,
    RTL: this.block_.RTL,
    toolboxPosition: this.block_.RTL ? Blockly.TOOLBOX_AT_RIGHT :
        Blockly.TOOLBOX_AT_LEFT,
    horizontalLayout: false,
    getMetrics: this.getFlyoutMetrics_.bind(this),
    setMetrics: null
  };
  this.workspace_ = new Blockly.WorkspaceSvg(workspaceOptions, this.block_.workspace.dragSurface);
  this.workspace_.isMutator = true;

  // Mutator flyouts go inside the mutator workspace's <g> rather than in
  // a top level svg. Instead of handling scale themselves, mutators
  // inherit scale from the parent workspace.
  // To fix this, scale needs to be applied at a different level in the dom.
  var flyoutSvg =  this.workspace_.addFlyout_('g');
  var background = this.workspace_.createDom('blocklyMutatorBackground');

  // Insert the flyout after the <rect> but before the block canvas so that
  // the flyout is underneath in z-order.  This makes blocks layering during
  // dragging work properly.
  background.insertBefore(flyoutSvg, this.workspace_.svgBlockCanvas_);
  this.svgDialog_.appendChild(background);

=======
    <rect class="blocklyMutatorBackground" />
    [Flyout]
    [Workspace]
  </svg>
  */
  this.svgDialog_ = Blockly.createSvgElement('svg',
      {'x': Blockly.Bubble.BORDER_WIDTH, 'y': Blockly.Bubble.BORDER_WIDTH},
      null);
  this.svgBackground_ = Blockly.createSvgElement('rect',
      {'class': 'blocklyMutatorBackground',
       'height': '100%', 'width': '100%'}, this.svgDialog_);

  var mutator = this;
  this.workspace_ = new Blockly.Workspace(
      function() {return mutator.getFlyoutMetrics_();}, null);
  this.flyout_ = new Blockly.Flyout();
  this.flyout_.autoClose = false;
  this.svgDialog_.appendChild(this.flyout_.createDom());
  this.svgDialog_.appendChild(this.workspace_.createDom());
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  return this.svgDialog_;
};

/**
<<<<<<< HEAD
 * Add or remove the UI indicating if this icon may be clicked or not.
 */
Blockly.Mutator.prototype.updateEditable = function() {
  if (!this.block_.isInFlyout) {
    if (this.block_.isEditable()) {
      if (this.iconGroup_) {
        Blockly.utils.removeClass(
            /** @type {!Element} */ (this.iconGroup_),
            'blocklyIconGroupReadonly');
      }
    } else {
      // Close any mutator bubble.  Icon is not clickable.
      this.setVisible(false);
      if (this.iconGroup_) {
        Blockly.utils.addClass(
            /** @type {!Element} */ (this.iconGroup_),
            'blocklyIconGroupReadonly');
      }
    }
  }
  // Default behaviour for an icon.
  Blockly.Icon.prototype.updateEditable.call(this);
};

/**
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * Callback function triggered when the bubble has resized.
 * Resize the workspace accordingly.
 * @private
 */
Blockly.Mutator.prototype.resizeBubble_ = function() {
  var doubleBorderWidth = 2 * Blockly.Bubble.BORDER_WIDTH;
  var workspaceSize = this.workspace_.getCanvas().getBBox();
<<<<<<< HEAD
  var width;
  if (this.block_.RTL) {
=======
  var flyoutMetrics = this.flyout_.getMetrics_();
  var width;
  if (Blockly.RTL) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    width = -workspaceSize.x;
  } else {
    width = workspaceSize.width + workspaceSize.x;
  }
<<<<<<< HEAD
  var height = workspaceSize.height + doubleBorderWidth * 3;
  if (this.workspace_.flyout_) {
    var flyoutMetrics = this.workspace_.flyout_.getMetrics_();
    height = Math.max(height, flyoutMetrics.contentHeight + 20);
  }
=======
  var height = Math.max(workspaceSize.height + doubleBorderWidth * 3,
                        flyoutMetrics.contentHeight + 20);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  width += doubleBorderWidth * 3;
  // Only resize if the size difference is significant.  Eliminates shuddering.
  if (Math.abs(this.workspaceWidth_ - width) > doubleBorderWidth ||
      Math.abs(this.workspaceHeight_ - height) > doubleBorderWidth) {
    // Record some layout information for getFlyoutMetrics_.
    this.workspaceWidth_ = width;
    this.workspaceHeight_ = height;
    // Resize the bubble.
<<<<<<< HEAD
    this.bubble_.setBubbleSize(
        width + doubleBorderWidth, height + doubleBorderWidth);
=======
    this.bubble_.setBubbleSize(width + doubleBorderWidth,
                               height + doubleBorderWidth);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    this.svgDialog_.setAttribute('width', this.workspaceWidth_);
    this.svgDialog_.setAttribute('height', this.workspaceHeight_);
  }

<<<<<<< HEAD
  if (this.block_.RTL) {
=======
  if (Blockly.RTL) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    // Scroll the workspace to always left-align.
    var translation = 'translate(' + this.workspaceWidth_ + ',0)';
    this.workspace_.getCanvas().setAttribute('transform', translation);
  }
<<<<<<< HEAD
  this.workspace_.resize();
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Show or hide the mutator bubble.
 * @param {boolean} visible True if the bubble should be visible.
 */
Blockly.Mutator.prototype.setVisible = function(visible) {
  if (visible == this.isVisible()) {
    // No change.
    return;
  }
<<<<<<< HEAD
  Blockly.Events.fire(
      new Blockly.Events.Ui(this.block_, 'mutatorOpen', !visible, visible));
  if (visible) {
    // Create the bubble.
    this.bubble_ = new Blockly.Bubble(
        /** @type {!Blockly.WorkspaceSvg} */ (this.block_.workspace),
        this.createEditor_(), this.block_.svgPath_, this.iconXY_, null, null);
    var tree = this.workspace_.options.languageTree;
    if (tree) {
      this.workspace_.flyout_.init(this.workspace_);
      this.workspace_.flyout_.show(tree.childNodes);
    }

    this.rootBlock_ = this.block_.decompose(this.workspace_);
    var blocks = this.rootBlock_.getDescendants(false);
=======
  if (visible) {
    // Create the bubble.
    this.bubble_ = new Blockly.Bubble(this.block_.workspace,
        this.createEditor_(), this.block_.svg_.svgGroup_,
        this.iconX_, this.iconY_, null, null);
    var thisObj = this;
    this.flyout_.init(this.workspace_, false);
    this.flyout_.show(this.quarkXml_);

    this.rootBlock_ = this.block_.decompose(this.workspace_);
    var blocks = this.rootBlock_.getDescendants();
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    for (var i = 0, child; child = blocks[i]; i++) {
      child.render();
    }
    // The root block should not be dragable or deletable.
    this.rootBlock_.setMovable(false);
    this.rootBlock_.setDeletable(false);
<<<<<<< HEAD
    if (this.workspace_.flyout_) {
      var margin = this.workspace_.flyout_.CORNER_RADIUS * 2;
      var x = this.workspace_.flyout_.width_ + margin;
    } else {
      var margin = 16;
      var x = margin;
    }
    if (this.block_.RTL) {
=======
    var margin = this.flyout_.CORNER_RADIUS * 2;
    var x = this.flyout_.width_ + margin;
    if (Blockly.RTL) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
      x = -x;
    }
    this.rootBlock_.moveBy(x, margin);
    // Save the initial connections, then listen for further changes.
    if (this.block_.saveConnections) {
<<<<<<< HEAD
      var thisMutator = this;
      this.block_.saveConnections(this.rootBlock_);
      this.sourceListener_ = function() {
        thisMutator.block_.saveConnections(thisMutator.rootBlock_);
      };
      this.block_.workspace.addChangeListener(this.sourceListener_);
    }
    this.resizeBubble_();
    // When the mutator's workspace changes, update the source block.
    this.workspace_.addChangeListener(this.workspaceChanged_.bind(this));
=======
      this.block_.saveConnections(this.rootBlock_);
      this.sourceListener_ = Blockly.bindEvent_(
          this.block_.workspace.getCanvas(),
          'blocklyWorkspaceChange', this.block_,
          function() {thisObj.block_.saveConnections(thisObj.rootBlock_)});
    }
    this.resizeBubble_();
    // When the mutator's workspace changes, update the source block.
    Blockly.bindEvent_(this.workspace_.getCanvas(), 'blocklyWorkspaceChange',
        this.block_, function() {thisObj.workspaceChanged_();});
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    this.updateColour();
  } else {
    // Dispose of the bubble.
    this.svgDialog_ = null;
<<<<<<< HEAD
=======
    this.svgBackground_ = null;
    this.flyout_.dispose();
    this.flyout_ = null;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    this.workspace_.dispose();
    this.workspace_ = null;
    this.rootBlock_ = null;
    this.bubble_.dispose();
    this.bubble_ = null;
    this.workspaceWidth_ = 0;
    this.workspaceHeight_ = 0;
    if (this.sourceListener_) {
<<<<<<< HEAD
      this.block_.workspace.removeChangeListener(this.sourceListener_);
=======
      Blockly.unbindEvent_(this.sourceListener_);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
      this.sourceListener_ = null;
    }
  }
};

/**
 * Update the source block when the mutator's blocks are changed.
<<<<<<< HEAD
 * Bump down any block that's too high.
=======
 * Delete or bump any block that's out of bounds.
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * Fired whenever a change is made to the mutator's workspace.
 * @private
 */
Blockly.Mutator.prototype.workspaceChanged_ = function() {
<<<<<<< HEAD
  if (!this.workspace_.isDragging()) {
=======
  if (Blockly.Block.dragMode_ == 0) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    var blocks = this.workspace_.getTopBlocks(false);
    var MARGIN = 20;
    for (var b = 0, block; block = blocks[b]; b++) {
      var blockXY = block.getRelativeToSurfaceXY();
      var blockHW = block.getHeightWidth();
<<<<<<< HEAD
      if (blockXY.y + blockHW.height < MARGIN) {
=======
      if (Blockly.RTL ? blockXY.x > -this.flyout_.width_ + MARGIN :
           blockXY.x < this.flyout_.width_ - MARGIN) {
        // Delete any block that's sitting on top of the flyout.
        block.dispose(false, true);
      } else if (blockXY.y + blockHW.height < MARGIN) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
        // Bump any block that's above the top back inside.
        block.moveBy(0, MARGIN - blockHW.height - blockXY.y);
      }
    }
  }

  // When the mutator's workspace changes, update the source block.
  if (this.rootBlock_.workspace == this.workspace_) {
<<<<<<< HEAD
    Blockly.Events.setGroup(true);
    var block = this.block_;
    var oldMutationDom = block.mutationToDom();
    var oldMutation = oldMutationDom && Blockly.Xml.domToText(oldMutationDom);
    // Switch off rendering while the source block is rebuilt.
    var savedRendered = block.rendered;
    block.rendered = false;
    // Allow the source block to rebuild itself.
    block.compose(this.rootBlock_);
    // Restore rendering and show the changes.
    block.rendered = savedRendered;
    // Mutation may have added some elements that need initializing.
    block.initSvg();
    var newMutationDom = block.mutationToDom();
    var newMutation = newMutationDom && Blockly.Xml.domToText(newMutationDom);
    if (oldMutation != newMutation) {
      Blockly.Events.fire(new Blockly.Events.BlockChange(
          block, 'mutation', null, oldMutation, newMutation));
      // Ensure that any bump is part of this mutation's event group.
      var group = Blockly.Events.getGroup();
      setTimeout(function() {
        Blockly.Events.setGroup(group);
        block.bumpNeighbours_();
        Blockly.Events.setGroup(false);
      }, Blockly.BUMP_DELAY);
    }
    if (block.rendered) {
      block.render();
    }
    // Don't update the bubble until the drag has ended, to avoid moving blocks
    // under the cursor.
    if (!this.workspace_.isDragging()) {
      this.resizeBubble_();
    }
    Blockly.Events.setGroup(false);
=======
    // Switch off rendering while the source block is rebuilt.
    var savedRendered = this.block_.rendered;
    this.block_.rendered = false;
    // Allow the source block to rebuild itself.
    this.block_.compose(this.rootBlock_);
    // Restore rendering and show the changes.
    this.block_.rendered = savedRendered;
    if (this.block_.rendered) {
      this.block_.render();
    }
    this.resizeBubble_();
    // The source block may have changed, notify its workspace.
    this.block_.workspace.fireChangeEvent();
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
};

/**
 * Return an object with all the metrics required to size scrollbars for the
 * mutator flyout.  The following properties are computed:
 * .viewHeight: Height of the visible rectangle,
<<<<<<< HEAD
 * .viewWidth: Width of the visible rectangle,
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * .absoluteTop: Top-edge of view.
 * .absoluteLeft: Left-edge of view.
 * @return {!Object} Contains size and position metrics of mutator dialog's
 *     workspace.
 * @private
 */
Blockly.Mutator.prototype.getFlyoutMetrics_ = function() {
<<<<<<< HEAD
  return {
    viewHeight: this.workspaceHeight_,
    viewWidth: this.workspaceWidth_,
    absoluteTop: 0,
    absoluteLeft: 0
=======
  var left = 0;
  if (Blockly.RTL) {
    left += this.workspaceWidth_;
  }
  return {
    viewHeight: this.workspaceHeight_,
    viewWidth: 0,  // This seem wrong, but results in correct RTL layout.
    absoluteTop: 0,
    absoluteLeft: left
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  };
};

/**
 * Dispose of this mutator.
 */
Blockly.Mutator.prototype.dispose = function() {
  this.block_.mutator = null;
  Blockly.Icon.prototype.dispose.call(this);
};
<<<<<<< HEAD

/**
 * Reconnect an block to a mutated input.
 * @param {Blockly.Connection} connectionChild Connection on child block.
 * @param {!Blockly.Block} block Parent block.
 * @param {string} inputName Name of input on parent block.
 * @return {boolean} True iff a reconnection was made, false otherwise.
 */
Blockly.Mutator.reconnect = function(connectionChild, block, inputName) {
  if (!connectionChild || !connectionChild.getSourceBlock().workspace) {
    return false;  // No connection or block has been deleted.
  }
  var connectionParent = block.getInput(inputName).connection;
  var currentParent = connectionChild.targetBlock();
  if ((!currentParent || currentParent == block) &&
      connectionParent.targetConnection != connectionChild) {
    if (connectionParent.isConnected()) {
      // There's already something connected here.  Get rid of it.
      connectionParent.disconnect();
    }
    connectionParent.connect(connectionChild);
    return true;
  }
  return false;
};

// Export symbols that would otherwise be renamed by Closure compiler.
if (!goog.global['Blockly']) {
  goog.global['Blockly'] = {};
}
if (!goog.global['Blockly']['Mutator']) {
  goog.global['Blockly']['Mutator'] = {};
}
goog.global['Blockly']['Mutator']['reconnect'] = Blockly.Mutator.reconnect;
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
