/**
 * @fileoverview custom DOM-based input users can customize
 * @author @SharkPool-SP (SharkPool)
 */
'use strict';

goog.provide('Blockly.FieldCustom');

const customInputs = new Map();

/**
 * Class for a custom field.
 * @param {object} options Object containing the default value, inputID, etc for the field
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldCustom = function(options) {
  Blockly.FieldCustom.superClass_.constructor.call(this, options);
  this.addArgType('text');

  /**
   * input ID used to identify input from 'customInputs'
   * @type {string}
   */
  this.inputID = options.id ? options.id : null;

  /**
   * value of the field
   * @type {any}
   */
  this.value_ = options.value ? options.value : '';
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
  return new Blockly.FieldCustom(options);
};

Blockly.FieldCustom.registerInput = function(id, templateHTML, onInit, onClick, onUpdate, optOnDispose) {
  if (!templateHTML || !(templateHTML instanceof Node)) {
    console.warn('Param 2 must be a valid DOM element!');
    return;
  }
  if (!onInit || typeof onInit !== 'function') {
    console.warn('Param 3 must be a function!');
    return;
  }
  if (!onClick || typeof onClick !== 'function') {
    console.warn('Param 4 must be a function!');
    return;
  }
  if (!onUpdate || typeof onUpdate !== 'function') {
    console.warn('Param 5 must be a function!');
    return;
  }
  if (optOnDispose && typeof optOnDispose !== 'function') {
    console.warn('Param 6 must be a function!');
    return;
  }
  customInputs.set(id, { templateHTML, onInit, onClick, onUpdate, optOnDispose });
};
Blockly.FieldCustom.unregisterInput = function(id) {
  customInputs.delete(id);
};
Blockly.FieldCustom.registeredInputs = function() {
  return customInputs;
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
  const htmlDOM = this.inputParts.templateHTML.cloneNode(true);
  htmlDOM.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  this.inputParts.html = htmlDOM; // makes it easier for ext devs to find the input theyre editting
  
  this.fieldGroup_ = Blockly.utils.createSvgElement('g', {}, null);
  const boundingBox = htmlDOM.getBoundingClientRect();
  this.size_.width = htmlDOM.width ? htmlDOM.width : htmlDOM.style.width ? parseFloat(htmlDOM.style.width) :
    boundingBox.width;
  this.size_.height = htmlDOM.height ? htmlDOM.height : htmlDOM.style.height ? parseFloat(htmlDOM.style.height) :
    Math.max(32, boundingBox.height);

  this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);

  this.inputSource = Blockly.utils.createSvgElement('foreignObject', {
    'width': this.size_.width, 'height': this.size_.height,
    'pointer-events': 'all', 'cursor': 'pointer', 'overflow': 'visible'
  }, this.fieldGroup_);
  this.inputSource.appendChild(htmlDOM);

  this.mouseDownWrapper_ = Blockly.bindEventWithChecks_(
      this.getClickTarget_(), 'mousedown', this, this.onMouseDown_
  );
  queueMicrotask(() => {
    this.inputParts.onInit(this, this.inputParts.html);
  });
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
  if (this.inputParts !== undefined && this.inputParts.onUpdate) {
    const htmlDOM = this.inputParts.html;
    this.inputParts.onUpdate(this, htmlDOM);
  }
};

/**
 * Get the value from this field menu.
 * @return {any} Current value.
 */
Blockly.FieldCustom.prototype.getValue = function() {
  return this.value_;
};

/**
 * Get the text from this field for display and XML serialization.
 * Return empty string since the actual code is stored in value_ and
 * should not be serialized as display text.
 * @return {string} Empty string for display.
 */
Blockly.FieldCustom.prototype.getText = function() {
  // Return empty string to avoid serializing code with special characters
  // The actual value is handled separately via getValue/setValue
  return '';
};

/**
 * do whatever the user desires on-edit
 * @private
 */
Blockly.FieldCustom.prototype.showEditor_ = function() {
  const htmlDOM = this.inputParts.html;
  this.inputParts.onClick(this, htmlDOM);
};

/**
 * Clean up this FieldCustom, as well as the inherited Field.
 * @return {!Function} Closure to call on destruction of the WidgetDiv.
 * @private
 */
Blockly.FieldCustom.prototype.dispose_ = function() {
  var thisField = this;
  return function() {
    if (thisField.inputParts.optOnDispose) {
      const htmlDOM = this.inputParts.html;
      thisField.inputParts.optOnDispose(thisField, htmlDOM);
    }
    Blockly.FieldCustom.superClass_.dispose_.call(thisField)();
    if (thisField.mouseDownWrapper_) Blockly.unbindEvent_(thisField.mouseDownWrapper_);
  };
};

Blockly.Field.register('field_customInput', Blockly.FieldCustom);
