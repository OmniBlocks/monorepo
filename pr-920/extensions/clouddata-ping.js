// Name: Ping Cloud Data
// ID: clouddataping
// Description: Determine whether a cloud variable server is probably up.
// Original: TheShovel
// License: MIT AND MPL-2.0

/* generated l10n code */Scratch.translate.setup({"de":{"_Ping Cloud Data":"Ping Clouddaten","_is cloud data server [SERVER] up?":"Ist Cloud-Datenserver [SERVER] verfügbar?"},"fi":{"_Ping Cloud Data":"Pilvidatatarkastus","_is cloud data server [SERVER] up?":"onko pilvidatapalvelin [SERVER] käytössä?"},"it":{"_Ping Cloud Data":"Ping Dati Cloud","_is cloud data server [SERVER] up?":"il server cloud [SERVER] è attivo"},"ja":{"_Ping Cloud Data":"クラウドデータのPing","_is cloud data server [SERVER] up?":"クラウドサーバー[SERVER]が稼働している"},"ko":{"_Ping Cloud Data":"핑 클라우드 데이터","_is cloud data server [SERVER] up?":"클라우드 데이터 서버 [SERVER]이(가) 활성화인가?"},"nb":{"_is cloud data server [SERVER] up?":"er skydata-serveren [SERVER] oppe?"},"nl":{"_Ping Cloud Data":"Cloudservers pingen","_is cloud data server [SERVER] up?":"is cloud-gegevensserver [SERVER] bereikbaar?"},"ru":{"_Ping Cloud Data":"Пинг Облачных Данных","_is cloud data server [SERVER] up?":"сервер облачных данных [SERVER] в сети?"},"zh-cn":{"_Ping Cloud Data":"检测云数据","_is cloud data server [SERVER] up?":"云服务器[SERVER]可以使用？"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  /**
   * @typedef CacheEntry
   * @property {number} expires
   * @property {boolean} value
   */

  /** @type {Map<string, Promise<CacheEntry>>} */
  const computing = new Map();
  /** @type {Map<string, CacheEntry>} */
  const computed = new Map();

  /**
   * @param {string} uri
   * @returns {Promise<CacheEntry>}
   */
  const pingWebSocket = async (uri) => {
    if (!(await Scratch.canFetch(uri))) {
      return {
        expires: 0,
        value: false,
      };
    }

    /** @type {WebSocket} */
    let ws;
    try {
      // Permission is checked earlier.
      // eslint-disable-next-line extension/check-can-fetch
      ws = new WebSocket(uri);
    } catch (e) {
      return {
        expires: 0,
        value: false,
      };
    }

    let timeoutId;
    const isUp = await new Promise((resolve) => {
      ws.onopen = () => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      };
      ws.onclose = () => {
        resolve(false);
      };
      ws.onerror = () => {
        resolve(false);
      };
      timeoutId = setTimeout(() => {
        ws.close();
      }, 5000);
    });

    ws.close();
    clearTimeout(timeoutId);

    return {
      expires: Date.now() + 60000,
      value: isUp,
    };
  };

  /**
   * @param {string} uri
   * @returns {boolean|Promise<boolean>}
   */
  const cachedPingWebSocket = (uri) => {
    const computingEntry = computing.get(uri);
    if (computingEntry) {
      return computingEntry.then((entry) => entry.value);
    }

    const computedEntry = computed.get(uri);
    if (computedEntry && Date.now() < computedEntry.expires) {
      return computedEntry.value;
    }

    const promise = pingWebSocket(uri);
    computing.set(uri, promise);
    return promise.then((entry) => {
      computing.delete(uri);
      computed.set(uri, entry);
      return entry.value;
    });
  };

  class PingUtil {
    getInfo() {
      return {
        id: "clouddataping",
        name: Scratch.translate("Ping Cloud Data"),
        blocks: [
          {
            opcode: "ping",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("is cloud data server [SERVER] up?"),
            arguments: {
              SERVER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "wss://clouddata.turbowarp.org",
              },
            },
          },
        ],
      };
    }

    ping({ SERVER }) {
      return cachedPingWebSocket(SERVER);
    }
  }

  Scratch.extensions.register(new PingUtil());
})(Scratch);
