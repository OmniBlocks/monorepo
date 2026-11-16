// Name: Ask Before Closing Tab
// ID: xmerclosecontrol
// Description: Show a prompt when someone tries to close the tab.
// By: XmerOriginals <https://scratch.mit.edu/users/XmerOriginals/>
// License: MPL-2.0

/* generated l10n code */Scratch.translate.setup({"de":{"_Ask Before Closing Tab":"Frage vor dem Schließen"},"fi":{"_Ask Before Closing Tab":"Kysy ennen välilehden sulkemista","_ask before closing tab enabled?":"onko kysyminen ennen välilehden sulkemista päällä?","_disabled":"pois päältä","_enabled":"päälle","_set ask before closing tab to [OPTION]":"kytke kysyminen ennen välilehden sulkemista [OPTION]"},"it":{"_Ask Before Closing Tab":"Chiedi Conferma Prima di Chiudere una Scheda","_ask before closing tab enabled?":"conferma chiusura scheda abilitata","_disabled":"disabilita","_enabled":"abilita","_set ask before closing tab to [OPTION]":"[OPTION] conferma chiusura scheda"},"ja":{"_Ask Before Closing Tab":"タブを閉じる前に確認する","_ask before closing tab enabled?":"タブを閉じる前に確認するのが有効","_disabled":"無効","_enabled":"有効","_set ask before closing tab to [OPTION]":"タブを閉じる前に確認するのを[OPTION]にする"},"ko":{"_Ask Before Closing Tab":"탭 닫기 전에 묻기","_ask before closing tab enabled?":"탭 닫기 전에 묻기가 활성화인가?","_disabled":"비활성화","_enabled":"활성화","_set ask before closing tab to [OPTION]":"탭 닫기 전에 묻기 [OPTION] "},"nb":{"_Ask Before Closing Tab":"Spør før du lukker fanen","_disabled":"deaktivert","_enabled":"aktivert"},"nl":{"_Ask Before Closing Tab":"Tabblad sluiten bevestigen","_ask before closing tab enabled?":"tabblad sluiten bevestigen ingeschakeld?","_disabled":"uit","_enabled":"in","_set ask before closing tab to [OPTION]":"schakel tabblad sluiten bevestigen [OPTION]"},"ru":{"_Ask Before Closing Tab":"Спросить Перед Закрытием Вкладки","_ask before closing tab enabled?":"спрос до закрытия вкладки включён?","_disabled":"выключен","_enabled":"включен","_set ask before closing tab to [OPTION]":"задать спрос до закрытия вкладки на [OPTION]"},"uk":{"_Ask Before Closing Tab":"Запит перед виходом","_disabled":"вимкнути","_enabled":"увімкнено"},"zh-cn":{"_Ask Before Closing Tab":"关闭页面时询问","_ask before closing tab enabled?":"关闭页面时询问已启用？","_disabled":"禁用","_enabled":"启用","_set ask before closing tab to [OPTION]":"将关闭页面时询问设为[OPTION]"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  let enabled = false;

  window.addEventListener("beforeunload", (e) => {
    if (enabled) {
      e.preventDefault();
    }
  });

  class CloseControl {
    getInfo() {
      return {
        id: "xmerclosecontrol",
        name: Scratch.translate("Ask Before Closing Tab"),
        blocks: [
          {
            opcode: "setControl",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set ask before closing tab to [OPTION]"),
            arguments: {
              OPTION: {
                type: Scratch.ArgumentType.STRING,
                menu: "option",
              },
            },
          },
          {
            opcode: "getControl",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("ask before closing tab enabled?"),
          },
        ],
        menus: {
          option: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("enabled"),
                value: "true",
              },
              {
                text: Scratch.translate("disabled"),
                value: "false",
              },
            ],
          },
        },
      };
    }

    setControl({ OPTION }) {
      enabled = Scratch.Cast.toBoolean(OPTION);
    }

    getControl() {
      return enabled;
    }
  }

  Scratch.extensions.register(new CloseControl());
})(Scratch);
