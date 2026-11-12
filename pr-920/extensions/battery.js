// Name: Battery
// ID: battery
// Description: Access information about the battery of phones or laptops. May not work on all devices and browsers.
// License: MIT AND MPL-2.0

/* generated l10n code */Scratch.translate.setup({"de":{"_Battery":"Batterie"},"fi":{"_Battery":"Akku","_battery level":"akun varaustaso","_charging?":"ladataanko laitetta?","_seconds until charged":"sekunteja täyteen lataukseen","_seconds until empty":"sekunteja akun tyhjenemiseen","_when battery level changed":"kun akun varaustaso muuttuu","_when charging changed":"kun latauksen tila muuttuu","_when time until charged changed":"kun aika täyteen lataukseen muuttuu","_when time until empty changed":"kun aika akun tyhjenemiseen muuttuu"},"it":{"_Battery":"Batteria","_battery level":"livello della batteria","_charging?":"in carica","_seconds until charged":"secondi mancanti a completare la ricarica","_seconds until empty":"secondi mancanti a scaricare la batteria","_when battery level changed":"quando il livello della batteria cambia","_when charging changed":"quando la ricarica cambia","_when time until charged changed":"quando il tempo necessario alla ricarica completa cambia","_when time until empty changed":"quando il tempo mancante allo scaricamento completo cambia"},"ja":{"_Battery":"バッテリー","_battery level":"バッテリー残量","_charging?":"充電中","_seconds until charged":"充電完了までの秒数","_seconds until empty":"バッテリーが0%になるまでの秒数","_when battery level changed":"バッテリー残量が変化したとき","_when charging changed":"充電状況が変化したとき","_when time until charged changed":"充電完了までの秒数が変化したとき","_when time until empty changed":"バッテリーが0%になるまでの秒数が変化したとき"},"ko":{"_Battery":"배터리","_battery level":"배터리 레벨","_charging?":"충전중인가?","_seconds until charged":"완충까지 걸리는 시간 초","_seconds until empty":"방전까지 걸리는 시간 초","_when battery level changed":"배터리 레벨이 바뀌었을 때","_when charging changed":"충전 여부가 바뀌었을 때","_when time until charged changed":"완충까지 걸리는 시간이 바뀌었을 때","_when time until empty changed":"방전까지 걸리는 시간이 바뀌었을 때"},"nb":{"_Battery":"Batteri","_battery level":"batterinivå","_charging?":"lading?","_seconds until charged":"sekunder til oppladet","_seconds until empty":"sekunder til tom","_when battery level changed":"når batterinivået endret seg","_when charging changed":"når lading endret","_when time until charged changed":"når tid til lading endret seg","_when time until empty changed":"når tiden til tom endret seg"},"nl":{"_Battery":"Batterij","_battery level":"batterijniveau","_charging?":"batterij aan het opladen?","_seconds until charged":"seconden tot batterij opgeladen","_seconds until empty":"seconden tot batterij leeg","_when battery level changed":"wanneer batterijniveau verandert","_when charging changed":"wanneer batterij begint of stopt met opladen","_when time until charged changed":"wanneer tijd tot batterij opgeladen verandert","_when time until empty changed":"wanneer tijd tot batterij leeg verandert"},"ru":{"_Battery":"Батарея","_battery level":"заряд батареи","_charging?":"заряжается?","_seconds until charged":"секунд до полного заряда","_seconds until empty":"секунд до конца заряда","_when battery level changed":"когда уровень заряда изменился","_when charging changed":"когда зарядка изменилась","_when time until charged changed":"когда время до полного заряда изменилось","_when time until empty changed":"когда время до конца заряда изменилось"},"tr":{"_Battery":"Batarya"},"uk":{"_Battery":"Батарея"},"zh-cn":{"_Battery":"电池","_battery level":"电量","_charging?":"正在充电？","_seconds until charged":"最近一次充电的时间","_seconds until empty":"用完电的时间","_when battery level changed":"当电量变化时","_when charging changed":"当充电状态变化时","_when time until charged changed":"当最近一次充电的时间变化时","_when time until empty changed":"当用完电的时间变化时"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  /** @type {Promise<BatteryManager>|null} */
  let getBatteryPromise = null;
  /** @type {BatteryManager|null} */
  let cachedBattery = null;
  /** @type {boolean} */
  let batteryError = false;
  const withBattery = (callback) => {
    // Getting the BatteryManager is async the first time. Usually it's very fast, but we shouldn't assume that it is.
    // All the logic here lets us return values immediately when we have already got the battery instead of forcing
    // a delay by returning a promise.
    if (!navigator.getBattery || batteryError) {
      return callback(null);
    }
    if (cachedBattery) {
      return callback(cachedBattery);
    }
    if (!getBatteryPromise) {
      getBatteryPromise = navigator
        .getBattery()
        .then((battery) => {
          getBatteryPromise = null;
          cachedBattery = battery;

          cachedBattery.addEventListener("chargingchange", () => {
            Scratch.vm.runtime.startHats("battery_chargingChanged");
          });
          cachedBattery.addEventListener("levelchange", () => {
            Scratch.vm.runtime.startHats("battery_levelChanged");
          });
          cachedBattery.addEventListener("chargingtimechange", () => {
            Scratch.vm.runtime.startHats("battery_chargeTimeChanged");
          });
          cachedBattery.addEventListener("dischargingtimechange", () => {
            Scratch.vm.runtime.startHats("battery_dischargeTimeChanged");
          });

          return cachedBattery;
        })
        .catch((error) => {
          getBatteryPromise = null;
          console.error("Could not get battery", error);
          batteryError = true;
          return null;
        });
    }
    return getBatteryPromise.then((battery) => {
      return callback(battery);
    });
  };

  // Try to get the battery immediately so that event blocks work.
  withBattery(() => {});

  class BatteryExtension {
    getInfo() {
      return {
        name: Scratch.translate("Battery"),
        id: "battery",
        color1: "#cf8436",
        blocks: [
          {
            opcode: "charging",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("charging?"),
          },
          {
            opcode: "level",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("battery level"),
          },
          {
            opcode: "chargeTime",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("seconds until charged"),
          },
          {
            opcode: "dischargeTime",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("seconds until empty"),
          },
          {
            opcode: "chargingChanged",
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate("when charging changed"),
            isEdgeActivated: false,
          },
          {
            opcode: "levelChanged",
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate("when battery level changed"),
            isEdgeActivated: false,
          },
          {
            opcode: "chargeTimeChanged",
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate("when time until charged changed"),
            isEdgeActivated: false,
          },
          {
            opcode: "dischargeTimeChanged",
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate("when time until empty changed"),
            isEdgeActivated: false,
          },
        ],
      };
    }
    charging() {
      return withBattery((battery) => {
        if (!battery) return true;
        return battery.charging;
      });
    }
    level() {
      return withBattery((battery) => {
        if (!battery) return 100;
        return battery.level * 100;
      });
    }
    chargeTime() {
      return withBattery((battery) => {
        if (!battery) return 0;
        return battery.chargingTime;
      });
    }
    dischargeTime() {
      return withBattery((battery) => {
        if (!battery) return Infinity;
        return battery.dischargingTime;
      });
    }
  }

  Scratch.extensions.register(new BatteryExtension());
})(Scratch);
