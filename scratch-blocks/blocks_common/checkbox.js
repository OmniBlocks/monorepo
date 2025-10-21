/**
 * @fileoverview Checkboxes for boolean inputs.
 */
'use strict';

goog.provide('Blockly.Blocks.checkbox');

goog.require('Blockly.Blocks');

goog.require('Blockly.Colours');

goog.require('Blockly.constants');

Blockly.Blocks['checkbox'] = {
  /**
   * Block for checkbox input
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_checkbox_original",
          "name": "CHECKBOX"
        }
      ],
      "output": "Boolean",
      "outputShape": Blockly.OUTPUT_SHAPE_HEXAGONAL,
      "colour": Blockly.Colours.textField,
      "colourSecondary": Blockly.Colours.textField,
      "colourTertiary": Blockly.Colours.textField,
      "colourQuaternary": Blockly.Colours.textField
    });
  }
};