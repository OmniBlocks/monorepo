/**
 * @fileoverview Custom blocks for Blockly.
 * @author @SharkPool-SP (SharkPool)
 */
'use strict';

goog.provide('Blockly.Blocks.customInput');

goog.require('Blockly.Blocks');

goog.require('Blockly.Colours');

goog.require('Blockly.constants');

Blockly.Blocks['customInput'] = {
  /**
   * Block for custom inputs.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_customInput",
          "name": "CUSTOM"
        }
      ],
      "outputShape": Blockly.OUTPUT_SHAPE_SQUARE,
      "output": "String",
      "extensions": ["colours_pen"]
    });
  }
};
