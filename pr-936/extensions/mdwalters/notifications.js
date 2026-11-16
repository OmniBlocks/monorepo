// Name: Notifications
// ID: mdwaltersnotifications
// Description: Display notifications.
// License: MIT

/* generated l10n code */Scratch.translate.setup({"de":{"_Notifications":"Benachrichtigungen"},"fi":{"_Hello, world!":"Hei kaikki!","_Notification from project":"Ilmoitus projektista","_Notifications":"Ilmoitukset","_close notification":"sulje ilmoitus","_create notification with text [text]":"luo ilmoitus tekstillä [text]","_has notification permission?":"onko lupa ilmoitusten lähettämiseen?","_request notification permission":"pyydä lupaa ilmoitusten lähettämiseen"},"it":{"_Hello, world!":"Ciao mondo!","_Notification from project":"Notifica da progetto","_Notifications":"Notifiche","_close notification":"chiudi notifica","_create notification with text [text]":"crea notifica con testo [text]","_has notification permission?":"notifiche permesse","_request notification permission":"richiedi permesso notifiche"},"ja":{"_Hello, world!":"こんにちは、世界！","_Notification from project":"プロジェクトからの通知","_Notifications":"通知","_close notification":"通知を消す","_create notification with text [text]":"テキスト[text]で通知を作成する","_has notification permission?":"通知権限を持っている？","_request notification permission":"通知権限を要求する"},"ko":{"_Hello, world!":"헬로 월드!","_Notification from project":"프로젝트의 알림","_Notifications":"알림","_close notification":"알림 닫기","_create notification with text [text]":"텍스트 알림 생성하기 [text]","_has notification permission?":"알림 권한을 받았는가?","_request notification permission":"알림 권한 요청하기"},"nb":{"_Hello, world!":"Hei, verden!","_Notifications":"Varsler"},"nl":{"_Hello, world!":"Hallo, wereld!","_Notification from project":"Melding van project","_Notifications":"Meldingen","_close notification":"sluit melding","_create notification with text [text]":"creëer melding met tekst [text]","_request notification permission":"verzoek meldingstoestemming"},"ru":{"_Hello, world!":"Привет, мир!","_Notification from project":"Уведомления из проекта","_Notifications":"Уведомления","_close notification":"закрыть уведомление","_create notification with text [text]":"создать уведомление с текстом [text]","_has notification permission?":"есть разрешение на уведомления?","_request notification permission":"запрос на разрешение уведомлений"},"uk":{"_Hello, world!":"Привіт, світ!","_Notification from project":"Сповіщення з проєкту","_Notifications":"Сповіщення","_close notification":"приховати сповіщення","_create notification with text [text]":"надіслати сповіщення з текстом [text]","_has notification permission?":"може надсилати сповіщення?","_request notification permission":"надіслати запит на надсилання сповіщень"},"zh-cn":{"_Hello, world!":"你好，世界！","_Notification from project":"来自作品的通知","_Notifications":"通知","_close notification":"关闭通知","_create notification with text [text]":"创建带有文字[text]的通知","_has notification permission?":"允许显示通知？","_request notification permission":"请求允许显示通知"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  let denied = false;
  /** @type {Notification|null} */
  let notification = null;

  const askForNotificationPermission = async () => {
    try {
      const allowedByVM = await Scratch.canNotify();
      if (!allowedByVM) {
        throw new Error("Denied by VM");
      }

      const allowedByBrowser = await Notification.requestPermission();
      if (allowedByBrowser === "denied") {
        throw new Error("Denied by browser");
      }

      denied = false;
      return true;
    } catch (e) {
      denied = true;
      console.warn("Could not request notification permissions", e);
      return false;
    }
  };

  const isAndroid = () => navigator.userAgent.includes("Android");

  const getServiceWorkerRegistration = () => {
    if (!("serviceWorker" in navigator)) return null;
    // This is only needed on Android
    if (!isAndroid()) return null;
    return navigator.serviceWorker.getRegistration();
  };

  class Notifications {
    constructor() {
      Scratch.vm.runtime.on("RUNTIME_DISPOSED", () => {
        this._closeNotification();
      });
    }
    getInfo() {
      return {
        id: "mdwaltersnotifications",
        name: Scratch.translate("Notifications"),
        blocks: [
          {
            opcode: "requestPermission",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("request notification permission"),
          },
          {
            opcode: "hasPermission",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("has notification permission?"),
            disableMonitor: true,
          },
          {
            opcode: "showNotification",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("create notification with text [text]"),
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate({
                  default: "Hello, world!",
                  description: "Default text in the create notification block",
                }),
              },
            },
          },
          {
            opcode: "closeNotification",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("close notification"),
          },
        ],
      };
    }

    requestPermission() {
      return askForNotificationPermission();
    }

    hasPermission() {
      if (denied) {
        return false;
      }
      return askForNotificationPermission();
    }

    async _showNotification(text) {
      if (await this.hasPermission()) {
        const title = Scratch.translate({
          default: "Notification from project",
          description: "Title of notifications created by the project",
        });
        const options = {
          body: text,
        };
        try {
          notification = new Notification(title, options);
        } catch (e) {
          // On Android we need to go through the service worker.
          const registration = await getServiceWorkerRegistration();
          if (registration) {
            try {
              await registration.showNotification(title, options);
            } catch (e2) {
              console.error("Could not show notification", e, e2);
            }
          } else {
            console.error("Could not show notification", e);
          }
        }
      }
    }

    showNotification(args) {
      this._showNotification(Scratch.Cast.toString(args.text));
    }

    async _closeNotification() {
      if (notification) {
        notification.close();
        notification = null;
      }

      const registration = await getServiceWorkerRegistration();
      if (registration) {
        const notifications = await registration.getNotifications();
        for (const notification of notifications) {
          notification.close();
        }
      }
    }

    closeNotification() {
      this._closeNotification();
    }
  }

  Scratch.extensions.register(new Notifications());
})(Scratch);
