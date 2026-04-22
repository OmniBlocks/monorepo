/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
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
 * @fileoverview Methods for graphically rendering a block as SVG.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.BlockSvg.render');

goog.require('Blockly.BlockSvg');
goog.require('Blockly.scratchBlocksUtils');
goog.require('Blockly.utils');
<<<<<<< HEAD
goog.require('Blockly.constants');
=======
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e


// UI constants for rendering blocks.
/**
* Grid unit to pixels conversion
* @const
*/
Blockly.BlockSvg.GRID_UNIT = 4;

/**
 * Horizontal space between elements.
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_X = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Vertical space between elements.
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_Y = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X = 16 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a block with output (reporters).
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_OUTPUT = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a shadow block with output (single fields).
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_SHADOW_OUTPUT = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum height of a block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of extra row after a statement input.
 * @const
 */
Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a C- or E-shaped block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT = 40 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum height of a shadow block with output and a single field.
 * This is used for shadow blocks that only contain a field - which are smaller than even reporters.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y_SINGLE_FIELD_OUTPUT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum height of a non-shadow block with output, i.e. a reporter.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum space for a statement input height.
 * @const
 */
Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT = 6 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Width of vertical notch.
 * @const
 */
Blockly.BlockSvg.NOTCH_WIDTH = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of vertical notch.
 * @const
 */
Blockly.BlockSvg.NOTCH_HEIGHT = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Rounded corner radius.
 * @const
 */
Blockly.BlockSvg.CORNER_RADIUS = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of statement input edge on the left, in px.
 * @const
 */
Blockly.BlockSvg.STATEMENT_INPUT_EDGE_WIDTH = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Inner space between edge of statement input and notch.
 * @const
 */
Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of the top hat.
 * @const
 */
Blockly.BlockSvg.START_HAT_HEIGHT = 16;

/**
 * Height of the vertical separator line for icons that appear at the left edge
 * of a block, such as extension icons.
 * @const
 */
Blockly.BlockSvg.ICON_SEPARATOR_HEIGHT = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Path of the top hat's curve.
 * @const
 */
Blockly.BlockSvg.START_HAT_PATH = 'c 25,-22 71,-22 96,0';

/**
 * SVG path for drawing next/previous notch from left to right.
 * @const
 */
<<<<<<< HEAD
Blockly.BlockSvg.NOTCH_PATH_LEFT = `c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2`;
=======
Blockly.BlockSvg.NOTCH_PATH_LEFT = (
  'c 2,0 3,1 4,2 ' +
  'l 4,4 ' +
  'c 1,1 2,2 4,2 ' +
  'h 12 ' +
  'c 2,0 3,-1 4,-2 ' +
  'l 4,-4 ' +
  'c 1,-1 2,-2 4,-2'
);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e

/**
 * SVG path for drawing next/previous notch from right to left.
 * @const
 */
<<<<<<< HEAD
Blockly.BlockSvg.NOTCH_PATH_RIGHT = `c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2`;
=======
Blockly.BlockSvg.NOTCH_PATH_RIGHT = (
  'c -2,0 -3,1 -4,2 ' +
  'l -4,4 ' +
  'c -1,1 -2,2 -4,2 ' +
  'h -12 ' +
  'c -2,0 -3,-1 -4,-2 ' +
  'l -4,-4 ' +
  'c -1,-1 -2,-2 -4,-2'
);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e

/**
 * Amount of padding before the notch.
 * @const
 */
Blockly.BlockSvg.NOTCH_START_PADDING = 3 * Blockly.BlockSvg.GRID_UNIT;

/**
 * SVG start point for drawing the top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_START =
    'm 0,' + Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER =
    'A ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',0';

/**
 * SVG path for drawing the rounded top-right corner.
 * @const
 */
Blockly.BlockSvg.TOP_RIGHT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the rounded bottom-right corner.
 * @const
 */
Blockly.BlockSvg.BOTTOM_RIGHT_CORNER =
    ' a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the rounded bottom-left corner.
 * @const
 */
Blockly.BlockSvg.BOTTOM_LEFT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
     Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 -' +
     Blockly.BlockSvg.CORNER_RADIUS + ',-' +
     Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the top-left corner of a statement input.
 * @const
 */
Blockly.BlockSvg.INNER_TOP_LEFT_CORNER =
    ' a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the bottom-left corner of a statement input.
 * Includes the rounded inside corner.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

/**
<<<<<<< HEAD
 * SVG path for an empty leaf input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_LEAF = 
  `
  M ${6 * Blockly.BlockSvg.GRID_UNIT} 0
  l ${2 * Blockly.BlockSvg.GRID_UNIT} 0
  a ${4 * Blockly.BlockSvg.GRID_UNIT} ${4 * Blockly.BlockSvg.GRID_UNIT} 0 0 1 ${4 * Blockly.BlockSvg.GRID_UNIT} ${4 * Blockly.BlockSvg.GRID_UNIT}
  l 0 ${2.4 * Blockly.BlockSvg.GRID_UNIT}
  a ${1.6 * Blockly.BlockSvg.GRID_UNIT} ${1.6 * Blockly.BlockSvg.GRID_UNIT} 0 0 1 -${1.6 * Blockly.BlockSvg.GRID_UNIT} ${1.6 * Blockly.BlockSvg.GRID_UNIT}
  h -${4 * Blockly.BlockSvg.GRID_UNIT}
  l -${2.4 * Blockly.BlockSvg.GRID_UNIT} 0
  a ${4 * Blockly.BlockSvg.GRID_UNIT} ${4 * Blockly.BlockSvg.GRID_UNIT} 0 0 1 -${4 * Blockly.BlockSvg.GRID_UNIT} -${4 * Blockly.BlockSvg.GRID_UNIT}
  l 0 -${2.4 * Blockly.BlockSvg.GRID_UNIT}
  a ${1.6 * Blockly.BlockSvg.GRID_UNIT} ${1.6 * Blockly.BlockSvg.GRID_UNIT} 0 0 1 ${1.6 * Blockly.BlockSvg.GRID_UNIT} -${1.6 * Blockly.BlockSvg.GRID_UNIT}
  z
  `

/**
 * Width of empty plus input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_PLUS_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;
/**
 * SVG path for an empty leaf input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_PLUS = 
  `
  M ${9 * Blockly.BlockSvg.GRID_UNIT} 0
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 1 ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT}
  l 0 2
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 0 ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT}
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 1 ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT}
  l 0 4
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 1 -${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT}
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 0 -${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT}
  l 0 2
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 1 -${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT}
  h -${6 * Blockly.BlockSvg.GRID_UNIT}
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 1 -${Blockly.BlockSvg.GRID_UNIT} -${Blockly.BlockSvg.GRID_UNIT}
  l 0 -2
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 0 -${Blockly.BlockSvg.GRID_UNIT} -${Blockly.BlockSvg.GRID_UNIT}
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 1 -${Blockly.BlockSvg.GRID_UNIT} -${Blockly.BlockSvg.GRID_UNIT}
  l 0 -4
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 1 ${Blockly.BlockSvg.GRID_UNIT} -${Blockly.BlockSvg.GRID_UNIT}
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 0 ${Blockly.BlockSvg.GRID_UNIT} -${Blockly.BlockSvg.GRID_UNIT}
  l 0 -2
  a ${Blockly.BlockSvg.GRID_UNIT} ${Blockly.BlockSvg.GRID_UNIT} 0 0 1 ${Blockly.BlockSvg.GRID_UNIT} -${Blockly.BlockSvg.GRID_UNIT} 
  z
  `

/**
 * Width of empty leaf input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_LEAF_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
=======
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
 * SVG path for an empty hexagonal input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL =
    'M ' + 4 * Blockly.BlockSvg.GRID_UNIT + ',0 ' +
    ' h ' + 4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + 4 * Blockly.BlockSvg.GRID_UNIT + ',' + 4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + -4 * Blockly.BlockSvg.GRID_UNIT + ',' + 4 * Blockly.BlockSvg.GRID_UNIT +
    ' h ' + -4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + -4 * Blockly.BlockSvg.GRID_UNIT + ',' + -4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + 4 * Blockly.BlockSvg.GRID_UNIT + ',' + -4 * Blockly.BlockSvg.GRID_UNIT +
    ' z';

/**
 * Width of empty boolean input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * SVG path for an empty square input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_SQUARE =
    Blockly.BlockSvg.TOP_LEFT_CORNER_START +
    Blockly.BlockSvg.TOP_LEFT_CORNER +
    ' h ' + (12 * Blockly.BlockSvg.GRID_UNIT - 2 * Blockly.BlockSvg.CORNER_RADIUS) +
    Blockly.BlockSvg.TOP_RIGHT_CORNER +
    ' v ' + (8 * Blockly.BlockSvg.GRID_UNIT - 2 * Blockly.BlockSvg.CORNER_RADIUS) +
    Blockly.BlockSvg.BOTTOM_RIGHT_CORNER +
    ' h ' + (-12 * Blockly.BlockSvg.GRID_UNIT + 2 * Blockly.BlockSvg.CORNER_RADIUS) +
    Blockly.BlockSvg.BOTTOM_LEFT_CORNER +
    ' z';

/**
 * Width of empty square input shape.
 * @const
 */
<<<<<<< HEAD
Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;
=======
Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH = 10 * Blockly.BlockSvg.GRID_UNIT;
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e

/**
 * SVG path for an empty round input shape.
 * @const
 */

Blockly.BlockSvg.INPUT_SHAPE_ROUND =
  'M ' + (4 * Blockly.BlockSvg.GRID_UNIT) + ',0' +
  ' h ' + (4 * Blockly.BlockSvg.GRID_UNIT) +
  ' a ' + (4 * Blockly.BlockSvg.GRID_UNIT) + ' ' +
      (4 * Blockly.BlockSvg.GRID_UNIT) + ' 0 0 1 0 ' + (8 * Blockly.BlockSvg.GRID_UNIT) +
  ' h ' + (-4 * Blockly.BlockSvg.GRID_UNIT) +
  ' a ' + (4 * Blockly.BlockSvg.GRID_UNIT) + ' ' +
      (4 * Blockly.BlockSvg.GRID_UNIT) + ' 0 0 1 0 -' + (8 * Blockly.BlockSvg.GRID_UNIT) +
  ' z';

/**
 * Width of empty round input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_ROUND_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of empty input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEIGHT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of user inputs
 * @const
 */
Blockly.BlockSvg.FIELD_HEIGHT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Width of user inputs
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH = 6 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Editable field padding (left/right of the text).
 * @const
 */
Blockly.BlockSvg.EDITABLE_FIELD_PADDING = 6;

/**
 * Square box field padding (left/right of the text).
 * @const
 */
Blockly.BlockSvg.BOX_FIELD_PADDING = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Drop-down arrow padding.
 * @const
 */
Blockly.BlockSvg.DROPDOWN_ARROW_PADDING = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of user inputs during editing
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH_MIN_EDIT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Maximum width of user inputs during editing
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH_MAX_EDIT = Infinity;

/**
 * Maximum height of user inputs during editing
 * @const
 */
Blockly.BlockSvg.FIELD_HEIGHT_MAX_EDIT = Blockly.BlockSvg.FIELD_HEIGHT;

/**
 * Top padding of user inputs
 * @const
 */
Blockly.BlockSvg.FIELD_TOP_PADDING = 0.5 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Corner radius of number inputs
 * @const
 */
Blockly.BlockSvg.NUMBER_FIELD_CORNER_RADIUS = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Corner radius of text inputs
 * @const
 */
Blockly.BlockSvg.TEXT_FIELD_CORNER_RADIUS = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Default radius for a field, in px.
 * @const
 */
Blockly.BlockSvg.FIELD_DEFAULT_CORNER_RADIUS = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Max text display length for a field (per-horizontal/vertical)
 * @const
 */
Blockly.BlockSvg.MAX_DISPLAY_LENGTH = Infinity;

/**
 * Minimum X of inputs and fields for blocks with a previous connection.
 * Ensures that inputs will not overlap with the top notch of blocks.
 * @const
 */
Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Vertical padding around inline elements.
 * @const
 */
Blockly.BlockSvg.INLINE_PADDING_Y = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Point size of text field before animation. Must match size in CSS.
 * See implementation in field_textinput.
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_FONTSIZE_INITIAL = 12;

/**
 * Point size of text field after animation.
 * See implementation in field_textinput.
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_FONTSIZE_FINAL = 12;

/**
 * Whether text fields are allowed to expand past their truncated block size.
 * @const{boolean}
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_EXPAND_PAST_TRUNCATION = false;

/**
 * Whether text fields should animate their positioning.
 * @const{boolean}
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_ANIMATE_POSITIONING = false;

/**
 * Map of output/input shapes and the amount they should cause a block to be padded.
 * Outer key is the outer shape, inner key is the inner shape.
 * When a block with the outer shape contains an input block with the inner shape
 * on its left or right edge, that side is extended by the padding specified.
 * See also: `Blockly.BlockSvg.computeOutputPadding_`.
 */
Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING = {
<<<<<<< HEAD
  1 : { // Outer shape: hexagon.
    0 : 5 * Blockly.BlockSvg.GRID_UNIT, // Field in hexagon.
    1 : 2 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in hexagon.
    2 : 5 * Blockly.BlockSvg.GRID_UNIT, // Round in hexagon.
    3 : 5 * Blockly.BlockSvg.GRID_UNIT, // Square in hexagon.
    4 : 5 * Blockly.BlockSvg.GRID_UNIT, // Leaf in hexagon.
    5 : 3 * Blockly.BlockSvg.GRID_UNIT, // Plus in hexagon.
    6 : 5 * Blockly.BlockSvg.GRID_UNIT, // Octagon in hexagon.
    7 : 5 * Blockly.BlockSvg.GRID_UNIT, // Bumped in hexagon.
    8 : 5 * Blockly.BlockSvg.GRID_UNIT, // Indented in hexagon.
    9 : 2 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in hexagon.
    10: 2 * Blockly.BlockSvg.GRID_UNIT, // Arrow in hexagon.
    11: 5 * Blockly.BlockSvg.GRID_UNIT, // Ticket in hexagon.
  },
  2 : { // Outer shape: round.
    0 : 3 * Blockly.BlockSvg.GRID_UNIT, // Field in round.
    1 : 3 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in round.
    2 : 1 * Blockly.BlockSvg.GRID_UNIT, // Round in round.
    3 : 3 * Blockly.BlockSvg.GRID_UNIT, // Square in round.
    4 : 3 * Blockly.BlockSvg.GRID_UNIT, // Leaf in round.
    5 : 2 * Blockly.BlockSvg.GRID_UNIT, // Plus in round.
    6 : 1 * Blockly.BlockSvg.GRID_UNIT, // Octagon in round.
    7 : 3 * Blockly.BlockSvg.GRID_UNIT, // Bumped in round.
    8 : 4 * Blockly.BlockSvg.GRID_UNIT, // Indented in round.
    9 : 3 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in round.
    10: 3 * Blockly.BlockSvg.GRID_UNIT, // Arrow in round.
    11: 3 * Blockly.BlockSvg.GRID_UNIT, // Ticket in round.
  },
  3 : { // Outer shape: square.
    0 : 2 * Blockly.BlockSvg.GRID_UNIT, // Field in square.
    1 : 2 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in square.
    2 : 2 * Blockly.BlockSvg.GRID_UNIT, // Round in square.
    3 : 2 * Blockly.BlockSvg.GRID_UNIT, // Square in square.
    4 : 2 * Blockly.BlockSvg.GRID_UNIT, // Leaf in square.
    5 : 2 * Blockly.BlockSvg.GRID_UNIT, // Plus in square.
    6 : 1 * Blockly.BlockSvg.GRID_UNIT, // Octagon in square.
    7 : 2 * Blockly.BlockSvg.GRID_UNIT, // Bumped in square.
    8 : 2 * Blockly.BlockSvg.GRID_UNIT, // Indented in square.
    9 : 2 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in square.
    10: 2 * Blockly.BlockSvg.GRID_UNIT, // Arrow in square.
    11: 2 * Blockly.BlockSvg.GRID_UNIT, // Ticket in square.
  },
  4 : { // Outer shape: leaf.
    0 : 3 * Blockly.BlockSvg.GRID_UNIT, // Field in leaf.
    1 : 3 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in leaf.
    2 : 2 * Blockly.BlockSvg.GRID_UNIT, // Round in leaf.
    3 : 2 * Blockly.BlockSvg.GRID_UNIT, // Square in leaf.
    4 : 1 * Blockly.BlockSvg.GRID_UNIT, // Leaf in leaf.
    5 : 2 * Blockly.BlockSvg.GRID_UNIT, // Plus in leaf.
    6 : 2 * Blockly.BlockSvg.GRID_UNIT, // Octagon in leaf.
    7 : 3 * Blockly.BlockSvg.GRID_UNIT, // Bumped in leaf.
    8 : 3 * Blockly.BlockSvg.GRID_UNIT, // Indented in leaf.
    9 : 3 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in leaf.
    10: 3 * Blockly.BlockSvg.GRID_UNIT, // Arrow in leaf.
    11: 2 * Blockly.BlockSvg.GRID_UNIT, // Ticket in leaf.
  },
  5 : { // Outer shape: plus.
    0 : 5 * Blockly.BlockSvg.GRID_UNIT, // Field in plus.
    1 : 4 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in plus.
    2 : 4 * Blockly.BlockSvg.GRID_UNIT, // Round in plus.
    3 : 5 * Blockly.BlockSvg.GRID_UNIT, // Square in plus.
    4 : 5 * Blockly.BlockSvg.GRID_UNIT, // Leaf in plus.
    5 : 3 * Blockly.BlockSvg.GRID_UNIT, // Plus in plus.
    6 : 4 * Blockly.BlockSvg.GRID_UNIT, // Octagon in plus.
    7 : 5 * Blockly.BlockSvg.GRID_UNIT, // Bumped in plus.
    8 : 4 * Blockly.BlockSvg.GRID_UNIT, // Indented in plus.
    9 : 4 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in plus.
    10: 4 * Blockly.BlockSvg.GRID_UNIT, // Arrow in plus.
    11: 5 * Blockly.BlockSvg.GRID_UNIT, // Ticket in plus.
  },
  6 : { // Outer shape: octagon.
    0 : 3 * Blockly.BlockSvg.GRID_UNIT, // Field in octagon.
    1 : 2 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in octagon.
    2 : 1 * Blockly.BlockSvg.GRID_UNIT, // Round in octagon.
    3 : 5 * Blockly.BlockSvg.GRID_UNIT, // Square in octagon.
    4 : 5 * Blockly.BlockSvg.GRID_UNIT, // Leaf in octagon.
    5 : 3 * Blockly.BlockSvg.GRID_UNIT, // Plus in octagon.
    6 : 1 * Blockly.BlockSvg.GRID_UNIT, // Octagon in octagon.
    7 : 3 * Blockly.BlockSvg.GRID_UNIT, // Bumped in octagon.
    8 : 2 * Blockly.BlockSvg.GRID_UNIT, // Indented in octagon.
    9 : 2 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in octagon.
    10: 2 * Blockly.BlockSvg.GRID_UNIT, // Arrow in octagon.
    11: 5 * Blockly.BlockSvg.GRID_UNIT, // Ticket in octagon.
  },
  7 : { // Outer shape: bumped.
    0 : 1 * Blockly.BlockSvg.GRID_UNIT, // Field in bumped.
    1 : 1 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in bumped.
    2 : 1 * Blockly.BlockSvg.GRID_UNIT, // Round in bumped.
    3 : 1 * Blockly.BlockSvg.GRID_UNIT, // Square in bumped.
    4 : 1 * Blockly.BlockSvg.GRID_UNIT, // Leaf in bumped.
    5 : 1 * Blockly.BlockSvg.GRID_UNIT, // Plus in bumped.
    6 : 1 * Blockly.BlockSvg.GRID_UNIT, // Octagon in bumped.
    7 : 3 * Blockly.BlockSvg.GRID_UNIT, // Bumped in bumped.
    8 : 1 * Blockly.BlockSvg.GRID_UNIT, // Indented in bumped.
    9 : 1 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in bumped.
    10: 1 * Blockly.BlockSvg.GRID_UNIT, // Arrow in bumped.
    11: 1 * Blockly.BlockSvg.GRID_UNIT, // Ticket in bumped.
  },
  8 : { // Outer shape: indented.
    0 : 3 * Blockly.BlockSvg.GRID_UNIT, // Field in indented.
    1 : 3 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in indented.
    2 : 3 * Blockly.BlockSvg.GRID_UNIT, // Round in indented.
    3 : 3 * Blockly.BlockSvg.GRID_UNIT, // Square in indented.
    4 : 3 * Blockly.BlockSvg.GRID_UNIT, // Leaf in indented.
    5 : 3 * Blockly.BlockSvg.GRID_UNIT, // Plus in indented.
    6 : 3 * Blockly.BlockSvg.GRID_UNIT, // Octagon in indented.
    7 : 3 * Blockly.BlockSvg.GRID_UNIT, // Bumped in indented.
    8 : 0, // Indented in indented.
    9 : 3 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in indented.
    10: 3 * Blockly.BlockSvg.GRID_UNIT, // Arrow in indented.
    11: 3 * Blockly.BlockSvg.GRID_UNIT, // Ticket in indented.
  },
  9 : { // Outer shape: scrapped.
    0 : 5 * Blockly.BlockSvg.GRID_UNIT, // Field in scrapped.
    1 : 2 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in scrapped.
    2 : 5 * Blockly.BlockSvg.GRID_UNIT, // Round in scrapped.
    3 : 5 * Blockly.BlockSvg.GRID_UNIT, // Square in scrapped.
    4 : 5 * Blockly.BlockSvg.GRID_UNIT, // Leaf in scrapped.
    5 : 3 * Blockly.BlockSvg.GRID_UNIT, // Plus in scrapped.
    6 : 2 * Blockly.BlockSvg.GRID_UNIT, // Octagon in scrapped.
    7 : 5 * Blockly.BlockSvg.GRID_UNIT, // Bumped in scrapped.
    8 : 2 * Blockly.BlockSvg.GRID_UNIT, // Indented in scrapped.
    9 : 2 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in scrapped.
    10: 2 * Blockly.BlockSvg.GRID_UNIT, // Arrow in scrapped.
    11: 5 * Blockly.BlockSvg.GRID_UNIT, // Ticket in scrapped.
  },
  10: { // Outer shape: arrow.
    0 : 5 * Blockly.BlockSvg.GRID_UNIT, // Field in arrow.
    1 : 2 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in arrow.
    2 : 5 * Blockly.BlockSvg.GRID_UNIT, // Round in arrow.
    3 : 5 * Blockly.BlockSvg.GRID_UNIT, // Square in arrow.
    4 : 5 * Blockly.BlockSvg.GRID_UNIT, // Leaf in arrow.
    5 : 3 * Blockly.BlockSvg.GRID_UNIT, // Plus in arrow.
    6 : 2 * Blockly.BlockSvg.GRID_UNIT, // Octagon in arrow.
    7 : 5 * Blockly.BlockSvg.GRID_UNIT, // Bumped in arrow.
    8 : 2 * Blockly.BlockSvg.GRID_UNIT, // Indented in arrow.
    9 : 2 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in arrow.
    10: 2 * Blockly.BlockSvg.GRID_UNIT, // Arrow in arrow.
    11: 5 * Blockly.BlockSvg.GRID_UNIT, // Ticket in arrow.
  },
  11: { // Outer shape: ticket.
    0 : 6 * Blockly.BlockSvg.GRID_UNIT, // Field in ticket.
    1 : 6 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in ticket.
    2 : 6 * Blockly.BlockSvg.GRID_UNIT, // Round in ticket.
    3 : 6 * Blockly.BlockSvg.GRID_UNIT, // Square in ticket.
    4 : 6 * Blockly.BlockSvg.GRID_UNIT, // Leaf in ticket.
    5 : 6 * Blockly.BlockSvg.GRID_UNIT, // Plus in ticket.
    6 : 6 * Blockly.BlockSvg.GRID_UNIT, // Octagon in ticket.
    7 : 6 * Blockly.BlockSvg.GRID_UNIT, // Bumped in ticket.
    8 : 6 * Blockly.BlockSvg.GRID_UNIT, // Indented in ticket.
    9 : 6 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in ticket.
    10: 6 * Blockly.BlockSvg.GRID_UNIT, // Arrow in ticket.
    11: 6 * Blockly.BlockSvg.GRID_UNIT, // Ticket in ticket.
  },
};

/**
 * Default shape padding used by custom shapes if not set
 * @const
 */
Blockly.BlockSvg.DEFAULT_SHAPE_PADDING = Blockly.BlockSvg.GRID_UNIT * 5;
  
/**
=======
  1: { // Outer shape: hexagon.
    0: 5 * Blockly.BlockSvg.GRID_UNIT, // Field in hexagon.
    1: 2 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in hexagon.
    2: 5 * Blockly.BlockSvg.GRID_UNIT, // Round in hexagon.
    3: 5 * Blockly.BlockSvg.GRID_UNIT // Square in hexagon.
  },
  2: { // Outer shape: round.
    0: 3 * Blockly.BlockSvg.GRID_UNIT, // Field in round.
    1: 3 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in round.
    2: 1 * Blockly.BlockSvg.GRID_UNIT, // Round in round.
    3: 2 * Blockly.BlockSvg.GRID_UNIT // Square in round.
  },
  3: { // Outer shape: square.
    0: 2 * Blockly.BlockSvg.GRID_UNIT, // Field in square.
    1: 2 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in square.
    2: 2 * Blockly.BlockSvg.GRID_UNIT, // Round in square.
    3: 2 * Blockly.BlockSvg.GRID_UNIT // Square in square.
  }
};

/**
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
 * Corner radius of the hat on the define block.
 * @const
 */
Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS = 5 * Blockly.BlockSvg.GRID_UNIT;

/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_DEFINE_HAT =
    'a ' + Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ',' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ',-' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS;

/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_RIGHT_CORNER_DEFINE_HAT =
    'a ' + Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ',' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ',' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS;

/**
 * Padding on the right side of the internal block on the define block.
 * @const
 */
Blockly.BlockSvg.DEFINE_BLOCK_PADDING_RIGHT = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Change the colour of a block.
 */
Blockly.BlockSvg.prototype.updateColour = function() {
  var strokeColour = this.getColourTertiary();
  var renderShadowed = this.isShadow() &&
      !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this);

  if (renderShadowed && this.parentBlock_) {
    // Pull shadow block stroke colour from parent block's tertiary if possible.
    strokeColour = this.parentBlock_.getColourTertiary();
    // Special case: if we contain a colour field, set to a special stroke colour.
    if (this.inputList[0] &&
        this.inputList[0].fieldRow[0] &&
        (this.inputList[0].fieldRow[0] instanceof Blockly.FieldColour ||
        this.inputList[0].fieldRow[0] instanceof Blockly.FieldColourSlider)) {
      strokeColour = Blockly.Colours.colourPickerStroke;
    }
  }

  // Render block stroke
  this.svgPath_.setAttribute('stroke', strokeColour);

  // Render block fill
  if (this.isGlowingBlock_ || renderShadowed) {
    // Use the block's shadow colour if possible.
    if (this.getShadowColour()) {
      var fillColour = this.getShadowColour();
    } else {
<<<<<<< HEAD
      //if reporter and only contain menu field, set color to parent
      if (
        renderShadowed &&
        this.parentBlock_ &&
        this.outputConnection &&
        this.inputList.length == 1 &&
        this.inputList[0].fieldRow.length == 1 &&
        this.inputList[0].fieldRow[0] instanceof Blockly.FieldDropdown
      ) {
        var fillColour = this.parentBlock_.getColourSecondary();
      } else {
        var fillColour = this.getColourSecondary();
      }
=======
      var fillColour = this.getColourSecondary();
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    }
  } else {
    var fillColour = this.getColour();
  }
  this.svgPath_.setAttribute('fill', fillColour);

  // Render opacity
  this.svgPath_.setAttribute('fill-opacity', this.getOpacity());

<<<<<<< HEAD
  // Update colours of input shapes and block text color.
=======
  // Update colours of input shapes.
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  for (var i = 0, input; input = this.inputList[i]; i++) {
    if (input.outlinePath) {
      input.outlinePath.setAttribute('fill', this.getColourTertiary());
    }
<<<<<<< HEAD
    if (this.textColour) for (const field of input.fieldRow) {
      if (field.textElement_ && field instanceof Blockly.FieldLabel) {
        field.textElement_.style.fill = this.textColour;
        field.textElement_.setAttribute('stoke', this.textColour);
      }
    }
=======
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  }

  // Render icon(s) if applicable
  var icons = this.getIcons();
  for (var i = 0; i < icons.length; i++) {
    icons[i].updateColour();
  }

  // Bump every dropdown to change its colour.
  for (var x = 0, input; input = this.inputList[x]; x++) {
    for (var y = 0, field; field = input.fieldRow[y]; y++) {
      field.setText(null);
    }
  }
};

/**
 * Visual effect to show that if the dragging block is dropped, this block will
 * be replaced.  If a shadow block it will disappear.  Otherwise it will bump.
 * @param {boolean} add True if highlighting should be added.
 */
Blockly.BlockSvg.prototype.highlightForReplacement = function(add) {
  if (add) {
    var replacementGlowFilterId = this.workspace.options.replacementGlowFilterId
      || 'blocklyReplacementGlowFilter';
    this.svgPath_.setAttribute('filter', 'url(#' + replacementGlowFilterId + ')');
    Blockly.utils.addClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  } else {
    this.svgPath_.removeAttribute('filter');
    Blockly.utils.removeClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  }
};

/**
 * Visual effect to show that if the dragging block is dropped it will connect
 * to this input.
 * @param {Blockly.Connection} conn The connection on the input to highlight.
 * @param {boolean} add True if highlighting should be added.
 */
Blockly.BlockSvg.prototype.highlightShapeForInput = function(conn, add) {
  var input = this.getInputWithConnection(conn);
  if (!input) {
    throw 'No input found for the connection';
  }
  if (!input.outlinePath) {
    return;
  }
  if (add) {
    var replacementGlowFilterId = this.workspace.options.replacementGlowFilterId
      || 'blocklyReplacementGlowFilter';
    input.outlinePath.setAttribute('filter',
        'url(#' + replacementGlowFilterId + ')');
    Blockly.utils.addClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  } else {
    input.outlinePath.removeAttribute('filter');
    Blockly.utils.removeClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  }
};

/**
 * Returns a bounding box describing the dimensions of this block
 * and any blocks stacked below it.
 * @return {!{height: number, width: number}} Object with height and width properties.
 */
Blockly.BlockSvg.prototype.getHeightWidth = function() {
  var height = this.height;
  var width = this.width;
  // Recursively add size of subsequent blocks.
  var nextBlock = this.getNextBlock();
  if (nextBlock) {
    var nextHeightWidth = nextBlock.getHeightWidth();
    height += nextHeightWidth.height;
    height -= Blockly.BlockSvg.NOTCH_HEIGHT; // Exclude height of connected notch.
    width = Math.max(width, nextHeightWidth.width);
  }
  return {height: height, width: width};
};

/**
 * Render the block.
 * Lays out and reflows a block based on its contents and settings.
 * @param {boolean=} opt_bubble If false, just render this block.
 *   If true, also render block's parent, grandparent, etc.  Defaults to true.
 */
Blockly.BlockSvg.prototype.render = function(opt_bubble) {
  Blockly.Field.startCache();
  this.rendered = true;

  var cursorX = Blockly.BlockSvg.SEP_SPACE_X;
  if (this.RTL) {
    cursorX = -cursorX;
  }
  // Move the icons into position.
  var icons = this.getIcons();
  var scratchCommentIcon = null;
  for (var i = 0; i < icons.length; i++) {
    if (icons[i] instanceof Blockly.ScratchBlockComment) {
      // Don't render scratch block comment icon until
      // after the inputs
      scratchCommentIcon = icons[i];
    } else {
      cursorX = icons[i].renderIcon(cursorX);
    }
  }
  cursorX += this.RTL ?
      Blockly.BlockSvg.SEP_SPACE_X : -Blockly.BlockSvg.SEP_SPACE_X;
  // If there are no icons, cursorX will be 0, otherwise it will be the
  // width that the first label needs to move over by.

  // If this is an extension reporter block, add a horizontal offset.
  if (this.isScratchExtension && this.outputConnection) {
    cursorX += this.RTL ?
      -Blockly.BlockSvg.GRID_UNIT : Blockly.BlockSvg.GRID_UNIT;
  }

  var inputRows = this.renderCompute_(cursorX);
  this.renderDraw_(cursorX, inputRows);
  this.renderMoveConnections_();

  this.renderClassify_();

  // Position the Scratch Block Comment Icon at the end of the block
  if (scratchCommentIcon) {
    var iconX = this.RTL ? -inputRows.rightEdge : inputRows.rightEdge;
    var inputMarginY = inputRows[0].height / 2;
    scratchCommentIcon.renderIcon(iconX, inputMarginY);
  }

  if (opt_bubble !== false) {
    // Render all blocks above this one (propagate a reflow).
    var parentBlock = this.getParent();
    if (parentBlock) {
      parentBlock.render(true);
    } else {
      // Top-most block.  Fire an event to allow scrollbars to resize.
      Blockly.resizeSvgContents(this.workspace);
    }
  }
  Blockly.Field.stopCache();

  this.updateIntersectionObserver();
};

/**
 * Render a list of fields starting at the specified location.
 * @param {!Array.<!Blockly.Field>} fieldList List of fields.
 * @param {number} cursorX X-coordinate to start the fields.
 * @param {number} cursorY Y-coordinate around which fields are centered.
 * @return {number} X-coordinate of the end of the field row (plus a gap).
 * @private
 */
Blockly.BlockSvg.prototype.renderFields_ = function(fieldList, cursorX,
    cursorY) {
  if (this.RTL) {
    cursorX = -cursorX;
  }
  for (var t = 0, field; field = fieldList[t]; t++) {
    var root = field.getSvgRoot();
    if (!root) {
      continue;
    }
    // In blocks with a notch, fields should be bumped to a min X,
    // to avoid overlapping with the notch. Label and image fields are
    // excluded.
    if (this.previousConnection && !(field instanceof Blockly.FieldLabel) &&
        !(field instanceof Blockly.FieldImage)) {
      cursorX = this.RTL ?
        Math.min(cursorX, -Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X) :
        Math.max(cursorX, Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X);
    }
    // Offset the field upward by half its height.
    // This vertically centers the fields around cursorY.
    var yOffset = -field.getSize().height / 2;

    // If this is an extension block, and this field is the first field, and
    // it is an image field, and this block has a previous connection, bump
    // the image down by one grid unit to align it vertically.
    if (this.isScratchExtension && (field === this.inputList[0].fieldRow[0])
        && (field instanceof Blockly.FieldImage) && this.previousConnection) {
      yOffset += Blockly.BlockSvg.GRID_UNIT;
    }

    // If this is an extension hat block, adjust the height of the vertical
    // separator without adjusting the field height. The effect is to move
    // the bottom end of the line up one grid unit.
    if (this.isScratchExtension &&
        !this.previousConnection && this.nextConnection &&
        field instanceof Blockly.FieldVerticalSeparator) {
      field.setLineHeight(Blockly.BlockSvg.ICON_SEPARATOR_HEIGHT -
          Blockly.BlockSvg.GRID_UNIT);
    }

    var translateX, translateY;
    var scale = '';
    if (this.RTL) {
      cursorX -= field.renderSep + field.renderWidth;
      translateX = cursorX;
      translateY = cursorY + yOffset;
      if (field.renderWidth) {
        cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
      }
    } else {
      translateX = cursorX + field.renderSep;
      translateY = cursorY + yOffset;
      if (field.renderWidth) {
        cursorX += field.renderSep + field.renderWidth +
            Blockly.BlockSvg.SEP_SPACE_X;
      }
    }
    if (this.RTL &&
        field instanceof Blockly.FieldImage &&
        field.getFlipRTL()) {
      scale = 'scale(-1 1)';
      translateX += field.renderWidth;
    }
    root.setAttribute('transform',
        'translate(' + translateX + ', ' + translateY + ') ' + scale);

    // Fields are invisible on insertion marker.
    if (this.isInsertionMarker()) {
      root.setAttribute('display', 'none');
    }
  }
  return this.RTL ? -cursorX : cursorX;
};

/**
 * Computes the height and widths for each row and field.
 * @param {number} iconWidth Offset of first row due to icons.
 * @return {!Array.<!Array.<!Object>>} 2D array of objects, each containing
 *     position information.
 * @private
 */
Blockly.BlockSvg.prototype.renderCompute_ = function(iconWidth) {
  var inputList = this.inputList;
  var inputRows = [];
  // Block will be drawn from 0 (left edge) to rightEdge, in px.
  inputRows.rightEdge = 0;
  // Drawn from 0 to bottomEdge vertically.
  inputRows.bottomEdge = 0;
  var fieldValueWidth = 0;  // Width of longest external value field.
  var fieldStatementWidth = 0;  // Width of longest statement field.
  var hasValue = false;
  var hasStatement = false;
  var hasDummy = false;
  var lastType = undefined;

  // Previously created row, for special-casing row heights on C- and E- shaped blocks.
  var previousRow;
  for (var i = 0, input; input = inputList[i]; i++) {
    if (!input.isVisible()) {
      continue;
    }
<<<<<<< HEAD
    var isSecondInputOnProcedure = (this.type == 'procedures_definition' ||
        this.type == 'procedures_definition_return') &&
=======
    var isSecondInputOnProcedure = this.type == 'procedures_definition' &&
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
        lastType && lastType == Blockly.NEXT_STATEMENT;
    var row;
    // Don't create a new row for the second dummy input on a procedure block.
    // See github.com/LLK/scratch-blocks/issues/1658
    // In all other cases, statement and value inputs catch all preceding dummy
    // inputs, and cause a line break before following inputs.
    if (!isSecondInputOnProcedure &&
        (!lastType || lastType == Blockly.NEXT_STATEMENT ||
        input.type == Blockly.NEXT_STATEMENT)) {
      lastType = input.type;
      row = this.createRowForInput_(input);
      inputRows.push(row);
    } else {
      row = inputRows[inputRows.length - 1];
    }
    row.push(input);

    // Compute minimum dimensions for this input.
    input.renderHeight = this.computeInputHeight_(input, row, previousRow);
    input.renderWidth = this.computeInputWidth_(input);

    // If the input is a statement input, determine if a notch
    // should be drawn at the inner bottom of the C.
    row.statementNotchAtBottom = true;
    if (input.connection && input.connection.type === Blockly.NEXT_STATEMENT) {
      var linkedBlock = input.connection.targetBlock();
      if (linkedBlock && !linkedBlock.lastConnectionInStack()) {
        row.statementNotchAtBottom = false;
      }
    }

    // Expand input size.
    if (input.connection) {
      var linkedBlock = input.connection.targetBlock();
      var paddedHeight = 0;
      var paddedWidth = 0;
      if (linkedBlock) {
        // A block is connected to the input - use its size.
        var bBox = linkedBlock.getHeightWidth();
        paddedHeight = bBox.height;
        paddedWidth = bBox.width;
      } else {
        // No block connected - use the size of the rendered empty input shape.
        paddedHeight = Blockly.BlockSvg.INPUT_SHAPE_HEIGHT;
      }
      if (input.connection.type === Blockly.INPUT_VALUE) {
        paddedHeight += 2 * Blockly.BlockSvg.INLINE_PADDING_Y;
      }
      if (input.connection.type === Blockly.NEXT_STATEMENT) {
        // Subtract height of notch, only if the last block in the stack has a next connection.
        if (row.statementNotchAtBottom) {
          paddedHeight -= Blockly.BlockSvg.NOTCH_HEIGHT;
        }
      }
      input.renderHeight = Math.max(input.renderHeight, paddedHeight);
      input.renderWidth = Math.max(input.renderWidth, paddedWidth);
    }
    row.height = Math.max(row.height, input.renderHeight);
    input.fieldWidth = 0;
    if (inputRows.length == 1) {
      // The first row gets shifted to accommodate any icons.
      input.fieldWidth += this.RTL ? -iconWidth : iconWidth;
    }
    var previousFieldEditable = false;
    for (var j = 0, field; field = input.fieldRow[j]; j++) {
      if (j != 0) {
        input.fieldWidth += Blockly.BlockSvg.SEP_SPACE_X;
      }
      // Get the dimensions of the field.
      var fieldSize = field.getSize();
      field.renderWidth = fieldSize.width;
<<<<<<< HEAD
      field.renderSep = field.overrideSep ? field.overrideSep :
          (previousFieldEditable && field.EDITABLE) ? Blockly.BlockSvg.SEP_SPACE_X : 0;
=======
      field.renderSep = (previousFieldEditable && field.EDITABLE) ?
          Blockly.BlockSvg.SEP_SPACE_X : 0;
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
      // See github.com/LLK/scratch-blocks/issues/1658
      if (!isSecondInputOnProcedure) {
        input.fieldWidth += field.renderWidth + field.renderSep;
      }
      row.height = Math.max(row.height, fieldSize.height);
      previousFieldEditable = field.EDITABLE;
    }

    if (row.type != Blockly.BlockSvg.INLINE) {
      if (row.type == Blockly.NEXT_STATEMENT) {
        hasStatement = true;
        fieldStatementWidth = Math.max(fieldStatementWidth, input.fieldWidth);
      } else {
        if (row.type == Blockly.INPUT_VALUE) {
          hasValue = true;
        } else if (row.type == Blockly.DUMMY_INPUT) {
          hasDummy = true;
        }
        fieldValueWidth = Math.max(fieldValueWidth, input.fieldWidth);
      }
    }
    previousRow = row;
  }
<<<<<<< HEAD

=======
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  // Compute padding for output blocks.
  // Data is attached to the row.
  this.computeOutputPadding_(inputRows);
  // Compute the statement edge.
  // This is the width of a block where statements are nested.
  inputRows.statementEdge = Blockly.BlockSvg.STATEMENT_INPUT_EDGE_WIDTH +
      fieldStatementWidth;

  // Compute the preferred right edge.
  inputRows.rightEdge = this.computeRightEdge_(inputRows.rightEdge,
      hasStatement);

  // Bottom edge is sum of row heights
  for (var i = 0; i < inputRows.length; i++) {
    inputRows.bottomEdge += inputRows[i].height;
  }

  inputRows.hasValue = hasValue;
  inputRows.hasStatement = hasStatement;
  inputRows.hasDummy = hasDummy;
  return inputRows;
};

/**
 * Compute the minimum width of this input based on the connection type and
 * outputs.
 * @param {!Blockly.Input} input The input to measure.
 * @return {number} the computed width of this input.
 * @private
 */
Blockly.BlockSvg.prototype.computeInputWidth_ = function(input) {
  // Empty input shape widths.
  if (input.type == Blockly.INPUT_VALUE &&
      (!input.connection || !input.connection.isConnected())) {
<<<<<<< HEAD
    const shape = input.connection.getOutputShape();
    switch (shape) {
=======
    switch (input.connection.getOutputShape()) {
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
      case Blockly.OUTPUT_SHAPE_SQUARE:
        return Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH;
      case Blockly.OUTPUT_SHAPE_ROUND:
        return Blockly.BlockSvg.INPUT_SHAPE_ROUND_WIDTH;
      case Blockly.OUTPUT_SHAPE_HEXAGONAL:
        return Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL_WIDTH;
<<<<<<< HEAD
      case Blockly.OUTPUT_SHAPE_LEAF:
        return Blockly.BlockSvg.INPUT_SHAPE_LEAF_WIDTH;
      case Blockly.OUTPUT_SHAPE_PLUS:
        return Blockly.BlockSvg.INPUT_SHAPE_PLUS_WIDTH;
      default: {
        const customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(shape);
        if (customShape) return customShape.emptyInputWidth;
        return 0;
      }
=======
      default:
        return 0;
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    }
  } else {
    return 0;
  }
};

/**
 * Compute the minimum height of this input.
 * @param {!Blockly.Input} input The input to measure.
 * @param {!Object} row The row of the block that is currently being measured.
 * @param {!Object} previousRow The previous row of the block, which was just
 *     measured.
 * @return {number} the computed height of this input.
 * @private
 */
Blockly.BlockSvg.prototype.computeInputHeight_ = function(input, row,
    previousRow) {
  if (this.inputList.length === 1 && this.outputConnection &&
      (this.isShadow() &&
<<<<<<< HEAD
      !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this) &&
      (this.type !== 'procedures_prototype' ||
      this.type !== 'procedures_call')) &&
      this.type !== 'polygon') {
=======
      !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this))) {
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    // "Lone" field blocks are smaller.
    return Blockly.BlockSvg.MIN_BLOCK_Y_SINGLE_FIELD_OUTPUT;
  } else if (this.outputConnection) {
    // If this is an extension reporter block, make it taller.
<<<<<<< HEAD
    if (this.isScratchExtension || this.type === 'polygon') {
=======
    if (this.isScratchExtension) {
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
      return Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER + 2 * Blockly.BlockSvg.GRID_UNIT;
    }
    // All other reporters.
    return Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
  } else if (row.type == Blockly.NEXT_STATEMENT) {
    // Statement input.
    return Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
  } else if (previousRow && previousRow.type == Blockly.NEXT_STATEMENT) {
    // Extra row for below statement input.
    return Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y;
  } else {
    // If this is an extension block, and it has a previous connection,
    // make it taller.
    if (this.isScratchExtension && this.previousConnection) {
      return Blockly.BlockSvg.MIN_BLOCK_Y + 2 * Blockly.BlockSvg.GRID_UNIT;
    }
    // All other blocks.
    return Blockly.BlockSvg.MIN_BLOCK_Y;
  }
};

/**
 * Create a row for an input and associated fields.
 * @param {!Blockly.Input} input The input that the row is based on.
 * @return {!Object} The new row, with the correct type and default sizing info.
 */
Blockly.BlockSvg.prototype.createRowForInput_ = function(input) {
  // Create new row.
  var row = [];
  if (input.type != Blockly.NEXT_STATEMENT) {
    row.type = Blockly.BlockSvg.INLINE;
  } else {
    row.type = input.type;
  }
  row.height = 0;
  // Default padding for a block: same as separators between fields/inputs.
  row.paddingStart = Blockly.BlockSvg.SEP_SPACE_X;
  row.paddingEnd = Blockly.BlockSvg.SEP_SPACE_X;
  return row;
};

/**
 * Compute the preferred right edge of the block.
 * @param {number} curEdge The previously calculated right edge.
 * @param {boolean} hasStatement Whether this block has a statement input.
 * @return {number} The preferred right edge of the block.
 */
Blockly.BlockSvg.prototype.computeRightEdge_ = function(curEdge, hasStatement) {
  var edge = curEdge;
  if (this.previousConnection || this.nextConnection) {
    // Blocks with notches
    edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X);
  } else if (this.outputConnection) {
    if (this.isShadow() &&
        !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this)) {
<<<<<<< HEAD
      if (this.type === 'polygon') {
        edge = edge
      } else {
        // Single-fields
        edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_SHADOW_OUTPUT);
      }
=======
      // Single-fields
      edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_SHADOW_OUTPUT);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    } else {
      // Reporters
      edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_OUTPUT);
    }
  }
  if (hasStatement) {
    // Statement blocks (C- or E- shaped) have a longer minimum width.
    edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT);
  }

  // Ensure insertion markers are at least insertionMarkerMinWidth_ wide.
  if (this.insertionMarkerMinWidth_ > 0) {
    edge = Math.max(edge, this.insertionMarkerMinWidth_);
  }
  return edge;
};

/**
 * For a block with output,
 * determine start and end padding, based on connected inputs.
 * Padding will depend on the shape of the output, the shape of the input,
 * and possibly the size of the input.
 * @param {!Array.<!Array.<!Object>>} inputRows Partially calculated rows.
 */
Blockly.BlockSvg.prototype.computeOutputPadding_ = function(inputRows) {
  // Only apply to blocks with outputs and not single fields (shadows).
  if (!this.getOutputShape() || !this.outputConnection ||
      (this.isShadow() &&
      !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this))) {
    return;
  }
  // Blocks with outputs must have single row to be padded.
  if (inputRows.length > 1) {
    return;
  }
  var row = inputRows[0];
  var shape = this.getOutputShape();
  // Reset any padding: it's about to be set.
  row.paddingStart = 0;
  row.paddingEnd = 0;
  // Start row padding: based on first input or first field.
  var firstInput = row[0];
  var firstField = firstInput.fieldRow[0];
  var otherShape;
  // In checking the left/start side, a field takes precedence over any input.
  // That's because a field will be rendered before any value input.
<<<<<<< HEAD
  if (firstField || !firstInput.connection) {
=======
  if (firstField) {
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    otherShape = 0; // Field comes first in the row.
  } else {
    // Value input comes first in the row.
    var inputConnection = firstInput.connection;
    if (!inputConnection.targetConnection) {
      // Not connected: use the drawn shape.
      otherShape = inputConnection.getOutputShape();
    } else {
      // Connected: use the connected block's output shape.
      otherShape = inputConnection.targetConnection.getSourceBlock().getOutputShape();
    }
    // Special case for hexagonal output: if the connection is larger height
    // than a standard reporter, add some start padding.
    // https://github.com/LLK/scratch-blocks/issues/376
    if (shape == Blockly.OUTPUT_SHAPE_HEXAGONAL &&
        otherShape != Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      var deltaHeight = firstInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
      // One grid unit per level of nesting.
      row.paddingStart += deltaHeight / 2;
    }
  }
<<<<<<< HEAD
  
  const customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(shape);
  if (customShape && customShape.blockPaddingStart) {
    row.paddingStart += customShape.blockPaddingStart(this, otherShape, firstInput, firstField, row);
  }

  const paddingStart = (Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[shape] || {})[otherShape];
  row.paddingStart += paddingStart === undefined ? Blockly.BlockSvg.DEFAULT_SHAPE_PADDING : paddingStart;

=======
  row.paddingStart += Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[shape][otherShape];
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  // End row padding: based on last input or last field.
  var lastInput = row[row.length - 1];
  // In checking the right/end side, any value input takes precedence over any field.
  // That's because fields are rendered before inputs...the last item
  // in the row will be an input, if one exists.
  if (lastInput.connection) {
    // Value input last in the row.
    var inputConnection = lastInput.connection;
    if (!inputConnection.targetConnection) {
      // Not connected: use the drawn shape.
      otherShape = inputConnection.getOutputShape();
    } else {
      // Connected: use the connected block's output shape.
      otherShape = inputConnection.targetConnection.getSourceBlock().getOutputShape();
    }
    // Special case for hexagonal output: if the connection is larger height
    // than a standard reporter, add some end padding.
    // https://github.com/LLK/scratch-blocks/issues/376
    if (shape == Blockly.OUTPUT_SHAPE_HEXAGONAL &&
        otherShape != Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      var deltaHeight = lastInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
      // One grid unit per level of nesting.
      row.paddingEnd += deltaHeight / 2;
    }
  } else {
    // No input in this row - mark as field.
    otherShape = 0;
  }
<<<<<<< HEAD
  
  if (customShape && customShape.blockPaddingEnd) {
    const lastField = lastInput.fieldRow[lastInput.fieldRow.length - 1];
    row.paddingEnd += customShape.blockPaddingEnd(this, otherShape, lastInput, lastField, row);
  }

  const paddingEnd = (Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[shape] || {})[otherShape];
  row.paddingEnd += paddingEnd === undefined ? Blockly.BlockSvg.DEFAULT_SHAPE_PADDING : paddingEnd;
=======
  row.paddingEnd += Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[shape][otherShape];
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
};

/**
 * Draw the path of the block.
 * Move the fields to the correct locations.
 * @param {number} iconWidth Offset of first row due to icons.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @private
 */
Blockly.BlockSvg.prototype.renderDraw_ = function(iconWidth, inputRows) {
  this.startHat_ = false;
  // Should the top left corners be rounded or square?
  // Currently, it is squared only if it's a hat.
  this.squareTopLeftCorner_ = false;
  if (!this.outputConnection && !this.previousConnection) {
    // No output or previous connection.
    this.squareTopLeftCorner_ = true;
    this.startHat_ = true;
    inputRows.rightEdge = Math.max(inputRows.rightEdge, 100);
  }

  // Amount of space to skip drawing the top and bottom,
  // to make room for the left and right to draw shapes (curves or angles).
  this.edgeShapeWidth_ = 0;
  this.edgeShape_ = null;
  if (this.outputConnection) {
    // Width of the curve/pointy-curve
    var shape = this.getOutputShape();
<<<<<<< HEAD
    if (shape != Blockly.OUTPUT_SHAPE_SQUARE) {
      this.edgeShapeWidth_ = (inputRows.bottomEdge + Math.max(this.inputList.filter(v => v.type == Blockly.NEXT_STATEMENT).length-1, 0) * Blockly.BlockSvg.NOTCH_WIDTH) / 2;
=======
    if (shape === Blockly.OUTPUT_SHAPE_HEXAGONAL || shape === Blockly.OUTPUT_SHAPE_ROUND) {
      this.edgeShapeWidth_ = inputRows.bottomEdge / 2;
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
      this.edgeShape_ = shape;
      this.squareTopLeftCorner_ = true;
    }
  }

  // Assemble the block's path.
  var steps = [];

  this.renderDrawTop_(steps, inputRows.rightEdge);
  var cursorY = this.renderDrawRight_(steps, inputRows, iconWidth);
  this.renderDrawBottom_(steps, cursorY);
<<<<<<< HEAD
  this.renderDrawLeft_(steps, cursorY);
=======
  this.renderDrawLeft_(steps);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e

  var pathString = steps.join(' ');
  this.svgPath_.setAttribute('d', pathString);

  if (this.RTL) {
    // Mirror the block's path.
    // This is awesome.
    this.svgPath_.setAttribute('transform', 'scale(-1 1)');
  }
};

/**
 * Give the block an attribute 'data-shapes' that lists its shape[s], and an
 *     attribute 'data-category' with its category.
 * @private
 */
Blockly.BlockSvg.prototype.renderClassify_ = function() {
  var shapes = [];

  if (this.outputConnection) {
<<<<<<< HEAD
    if (this.isShadow_ && !(this.type === 'polygon' || this.type === 'procedures_prototype')) {
=======
    if (this.isShadow_) {
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
      shapes.push('argument');
    } else {
      shapes.push('reporter');
    }
<<<<<<< HEAD
    switch (this.edgeShape_) {
      case Blockly.OUTPUT_SHAPE_HEXAGONAL:
        shapes.push('boolean');
        break;
      case Blockly.OUTPUT_SHAPE_ROUND:
        shapes.push('round');
        break;
      case Blockly.OUTPUT_SHAPE_LEAF:
        shapes.push('leaf');
        break;
      case Blockly.OUTPUT_SHAPE_PLUS:
        shapes.push('plus');
        break;
      default: {
        const isCustomShape = Blockly.BlockSvg.CUSTOM_SHAPES.has(this.edgeShape_);
        if (isCustomShape) shapes.push('custom');
      }
=======
    if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      shapes.push('boolean');
    } else if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_ROUND) {
      shapes.push('round');
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    }
  } else {
    // count the number of statement inputs
    var inputList = this.inputList;
    var statementCount = 0;
    for (var i = 0, input; input = inputList[i]; i++) {
      if (input.connection && input.connection.type === Blockly.NEXT_STATEMENT) {
        statementCount++;
      }
    }

    if (statementCount) {
      shapes.push('c-block');
      shapes.push('c-' + statementCount);
    }
    if (this.startHat_) {
      shapes.push('hat'); // c-block+hats are possible (e.x. reprter procedures)
    } else if (!statementCount) {
      shapes.push('stack'); //only call it "stack" if it's not a c-block
    }
    if (!this.nextConnection) {
      shapes.push('end');
    }
  }

  this.svgGroup_.setAttribute('data-shapes', shapes.join(' '));

  if (this.getCategory()) {
    this.svgGroup_.setAttribute('data-category', this.getCategory());
  }
};

/**
 * Render the top edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} rightEdge Minimum width of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawTop_ = function(steps, rightEdge) {
<<<<<<< HEAD
  if (this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE ||
    this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE + '_return') {
=======
  if (this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE) {
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    steps.push('m 0, 0');
    steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_DEFINE_HAT);
  } else {
    // Position the cursor at the top-left starting point.
    if (this.squareTopLeftCorner_) {
      steps.push('m 0,0');
      if (this.startHat_) {
        steps.push(Blockly.BlockSvg.START_HAT_PATH);
      }
      // Skip space for the output shape
      if (this.edgeShapeWidth_) {
        steps.push('m ' + this.edgeShapeWidth_ + ',0');
      }
    } else {
      steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_START);
      // Top-left rounded corner.
      steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER);
    }

    // Top edge.
    if (this.previousConnection) {
      // Space before the notch
      steps.push('H', Blockly.BlockSvg.NOTCH_START_PADDING);
<<<<<<< HEAD

      // if we have a custom check that corresponds to a custom notch, use it
      const checkStatement = (this.previousConnection.check_ || [])[0];
      const customNotch = Blockly.BlockSvg.CUSTOM_NOTCHES.get(checkStatement);
      if (customNotch) steps.push(customNotch.left);
      else steps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT);

=======
      steps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
      // Create previous block connection.
      var connectionX = (this.RTL ?
          -Blockly.BlockSvg.NOTCH_WIDTH : Blockly.BlockSvg.NOTCH_WIDTH);
      this.previousConnection.setOffsetInBlock(connectionX, 0);
    }
  }
  this.width = rightEdge;
};

/**
 * Render the right edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @param {number} iconWidth Offset of first row due to icons.
 * @return {number} Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawRight_ = function(steps,
    inputRows, iconWidth) {
  var cursorX = 0;
  var cursorY = 0;
<<<<<<< HEAD
  if (!this.isCollapsed()) {
    var connectionX, connectionY;
    for (var y = 0, row; row = inputRows[y]; y++) {
      cursorX = row.paddingStart;
      if (this.edgeShape_ && this.inputList.find(v => v.type == Blockly.NEXT_STATEMENT)) cursorX += this.edgeShapeWidth_ + Blockly.BlockSvg.CORNER_RADIUS * 2
      if (y == 0) {
        cursorX += this.RTL ? -iconWidth : iconWidth;
      }
  
      if (row.type == Blockly.BlockSvg.INLINE) {
        // Inline inputs.
        for (var x = 0, input; input = row[x]; x++) {
          // Align fields vertically within the row.
          // Moves the field to half of the row's height.
          // In renderFields_, the field is further centered
          // by its own rendered height.
          var fieldY = cursorY + row.height / 2;
  
          var fieldX = Blockly.BlockSvg.getAlignedCursor_(cursorX, input,
              inputRows.rightEdge);
  
          cursorX = this.renderFields_(input.fieldRow, fieldX, fieldY);
          if (input.type == Blockly.INPUT_VALUE) {
            // Create inline input connection.
            // In blocks with a notch, inputs should be bumped to a min X,
            // to avoid overlapping with the notch.
            if (this.previousConnection) {
              cursorX = Math.max(cursorX, Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X);
            }
            if (this.outputConnection && (input.connection.targetConnection ? input.connection.targetConnection.getSourceBlock().getOutputShape() : input.connection.getOutputShape()) === Blockly.OUTPUT_SHAPE_SQUARE && this.getOutputShape() !== Blockly.OUTPUT_SHAPE_SQUARE) {
              cursorX = Math.max(cursorX, this.edgeShapeWidth_)
            }
            connectionX = this.RTL ? -cursorX : cursorX;
            // Attempt to center the connection vertically.
            var connectionYOffset = row.height / 2;
            connectionY = cursorY + connectionYOffset;
            input.connection.setOffsetInBlock(connectionX, connectionY);
            this.renderInputShape_(input, cursorX, cursorY + connectionYOffset);
            cursorX += input.renderWidth + Blockly.BlockSvg.SEP_SPACE_X;
            if (input.connection.targetConnection) {
              cursorX += input.connection.targetConnection.sourceBlock_.outputLeftPadding_()
            }
          }
        }
        // Remove final separator and replace it with right-padding.
        cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
        cursorX += row.paddingEnd;
        // Update right edge for all inputs, such that all rows
        // stretch to be at least the size of all previous rows.
        inputRows.rightEdge = Math.max(cursorX, inputRows.rightEdge, this.inputList.find(v => v.type == Blockly.NEXT_STATEMENT) ? Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT + this.edgeShapeWidth_ : 0);
        // Move to the right edge
        cursorX = Math.max(cursorX, inputRows.rightEdge);
        this.width = Math.max(this.width, cursorX);
        if (this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE + '_return') {
          this.renderDefineBlock_(steps, inputRows, row[0], row, cursorY, cursorX);
        }
        if (this.type != Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE + '_return') {
          if (!this.edgeShape_ || this.inputList.find(v => v.type == Blockly.NEXT_STATEMENT)) {
            // Include corner radius in drawing the horizontal line.
            steps.push('H', cursorX - Blockly.BlockSvg.CORNER_RADIUS);
            steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
          } else {
            // Don't include corner radius - no corner (edge shape drawn).
            steps.push('H', cursorX - this.edgeShapeWidth_);
          }
          // Subtract CORNER_RADIUS * 2 to account for the top right corner
          // and also the bottom right corner. Only move vertically the non-corner length.
          if (!this.edgeShape_ || this.inputList.find(v => v.type == Blockly.NEXT_STATEMENT)) {
            steps.push('v', row.height - Blockly.BlockSvg.CORNER_RADIUS * 2);
          }
        }
      } else if (row.type == Blockly.NEXT_STATEMENT) {
        // Nested statement.
        var input = row[0];
        var fieldX = cursorX;
        // Align fields vertically within the row.
        // In renderFields_, the field is further centered by its own height.
        var fieldY = cursorY;
        fieldY += Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
        this.renderFields_(input.fieldRow, fieldX, fieldY);
        // Move to the start of the notch.
        cursorX = inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH;
  
        if (this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE) {
          this.renderDefineBlock_(steps, inputRows, input, row, cursorY);
        } else {
          Blockly.BlockSvg.drawStatementInputFromTopRight_(steps, cursorX,
              inputRows.rightEdge, row, this);
        }
  
        // Create statement connection.
        connectionX = this.RTL ? -cursorX : cursorX;
        input.connection.setOffsetInBlock(connectionX, cursorY);
        if (input.connection.isConnected()) {
          this.width = Math.max(this.width, inputRows.statementEdge +
            input.connection.targetBlock().getHeightWidth().width + (this.inputList.find(v => v.type == Blockly.NEXT_STATEMENT) ? this.edgeShapeWidth_ : 0));
        }
        if ((!(this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE ||
          this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE + '_return')) &&
          (y == inputRows.length - 1 ||
            inputRows[y + 1].type == Blockly.NEXT_STATEMENT)) {
          // If the final input is a statement stack, add a small row underneath.
          // Consecutive statement stacks are also separated by a small divider.
          steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
          steps.push('v', Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y - 2 * Blockly.BlockSvg.CORNER_RADIUS);
          cursorY += Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y;
        }
      }
      cursorY += row.height;
    }
=======
  var connectionX, connectionY;
  for (var y = 0, row; row = inputRows[y]; y++) {
    cursorX = row.paddingStart;
    if (y == 0) {
      cursorX += this.RTL ? -iconWidth : iconWidth;
    }

    if (row.type == Blockly.BlockSvg.INLINE) {
      // Inline inputs.
      for (var x = 0, input; input = row[x]; x++) {
        // Align fields vertically within the row.
        // Moves the field to half of the row's height.
        // In renderFields_, the field is further centered
        // by its own rendered height.
        var fieldY = cursorY + row.height / 2;

        var fieldX = Blockly.BlockSvg.getAlignedCursor_(cursorX, input,
            inputRows.rightEdge);

        cursorX = this.renderFields_(input.fieldRow, fieldX, fieldY);
        if (input.type == Blockly.INPUT_VALUE) {
          // Create inline input connection.
          // In blocks with a notch, inputs should be bumped to a min X,
          // to avoid overlapping with the notch.
          if (this.previousConnection) {
            cursorX = Math.max(cursorX, Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X);
          }
          connectionX = this.RTL ? -cursorX : cursorX;
          // Attempt to center the connection vertically.
          var connectionYOffset = row.height / 2;
          connectionY = cursorY + connectionYOffset;
          input.connection.setOffsetInBlock(connectionX, connectionY);
          this.renderInputShape_(input, cursorX, cursorY + connectionYOffset);
          cursorX += input.renderWidth + Blockly.BlockSvg.SEP_SPACE_X;
        }
      }
      // Remove final separator and replace it with right-padding.
      cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
      cursorX += row.paddingEnd;
      // Update right edge for all inputs, such that all rows
      // stretch to be at least the size of all previous rows.
      inputRows.rightEdge = Math.max(cursorX, inputRows.rightEdge);
      // Move to the right edge
      cursorX = Math.max(cursorX, inputRows.rightEdge);
      this.width = Math.max(this.width, cursorX);
      if (!this.edgeShape_) {
        // Include corner radius in drawing the horizontal line.
        steps.push('H', cursorX - Blockly.BlockSvg.CORNER_RADIUS - this.edgeShapeWidth_);
        steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
      } else {
        // Don't include corner radius - no corner (edge shape drawn).
        steps.push('H', cursorX - this.edgeShapeWidth_);
      }
      // Subtract CORNER_RADIUS * 2 to account for the top right corner
      // and also the bottom right corner. Only move vertically the non-corner length.
      if (!this.edgeShape_) {
        steps.push('v', row.height - Blockly.BlockSvg.CORNER_RADIUS * 2);
      }
    } else if (row.type == Blockly.NEXT_STATEMENT) {
      // Nested statement.
      var input = row[0];
      var fieldX = cursorX;
      // Align fields vertically within the row.
      // In renderFields_, the field is further centered by its own height.
      var fieldY = cursorY;
      fieldY += Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
      this.renderFields_(input.fieldRow, fieldX, fieldY);
      // Move to the start of the notch.
      cursorX = inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH;

      if (this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE) {
        this.renderDefineBlock_(steps, inputRows, input, row, cursorY);
      } else {
        Blockly.BlockSvg.drawStatementInputFromTopRight_(steps, cursorX,
            inputRows.rightEdge, row);
      }

      // Create statement connection.
      connectionX = this.RTL ? -cursorX : cursorX;
      input.connection.setOffsetInBlock(connectionX, cursorY);
      if (input.connection.isConnected()) {
        this.width = Math.max(this.width, inputRows.statementEdge +
          input.connection.targetBlock().getHeightWidth().width);
      }
      if (this.type != Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE &&
        (y == inputRows.length - 1 ||
          inputRows[y + 1].type == Blockly.NEXT_STATEMENT)) {
        // If the final input is a statement stack, add a small row underneath.
        // Consecutive statement stacks are also separated by a small divider.
        steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
        steps.push('v', Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y - 2 * Blockly.BlockSvg.CORNER_RADIUS);
        cursorY += Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y;
      }
    }
    cursorY += row.height;
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  }
  this.drawEdgeShapeRight_(steps);
  if (!inputRows.length) {
    cursorY = Blockly.BlockSvg.MIN_BLOCK_Y;
    steps.push('V', cursorY);
  }
<<<<<<< HEAD
  if (this.edgeShape_ && this.inputList.find(v => v.type == Blockly.NEXT_STATEMENT)) steps[1] = `m ${cursorY / 2} 0`
=======
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  return cursorY;
};

/**
 * Render the input shapes.
 * If there's a connected block, hide the input shape.
 * Otherwise, draw and set the position of the input shape.
 * @param {!Blockly.Input} input Input to be rendered.
 * @param {Number} x X offset of input.
 * @param {Number} y Y offset of input.
 */
Blockly.BlockSvg.prototype.renderInputShape_ = function(input, x, y) {
  var inputShape = input.outlinePath;
  if (!inputShape) {
    // No input shape for this input - e.g., the block is an insertion marker.
    return;
  }
  // Input shapes are only visibly rendered on non-connected slots.
  if (input.connection.targetConnection) {
    inputShape.setAttribute('style', 'visibility: hidden');
  } else {
    var inputShapeX = 0, inputShapeY = 0;
    var inputShapeInfo =
        Blockly.BlockSvg.getInputShapeInfo_(input.connection.getOutputShape());
    if (this.RTL) {
      inputShapeX = -x - inputShapeInfo.width;
    } else {
      inputShapeX = x;
    }
    inputShapeY = y - (Blockly.BlockSvg.INPUT_SHAPE_HEIGHT / 2);
    inputShape.setAttribute('d', inputShapeInfo.path);
    inputShape.setAttribute('transform',
        'translate(' + inputShapeX + ',' + inputShapeY + ')');
    inputShape.setAttribute('data-argument-type', inputShapeInfo.argType);
    inputShape.setAttribute('style', 'visibility: visible');
  }
};

/**
 * Render the bottom edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} cursorY Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawBottom_ = function(steps, cursorY) {
  this.height = cursorY;
<<<<<<< HEAD
  if (!this.edgeShape_ || this.inputList.find(v => v.type == Blockly.NEXT_STATEMENT)) {
=======
  if (!this.edgeShape_) {
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    steps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER);
  }
  if (this.nextConnection) {
    // Move to the right-side of the notch.
    var notchStart = (
      Blockly.BlockSvg.NOTCH_WIDTH +
      Blockly.BlockSvg.NOTCH_START_PADDING +
      Blockly.BlockSvg.CORNER_RADIUS
    );
    steps.push('H', notchStart, ' ');
<<<<<<< HEAD
 
    // if we have a custom check that corresponds to a custom notch, use it
    const checkStatement = (this.nextConnection.check_ || [])[0];
    const customNotch = Blockly.BlockSvg.CUSTOM_NOTCHES.get(checkStatement);
    if (customNotch) steps.push(customNotch.right);
    else steps.push(Blockly.BlockSvg.NOTCH_PATH_RIGHT);

=======
    steps.push(Blockly.BlockSvg.NOTCH_PATH_RIGHT);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    // Create next block connection.
    var connectionX = this.RTL ? -Blockly.BlockSvg.NOTCH_WIDTH :
        Blockly.BlockSvg.NOTCH_WIDTH;
    this.nextConnection.setOffsetInBlock(connectionX, cursorY);
    // Include height of notch in block height.
    this.height += Blockly.BlockSvg.NOTCH_HEIGHT;
  }
  // Bottom horizontal line
  if (!this.edgeShape_) {
    steps.push('H', Blockly.BlockSvg.CORNER_RADIUS);
    // Bottom left corner
    steps.push(Blockly.BlockSvg.BOTTOM_LEFT_CORNER);
  } else {
<<<<<<< HEAD
    steps.push('H', this.height / 2);
  }
};

Blockly.BlockSvg.prototype.outputLeftPadding_ = function() {
  if (!this.outputConnection) return 0;
  const shape = this.getOutputShape();

  switch (shape) {
    case Blockly.OUTPUT_SHAPE_PLUS: {
      if (this.inputList.find(v => v.type == Blockly.NEXT_STATEMENT)) {
        const paddingMultiplier = Blockly.BlockSvg.SEP_SPACE_Y / 2 / Blockly.BlockSvg.GRID_UNIT;
        const unit = 6 * paddingMultiplier;
        return -this.height / 2 + unit * 3;
      }
    }
    default: {
      const customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(this.edgeShape_);
      if (customShape && customShape.outputLeftPadding) {
        return customShape.outputLeftPadding(this)
      }
    }
  }

  return 0;
}

=======
    steps.push('H', this.edgeShapeWidth_);
  }
};

>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
/**
 * Render the left edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} cursorY Height of block.
 * @private
 */
<<<<<<< HEAD
Blockly.BlockSvg.prototype.renderDrawLeft_ = function(steps, cursorY) {
  let scale = this.height / 2

  if (this.outputConnection) {
    // Scratch-style reporters have output connection y at half block height.
    this.outputConnection.setOffsetInBlock(-this.outputLeftPadding_(), this.height / 2);
  }
  if (this.edgeShape_) {
    // Draw the left-side edge shape.
    switch (this.edgeShape_) {
      case Blockly.OUTPUT_SHAPE_ROUND:
        // Draw a rounded arc.
        steps.push('a ' + scale + ' ' + scale + ' 0 0 1 0 -' + scale * 2);
        break;
      case Blockly.OUTPUT_SHAPE_HEXAGONAL:
        // Draw a half-hexagon.
        steps.push('l ' + -scale + ' ' + -scale +
          ' l ' + scale + ' ' + -scale);
        break;
      case Blockly.OUTPUT_SHAPE_LEAF:
        // Draw a half-leaf.
        steps.push(
          `a ${scale} ${scale} 0 0 1 -${scale} -${scale} ` +
          `l 0 -${scale * 0.6} ` +
          `a ${scale * 0.4} ${scale * 0.4} 0 0 1 ${scale * 0.4} -${scale * 0.4}`
        );
        break;
      case Blockly.OUTPUT_SHAPE_PLUS: {
        // Draw a half-plus.
        const paddingMultiplier = Blockly.BlockSvg.SEP_SPACE_Y / 2 / Blockly.BlockSvg.GRID_UNIT;
        const unit = 6 * paddingMultiplier;
        const remainingHeight = scale * 2 - 36 * paddingMultiplier;
        const remainingWidth = scale - 20 * paddingMultiplier;
        const hasBranch = this.inputList.find(v => v.type == Blockly.NEXT_STATEMENT)
        if (!hasBranch) steps.push(`l ${-remainingWidth} 0 `)
        steps.push(
          `a ${unit} ${unit} 0 0 1 ${-unit} ${-unit} ` +
          `a ${unit} ${unit} 0 0 0 ${-unit} ${-unit} ` +
          `l -2 0 ` +
          `a ${unit} ${unit} 0 0 1 ${-unit} ${-unit} ` +
          `l 0 ${-remainingHeight} ` +
          `a ${unit} ${unit} 0 0 1 ${unit} ${-unit} ` +
          `l 2 0 ` +
          `a ${unit} ${unit} 0 0 0 ${unit} ${-unit} ` +
          `a ${unit} ${unit} 0 0 1 ${unit} ${-unit} `
        );
        if (!hasBranch) steps.push(`l ${remainingWidth} 0 `)
        break;
      }
      default: {
        const customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(this.edgeShape_);
        if (customShape) {
          const path = customShape.leftPath(this);
          if (path && Array.isArray(path)) steps.push(...path);
          else console.error(`Left Path Function for shape: ${this.edgeShape_} did not return an Array!`);
        }
      }
=======
Blockly.BlockSvg.prototype.renderDrawLeft_ = function(steps) {
  if (this.outputConnection) {
    // Scratch-style reporters have output connection y at half block height.
    this.outputConnection.setOffsetInBlock(0, this.height / 2);
  }
  if (this.edgeShape_) {
    // Draw the left-side edge shape.
    if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_ROUND) {
      // Draw a rounded arc.
      steps.push('a ' + this.edgeShapeWidth_ + ' ' + this.edgeShapeWidth_ + ' 0 0 1 0 -' + this.edgeShapeWidth_ * 2);
    } else if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      // Draw a half-hexagon.
      steps.push('l ' + -this.edgeShapeWidth_ + ' ' + -this.edgeShapeWidth_ +
        ' l ' + this.edgeShapeWidth_ + ' ' + -this.edgeShapeWidth_);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    }
  }
  steps.push('z');
};

/**
 * Draw the edge shape (rounded or hexagonal) on the right side of a block with
 * an output.
 * @param {!Array.<string>} steps Path of block outline.
 * @private
 */
Blockly.BlockSvg.prototype.drawEdgeShapeRight_ = function(steps) {
<<<<<<< HEAD
  if (this.edgeShape_ && !this.inputList.find(v => v.type == Blockly.NEXT_STATEMENT)) {
    // Draw the right-side edge shape.
    switch (this.edgeShape_) {
      case Blockly.OUTPUT_SHAPE_ROUND:
        // Draw a rounded arc.
        steps.push('a ' + this.edgeShapeWidth_ + ' ' + this.edgeShapeWidth_ +
          ' 0 0 1 0 ' + this.edgeShapeWidth_ * 2);
        break;
      case Blockly.OUTPUT_SHAPE_HEXAGONAL:
        // Draw a half-hexagon.
        steps.push('l ' + this.edgeShapeWidth_ + ' ' + this.edgeShapeWidth_ +
          ' l ' + -this.edgeShapeWidth_ + ' ' + this.edgeShapeWidth_);
        break;
      case Blockly.OUTPUT_SHAPE_LEAF:
        // Draw a half-leaf.
        steps.push(
          `a ${this.edgeShapeWidth_} ${this.edgeShapeWidth_} 0 0 1 ${this.edgeShapeWidth_} ${this.edgeShapeWidth_} ` +
          `l 0 ${this.edgeShapeWidth_ * 0.6} ` +
          `a ${this.edgeShapeWidth_ * 0.4} ${this.edgeShapeWidth_ * 0.4} 0 0 1 -${this.edgeShapeWidth_ * 0.4} ${this.edgeShapeWidth_ * 0.4}`
        );
        break;
      case Blockly.OUTPUT_SHAPE_PLUS: {
        // Draw a half-plus.
        const paddingMultiplier = Blockly.BlockSvg.SEP_SPACE_Y / 2 / Blockly.BlockSvg.GRID_UNIT;
        const unit = 6 * paddingMultiplier;
        const remainingHeight = this.edgeShapeWidth_ * 2 - 36 * paddingMultiplier;
        const remainingWidth = this.edgeShapeWidth_ - 20 * paddingMultiplier;
        steps.push(
          `l ${remainingWidth} 0 ` +
          `a ${unit} ${unit} 0 0 1 ${unit} ${unit} ` +
          `a ${unit} ${unit} 0 0 0 ${unit} ${unit} ` +
          `l 2 0 ` +
          `a ${unit} ${unit} 0 0 1 ${unit} ${unit} ` +
          `l 0 ${remainingHeight} ` +
          `a ${unit} ${unit} 0 0 1 ${-unit} ${unit} ` +
          `l -2 0 ` +
          `a ${unit} ${unit} 0 0 0 ${-unit} ${unit} ` +
          `a ${unit} ${unit} 0 0 1 ${-unit} ${unit} ` +
          `l ${-remainingWidth} 0`
        );
        break;
      }
      default: {
        const customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(this.edgeShape_);
        if (customShape) {
          const path = customShape.rightPath(this);
          if (path && Array.isArray(path)) steps.push(...path);
          else console.error(`Right Path Function for shape: ${this.edgeShape_} did not return an Array!`);
        }
      }
=======
  if (this.edgeShape_) {
    // Draw the right-side edge shape.
    if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_ROUND) {
      // Draw a rounded arc.
      steps.push('a ' + this.edgeShapeWidth_ + ' ' + this.edgeShapeWidth_ +
          ' 0 0 1 0 ' + this.edgeShapeWidth_ * 2);
    } else if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      // Draw an half-hexagon.
      steps.push('l ' + this.edgeShapeWidth_ + ' ' + this.edgeShapeWidth_ +
          ' l ' + -this.edgeShapeWidth_ + ' ' + this.edgeShapeWidth_);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    }
  }
};

/**
 * Position an new block correctly, so that it doesn't move the existing block
 * when connected to it.
 * @param {!Blockly.Block} newBlock The block to position - either the first
 *     block in a dragged stack or an insertion marker.
 * @param {!Blockly.Connection} newConnection The connection on the new block's
 *     stack - either a connection on newBlock, or the last NEXT_STATEMENT
 *     connection on the stack if the stack's being dropped before another
 *     block.
 * @param {!Blockly.Connection} existingConnection The connection on the
 *     existing block, which newBlock should line up with.
 */
Blockly.BlockSvg.prototype.positionNewBlock = function(newBlock, newConnection,
    existingConnection) {
  // We only need to position the new block if it's before the existing one,
  // otherwise its position is set by the previous block.
  if (newConnection.type == Blockly.NEXT_STATEMENT) {
    var dx = existingConnection.x_ - newConnection.x_;
    var dy = existingConnection.y_ - newConnection.y_;
<<<<<<< HEAD
    if (newConnection.sourceBlock_.edgeShape_) {
      var bounds = existingConnection.sourceBlock_.getBoundingRectangle();
      dx += ((bounds.bottomRight.y - bounds.topLeft.y) / -2) + 6 * Blockly.BlockSvg.GRID_UNIT;
    }
=======
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e

    newBlock.moveBy(dx, dy);
  }
};

/**
 * Draw the outline of a statement input, starting at the top right corner.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} cursorX The x position of the start of the notch at the top
 *     of the input.
 * @param {number} rightEdge The far right edge of the block, which determines
 *     how wide the statement input is.
 * @param {!Array.<!Object>} row An object containing information about the
 *     current row, including its height and whether it should have a notch at
 *     the bottom.
 * @private
 */
Blockly.BlockSvg.drawStatementInputFromTopRight_ = function(steps, cursorX,
<<<<<<< HEAD
    rightEdge, row, block) {
  Blockly.BlockSvg.drawStatementInputTop_(steps, cursorX, row, block);
  steps.push('v', row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
  Blockly.BlockSvg.drawStatementInputBottom_(steps, rightEdge, row, block);
=======
    rightEdge, row) {
  Blockly.BlockSvg.drawStatementInputTop_(steps, cursorX);
  steps.push('v', row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
  Blockly.BlockSvg.drawStatementInputBottom_(steps, rightEdge, row);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
};

/**
 * Draw the top of the outline of a statement input, starting at the top right
 * corner.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} cursorX The x position of the start of the notch at the top
 *     of the input.
 * @private
 */
<<<<<<< HEAD
Blockly.BlockSvg.drawStatementInputTop_ = function(steps, cursorX, row, block) {
  steps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER);
  steps.push('H', cursorX + Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE +
    2 * Blockly.BlockSvg.CORNER_RADIUS + block.edgeShapeWidth_);

  // if we have a custom check that corresponds to a custom notch, use it
  const checkStatement = (row[0].connection.check_ || [])[0];
  const customNotch = Blockly.BlockSvg.CUSTOM_NOTCHES.get(checkStatement);
  if (customNotch) steps.push(customNotch.right);
  else steps.push(Blockly.BlockSvg.NOTCH_PATH_RIGHT);

=======
Blockly.BlockSvg.drawStatementInputTop_ = function(steps, cursorX) {
  steps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER);
  steps.push('H', cursorX + Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE +
    2 * Blockly.BlockSvg.CORNER_RADIUS);
  steps.push(Blockly.BlockSvg.NOTCH_PATH_RIGHT);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  steps.push('h', '-' + Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE);
  steps.push(Blockly.BlockSvg.INNER_TOP_LEFT_CORNER);
};

/**
 * Draw the bottom of the outline of a statement input, starting at the inner
 * left corner.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} rightEdge The far right edge of the block, which determines
 *     how wide the statement input is.
 * @param {!Array.<!Object>} row An object containing information about the
 *     current row, including its height and whether it should have a notch at
 *     the bottom.
 * @private
 */
<<<<<<< HEAD
Blockly.BlockSvg.drawStatementInputBottom_ = function(steps, rightEdge, row, block) {
  steps.push(Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER);
  if (row.statementNotchAtBottom) {
    steps.push('h ', Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE);

    // if we have a custom check that corresponds to a custom notch, use it
    const checkStatement = (row[0].connection.check_ || [])[0];
    const customNotch = Blockly.BlockSvg.CUSTOM_NOTCHES.get(checkStatement);
    if (customNotch) steps.push(customNotch.left);
    else steps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT);
=======
Blockly.BlockSvg.drawStatementInputBottom_ = function(steps, rightEdge, row) {
  steps.push(Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER);
  if (row.statementNotchAtBottom) {
    steps.push('h ', Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE);
    steps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  }
  steps.push('H', rightEdge - Blockly.BlockSvg.CORNER_RADIUS);
};

/**
 * Render part of the hat and the right side of the define block to fully wrap
 * the connected statement block.
 * Scratch-specific.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @param {!Blockly.Input} input The input that is currently being rendered.
 * @param {!Array.<!Object>} row An object containing information about the
 *     current row, including its height and whether it should have a notch at
 *     the bottom.
 * @param {number} cursorY The y position of the start of this row.  Used to
 *     position the following dummy input's fields.
<<<<<<< HEAD
 * @param {number} cursorX The x position of the start of this row.  Used to
 *     position the following dummy input's fields.
 * @private
 */
Blockly.BlockSvg.prototype.renderDefineBlock_ = function(steps, inputRows,
    input, row, cursorY, cursorX) {
=======
 * @private
 */
Blockly.BlockSvg.prototype.renderDefineBlock_ = function(steps, inputRows,
    input, row, cursorY) {
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  // Following text shows up as a dummy input after the statement input, which
  // we are forcing to stay inline with the statement input instead of letting
  // it drop to a new line.
  var hasFollowingText = row.length == 2;

  // Figure out where the right side of the block is.
<<<<<<< HEAD
  var rightSide;
  if (!cursorX) {
    rightSide = inputRows.rightEdge;
    if (input.connection && input.connection.targetBlock()) {
      rightSide = inputRows.statementEdge +
          input.connection.targetBlock().getHeightWidth().width +
          Blockly.BlockSvg.DEFINE_BLOCK_PADDING_RIGHT;
    } else {
      // Handles the case where block is being rendered as an insertion marker
      rightSide = Math.max(Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT, rightSide)
      + Blockly.BlockSvg.DEFINE_BLOCK_PADDING_RIGHT;
    }
    rightSide -= Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS;

    if (hasFollowingText) {
      var followingTextInput = row[1];
      var fieldStart = rightSide + 3 * Blockly.BlockSvg.SEP_SPACE_X;
      rightSide += followingTextInput.fieldRow[0].getSize().width;
      rightSide += 2 * Blockly.BlockSvg.SEP_SPACE_X;

      // Align fields vertically within the row.
      // In renderFields_, the field is further centered by its own height.
      // The dummy input's fields did not get laid out normally because we're
      // forcing them to stay inline with a statement input.
      var fieldY = cursorY;
      fieldY += Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
      this.renderFields_(followingTextInput.fieldRow, fieldStart, fieldY);
    }
  } else {
    rightSide = cursorX;
=======
  var rightSide = inputRows.rightEdge;
  if (input.connection && input.connection.targetBlock()) {
    rightSide = inputRows.statementEdge +
        input.connection.targetBlock().getHeightWidth().width +
        Blockly.BlockSvg.DEFINE_BLOCK_PADDING_RIGHT;
  } else {
    // Handles the case where block is being rendered as an insertion marker
    rightSide = Math.max(Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT, rightSide)
    + Blockly.BlockSvg.DEFINE_BLOCK_PADDING_RIGHT;
  }
  rightSide -= Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS;

  if (hasFollowingText) {
    var followingTextInput = row[1];
    var fieldStart = rightSide + 3 * Blockly.BlockSvg.SEP_SPACE_X;
    rightSide += followingTextInput.fieldRow[0].getSize().width;
    rightSide += 2 * Blockly.BlockSvg.SEP_SPACE_X;

    // Align fields vertically within the row.
    // In renderFields_, the field is further centered by its own height.
    // The dummy input's fields did not get laid out normally because we're
    // forcing them to stay inline with a statement input.
    var fieldY = cursorY;
    fieldY += Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
    this.renderFields_(followingTextInput.fieldRow, fieldStart, fieldY);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  }
  // Draw the top and the right corner of the hat.
  steps.push('H', rightSide);
  steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER_DEFINE_HAT);
  row.height += 3 * Blockly.BlockSvg.GRID_UNIT;
  // Draw the right side of the block around the statement input.
  steps.push('v', row.height);
  // row.height will be used to update the cursor in the calling function.
  row.height += Blockly.BlockSvg.GRID_UNIT;

};

/**
 * Get some information about the input shape to draw, based on the type of the
 * connection.
 * @param {number} shape An enum representing the shape of the connection we're
 *     drawing around.
 * @return {!Object} An object containing an SVG path, a string representation
 *     of the argument type, and a width.
 * @private
 */
Blockly.BlockSvg.getInputShapeInfo_ = function(shape) {
  var inputShapePath = null;
  var inputShapeArgType = null;
  var inputShapeWidth = 0;

  switch (shape) {
<<<<<<< HEAD
    case Blockly.OUTPUT_SHAPE_PLUS:
      inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_PLUS;
      inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_PLUS_WIDTH;
      inputShapeArgType = 'plus';
      break;
    case Blockly.OUTPUT_SHAPE_LEAF:
      inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_LEAF;
      inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_LEAF_WIDTH;
      inputShapeArgType = 'leaf';
      break;
=======
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
    case Blockly.OUTPUT_SHAPE_HEXAGONAL:
      inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL;
      inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL_WIDTH;
      inputShapeArgType = 'boolean';
      break;
    case Blockly.OUTPUT_SHAPE_ROUND:
      inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_ROUND;
      inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_ROUND_WIDTH;
      inputShapeArgType = 'round';
      break;
    case Blockly.OUTPUT_SHAPE_SQUARE:
<<<<<<< HEAD
    default: {
      // this could be a custom shape
      const customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(shape);
      if (shape !== Blockly.OUTPUT_SHAPE_SQUARE && customShape) {
        inputShapePath = customShape.emptyInputPath;
        inputShapeWidth = customShape.emptyInputWidth;
        inputShapeArgType = customShape.name;
      } else {
        // If the input connection is not connected, draw a hole shape.
        inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_SQUARE;
        inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH;
        inputShapeArgType = 'square';
      }
      break;
    }
=======
    default:  // If the input connection is not connected, draw a hole shape.
      inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_SQUARE;
      inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH;
      inputShapeArgType = 'square';
      break;
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  }
  return {
    path: inputShapePath,
    argType: inputShapeArgType,
    width: inputShapeWidth
  };
};

/**
 * Get the correct cursor position for the given input, based on alignment,
 * the total size of the block, and the size of the input.
 * @param {number} cursorX The minimum x value of the cursor.
 * @param {!Blockly.Input} input The input to align the fields for.
 * @param {number} rightEdge The maximum width of the block.  Right-aligned
 *     fields are positioned based on this number.
 * @return {number} The new cursor position.
 * @private
 */
Blockly.BlockSvg.getAlignedCursor_ = function(cursorX, input, rightEdge) {
  // Align inline field rows (left/right/centre).
  if (input.align === Blockly.ALIGN_RIGHT) {
<<<<<<< HEAD
    const SEP_SPACE = 2 * Blockly.BlockSvg.SEP_SPACE_X;
    const offsetAmt = rightEdge - input.fieldWidth - SEP_SPACE;
    cursorX += offsetAmt;

    // fix incorrect width calculations for mega-chin blocks
    // ie, branched blocks with labels and/or inputs on the end branch
    const srcInputList = input.sourceBlock_.inputList;
    const inputIndex = srcInputList.indexOf(input);
    const lastBranchIndex = srcInputList.findLastIndex((i) => i.type === Blockly.NEXT_STATEMENT);
    const subInputs = srcInputList.slice(lastBranchIndex + 1, inputIndex);

    if (subInputs.length) {
      // measure the widths of the fields in the block row and subtract it
      // from cursorX. Without this, the row width will be doubled.
      const backOffset = subInputs.reduce((acc, cur) => {
        let amt = cur.fieldWidth;
        if (cur.connection) {
          const block = cur.connection.targetBlock();
          if (block) amt += block.width + SEP_SPACE;
          else amt += Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X + SEP_SPACE;
        }
        return acc + amt;
      }, 0);

      cursorX -= Math.min(backOffset, offsetAmt);
    }
=======
    cursorX += rightEdge - input.fieldWidth -
      (2 * Blockly.BlockSvg.SEP_SPACE_X);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  } else if (input.align === Blockly.ALIGN_CENTRE) {
    cursorX = Math.max(cursorX, rightEdge / 2 - input.fieldWidth / 2);
  }
  return cursorX;
};

/**
 * Update all of the connections on this block with the new locaitons calculated
 * in renderCompute, and move all of the connected blocks based on the new
 * connection locations.
 * @private
 */
Blockly.BlockSvg.prototype.renderMoveConnections_ = function() {
  var blockTL = this.getRelativeToSurfaceXY();
<<<<<<< HEAD
  var branchedReporterTL = blockTL.clone().translate(this.edgeShapeWidth_, 0);
=======
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
  // Don't tighten previous or output connections because they are inferior.
  if (this.previousConnection) {
    this.previousConnection.moveToOffset(blockTL);
  }
  if (this.outputConnection) {
    this.outputConnection.moveToOffset(blockTL);
  }

  for (var i = 0; i < this.inputList.length; i++) {
    var conn = this.inputList[i].connection;
    if (conn) {
<<<<<<< HEAD
      conn.moveToOffset(this.inputList[i].type == Blockly.NEXT_STATEMENT ? branchedReporterTL : blockTL);
=======
      conn.moveToOffset(blockTL);
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
      if (conn.isConnected()) {
        conn.tighten_();
      }
    }
  }

  if (this.nextConnection) {
    this.nextConnection.moveToOffset(blockTL);
    if (this.nextConnection.isConnected()) {
      this.nextConnection.tighten_();
    }
  }
};
<<<<<<< HEAD

/* -= Custom Block Notch API =- */
// utility functions
Blockly.BlockSvg.CUSTOM_NOTCH_UTIL = {
  supportedCommands: { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7 },
  commandXpos: { m: [0], l: [0], h: [0], c: [0, 2, 4], s: [0, 2], q: [0, 2], t: [0], a: [5] },
  path2TokenList: (pathStr) => {
    return pathStr.match(/[a-z]|-?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
  },
  validateSVGPath: (pathStr) => {
    const util = Blockly.BlockSvg.CUSTOM_NOTCH_UTIL;
    const tokens = util.path2TokenList(pathStr);
    let i = 0;
    while (i < tokens.length) {
      const cmd = tokens[i++];
      const expected = util.supportedCommands[cmd];
      if (expected === undefined) throw new Error(`Unsupported or invalid command '${cmd}'`);
      while (i + expected <= tokens.length && !/^[a-z]$/.test(tokens[i])) {
        for (let j = 0; j < expected; j++) {
          if (!/^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(tokens[i + j])) {
            throw new Error(`Invalid number '${tokens[i + j]}' in '${cmd}' command`);
          }
        }
        i += expected;
      }
    }
    return true;
  },
  flipPathX: (pathStr) => {
    const util = Blockly.BlockSvg.CUSTOM_NOTCH_UTIL;
    const tokens = util.path2TokenList(pathStr);
    let i = 0, result = [];
    while (i < tokens.length) {
      const cmd = tokens[i++];
      result.push(cmd);
      const expected = util.supportedCommands[cmd];
      while (i + expected <= tokens.length && !/^[a-z]$/.test(tokens[i])) {
        const group = [];
        if (cmd === 'a') {
          // Arc: rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
          group.push(
            parseFloat(tokens[i]), parseFloat(tokens[i + 1]),
            parseFloat(tokens[i + 2]), parseInt(tokens[i + 3]),
            1 - parseInt(tokens[i + 4]),
            -parseFloat(tokens[i + 5]), parseFloat(tokens[i + 6])
          );
        } else {
          const xIndexes = util.commandXpos[cmd] || [];
          for (let j = 0; j < expected; j++) {
            let val = parseFloat(tokens[i + j]);
            if (xIndexes.includes(j)) val = -val;
            group.push(val);
          }
        }
        result.push(...group);
        i += expected;
      }
    }
    return result.join(' ');
  }
};

// Stores all user-defined custom shapes
Blockly.BlockSvg.CUSTOM_NOTCHES = new Map([]);

/**
 * Register a custom block notch
 * @param {string} name The name used to identify the custom notch
 * @param {string} path SVG Path that resembles the notch
 */
Blockly.BlockSvg.registerCustomNotch = function(name, path) {
  if (!name || typeof path !== 'string') {
    console.error([
      `Registration for Notch '${name}' failed`,
      "Param 2 must be a SVG path",
      "Use 'BlockSvg.NOTCH_PATH_LEFT' as a reference"
    ].join("\n"));
    return;
  }

  try {
    const util = Blockly.BlockSvg.CUSTOM_NOTCH_UTIL;
    if (util.validateSVGPath(path)) Blockly.BlockSvg.CUSTOM_NOTCHES.set(String(name), {
      left: path, right: util.flipPathX(path)
    });
  } catch (err) {
    // svg path was probably Invalid
    console.error(err);
  }
};

// Preset custom notches
Blockly.BlockSvg.registerCustomNotch("switchCase", `c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 c 2 0 4 -4 6 -4 c 2 0 4 4 6 4 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2`);
Blockly.BlockSvg.registerCustomNotch("jigsaw", `l 9 0 c 2 0 4 1 4 2 c 0 2 -4 1 -4 4 c 0 1 2 2 4 2 h 10 c 2 0 4 -1 4 -2 c 0 -3 -4 -2 -4 -4 c 0 -1 2 -2 4 -2 l 9 0`);
Blockly.BlockSvg.registerCustomNotch("hexagon", `l 6 0 c 1 0 2 1 2 2 l 0 2 l 10 6 l 10 -6 l 0 -2 c 0 -1 1 -2 2 -2 l 6 0`);
Blockly.BlockSvg.registerCustomNotch("round", `l 4 0 c 2 0 4 2 4 4 c 2 9 18 9 20 0 c 0 -2 2 -4 4 -4 l 4 0`);
Blockly.BlockSvg.registerCustomNotch("square", `l 2 0 c 1 0 2 1 2 2 l 0 4 c 0 1 1 2 2 2 h 24 c 1 0 2 -1 2 -2 l 0 -4 c 0 -1 1 -2 2 -2 l 2 0`);
Blockly.BlockSvg.registerCustomNotch("leaf", `l 5 0 c 1 0 2 1 3 2 l 4 4 c 4 4 8 4 12 0 l 4 -4 c 1 -1 2 -2 3 -2 l 5 0`);
Blockly.BlockSvg.registerCustomNotch("plus", `l 6 0 c 1 0 2 1 2 2 c 0 1 1 2 2 2 l 2 0 c 1 0 2 1 2 2 c 0 1 1 2 2 2 l 4 0 c 1 0 2 -1 2 -2 c 0 -1 1 -2 2 -2 l 2 0 c 1 0 2 -1 2 -2 c 0 -1 1 -2 2 -2 l 6 0`);
Blockly.BlockSvg.registerCustomNotch("octagonal", `l 6 0 c 1 0 2 1 2 2 l 0 2 l 5 5 l 10 0 l 5 -5 l 0 -2 c 0 -1 1 -2 2 -2 l 6 0`);
Blockly.BlockSvg.registerCustomNotch("bumped", `l 6 0 c 1 0 2 1 2 2 l 0 2 c 0 6 10 6 10 0 c 0 6 10 6 10 0 l 0 -2 c 0 -1 1 -2 2 -2 l 6 0`);
Blockly.BlockSvg.registerCustomNotch("indented", `l 6 0 c 1 0 2 1 2 2 l 0 6 l 10 -5 l 10 5 l 0 -6 c 0 -1 1 -2 2 -2 l 6 0`);
Blockly.BlockSvg.registerCustomNotch("scrapped", `l 6 0 c 1 0 2 1 2 2 l 0 5 l 4 -2 l 1 -2 l 1 3 l 8 0 l 1 -3 l 1 2 l 4 2 l 0 -5 c 0 -1 1 -2 2 -2 l 6 0`);
Blockly.BlockSvg.registerCustomNotch("arrow", `l 7 0 c 1 0 2 1 2 2 c 0 1 -1 2 -2 2 l -5 0 l 12 3 c 4 1 4 1 8 0 l 12 -3 l -5 0 c -1 0 -2 -1 -2 -2 c 0 -1 1 -2 2 -2 l 7 0`);
Blockly.BlockSvg.registerCustomNotch("ticket", `l 6 0 c 1 0 2 1 2 2 l 0 6 l 8 0 l 0 -4 c 0 -3 4 -3 4 0 l 0 4 l 8 0 l 0 -6 c 0 -1 1 -2 2 -2 l 6 0`);
Blockly.BlockSvg.registerCustomNotch("pincer", `c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 l 1 0 l 0 -2 l -1 0 c -2 0 -3 -2 -4 -3 l 5 1 l 5 -2 l 5 2 l 5 -1 c -1 1 -2 3 -4 3 l -1 0 l 0 2 l 1 0 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2`);
Blockly.BlockSvg.registerCustomNotch("inverted", `c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 h 12 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2`);

/* -= Custom Block Shape API =- */
// Stores all user-defined custom shapes
Blockly.BlockSvg.CUSTOM_SHAPES = new Map([
  /* pre-made shapes */
  // NOTE: the keys should be numbers, see src/extension-support/block-shape in VM
  // Reference: boolean shape -> m 16 0 h 16 (rightPath) l 16 16 l -16 16 h -16 (leftPath) l -16 -16 l 16 -16 z
  [Blockly.OUTPUT_SHAPE_OCTAGONAL, {
    emptyInputPath: "M 8 0 h 32 l 8 8 l 0 16 l -8 8 h -32 l -8 -8 l 0 -16 l 8 -8 z",
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    leftPath: (block) => {
      const scale = block.height / 2;
      return [`l ${-scale / 2} 0 l ${-scale / 2} ${-scale / 2} l 0 ${-scale} l ${scale / 2} ${-scale / 2} l ${scale / 2} 0`];
    },
    rightPath: (block) => {
      const scale = block.edgeShapeWidth_;
      return [`l ${scale / 2} 0 l ${scale / 2} ${scale / 2} l 0 ${scale} l ${-scale / 2} ${scale / 2} l ${-scale / 2} 0`];
    },
  }],
  [Blockly.OUTPUT_SHAPE_BUMPED, {
    emptyInputPath: "M 8 0 h 32 a 1 1 0 0 1 0 16 a 1 1 0 0 1 0 16 h -32 a 1 1 0 0 1 0 -16 a 1 1 0 0 1 0 -16 z",
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    leftPath: (block) => {
      const scale = block.height / 2;
      return [`h ${scale / -3} a 1 1 0 0 1 0 ${-scale} a 1 1 0 0 1 0 ${-scale} h ${scale / 3}`];
    },
    rightPath: (block) => {
      const scale = block.edgeShapeWidth_;
      return [`h ${scale / 3} a 1 1 0 0 1 0 ${scale} a 1 1 0 0 1 0 ${scale} h ${scale / -3}`];
    },
    blockPaddingStart: (_, _2, _3, _4, row) => {
      return (row.height - 4) / 2;
    },
    blockPaddingEnd: (_, _2, _3, _4, row) => {
      return (row.height - 4) / 2;
    }
  }],
  [Blockly.OUTPUT_SHAPE_INDENTED, {
    emptyInputPath: "M 16 0 h 16 h 16 l -16 16 l 16 16 h -16 h -16 h -16 l 16 -16 l -16 -16 z",
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    leftPath: (block) => {
      const scale = block.height / 2;
      return [`h ${-scale} l ${scale} ${-scale} l ${-scale} ${-scale} h ${scale}`];
    },
    rightPath: (block) => {
      const scale = block.edgeShapeWidth_;
      return [`h ${scale} l ${-scale} ${scale} l ${scale} ${scale} h ${-scale}`];
    },
    blockPaddingStart: (_, _2, _3, _4, row) => {
      return (row.height - 8) / 2;
    },
    blockPaddingEnd: (_, _2, _3, _4, row) => {
      return (row.height - 8) / 2;
    }
  }],
  [Blockly.OUTPUT_SHAPE_SCRAPPED, {
    emptyInputPath: "M 16 0 h 16 h 16 l -6 10 l -4 1 l 4 2 v 6 l -4 2 l 4 1 l 6 10 h -16 h -16 h -16 l 6 -10 l 4 -1 l -4 -2 v -6 l 4 -2 l -4 -1 l -6 -10 z",
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    leftPath: (block) => {
      const scale = block.height / 2;
      const s = scale / 16;
      return [
        `h ${-16 * s}`,
        `l ${6 * s} ${-10 * s}`,
        `l ${4 * s} ${-1 * s}`,
        `l ${-4 * s} ${-2 * s}`,
        `v ${-6 * s}`,
        `l ${4 * s} ${-2 * s}`,
        `l ${-4 * s} ${-1 * s}`,
        `l ${-6 * s} ${-10 * s}`,
      ];
    },
    rightPath: (block) => {
      const scale = block.edgeShapeWidth_;
      const s = scale / 16;
      return [
        `h ${16 * s}`,
        `l ${-6 * s} ${10 * s}`,
        `l ${-4 * s} ${1 * s}`,
        `l ${4 * s} ${2 * s}`,
        `v ${6 * s}`,
        `l ${-4 * s} ${2 * s}`,
        `l ${4 * s} ${1 * s}`,
        `l ${6 * s} ${10 * s}`,
        `h ${-16 * s}`,
      ];
    },
    blockPaddingStart: (_, __, firstInput) => {
      return Math.max(((firstInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER)) / 3, 0);
    },
    blockPaddingEnd: (_, __, lastInput) => {
      return Math.max(((lastInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER)) / 3, 0);
    },
  }],
  [Blockly.OUTPUT_SHAPE_ARROW, {
    emptyInputPath: "M 16 0 h 16 c 0.059 0 0.1175 0.0014 0.1758 0.0042 c 0.6594 -0.0042 1.7729 -0.0042 3.2858 0.9866 l 13.0645 11.9969 c 0.1287 0.0979 0.2521 0.2057 0.3696 0.3231 c 0.4447 0.4447 0.7494 0.9762 0.9143 1.5401 l 0.0454 0.0755 l -0.0123 0.0452 c 0.0757 0.297 0.1133 0.6017 0.1126 0.9064 c 0.0007 0.3047 -0.0369 0.6093 -0.1126 0.9063 l 0.0123 0.0452 l -0.0454 0.0755 c -0.1649 0.5638 -0.4695 1.0954 -0.9143 1.5401 c -0.1175 0.1175 -0.241 0.2252 -0.3696 0.3231 l -13.0645 11.9969 c -0.9561 0.9699 -3.0641 1.2348 -3.4616 1.2349 h -16 h -12.2464 c -0.6168 0 -1.1976 -0.1543 -1.7058 -0.4265 l -0.0742 -0.0397 l -0.0567 -0.0341 c -0.4474 -0.2641 -0.8331 -0.6217 -1.1301 -1.046 c -0.7213 -0.9079 -0.9437 -2.082 -0.6674 -3.1542 l 0.0166 -0.0623 l 0.024 -0.0822 c 0.167 -0.5518 0.4684 -1.0716 0.9047 -1.5078 l 10.6386 -9.7693 l -10.6386 -9.7693 c -0.4362 -0.4362 -0.7377 -0.9559 -0.9047 -1.5078 l -0.0245 -0.0877 l -0.0161 -0.0568 c -0.3091 -1.1994 0.006 -2.5264 0.9451 -3.4655 c 0.8871 -0.8871 2.217 -0.9908 3.2649 -0.9908 h 11.6706 z",
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    leftPath: (block) => {
      const scale = block.height / 2;
      const s = scale / 16;
      return [
        `h ${-12.2464 * s}`,
        `c ${-0.6168 * s} 0 ${-1.1976 * s} ${-0.1543 * s} ${-1.7058 * s} ${-0.4265 * s}`,
        `l ${-0.0742 * s} ${-0.0397 * s}`,
        `l ${-0.0567 * s} ${-0.0341 * s}`,
        `c ${-0.4474 * s} ${-0.2641 * s} ${-0.8331 * s} ${-0.6217 * s} ${-1.1301 * s} ${-1.046 * s}`,
        `c ${-0.7213 * s} ${-0.9079 * s} ${-0.9437 * s} ${-2.082 * s} ${-0.6674 * s} ${-3.1542 * s}`,
        `l ${0.0166 * s} ${-0.0623 * s}`,
        `l ${0.024 * s} ${-0.0822 * s}`,
        `c ${0.167 * s} ${-0.5518 * s} ${0.4684 * s} ${-1.0716 * s} ${0.9047 * s} ${-1.5078 * s}`,
        `l ${10.6386 * s} ${-9.7693 * s}`,
        `l ${-10.6386 * s} ${-9.7693 * s}`,
        `c ${-0.4362 * s} ${-0.4362 * s} ${-0.7377 * s} ${-0.9559 * s} ${-0.9047 * s} ${-1.5078 * s}`,
        `l ${-0.0245 * s} ${-0.0877 * s}`,
        `l ${-0.0161 * s} ${-0.0568 * s}`,
        `c ${-0.3091 * s} ${-1.1994 * s} ${0.006 * s} ${-2.5264 * s} ${0.9451 * s} ${-3.4655 * s}`,
        `c ${0.8871 * s} ${-0.8871 * s} ${2.217 * s} ${-0.9908 * s} ${3.2649 * s} ${-0.9908 * s}`,
        `h ${11.6706 * s}`,
      ];
    },
    rightPath: (block) => {
      const scale = block.edgeShapeWidth_;
      const s = scale / 16;
      return [
        `c ${0.059 * s} 0 ${0.1175 * s} ${0.0014 * s} ${0.1758 * s} ${0.0042 * s}`,
        `c ${0.6594 * s} ${-0.0042 * s} ${1.7729 * s} ${-0.0042 * s} ${3.2858 * s} ${0.9866 * s}`,
        `l ${13.0645 * s} ${11.9969 * s}`,
        `c ${0.1287 * s} ${0.0979 * s} ${0.2521 * s} ${0.2057 * s} ${0.3696 * s} ${0.3231 * s}`,
        `c ${0.4447 * s} ${0.4447 * s} ${0.7494 * s} ${0.9762 * s} ${0.9143 * s} ${1.5401 * s}`,
        `l ${0.0454 * s} ${0.0755 * s}`,
        `l ${-0.0123 * s} ${0.0452 * s}`,
        `c ${0.0757 * s} ${0.297 * s} ${0.1133 * s} ${0.6017 * s} ${0.1126 * s} ${0.9064 * s}`,
        `c ${0.0007 * s} ${0.3047 * s} ${-0.0369 * s} ${0.6093 * s} ${-0.1126 * s} ${0.9063 * s}`,
        `l ${0.0123 * s} ${0.0452 * s}`,
        `l ${-0.0454 * s} ${0.0755 * s}`,
        `c ${-0.1649 * s} ${0.5638 * s} ${-0.4695 * s} ${1.0954 * s} ${-0.9143 * s} ${1.5401 * s}`,
        `c ${-0.1175 * s} ${0.1175 * s} ${-0.241 * s} ${0.2252 * s} ${-0.3696 * s} ${0.3231 * s}`,
        `l ${-13.0645 * s} ${11.9969 * s}`,
        `c ${-0.9561 * s} ${0.9699 * s} ${-3.0641 * s} ${1.2348 * s} ${-3.4616 * s} ${1.2349 * s}`,
      ];
    },
    blockPaddingStart: (_, __, firstInput) => {
      return Math.max(((firstInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER)) / 2, 0) + 4;
    },
    blockPaddingEnd: (_, __, lastInput) => {
      return Math.max(((lastInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER)) / 2, 0) + 4;
    },
  }],
  [Blockly.OUTPUT_SHAPE_TICKET, {
    emptyInputPath: "m 0 0 m 15 0 H 46 z L 2 0 A 2 2 0 0 0 0 2 L 0 8 A 2 2 0 0 0 2 10 L 7 10 c 4 2 4 9 0 11 L 2 21 A 2 2 0 0 0 0 23 L 0 30 A 2 2 0 0 0 2 32 L 46 32 A 2 2 0 0 0 48 30 L 48 23 A 2 2 0 0 0 46 21 L 41 21 c -4 -2 -4 -9 0 -11 L 46 10 A 2 2 0 0 0 48 8 L 48 2 A 2 2 0 0 0 46 0 z",
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    // 13.4 is the height of the hole
    leftPath: (block) => {
      const w = block.height / 2;
      return [
        `h-${w - 1}`,
        `a 2 2 0 0 1 -2 -2`, // 2unit rounded
        `v-${w - (13.4 / 2) - 4}`,
        `a 2 2 0 0 1 2 -2`, // 2unit rounded
        `h10`,
        `c4 -2 4 -12 0 -${13.4}`,
        `h-10`,
        `a 2 2 0 0 1 -2 -2`, // 2unit rounded
        `v-${w - (13.4 / 2) - 4}`,
        `a 2 2 0 0 1 2 -2`, // 2unit rounded
      ];
    },
    rightPath: (block) => {
      const w = block.edgeShapeWidth_;
      return [
        `h${w}`,
        `a 2 2 0 0 1 2 2`, // 2unit rounded
        `v${w - (13.4 / 2) - 4}`,
        `a 2 2 0 0 1 -2 2`, // 2unit rounded
        `h-10`,
        `c-4 2 -4 12 0 ${13.4}`,
        `h10`,
        `a 2 2 0 0 1 2 2`, // 2unit rounded
        `v${w - (13.4 / 2) - 4}`,
        `a 2 2 0 0 1 -2 2`, // 2unit rounded
      ];
    },
  }],
]);

/**
 * Register a custom block shape
 * @param {string} name The name used to identify custom shapes
 * @param {object} shapeInfo All relative information for generating the shape (see below)
 */
/*
shapeInfo entries ==> 
{
  emptyInputPath: (string) -- SVG path for the inside of an empty input slot
  emptyInputWidth: (number) -- (optional) Default width for a empty input slot
  leftPath: (block) => { return Array } -– Returns an array of SVG path parts for the left side of the block
  rightPath: (block) => { return Array } –- Returns an array of SVG path parts for the right side of the block
  blockPadding: (object) -- (optional) Object for block-in-block padding, example format: {
    internal: {
      // padding values for each block shape as your block
      // formatted like each shape in Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING
    },
    external: {
      // padding values for your block in each block shape
      // include all keys from Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING and insert the padding as the value
    },
  }
  blockPaddingStart: (block, otherShape, firstInput, firstField, row) => { return Number } -– Returns a number adding extra padding to the start of the block in 'computeOutputPadding_', used for boolean-like shapes.
  blockPaddingEnd: (block, otherShape, lastInput, lastField, row) => { return Number } –- Returns a number adding extra padding to the end of the block in 'computeOutputPadding_', used for boolean-like shapes.
}
*/
Blockly.BlockSvg.registerCustomShape = function(name, shapeInfo) {
  if (!name || typeof shapeInfo !== 'object' || Array.isArray(shapeInfo)) {
    console.error([
      `Registration for Shape '${name}' failed`,
      "Param 2 must be a object containing:",
      "'emptyInputPath' (string) -- SVG path for the inside of an empty input slot",
      "'emptyInputWidth' (number) -- (optional) Default width for a empty input slot",
      "'leftPath' (function) -– Returns an array of SVG path parts for the left side of the block",
      "'rightPath' (function) –- Returns an array of SVG path parts for the right side of the block",
      "'blockPadding' (object) -- (optional) Object for block-in-block padding, similar to 'Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING', 'internal' entry for custom block padding, 'external' entry for other shapes padding",
      "'blockPaddingStart' (function) -- (optional) Returns a number adding extra padding to the start of the block in 'computeOutputPadding_', used for boolean-like shapes.",
      "'blockPaddingEnd' (function) -- (optional) Returns a number adding extra padding to the end of the block in 'computeOutputPadding_', used for boolean-like shapes.",
    ].join("\n"));
    return;
  }
  if (typeof shapeInfo.emptyInputPath !== "string") {
    console.error(`Registration for Shape '${name}' failed\nNo 'emptyInputPath' entry found in Param 2/invalid SVG path string`);
    return;
  }
  if (typeof shapeInfo.leftPath !== "function") {
    console.error(`Registration for Shape '${name}' failed\nNo 'leftPath' entry found in Param 2/entry is not a function`);
    return;
  }
  if (typeof shapeInfo.rightPath !== "function") {
    console.error(`Registration for Shape '${name}' failed\nNo 'rightPath' entry found in Param 2/entry is not a function`);
    return;
  }

  name = "custom-" + String(name);
  shapeInfo.name = name;

  // optional value, this default value is constant for all shapes
  if (!shapeInfo.emptyInputWidth) shapeInfo.emptyInputWidth = 12 * Blockly.BlockSvg.GRID_UNIT;

  // optional value, padding defaults to DEFAULT_SHAPE_PADDING
  if (shapeInfo.blockPadding) {
    const internalPads = shapeInfo.blockPadding.internal;
    if (typeof internalPads === "object" && !Array.isArray(internalPads)) {
      Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[name] = internalPads;
    } else {
      console.warn(`No 'internal' padding object provided in custom shape ${name}, please refer to 'ScratchBlocks.BlockSvg.SHAPE_IN_SHAPE_PADDING', for formatting`);
    }

    const externalPads = shapeInfo.blockPadding.external;
    if (typeof externalPads === "object" && !Array.isArray(externalPads)) {
      const paddingEntries = Object.entries(Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING);
      for (const shape of paddingEntries) {
        if (!externalPads[shape[0]]) continue;
        shape[1][name] = externalPads[shape[0]];
      }
    } else {
      console.warn(`No 'external' padding object provided in custom shape ${name}, please refer to 'ScratchBlocks.BlockSvg.SHAPE_IN_SHAPE_PADDING', for formatting`);
    }
  }

  // optional value, just validating it if it exists
  if (shapeInfo.blockPaddingStart && typeof shapeInfo.blockPaddingStart !== "function") {
    console.error(`Registration for Shape '${name}' failed\n'blockPaddingStart' entry found in Param 2/entry is not a function`);
    return;
  }
  if (shapeInfo.blockPaddingEnd && typeof shapeInfo.blockPaddingEnd !== "function") {
    console.error(`Registration for Shape '${name}' failed\n'blockPaddingEnd' entry found in Param 2/entry is not a function`);
    return;
  }

  Blockly.BlockSvg.CUSTOM_SHAPES.set(name, shapeInfo);
};
=======
>>>>>>> e859db9c67b2f2620bb89e0bfcbe42586ef6f48e
