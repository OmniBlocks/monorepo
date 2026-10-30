// Name: Steamworks
// ID: steamworks
// Description: Connect your project to Steamworks APIs.
// License: MPL-2.0
// Context: Probably don't translate the word "Steamworks".

/* generated l10n code */Scratch.translate.setup({"de":{"_name":"Name"},"fi":{"_IP country":"IP-osoitteen valtio","_URL":"URL-osoite","_[TYPE] [ID] installed?":"onko [TYPE] [ID] asennettu?","_achievement [ACHIEVEMENT] unlocked?":"onko saavutus [ACHIEVEMENT] avaamaton?","_false":"epätosi","_get user [THING]":"käyttäjän [THING]","_has steamworks?":"onko steamworksissa?","_level":"taso","_name":"nimi","_open [TYPE] [DATA] in overlay":"avaa [TYPE] [DATA] peittokuvana","_set achievement [ACHIEVEMENT] unlocked to [STATUS]":"saavutus [ACHIEVEMENT] avattu = [STATUS]","_steam ID":"steam-tunniste","_true":"tosi"},"he":{"_URL":"כתובת אתר"},"it":{"_IP country":"da IP a nazione","_[TYPE] [ID] installed?":"[TYPE][ID] installata","_achievement [ACHIEVEMENT] unlocked?":"obiettivo [ACHIEVEMENT] sbloccato","_false":"falso","_get user [THING]":"utente [THING]","_has steamworks?":"steamworks attiva","_level":"livello","_name":"nome","_open [TYPE] [DATA] in overlay":"apri [TYPE] [DATA] come livello sovrapposto","_set achievement [ACHIEVEMENT] unlocked to [STATUS]":"porta blocco obiettivo [ACHIEVEMENT] a [STATUS]","_steam ID":"ID steam","_true":"vero"},"ja":{"_DLC":"ダウンロードコンテンツ","_IP country":"IPアドレスの割り当て国","_[TYPE] [ID] installed?":"[TYPE]の[ID]がインストールされた","_achievement [ACHIEVEMENT] unlocked?":"実績[ACHIEVEMENT]を解除している","_false":"偽","_get user [THING]":"ユーザーの[THING]を取得","_has steamworks?":"Steamworks は実装されていますか？","_level":"レベル","_name":"名前","_open [TYPE] [DATA] in overlay":"オーバーレイで[TYPE][DATA]を開く","_set achievement [ACHIEVEMENT] unlocked to [STATUS]":"実績[ACHIEVEMENT]を解除することを[STATUS]にする","_steam ID":"Steam ID","_true":"真"},"ko":{"_IP country":"IP 국가","_[TYPE] [ID] installed?":"[TYPE] [ID](이)가 설치되었는가?","_achievement [ACHIEVEMENT] unlocked?":"업적 [ACHIEVEMENT]이(가) 달성되었는가? ","_false":"미달성함","_get user [THING]":"사용자의 [THING] 값","_level":"레벨","_name":"이름","_open [TYPE] [DATA] in overlay":"[TYPE][DATA]을(를) 오버레이로 열기","_set achievement [ACHIEVEMENT] unlocked to [STATUS]":"업적 [ACHIEVEMENT]을(를) [STATUS](으)로 정하기","_steam ID":"스팀 ID","_true":"달성함"},"nb":{"_name":"navn","_true":"sann"},"nl":{"_false":"onwaar","_name":"naam","_true":"waar"},"pl":{"_false":"fałsz","_name":"nazwa","_true":"prawda"},"ru":{"_IP country":"IP страны","_URL":"URL-адрес","_[TYPE] [ID] installed?":"[TYPE] [ID] загружен?","_achievement [ACHIEVEMENT] unlocked?":"достижение [ACHIEVEMENT] раблокировано?","_false":"нет","_get user [THING]":"получить [THING] пользователя","_has steamworks?":"имеет steamworks?","_level":"уровень","_name":"имя","_open [TYPE] [DATA] in overlay":"открыть [TYPE] [DATA] поверх экрана","_set achievement [ACHIEVEMENT] unlocked to [STATUS]":"задать достижение [ACHIEVEMENT] разблокирован на [STATUS]","_true":"да"},"uk":{"_[TYPE] [ID] installed?":"[TYPE] [ID] встановлено?","_achievement [ACHIEVEMENT] unlocked?":"досягнення [ACHIEVEMENT] отримано?","_get user [THING]":"отримати [THING] користувача","_has steamworks?":"має steamworks?","_level":"рівень","_name":"ім'я","_set achievement [ACHIEVEMENT] unlocked to [STATUS]":"встановити статус досягнення [ACHIEVEMENT] \"отримано?\" до [STATUS]"},"zh-cn":{"_IP country":"IP 所属地","_[TYPE] [ID] installed?":"[TYPE][ID]已安装?","_achievement [ACHIEVEMENT] unlocked?":"成就[ACHIEVEMENT]已解锁?","_false":"假","_get user [THING]":"用户[THING]","_has steamworks?":"连接了 Steamworks?","_level":"Steam 账户等级","_name":"名字","_open [TYPE] [DATA] in overlay":"在 Steam Overlay 上打开[TYPE][DATA]","_set achievement [ACHIEVEMENT] unlocked to [STATUS]":"将成就[ACHIEVEMENT]的解锁状态设为[STATUS]","_steam ID":"Steam ID","_true":"真"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  /* globals Steamworks */

  const canUseSteamworks = typeof Steamworks !== "undefined" && Steamworks.ok();

  class SteamworksExtension {
    getInfo() {
      return {
        id: "steamworks",
        // eslint-disable-next-line extension/should-translate
        name: "Steamworks",
        color1: "#136C9F",
        color2: "#105e8c",
        color3: "#0d486b",
        docsURI: "https://extensions.turbowarp.org/steamworks",
        blocks: [
          {
            blockType: Scratch.BlockType.BOOLEAN,
            opcode: "hasSteamworks",
            text: Scratch.translate("has steamworks?"),
          },

          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: "getUserInfo",
            text: Scratch.translate({
              default: "get user [THING]",
              description:
                "[THING] is a dropdown with name, steam ID, account level, IP country, etc.",
            }),
            arguments: {
              THING: {
                type: Scratch.ArgumentType.STRING,
                menu: "userInfo",
              },
            },
          },

          "---",

          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: "setAchievement",
            text: Scratch.translate({
              default: "set achievement [ACHIEVEMENT] unlocked to [STATUS]",
              description: "[STATUS] is true/false dropdown",
            }),
            arguments: {
              ACHIEVEMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              STATUS: {
                type: Scratch.ArgumentType.STRING,
                menu: "achievementUnlocked",
              },
            },
          },
          {
            blockType: Scratch.BlockType.BOOLEAN,
            opcode: "getAchievement",
            text: Scratch.translate("achievement [ACHIEVEMENT] unlocked?"),
            arguments: {
              ACHIEVEMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },

          "---",

          {
            blockType: Scratch.BlockType.BOOLEAN,
            opcode: "getInstalled",
            text: Scratch.translate({
              default: "[TYPE] [ID] installed?",
              description: "eg. can be read as 'DLC 1234 installed?'",
            }),
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "installType",
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },

          "---",

          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: "openInOverlay",
            text: Scratch.translate({
              default: "open [TYPE] [DATA] in overlay",
              description: "eg. 'open URL example.com in overlay'",
            }),
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "overlayType",
              },
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://example.com/",
              },
            },
          },
        ],
        menus: {
          userInfo: {
            acceptReporters: true,
            items: [
              {
                value: "name",
                text: Scratch.translate("name"),
              },
              {
                value: "level",
                text: Scratch.translate({
                  default: "level",
                  description: "Steam account level",
                }),
              },
              {
                value: "IP country",
                text: Scratch.translate("IP country"),
              },
              {
                value: "steam ID",
                text: Scratch.translate("steam ID"),
              },
            ],
          },

          achievementUnlocked: {
            acceptReporters: true,
            items: [
              {
                value: "true",
                text: Scratch.translate("true"),
              },
              {
                value: "false",
                text: Scratch.translate("false"),
              },
            ],
          },

          installType: {
            acceptReporters: true,
            items: [
              {
                value: "DLC",
                text: Scratch.translate({
                  default: "DLC",
                  description: "Downloadable content",
                }),
              },
            ],
          },

          overlayType: {
            acceptReporters: true,
            items: [
              {
                value: "URL",
                text: Scratch.translate("URL"),
              },
            ],
          },
        },
      };
    }

    hasSteamworks() {
      return canUseSteamworks;
    }

    getUserInfo({ THING }) {
      if (!canUseSteamworks) return "Steamworks unavailable";
      switch (THING) {
        case "name":
          return Steamworks.localplayer.getName();
        case "level":
          return Steamworks.localplayer.getLevel();
        case "IP country":
          return Steamworks.localplayer.getIpCountry();
        case "steam ID":
          return Steamworks.localplayer.getSteamId().steamId64;
      }
      return "???";
    }

    setAchievement({ ACHIEVEMENT, STATUS }) {
      if (!canUseSteamworks) return;
      if (Scratch.Cast.toBoolean(STATUS)) {
        Steamworks.achievement.activate(Scratch.Cast.toString(ACHIEVEMENT));
      } else {
        Steamworks.achievement.clear(Scratch.Cast.toString(ACHIEVEMENT));
      }
    }

    getAchievement({ ACHIEVEMENT }) {
      if (!canUseSteamworks) return false;
      return Steamworks.achievement.isActivated(
        Scratch.Cast.toString(ACHIEVEMENT)
      );
    }

    getInstalled({ TYPE, ID }) {
      if (!canUseSteamworks) return false;
      if (TYPE === "DLC") {
        return Steamworks.apps.isDlcInstalled(Scratch.Cast.toNumber(ID));
      }
      return false;
    }

    openInOverlay({ TYPE, DATA }) {
      if (TYPE === "URL") {
        const url = Scratch.Cast.toString(DATA);
        if (canUseSteamworks) {
          // This will always be a packaged environment so don't need to bother
          // with canOpenWindow()
          Steamworks.overlay.activateToWebPage(DATA);
        } else {
          // Don't await result, we don't care
          Scratch.openWindow(url);
        }
      }
    }
  }

  Scratch.extensions.register(new SteamworksExtension());
})(Scratch);
