/**
 * @fileoverview custom DOM-based input users can customize
 * @author @SharkPool-SP (SharkPool)
 */
'use strict';

goog.provide('Blockly.FieldCustom');

const customInputs = new Map();

/**
 * Class for a custom field.
 * @param {string} value The default value for the field
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldCustom = function(value) {
  Blockly.FieldCustom.superClass_.constructor.call(this, value);
  this.addArgType('text');

  /**
   * input ID used to identify input from 'customInputs'
   * @type {string}
   */
  this.inputID = null;

  /**
   * input parts stored in 'customInputs'
   * @type {object}
   */
  this.inputParts = {};

  /**
   * Touch event wrapper.
   * Runs when the field is selected.
   * @type {!Array}
   * @private
   */
  this.mouseDownWrapper_ = null;
};
goog.inherits(Blockly.FieldCustom, Blockly.Field);

/**
 * Construct a FieldCustom from a JSON arg object.
 * @param {!Object} options A JSON object with options.
 * @returns {!Blockly.FieldCustom} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldCustom.fromJson = function(options) {
  console.log("new custom field", options);
  return new Blockly.FieldCustom(options['custom']);
};

Blockly.FieldCustom.registerInput = function(id, html, onInit, onClick, onUpdate) {
  if (!html || !(html instanceof Node)) {
    console.warn('Param 1 must be a valid DOM element!');
    return;
  }
  if (!onInit || typeof onInit !== 'function') {
    console.warn('Param 2 must be a function!');
    return;
  }
  if (!onClick || typeof onClick !== 'function') {
    console.warn('Param 3 must be a function!');
    return;
  }
  if (!onUpdate || typeof onUpdate !== 'function') {
    console.warn('Param 4 must be a function!');
    return;
  }
  customInputs.set(id, { html, onInit, onClick, onUpdate });
};
Blockly.FieldCustom.unregisterInput = function(id) {
  customInputs.delete(id);
};

/**
 * Called when the field is placed on a block.
 * @param {Block} block The owning block.
 */
Blockly.FieldCustom.prototype.init = function() {
  if (this.fieldGroup_) {
    // custom field has already been initialized
    return;
  }

  this.inputParts = customInputs.get(this.inputID);
  if (!this.inputParts) {
    console.error(`No Custom Input found with ID '${this.inputID}', did you use 'registerInput'?`);
    return;
  }

  // Build the DOM.
  const htmlDOM = this.inputParts.html;
  this.fieldGroup_ = Blockly.utils.createSvgElement('g', {}, null);
  this.size_.width = htmlDOM.width ?? (htmlDOM.style.width ? parseFloat(htmlDOM.style.width) :
    htmlDOM.getBoundingClientRect().width);

  this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);

  this.inputSource = Blockly.utils.createSvgElement('foreignObject', {
    'width': this.size_.width, 'height': this.size_.height,
    'pointer-events': 'bounding-box', 'cursor': 'pointer'
  }, this.fieldGroup_);

  this.mouseDownWrapper_ = Blockly.bindEventWithChecks_(
      this.getClickTarget_(), 'mousedown', this, this.onMouseDown_
  );
  this.inputParts.onInit(this);
};

/**
 * Set the value for this field
 * @param {any} value The new value of whatever the user chooses
 * @override
 */
Blockly.FieldCustom.prototype.setValue = function(value) {
  if (!value || value === this.value_) {
    return; // No change
  }
  if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
    Blockly.Events.fire(new Blockly.Events.Change(
      this.sourceBlock_, 'field', this.name, this.value_, value
    ));
  }
  this.value_ = value;
  this.inputParts.onUpdate(this);
};

/**
 * Get the value from this field menu.
 * @return {any} Current value.
 */
Blockly.FieldCustom.prototype.getValue = function() {
  return this.value_;
};

/**
 * do whatever the user desires on-edit
 * @private
 */
Blockly.FieldCustom.prototype.showEditor_ = function() {
  this.inputParts.onClick(this);
};

/**
 * Clean up this FieldCustom, as well as the inherited Field.
 * @return {!Function} Closure to call on destruction of the WidgetDiv.
 * @private
 */
Blockly.FieldCustom.prototype.dispose_ = function() {
  var thisField = this;
  return function() {
    Blockly.FieldCustom.superClass_.dispose_.call(thisField)();
    if (thisField.mouseDownWrapper_) Blockly.unbindEvent_(thisField.mouseDownWrapper_);
  };
};

Blockly.Field.register('field_customInput', Blockly.FieldCustom);
