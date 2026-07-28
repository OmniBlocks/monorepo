'use strict';

goog.provide('Blockly.Blocks.liveTests');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

Blockly.Blocks['test_spread'] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": '... %1',
      "args0": [
        {
          "type": "input_value",
          "name": "SPREAD",
          "shape": 3
        }
      ],
      "colour": "#808080",
      "category": "...",
      "outputShape": 3,
      "extensions": ["output_string"]
    });
  },
};

Blockly.Blocks['field_textdropdown_test'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_textdropdown",
          "name": "TEXT",
          "options": [
            ['item1', 'item1'],
            ['item2', 'item2'],
            ['item3', 'item3']
          ]
        }
      ],
      "output": "String",
      "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
      "colour": Blockly.Colours.textField,
      "colourSecondary": Blockly.Colours.textField,
      "colourTertiary": Blockly.Colours.textField
    })
  }
}

Blockly.Blocks['motion_mutatorCheckboxTest_checkboxMutatorMenu'] = {
  init: function () {
    this.setInputsInline(false);
    this.setColour("#c1c1c1");
  }
};
Blockly.Blocks['motion_mutatorCheckboxTest'] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": 'checkbox mutator',
      "args0": [],
      "category": Blockly.Categories.control,
      "extensions": ["colours_control", "shape_statement"]
    });
    this.setMutator(new Blockly.Mutator([]));

    this.BORDER_FIELDS = ["ABC", "DEF"];
    this.FIELD_NAMES = ["first", "second"];

    this.inputs_ = [false, false];
  },

  mutationToDom: function () {
    // console.log('mutationToDom', this.inputs_);
    if (!this.inputs_) {
      return null;
    }
    const container = document.createElement("mutation");
    for (let i = 0; i < this.inputs_.length; i++) {
      if (this.inputs_[i]) {
        container.setAttribute(this.BORDER_FIELDS[i], this.inputs_[i]);
      }
    }
    return container;
  },

  domToMutation: function (xmlElement) {
    for (let i = 0; i < this.inputs_.length; i++) {
      this.inputs_[i] = xmlElement.getAttribute(this.BORDER_FIELDS[i].toLowerCase()) == "true";
    }
    // console.log('domToMutation', this.inputs_);
    this.updateShape_();
  },

  decompose: function (workspace) {
    // console.log('decompose');
    const containerBlock = workspace.newBlock('motion_mutatorCheckboxTest_checkboxMutatorMenu');
    for (let i = 0; i < this.inputs_.length; i++) {
      // BaseBlockly.Msg[this.BORDER_FIELDS[i]] = this.FIELD_NAMES[i];
      containerBlock.appendDummyInput()
        // .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(this.FIELD_NAMES[i])
        .appendField(new Blockly.FieldCheckboxOriginal(this.inputs_[i] ? "TRUE" : "FALSE"), this.BORDER_FIELDS[i].toUpperCase());
    }
    containerBlock.initSvg();
    containerBlock.moveBy(4, 22);
    return containerBlock;
  },

  compose: function (containerBlock) {
    // console.log('compose');
    // Set states
    for (let i = 0; i < this.inputs_.length; i++) {
      const field = this.BORDER_FIELDS[i].toUpperCase();
      const value = containerBlock.getFieldValue(field);
      // console.log(value);
      this.inputs_[i] = value == "TRUE";
    }
    this.updateShape_();
  },

  updateShape_: function () {
    // console.log('updateShape_');
    for (let i = 0; i < this.inputs_.length; i++) {
      if ((!this.inputs_[i]) && (this.getInput(this.BORDER_FIELDS[i].toUpperCase()))) {
        this.removeInput(this.BORDER_FIELDS[i].toUpperCase());
      }
    }
    for (let i = 0; i < this.inputs_.length; i++) {
      if ((this.inputs_[i]) && (!(this.getInput(this.BORDER_FIELDS[i].toUpperCase())))) {
        // BaseBlockly.Msg[this.BORDER_FIELDS[i]] = this.FIELD_NAMES[i];
        this.appendValueInput(this.BORDER_FIELDS[i].toUpperCase())
          // .setAlign(Blockly.ALIGN_RIGHT)
          // todo: insert string/number input?
          .appendField(this.FIELD_NAMES[i]);
      }
    }
  }
};

/* custom button field */
Blockly.FieldCustom.registerInput(
  'TEST_BUTTON',
  (() => {
    const div = document.createElement("div");
    div.setAttribute("style", `width: 32px; height: 32px; padding: 6px 10px; text-align: center; font-weight: 500; border-radius: 4px; border: solid 1px #00000030;`);
    return div;
  })(),
  (field, input) => {
    /* on init */
    const srcBlock = field.sourceBlock_;

    input.textContent = "alert";
    input.style.width = "max-content";
    input.style.color = srcBlock && srcBlock.textColor ? srcBlock.textColor : "#fff";

    const properWidth = goog.style.getSize(input).width;
    input.style.width = properWidth + "px";
    input.parentNode.setAttribute("width", properWidth);
    field.size_.width = properWidth;
    srcBlock.render(false);
  },
  () => {
    /* on click */
    alert("wow");
  },
  () => { /* not needed */ }
);
Blockly.Blocks['control_fieldbutton'] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": 'button %1',
      "args0": [
        {
          "type": "field_customInput",
          "name": "BUTTON",
          "id": "TEST_BUTTON",
          "opcode": "alert"
        }
      ],
      "category": Blockly.Categories.control,
      "extensions": ["colours_control", "shape_statement"]
    });
  },
};

Blockly.Blocks['control_fieldcheckboxoriginal'] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": 'mm checkbox %1 gagag %2',
      "args0": [
        {
          "type": "field_checkbox_original",
          "name": "BUTTON"
        },
        {
          "type": "field_checkbox_original",
          "name": "BUTT2ON"
        }
      ],
      "category": Blockly.Categories.control,
      "extensions": ["colours_control", "shape_statement"]
    });
  }
};

Blockly.Blocks['control_testcolorfieldoriginal'] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": 'color %1',
      "args0": [
        {
          "type": "field_colour",
          "colour": "#ff0000",
          "name": "COLOR"
        }
      ],
      "category": Blockly.Categories.control,
      "extensions": ["colours_control", "shape_statement"]
    });
  }
};

Blockly.Blocks['control_blockduplicatesondrag'] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": 'duplicate',
      "category": Blockly.Categories.control,
      "canDragDuplicate": true,
      "extensions": ["colours_control", "shape_statement"]
    });
  }
};

Blockly.Blocks['control_dualblock'] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": 'dual block',
      "category": Blockly.Categories.control,
      "extensions": ["colours_control", "shape_statement", "output_string"]
    });
  }
};

/* The following are Deprecated, either scrapped or redone */
/**
 * Hidden since this is dangerous to keep in the main
 * toolbox. Its also now in the javascript extension
 * which is built to be safer and more focused on js
 */
Blockly.Blocks['control_javascript_command'] = {
  init: function () {
    this.jsonInit({
      "message0": "javascript %1",
      "args0": [
        {
          "type": "input_value",
          "name": "JS"
        }
      ],
      "category": Blockly.Categories.control,
      "extensions": ["colours_control", "shape_statement"]
    });
  }
};
Blockly.Blocks["operator_javascript_output"] = {
  init: function () {
    this.jsonInit({
      "inputsInline": true,
      "message0": "javascript %1",
      "args0": [
        {
          "type": "input_value",
          "name": "JS"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_string"]
    });
  }
};
Blockly.Blocks["operator_javascript_boolean"] = {
  init: function () {
    this.jsonInit({
      "inputsInline": true,
      "message0": "javascript %1",
      "args0": [
        {
          "type": "input_value",
          "name": "JS"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};
Blockly.Blocks["event_whenjavascript"] = {
  init: function () {
    this.jsonInit({
      "inputsInline": true,
      "message0": "when javascript %1 === true",
      "args0": [
        {
          "type": "input_value",
          "name": "JS"
        }
      ],
      "category": Blockly.Categories.event,
      "extensions": ["colours_event", "shape_hat"]
    });
  }
};

/**
 * Renamed to shear, which is now an effect in looks
 */
Blockly.Blocks['looks_setVertTransform'] = {
  init: function() {
    this.jsonInit({
      "message0": 'skew sprite vertically %1 %',
      "args0": [
        {
          "type": "input_value",
          "name": "PERCENT"
        }
      ],
      "category": Blockly.Categories.looks,
      "extensions": ["colours_looks", "shape_statement"]
    });
  }
};
Blockly.Blocks['looks_setHorizTransform'] = {
  init: function() {
    this.jsonInit({
      "message0": 'skew sprite horizontally %1 %',
      "args0": [
        {
          "type": "input_value",
          "name": "PERCENT"
        }
      ],
      "category": Blockly.Categories.looks,
      "extensions": ["colours_looks", "shape_statement"]
    });
  }
};

/* End of Deprecation marker */
