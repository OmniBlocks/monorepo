// Name: Gamepad
// ID: Gamepad
// Description: Directly access gamepads instead of just mapping buttons to keys.
// License: MIT AND MPL-2.0

// Some parts of this scripts are based on or designed to be compatible-ish with:
// https://arpruss.github.io/gamepad.js (MIT Licensed)

/* generated l10n code */Scratch.translate.setup({"fi":{"_D-pad down (14)":"D-ohjain alhaalla (14)","_D-pad left (15)":"D-ohjain vasemmalla (15)","_D-pad right (16)":"D-ohjain oikealla (16)","_D-pad up (13)":"D-ohjain ylhäällä (13)","_Gamepad":"Peliohjain","_Left bumper (5)":"vasen bumper-painike (5)","_Left stick (1 & 2)":"vasen sauva (1 ja 2)","_Left stick (11)":"vasen sauva (11)","_Left stick horizontal (1)":"vasen sauva vaakasuunnassa (1)","_Left stick vertical (2)":"vasen sauva pystysuunnassa (2)","_Left trigger (7)":"vasen liipaisin (7)","_Right bumper (6)":"oikea bumper-painike (6)","_Right stick (12)":"oikea sauva (12)","_Right stick (3 & 4)":"oikea sauva (3 ja 4)","_Right stick horizontal (3)":"oikea sauva vaakasuunnassa (3)","_Right stick vertical (4)":"oikea sauva pystysuunnassa (4)","_Right trigger (8)":"oikea liipaisin (8)","_Select/View (9)":"valinta/näkymä (9)","_Start/Menu (10)":"aloitus/valikko (10)","_any":"mikä tahansa","_button [b] on pad [i] pressed?":"painetaanko ohjaimen [i] painiketta [b]?","_direction of axes [axis] on pad [pad]":"ohjaimen [pad] kiertoakselin [axis] suunta","_gamepad [pad] connected?":"onko peliohjain [pad] yhdistetty?","_magnitude of axes [axis] on pad [pad]":"ohjaimen [pad] kiertoakselin [axis] voima","_rumble strong [s] and weak [w] for [t] sec. on pad [i]":"jymistä ohjainta [i] vahvasti [s] ja heikosti [w] [t] sekunnin ajan","_set axis deadzone to [DEADZONE]":"aseta ohjaimen tyhjän alueen akseliksi [DEADZONE]","_value of axis [b] on pad [i]":"ohjaimen [i] kiertoakselin [b] arvo","_value of button [b] on pad [i]":"ohjaimen [i] painikkeen [b] arvo"},"it":{"_D-pad down (14)":"Tasto direzionale giù (14)","_D-pad left (15)":"Tasto direzionale sinistra (15)","_D-pad right (16)":"Tasto direzionale destra (16)","_D-pad up (13)":"Tasto direzionale su (13)","_Left bumper (5)":"Pulsante dorsale sinistro (5)","_Left stick (1 & 2)":"Levetta sinistra (1 & 2)","_Left stick (11)":"Levetta sinistra (11)","_Left stick horizontal (1)":"Levetta sinistra orizzontale (1)","_Left stick vertical (2)":"Levetta sinistra verticale (2)","_Left trigger (7)":"Grilleto sinistro (7)","_Right bumper (6)":"Pulsante dorsale destro (6)","_Right stick (12)":"Levetta destra (12)","_Right stick (3 & 4)":"Levetta destra (3 & 4)","_Right stick horizontal (3)":"Levetta destra orizzontale (3)","_Right stick vertical (4)":"Levetta destra verticale (4)","_Right trigger (8)":"Grilleto destro (8)","_Select/View (9)":"Seleziona/Visualizza (9)","_Start/Menu (10)":"Inizia/Menu (10)","_any":"qualunque","_button [b] on pad [i] pressed?":"pulsante [b] del pad [i] premuto","_direction of axes [axis] on pad [pad]":"direzione degli assi [axis] del pad [pad]","_gamepad [pad] connected?":"gamepad [pad] connesso","_magnitude of axes [axis] on pad [pad]":"valore degli assi [axis] del pad [pad]","_rumble strong [s] and weak [w] for [t] sec. on pad [i]":"vibrazione forte [s] e piano [w] per [t] sec. sul pad [i]","_set axis deadzone to [DEADZONE]":"imposta deadzone degli assi a [DEADZONE]","_value of axis [b] on pad [i]":"valore dell'asse [b] del pad [i]","_value of button [b] on pad [i]":"valore del pulsante [b] del pad [i]"},"ja":{"_Gamepad":"ゲームパッド","_any":"すべて","_button [b] on pad [i] pressed?":"パッド[i]のボタン[b]が押された","_direction of axes [axis] on pad [pad]":"パッド[pad]の[axis]の軸方向","_gamepad [pad] connected?":"ゲームパッド[pad]が接続された","_value of axis [b] on pad [i]":"パッド[i]の[b]軸の値","_value of button [b] on pad [i]":"パッド[i]のボタン[b]の値"},"ko":{"_D-pad down (14)":"십자키 아래 (14)","_D-pad left (15)":"십자키 왼쪽 (15)","_D-pad right (16)":"십자키 오른쪽 (16)","_D-pad up (13)":"십자키 위 (13)","_Gamepad":"게임패드","_Left bumper (5)":"왼쪽 범퍼 (5)","_Left stick (1 & 2)":"왼쪽 스틱 (1 & 2)","_Left stick (11)":"왼쪽 스틱 (11)","_Left stick horizontal (1)":"왼쪽 스틱 수평 (1)","_Left stick vertical (2)":"왼쪽 스틱 수직 (2)","_Left trigger (7)":"왼쪽 트리거 (7)","_Right bumper (6)":"오른쪽 범퍼 (6)","_Right stick (12)":"오른쪽 스틱 (12)","_Right stick (3 & 4)":"오른쪽 스틱 (3 & 4)","_Right stick horizontal (3)":"오른쪽 스틱 수평 (3)","_Right stick vertical (4)":"오른쪽 스틱 수직 (4)","_Right trigger (8)":"오른쪽 트리거 (8)","_any":"아무거나","_button [b] on pad [i] pressed?":"패드 [i]의 [b]버튼이 눌렸는가? ","_direction of axes [axis] on pad [pad]":"패드 [pad]의 [axis]축 방향","_gamepad [pad] connected?":"게임패드 [pad]이(가) 연결되었는가?","_magnitude of axes [axis] on pad [pad]":"패드 [pad]의 [axis]축 magnitude","_rumble strong [s] and weak [w] for [t] sec. on pad [i]":"패드 [i]에서 강 [s] 약 [w]으로 [t]초동안 진동하기 ","_set axis deadzone to [DEADZONE]":"축 데드존을 [DEADZONE](으)로 정하기","_value of axis [b] on pad [i]":"패드 [i]의 [b]축 입력값  ","_value of button [b] on pad [i]":"패드 [i]의 [b]버튼 입력값"},"nb":{"_D-pad down (14)":"D-pad ned (14)","_D-pad left (15)":"D-pad venstre (15)","_D-pad right (16)":"D-pad høyre (16)","_D-pad up (13)":"D-pad opp (13)","_Gamepad":"Spillkontroller","_Left bumper (5)":"Venstre støtfanger (5)","_Left stick (1 & 2)":"Venstre spak (1 & 2)","_Left stick (11)":"Venstre spak (11)","_Left stick horizontal (1)":"Venstre spak horisontal (1)","_Left stick vertical (2)":"Venstre spak vertikal (2)","_Left trigger (7)":"Venstre avtrekker (7)","_Right bumper (6)":"Høyre støtfanger (6)","_Right stick (12)":"Høyre spak (12)","_Right stick (3 & 4)":"Høyre spak (3 & 4)","_Right stick horizontal (3)":"Høyre spak horisontal (3)","_Right stick vertical (4)":"Høyre spak vertikal (4)","_Right trigger (8)":"Høyre avtrekker (8)","_Select/View (9)":"Velg/Vis (9)","_Start/Menu (10)":"Start/Meny (10)","_any":"noe","_button [b] on pad [i] pressed?":"knapp [b] på pad [i] trykket?","_direction of axes [axis] on pad [pad]":"retning av akser [axis] på pad [pad]","_gamepad [pad] connected?":"spillkontroll [pad] tilkoblet?","_magnitude of axes [axis] on pad [pad]":"størrelsen på aksene [axis] på pad [pad]","_rumble strong [s] and weak [w] for [t] sec. on pad [i]":"rumle sterkt [s] og svakt [w] i [t] sek. på pad [i]","_set axis deadzone to [DEADZONE]":"sett aksen dødzonen til [DEADZONE]","_value of axis [b] on pad [i]":"verdi av akse [b] på pad [i]","_value of button [b] on pad [i]":"verdi av knappen [b] på pad [i]"},"nl":{"_D-pad down (14)":"omlaag (14)","_D-pad left (15)":"links (15)","_D-pad right (16)":"rechts (16)","_D-pad up (13)":"omhoog (13)","_Left bumper (5)":"linkerbumper (5)","_Left stick (1 & 2)":"linkerstick (1 & 2)","_Left stick (11)":"linkerstick (11)","_Left stick horizontal (1)":"linkerstick horizontaal (1)","_Left stick vertical (2)":"linkerstick verticaal (2)","_Left trigger (7)":"linkertrigger (7)","_Right bumper (6)":"rechterbumper (6)","_Right stick (12)":"rechterstick (12)","_Right stick (3 & 4)":"rechterstick (3 & 4)","_Right stick horizontal (3)":"rechterstick horizontaal (3)","_Right stick vertical (4)":"rechterstick verticaal (4)","_Right trigger (8)":"rechtertrigger (8)","_Select/View (9)":"selecteer/bekijk (9)","_Start/Menu (10)":"start/menu (10)","_any":"willekeurig","_button [b] on pad [i] pressed?":"knop [b] op gamepad [i] ingedrukt?","_direction of axes [axis] on pad [pad]":"richting van assen [axis] op gamepad [pad]","_gamepad [pad] connected?":"gamepad [pad] verbonden?","_magnitude of axes [axis] on pad [pad]":"afstand van assen [axis] op gamepad [pad]","_rumble strong [s] and weak [w] for [t] sec. on pad [i]":"vibreer sterk [s] en zwak [w] voor [t] seconden op gamepad [i]","_set axis deadzone to [DEADZONE]":"stel dode zone van assen in op [DEADZONE]","_value of axis [b] on pad [i]":"waarde van as [b] op gamepad [i]","_value of button [b] on pad [i]":"waarde van knop [b] op gamepad [i]"},"ru":{"_D-pad down (14)":"D-пад вниз (14)","_D-pad left (15)":"D-пад влево (15)","_D-pad right (16)":"D-пад вправо (16)","_D-pad up (13)":"D-пад вверх (13)","_Gamepad":"Геймпад","_Left bumper (5)":"Левый бампер (5)","_Left stick (1 & 2)":"Левый джостик (1 & 2)","_Left stick (11)":"Левый джостик (11)","_Left stick horizontal (1)":"Левый джостик горизонтально (1)","_Left stick vertical (2)":"Левый джостик вертикально (2)","_Left trigger (7)":"Левый триггер (7)","_Right bumper (6)":"Правый бампер (6)","_Right stick (12)":"Правый джостик (12)","_Right stick (3 & 4)":"Правый джостик (3 & 4)","_Right stick horizontal (3)":"Правый джостик горизонтально (3)","_Right stick vertical (4)":"Правый джостик вертикально (4)","_Right trigger (8)":"Правый триггер (8)","_Select/View (9)":"Выбрать/Просмотр (9)","_Start/Menu (10)":"Старт/Меню (10)","_any":"любая","_button [b] on pad [i] pressed?":"триггер [b] на геймпаде [i] нажат?","_direction of axes [axis] on pad [pad]":"направление на оси [axis] на геймпаде [pad]","_gamepad [pad] connected?":"геймпад [pad] подключен?","_magnitude of axes [axis] on pad [pad]":"величина на оси [axis] на геймпаде [pad]","_rumble strong [s] and weak [w] for [t] sec. on pad [i]":"грохнуть на [s] и слабо [w] в течение [t] секунд на панели [i]","_set axis deadzone to [DEADZONE]":"задать ось мёртвой зоне в [DEADZONE]","_value of axis [b] on pad [i]":"значение на оси [b] на геймпаде [i]","_value of button [b] on pad [i]":"значение на триггере [b] на геймпаде [i]"},"uk":{"_Gamepad":"Геймпад","_any":"будь які"},"zh-cn":{"_D-pad down (14)":"十字向下（14）","_D-pad left (15)":"十字向左（15）","_D-pad right (16)":"十字向右（16）","_D-pad up (13)":"十字向上（13）","_Gamepad":"游戏手柄","_Left bumper (5)":"左前按钮（5）","_Left stick (1 & 2)":"左摇杆（1&2）","_Left stick (11)":"左摇杆（11）","_Left stick horizontal (1)":"左摇杆水平方向 （1）","_Left stick vertical (2)":"左摇杆垂直方向（2）","_Left trigger (7)":"左扳机（7）","_Right bumper (6)":"右前按钮（6）","_Right stick (12)":"右摇杆（12）","_Right stick (3 & 4)":"右摇杆（3&4）","_Right stick horizontal (3)":"右摇杆水平方向 （3）","_Right stick vertical (4)":"右摇杆垂直方向（4）","_Right trigger (8)":"右扳机（8）","_Select/View (9)":"选择/查看 （9）","_Start/Menu (10)":"开始/菜单（10）","_any":"任意","_button [b] on pad [i] pressed?":"手柄[i]的按钮[b]按下？","_direction of axes [axis] on pad [pad]":"手柄[pad]轴[axis]的方向","_gamepad [pad] connected?":"游戏手柄[pad]已连接？","_magnitude of axes [axis] on pad [pad]":"手柄[pad]轴[axis]的大小","_rumble strong [s] and weak [w] for [t] sec. on pad [i]":"手柄[i]按[s]的力度震动并唤醒[w]秒，持续[t]秒","_set axis deadzone to [DEADZONE]":"将轴死区半径设为[DEADZONE]","_value of axis [b] on pad [i]":"手柄[i]轴[b]的值","_value of button [b] on pad [i]":"手柄[i]按钮[b]的值"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  // For joysticks
  const DEFAULT_AXIS_DEADZONE = 0.1;
  let axisDeadzone = DEFAULT_AXIS_DEADZONE;

  // For triggers. Drift isn't so big of an issue with these.
  const BUTTON_DEADZONE = 0.05;

  /**
   * @typedef InternalGamepadState
   * @property {string} id
   * @property {Gamepad} realGamepad
   * @property {number} timestamp
   * @property {number[]} axisDirections
   * @property {number[]} axisMagnitudes
   * @property {number[]} axisValues
   * @property {number[]} buttonValues
   * @property {boolean[]} buttonPressed
   */

  /** @type {Array<InternalGamepadState|null>} */
  let gamepadState = [];

  const updateState = () => {
    // In Firefox, the objects returned by getGamepads() change in the background, but in Chrome
    // we have to call getGamepads() each frame. Easiest for us to just always call it.
    // But because Firefox changes the objects in the background, we need to track old values
    // ourselves.
    const gamepads = navigator.getGamepads();

    const oldState = gamepadState;

    gamepadState = gamepads.map((gamepad) => {
      if (!gamepad) {
        return null;
      }

      /** @type {InternalGamepadState} */
      const result = {
        id: gamepad.id,
        realGamepad: gamepad,
        timestamp: gamepad.timestamp,
        axisDirections: [],
        axisMagnitudes: [],
        axisValues: [],
        buttonValues: [],
        buttonPressed: [],
      };

      const oldResult = oldState.find((i) => i !== null && i.id === gamepad.id);

      // Each pair of axes is given a circular deadzone.
      for (let i = 0; i < gamepad.axes.length; i += 2) {
        const x = gamepad.axes[i];
        const y = i + 1 >= gamepad.axes.length ? 0 : gamepad.axes[i + 1];
        const magnitude = Math.sqrt(x ** 2 + y ** 2);

        if (magnitude > axisDeadzone) {
          let direction = (Math.atan2(y, x) * 180) / Math.PI + 90;
          if (direction < 0) {
            direction += 360;
          }

          result.axisDirections.push(direction, direction);
          result.axisMagnitudes.push(magnitude, magnitude);
          result.axisValues.push(x, y);
        } else {
          // Set both axes to 0. Use the old direction state, if it exists, so that using the direction
          // inside of something like "point in direction" won't reset when no inputs.
          // If we have no information at all, default to 90 degrees, like new sprites.
          const oldDirection = oldResult ? oldResult.axisDirections[i] : 90;
          result.axisDirections.push(oldDirection, oldDirection);
          result.axisMagnitudes.push(0, 0);
          result.axisValues.push(0, 0);
        }
      }

      for (let i = 0; i < gamepad.buttons.length; i++) {
        let value = gamepad.buttons[i].value;
        if (value < BUTTON_DEADZONE) {
          value = 0;
        }
        result.buttonValues.push(value);
        result.buttonPressed.push(gamepad.buttons[i].pressed);
      }

      return result;
    });
  };

  Scratch.vm.runtime.on("BEFORE_EXECUTE", () => {
    updateState();
  });

  /**
   * @param {unknown} index 1-indexed index or 'any'
   * @returns {InternalGamepadState[]}
   */
  const getGamepads = (index) => {
    if (index === "any") {
      return gamepadState.filter((i) => i);
    }
    const gamepad = gamepadState[Scratch.Cast.toNumber(index) - 1];
    if (gamepad) {
      return [gamepad];
    }
    return [];
  };

  /**
   * @param {InternalGamepadState} gamepad
   * @param {unknown} buttonIndex 1-indexed index or 'any'
   * @returns {boolean} false if button does not exist
   */
  const isButtonPressed = (gamepad, buttonIndex) => {
    if (buttonIndex === "any") {
      return gamepad.buttonPressed.some((i) => i);
    }
    return !!gamepad.buttonPressed[Scratch.Cast.toNumber(buttonIndex) - 1];
  };

  /**
   * @param {InternalGamepadState} gamepad
   * @param {unknown} buttonIndex 1-indexed index
   * @returns {number} 0 if button does not exist
   */
  const getButtonValue = (gamepad, buttonIndex) => {
    const value = gamepad.buttonValues[Scratch.Cast.toNumber(buttonIndex) - 1];
    return value || 0;
  };

  /**
   * @param {InternalGamepadState} gamepad
   * @param {unknown} axisIndex 1-indexed index
   * @returns {number} 0 if axis does not exist
   */
  const getAxisValue = (gamepad, axisIndex) => {
    const axisValue = gamepad.axisValues[Scratch.Cast.toNumber(axisIndex) - 1];
    return axisValue || 0;
  };

  /**
   * @param {InternalGamepadState} gamepad
   * @param {unknown} startIndex
   */
  const getAxisPairMagnitude = (gamepad, startIndex) => {
    const magnitude =
      gamepad.axisMagnitudes[Scratch.Cast.toNumber(startIndex) - 1];
    return magnitude || 0;
  };

  /**
   * @param {InternalGamepadState} gamepad
   * @param {unknown} startIndex
   */
  const getAxisPairDirection = (gamepad, startIndex) => {
    const direction =
      gamepad.axisDirections[Scratch.Cast.toNumber(startIndex) - 1];
    return direction || 0;
  };

  class GamepadExtension {
    getInfo() {
      return {
        id: "Gamepad",
        name: Scratch.translate("Gamepad"),
        blocks: [
          {
            opcode: "gamepadConnected",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("gamepad [pad] connected?"),
            arguments: {
              pad: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "padMenu",
              },
            },
          },
          {
            opcode: "buttonDown",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("button [b] on pad [i] pressed?"),
            arguments: {
              b: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "buttonMenu",
              },
              i: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "padMenu",
              },
            },
          },
          {
            opcode: "buttonValue",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("value of button [b] on pad [i]"),
            arguments: {
              b: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "buttonMenu",
              },
              i: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "padMenu",
              },
            },
          },
          {
            opcode: "axisValue",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("value of axis [b] on pad [i]"),
            arguments: {
              b: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "axisMenu",
              },
              i: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "padMenu",
              },
            },
          },

          "---",

          {
            opcode: "axisDirection",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("direction of axes [axis] on pad [pad]"),
            arguments: {
              axis: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "axesGroupMenu",
              },
              pad: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "padMenu",
              },
            },
          },
          {
            opcode: "axisMagnitude",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("magnitude of axes [axis] on pad [pad]"),
            arguments: {
              axis: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "axesGroupMenu",
              },
              pad: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "padMenu",
              },
            },
          },

          /*
          {
            opcode: 'buttonPressedReleased',
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate('button [b] [pr] of pad [i]'),
            arguments: {
              b: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '1'
              },
              pr: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '1',
                menu: 'pressReleaseMenu'
              },
              i: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '1',
                menu: 'padMenu'
              },
            },
          },

          {
            opcode: 'axisMoved',
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate('axis [b] of pad [i] moved'),
            arguments: {
              b: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '1'
              },
              i: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '1',
                menu: 'padMenu'
              },
            },
          },
          */

          "---",

          {
            opcode: "rumble",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "rumble strong [s] and weak [w] for [t] sec. on pad [i]"
            ),
            arguments: {
              s: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0.25",
              },
              w: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0.5",
              },
              t: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0.25",
              },
              i: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
                menu: "padMenu",
              },
            },
          },

          "---",

          {
            opcode: "setAxisDeadzone",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set axis deadzone to [DEADZONE]"),
            arguments: {
              DEADZONE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: DEFAULT_AXIS_DEADZONE.toString(),
              },
            },
          },
        ],
        menus: {
          padMenu: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("any"),
                value: "any",
              },
              {
                text: "1",
                value: "1",
              },
              {
                text: "2",
                value: "2",
              },
              {
                text: "3",
                value: "3",
              },
              {
                text: "4",
                value: "4",
              },
            ],
          },
          buttonMenu: {
            acceptReporters: true,
            items: [
              // Based on an Xbox controller
              {
                text: Scratch.translate("any"),
                value: "any",
              },
              {
                text: "A (1)",
                value: "1",
              },
              {
                text: "B (2)",
                value: "2",
              },
              {
                text: "X (3)",
                value: "3",
              },
              {
                text: "Y (4)",
                value: "4",
              },
              {
                text: Scratch.translate("Left bumper (5)"),
                value: "5",
              },
              {
                text: Scratch.translate("Right bumper (6)"),
                value: "6",
              },
              {
                text: Scratch.translate("Left trigger (7)"),
                value: "7",
              },
              {
                text: Scratch.translate("Right trigger (8)"),
                value: "8",
              },
              {
                text: Scratch.translate("Select/View (9)"),
                value: "9",
              },
              {
                text: Scratch.translate("Start/Menu (10)"),
                value: "10",
              },
              {
                text: Scratch.translate("Left stick (11)"),
                value: "11",
              },
              {
                text: Scratch.translate("Right stick (12)"),
                value: "12",
              },
              {
                text: Scratch.translate("D-pad up (13)"),
                value: "13",
              },
              {
                text: Scratch.translate("D-pad down (14)"),
                value: "14",
              },
              {
                text: Scratch.translate("D-pad left (15)"),
                value: "15",
              },
              {
                text: Scratch.translate("D-pad right (16)"),
                value: "16",
              },
            ],
          },
          axisMenu: {
            acceptReporters: true,
            items: [
              // Based on an Xbox controller
              {
                text: Scratch.translate("Left stick horizontal (1)"),
                value: "1",
              },
              {
                text: Scratch.translate("Left stick vertical (2)"),
                value: "2",
              },
              {
                text: Scratch.translate("Right stick horizontal (3)"),
                value: "3",
              },
              {
                text: Scratch.translate("Right stick vertical (4)"),
                value: "4",
              },
            ],
          },
          axesGroupMenu: {
            acceptReporters: true,
            items: [
              // Based on an Xbox controller
              {
                text: Scratch.translate("Left stick (1 & 2)"),
                value: "1",
              },
              {
                text: Scratch.translate("Right stick (3 & 4)"),
                value: "3",
              },
            ],
          },
          /*
          pressReleaseMenu: [
            {
              text: Scratch.translate('press'),
              value: 1
            },
            {
              text: Scratch.translate('release'),
              value: 0
            }
          ],
          */
        },
      };
    }

    gamepadConnected({ pad }) {
      return getGamepads(pad).length > 0;
    }

    buttonDown({ b, i }) {
      for (const gamepad of getGamepads(i)) {
        if (isButtonPressed(gamepad, b)) {
          return true;
        }
      }
      return false;
    }

    buttonValue({ b, i }) {
      let greatestButton = 0;
      for (const gamepad of getGamepads(i)) {
        const value = getButtonValue(gamepad, b);
        if (value > greatestButton) {
          greatestButton = value;
        }
      }
      return greatestButton;
    }

    axisValue({ b, i }) {
      let greatestAxis = 0;
      for (const gamepad of getGamepads(i)) {
        const axis = getAxisValue(gamepad, b);
        if (Math.abs(axis) > Math.abs(greatestAxis)) {
          greatestAxis = axis;
        }
      }
      return greatestAxis;
    }

    axisDirection({ axis, pad }) {
      let greatestMagnitude = 0;
      // by default sprites have direction 90 degrees, so that's a reasonable default
      let direction = 90;

      const gamepads = getGamepads(pad);
      for (const gamepad of gamepads) {
        const magnitude = getAxisPairMagnitude(gamepad, axis);
        if (magnitude > greatestMagnitude) {
          direction = getAxisPairDirection(gamepad, axis);
        }
      }

      // if no sticks are far enough out, instead we'll return the last direction
      // of the most recently modified gamepad
      if (greatestMagnitude === 0 && gamepads.length > 0) {
        gamepads.sort((a, b) => b.timestamp - a.timestamp);
        direction = getAxisPairDirection(gamepads[0], axis);
      }

      return direction;
    }

    axisMagnitude({ axis, pad }) {
      let greatestMagnitude = 0;
      for (const gamepad of getGamepads(pad)) {
        const horizontalAxis = getAxisValue(gamepad, axis);
        const verticalAxis = getAxisValue(gamepad, +axis + 1);
        const magnitude = Math.sqrt(horizontalAxis ** 2 + verticalAxis ** 2);
        if (magnitude > greatestMagnitude) {
          greatestMagnitude = magnitude;
        }
      }
      return greatestMagnitude;
    }

    rumble({ s, w, t, i }) {
      const gamepads = getGamepads(i);
      for (const { realGamepad } of gamepads) {
        // @ts-ignore
        if (realGamepad.vibrationActuator) {
          // @ts-ignore
          realGamepad.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: t * 1000,
            weakMagnitude: w,
            strongMagnitude: s,
          });
        }
      }
    }

    setAxisDeadzone({ DEADZONE }) {
      axisDeadzone = Scratch.Cast.toNumber(DEADZONE);
      updateState();
    }
  }

  Scratch.extensions.register(new GamepadExtension());
})(Scratch);
