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
 * @fileoverview Functions for injecting Blockly into a web page.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.inject');

<<<<<<< HEAD
goog.require('Blockly.BlockDragSurfaceSvg');
goog.require('Blockly.Css');
goog.require('Blockly.constants');
goog.require('Blockly.DropDownDiv');
goog.require('Blockly.Grid');
goog.require('Blockly.Options');
goog.require('Blockly.WorkspaceSvg');
goog.require('Blockly.WorkspaceDragSurfaceSvg');
goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('goog.userAgent');

/**
 * Inject a Blockly editor into the specified container element (usually a div).
 * @param {!Element|string} container Containing element, or its ID,
 *     or a CSS selector.
 * @param {Object=} opt_options Optional dictionary of options.
 * @return {!Blockly.Workspace} Newly created main workspace.
 */
Blockly.inject = function(container, opt_options) {
  if (goog.isString(container)) {
    container = document.getElementById(container) ||
        document.querySelector(container);
  }
=======
goog.require('Blockly.Css');
goog.require('goog.dom');


/**
 * Initialize the SVG document with various handlers.
 * @param {!Element} container Containing element.
 * @param {Object} opt_options Optional dictionary of options.
 */
Blockly.inject = function(container, opt_options) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  // Verify that the container is in document.
  if (!goog.dom.contains(document, container)) {
    throw 'Error: container is not in current document.';
  }
<<<<<<< HEAD
  var options = new Blockly.Options(opt_options || {});
  var subContainer = goog.dom.createDom('div', 'injectionDiv');
  container.appendChild(subContainer);

  // Open the Field text cache and leave it open. See this issue for more information
  // https://github.com/LLK/scratch-blocks/issues/1004
  Blockly.Field.startCache();

  var svg = Blockly.createDom_(subContainer, options);

  // Create surfaces for dragging things. These are optimizations
  // so that the broowser does not repaint during the drag.
  var blockDragSurface = new Blockly.BlockDragSurfaceSvg(subContainer);
  var workspaceDragSurface = null;

  var workspace = Blockly.createMainWorkspace_(svg, options, blockDragSurface,
      workspaceDragSurface);
  Blockly.init_(workspace);
  Blockly.mainWorkspace = workspace;

  Blockly.svgResize(workspace);
  return workspace;
=======
  if (opt_options) {
    // TODO(scr): don't mix this in to global variables.
    goog.mixin(Blockly, Blockly.parseOptions_(opt_options));
  }
  Blockly.createDom_(container);
  Blockly.init_();
};

/**
 * Configure Blockly to behave according to a set of options.
 * @param {!Object} options Dictionary of options.
 * @return {Object} Parsed options.
 * @private
 */
Blockly.parseOptions_ = function(options) {
  var readOnly = !!options['readOnly'];
  if (readOnly) {
    var hasCategories = false;
    var hasTrashcan = false;
    var hasCollapse = false;
    var tree = null;
  } else {
    var tree = options['toolbox'];
    if (tree) {
      if (typeof tree != 'string' && typeof XSLTProcessor == 'undefined') {
        // In this case the tree will not have been properly built by the
        // browser. The HTML will be contained in the element, but it will
        // not have the proper DOM structure since the browser doesn't support
        // XSLTProcessor (XML -> HTML). This is the case in IE 9+.
        tree = tree.outerHTML;
      }
      if (typeof tree == 'string') {
        tree = Blockly.Xml.textToDom(tree);
      }
      var hasCategories = !!tree.getElementsByTagName('category').length;
    } else {
      tree = null;
      var hasCategories = false;
    }
    var hasTrashcan = options['trashcan'];
    if (hasTrashcan === undefined) {
      hasTrashcan = hasCategories;
    }
    var hasCollapse = options['collapse'];
    if (hasCollapse === undefined) {
      hasCollapse = hasCategories;
    }
  }
  if (tree && !hasCategories) {
    // Scrollbars are not compatible with a non-flyout toolbox.
    var hasScrollbars = false;
  } else {
    var hasScrollbars = options['scrollbars'];
    if (hasScrollbars === undefined) {
      hasScrollbars = true;
    }
  }
  return {
    RTL: !!options['rtl'],
    collapse: hasCollapse,
    readOnly: readOnly,
    maxBlocks: options['maxBlocks'] || Infinity,
    pathToBlockly: options['path'] || './',
    hasCategories: hasCategories,
    hasScrollbars: hasScrollbars,
    hasTrashcan: hasTrashcan,
    languageTree: tree
  };
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Create the SVG image.
 * @param {!Element} container Containing element.
<<<<<<< HEAD
 * @param {!Blockly.Options} options Dictionary of options.
 * @return {!Element} Newly created SVG image.
 * @private
 */
Blockly.createDom_ = function(container, options) {
=======
 * @private
 */
Blockly.createDom_ = function(container) {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  // Sadly browsers (Chrome vs Firefox) are currently inconsistent in laying
  // out content in RTL mode.  Therefore Blockly forces the use of LTR,
  // then manually positions content in RTL as needed.
  container.setAttribute('dir', 'LTR');
  // Closure can be trusted to create HTML widgets with the proper direction.
<<<<<<< HEAD
  goog.ui.Component.setDefaultRightToLeft(options.RTL);

  // Load CSS.
  Blockly.Css.inject(options.hasCss, options.pathToMedia);
=======
  goog.ui.Component.setDefaultRightToLeft(Blockly.RTL);

  // Load CSS.
  Blockly.Css.inject();
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)

  // Build the SVG DOM.
  /*
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    class="blocklySvg">
    ...
  </svg>
  */
<<<<<<< HEAD
  var svg = Blockly.utils.createSvgElement('svg', {
=======
  var svg = Blockly.createSvgElement('svg', {
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlns:html': 'http://www.w3.org/1999/xhtml',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'version': '1.1',
    'class': 'blocklySvg'
<<<<<<< HEAD
  }, container);
=======
  }, null);
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  /*
  <defs>
    ... filters go here ...
  </defs>
  */
<<<<<<< HEAD
  var defs = Blockly.utils.createSvgElement('defs', {}, svg);
  // Each filter/pattern needs a unique ID for the case of multiple Blockly
  // instances on a page.  Browser behaviour becomes undefined otherwise.
  // https://neil.fraser.name/news/2015/11/01/
  // TODO (tmickel): Look into whether block highlighting still works.
  // Reference commit:
  // https://github.com/google/blockly/commit/144be4d49f36fdba260a26edbd170ae75bbc37a6
  var rnd = String(Math.random()).substring(2);

  // Using a dilate distorts the block shape.
  // Instead use a gaussian blur, and then set all alpha to 1 with a transfer.
  var stackGlowFilter = Blockly.utils.createSvgElement('filter',
      {
        'id': 'blocklyStackGlowFilter' + rnd,
        'height': '160%',
        'width': '180%',
        y: '-30%',
        x: '-40%'
      },
      defs);
  options.stackGlowBlur = Blockly.utils.createSvgElement('feGaussianBlur',
      {
        'in': 'SourceGraphic',
        'stdDeviation': Blockly.Colours.stackGlowSize
      },
      stackGlowFilter);
  // Set all gaussian blur pixels to 1 opacity before applying flood
  var componentTransfer = Blockly.utils.createSvgElement('feComponentTransfer', {'result': 'outBlur'}, stackGlowFilter);
  Blockly.utils.createSvgElement('feFuncA',
      {
        'type': 'table',
        'tableValues': '0' + goog.string.repeat(' 1', 16)
      },
      componentTransfer);
  // Color the highlight
  Blockly.utils.createSvgElement('feFlood',
      {
        'flood-color': Blockly.Colours.stackGlow,
        'flood-opacity': Blockly.Colours.stackGlowOpacity,
        'result': 'outColor'
      },
      stackGlowFilter);
  Blockly.utils.createSvgElement('feComposite',
      {
        'in': 'outColor',
        'in2': 'outBlur',
        'operator': 'in',
        'result': 'outGlow'
      },
      stackGlowFilter);
  Blockly.utils.createSvgElement('feComposite',
      {
        'in': 'SourceGraphic',
        'in2': 'outGlow',
        'operator': 'over'
      },
      stackGlowFilter);

  // Filter for replacement marker
  var replacementGlowFilter = Blockly.utils.createSvgElement('filter',
      {
        'id': 'blocklyReplacementGlowFilter' + rnd,
        'height': '160%',
        'width': '180%',
        y: '-30%',
        x: '-40%'
      },
      defs);
  Blockly.utils.createSvgElement('feGaussianBlur',
      {
        'in': 'SourceGraphic',
        'stdDeviation': Blockly.Colours.replacementGlowSize
      },
      replacementGlowFilter);
  // Set all gaussian blur pixels to 1 opacity before applying flood
  var componentTransfer = Blockly.utils.createSvgElement('feComponentTransfer',
      {'result': 'outBlur'}, replacementGlowFilter);
  Blockly.utils.createSvgElement('feFuncA',
      {
        'type': 'table',
        'tableValues': '0' + goog.string.repeat(' 1', 16)
      },
      componentTransfer);
  // Color the highlight
  Blockly.utils.createSvgElement('feFlood',
      {
        'flood-color': Blockly.Colours.replacementGlow,
        'flood-opacity': Blockly.Colours.replacementGlowOpacity,
        'result': 'outColor'
      },
      replacementGlowFilter);
  Blockly.utils.createSvgElement('feComposite',
      {
        'in': 'outColor',
        'in2': 'outBlur',
        'operator': 'in',
        'result': 'outGlow'
      },
      replacementGlowFilter);
  Blockly.utils.createSvgElement('feComposite',
      {
        'in': 'SourceGraphic',
        'in2': 'outGlow',
        'operator': 'over'
      },
      replacementGlowFilter);
  /*
    <pattern id="blocklyDisabledPattern837493" patternUnits="userSpaceOnUse"
=======
  var defs = Blockly.createSvgElement('defs', {}, svg);
  var filter, feSpecularLighting, feMerge, pattern;
  /*
    <filter id="blocklyEmboss">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>
      <feSpecularLighting in="blur" surfaceScale="1" specularConstant="0.5"
                          specularExponent="10" lighting-color="white"
                          result="specOut">
        <fePointLight x="-5000" y="-10000" z="20000"/>
      </feSpecularLighting>
      <feComposite in="specOut" in2="SourceAlpha" operator="in"
                   result="specOut"/>
      <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic"
                   k1="0" k2="1" k3="1" k4="0"/>
    </filter>
  */
  filter = Blockly.createSvgElement('filter', {'id': 'blocklyEmboss'}, defs);
  Blockly.createSvgElement('feGaussianBlur',
      {'in': 'SourceAlpha', 'stdDeviation': 1, 'result': 'blur'}, filter);
  feSpecularLighting = Blockly.createSvgElement('feSpecularLighting',
      {'in': 'blur', 'surfaceScale': 1, 'specularConstant': 0.5,
      'specularExponent': 10, 'lighting-color': 'white', 'result': 'specOut'},
      filter);
  Blockly.createSvgElement('fePointLight',
      {'x': -5000, 'y': -10000, 'z': 20000}, feSpecularLighting);
  Blockly.createSvgElement('feComposite',
      {'in': 'specOut', 'in2': 'SourceAlpha', 'operator': 'in',
      'result': 'specOut'}, filter);
  Blockly.createSvgElement('feComposite',
      {'in': 'SourceGraphic', 'in2': 'specOut', 'operator': 'arithmetic',
      'k1': 0, 'k2': 1, 'k3': 1, 'k4': 0}, filter);
  /*
    <filter id="blocklyTrashcanShadowFilter">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
      <feOffset in="blur" dx="1" dy="1" result="offsetBlur"/>
      <feMerge>
        <feMergeNode in="offsetBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  */
  filter = Blockly.createSvgElement('filter',
      {'id': 'blocklyTrashcanShadowFilter'}, defs);
  Blockly.createSvgElement('feGaussianBlur',
      {'in': 'SourceAlpha', 'stdDeviation': 2, 'result': 'blur'}, filter);
  Blockly.createSvgElement('feOffset',
      {'in': 'blur', 'dx': 1, 'dy': 1, 'result': 'offsetBlur'}, filter);
  feMerge = Blockly.createSvgElement('feMerge', {}, filter);
  Blockly.createSvgElement('feMergeNode', {'in': 'offsetBlur'}, feMerge);
  Blockly.createSvgElement('feMergeNode', {'in': 'SourceGraphic'}, feMerge);
  /*
    <filter id="blocklyShadowFilter">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
  */
  filter = Blockly.createSvgElement('filter',
      {'id': 'blocklyShadowFilter'}, defs);
  Blockly.createSvgElement('feGaussianBlur', {'stdDeviation': 2}, filter);
  /*
    <pattern id="blocklyDisabledPattern" patternUnits="userSpaceOnUse"
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
             width="10" height="10">
      <rect width="10" height="10" fill="#aaa" />
      <path d="M 0 0 L 10 10 M 10 0 L 0 10" stroke="#cc0" />
    </pattern>
  */
<<<<<<< HEAD
  var disabledPattern = Blockly.utils.createSvgElement('pattern',
      {
        'id': 'blocklyDisabledPattern' + rnd,
        'patternUnits': 'userSpaceOnUse',
        'width': 10,
        'height': 10
      },
      defs);
  Blockly.utils.createSvgElement('rect',
      {
        'width': 10,
        'height': 10,
        'fill': '#aaa'
      },
      disabledPattern);
  Blockly.utils.createSvgElement('path',
      {
        'd': 'M 0 0 L 10 10 M 10 0 L 0 10',
        'stroke': '#cc0'
      },
      disabledPattern);
  options.stackGlowFilterId = stackGlowFilter.id;
  options.replacementGlowFilterId = replacementGlowFilter.id;
  options.disabledPatternId = disabledPattern.id;

  options.gridPattern = Blockly.Grid.createDom(rnd, options.gridOptions, defs);
  return svg;
};

/**
 * Create a main workspace and add it to the SVG.
 * @param {!Element} svg SVG element with pattern defined.
 * @param {!Blockly.Options} options Dictionary of options.
 * @param {!Blockly.BlockDragSurfaceSvg} blockDragSurface Drag surface SVG
 *     for the blocks.
 * @param {!Blockly.WorkspaceDragSurfaceSvg} workspaceDragSurface Drag surface
 *     SVG for the workspace.
 * @return {!Blockly.Workspace} Newly created main workspace.
 * @private
 */
Blockly.createMainWorkspace_ = function(svg, options, blockDragSurface, workspaceDragSurface) {
  options.parentWorkspace = null;
  var mainWorkspace = new Blockly.WorkspaceSvg(options, blockDragSurface, workspaceDragSurface);
  mainWorkspace.scale = options.zoomOptions.startScale;
  svg.appendChild(mainWorkspace.createDom('blocklyMainBackground'));

  if (!options.hasCategories && options.languageTree) {
    // Add flyout as an <svg> that is a sibling of the workspace svg.
    var flyout = mainWorkspace.addFlyout_('svg');
    Blockly.utils.insertAfter(flyout, svg);
  }

  // A null translation will also apply the correct initial scale.
  mainWorkspace.translate(0, 0);
  Blockly.mainWorkspace = mainWorkspace;

  if (!options.readOnly && !options.hasScrollbars) {
    var workspaceChanged = function() {
      if (!mainWorkspace.isDragging()) {
        var metrics = mainWorkspace.getMetrics();
        var edgeLeft = metrics.viewLeft + metrics.absoluteLeft;
        var edgeTop = metrics.viewTop + metrics.absoluteTop;
        if (metrics.contentTop < edgeTop ||
            metrics.contentTop + metrics.contentHeight >
            metrics.viewHeight + edgeTop ||
            metrics.contentLeft <
                (options.RTL ? metrics.viewLeft : edgeLeft) ||
            metrics.contentLeft + metrics.contentWidth > (options.RTL ?
                metrics.viewWidth : metrics.viewWidth + edgeLeft)) {
          // One or more blocks may be out of bounds.  Bump them back in.
          var MARGIN = 25;
          var blocks = mainWorkspace.getTopBlocks(false);
          for (var b = 0, block; block = blocks[b]; b++) {
            var blockXY = block.getRelativeToSurfaceXY();
            var blockHW = block.getHeightWidth();
            // Bump any block that's above the top back inside.
            var overflowTop = edgeTop + MARGIN - blockHW.height - blockXY.y;
            if (overflowTop > 0) {
              block.moveBy(0, overflowTop);
            }
            // Bump any block that's below the bottom back inside.
            var overflowBottom =
                edgeTop + metrics.viewHeight - MARGIN - blockXY.y;
            if (overflowBottom < 0) {
              block.moveBy(0, overflowBottom);
            }
            // Bump any block that's off the left back inside.
            var overflowLeft = MARGIN + edgeLeft -
                blockXY.x - (options.RTL ? 0 : blockHW.width);
            if (overflowLeft > 0) {
              block.moveBy(overflowLeft, 0);
            }
            // Bump any block that's off the right back inside.
            var overflowRight = edgeLeft + metrics.viewWidth - MARGIN -
                blockXY.x + (options.RTL ? blockHW.width : 0);
            if (overflowRight < 0) {
              block.moveBy(overflowRight, 0);
            }
          }
        }
      }
    };
    mainWorkspace.addChangeListener(workspaceChanged);
  }
  // The SVG is now fully assembled.
  Blockly.svgResize(mainWorkspace);
  Blockly.WidgetDiv.createDom();
  Blockly.DropDownDiv.createDom();
  Blockly.Tooltip.createDom();
  return mainWorkspace;
};

/**
 * Initialize Blockly with various handlers.
 * @param {!Blockly.Workspace} mainWorkspace Newly created main workspace.
 * @private
 */
Blockly.init_ = function(mainWorkspace) {
  var options = mainWorkspace.options;
  var svg = mainWorkspace.getParentSvg();

  // This fixes wheel events in Safari.
  // This makes no sense, but it really does work.
  // https://bugs.webkit.org/show_bug.cgi?id=226683#c4
  svg.parentNode.addEventListener('wheel', function() {});

  // Suppress the browser's context menu.
  Blockly.bindEventWithChecks_(svg.parentNode, 'contextmenu', null,
      function(e) {
        if (!Blockly.utils.isTargetInput(e)) {
          e.preventDefault();
        }
      });

  var workspaceResizeHandler = Blockly.bindEventWithChecks_(window, 'resize',
      null,
      function() {
        Blockly.hideChaffOnResize(true);
        Blockly.svgResize(mainWorkspace);
      });
  mainWorkspace.setResizeHandlerWrapper(workspaceResizeHandler);

  Blockly.inject.bindDocumentEvents_();

  if (options.languageTree) {
    if (mainWorkspace.toolbox_) {
      mainWorkspace.toolbox_.init(mainWorkspace);
    } else if (mainWorkspace.flyout_) {
      // Build a fixed flyout with the root blocks.
      mainWorkspace.flyout_.init(mainWorkspace);
      mainWorkspace.flyout_.show(options.languageTree.childNodes);
      mainWorkspace.flyout_.scrollToStart();
      // Translate the workspace to avoid the fixed flyout.
      if (options.horizontalLayout) {
        mainWorkspace.scrollY = mainWorkspace.flyout_.height_;
        if (options.toolboxPosition == Blockly.TOOLBOX_AT_BOTTOM) {
          mainWorkspace.scrollY *= -1;
        }
      } else {
        mainWorkspace.scrollX = mainWorkspace.flyout_.width_;
        if (options.toolboxPosition == Blockly.TOOLBOX_AT_RIGHT) {
          mainWorkspace.scrollX *= -1;
        }
      }
      mainWorkspace.translate(mainWorkspace.scrollX, mainWorkspace.scrollY);
    }
  }

  if (options.hasScrollbars) {
    mainWorkspace.scrollbar = new Blockly.ScrollbarPair(mainWorkspace);
    mainWorkspace.scrollbar.resize();
  }

  // Load the sounds.
  if (options.hasSounds) {
    Blockly.inject.loadSounds_(options.pathToMedia, mainWorkspace);
  }
};

/**
 * Bind document events, but only once.  Destroying and reinjecting Blockly
 * should not bind again.
 * Bind events for scrolling the workspace.
 * Most of these events should be bound to the SVG's surface.
 * However, 'mouseup' has to be on the whole document so that a block dragged
 * out of bounds and released will know that it has been released.
 * Also, 'keydown' has to be on the whole document since the browser doesn't
 * understand a concept of focus on the SVG image.
 * @private
 */
Blockly.inject.bindDocumentEvents_ = function() {
  if (!Blockly.documentEventsBound_) {
    Blockly.bindEventWithChecks_(document, 'keydown', null, Blockly.onKeyDown_);
    // longStop needs to run to stop the context menu from showing up.  It
    // should run regardless of what other touch event handlers have run.
    Blockly.bindEvent_(document, 'touchend', null, Blockly.longStop_);
    Blockly.bindEvent_(document, 'touchcancel', null, Blockly.longStop_);
    // Some iPad versions don't fire resize after portrait to landscape change.
    if (goog.userAgent.IPAD) {
      Blockly.bindEventWithChecks_(window, 'orientationchange', document,
          function() {
            // TODO(#397): Fix for multiple blockly workspaces.
            Blockly.svgResize(Blockly.getMainWorkspace());
          });
    }
  }
  Blockly.documentEventsBound_ = true;
};

/**
 * Load sounds for the given workspace.
 * @param {string} pathToMedia The path to the media directory.
 * @param {!Blockly.Workspace} workspace The workspace to load sounds for.
 * @private
 */
Blockly.inject.loadSounds_ = function(pathToMedia, workspace) {
  var audioMgr = workspace.getAudioManager();
  audioMgr.load(
      [
        pathToMedia + 'click.mp3',
        pathToMedia + 'click.wav',
        pathToMedia + 'click.ogg'
      ],
      'click');
  audioMgr.load(
      [
        pathToMedia + 'delete.mp3',
        pathToMedia + 'delete.ogg',
        pathToMedia + 'delete.wav'
      ],
      'delete');

  // Bind temporary hooks that preload the sounds.
  var soundBinds = [];
  var unbindSounds = function() {
    while (soundBinds.length) {
      Blockly.unbindEvent_(soundBinds.pop());
    }
    audioMgr.preload();
  };

  // opt_noCaptureIdentifier is true because this is an action to take on a
  // click, not a drag.
  // Android ignores any sound not loaded as a result of a user action.
  soundBinds.push(
      Blockly.bindEventWithChecks_(document, 'mousemove', null, unbindSounds,
          /* opt_noCaptureIdentifier */ true));
  soundBinds.push(
      Blockly.bindEventWithChecks_(document, 'touchstart', null, unbindSounds,
          /* opt_noCaptureIdentifier */ true));
};

/**
 * Modify the block tree on the existing toolbox.
 * @param {Node|string} tree DOM tree of blocks, or text representation of same.
 * @deprecated April 2015
 */
Blockly.updateToolbox = function(tree) {
  console.warn('Deprecated call to Blockly.updateToolbox, ' +
               'use workspace.updateToolbox instead.');
  Blockly.getMainWorkspace().updateToolbox(tree);
=======
  pattern = Blockly.createSvgElement('pattern',
      {'id': 'blocklyDisabledPattern', 'patternUnits': 'userSpaceOnUse',
       'width': 10, 'height': 10}, defs);
  Blockly.createSvgElement('rect',
      {'width': 10, 'height': 10, 'fill': '#aaa'}, pattern);
  Blockly.createSvgElement('path',
      {'d': 'M 0 0 L 10 10 M 10 0 L 0 10', 'stroke': '#cc0'}, pattern);
  Blockly.mainWorkspace = new Blockly.Workspace(
      Blockly.getMainWorkspaceMetrics_,
      Blockly.setMainWorkspaceMetrics_);
  svg.appendChild(Blockly.mainWorkspace.createDom());
  Blockly.mainWorkspace.maxBlocks = Blockly.maxBlocks;

  if (!Blockly.readOnly) {
    // Determine if there needs to be a category tree, or a simple list of
    // blocks.  This cannot be changed later, since the UI is very different.
    if (Blockly.hasCategories) {
      Blockly.Toolbox.createDom(svg, container);
    } else {
      /**
       * @type {!Blockly.Flyout}
       * @private
       */
      Blockly.mainWorkspace.flyout_ = new Blockly.Flyout();
      var flyout = Blockly.mainWorkspace.flyout_;
      var flyoutSvg = flyout.createDom();
      flyout.init(Blockly.mainWorkspace, true);
      flyout.autoClose = false;
      // Insert the flyout behind the workspace so that blocks appear on top.
      goog.dom.insertSiblingBefore(flyoutSvg, Blockly.mainWorkspace.svgGroup_);
      var workspaceChanged = function() {
        if (Blockly.Block.dragMode_ == 0) {
          var metrics = Blockly.mainWorkspace.getMetrics();
          if (metrics.contentTop < 0 ||
              metrics.contentTop + metrics.contentHeight >
              metrics.viewHeight + metrics.viewTop ||
              metrics.contentLeft < (Blockly.RTL ? metrics.viewLeft : 0) ||
              metrics.contentLeft + metrics.contentWidth >
              metrics.viewWidth + (Blockly.RTL ? 2 : 1) * metrics.viewLeft) {
            // One or more blocks is out of bounds.  Bump them back in.
            var MARGIN = 25;
            var blocks = Blockly.mainWorkspace.getTopBlocks(false);
            for (var b = 0, block; block = blocks[b]; b++) {
              var blockXY = block.getRelativeToSurfaceXY();
              var blockHW = block.getHeightWidth();
              // Bump any block that's above the top back inside.
              var overflow = metrics.viewTop + MARGIN - blockHW.height -
                  blockXY.y;
              if (overflow > 0) {
                block.moveBy(0, overflow);
              }
              // Bump any block that's below the bottom back inside.
              var overflow = metrics.viewTop + metrics.viewHeight - MARGIN -
                  blockXY.y;
              if (overflow < 0) {
                block.moveBy(0, overflow);
              }
              // Bump any block that's off the left back inside.
              var overflow = MARGIN + metrics.viewLeft - blockXY.x -
                  (Blockly.RTL ? 0 : blockHW.width);
              if (overflow > 0) {
                block.moveBy(overflow, 0);
              }
              // Bump any block that's off the right back inside.
              var overflow = metrics.viewLeft + metrics.viewWidth - MARGIN -
                  blockXY.x + (Blockly.RTL ? blockHW.width : 0);
              if (overflow < 0) {
                block.moveBy(overflow, 0);
              }
              // Delete any block that's sitting on top of the flyout.
              if (block.isDeletable() && (Blockly.RTL ?
                  blockXY.x - 2 * metrics.viewLeft - metrics.viewWidth :
                  -blockXY.x) > MARGIN * 2) {
                block.dispose(false, true);
              }
            }
          }
        }
      };
      Blockly.addChangeListener(workspaceChanged);
    }
  }

  Blockly.Tooltip && svg.appendChild(Blockly.Tooltip.createDom());
  if (!Blockly.readOnly && Blockly.FieldDropdown) {
    svg.appendChild(Blockly.FieldDropdown.createDom());
  }

  if (Blockly.ContextMenu && Blockly.ContextMenu) {
    svg.appendChild(Blockly.ContextMenu.createDom());
  }

  // The SVG is now fully assembled.  Add it to the container.
  container.appendChild(svg);
  Blockly.svg = svg;
  Blockly.svgResize();

  // Create an HTML container for popup overlays (e.g. editor widgets).
  Blockly.WidgetDiv.DIV = goog.dom.createDom('div', 'blocklyWidgetDiv');
  document.body.appendChild(Blockly.WidgetDiv.DIV);
};


/**
 * Initialize Blockly with various handlers.
 * @private
 */
Blockly.init_ = function() {
  if (goog.userAgent.WEBKIT) {
    /* HACK:
     WebKit bug 67298 causes control points to be included in the reported
     bounding box.  Detect if this browser suffers from this bug by drawing a
     shape that is 50px high, and has a control point that sticks up by 5px.
     If the getBBox function returns a height of 55px instead of 50px, then
     this browser has broken control points.
    */
    var path = Blockly.createSvgElement('path',
        {'d': 'm 0,0 c 0,-5 0,-5 0,0 H 50 V 50 z'}, Blockly.svg);
    if (path.getBBox().height > 50) {
      // Chrome (v28) and Opera (v15) report 55, Safari (v6.0.5) reports 53.75.
      Blockly.BROKEN_CONTROL_POINTS = true;
    }
    Blockly.svg.removeChild(path);
  }

  // Bind events for scrolling the workspace.
  // Most of these events should be bound to the SVG's surface.
  // However, 'mouseup' has to be on the whole document so that a block dragged
  // out of bounds and released will know that it has been released.
  // Also, 'keydown' has to be on the whole document since the browser doesn't
  // understand a concept of focus on the SVG image.
  Blockly.bindEvent_(Blockly.svg, 'mousedown', null, Blockly.onMouseDown_);
  Blockly.bindEvent_(Blockly.svg, 'mousemove', null, Blockly.onMouseMove_);
  Blockly.bindEvent_(Blockly.svg, 'contextmenu', null, Blockly.onContextMenu_);

  if (!Blockly.documentEventsBound_) {
    // Only bind the window/document events once.
    // Destroying and reinjecting Blockly should not bind again.
    Blockly.bindEvent_(window, 'resize', document, Blockly.svgResize);
    Blockly.bindEvent_(document, 'mouseup', null, Blockly.onMouseUp_);
    Blockly.bindEvent_(document, 'keydown', null, Blockly.onKeyDown_);
    // Some iPad versions don't fire resize after portrait to landscape change.
    if (goog.userAgent.IPAD) {
      Blockly.bindEvent_(window, 'orientationchange', document, function() {
        Blockly.fireUiEvent(window, 'resize');
      }, false);
    }
    Blockly.documentEventsBound_ = true;
  }

  if (Blockly.languageTree) {
    if (Blockly.hasCategories) {
      Blockly.Toolbox.init();
    } else {
      // Build a fixed flyout with the root blocks.
      Blockly.mainWorkspace.flyout_.init(Blockly.mainWorkspace, true);
      Blockly.mainWorkspace.flyout_.show(Blockly.languageTree.childNodes);
      // Translate the workspace sideways to avoid the fixed flyout.
      Blockly.mainWorkspace.scrollX = Blockly.mainWorkspace.flyout_.width_;
      var translation = 'translate(' + Blockly.mainWorkspace.scrollX + ', 0)';
      Blockly.mainWorkspace.getCanvas().setAttribute('transform', translation);
      Blockly.mainWorkspace.getBubbleCanvas().setAttribute('transform',
                                                           translation);
    }
  }
  if (Blockly.hasScrollbars) {
    Blockly.mainWorkspace.scrollbar = new Blockly.ScrollbarPair(
        Blockly.mainWorkspace);
    Blockly.mainWorkspace.scrollbar.resize();
  }

  Blockly.mainWorkspace.addTrashcan();

  // Load the sounds.
  Blockly.loadAudio_(
      ['media/click.mp3', 'media/click.wav', 'media/click.ogg'], 'click');
  Blockly.loadAudio_(
      ['media/delete.mp3', 'media/delete.ogg', 'media/delete.wav'], 'delete');
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};
