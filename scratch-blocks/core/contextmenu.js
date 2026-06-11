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
 * @fileoverview Functionality for the right-click context menus.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

<<<<<<< HEAD
/**
 * @name Blockly.ContextMenu
 * @namespace
 */
goog.provide('Blockly.ContextMenu');

goog.require('Blockly.Events.BlockCreate');
goog.require('Blockly.scratchBlocksUtils');
goog.require('Blockly.utils');
goog.require('Blockly.utils.uiMenu');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.userAgent');


/**
 * Which block is the context menu attached to?
 * @type {Blockly.Block}
 */
Blockly.ContextMenu.currentBlock = null;

/**
 * Opaque data that can be passed to unbindEvent_.
 * @type {Array.<!Array>}
 * @private
 */
Blockly.ContextMenu.eventWrapper_ = null;

/**
 * Construct the menu based on the list of options and show the menu.
 * @param {!Event} e Mouse event.
 * @param {!Array.<!Object>} options Array of menu options.
 * @param {boolean} rtl True if RTL, false if LTR.
 */
Blockly.ContextMenu.show = function(e, options, rtl) {
  Blockly.WidgetDiv.show(Blockly.ContextMenu, rtl, null);
=======
goog.provide('Blockly.ContextMenu');


/**
 * Horizontal padding on either side of each option.
 */
Blockly.ContextMenu.X_PADDING = 20;

/**
 * Vertical height of each option.
 */
Blockly.ContextMenu.Y_HEIGHT = 20;

/**
 * Is a context menu currently showing?
 */
Blockly.ContextMenu.visible = false;

/**
 * Creates the context menu's DOM.  Only needs to be called once.
 * @return {!SVGGElement} The context menu's SVG group.
 */
Blockly.ContextMenu.createDom = function() {
  /*
  <g class="blocklyHidden">
    <rect class="blocklyContextMenuShadow" x="2" y="-2" rx="4" ry="4"/>
    <rect class="blocklyContextMenuBackground" y="-4" rx="4" ry="4"/>
    <g class="blocklyContextMenuOptions">
    </g>
  </g>
  */
  var svgGroup = /** @type {!SVGGElement} */ (
      Blockly.createSvgElement('g', {'class': 'blocklyHidden'}, null));
  Blockly.ContextMenu.svgGroup = svgGroup;
  Blockly.ContextMenu.svgShadow = Blockly.createSvgElement('rect',
      {'class': 'blocklyContextMenuShadow',
      'x': 2, 'y': -2, 'rx': 4, 'ry': 4}, svgGroup);
  Blockly.ContextMenu.svgBackground = Blockly.createSvgElement('rect',
      {'class': 'blocklyContextMenuBackground',
      'y': -4, 'rx': 4, 'ry': 4}, svgGroup);
  Blockly.ContextMenu.svgOptions = Blockly.createSvgElement('g',
      {'class': 'blocklyContextMenuOptions'}, svgGroup);
  return svgGroup;
};

/**
 * Construct the menu based on the list of options and show the menu.
 * @param {!Object} xy Coordinates of anchor point, contains x and y properties.
 * @param {!Array.<Object>} options Array of menu options.
 */
Blockly.ContextMenu.show = function(xy, options) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  if (!options.length) {
    Blockly.ContextMenu.hide();
    return;
  }
<<<<<<< HEAD
  var menu = Blockly.ContextMenu.populate_(options, rtl);

  goog.events.listen(
      menu, goog.ui.Component.EventType.ACTION, Blockly.ContextMenu.hide);

  Blockly.ContextMenu.position_(menu, e, rtl);
  // 1ms delay is required for focusing on context menus because some other
  // mouse event is still waiting in the queue and clears focus.
  setTimeout(function() {menu.getElement().focus();}, 1);
  Blockly.ContextMenu.currentBlock = null;  // May be set by Blockly.Block.
};

/**
 * Create the context menu object and populate it with the given options.
 * @param {!Array.<!Object>} options Array of menu options.
 * @param {boolean} rtl True if RTL, false if LTR.
 * @return {!goog.ui.Menu} The menu that will be shown on right click.
 * @private
 */
Blockly.ContextMenu.populate_ = function(options, rtl) {
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  /* Here's what one option object looks like:
    {text: 'Make It So',
     enabled: true,
     callback: Blockly.MakeItSo}
  */
<<<<<<< HEAD
  var menu = new goog.ui.Menu();
  menu.setRightToLeft(rtl);

  // Sometimes the context menu can be created such that the mouse is hovering over an item in the menu
  // When this happens, a contextmenu event is immediately sent to that item
  // Obviously we don't want that to trigger an item to be selected.
  var acceptContextMenuEvents = false;
  setTimeout(function() {
    acceptContextMenuEvents = true;
  });

  for (var i = 0, option; option = options[i]; i++) {
    var menuItem = new goog.ui.MenuItem(option.text);
    menuItem.setRightToLeft(rtl);
    menu.addChild(menuItem, true);
    menuItem.setEnabled(option.enabled);
    if (option.enabled) {
      goog.events.listen(
          menuItem, goog.ui.Component.EventType.ACTION, option.callback);
      menuItem.handleContextMenu = function(/* e */) {
        if (!acceptContextMenuEvents) {
          return;
        }
        // Right-clicking on menu option should count as a click.
        goog.events.dispatchEvent(this, goog.ui.Component.EventType.ACTION);
      };
    }
  }
  return menu;
};

/**
 * Add the menu to the page and position it correctly.
 * @param {!goog.ui.Menu} menu The menu to add and position.
 * @param {!Event} e Mouse event for the right click that is making the context
 *     menu appear.
 * @param {boolean} rtl True if RTL, false if LTR.
 * @private
 */
Blockly.ContextMenu.position_ = function(menu, e, rtl) {
  // Record windowSize and scrollOffset before adding menu.
  var viewportBBox = Blockly.utils.getViewportBBox();
  // This one is just a point, but we'll pretend that it's a rect so we can use
  // some helper functions.
  var anchorBBox = {
    top: e.clientY + viewportBBox.top,
    bottom: e.clientY + viewportBBox.top,
    left: e.clientX + viewportBBox.left,
    right: e.clientX + viewportBBox.left
  };

  Blockly.ContextMenu.createWidget_(menu);
  var menuSize = Blockly.utils.uiMenu.getSize(menu);

  if (rtl) {
    Blockly.utils.uiMenu.adjustBBoxesForRTL(viewportBBox, anchorBBox, menuSize);
  }

  Blockly.WidgetDiv.positionWithAnchor(viewportBBox, anchorBBox, menuSize, rtl);
  // Calling menuDom.focus() has to wait until after the menu has been placed
  // correctly.  Otherwise it will cause a page scroll to get the misplaced menu
  // in view.  See issue #1329.
  menu.getElement().focus();

  // https://github.com/LLK/scratch-blocks/pull/2834
  menu.setVisible(true, true, e);
};

/**
 * Create and render the menu widget inside Blockly's widget div.
 * @param {!goog.ui.Menu} menu The menu to add to the widget div.
 * @private
 */
Blockly.ContextMenu.createWidget_ = function(menu) {
  var div = Blockly.WidgetDiv.DIV;
  menu.render(div);
  var menuDom = menu.getElement();
  Blockly.utils.addClass(menuDom, 'blocklyContextMenu');
  // Prevent system context menu when right-clicking a Blockly context menu.
  Blockly.bindEventWithChecks_(
      menuDom, 'contextmenu', null, Blockly.utils.noEvent);
  // Enable autofocus after the initial render to avoid issue #1329.
  menu.setAllowAutoFocus(true);
=======
  // Erase all existing options.
  goog.dom.removeChildren(Blockly.ContextMenu.svgOptions);
  /* Here's the SVG we want for each option:
    <g class="blocklyMenuDiv" transform="translate(0, 0)">
      <rect width="100" height="20"/>
      <text class="blocklyMenuText" x="20" y="15">Make It So</text>
    </g>
  */
  // The menu must be made visible early since otherwise BBox and
  // getComputedTextLength will return 0.
  Blockly.ContextMenu.svgGroup.style.display = 'block';
  var maxWidth = 0;
  var resizeList = [Blockly.ContextMenu.svgBackground,
                    Blockly.ContextMenu.svgShadow];
  for (var x = 0, option; option = options[x]; x++) {
    var gElement = Blockly.ContextMenu.optionToDom(option.text);
    var rectElement = /** @type {SVGRectElement} */ (gElement.firstChild);
    var textElement = /** @type {SVGTextElement} */ (gElement.lastChild);
    Blockly.ContextMenu.svgOptions.appendChild(gElement);

    gElement.setAttribute('transform',
        'translate(0, ' + (x * Blockly.ContextMenu.Y_HEIGHT) + ')');
    resizeList.push(rectElement);
    Blockly.bindEvent_(gElement, 'mousedown', null, Blockly.noEvent);
    if (option.enabled) {
      Blockly.bindEvent_(gElement, 'mouseup', null, option.callback);
      Blockly.bindEvent_(gElement, 'mouseup', null, Blockly.ContextMenu.hide);
    } else {
      gElement.setAttribute('class', 'blocklyMenuDivDisabled');
    }
    // Compute the length of the longest text length.
    maxWidth = Math.max(maxWidth, textElement.getComputedTextLength());
  }
  // Run a second pass to resize all options to the required width.
  maxWidth += Blockly.ContextMenu.X_PADDING * 2;
  for (var x = 0; x < resizeList.length; x++) {
    resizeList[x].setAttribute('width', maxWidth);
  }
  if (Blockly.RTL) {
    // Right-align the text.
    for (var x = 0, gElement;
         gElement = Blockly.ContextMenu.svgOptions.childNodes[x]; x++) {
      var textElement = gElement.lastChild;
      textElement.setAttribute('text-anchor', 'end');
      textElement.setAttribute('x', maxWidth - Blockly.ContextMenu.X_PADDING);
    }
  }
  Blockly.ContextMenu.svgBackground.setAttribute('height',
      options.length * Blockly.ContextMenu.Y_HEIGHT + 8);
  Blockly.ContextMenu.svgShadow.setAttribute('height',
      options.length * Blockly.ContextMenu.Y_HEIGHT + 10);

  // Convert the mouse coordinates into SVG coordinates.
  var anchorX = xy.x;
  var anchorY = xy.y;

  // Measure the menu's size and position it so that it does not go off-screen.
  var bBox = Blockly.ContextMenu.svgGroup.getBBox();
  var svgSize = Blockly.svgSize();
  if (anchorY + bBox.height > svgSize.height) {
    // Falling off the bottom of the screen; flip the menu up.
    anchorY -= bBox.height - 10;
  }
  if (Blockly.RTL) {
    if (anchorX - bBox.width <= 0) {
      anchorX++;
    } else {
      // Falling off the left edge in RTL mode; flip menu to right.
      anchorX -= bBox.width;
    }
  } else {
    if (anchorX + bBox.width > svgSize.width) {
      // Falling off the right edge in LTR mode; flip the menu to left.
      anchorX -= bBox.width;
    } else {
      anchorX++;
    }
  }
  Blockly.ContextMenu.svgGroup.setAttribute('transform',
      'translate(' + anchorX + ', ' + anchorY + ')');
  Blockly.ContextMenu.visible = true;
};

/**
 * Create the DOM nodes for a menu option.
 * @param {string} text The option's text.
 * @return {!Element} <g> node containing the menu option.
 */
Blockly.ContextMenu.optionToDom = function(text) {
  /* Here's the SVG we create:
    <g class="blocklyMenuDiv">
      <rect height="20"/>
      <text class="blocklyMenuText" x="20" y="15">Make It So</text>
    </g>
  */
  var gElement = Blockly.createSvgElement('g', {'class': 'blocklyMenuDiv'},
                                          null);
  var rectElement = Blockly.createSvgElement('rect',
      {'height': Blockly.ContextMenu.Y_HEIGHT}, gElement);
  var textElement = Blockly.createSvgElement('text',
      {'class': 'blocklyMenuText',
      'x': Blockly.ContextMenu.X_PADDING,
      'y': 15}, gElement);
  var textNode = document.createTextNode(text);
  textElement.appendChild(textNode);
  return gElement;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Hide the context menu.
 */
Blockly.ContextMenu.hide = function() {
<<<<<<< HEAD
  Blockly.WidgetDiv.hideIfOwner(Blockly.ContextMenu);
  Blockly.ContextMenu.currentBlock = null;
  if (Blockly.ContextMenu.eventWrapper_) {
    Blockly.unbindEvent_(Blockly.ContextMenu.eventWrapper_);
=======
  if (Blockly.ContextMenu.visible) {
    Blockly.ContextMenu.svgGroup.style.display = 'none';
    Blockly.ContextMenu.visible = false;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  }
};

/**
 * Create a callback function that creates and configures a block,
 *   then places the new block next to the original.
 * @param {!Blockly.Block} block Original block.
 * @param {!Element} xml XML representation of new block.
 * @return {!Function} Function that creates a block.
 */
Blockly.ContextMenu.callbackFactory = function(block, xml) {
  return function() {
<<<<<<< HEAD
    Blockly.Events.disable();
    try {
      var newBlock = Blockly.Xml.domToBlock(xml, block.workspace);
      // Move the new block next to the old block.
      var xy = block.getRelativeToSurfaceXY();
      if (block.RTL) {
        xy.x -= Blockly.SNAP_RADIUS;
      } else {
        xy.x += Blockly.SNAP_RADIUS;
      }
      xy.y += Blockly.SNAP_RADIUS * 2;
      newBlock.moveBy(xy.x, xy.y);
    } finally {
      Blockly.Events.enable();
    }
    if (Blockly.Events.isEnabled() && !newBlock.isShadow()) {
      Blockly.Events.fire(new Blockly.Events.BlockCreate(newBlock));
    }
    newBlock.select();
  };
};

// Helper functions for creating context menu options.

/**
 * Make a context menu option for deleting the current block.
 * @param {!Blockly.BlockSvg} block The block where the right-click originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.blockDeleteOption = function(block) {
  // Option to delete this block but not blocks lower in the stack.
  // Count the number of blocks that are nested in this block,
  // ignoring shadows and without ordering.
  var descendantCount = block.getDescendants(false, true).length;
  var nextBlock = block.getNextBlock();
  if (nextBlock) {
    // Blocks in the current stack would survive this block's deletion.
    descendantCount -= nextBlock.getDescendants(false, true).length;
  }
  var deleteOption = {
    text: descendantCount == 1 ? Blockly.Msg.DELETE_BLOCK :
        Blockly.Msg.DELETE_X_BLOCKS.replace('%1', String(descendantCount)),
    enabled: true,
    callback: function() {
      Blockly.Events.setGroup(true);
      block.dispose(true, true);
      Blockly.Events.setGroup(false);
    }
  };
  return deleteOption;
};

/**
 * Make a context menu option for showing help for the current block.
 * @param {!Blockly.BlockSvg} block The block where the right-click originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.blockHelpOption = function(block) {
  var url = goog.isFunction(block.helpUrl) ? block.helpUrl() : block.helpUrl;
  var helpOption = {
    enabled: !!url,
    text: Blockly.Msg.HELP,
    callback: function() {
      block.showHelp_();
    }
  };
  return helpOption;
};

/**
 * Make a context menu option for duplicating the current block.
 * @param {!Blockly.BlockSvg} block The block where the right-click originated.
 * @param {!Event} event Event that caused the context menu to open.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.blockDuplicateOption = function(block, event) {
  var duplicateOption = {
    text: Blockly.Msg.DUPLICATE,
    enabled: true,
    callback:
        Blockly.scratchBlocksUtils.duplicateAndDragCallback(block, event)
  };
  return duplicateOption;
};

/**
 * Make a context menu option for adding or removing comments on the current
 * block.
 * @param {!Blockly.BlockSvg} block The block where the right-click originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.blockCommentOption = function(block) {
  var commentOption = {
    enabled: !goog.userAgent.IE
  };
  // If there's already a comment, add an option to delete it.
  if (block.comment) {
    commentOption.text = Blockly.Msg.REMOVE_COMMENT;
    commentOption.callback = function() {
      block.setCommentText(null);
    };
  } else {
    // If there's no comment, add an option to create a comment.
    commentOption.text = Blockly.Msg.ADD_COMMENT;
    commentOption.callback = function() {
      block.setCommentText('');
      block.comment.focus();
    };
  }
  return commentOption;
};

/**
 * Make a context menu option for undoing the most recent action on the
 * workspace.
 * @param {!Blockly.WorkspaceSvg} ws The workspace where the right-click
 *     originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.wsUndoOption = function(ws) {
  return {
    text: Blockly.Msg.UNDO,
    enabled: ws.hasUndoStack(),
    callback: ws.undo.bind(ws, false)
  };
};

/**
 * Make a context menu option for redoing the most recent action on the
 * workspace.
 * @param {!Blockly.WorkspaceSvg} ws The workspace where the right-click
 *     originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.wsRedoOption = function(ws) {
  return {
    text: Blockly.Msg.REDO,
    enabled: ws.hasRedoStack(),
    callback: ws.undo.bind(ws, true)
  };
};

/**
 * Make a context menu option for cleaning up blocks on the workspace, by
 * aligning them vertically.
 * @param {!Blockly.WorkspaceSvg} ws The workspace where the right-click
 *     originated.
 * @param {number} numTopBlocks The number of top blocks on the workspace.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.wsCleanupOption = function(ws, numTopBlocks) {
  return {
    text: Blockly.Msg.CLEAN_UP,
    enabled: numTopBlocks > 1,
    callback: ws.cleanUp.bind(ws, true)
  };
};

/**
 * Helper function for toggling delete state on blocks on the workspace, to be
 * called from a right-click menu.
 * @param {!Array.<!Blockly.BlockSvg>} topBlocks The list of top blocks on the
 *     the workspace.
 * @param {boolean} shouldCollapse True if the blocks should be collapsed, false
 *     if they should be expanded.
 * @private
 */
Blockly.ContextMenu.toggleCollapseFn_ = function(topBlocks, shouldCollapse) {
  // Add a little animation to collapsing and expanding.
  var DELAY = 10;
  var ms = 0;
  for (var i = 0; i < topBlocks.length; i++) {
    var block = topBlocks[i];
    while (block) {
      setTimeout(block.setCollapsed.bind(block, shouldCollapse), ms);
      block = block.getNextBlock();
      ms += DELAY;
    }
  }
};

/**
 * Make a context menu option for collapsing all block stacks on the workspace.
 * @param {boolean} hasExpandedBlocks Whether there are any non-collapsed blocks
 *     on the workspace.
 * @param {!Array.<!Blockly.BlockSvg>} topBlocks The list of top blocks on the
 *     the workspace.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.wsCollapseOption = function(hasExpandedBlocks, topBlocks) {
  return {
    enabled: hasExpandedBlocks,
    text: Blockly.Msg.COLLAPSE_ALL,
    callback: function() {
      Blockly.ContextMenu.toggleCollapseFn_(topBlocks, true);
    }
  };
};

/**
 * Make a context menu option for expanding all block stacks on the workspace.
 * @param {boolean} hasCollapsedBlocks Whether there are any collapsed blocks
 *     on the workspace.
 * @param {!Array.<!Blockly.BlockSvg>} topBlocks The list of top blocks on the
 *     the workspace.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.wsExpandOption = function(hasCollapsedBlocks, topBlocks) {
  return {
    enabled: hasCollapsedBlocks,
    text: Blockly.Msg.EXPAND_ALL,
    callback: function() {
      Blockly.ContextMenu.toggleCollapseFn_(topBlocks, false);
    }
  };
};

/**
 * Make a context menu option for deleting the current workspace comment.
 * @param {!Blockly.WorkspaceCommentSvg} comment The workspace comment where the
 *     right-click originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.commentDeleteOption = function(comment) {
  var deleteOption = {
    text: Blockly.Msg.DELETE,
    enabled: true,
    callback: function() {
      Blockly.Events.setGroup(true);
      comment.dispose(true, true);
      Blockly.Events.setGroup(false);
    }
  };
  return deleteOption;
};

/**
 * Make a context menu option for duplicating the current workspace comment.
 * @param {!Blockly.WorkspaceCommentSvg} comment The workspace comment where the
 *     right-click originated.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.commentDuplicateOption = function(comment) {
  var duplicateOption = {
    text: Blockly.Msg.DUPLICATE,
    enabled: true,
    callback: function() {
      Blockly.duplicate_(comment);
    }
  };
  return duplicateOption;
};

/**
 * Make a context menu option for adding a comment on the workspace.
 * @param {!Blockly.WorkspaceSvg} ws The workspace where the right-click
 *     originated.
 * @param {!Event} e The right-click mouse event.
 * @return {!Object} A menu option, containing text, enabled, and a callback.
 * @package
 */
Blockly.ContextMenu.workspaceCommentOption = function(ws, e) {
  // Helper function to create and position a comment correctly based on the
  // location of the mouse event.
  var addWsComment = function() {
    // Disable events while this comment is getting created
    // so that we can fire a single create event for this comment
    // at the end (instead of CommentCreate followed by CommentMove,
    // which results in unexpected undo behavior).
    var disabled = false;
    if (Blockly.Events.isEnabled()) {
      Blockly.Events.disable();
      disabled = true;
    }
    var comment = new Blockly.WorkspaceCommentSvg(
        ws, '', Blockly.WorkspaceCommentSvg.DEFAULT_SIZE,
        Blockly.WorkspaceCommentSvg.DEFAULT_SIZE, false);

    var injectionDiv = ws.getInjectionDiv();
    // Bounding rect coordinates are in client coordinates, meaning that they
    // are in pixels relative to the upper left corner of the visible browser
    // window.  These coordinates change when you scroll the browser window.
    var boundingRect = injectionDiv.getBoundingClientRect();

    // The client coordinates offset by the injection div's upper left corner.
    var clientOffsetPixels = new goog.math.Coordinate(
        e.clientX - boundingRect.left, e.clientY - boundingRect.top);

    // The offset in pixels between the main workspace's origin and the upper
    // left corner of the injection div.
    var mainOffsetPixels = ws.getOriginOffsetInPixels();

    // The position of the new comment in pixels relative to the origin of the
    // main workspace.
    var finalOffsetPixels = goog.math.Coordinate.difference(clientOffsetPixels,
        mainOffsetPixels);

    // The position of the new comment in main workspace coordinates.
    var finalOffsetMainWs = finalOffsetPixels.scale(1 / ws.scale);

    var commentX = finalOffsetMainWs.x;
    var commentY = finalOffsetMainWs.y;
    comment.moveBy(commentX, commentY);
    if (ws.rendered) {
      comment.initSvg();
      comment.render(false);
      comment.select();
    }
    if (disabled) {
      Blockly.Events.enable();
    }
    Blockly.WorkspaceComment.fireCreateEvent(comment);
  };

  var wsCommentOption = {enabled: true};
  wsCommentOption.text = Blockly.Msg.ADD_COMMENT;
  wsCommentOption.callback = function() {
    addWsComment();
  };
  return wsCommentOption;
};

// End helper functions for creating context menu options.
=======
    var newBlock = Blockly.Xml.domToBlock_(block.workspace, xml);
    // Move the new block next to the old block.
    var xy = block.getRelativeToSurfaceXY();
    if (Blockly.RTL) {
      xy.x -= Blockly.SNAP_RADIUS;
    } else {
      xy.x += Blockly.SNAP_RADIUS;
    }
    xy.y += Blockly.SNAP_RADIUS * 2;
    newBlock.moveBy(xy.x, xy.y);
    newBlock.select();
  };
};
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
