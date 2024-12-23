// Name: CST 3D
// ID: cst12293d
// Description: Bring your sprites into the third dimension.
// By: CST1229 <https://scratch.mit.edu/users/CST1229/>
// License: MPL-2.0

// Special thanks to Drago NrxThulitech Cuven for finding lots of bugs

/*
  TODO:
  - bugs
  
  - model support???
    - "load (OBJ/MTL/GLTF) (text/data: URL) [] into model []"
    - "set 3d mode to model []"
    - collision support unlikely (if it did happen it would probably be very laggy)

  - materials/textures
    - "set material [0] texture to [current costume]"
    - "set material [0] color to ()"?
    - built-in shape materials would be in docs because docs will exist (they are essential)

  - 3d stamping
    - "3d stamp named []" block that copies the current 3d object
    - "duplicate 3d stamp [] as []"
    - "move 3d stamp [] to myself"
    - "delete 3d stamp []"
    - "erase all 3d stamps"
  
  - lighting
    - could be in the set 3d mode block, as in "set 3d mode to (point/spotlight)"
    - spotlights point in the direction the sprite is pointing
    - light color/intensity blocks
    - glow?
    - world light blocks (direction/disable/flat/color/intensity)
  
  - WHEN RELEASING, DATA-URLIFY THREEJS
*/

(async function (Scratch) {
  "use strict";

  const IN_3D = "threed.in3d";
  const OBJECT = "threed.object";
  const THREED_DIRTY = "threed.dirty";
  const SIDE_MODE = "threed.sidemode";
  const TEX_FILTER = "threed.texfilter";
  const Z_POS = "threed.zpos";
  const YAW = "threed.yaw";
  const PITCH = "threed.pitch";
  const ROLL = "threed.roll";
  const ATTACHED_TO = "threed.attachedto";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("CST 3D must be run unsandboxed");
  }

  const extId = "cst12293d";

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const renderer = Scratch.renderer;

	const PATCHES_ID = "__patches" + extId;
	const patch = (obj, functions) => {
		if (obj[PATCHES_ID]) return;
		obj[PATCHES_ID] = {};
		for (const name in functions) {
			const original = obj[name];
			obj[PATCHES_ID][name] = obj[name];
			if (original) {
				obj[name] = function(...args) {
					const callOriginal = (...ogArgs) => original.call(this, ...ogArgs);
					return functions[name].call(this, callOriginal, ...args);
				};
			} else {
				obj[name] = function (...args) {
					return functions[name].call(this, () => {}, ...args);
				}
			}
		}
	}
	const _unpatch = (obj) => {
		if (!obj[PATCHES_ID]) return;
		for (const name in obj[PATCHES_ID]) {
			obj[name] = obj[PATCHES_ID][name];
		}
		delete obj[PATCHES_ID];
	}

  const Skin = renderer.exports.Skin;

  // this class was originally made by Vadik1
  class SimpleSkin extends Skin {
    constructor(id, renderer) {
      super(id, renderer);
      const gl = renderer.gl;
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,255,0,255]));
      this._texture = texture;
      /**
       * @type {[number, number]}
       */
      this._rotationCenter = [240, 180];
      /**
       * @type {[number, number]}
       */
      this._size = [480, 360];
    }
    dispose() {
      if (this._texture) {
        this._renderer.gl.deleteTexture(this._texture);
        this._texture = null;
      }
      super.dispose();
    }
    set size(value) {
      this._size = value;
      this._rotationCenter = [value[0] / 2, value[1] / 2];
    }
    get size() {
      return this._size;
    }
    getTexture(scale) {
      return this._texture || super.getTexture(scale);
    }
    setContent(textureData) {
      const gl = this._renderer.gl;
      gl.bindTexture(gl.TEXTURE_2D, this._texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textureData
      );
      this.emitWasAltered();
    }
  }

  // to convert to data url, use https://www.adminbooster.com/tool/data_uri
  // @ts-expect-error we're running in a browser
  const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.169/build/three.module.min.js");


  class ThreeD {
    constructor() {
      // @ts-expect-error
      window.threed = this;
      runtime[extId] = this;
      this.THREE = THREE;

      this.hideVanillaBlocks = !!runtime.extensionStorage?.[extId]?.hideVanillaBlocks;
      runtime.on("PROJECT_LOADED", () => {
        this.uninit();
        const oldHideVanillaBlocks = this.hideVanillaBlocks;
        this.hideVanillaBlocks = !!runtime.extensionStorage?.[extId]?.hideVanillaBlocks;
        if (oldHideVanillaBlocks != this.hideVanillaBlocks) {
          vm.extensionManager.refreshBlocks();
        }
      });
    }

    getInfo() {
      return {
        id: extId,
        name: "CST 3D",

        color1: "#2a47e8",
        color2: "#2439ad",
        color3: "#1b2d94",

        blocks: [
          {
            blockType: Scratch.BlockType.BUTTON,
            text: "Open Documentation",
            func: "viewDocs",
          },
          {
            blockType: Scratch.BlockType.BUTTON,
            text: this.hideVanillaBlocks ? "Show Vanilla Blocks" : "Hide Vanilla Blocks",
            func: "toggleVanillaBlocks",
          },
          "---",
          {
            opcode: "setMode",
            blockType: Scratch.BlockType.COMMAND,
            text: "set 3D mode to [MODE]",
            arguments: {
              MODE: {
                type: Scratch.ArgumentType.STRING,
                menu: "MODE_MENU",
                defaultValue: "flat",
              },
            },
          },
          "---",
          this.vanillaBlock(`
            <block type="motion_setx">
                <value name="X">
                    <shadow id="setx" type="math_number">
                        <field name="NUM">0</field>
                    </shadow>
                </value>
            </block>
            <block type="motion_sety">
                <value name="Y">
                    <shadow id="sety" type="math_number">
                        <field name="NUM">0</field>
                    </shadow>
                </value>
            </block>
          `),
          {
            opcode: "setZ",
            blockType: Scratch.BlockType.COMMAND,
            text: "set z to [Z]",
            arguments: {
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          this.vanillaBlock(`
            <block type="motion_changexby">
                <value name="DX">
                    <shadow type="math_number">
                        <field name="NUM">0</field>
                    </shadow>
                </value>
            </block>
            <block type="motion_changeyby">
                <value name="DY">
                    <shadow type="math_number">
                        <field name="NUM">0</field>
                    </shadow>
                </value>
            </block>
          `),
          {
            opcode: "changeZ",
            blockType: Scratch.BlockType.COMMAND,
            text: "change z by [Z]",
            arguments: {
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
            },
          },
          this.vanillaBlock(`
            <block type="motion_xposition"></block>
            <block type="motion_yposition"></block>
          `),
          {
            opcode: "getZ",
            blockType: Scratch.BlockType.REPORTER,
            text: "z position",
          },
          {
            opcode: "set3DPos",
            blockType: Scratch.BlockType.COMMAND,
            text: "go to x: [X] y: [Y] z: [Z]",
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "change3DPos",
            blockType: Scratch.BlockType.COMMAND,
            text: "change position by x: [X] y: [Y] z: [Z]",
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          "---",
          {
            opcode: "moveSteps",
            blockType: Scratch.BlockType.COMMAND,
            text: "move [STEPS] steps in 3D",
            arguments: {
              STEPS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
            },
          },
          {
            opcode: "set3DDir",
            blockType: Scratch.BlockType.COMMAND,
            text: "point in [DIRECTION] [DEGREES]",
            arguments: {
              DIRECTION: {
                type: Scratch.ArgumentType.STRING,
                menu: "direction",
                defaultValue: "y",
              },
              DEGREES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "rotate3D",
            blockType: Scratch.BlockType.COMMAND,
            text: "turn [DIRECTION] [DEGREES] degrees",
            arguments: {
              DIRECTION: {
                type: Scratch.ArgumentType.STRING,
                menu: "turnDirection",
                defaultValue: "right",
              },
              DEGREES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 15,
              },
            },
          },
          {
            opcode: "direction3D",
            blockType: Scratch.BlockType.REPORTER,
            text: "direction around [DIRECTION]",
            arguments: {
              DIRECTION: {
                type: Scratch.ArgumentType.STRING,
                menu: "direction",
                defaultValue: "y",
              },
            },
          },
          this.vanillaBlock(`
            <block type="sensing_touchingobject">
                <value name="TOUCHINGOBJECTMENU">
                    <shadow type="sensing_touchingobjectmenu"/>
                </value>
            </block>
          `),
          "---",
          {
            opcode: "setTexFilter",
            blockType: Scratch.BlockType.COMMAND,
            text: "set texture filter to [FILTER]",
            arguments: {
              FILTER: {
                type: Scratch.ArgumentType.STRING,
                menu: "texFilter",
                defaultValue: "nearest",
              },
            },
          },
          {
            opcode: "setSideMode",
            blockType: Scratch.BlockType.COMMAND,
            text: "set shown faces to [SIDE]",
            arguments: {
              SIDE: {
                type: Scratch.ArgumentType.STRING,
                menu: "side",
                defaultValue: "both",
              },
            },
          },
          "---",
          {
            opcode: "attach",
            blockType: Scratch.BlockType.COMMAND,
            text: "attach myself to [TARGET]",
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: "spriteMenu",
              },
            },
          },
          {
            opcode: "attachVar",
            blockType: Scratch.BlockType.COMMAND,
            text: "attach myself to sprite with variable [VARIABLE] set to [VALUE]",
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: "spriteMenu",
              },
              VARIABLE: {
                type: Scratch.ArgumentType.STRING,
                default: "my variable"
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                default: "0"
              }
            },
          },
          {
            opcode: "detach",
            blockType: Scratch.BlockType.COMMAND,
            text: "detach myself",
            arguments: {},
          },
          {
            opcode: "attachedSprite",
            blockType: Scratch.BlockType.REPORTER,
            text: "sprite I'm attached to",
            arguments: {},
          },
          {
            opcode: "attachedSpriteVar",
            blockType: Scratch.BlockType.REPORTER,
            text: "variable [VARIABLE] of sprite I'm attached to",
            arguments: {
              VARIABLE: {
                type: Scratch.ArgumentType.STRING,
                default: "my variable"
              },
            },
          },
          "---",
          {
            opcode: "setCam",
            blockType: Scratch.BlockType.COMMAND,
            text: "move camera to x: [X] y: [Y] z: [Z]",
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "changeCam",
            blockType: Scratch.BlockType.COMMAND,
            text: "change camera by x: [X] y: [Y] z: [Z]",
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "camX",
            blockType: Scratch.BlockType.REPORTER,
            text: "camera x",
          },
          {
            opcode: "camY",
            blockType: Scratch.BlockType.REPORTER,
            text: "camera y",
          },
          {
            opcode: "camZ",
            blockType: Scratch.BlockType.REPORTER,
            text: "camera z",
          },
          "---",
          {
            opcode: "moveCamSteps",
            blockType: Scratch.BlockType.COMMAND,
            text: "move camera [STEPS] steps",
            arguments: {
              STEPS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
            },
          },
          {
            opcode: "setCamDir",
            blockType: Scratch.BlockType.COMMAND,
            text: "point camera in [DIRECTION] [DEGREES]",
            arguments: {
              DIRECTION: {
                type: Scratch.ArgumentType.STRING,
                menu: "direction",
                defaultValue: "y",
              },
              DEGREES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "rotateCam",
            blockType: Scratch.BlockType.COMMAND,
            text: "turn camera [DIRECTION] [DEGREES] degrees",
            arguments: {
              DIRECTION: {
                type: Scratch.ArgumentType.STRING,
                menu: "turnDirection",
                defaultValue: "right",
              },
              DEGREES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 15,
              },
            },
          },
          {
            opcode: "camDir",
            blockType: Scratch.BlockType.REPORTER,
            text: "camera direction around [DIRECTION]",
            arguments: {
              DIRECTION: {
                type: Scratch.ArgumentType.STRING,
                menu: "direction",
                defaultValue: "y",
              },
            },
          },
          "---",
          {
            opcode: "setCameraParam",
            blockType: Scratch.BlockType.COMMAND,
            text: "set camera [PARAM] to [VALUE]",
            arguments: {
              PARAM: {
                type: Scratch.ArgumentType.STRING,
                menu: "cameraParam",
                defaultValue: "vertical FOV",
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "50",
              },
            },
          },
          {
            opcode: "getCameraParam",
            blockType: Scratch.BlockType.REPORTER,
            text: "camera [PARAM]",
            arguments: {
              PARAM: {
                type: Scratch.ArgumentType.STRING,
                menu: "cameraParam",
                defaultValue: "vertical FOV",
              },
            },
          },
        ],
        menus: {
          MODE_MENU: {
            acceptReporters: true,
            items: [
              "disabled",
              "flat",
              "flat triangle",
              "sprite",
              "cube",
              "sphere",
              "low-poly sphere",
            ],
          },
          turnDirection: {
            acceptReporters: false,
            items: [
              "left", "right",
              "up", "down",
              {
                text: "⟲",
                value: "ccw"
              },
              {
                text: "⟳",
                value: "cw"
              }
            ],
          },
          direction: {
            acceptReporters: true,
            items: [
              {value: "y", text: "y (yaw)"},
              {value: "x", text: "x (pitch)"},
              {value: "z", text: "z (roll)"},
            ],
          },
          cameraParam: {
            acceptReporters: true,
            items: ["vertical FOV", "minimum render distance", "maximum render distance"],
          },
          side: {
            acceptReporters: true,
            items: ["both", "front", "back"]
          },
          texFilter: {
            acceptReporters: true,
            items: ["nearest", "linear"]
          },

          spriteMenu: {
            acceptReporters: true,
            items: "getSprites",
          },
        },
      };
    }

    viewDocs() {
      alert(`This extension also makes many other vanilla blocks (e.g most of Motion) work with 3D sprites, try them out!
Default camera position: x0, y0, z200.
Default camera parameters: vertical FOV 60, min render distance 0.5, max render distance 4800.

More things will be added here as things that need explaining are added.
If I ever decide to release this extension on the gallery, this will be replaced with an actual docs page.`);
    }

    toggleVanillaBlocks() {
      this.hideVanillaBlocks = !this.hideVanillaBlocks;
      vm.extensionManager.refreshBlocks();
      if (!runtime.extensionStorage) return;
      if (!runtime.extensionStorage[extId]) {
        runtime.extensionStorage[extId] = {};
      }
      runtime.extensionStorage[extId].hideVanillaBlocks = this.hideVanillaBlocks;
    }

    vanillaBlock(xml) {
      return {
        blockType: Scratch.BlockType.XML,
        xml,
        hideFromPalette: this.hideVanillaBlocks
      };
    }

    init() {
      if (this.scene) return;

      // create everything
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
      this.camera.position.set(0, 0, 200);
      this.camera.lookAt(0, 0, 0);
      this.camera.near = 0.5;
      this.camera.far = 4800;

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.useLegacyLights = true;
      this.renderer.setClearAlpha(0);

      // create the scratch stuff
      this.threeSkinId = renderer._nextSkinId++;
      this.threeSkin = new SimpleSkin(
        this.threeSkinId,
        renderer
      );
      renderer._allSkins[this.threeSkinId] = this.threeSkin;
      this.threeDrawableId = renderer.createDrawable("pen");
      // @ts-expect-error not typed
      renderer._allDrawables[this.threeDrawableId].customDrawableName = "CST 3D Layer"
      renderer.updateDrawableSkinId(
        this.threeDrawableId,
        this.threeSkinId
      );

      this.stageSizeEvent = (() => {
        this.updateScale();
      }).bind(this);
      vm.on("STAGE_SIZE_CHANGED", this.stageSizeEvent);

      this.stampRenderTarget = new THREE.WebGLRenderTarget();

      this.raycaster = new THREE.Raycaster();

      this.applyPatches();
      this.updateScale();
    }

    uninit() {
      // delete everything
      for (const dr of renderer._allDrawables) {
        if (!dr) continue;
        this.disable3DForDrawable(dr.id);
        delete dr[IN_3D];
        delete dr[OBJECT];
      }
      if (this.scene) this.scene.clear();
      this.scene = undefined;
      this.camera = undefined;
      if (this.renderer) this.renderer.dispose();
      this.renderer = undefined;
      if (this.threeSkinId)
        this.threeSkin.dispose();
      this.threeSkinId = undefined;
      if (this.threeDrawableId)
        renderer._allDrawables[this.threeDrawableId].dispose();
      this.threeDrawableId = undefined;
      if (this.stageSizeEvent)
        vm.off("STAGE_SIZE_CHANGED", this.stageSizeEvent);
      this.stageSizeEvent = undefined;
      if (this.stampRenderTarget)
        this.stampRenderTarget.dispose();
      this.stampRenderTarget = undefined;

      runtime.requestRedraw();
    }

    // call when the native size of the canvas changes
    updateScale() {
      const w = runtime.stageWidth || 480;
      const h = runtime.stageHeight || 360;

      this.threeSkin[0] = w;
      this.threeSkin[1] = h;

      this.camera.aspect = w / h;
      this.renderer.setSize(w, h);
      this.stampRenderTarget.setSize(w, h);
      this.camera.updateProjectionMatrix();

      this.updateRenderer();
    }

    // patches for stuff
    applyPatches() {
      const Drawable = renderer.exports.Drawable;

      const threed = this;
      patch(Drawable.prototype, {
        getVisible(og) {
          if (this[IN_3D]) return false;
          return og();
        },
        updateVisible(og, value) {
          if (this[IN_3D]) {
            const o = this[OBJECT];
            if (o.visible !== value) {
              o.visible = value;
              threed.updateRenderer();
            }
          }
          return og(value);
        },
        updatePosition(og, position) {
          if (this[IN_3D]) {
            const o = this[OBJECT];
            o.position.x = position[0];
            o.position.y = position[1];
            threed.updateRenderer();
          }
          return og(position);
        },
        updateDirection(og, direction) {
          if (this[IN_3D]) {
            this[ROLL] = THREE.MathUtils.degToRad(direction);
            threed.updateSpriteAngle(this);
            threed.updateRenderer();
          }
          return og(direction);
        },
        updateScale(og, scale) {
          if (this[IN_3D]) {
            const obj = this[OBJECT];
            obj.scale.x = (obj._sizeX ?? 100) / 100 * scale[0];
            obj.scale.y = (obj._sizeY ?? 100) / 100 * scale[1];
            obj.scale.z = (obj._sizeZ ?? 100) / 100 * scale[0];
            threed.updateRenderer();
          }
          return og(scale);
        },
        dispose(og) {
          if (this[OBJECT]) {
            this[OBJECT].removeFromParent();
            this[OBJECT].material.dispose();
            if (this[OBJECT].material.map) this[OBJECT].material.map.dispose();
            this[OBJECT].geometry.dispose();
            this[OBJECT] = null;
            threed.updateRenderer();
          }
          return og();
        },
        _skinWasAltered(og) {
          og();
          if (this[IN_3D]) {
            threed.updateDrawableSkin(this);
            threed.updateRenderer();
          }
        }
      });
      
      patch(renderer, {
        draw(og) {
          if (this[THREED_DIRTY]) {
            // Do a 3D redraw
            threed.doUpdateRenderer();
            this[THREED_DIRTY] = false;
          }
          return og();
        },

        isTouchingDrawables(og, drawableID, candidateIDs = this._drawList) {
          const dr = this._allDrawables[drawableID];

          if (dr[IN_3D]) {
            // 3D sprites can't collide with 2D
            const candidates = candidateIDs.filter(id => this._allDrawables[id][IN_3D]);
            for (const candidate of candidates) {
              if (threed.touching3D(dr[OBJECT], this._allDrawables[candidate][OBJECT]))
                return true;
            }
            return false;
          }

          return og(drawableID, candidateIDs.filter(id => !(this._allDrawables[id][IN_3D])));
        },

        penStamp(og, penSkinID, stampID) {
          const dr = this._allDrawables[stampID];
          if (!dr) return;
          if (dr[IN_3D]) {
            // Draw the sprite to the 3D drawable then stamp it
            threed.renderer.render(dr[OBJECT], threed.camera);
            this._allSkins[threed.threeSkinId].setContent(
              threed.renderer.domElement
            );
            og(penSkinID, threed.threeDrawableId);
            threed.updateRenderer();
            return;
          }
          return og(penSkinID, stampID);
        },

        pick(og, centerX, centerY, touchWidth, touchHeight, candidateIDs) {
          const pick2d = og(centerX, centerY, touchWidth, touchHeight, candidateIDs);
          if (pick2d !== -1) return pick2d;
          
          if (!threed.raycaster) return false;

          const bounds = this.clientSpaceToScratchBounds(centerX, centerY, touchWidth, touchHeight);
          if (bounds.left === -Infinity || bounds.bottom === -Infinity) {
              return false;
          }

          const candidates =
            (candidateIDs || this._drawList).map(id => this._allDrawables[id]).filter(dr => dr[IN_3D]);
          if (candidates.length <= 0) return -1;

          const scratchCenterX = (bounds.left + bounds.right) / this._gl.canvas.clientWidth;
          const scratchCenterY = (bounds.top + bounds.bottom) / this._gl.canvas.clientHeight;
          threed.raycaster.setFromCamera(new THREE.Vector2(scratchCenterX, scratchCenterY), threed.camera);

          const object = threed.raycaster.intersectObject(threed.scene, true)[0]?.object;
          if (!object) return -1;
          const drawable = candidates.find(c => (c[IN_3D] && c[OBJECT] === object));
          if (!drawable) return -1;
          return drawable._id;
        },
        drawableTouching(og, drawableID, centerX, centerY, touchWidth, touchHeight) {
          const drawable = this._allDrawables[drawableID];
          if (!drawable) {
              return false;
          }
          if (!drawable[IN_3D]) {
            return og(drawableID, centerX, centerY, touchWidth, touchHeight);
          }
  
          if (!threed.raycaster) return false;
  
          const bounds = this.clientSpaceToScratchBounds(centerX, centerY, touchWidth, touchHeight);
          const scratchCenterX = (bounds.left + bounds.right) / this._gl.canvas.clientWidth;
          const scratchCenterY = (bounds.top + bounds.bottom) / this._gl.canvas.clientHeight;
          threed.raycaster.setFromCamera(new THREE.Vector2(scratchCenterX, scratchCenterY), threed.camera);
  
          const intersect = (threed.raycaster.intersectObject(threed.scene, true));
          const object = intersect[0]?.object;
          return object === drawable[OBJECT];
        },
        extractDrawableScreenSpace(og, drawableID) {
          const drawable = this._allDrawables[drawableID];
          if (!drawable)
            throw new Error(`Could not extract drawable with ID ${drawableID}; it does not exist`);
          if (!drawable[IN_3D])
            return og(drawableID);

          // Draw the sprite to the 3D drawable then extract it
          threed.renderer.render(drawable[OBJECT], threed.camera);
          this._allSkins[threed.threeSkinId].setContent(
            threed.renderer.domElement
          );
          const extracted = og(threed.threeDrawableId);
          threed.updateRenderer();
          return extracted;
        },
      });
      patch(renderer.exports.Skin, {
        dispose(og) {
          if (this._3dCachedTexture) this._3dCachedTexture.dispose();
          og();
        },
        _setTexture(og, textureData) {
          if (this._3dCachedTexture) {
            this._3dCachedTexture.dispose();
            this._3dCachedTexture = null;
            const returnValue = og(textureData);
            threed.getThreeTextureFromSkin(this);
            return returnValue;
          }
          return og(textureData);
        },
      });
    }

    updateRenderer() {
      // Schedule a 3D redraw
      renderer[THREED_DIRTY] = true;
      runtime.requestRedraw();
    }

    // pushes the current 3d render state into the drawable
    doUpdateRenderer() {
      this.init();
      this.renderer.render(this.scene, this.camera);

      if (!this.threeSkinId) return;

      this.threeSkin.setContent(
        this.renderer.domElement
      );
    }

    updateDrawableSkin(drawable) {
      if (drawable[OBJECT] && drawable[OBJECT].material) {
        drawable[OBJECT].material.map = this.getThreeTextureFromSkin(drawable.skin);
      }
    }


    /// MISC OBJECT UTILS ////

    getThreeTextureFromSkin(skin) {
      if (skin._3dCachedTexture) return skin._3dCachedTexture;
      skin._3dCachedTexture = new THREE.CanvasTexture(this.getCanvasFromSkin(skin));
      skin._3dCachedTexture.colorSpace = THREE.SRGBColorSpace;
      return skin._3dCachedTexture;
    }

    objectShape(obj) {
      let shape = null;
      if (obj.geometry) {
        if (obj.geometry instanceof THREE.SphereGeometry) {
          obj.geometry.computeBoundingSphere();
          shape = obj.geometry.boundingSphere;
        } else {
          obj.geometry.computeBoundingBox();
          shape = obj.geometry.boundingBox;
        }
      } else if (obj instanceof THREE.SPRITE) {
        const sx = obj.scale.x / 2;
        const sy = obj.scale.y / 2;

        shape = new THREE.Box3(
          new THREE.Vector3(-sx, -sy, -sx),
          new THREE.Vector3(sx, sy, -sx),
        );
      }
      return shape;
    }

    objectShapeTransformed(obj) {
      const shape = this.objectShape(obj);
      if (!shape) return null;
      shape.applyMatrix4(obj.matrixWorld);
      return shape;
    }

    touching3D(objA, objB) {
      const shapeA = this.objectShapeTransformed(objA);
      const shapeB = this.objectShapeTransformed(objB);
      if (!shapeA || !shapeB) return false;
      const nameB = (shapeB instanceof THREE.Sphere) ? "Sphere" : "Box";
      const func = shapeA["intersects" + nameB];
      if (!func) return false;
      return func.call(shapeA, shapeB);
    }

    /// MENUS
    
    // originally from clones plus: https://extensions.turbowarp.org/Lily/ClonesPlus.js
    getSprites() {
      let spriteNames = [];
      const targets = runtime.targets;
      for (let index = 1; index < targets.length; index++) {
        const curTarget = targets[index].sprite;
        if (targets[index].isOriginal) {
          const jsonOBJ = {
            text: curTarget.name,
            value: curTarget.name,
          };
          spriteNames.push(jsonOBJ);
        }
      }
      if (spriteNames.length > 0) {
        return spriteNames;
      } else {
        return [{ text: "", value: 0 }]; //this should never happen but it's a failsafe
      }
    }

    ///


    /// DRAWABLE STUFF ///

    // thanks stackoverflow
    // https://stackoverflow.com/a/18804083
    getCanvasFromTexture(gl, texture, width, height) {
      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

      const data = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

      gl.deleteFramebuffer(framebuffer);

      const imageData = new ImageData(width, height);
      imageData.data.set(data);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      context.putImageData(imageData, 0, 0);

      return canvas;
    }

    getCanvasFromSkin(skin) {
      const emptyCanvas = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        return canvas;
      }

      switch (skin.constructor) {
        case renderer.exports.BitmapSkin: {
          if (skin._textureSize[0] < 1 || skin._textureSize[1] < 1)
            return emptyCanvas();
          return this.getCanvasFromTexture(
            renderer.gl,
            skin.getTexture(),
            skin._textureSize[0],
            skin._textureSize[1]
          );
        }
        case renderer.exports.SVGSkin: {
          // code copy-pasted from scratch-render
          const INDEX_OFFSET = 8;

          const textureScale = 200;

          const scaleMax = textureScale ? Math.max(Math.abs(textureScale), Math.abs(textureScale)) : 100;
          const requestedScale = Math.min(scaleMax / 100, skin._maxTextureScale);
          const mipLevel = Math.max(Math.ceil(Math.log2(requestedScale)) + INDEX_OFFSET, 0);
          const mipScale = Math.pow(2, mipLevel - INDEX_OFFSET);

          const sizeX = Math.ceil(skin._size[0] * mipScale);
          const sizeY = Math.ceil(skin._size[1] * mipScale)
          if (sizeX < 1 || sizeY < 1)
            return emptyCanvas();

          return this.getCanvasFromTexture(
            renderer.gl,
            skin.getTexture([textureScale, textureScale]),
            sizeX,
            sizeY
          );
        }
        default:
          console.error("Could not get skin image data:", skin);
          throw new TypeError("Could not get skin image data");
      }
    }

    getSizeFromSkin(skin) {
      switch (skin.constructor) {
        case renderer.exports.BitmapSkin: {
          return [
            skin._textureSize[0],
            skin._textureSize[1]
          ];
        }
        case renderer.exports.SVGSkin: {
          return skin._size;
        }
        default:
          console.error("Could not get skin size:", skin);
          throw new TypeError("Could not get skin size");
      }
    }

    enable3DForDrawable(drawableID, type = "flat") {
      const dr = renderer._allDrawables[drawableID];
      if (dr[IN_3D]) return;

      dr[IN_3D] = true;

      let obj;
      if (type === "sprite") {
        obj = new THREE.Sprite();
      } else {
        obj = new THREE.Mesh();
      }
      dr[OBJECT] = obj;
      this.updateMeshForDrawable(drawableID, type);

      if (!(YAW in dr)) dr[YAW] = 0;
      if (!(PITCH in dr)) dr[PITCH] = 0;
      if (!(ROLL in dr)) dr[ROLL] = 0;
      if (!(Z_POS in dr)) dr[Z_POS] = 0;

      this.scene.add(obj);
      this.updateAttachment(dr);
      this.updateRenderer();
    }

    updateMeshForDrawable(drawableID, type) {
      const dr = renderer._allDrawables[drawableID];
      if (!dr[IN_3D]) return;
      const obj = dr[OBJECT];

      if (obj.isSprite) {
        if (obj.material) obj.material.dispose();
        obj.material = new THREE.SpriteMaterial();
        try {
          const size = this.getSizeFromSkin(dr.skin);
          obj._sizeX = size[0];
          obj._sizeY = size[1];
          obj._sizeZ = size[0];
        } catch (e) {
          console.error(e);
          obj._sizeX = 0;
          obj._sizeY = 0;
          obj._sizeZ = 0;
        }
      } else {
        obj.material = new THREE.MeshBasicMaterial();
        switch (type) {
          case "flat":
            obj.geometry = new THREE.PlaneGeometry(dr.skin.size[0], dr.skin.size[1]);
            break;
          case "flat triangle": {
              const geometry = new THREE.BufferGeometry();
              const w = dr.skin.size[0] / 2;
              const h = dr.skin.size[1] / 2;

              const vertices = new Float32Array([
                -w, -h, 0.0,
                w, -h, 0.0,
                -w, h, 0.0,
              ]);
              const uvs = new Float32Array([
                0, 0,
                1, 0,
                0, 1
              ]);
              geometry.setIndex([0, 1, 2]);
              geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
              geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
              obj.geometry = geometry;
          } break;
          case "cube":
            obj.geometry = new THREE.BoxGeometry(dr.skin.size[0], dr.skin.size[1], dr.skin.size[0]);
            break;
          case "sphere":
            obj.geometry = new THREE.SphereGeometry(Math.max(dr.skin.size[0], dr.skin.size[1]) / 2, 24, 12);
            break;
          case "low-poly sphere":
            obj.geometry = new THREE.SphereGeometry(Math.max(dr.skin.size[0], dr.skin.size[1]) / 2, 8, 6);
            break;
        }
        obj._sizeX = 1;
        obj._sizeY = 1;
        obj._sizeZ = 1;
      }

      if (obj?.material?.map) obj?.material?.map?.dispose();
      const texture = this.getThreeTextureFromSkin(dr.skin);
      obj.material.map = texture;
      texture.colorSpace = THREE.SRGBColorSpace;
      obj.material.alphaTest = 0.01;

      this.updateMaterialForDrawable(drawableID);

      // @ts-expect-error wrong type
      dr.updateScale(dr.scale);
    }

    updateMaterialForDrawable(drawableID) {
      const dr = renderer._allDrawables[drawableID];
      if (!dr[IN_3D]) return;
      const obj = dr[OBJECT];

      if (!(SIDE_MODE in dr)) dr[SIDE_MODE] = THREE.DoubleSide;
      if (!(TEX_FILTER in dr)) dr[TEX_FILTER] = THREE.LinearMipmapLinearFilter;

      obj.material.side = dr[SIDE_MODE];
      
      const texture = obj.material.map;
      texture.minFilter = dr[TEX_FILTER];
      texture.magFilter = dr[TEX_FILTER];
      if (texture.magFilter === THREE.LinearMipmapLinearFilter)
        texture.magFilter = THREE.LinearFilter;

      obj.material.transparent = true;
    }

    disable3DForDrawable(drawableID) {
      const dr = renderer._allDrawables[drawableID];
      if (!dr[IN_3D]) return;

      dr[IN_3D] = false;

      dr[Z_POS] = dr[OBJECT].position.z;

      dr[OBJECT].removeFromParent();
      dr[OBJECT].material.dispose();
      if (dr[OBJECT].material.map) dr[OBJECT].material.map.dispose();
      dr[OBJECT].geometry.dispose();
      dr[OBJECT] = null;
      this.updateRenderer();
    }


    /// BLOCKS ///

    setMode({ MODE }, util) {
      if (util.target.isStage) return;

      this.init();
      switch (MODE) {
        case "disabled":
          this.disable3DForDrawable(util.target.drawableID);
          break;
        case "flat":
        case "flat triangle":
        case "sprite":
        case "cube":
        case "sphere":
        case "low-poly sphere":
          this.disable3DForDrawable(util.target.drawableID);
          this.enable3DForDrawable(util.target.drawableID, MODE);
          if (util.target.renderer) {
            // Update properties
            this.refreshThreeDrawable(util.target);
          }
          break;
      }
    }

    refreshThreeDrawable(target) {
      const {direction, scale} = target._getRenderedDirectionAndScale();
      const dr = target.renderer._allDrawables[target.drawableID];
      dr.updatePosition([target.x, target.y]);
      dr.updateDirection(direction);
      dr.updateScale(scale);
      dr.updateVisible(target.visible);
      if (dr[OBJECT]) {
        dr[OBJECT].position.z = dr[Z_POS];
      }
      this.updateSpriteAngle({target});
    }

    setZ({ Z }, util) {
      if (util.target.isStage) return;

      const dr = renderer._allDrawables[util.target.drawableID];
      if (!dr[IN_3D]) return;

      dr[OBJECT].position.z = Scratch.Cast.toNumber(Z);
      this.updateRenderer();
    }

    changeZ({ Z }, util) {
      if (util.target.isStage) return;

      const dr = renderer._allDrawables[util.target.drawableID];
      if (!dr[IN_3D]) return;

      const z = Scratch.Cast.toNumber(Z);
      dr[OBJECT].position.z += z;
      this.updateRenderer();
    }

    getZ(args, util) {
      if (util.target.isStage) return 0;

      const dr = renderer._allDrawables[util.target.drawableID];
      if (!dr[OBJECT]) return 0;
      return dr[OBJECT].position.z;
    }

    mod(n, modulus) {
      let result = n % modulus;
      // Scratch mod uses floored division instead of truncated division.
      if (result / modulus < 0) result += modulus;
      return result;
    }

    wrapClamp(n, min, max) {
      const offset = n - min;
      const range = max - min;
      return min + this.mod(offset, range);
    }

    updateSpriteAngle(util) {
      let dr;
      if (util?.target) {
        if (util.target.isStage) return;
        dr = renderer._allDrawables[util.target.drawableID];
      } else {
        dr = util;
      }

      if (!dr[IN_3D]) return;
      const obj = dr[OBJECT];

      obj.rotation.x = 0;
      obj.rotation.y = 0;
      obj.rotation.z = 0;

      const WRAP_MIN = THREE.MathUtils.degToRad(-180);
      const WRAP_MAX = THREE.MathUtils.degToRad(180);
      dr[YAW] = this.wrapClamp(dr[YAW], WRAP_MIN, WRAP_MAX);
      dr[PITCH] = this.wrapClamp(dr[PITCH], WRAP_MIN, WRAP_MAX);
      dr[ROLL] = this.wrapClamp(dr[ROLL], WRAP_MIN, WRAP_MAX);

      obj.rotation.y = dr[YAW];
      obj.rotateOnAxis(
        new THREE.Vector3(1, 0, 0),
        dr[PITCH]
      );
      obj.rotateOnAxis(
        new THREE.Vector3(0, 0, 1),
        THREE.MathUtils.degToRad(90) - dr[ROLL]
      );
    }

    set3DPos({X, Y, Z}, util) {
      if (util.target.isStage) return;

      X = Scratch.Cast.toNumber(X);
      Y = Scratch.Cast.toNumber(Y);
      util.target.setXY(X, Y);
      this.setZ({Z}, util);
    }

    change3DPos({X, Y, Z}, util) {
      if (util.target.isStage) return;
      const dx = Scratch.Cast.toNumber(X);
      const dy = Scratch.Cast.toNumber(Y);
      util.target.setXY(util.target.x + dx, util.target.y + dy);

      this.changeZ({Z}, util);
    }
    
    moveSteps({STEPS}, util) {
      if (util.target.isStage) return;
      const dr = renderer._allDrawables[util.target.drawableID];
      if (!dr[IN_3D]) return;
      
      const add = new THREE.Vector3(0, 0, 1)
          .applyQuaternion(dr[OBJECT].quaternion)
          .multiplyScalar(-Scratch.Cast.toNumber(STEPS));
      
      util.target.setXY(util.target.x + add.x, util.target.y + add.y);
      this.changeZ({Z: add.z}, util);
      
      this.updateRenderer();
    }

    rotate3D({DIRECTION, DEGREES}, util) {
      if (util.target.isStage) return;
      const dr = renderer._allDrawables[util.target.drawableID];

      if (!dr[IN_3D]) return;

      if (!isFinite(DEGREES)) return;

      DEGREES = Scratch.Cast.toNumber(DEGREES) *
        ((DIRECTION === "left" || DIRECTION === "down" || DIRECTION === "ccw") ? -1 : 1);

      switch (DIRECTION) {
        case "left":
        case "right":
          dr[YAW] -= THREE.MathUtils.degToRad(DEGREES);
          break;
        case "up":
        case "down":
          dr[PITCH] += THREE.MathUtils.degToRad(DEGREES);
          break;
        case "cw":
        case "ccw":
          util.target.setDirection(util.target.direction + DEGREES);
          break;
      }
      this.updateSpriteAngle(util);
      this.updateRenderer();
    }

    set3DDir({DIRECTION, DEGREES}, util) {
      if (util.target.isStage) return;
      const dr = renderer._allDrawables[util.target.drawableID];

      if (!dr[IN_3D]) return;

      DEGREES = Scratch.Cast.toNumber(DEGREES);

      if (!isFinite(DEGREES)) return;

      switch (DIRECTION) {
        case "y":
        case "angle": // Old versions of the extension used angle/aim/roll instead of rotation around Y/X/Z
          dr[YAW] = -THREE.MathUtils.degToRad(DEGREES);
          break;
        case "x":
        case "aim":
          dr[PITCH] = THREE.MathUtils.degToRad(DEGREES);
          break;
        case "z":
        case "roll":
          util.target.setDirection(DEGREES + 90);
          break;
      }
      this.updateSpriteAngle(util);
      this.updateRenderer();
    }

    direction3D({DIRECTION}, util) {
      if (util.target.isStage) return 0;
      const dr = renderer._allDrawables[util.target.drawableID];
      if (!dr[IN_3D]) return 0;

      switch (DIRECTION) {
        case "y":
        case "angle":
          return -THREE.MathUtils.radToDeg(dr[YAW]);
        case "x":
        case "aim":
          return THREE.MathUtils.radToDeg(dr[PITCH]);
        case "z":
        case "roll":
          return THREE.MathUtils.radToDeg(dr[ROLL]) - 90;
        default:
          return 0;
      }
    }

    setSideMode({SIDE}, util) {
      if (util.target.isStage) return;
      const dr = renderer._allDrawables[util.target.drawableID];

      this.init();

      const sides = Object.assign(Object.create(null), {
        front: THREE.FrontSide,
        back: THREE.BackSide,
        both: THREE.DoubleSide
      });
      if (!(SIDE in sides)) return;
      dr[SIDE_MODE] = sides[SIDE];
      if (dr[OBJECT] && dr[OBJECT].material) {
        dr[OBJECT].material.side = sides[SIDE];
        this.updateRenderer();
      }
    }

    updateAttachment(dr) {
      if (!this.scene) return;
      if (dr[IN_3D]) {
        const newParent = dr[ATTACHED_TO]?.[OBJECT] || this.scene;
        if (dr[OBJECT].parent !== newParent) {
          dr[OBJECT].removeFromParent();
          newParent.add(dr[OBJECT]);
          this.updateRenderer();
        }
      }
    }
    
    attach({TARGET}, util) {
      if (util.target.isStage) return;
      const targetObj = runtime.getSpriteTargetByName(Scratch.Cast.toString(TARGET));
      if (!targetObj) return;
      const dr = renderer._allDrawables[util.target.drawableID];
      const targetDr = renderer._allDrawables[targetObj.drawableID];
      if (dr === targetDr) return;

      dr[ATTACHED_TO] = targetDr;
      this.updateAttachment(dr);
    }
    
    attachVar({VARIABLE, VALUE}, util) {
      if (util.target.isStage) return;
      VARIABLE = Scratch.Cast.toString(VARIABLE);
      VALUE = Scratch.Cast.toString(VALUE);

      const dr = renderer._allDrawables[util.target.drawableID];
      let targetDr = undefined;
      for (const target of runtime.targets) {
        const variable = target.lookupVariableByNameAndType(VARIABLE, "", true);
        if (variable && Scratch.Cast.toString(variable?.value) === VALUE) {
          targetDr = target.isStage ? null : renderer._allDrawables[target.drawableID];
          break;
        }
      }
      if (targetDr === undefined) return;
      if (dr === targetDr) return;
      dr[ATTACHED_TO] = targetDr;
      this.updateAttachment(dr);
    }
    
    detach(args, util) {
      if (util.target.isStage) return;
      const dr = renderer._allDrawables[util.target.drawableID];
      dr[ATTACHED_TO] = null;

      this.updateAttachment(dr);
    }

    getAttachedSprite(dr) {
      if (!dr[IN_3D] || !dr[ATTACHED_TO]) return null;
      const attachedId = dr[ATTACHED_TO].id;
      const attachedSprite = runtime.targets.find(target => target.drawableID === attachedId);
      if (!attachedSprite) return null;
      return attachedSprite
    }

    attachedSprite(args, util) {
      if (util.target.isStage) return "";

      const attachedSprite = this.getAttachedSprite(renderer._allDrawables[util.target.drawableID]);
      if (!attachedSprite) return "";
      return attachedSprite.sprite.name;
    }

    attachedSpriteVar({VARIABLE}, util) {
      if (util.target.isStage) return "";

      const attachedSprite = this.getAttachedSprite(renderer._allDrawables[util.target.drawableID]);
      if (!attachedSprite) return "";

      VARIABLE = Scratch.Cast.toString(VARIABLE);
      return attachedSprite.lookupVariableByNameAndType(VARIABLE, "", true)?.value ?? "";
    }

    setTexFilter({FILTER}, util) {
      if (util.target.isStage) return;
      const dr = renderer._allDrawables[util.target.drawableID];

      this.init();

      const filters = Object.assign(Object.create(null), {
        nearest: THREE.NearestFilter,
        linear: THREE.LinearMipmapLinearFilter,
      });
      if (!(FILTER in filters)) return;
      dr[TEX_FILTER] = filters[FILTER];
      if (dr[OBJECT] && dr[OBJECT].material?.map) {
        // i think for some reason you need to create a new texture
        const cloned = dr[OBJECT].material.map.clone();
        dr[OBJECT].material.map.dispose();
        cloned.colorSpace = THREE.SRGBColorSpace;
        dr[OBJECT].material.map = cloned;
        cloned.needsUpdate = true;
        this.updateMaterialForDrawable(util.target.drawableID)
        this.updateRenderer();
      }
    }

    preUpdateCameraAngle() {
      if (!(YAW in this.camera)) this.camera[YAW] = 0;
      if (!(PITCH in this.camera)) this.camera[PITCH] = 0;
      if (!(ROLL in this.camera)) this.camera[ROLL] = 0;
    }

    updateCameraAngle() {
      this.camera.rotation.x = 0;
      this.camera.rotation.y = 0;
      this.camera.rotation.z = 0;

      const WRAP_MIN = THREE.MathUtils.degToRad(-180);
      const WRAP_MAX = THREE.MathUtils.degToRad(180);
      this.camera[YAW] = this.wrapClamp(this.camera[YAW], WRAP_MIN, WRAP_MAX);
      this.camera[PITCH] = this.wrapClamp(this.camera[PITCH], WRAP_MIN, WRAP_MAX);
      this.camera[ROLL] = this.wrapClamp(this.camera[ROLL], WRAP_MIN, WRAP_MAX);

      this.camera.rotation.y = this.camera[YAW];
      this.camera.rotateOnAxis(
        new THREE.Vector3(1, 0, 0),
        this.camera[PITCH]
      );
      this.camera.rotateOnAxis(
        new THREE.Vector3(0, 0, 1),
        this.camera[ROLL]
      );
    }

    setCam({ X, Y, Z }, util) {
      this.init();

      const x = Scratch.Cast.toNumber(X);
      const y = Scratch.Cast.toNumber(Y);
      const z = Scratch.Cast.toNumber(Z);
      this.camera.position.set(x, y, z);
      this.updateRenderer();
    }
    changeCam({ X, Y, Z }, util) {
      this.init();

      const x = Scratch.Cast.toNumber(X);
      const y = Scratch.Cast.toNumber(Y);
      const z = Scratch.Cast.toNumber(Z);
      const pos = this.camera.position;
      pos.set(pos.x + x, pos.y + y, pos.z + z);
      this.updateRenderer();
    }
    camX(args, util) {
      this.init();
      return this.camera.position.x;
    }
    camY(args, util) {
      this.init();
      return this.camera.position.y;
    }
    camZ(args, util) {
      this.init();
      return this.camera.position.z;
    }

    moveCamSteps({STEPS}, util) {
      this.init();
      
      this.camera.position.add(
        new THREE.Vector3(0, 0, 1)
          .applyQuaternion(this.camera.quaternion)
          .multiplyScalar(-Scratch.Cast.toNumber(STEPS))
      );
      this.updateRenderer();
    }

    rotateCam({ DIRECTION, DEGREES }) {
      this.init();

      DEGREES = Scratch.Cast.toNumber(DEGREES) *
        ((DIRECTION === "left" || DIRECTION === "down" || DIRECTION === "ccw") ? -1 : 1);

      this.preUpdateCameraAngle();
      switch (DIRECTION) {
        case "left":
        case "right":
          this.camera[YAW] -= THREE.MathUtils.degToRad(DEGREES);
          break;
        case "up":
        case "down":
          this.camera[PITCH] += THREE.MathUtils.degToRad(DEGREES);
          break;
        case "cw":
        case "ccw":
          this.camera[ROLL] += THREE.MathUtils.degToRad(DEGREES);
          break;
      }
      this.updateCameraAngle();
      this.updateRenderer();
    }
    setCamDir({ DEGREES, DIRECTION }, util) {
      this.init();

      DEGREES = Scratch.Cast.toNumber(DEGREES);

      this.preUpdateCameraAngle();
      switch (DIRECTION) {
        case "y":
        case "angle":
          this.camera[YAW] = -THREE.MathUtils.degToRad(DEGREES);
          break;
        case "x":
        case "aim":
          this.camera[PITCH] = THREE.MathUtils.degToRad(DEGREES);
          break;
        case "z":
        case "roll":
          this.camera[ROLL] = THREE.MathUtils.degToRad(DEGREES);
          break;
      }
      this.updateCameraAngle();

      this.updateRenderer();
    }
    camDir({ DIRECTION }, util) {
      this.init();

      this.preUpdateCameraAngle();
      switch (DIRECTION) {
        case "y":
        case "angle":
          return -THREE.MathUtils.radToDeg(this.camera[YAW]);
        case "x":
        case "aim":
          return THREE.MathUtils.radToDeg(this.camera[PITCH]);
        case "z":
        case "roll":
          return THREE.MathUtils.radToDeg(this.camera[ROLL]);
        default:
          return 0;
      }
    }

    setCameraParam({PARAM, VALUE}) {
      this.init();

      PARAM = Scratch.Cast.toString(PARAM);
      switch (PARAM) {
        case "minimum render distance":
          VALUE = Math.max(Scratch.Cast.toNumber(VALUE), 0.1);
          this.camera.near = VALUE;
          break;
        case "maximum render distance":
          VALUE = Math.min(Scratch.Cast.toNumber(VALUE), 4800000);
          this.camera.far = VALUE;
          break;
        case "vertical FOV":
          VALUE = Math.min(Math.max(Scratch.Cast.toNumber(VALUE), 0.001), 36000)
          this.camera.fov = VALUE;
          break;
        default:
          return;
      }

      this.camera.updateProjectionMatrix();
      this.updateRenderer();
    }
    
    getCameraParam({PARAM}) {
      this.init();

      PARAM = Scratch.Cast.toString(PARAM);
      switch (PARAM) {
        case "minimum render distance":
          return this.camera.near;
        case "maximum render distance":
          return this.camera.far;
        case "vertical FOV":
          return this.camera.fov;
      }
      return "";
    }
  }

  // @ts-expect-error - i have no idea
  Scratch.extensions.register(new ThreeD());
})(Scratch);
