// Name: RGB Channels
// ID: lbdrawtest
// Description: Only render or stamp certain RGB channels.
// License: MIT

/* generated l10n code */Scratch.translate.setup({"de":{"_RGB Channels":"RGB Kanäle"},"fi":{"_RGB Channels":"RGB-kanavat","_[COLOR] channel enabled?":"onko [COLOR] kanava käytössä?","_blue":"sininen","_clear color draw effects":"poista värien piirtotehosteet","_enable depth mask? [DRAW]":"otetaanko syvyysmaski käyttöön? [DRAW]","_false":"epätosi","_green":"vihreä","_off":"pois päälle","_on":"päälle","_only draw [COLOR]":"piirrä vain [COLOR]","_only draw colors:[R] green:[G] blue:[B]":"piirrä vain punainen: [R] vihreä: [G] sininen: [B]","_red":"punainen","_set colors red:[R] green:[G] blue:[B]":"kytke punainen: [R] vihreä: [G] sininen: [B]","_true":"tosi"},"it":{"_RGB Channels":"Canali RGB","_[COLOR] channel enabled?":"canale [COLOR] abilitato","_blue":"blu","_clear color draw effects":"rimuovi effetti disegno colori","_enable depth mask? [DRAW]":"abilita maschera profondità [DRAW]","_false":"falso","_green":"verde","_off":"disabilita","_on":"abilita","_only draw [COLOR]":"disegna solo il [COLOR]","_red":"rosso","_set colors red:[R] green:[G] blue:[B]":"imposta colore rosso:[R] verde:[G] blu:[B]","_true":"vero"},"ja":{"_RGB Channels":"RGBチャンネル","_[COLOR] channel enabled?":"[COLOR]チャンネルが有効","_blue":"青","_clear color draw effects":"色描画エフェクトを無効にする","_enable depth mask? [DRAW]":"デプスマスクが有効[DRAW]","_false":"偽","_green":"緑","_off":"オフ","_on":"オン","_only draw [COLOR]":"色[COLOR]のみ描画する","_only draw colors:[R] green:[G] blue:[B]":"色 赤:[R]緑:[G]青:[B]のみ描画する","_red":"赤","_set colors red:[R] green:[G] blue:[B]":"色を赤:[R]緑:[G]青:[B]にする","_true":"真"},"ko":{"_RGB Channels":"RGB 채널","_[COLOR] channel enabled?":"[COLOR] 채널이 활성화 되었는가?","_blue":"Blue","_false":"거짓","_green":"Green","_off":"끄기","_on":"켜기","_only draw [COLOR]":"[COLOR]만 보이기","_only draw colors:[R] green:[G] blue:[B]":"오직 Red:[R] Green:[G] Blue:[B] 색상만 보이기","_red":"Red","_set colors red:[R] green:[G] blue:[B]":"색상 Red:[R] Green:[G] Blue:[B]","_true":"참"},"nb":{"_RGB Channels":"RGB-kanaler","_off":"av","_on":"på","_true":"sann"},"nl":{"_RGB Channels":"RGB-kanalen","_[COLOR] channel enabled?":"[COLOR] kanaal ingeschakeld?","_blue":"blauw","_clear color draw effects":"zet kleureffecten uit","_enable depth mask? [DRAW]":"schakel dieptemasker in? [DRAW]","_false":"onwaar","_green":"groen","_off":"uit","_on":"aan","_only draw [COLOR]":"toon alleen [COLOR]","_only draw colors:[R] green:[G] blue:[B]":"toon alleen kleuren rood: [R] groen: [G] blauw: [B]","_red":"rood","_set colors red:[R] green:[G] blue:[B]":"zet kleuren rood: [R] groen: [G] blauw: [B]","_true":"waar"},"pl":{"_blue":"niebieski","_false":"fałsz","_green":"zielony","_red":"czerwony","_true":"prawda"},"ru":{"_RGB Channels":"RGB каналы","_[COLOR] channel enabled?":"канал [COLOR] включен?","_blue":"синий","_clear color draw effects":"отчистить эффекты рисовки цветом","_enable depth mask? [DRAW]":"включить маску глубины? [DRAW]","_false":"нет","_green":"зелёный","_off":"выключить","_on":"включить","_only draw [COLOR]":"рисовать только [COLOR]","_only draw colors:[R] green:[G] blue:[B]":"рисовать только цвета:[R] зелёный:[G] синий:[B]","_red":"красный","_set colors red:[R] green:[G] blue:[B]":"задать цвета красный:[R] зелёный:[G] синий:[B]","_true":"да"},"tr":{"_RGB Channels":"RGB Kanalları"},"uk":{"_RGB Channels":"RGB Канали","_off":"вимкнути","_on":"увімкнути"},"zh-cn":{"_RGB Channels":"RGB 通道","_[COLOR] channel enabled?":"[COLOR]通道启用？","_blue":"蓝色","_clear color draw effects":"清除颜色绘制效果","_enable depth mask? [DRAW]":"开启深度遮罩？[DRAW]","_false":"假","_green":"绿色","_off":"关闭","_on":"打开","_only draw [COLOR]":"只绘制[COLOR]","_only draw colors:[R] green:[G] blue:[B]":"只绘制颜色 红:[R]绿:[G]蓝:[B]","_red":"红色","_set colors red:[R] green:[G] blue:[B]":"将颜色设为红：[R]绿：[G]蓝：[B]","_true":"真"}});/* end generated l10n code */(function (Scratch) {
  "use strict";
  const renderer = Scratch.vm.renderer;
  const gl = renderer._gl;
  let channel_array = [true, true, true, true];
  class LBdrawtest {
    constructor() {
      Scratch.vm.runtime.on("RUNTIME_DISPOSED", () => {
        this.clearEffects();
      });
    }
    getInfo() {
      return {
        id: "lbdrawtest",
        name: Scratch.translate("RGB Channels"),
        menuIconURI:
          "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzMyIgaGVpZ2h0PSIzMyIgdmlld0JveD0iMCwwLDMzLDMzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIzLjUsLTE2My41KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjI0LDE4MGMwLC04LjgzNjU2IDcuMTYzNDQsLTE2IDE2LC0xNmM4LjgzNjU2LDAgMTYsNy4xNjM0NCAxNiwxNmMwLDguODM2NTYgLTcuMTYzNDQsMTYgLTE2LDE2Yy04LjgzNjU2LDAgLTE2LC03LjE2MzQ0IC0xNiwtMTZ6IiBmaWxsPSIjYWFhYWFhIiBzdHJva2U9IiM4ODg4ODgiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0yMzMuOTAyMDQsMTgxLjQ4NjkyYzAsLTQuNDE4MjggMy41ODE3MiwtOCA4LC04YzQuNDE4MjgsMCA4LDMuNTgxNzIgOCw4YzAsNC40MTgyOCAtMy41ODE3Miw4IC04LDhjLTQuNDE4MjgsMCAtOCwtMy41ODE3MiAtOCwtOHoiIGZpbGw9IiMwMDAwZmYiIHN0cm9rZT0iIzNjMDBmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNMjMxLjk2MjQ1LDE3OS40NDEzNWMwLC00LjQxODI4IDMuNTgxNzIsLTggOCwtOGM0LjQxODI4LDAgOCwzLjU4MTcyIDgsOGMwLDQuNDE4MjggLTMuNTgxNzIsOCAtOCw4Yy00LjQxODI4LDAgLTgsLTMuNTgxNzIgLTgsLTh6IiBmaWxsPSIjMDBmZjAwIiBzdHJva2U9IiMwMGZmM2QiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0yMzAuMjI1OSwxNzcuNjIwOThjMCwtNC40MTgyOCAzLjU4MTcyLC04IDgsLThjNC40MTgyOCwwIDgsMy41ODE3MiA4LDhjMCw0LjQxODI4IC0zLjU4MTcyLDggLTgsOGMtNC40MTgyOCwwIC04LC0zLjU4MTcyIC04LC04eiIgZmlsbD0iI2ZmMDAwMCIgc3Ryb2tlPSIjZmYzZDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9nPjwvc3ZnPgo=",
        blockIconURI:
          "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMC40MjYxNCIgaGVpZ2h0PSIyMC42MTU5NCIgdmlld0JveD0iMCwwLDIwLjQyNjE0LDIwLjYxNTk0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI5LjcyNTksLTE2OS4xMjA5OCkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTIzMy45MDIwNCwxODEuNDg2OTJjMCwtNC40MTgyOCAzLjU4MTcyLC04IDgsLThjNC40MTgyOCwwIDgsMy41ODE3MiA4LDhjMCw0LjQxODI4IC0zLjU4MTcyLDggLTgsOGMtNC40MTgyOCwwIC04LC0zLjU4MTcyIC04LC04eiIgZmlsbD0iIzAwMDBmZiIgc3Ryb2tlPSIjM2MwMGZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPjxwYXRoIGQ9Ik0yMzEuOTYyNDUsMTc5LjQ0MTM1YzAsLTQuNDE4MjggMy41ODE3MiwtOCA4LC04YzQuNDE4MjgsMCA4LDMuNTgxNzIgOCw4YzAsNC40MTgyOCAtMy41ODE3Miw4IC04LDhjLTQuNDE4MjgsMCAtOCwtMy41ODE3MiAtOCwtOHoiIGZpbGw9IiMwMGZmMDAiIHN0cm9rZT0iIzAwZmYzZCIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTIzMC4yMjU5LDE3Ny42MjA5OGMwLC00LjQxODI4IDMuNTgxNzIsLTggOCwtOGM0LjQxODI4LDAgOCwzLjU4MTcyIDgsOGMwLDQuNDE4MjggLTMuNTgxNzIsOCAtOCw4Yy00LjQxODI4LDAgLTgsLTMuNTgxNzIgLTgsLTh6IiBmaWxsPSIjZmYwMDAwIiBzdHJva2U9IiNmZjNkMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L2c+PC9zdmc+Cg==",
        color1: "#aaaaaa",
        color2: "#888888",
        color3: "#888888",
        blocks: [
          {
            opcode: "true",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("true"),
            hideFromPalette: true,
            disableMonitor: true,
          },
          {
            opcode: "false",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("false"),
            hideFromPalette: true,
            disableMonitor: true,
          },
          {
            opcode: "enabledCheck",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("[COLOR] channel enabled?"),
            arguments: {
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                menu: "COLOR_MENU",
              },
            },
          },
          {
            opcode: "drawSelected",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set colors red:[R] green:[G] blue:[B]"),
            arguments: {
              R: {
                type: Scratch.ArgumentType.STRING,
                menu: "ENABLED_MENU",
              },
              G: {
                type: Scratch.ArgumentType.STRING,
                menu: "ENABLED_MENU",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                menu: "ENABLED_MENU",
              },
            },
          },
          {
            opcode: "draw",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("only draw colors:[R] green:[G] blue:[B]"),
            hideFromPalette: true,
            arguments: {
              R: {
                type: Scratch.ArgumentType.BOOLEAN,
              },
              G: {
                type: Scratch.ArgumentType.BOOLEAN,
              },
              B: {
                type: Scratch.ArgumentType.BOOLEAN,
              },
            },
          },
          {
            opcode: "drawOneColor",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("only draw [COLOR]"),
            arguments: {
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                menu: "COLOR_MENU",
              },
            },
          },
          {
            opcode: "drawDepth",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("enable depth mask? [DRAW]"),
            hideFromPalette: true,
            arguments: {
              DRAW: {
                type: Scratch.ArgumentType.BOOLEAN,
              },
            },
          },
          {
            opcode: "clearEffects",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("clear color draw effects"),
          },
        ],
        menus: {
          COLOR_MENU: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("red"),
                value: "red",
              },
              {
                text: Scratch.translate("green"),
                value: "green",
              },
              {
                text: Scratch.translate("blue"),
                value: "blue",
              },
            ],
          },
          ENABLED_MENU: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("off"),
                value: "false",
              },
              {
                text: Scratch.translate("on"),
                value: "true",
              },
            ],
          },
        },
      };
    }

    true() {
      return true;
    }

    false() {
      return false;
    }

    enabledCheck({ COLOR }) {
      if (
        (COLOR == "red" && channel_array[0]) ||
        (COLOR == "green" && channel_array[1]) ||
        (COLOR == "blue" && channel_array[2])
      ) {
        return true;
      } else {
        return false;
      }
    }

    drawSelected({ R, G, B }) {
      channel_array = [
        Scratch.Cast.toBoolean(R),
        Scratch.Cast.toBoolean(G),
        Scratch.Cast.toBoolean(B),
        true,
      ];
      gl.colorMask(
        channel_array[0],
        channel_array[1],
        channel_array[2],
        channel_array[3]
      );
      Scratch.vm.renderer.dirty = true;
    }

    draw({ R, G, B }) {
      channel_array = [R, G, B, true];
      gl.colorMask(
        channel_array[0],
        channel_array[1],
        channel_array[2],
        channel_array[3]
      );
      Scratch.vm.renderer.dirty = true;
    }

    drawOneColor({ COLOR }) {
      if (COLOR == "red") {
        channel_array = [true, false, false, true];
      } else if (COLOR == "green") {
        channel_array = [false, true, false, true];
      } else {
        channel_array = [false, false, true, true];
      }
      gl.colorMask(
        channel_array[0],
        channel_array[1],
        channel_array[2],
        channel_array[3]
      );
      Scratch.vm.renderer.dirty = true;
    }

    drawDepth({ DRAW }) {
      gl.depthMask(DRAW);
      Scratch.vm.renderer.dirty = true;
    }

    clearEffects() {
      channel_array = [true, true, true, true];
      gl.colorMask(
        channel_array[0],
        channel_array[1],
        channel_array[2],
        channel_array[3]
      );
      gl.depthMask(true);
      Scratch.vm.renderer.dirty = true;
    }
  }

  Scratch.extensions.register(new LBdrawtest());
})(Scratch);
