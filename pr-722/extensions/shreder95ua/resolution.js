// Name: Screen Resolution
// ID: shreder95resolution
// Description: Get the resolution of the primary screen.
// By: shreder95ua <https://scratch.mit.edu/users/shreder95ua/>
// License: MIT

/* generated l10n code */Scratch.translate.setup({"fi":{"_Screen resolution":"Näytön resoluutio","_primary screen height":"ensisijaisen näytön korkeus","_primary screen width":"ensisijaisen näytön leveys"},"it":{"_Screen resolution":"Risoluzione schermo","_primary screen height":"altezza schermo primario","_primary screen width":"larghezza schermo primario"},"ja":{"_Screen resolution":"画面解像度","_primary screen height":"画面の高さ","_primary screen width":"画面の幅"},"ko":{"_Screen resolution":"화면 해상도","_primary screen height":"주 화면 높이","_primary screen width":"주 화면 넓이"},"ru":{"_Screen resolution":"Разрешение экрана","_primary screen height":"основная высота экрана","_primary screen width":"основная ширина экрана"},"uk":{"_Screen resolution":"Розширення Екрану","_primary screen height":"висота головного екрану","_primary screen width":"ширина головного екрану"},"zh-cn":{"_Screen resolution":"屏幕分辨率","_primary screen height":"主屏幕高","_primary screen width":"主屏幕宽"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  class Resolution {
    getInfo() {
      return {
        id: "shreder95resolution",
        name: Scratch.translate("Screen resolution"),
        color1: "#FFAB19",
        color2: "#EC9C13",
        color3: "#CF8B17",
        blocks: [
          {
            opcode: "getWidth",
            text: Scratch.translate("primary screen width"),
            blockType: Scratch.BlockType.REPORTER,
          },
          {
            opcode: "getHeight",
            text: Scratch.translate("primary screen height"),
            blockType: Scratch.BlockType.REPORTER,
          },
        ],
      };
    }
    getWidth() {
      return window.screen.width;
    }
    getHeight() {
      return window.screen.height;
    }
  }
  Scratch.extensions.register(new Resolution());
})(Scratch);
