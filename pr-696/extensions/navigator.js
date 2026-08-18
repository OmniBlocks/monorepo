// Name: Navigator
// ID: navigatorinfo
// Description: Details about the user's browser and operating system.
// Context: "Navigator" refers to someone's browser
// License: MIT AND MPL-2.0

/* generated l10n code */Scratch.translate.setup({"fi":{"_Navigator Info":"Järjestelmän tiedot","_browser":"selain","_dark":"tummaa","_device memory in GB":"laitteen muisti GB:nä","_light":"vaaleaa","_operating system":"käyttöjärjestelmä","_user prefers [THEME] color scheme?":"käyttääkö käyttäjä [THEME] väriteemaa?","_user prefers more contrast?":"käyttääkö käyttäjä korkeaa kontrastia?","_user prefers reduced motion?":"käyttääkö käyttäjä vähennettyä liikettä?"},"it":{"_Navigator Info":"Informazioni Browser e SO","_dark":"scuro","_device memory in GB":"memoria dispositivo in GB","_light":"chiaro","_operating system":"sistema operativo","_user prefers [THEME] color scheme?":"l'utente preferisce il tema [THEME]","_user prefers more contrast?":"l'utente preferisce contrasto alto","_user prefers reduced motion?":"l'utente preferisce movimento ridotto"},"ja":{"_Navigator Info":"ナビゲーター情報","_browser":"ブラウザ","_dark":"ダーク","_device memory in GB":"デバイスメモリー(GB)","_light":"ライト","_operating system":"オペレーションシステム","_user prefers [THEME] color scheme?":"ユーザーが[THEME]配色を好んでいる","_user prefers more contrast?":"ユーザーがコントラストを好む","_user prefers reduced motion?":"ユーザーが動きを減らしたい"},"ko":{"_Navigator Info":"네비게이터 정보","_browser":"브라우저","_dark":"다크","_device memory in GB":"기기 메모리 GB","_light":"라이트","_operating system":"운영 체제","_user prefers [THEME] color scheme?":"사용자가 [THEME]색상 테마를 선호하는가?","_user prefers more contrast?":"사용자가 고대비를 선호하는가?","_user prefers reduced motion?":"사용자가 감소된 움직임을 선호하는가?"},"nb":{"_browser":"nettleser","_dark":"mørk","_device memory in GB":"enhetens minne i GB","_light":"lys","_operating system":"operativsystem","_user prefers [THEME] color scheme?":"bruker foretrekker [THEME] fargeskjema?","_user prefers more contrast?":"brukeren foretrekker mer kontrast?","_user prefers reduced motion?":"bruker foretrekker redusert bevegelse?"},"nl":{"_Navigator Info":"Navigator-info","_dark":"donker","_device memory in GB":"apparaatgeheugen in GB","_light":"licht","_operating system":"besturingssysteem","_user prefers [THEME] color scheme?":"gebruik heeft voorkeur voor [THEME] kleurenschema?","_user prefers more contrast?":"gebruiker heeft voorkeur voor meer contrast?","_user prefers reduced motion?":"gebruiker heeft voorkeur voor verminderde beweging?"},"pl":{"_browser":"przeglądarka","_dark":"ciemny","_light":"jasny"},"ru":{"_Navigator Info":"Информация о Навигаторе","_browser":"браузер","_dark":"тёмную","_device memory in GB":"память устройства в ГБ","_light":"светлую","_operating system":"операционная система","_user prefers [THEME] color scheme?":"пользователь предпочитает [THEME] тему?","_user prefers more contrast?":"пользователь предпочитает больший контраст?","_user prefers reduced motion?":"пользователь предпочитает уменьшенное движение?"},"uk":{"_browser":"браузер","_operating system":"операційна система"},"zh-cn":{"_Navigator Info":"Navigator API 信息","_browser":"浏览器名称","_dark":"暗色","_device memory in GB":"设备运行内存","_light":"亮色","_operating system":"操作系统名称","_user prefers [THEME] color scheme?":"开启了[THEME]主题？","_user prefers more contrast?":"开启了高对比度？","_user prefers reduced motion?":"开启了动画减弱功能？"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  class NavigatorInfo {
    getInfo() {
      return {
        id: "navigatorinfo",
        name: Scratch.translate("Navigator Info"),
        blocks: [
          {
            opcode: "getOS",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("operating system"),
          },
          {
            opcode: "getBrowser",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("browser"),
          },
          {
            opcode: "getMemory",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("device memory in GB"),
          },
          {
            opcode: "getPreferredColorScheme",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("user prefers [THEME] color scheme?"),
            arguments: {
              THEME: {
                type: Scratch.ArgumentType.STRING,
                menu: "THEME",
                defaultValue: "dark",
              },
            },
          },
          {
            opcode: "getPreferredReducedMotion",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("user prefers reduced motion?"),
          },
          {
            opcode: "getPreferredContrast",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("user prefers more contrast?"),
          },
        ],
        menus: {
          THEME: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("light"),
                value: "light",
              },
              {
                text: Scratch.translate("dark"),
                value: "dark",
              },
            ],
          },
        },
      };
    }

    getOS() {
      const userAgent = navigator.userAgent;
      if (userAgent.includes("Windows")) {
        return "Windows";
      } else if (userAgent.includes("Android")) {
        return "Android";
      } else if (
        userAgent.includes("iPhone") ||
        userAgent.includes("iPod") ||
        userAgent.includes("iPad")
      ) {
        return "iOS";
      } else if (userAgent.includes("Linux")) {
        return "Linux";
      } else if (userAgent.includes("CrOS")) {
        return "ChromeOS";
      } else if (userAgent.includes("Mac OS")) {
        return "macOS";
      }
      return "Other";
    }

    getBrowser() {
      const userAgent = navigator.userAgent;
      if (userAgent.includes("Chrome")) {
        return "Chrome";
      } else if (userAgent.includes("Firefox")) {
        return "Firefox";
      } else if (userAgent.includes("Safari")) {
        return "Safari";
      }
      return "Other";
    }

    getMemory() {
      // @ts-expect-error
      if (navigator.deviceMemory == undefined) {
        return "Unsupported";
      } else {
        // @ts-expect-error
        return navigator.deviceMemory;
      }
    }

    getPreferredColorScheme(args) {
      return (
        window.matchMedia("(prefers-color-scheme: dark)").matches ===
        (args.THEME === "dark")
      );
    }

    getPreferredReducedMotion() {
      return !!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    getPreferredContrast() {
      return !!window.matchMedia("(prefers-contrast: more)").matches;
    }
  }

  Scratch.extensions.register(new NavigatorInfo());
})(Scratch);
