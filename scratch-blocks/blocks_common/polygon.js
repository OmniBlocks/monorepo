/**
 * @fileoverview Polygon block.
 * @author @RedMan13 (godslayerakp) & SharkPool
 */
'use strict';

// TODO set the default value for checkboxes so the arrow doesnt point the wrong way on duplication/flyout click

goog.provide('Blockly.Blocks.polygon');
goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');

const getXYForPoint = (point, points, opt_offset, opt_scale) => {
  const offset = Array.isArray(opt_offset) 
    ? opt_offset 
    : [0,0];
  const scale = typeof opt_scale === 'number' 
    ? opt_scale 
    : 10;
  const origin = 360 / points;
  
  const dir = Blockly.utils.toRadians(((origin * point) - (origin / 2)) - 90);
  const x = Math.cos(dir) * scale;
  const y = Math.sin(dir) * scale;
  return [x + offset[0],y + offset[1]];
}

Blockly.Blocks['polygon'] = {
  /**
   * Block for complex shapes.
   * @this Blockly.Block
   */
  init: function() {
    this.color = Blockly.Colours.pen.primary;
    this.needsInit = true;
    this.expanded = true;
    this.points = 0;
    this.offset = [0,0];
    this.scale = 50;
    this.oldConnections = {};
    this.myBlocks = {};
    this.initGenerate();
  },
  mutationToDom: function() {
    const container = document.createElement('mutation');

    container.setAttribute('points', JSON.stringify(this.points));
    container.setAttribute('color', this.color);
    container.setAttribute('midle', JSON.stringify(this.offset));
    container.setAttribute('scale', JSON.stringify(this.scale));
    container.setAttribute('expanded', JSON.stringify(this.expanded));
    container.setAttribute('needsInit', JSON.stringify(this.needsInit));
    return container;
  },
  domToMutation: function(xmlElement) {
    const newPoints = JSON.parse(xmlElement.getAttribute('points'));
    const newColor = xmlElement.getAttribute('color') || '';
    const newOffset = JSON.parse(xmlElement.getAttribute('midle') || '""');
    const newScale = JSON.parse(xmlElement.getAttribute('scale') || '""');
    const isInit = JSON.parse(xmlElement.getAttribute('needsInit') || 'true');
    const newExpanded = false;
    if (newPoints !== this.points) {
      this.clear();
      this.points = newPoints;
      if (isInit) this.initGenerate();
      else this.generate();
    }
    if (typeof newColor === 'string') {
      this.color = newColor;
    }
    if (newOffset && Array.isArray(newOffset)) {
      this.offset = newOffset;
    }
    if (typeof newScale === 'number') {
      this.length = newScale;
    }
    if (typeof newExpanded === 'boolean' && newExpanded !== this.expanded) {
      this.setExpanded(newExpanded);
      this.setFieldValue(newExpanded, 'button');
    }
  },
  clear: function() {
    const connections = {};
    for (let point = 1; point <= this.points; point++) {
      const xName = `x${point}`;
      const yName = `y${point}`;
      const xInput = this.getInput(xName);
      const yInput = this.getInput(yName);
      connections[xName] = xInput.connection.targetConnection;
      connections[yName] = yInput.connection.targetConnection;
      this.removeInput(xName);
      this.removeInput(yName);
    }

    this.removeInput('buttonContainer');
    this.oldConnections = connections;
  },
  initGenerate: function() {
    this.setColour(this.color, this.color, this.color);
    this.setOutputShape(Blockly.OUTPUT_SHAPE_SQUARE);
    this.setOutput(true, 'math_polygon');
    this.setShadow(true);

    const thisBlock = this;
    const button = new Blockly.FieldCheckbox(
      this.expanded, 
      newState => {
        if (this.isInFlyout) return;
        this.needsInit = false;
        this.generate();
        this.inputList[0].setVisible(false);
        this.render();
        return newState;
      }
    )
    this.appendDummyInput('buttonContainer')
      .appendField(button, 'button');
    this.render(true);
  },
  generate: function() {
    const connections = this.oldConnections;
    // create all the node inputs
    for (let point = 1; point <= this.points; point++) {
      const xName = `x${point}`;
      const yName = `y${point}`;
      const xInput = this.appendValueInput(xName);
      const yInput = this.appendValueInput(yName);
      const xConnection = xInput.connection;
      const yConnection = yInput.connection;
      // dispose of any free-floating blocks that where created by this block
      if (this.myBlocks[xName] && !this.myBlocks[xName].outputConnection.targetConnection) {
        this.myBlocks[xName].dispose();
        delete this.myBlocks[xName];
      }
      if (this.myBlocks[yName] && !this.myBlocks[yName].outputConnection.targetConnection) {
        this.myBlocks[yName].dispose();
        delete this.myBlocks[yName];
      }
      // if this point isnt filled in, fill it in
      if (!this.getInput(xName).connection.targetConnection || !this.getInput(yName).connection.targetConnection) {
        const newxBlock = this.workspace.newBlock('math_number');
        const newyBlock = this.workspace.newBlock('math_number');
        const initialValue = getXYForPoint(point - 1, this.points, this.offset, this.scale)
        newxBlock.setFieldValue(String(initialValue[0]), 'NUM');
        newyBlock.setFieldValue(String(initialValue[1]), 'NUM');
        newxBlock.setShadow(true);
        newyBlock.setShadow(true);
        newxBlock.initSvg();
        newyBlock.initSvg();
        newxBlock.render(true);
        newyBlock.render(true);

        newxBlock.outputConnection.connect(xConnection);
        newyBlock.outputConnection.connect(yConnection);
        this.myBlocks[xName] = newxBlock;
        this.myBlocks[yName] = newyBlock;
      }
      // if we have a cached connection for this point then connect it
      if (connections[xName] || connections[yName]) {
        const xBlock = connections[xName].getSourceBlock();
        const yBlock = connections[yName].getSourceBlock();
        connections[xName].connect(xConnection);
        connections[yName].connect(yConnection);
        // re-render the blocks after connecting them
        xBlock.initSvg();
        yBlock.initSvg();
        xBlock.render(false);
        yBlock.render(false);
      }
      xInput.appendField('x: ');
      yInput.appendField('y: ');
    }

    this.setColour(this.color, this.color, this.color);
    this.setOutputShape(Blockly.OUTPUT_SHAPE_SQUARE);
    this.setOutput(true, 'math_polygon');
    this.setShadow(true);

    const thisBlock = this;
    const button = new Blockly.FieldCheckbox(
      this.expanded, 
      newState => {
        this.needsInit = false;
        thisBlock.setExpanded(newState);
        return newState;
      }
    )
    this.appendDummyInput('buttonContainer')
      .appendField(button, 'button');
    this.render(true);
  },
  setExpanded: function(bool) {
    if (this.needsInit) return;
    this.expanded = bool;
    for (let point = 1; point <= this.points; point++) {
      const xName = `x${point}`;
      const yName = `y${point}`;
      const xInput = this.getInput(xName);
      const yInput = this.getInput(yName);
      xInput.visible_ = !bool;
      xInput.setVisible(bool);
      yInput.visible_ = !bool;
      yInput.setVisible(bool);
    }
    this.initSvg();
    // we dont need to re-render this block since renderChildren will render all parents aswell
    this.rerenderChildBlocks();
  },
  rerenderChildBlocks: function() {
    const renderInputs = (block) => {
      const children = block.childBlocks_;
      // once we hit a bottom block, rerender the whole tree
      if (children.length) block.render(true);
      for (var i = 0, child; child = children[i]; i++) {
        child.render(false);
        renderInputs(child);
      }
    }
    renderInputs(this);
  }
};
/* insert random comment here*/
/*if you found this you get a carrot cookie */