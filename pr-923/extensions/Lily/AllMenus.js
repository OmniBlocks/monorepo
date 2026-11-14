// Name: All Menus
// ID: lmsAllMenus
// Description: Special category with every menu from every Scratch category and extensions.
// By: LilyMakesThings <https://scratch.mit.edu/users/LilyMakesThings/>
// License: MIT AND LGPL-3.0
// Scratch-compatible: true

/* generated l10n code */Scratch.translate.setup({"de":{"_All Menus":"Alle Menüs"},"fi":{"_All Menus":"Kaikki valikot"},"it":{"_All Menus":"Tutti i Menu"},"ko":{"_All Menus":"모든 선택목록 블록"},"nb":{"_All Menus":"Alle Menyer"},"nl":{"_All Menus":"Alle menu's"},"ru":{"_All Menus":"Все Менюсы"},"tr":{"_All Menus":"Tüm Menüler"},"uk":{"_All Menus":"Усі Меню"},"zh-cn":{"_All Menus":"全部菜单"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  let blockXML;

  const blocklist = [
    "looks_costumenumbername",
    "extension_wedo_tilt_menu",

    // Unused menu in More Events that won't be translated
    "lmsMoreEvents_menu_state",
  ];

  const escapeXML = (text) =>
    text.replace(/["'&<>]/g, (i) => {
      switch (i) {
        case "&":
          return "&amp;";
        case '"':
          return "&apos;";
        case "'":
          return "&quot;";
        case ">":
          return "&gt;";
        case "<":
          return "&lt;";
      }
      return "";
    });

  const refreshMenus = () => {
    if (!window.ScratchBlocks) return;
    Scratch.vm.removeListener("BLOCKSINFO_UPDATE", refreshMenus);

    let allBlocks = Object.keys(ScratchBlocks.Blocks);

    allBlocks = allBlocks.filter(
      (item) => item.includes("menu") && !blocklist.includes(item)
    );

    const menuBlocks = allBlocks.map(
      (item) =>
        '<block id="' + escapeXML(item) + '" type="' + escapeXML(item) + '"/>'
    );

    blockXML = menuBlocks.join("");
    Scratch.vm.runtime.extensionManager.refreshBlocks();
  };

  Scratch.vm.addListener("BLOCKSINFO_UPDATE", refreshMenus);

  class AllMenus {
    constructor() {
      Scratch.vm.runtime.on("EXTENSION_ADDED", () => {
        refreshMenus();
      });
    }

    getInfo() {
      return {
        id: "lmsAllMenus",
        name: Scratch.translate("All Menus"),
        blocks: [
          {
            blockType: Scratch.BlockType.XML,
            xml: blockXML,
          },
        ],
      };
    }
  }

  refreshMenus();

  Scratch.extensions.register(new AllMenus());
})(Scratch);
