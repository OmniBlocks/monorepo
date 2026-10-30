// Name: Stretch
// ID: stretch
// Description: Stretch sprites horizontally or vertically.
// License: MIT AND MPL-2.0

/* generated l10n code */Scratch.translate.setup({"de":{"_Stretch":"Strecken"},"fi":{"_Stretch":"Venytä","_change stretch by x: [DX] y: [DY]":"muuta venytystä arvoilla x: [DX] y: [DY]","_change stretch x by [DX]":"lisää x-venytystä arvolla [DX]","_change stretch y by [DY]":"lisää y-venytystä arvolla [DY]","_set stretch to x: [X] y: [Y]":"aseta venytys x: [X] y: [Y]","_set stretch x to [X]":"aseta x-venytys arvoon [X]","_set stretch y to [Y]":"aseta y-venytys arvoon [Y]","_x stretch":"x-venytys","_y stretch":"y-venytys"},"it":{"_Stretch":"Stira","_change stretch by x: [DX] y: [DY]":"cambia deformazione di x: [DX] y: [DY]","_change stretch x by [DX]":"cambia deformazione x di [DX]","_change stretch y by [DY]":"cambia deformazione y di [DY]","_set stretch to x: [X] y: [Y]":"imposta deformazione a x: [X] y: [Y]","_set stretch x to [X]":"porta deformazione x a [X]","_set stretch y to [Y]":"porta deformazione y a [Y]","_x stretch":"deformazione x","_y stretch":"deformazione y"},"ja":{"_Stretch":"伸縮","_change stretch by x: [DX] y: [DY]":"x座標の伸縮を[DX]、y座標の伸縮を[DY]ずつ変える","_change stretch x by [DX]":"x座標の伸縮を[DX]ずつ変える","_change stretch y by [DY]":"y座標の伸縮を[DY]ずつ変える","_set stretch to x: [X] y: [Y]":"x座標の伸縮を[X]、y座標の伸縮を[Y]にする","_set stretch x to [X]":"x座標の伸縮を[X]にする","_set stretch y to [Y]":"y座標の伸縮を[Y]にする","_x stretch":"x座標の伸縮","_y stretch":"y座標の伸縮"},"ko":{"_Stretch":"늘리기","_change stretch by x: [DX] y: [DY]":"늘리기를 x:[DX] y:[DY] 만큼 바꾸기","_change stretch x by [DX]":"늘리기 x를 [DX]만큼 바꾸기","_change stretch y by [DY]":"늘리기 y를 [DY]만큼 바꾸기","_set stretch to x: [X] y: [Y]":"늘리기를 x:[X] y:[Y] (으)로 정하기","_set stretch x to [X]":"늘리기 x를 [X](으)로 정하기","_set stretch y to [Y]":"늘리기 y를 [Y](으)로 정하기","_x stretch":"늘리기 x","_y stretch":"늘리기 y"},"nb":{"_Stretch":"Strekke","_change stretch by x: [DX] y: [DY]":"endre strekk med x: [DX] y: [DY]","_change stretch x by [DX]":"endre strekk x med [DX]","_change stretch y by [DY]":"endre strekk y med [DY]","_set stretch to x: [X] y: [Y]":"sett strekk til x: [X] y: [Y]","_set stretch x to [X]":"sett strekk x til [X]","_set stretch y to [Y]":"sett strekk y til [Y]","_x stretch":"x strekk","_y stretch":"y strekk"},"nl":{"_Stretch":"Rekken","_change stretch by x: [DX] y: [DY]":"verander uitrekking met x: [DX] y: [DY]","_change stretch x by [DX]":"verander x-uitrekking met [DX]","_change stretch y by [DY]":"verander y-uitrekking met [DY]","_set stretch to x: [X] y: [Y]":"stel uitrekking in op x: [X] y: [Y]","_set stretch x to [X]":"maak x-uitrekking [X]","_set stretch y to [Y]":"maak y-uitrekking [Y]","_x stretch":"x-uitrekking","_y stretch":"y-uitrekking"},"ru":{"_Stretch":"Растяжение","_change stretch by x: [DX] y: [DY]":"изменить растяжение на x: [DX] y: [DY]","_change stretch x by [DX]":"изменить растяжение x на [DX]","_change stretch y by [DY]":"изменить растяжение y на [DY]","_set stretch to x: [X] y: [Y]":"задать растяжение в x: [X] y: [Y]","_set stretch x to [X]":"задать растяжение x в [X]","_set stretch y to [Y]":"задать растяжение y в [Y]","_x stretch":"растяжение x","_y stretch":"растяжение y"},"uk":{"_Stretch":"Розтяжка"},"zh-cn":{"_Stretch":"角色拉伸","_change stretch by x: [DX] y: [DY]":"增加角色拉伸x [DX] y [DY]","_change stretch x by [DX]":"x拉伸增加[DX]","_change stretch y by [DY]":"y拉伸增加[DY]","_set stretch to x: [X] y: [Y]":"将角色拉伸设为x：[X]y：[Y]","_set stretch x to [X]":"将x拉伸设为[X]","_set stretch y to [Y]":"将y拉伸设为[Y]","_x stretch":"x拉伸","_y stretch":"y拉伸"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  const STRETCH_X = Symbol("stretch.x");
  const STRETCH_Y = Symbol("stretch.y");

  const vm = Scratch.vm;

  /**
   * @param {VM.RenderedTarget} target
   * @param {VM.RenderedTarget} [originalTarget] If target is a clone, the original to copy from.
   */
  const implementStretchForTarget = (target, originalTarget) => {
    if (STRETCH_X in target) {
      // Target already has stretch. Don't implement again.
      return;
    }

    target[STRETCH_X] = originalTarget ? originalTarget[STRETCH_X] : 100;
    target[STRETCH_Y] = originalTarget ? originalTarget[STRETCH_Y] : 100;

    const original = target._getRenderedDirectionAndScale;
    target._getRenderedDirectionAndScale = function () {
      const result = original.call(this);

      result.scale[0] *= this[STRETCH_X] / 100;
      result.scale[1] *= this[STRETCH_Y] / 100;

      return result;
    };
  };
  vm.runtime.targets.forEach((target) => implementStretchForTarget(target));
  vm.runtime.on("targetWasCreated", (target, originalTarget) =>
    implementStretchForTarget(target, originalTarget)
  );
  vm.runtime.on("PROJECT_LOADED", () => {
    vm.runtime.targets.forEach((target) => implementStretchForTarget(target));
  });

  /**
   * @param {VM.RenderedTarget} target
   */
  const forceUpdateDirectionAndScale = (target) => {
    target.setDirection(target.direction);
  };

  class Stretch {
    getInfo() {
      return {
        id: "stretch",
        name: Scratch.translate("Stretch"),
        color1: "#4287f5",
        color2: "#2b62ba",
        color3: "#204785",
        blocks: [
          {
            opcode: "setStretch",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set stretch to x: [X] y: [Y]"),
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
              },
            },
            filter: [Scratch.TargetType.SPRITE],
          },
          {
            opcode: "changeStretch",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("change stretch by x: [DX] y: [DY]"),
            arguments: {
              DX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              DY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },

          "---",

          {
            opcode: "setStretchX",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set stretch x to [X]"),
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
              },
            },
            filter: [Scratch.TargetType.SPRITE],
          },
          {
            opcode: "setStretchY",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set stretch y to [Y]"),
            arguments: {
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
              },
            },
            filter: [Scratch.TargetType.SPRITE],
          },
          {
            opcode: "changeStretchX",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("change stretch x by [DX]"),
            arguments: {
              DX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
            },
          },
          {
            opcode: "changeStretchY",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("change stretch y by [DY]"),
            arguments: {
              DY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
            },
          },

          "---",

          {
            opcode: "getX",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("x stretch"),
            filter: [Scratch.TargetType.SPRITE],
            disableMonitor: true,
          },
          {
            opcode: "getY",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("y stretch"),
            filter: [Scratch.TargetType.SPRITE],
            disableMonitor: true,
          },
        ],
      };
    }
    setStretch(args, util) {
      util.target[STRETCH_X] = Scratch.Cast.toNumber(args.X);
      util.target[STRETCH_Y] = Scratch.Cast.toNumber(args.Y);
      forceUpdateDirectionAndScale(util.target);
    }
    changeStretch(args, util) {
      util.target[STRETCH_X] += Scratch.Cast.toNumber(args.DX);
      util.target[STRETCH_Y] += Scratch.Cast.toNumber(args.DY);
      forceUpdateDirectionAndScale(util.target);
    }
    setStretchX(args, util) {
      util.target[STRETCH_X] = Scratch.Cast.toNumber(args.X);
      forceUpdateDirectionAndScale(util.target);
    }
    setStretchY(args, util) {
      util.target[STRETCH_Y] = Scratch.Cast.toNumber(args.Y);
      forceUpdateDirectionAndScale(util.target);
    }
    changeStretchX(args, util) {
      util.target[STRETCH_X] += Scratch.Cast.toNumber(args.DX);
      forceUpdateDirectionAndScale(util.target);
    }
    changeStretchY(args, util) {
      util.target[STRETCH_Y] += Scratch.Cast.toNumber(args.DY);
      forceUpdateDirectionAndScale(util.target);
    }
    getX(args, util) {
      return util.target[STRETCH_X];
    }
    getY(args, util) {
      return util.target[STRETCH_Y];
    }
  }

  Scratch.extensions.register(new Stretch());
})(Scratch);
