// Name: Color Picker
// ID: shovelColorPicker
// Description: Access your system's color picker.
// By: TheShovel
// License: MIT

/* generated l10n code */Scratch.translate.setup({"de":{"_Color Picker":"Farbwähler"},"fi":{"_Color Picker":"Värinvalitsin","_blue":"sini","_color [TYPE] value":"värin [TYPE]arvo","_green":"viher","_hex":"heksadesimaali","_picker [COORD] position":"valitsimen [COORD]-sijainti","_red":"puna","_set picker color to [COLOR]":"aseta valitsimen väriksi [COLOR]","_set picker position to x: [X] y: [Y]":"aseta valitsimen sijainniksi x: [X] y: [Y]","_show color picker":"näytä värinvalitsin","_when color changed":"kun väri muuttuu"},"it":{"_Color Picker":"Contagocce","_blue":"blu","_color [TYPE] value":"valore colore [TYPE]","_green":"verde","_picker [COORD] position":"posizione contagocce [COORD]","_red":"rosso","_set picker color to [COLOR]":"Importa colore contagocce a [COLOR]","_set picker position to x: [X] y: [Y]":"porta contagocce a x: [X] y: [Y]","_show color picker":"mostra contagocce","_when color changed":"quando cambia il colore"},"ja":{"_Color Picker":"カラーピッカー","_blue":"青","_color [TYPE] value":"色[TYPE]の値","_green":"緑","_picker [COORD] position":"カラーピッカーの[COORD]座標","_red":"赤","_set picker color to [COLOR]":"カラーピッカーを[COLOR]色にする","_set picker position to x: [X] y: [Y]":"カラーピッカーの場所のx座標を[X]、y座標を[Y]にする","_show color picker":"カラーピッカーを表示する","_when color changed":"色が変わったとき"},"ko":{"_Color Picker":"색상 선택기","_blue":"Blue","_color [TYPE] value":"선택기 색상의 [TYPE]값","_green":"Green","_hex":"Hex코드","_picker [COORD] position":"선택기의 [COORD]좌표 값","_red":"Red","_set picker color to [COLOR]":"선택기 색상을 [COLOR](으)로 정하기","_set picker position to x: [X] y: [Y]":"선택기를 x:[X] y:[Y] (으)로 이동하기","_show color picker":"색상 선택기 보이기","_when color changed":"색상이 바뀌었을 때"},"nb":{"_Color Picker":"Fargevelger"},"nl":{"_Color Picker":"Kleurenkiezer","_blue":"blauw","_green":"groen","_red":"rood"},"pl":{"_blue":"niebieski","_green":"zielony","_red":"czerwony"},"ru":{"_Color Picker":"Подбиратель Цвета","_blue":"синий","_color [TYPE] value":"значение цвета [TYPE]","_green":"зелёный","_picker [COORD] position":"позиция подбора цвета [COORD]","_red":"красный","_set picker color to [COLOR]":"задать значение для подбора цвета [COLOR]","_set picker position to x: [X] y: [Y]":"задать позицию x: [X] y: [Y] подбора","_show color picker":"показать подбор цвета","_when color changed":"когда цвет изменён"},"tr":{"_Color Picker":"Renk Seçici"},"zh-cn":{"_Color Picker":"颜色选取器","_blue":"蓝色","_color [TYPE] value":"颜色[TYPE]值","_green":"绿色","_hex":"Hex","_picker [COORD] position":"取色器[COORD]坐标","_red":"红色","_set picker color to [COLOR]":"将取色器的颜色设为[COLOR]","_set picker position to x: [X] y: [Y]":"将取色器位置x：[X]y：[Y]","_show color picker":"颜色选取器","_when color changed":"当颜色改变"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  const input = document.createElement("input");
  input.type = "color";
  input.value = "#9966ff"; // default scratch-paint color
  input.style.pointerEvents = "none";
  input.style.width = "1px";
  input.style.height = "1px";
  input.style.visibility = "hidden";
  Scratch.renderer.addOverlay(input, "scale-centered");

  input.addEventListener("input", () => {
    Scratch.vm.runtime.startHats("shovelColorPicker_whenChanged");
  });

  let wasMovedThisTick = false;
  Scratch.vm.runtime.on("AFTER_EXECUTE", () => {
    // browser will relayout will happen automatically at the end of the frame; we won't need to do anything
    wasMovedThisTick = false;
  });

  let x = 0;
  let y = 0;
  const updatePosition = () => {
    input.style.transform = `translate(${x}px, ${-y}px)`;
    wasMovedThisTick = true;
  };
  updatePosition();

  class ColorPicker {
    getInfo() {
      return {
        id: "shovelColorPicker",
        name: Scratch.translate("Color Picker"),
        color1: "#ff7db5",
        color2: "#e0649a",
        color3: "#c14d7f",
        blocks: [
          {
            opcode: "showPicker",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("show color picker"),
          },
          {
            opcode: "setPos",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set picker position to x: [X] y: [Y]"),
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
          },
          {
            opcode: "setColor",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set picker color to [COLOR]"),
            arguments: {
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: "#855CD6",
              },
            },
          },
          {
            opcode: "getColor",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("color [TYPE] value"),
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "RGBMenu",
              },
            },
          },
          {
            opcode: "getPos",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("picker [COORD] position"),
            arguments: {
              COORD: {
                type: Scratch.ArgumentType.STRING,
                menu: "POSMenu",
              },
            },
          },
          {
            opcode: "whenChanged",
            blockType: Scratch.BlockType.EVENT,
            isEdgeActivated: false,
            text: Scratch.translate("when color changed"),
          },
        ],
        menus: {
          RGBMenu: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate({
                  default: "hex",
                  description: "Referring to a hex color code like #ff4c4c",
                }),
                value: "hex",
              },
              { text: Scratch.translate("red"), value: "red" },
              { text: Scratch.translate("green"), value: "green" },
              { text: Scratch.translate("blue"), value: "blue" },
            ],
          },
          POSMenu: {
            acceptReporters: true,
            items: ["X", "Y"],
          },
        },
      };
    }

    setColor(args) {
      input.value = args.COLOR;
    }

    getColorHEX() {
      return input.value;
    }

    showPicker() {
      // force re-layout if input was moved in the same tick, otherwise in Chrome it will appear in the old location
      // this can be slow, so we avoid it when we can
      if (wasMovedThisTick) {
        input.getBoundingClientRect();
        wasMovedThisTick = false;
      }
      input.click();
    }

    getColor(args) {
      if (args.TYPE === "hex") {
        return input.value;
      } else if (args.TYPE == "red") {
        return Scratch.Cast.toRgbColorObject(input.value).r;
      } else if (args.TYPE == "green") {
        return Scratch.Cast.toRgbColorObject(input.value).g;
      } else if (args.TYPE == "blue") {
        return Scratch.Cast.toRgbColorObject(input.value).b;
      } else {
        return "";
      }
    }

    setPos(args) {
      const newX = Scratch.Cast.toNumber(args.X);
      const newY = Scratch.Cast.toNumber(args.Y);
      if (x !== newX || y !== newY) {
        x = newX;
        y = newY;
        updatePosition();
      }
    }

    getPos(args) {
      if (args.COORD == "X") {
        return x;
      } else if (args.COORD == "Y") {
        return y;
      } else {
        return "";
      }
    }
  }

  Scratch.extensions.register(new ColorPicker());
  // @ts-ignore
})(Scratch);
