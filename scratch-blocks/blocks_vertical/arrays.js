/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2025 AmpElectrecuted
 * All rights reserved.
 *
 * GPL-3.0.
 */

"use strict";

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

// Define message keys for localization
Blockly.Msg.ARRAYS_ITEM_OF = "item %1 of %2";
Blockly.Msg.ARRAYS_ITEM_NO_OF = "item # of %1 in %2";
Blockly.Msg.ARRAYS_CONTAINS = "%1 contains %2?";
Blockly.Msg.ARRAYS_LENGTH = "length of %1";
Blockly.Msg.ARRAYS_EMPTY_ARRAY = "empty array";
Blockly.Msg.ARRAYS_DELIMITED_TO_ARRAY = "array from %1 separated by %2";
Blockly.Msg.ARRAYS_IN_FRONT_OF = "add %1 to %2";
Blockly.Msg.ARRAYS_BEHIND = "%1 in front of %2";
Blockly.Msg.ARRAYS_AT = "insert %1 at %2 of %3";
Blockly.Msg.ARRAYS_RANGE = "list from %1 to %2";

Blockly.Blocks["arrays_item_of"] = {
    /**
     * Block for getting an item from an array.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_ITEM_OF,
            args0: [
                {
                    type: "input_value",
                    name: "INDEX",
                },
                {
                    type: "input_value",
                    name: "VALUE",
                    check: "Array",
                },
            ],
            output: null,
            extensions: ["colours_data_lists", "shape_reporter"],
        });
    },
};

Blockly.Blocks["arrays_item_no_of"] = {
    /**
     * Block for getting the index of an item in an array.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_ITEM_NO_OF,
            args0: [
                {
                    type: "input_value",
                    name: "VALUE",
                },
                {
                    type: "input_value",
                    name: "ARRAY",
                    check: "Array",
                },
            ],
            extensions: ["colours_data_lists", "output_number"],
        });
    },
};

Blockly.Blocks["arrays_contains"] = {
    /**
     * Block for checking if a list contains a value.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_CONTAINS,
            args0: [
                {
                    type: "input_value",
                    name: "ARRAY",
                    check: "Array",
                },
                {
                    type: "input_value",
                    name: "VALUE",
                },
            ],
            extensions: ["colours_data_lists", "output_boolean"],
        });
    },
};

Blockly.Blocks["arrays_length"] = {
    /**
     * Block for getting the length of a list.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_LENGTH,
            args0: [
                {
                    type: "input_value",
                    name: "VALUE",
                    check: "Array",
                },
            ],
            output: "Number",
            extensions: ["colours_data_lists", "output_number"],
        });
    },
};

Blockly.Blocks["arrays_empty_array"] = {
    /**
     * Block for creating an empty list.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_EMPTY_ARRAY,
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

Blockly.Blocks["arrays_delimited_to_array"] = {
    /**
     * Block for creating a list from a text.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_DELIMITED_TO_ARRAY,
            args0: [
                {
                    type: "input_value",
                    name: "TEXT",
                },
                {
                    type: "input_value",
                    name: "DELIM",
                },
            ],
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

// The 2 blocks below are swapped due to a mistake during development.

Blockly.Blocks["arrays_in_front_of"] = {
    /**
     * Block for reporting a list with an item added to the top.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_BEHIND,
            args0: [
                {
                    type: "input_value",
                    name: "ITEM",
                },
                {
                    type: "input_value",
                    name: "ARRAY",
                    check: "Array",
                },
            ],
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

Blockly.Blocks["arrays_behind"] = {
    /**
     * Block for reporting a list with an item added to the bottom.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_IN_FRONT_OF,
            args0: [
                {
                    type: "input_value",
                    name: "ITEM",
                },
                {
                    type: "input_value",
                    name: "ARRAY",
                    check: "Array",
                },
            ],
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

Blockly.Blocks["arrays_at"] = {
    /**
     * Block for reporting a list with an item at a specific position.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_AT,
            args0: [
                {
                    type: "input_value",
                    name: "ITEM",
                },
                {
                    type: "input_value",
                    name: "INDEX",
                },
                {
                    type: "input_value",
                    name: "ARRAY",
                    check: "Array",
                },
            ],
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

Blockly.Blocks["arrays_range"] = {
    /**
     * Block for creating a list with a range.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_RANGE,
            args0: [
                {
                    type: "input_value",
                    name: "START",
                    check: "Number",
                },
                {
                    type: "input_value",
                    name: "END",
                    check: "Number",
                },
            ],
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

Blockly.Blocks['arrays_expandablemake'] = {
  init: function () {
    this.jsonInit({
      // We use a dummy input for the main label so we can change it later
      "message0": "%2 %3 %1",
      "args0": [
        {
          "type": "field_label",
          "text": "array",
          "name": "MAIN_LABEL"
        },
        {
          "type": "field_expandable_remove",
          "name": "REMOVE"
        },
        {
          "type": "field_expandable_add",
          "name": "ADD"
        }
      ],
      "output": "Array",
      "extensions": ["colours_data_lists", "shape_square"]
    });

    this.placeholders_ = ["apple", "banana", "pear", "orange", "kiwi"];
    this.inputs_ = 0; // Start at 0 to keep it clean
  },

  /**
   * Internal helper to update labels and create/remove inputs.
   */
  updateShape_: function (targetCount, isLoading) {
    const labelField = this.getField('MAIN_LABEL');
    if (labelField) {
      labelField.setValue(targetCount > 0 ? "array with" : Blockly.Msg.ARRAYS_EMPTY_ARRAY);
    }

    // Add new inputs
    while (this.inputs_ < targetCount) {
      const index = this.inputs_;
      this.inputs_++;
      const inputName = `ADD${index}`;
      const input = this.appendValueInput(inputName);
      
      // CRITICAL FIX: Only fill shadows if NOT loading from XML
      if (!isLoading && (this.rendered || this.isInFlyout)) {
        this.fillInBlock(input.connection, index);
      }
    }

    // Remove inputs
    while (this.inputs_ > targetCount) {
      this.removeInput(`ADD${this.inputs_ - 1}`);
      this.inputs_--;
    }
    },

  fillInBlock: function (connection, index) {
    if (connection.sourceBlock_.isInsertionMarker_) return;

    const textValue = this.placeholders_[index] || "item";

    // 1. Create the XML definition of the shadow block
    const shadowDom = document.createElement("shadow");
    shadowDom.setAttribute("type", "text");
    
    const fieldDom = document.createElement("field");
    fieldDom.setAttribute("name", "TEXT");
    fieldDom.textContent = textValue;
    
    shadowDom.appendChild(fieldDom);

    // 2. Register the shadow XML directly to the connection
    connection.setShadowDom(shadowDom);

    // 3. Spawn the shadow block visually
    if (connection.respawnShadow_) {
        // The native Scratch-Blocks way to generate a shadow from its DOM
        connection.respawnShadow_();
    } else {
        // Fallback just in case respawnShadow_ is missing in your specific VM
        const shadowBlock = Blockly.Xml.domToBlock(shadowDom, this.workspace);
        shadowBlock.setShadow(true);
        shadowBlock.outputConnection.connect(connection);
        if (this.rendered) {
        shadowBlock.initSvg();
        shadowBlock.render(false);
        }
    }
    },

  mutationToDom: function () {
    const container = document.createElement("mutation");
    container.setAttribute("items", String(this.inputs_));
    return container;
  },

  domToMutation: function (xmlElement) {
    const items = parseInt(xmlElement.getAttribute('items'), 10);
    const newCount = isNaN(items) ? 0 : items;

    // Update label
    const labelField = this.getField('MAIN_LABEL');
    if (labelField) {
        labelField.setValue(newCount > 0 ? "array with" : Blockly.Msg.ARRAYS_EMPTY_ARRAY);
    }

    // Remove existing inputs (dispose any live shadows first)
    for (let i = this.inputs_ - 1; i >= 0; i--) {
        const input = this.getInput('ADD' + i);
        if (input && input.connection) {
            const target = input.connection.targetBlock();
            if (target && target.isShadow()) {
                target.dispose(false, false);
            }
        }
        this.removeInput('ADD' + i);
    }
    this.inputs_ = 0;

    // Re-create inputs: register shadowDom for future respawning,
    // but do NOT call respawnShadow_() — the XML loader will attach
    // the saved block/shadow from the project file itself.
    for (let i = 0; i < newCount; i++) {
        const input = this.appendValueInput('ADD' + i);
        this.inputs_++;

        // Register shadow DOM so it respawns when a real block is later removed
        const textValue = this.placeholders_[i] || "item";
        const shadowDom = document.createElement("shadow");
        shadowDom.setAttribute("type", "text");
        const fieldDom = document.createElement("field");
        fieldDom.setAttribute("name", "TEXT");
        fieldDom.textContent = textValue;
        shadowDom.appendChild(fieldDom);
        input.connection.setShadowDom(shadowDom);
        // ← No respawnShadow_() here! XML loader does the attachment.
    }
},

  onExpandableButtonClicked_: function (isAdding) {
    Blockly.Events.setGroup(true);
    const oldMutation = Blockly.Xml.domToText(this.mutationToDom());

    const newCount = isAdding ? this.inputs_ + 1 : Math.max(0, this.inputs_ - 1);
    this.updateShape_(newCount);

    this.initSvg();
    if (this.rendered) this.render();

    const newMutation = Blockly.Xml.domToText(this.mutationToDom());
    Blockly.Events.fire(new Blockly.Events.BlockChange(this,
      'mutation', null, oldMutation, newMutation));
    Blockly.Events.setGroup(false);
  }
};