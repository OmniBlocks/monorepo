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
 * @fileoverview Utility functions for handling variables and procedure names.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Names');


/**
 * Class for a database of entity names (variables, functions, etc).
 * @param {string} reservedWords A comma-separated string of words that are
 *     illegal for use as names in a language (e.g. 'new,if,this,...').
<<<<<<< HEAD
 * @param {string=} opt_variablePrefix Some languages need a '$' or a namespace
 *     before all variable names.
 * @constructor
 */
Blockly.Names = function(reservedWords, opt_variablePrefix) {
  this.variablePrefix_ = opt_variablePrefix || '';
  this.reservedDict_ = Object.create(null);
  if (reservedWords) {
    var splitWords = reservedWords.split(',');
    for (var i = 0; i < splitWords.length; i++) {
      this.reservedDict_[splitWords[i]] = true;
=======
 * @constructor
 */
Blockly.Names = function(reservedWords) {
  this.reservedDict_ = Object.create(null);
  if (reservedWords) {
    var splitWords = reservedWords.split(',');
    for (var x = 0; x < splitWords.length; x++) {
      this.reservedDict_[splitWords[x]] = true;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    }
  }
  this.reset();
};

/**
<<<<<<< HEAD
 * Constant to separate developer variable names from user-defined variable
 * names when running generators.
 * A developer variable will be declared as a global in the generated code, but
 * will never be shown to the user in the workspace or stored in the variable
 * map.
 */
Blockly.Names.DEVELOPER_VARIABLE_TYPE = 'DEVELOPER_VARIABLE';

/**
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 * When JavaScript (or most other languages) is generated, variable 'foo' and
 * procedure 'foo' would collide.  However, Blockly has no such problems since
 * variable get 'foo' and procedure call 'foo' are unambiguous.
 * Therefore, Blockly keeps a separate type name to disambiguate.
 * getName('foo', 'variable') -> 'foo'
 * getName('foo', 'procedure') -> 'foo2'
 */

/**
 * Empty the database and start from scratch.  The reserved words are kept.
 */
Blockly.Names.prototype.reset = function() {
  this.db_ = Object.create(null);
  this.dbReverse_ = Object.create(null);
<<<<<<< HEAD
  this.variableMap_ = null;
};

/**
 * Set the variable map that maps from variable name to variable object.
 * @param {!Blockly.VariableMap} map The map to track.
 * @package
 */
Blockly.Names.prototype.setVariableMap = function(map) {
  this.variableMap_ = map;
};

/**
 * Get the name for a user-defined variable, based on its ID.
 * This should only be used for variables of type Blockly.Variables.NAME_TYPE.
 * @param {string} id The ID to look up in the variable map.
 * @return {?string} The name of the referenced variable, or null if there was
 *     no variable map or the variable was not found in the map.
 * @private
 */
Blockly.Names.prototype.getNameForUserVariable_ = function(id) {
  if (!this.variableMap_) {
    console.log('Deprecated call to Blockly.Names.prototype.getName without ' +
        'defining a variable map. To fix, add the folowing code in your ' +
        'generator\'s init() function:\n' +
        'Blockly.YourGeneratorName.variableDB_.setVariableMap(' +
        'workspace.getVariableMap());');
    return null;
  }
  var variable = this.variableMap_.getVariableById(id);
  if (variable) {
    return variable.name;
  } else {
    return null;
  }
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Convert a Blockly entity name to a legal exportable entity name.
 * @param {string} name The Blockly entity name (no constraints).
 * @param {string} type The type of entity in Blockly
 *     ('VARIABLE', 'PROCEDURE', 'BUILTIN', etc...).
<<<<<<< HEAD
 * @return {string} An entity name that is legal in the exported language.
 */
Blockly.Names.prototype.getName = function(name, type) {
  if (type == Blockly.Variables.NAME_TYPE) {
    var varName = this.getNameForUserVariable_(name);
    if (varName) {
      name = varName;
    }
  }
  var normalized = name.toLowerCase() + '_' + type;

  var isVarType = type == Blockly.Variables.NAME_TYPE ||
      type == Blockly.Names.DEVELOPER_VARIABLE_TYPE;

  var prefix = isVarType ? this.variablePrefix_ : '';
  if (normalized in this.db_) {
    return prefix + this.db_[normalized];
  }
  var safeName = this.getDistinctName(name, type);
  this.db_[normalized] = safeName.substr(prefix.length);
=======
 * @return {string} An entity name legal for the exported language.
 */
Blockly.Names.prototype.getName = function(name, type) {
  var normalized = name.toLowerCase() + '_' + type;
  if (normalized in this.db_) {
    return this.db_[normalized];
  }
  var safeName = this.getDistinctName(name, type);
  this.db_[normalized] = safeName;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
  return safeName;
};

/**
 * Convert a Blockly entity name to a legal exportable entity name.
 * Ensure that this is a new name not overlapping any previously defined name.
 * Also check against list of reserved words for the current language and
 * ensure name doesn't collide.
 * @param {string} name The Blockly entity name (no constraints).
 * @param {string} type The type of entity in Blockly
 *     ('VARIABLE', 'PROCEDURE', 'BUILTIN', etc...).
<<<<<<< HEAD
 * @return {string} An entity name that is legal in the exported language.
=======
 * @return {string} An entity name legal for the exported language.
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
 */
Blockly.Names.prototype.getDistinctName = function(name, type) {
  var safeName = this.safeName_(name);
  var i = '';
  while (this.dbReverse_[safeName + i] ||
         (safeName + i) in this.reservedDict_) {
    // Collision with existing name.  Create a unique name.
    i = i ? i + 1 : 2;
  }
  safeName += i;
  this.dbReverse_[safeName] = true;
<<<<<<< HEAD
  var isVarType = type == Blockly.Variables.NAME_TYPE ||
      type == Blockly.Names.DEVELOPER_VARIABLE_TYPE;
  var prefix = isVarType ? this.variablePrefix_ : '';
  return prefix + safeName;
=======
  return safeName;
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
};

/**
 * Given a proposed entity name, generate a name that conforms to the
 * [_A-Za-z][_A-Za-z0-9]* format that most languages consider legal for
 * variables.
 * @param {string} name Potentially illegal entity name.
 * @return {string} Safe entity name.
 * @private
 */
Blockly.Names.prototype.safeName_ = function(name) {
  if (!name) {
    name = 'unnamed';
  } else {
    // Unfortunately names in non-latin characters will look like
    // _E9_9F_B3_E4_B9_90 which is pretty meaningless.
<<<<<<< HEAD
    // https://github.com/google/blockly/issues/1654
=======
>>>>>>> cc1af68cb3 (New initial commit with .svn directories and their contents ignored.)
    name = encodeURI(name.replace(/ /g, '_')).replace(/[^\w]/g, '_');
    // Most languages don't allow names with leading numbers.
    if ('0123456789'.indexOf(name[0]) != -1) {
      name = 'my_' + name;
    }
  }
  return name;
};

/**
 * Do the given two entity names refer to the same entity?
 * Blockly names are case-insensitive.
 * @param {string} name1 First name.
 * @param {string} name2 Second name.
 * @return {boolean} True if names are the same.
 */
Blockly.Names.equals = function(name1, name2) {
  return name1.toLowerCase() == name2.toLowerCase();
};
