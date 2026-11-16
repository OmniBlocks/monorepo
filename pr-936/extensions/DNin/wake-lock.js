// Name: Wake Lock
// ID: dninwakelock
// Description: Prevent the computer from falling asleep.
// By: D-ScratchNinja <https://scratch.mit.edu/users/D-ScratchNinja/>
// License: MIT

/* generated l10n code */Scratch.translate.setup({"de":{"_Wake Lock":"Bleibe wach"},"fi":{"_Wake Lock":"Pidä hereillä","_is wake lock active?":"onko lepotilan esto päällä?","_off":"pois päältä","_on":"päälle","_turn wake lock [enabled]":"kytke lepotilan esto [enabled]"},"it":{"_Wake Lock":"Blocco Standby","_is wake lock active?":"blocco sveglia attivo ","_off":"disabilita","_on":"abilita","_turn wake lock [enabled]":"[enabled] blocco sveglia"},"ja":{"_is wake lock active?":"画面スリープ防止機能はオンになってますか？","_off":"オフ","_on":"オン","_turn wake lock [enabled]":"wake lockを[enabled]にする"},"ko":{"_Wake Lock":"화면 켜짐 고정","_is wake lock active?":"화면 켜짐 고정이 활성화 되었는가?","_off":"비활성화","_on":"활성화","_turn wake lock [enabled]":"화면 켜짐 고정을 [enabled]하기"},"nb":{"_Wake Lock":"Vekkelås","_is wake lock active?":"er vekkelåsen aktiv?","_off":"av","_on":"på","_turn wake lock [enabled]":"slå på vekkelås [enabled]"},"nl":{"_Wake Lock":"Wakker houden","_is wake lock active?":"wakker houden ingeschakeld?","_off":"uit","_on":"in","_turn wake lock [enabled]":"schakel wakker houden [enabled]"},"ru":{"_Wake Lock":"Режим Антисна","_is wake lock active?":"режим антисна включен?","_off":"выключить","_on":"включить","_turn wake lock [enabled]":"включить режим антисна [enabled]"},"tr":{"_Wake Lock":"Uyanma Kilidi"},"uk":{"_Wake Lock":"Блокування Сонного Режиму","_is wake lock active?":"блокування сонного режиму увімкнено?","_off":"вимкнути","_on":"увімкнути","_turn wake lock [enabled]":"[enabled] блокування сонного режиму"},"zh-cn":{"_Wake Lock":"保持唤醒","_is wake lock active?":"唤醒锁激活了？","_off":"关闭","_on":"打开","_turn wake lock [enabled]":"将唤醒锁状态设为[enabled]"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Wake Lock extension must run unsandboxed");
  }

  /** @type {WakeLockSentinel} */
  let wakeLock = null;
  let latestEnabled = false;
  let promise = Promise.resolve();

  class WakeLock {
    constructor(runtime) {
      this.runtime = runtime;
      this.runtime.on("PROJECT_STOP_ALL", this.stopAll.bind(this));

      document.addEventListener("visibilitychange", () => {
        // If enabled, reacquire wake lock when document becomes visible again
        if (wakeLock !== null && document.visibilityState === "visible") {
          latestEnabled = false;
          this.setWakeLock({
            enabled: true,
          });
        }
      });
    }

    getInfo() {
      return {
        id: "dninwakelock",
        name: Scratch.translate("Wake Lock"),
        docsURI: "https://extensions.turbowarp.org/DNin/wake-lock",
        blocks: [
          {
            opcode: "setWakeLock",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate({
              default: "turn wake lock [enabled]",
              description: "[enabled] is a drop down with items 'on' and 'off'",
            }),
            arguments: {
              enabled: {
                type: Scratch.ArgumentType.STRING,
                menu: "state",
                defaultValue: "true",
              },
            },
          },
          {
            opcode: "isLocked",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("is wake lock active?"),
          },
        ],
        menus: {
          state: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("on"),
                value: "true",
              },
              {
                text: Scratch.translate("off"),
                value: "false",
              },
            ],
          },
        },
      };
    }

    stopAll() {
      this.setWakeLock({
        enabled: false,
      });
    }

    setWakeLock(args) {
      if (!navigator.wakeLock) {
        // Not supported in this browser.
        return;
      }
      const enable = Scratch.Cast.toBoolean(args.enabled);
      if (enable && document.visibilityState === "hidden") {
        // Can't request wake lock while document is hidden.
        return;
      }

      const previousEnabled = latestEnabled;
      latestEnabled = enable;
      if (latestEnabled && !previousEnabled) {
        promise = promise
          .then(() => navigator.wakeLock.request("screen"))
          .then((sentinel) => {
            wakeLock = sentinel;
            wakeLock.addEventListener("release", () => {
              if (document.visibilityState === "visible") {
                // If the document is hidden, wake lock should be reacquired when it's visible again.
                wakeLock = null;
                latestEnabled = false;
              }
            });
          })
          .catch((error) => {
            console.error(error);
            // Allow to retry
            latestEnabled = false;
          });
        return promise;
      } else if (!latestEnabled && previousEnabled) {
        promise = promise
          .then(() => {
            if (wakeLock) {
              return wakeLock.release();
            } else {
              // Attempt to enable in the first place didn't work
            }
          })
          .then(() => {
            wakeLock = null;
          })
          .catch((error) => {
            console.error(error);
            wakeLock = null;
          });
        return promise;
      }
    }

    isLocked() {
      return !!wakeLock;
    }
  }

  Scratch.extensions.register(new WakeLock(Scratch.vm.runtime));
})(Scratch);
