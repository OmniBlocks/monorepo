// Name: Local Storage
// ID: localstorage
// Description: Store data persistently. Like cookies, but better.
// License: MIT AND MPL-2.0

/* generated l10n code */Scratch.translate.setup({"de":{"_Local Storage":"Speicherplatz"},"es":{"_Local Storage":"Almacenaje Local","_No namespace set":"No namespace establecido","_delete [KEY] from storage":"borrar [KEY] del almacenaje","_delete storage":"borrar almacenaje","_get [KEY] from storage":"obtener [KEY] del almacenaje","_project title":"título del proyecto","_score":"puntos","_set [KEY] to [VALUE] in storage":"fijar [KEY] a [VALUE] en almacenaje","_set namespace to [ID]":"fijar namespace a [ID]","_when another window changes storage":"cuando otra ventana cambia el almacenaje"},"fi":{"_Local Storage":"Paikallinen muisti","_Local Storage extension: project must run the \"set storage namespace ID\" block before it can use other blocks":"Paikallinen muisti -laajennus: projektissa täytyy suorittaa \"aseta muistin nimiavaruustunnisteeksi\" -lohko ennen kuin muita lohkoja voidaan suorittaa.","_project title":"projektin otsikko","_score":"pisteet","_when another window changes storage":"kun toinen ikkuna muuttaa muistia"},"it":{"_Local Storage":"Memoria Locale","_Local Storage extension: project must run the \"set storage namespace ID\" block before it can use other blocks":"Estensione Archiviazione Locale: il progetto deve eseguire il blocco \"imposta ID spazio di archiviazione\" prima di usare gli altri blocchi","_No namespace set":"Nessun namespace impostato","_delete [KEY] from storage":"rimuovi [KEY] da archivio","_delete storage":"svuota archivio","_get [KEY] from storage":"ottieni [KEY] da archivio","_project title":"titolo progetto","_score":"punteggio","_set [KEY] to [VALUE] in storage":"porta [KEY] a [VALUE] in archivio","_set namespace to [ID]":"imposta namespace a [ID]","_when another window changes storage":"quando altra finestra cambia spazio di archiviazione"},"ja":{"_Local Storage":"ローカルストレージ","_Local Storage extension: project must run the \"set storage namespace ID\" block before it can use other blocks":"ローカルストレージ拡張機能：他のブロックを実行する前に、「ストレージの名前を()にする」ブロックを実行する必要があります。","_Namespace: {namespace}":"名前空間: {namespace}","_No namespace set":"名前空間が設定されていません","_delete [KEY] from storage":"ストレージから[KEY]を削除する","_delete storage":"ストレージを削除する","_get [KEY] from storage":"ストレージから[KEY]を取得","_project title":"プロンプトのタイトル","_score":"スコア","_set [KEY] to [VALUE] in storage":"ストレージの[KEY]を[VALUE]にする","_set namespace to [ID]":"名前空間を[ID]にする","_when another window changes storage":"他のウィンドウがストレージを変えたとき"},"ko":{"_Local Storage":"로컬 스토리지","_Local Storage extension: project must run the \"set storage namespace ID\" block before it can use other blocks":"로컬 스토리지 확장 기능: 확장 기능의 블록을 사용하기 전에 반드시 \"스토리지의 네임스페이스 ID를 ...(으)로 정하기\" 블록을 실행해야 합니다","_project title":"프로젝트 제목","_score":"점수","_when another window changes storage":"다른 창에서 스토리지를 변경했을 때"},"nb":{"_Local Storage":"Lokal lagring","_Local Storage extension: project must run the \"set storage namespace ID\" block before it can use other blocks":"Lokal lagring utvidelse: prosjektet må kjøre blokken \"sett lagringsnavnerom-ID\" før det kan bruke andre blokker","_project title":"prosjekttittel","_score":"poengsum","_when another window changes storage":"når et annet vindu endrer lagring"},"nl":{"_Local Storage":"Lokale opslag","_Local Storage extension: project must run the \"set storage namespace ID\" block before it can use other blocks":"Lokale opslag-extensie: het project moet eerst een opslagnaamruimte-ID toegewezen krijgen voordat de andere blokken kunnen werken.","_project title":"projecttitel","_when another window changes storage":"wanneer een ander venster de opslag aanpast"},"pl":{"_project title":"tytuł projektu","_score":"wynik"},"ru":{"_Local Storage":"Локальное Хранилище","_Local Storage extension: project must run the \"set storage namespace ID\" block before it can use other blocks":"Расширение Локальное Хранилище: проект должен запустить блок \"задать ID пространства имен хранилища\", прежде чем он сможет использовать другие блоки","_Namespace: {namespace}":"Пространство: {namespace}","_No namespace set":"Нет заданных пространств","_delete [KEY] from storage":"удалить [KEY] из хранилища","_delete storage":"удалить хранилище","_get [KEY] from storage":"получить [KEY] из хранилища","_project title":"название проекта","_score":"очки","_set [KEY] to [VALUE] in storage":"задать [KEY] на [VALUE] в хранилище","_set namespace to [ID]":"задать пространство на [ID]","_when another window changes storage":"когда другое окно изменяет хранилище"},"uk":{"_Local Storage":"Локальне Сховище"},"zh-cn":{"_Local Storage":"本地存储","_Local Storage extension: project must run the \"set storage namespace ID\" block before it can use other blocks":"本地存储拓展：请先运行“将存储命名空间ID设为”积木才能使用下面的积木","_Namespace: {namespace}":"命名空间：{namespace}","_No namespace set":"未设置命名空间","_delete [KEY] from storage":"从存储中删除[KEY]","_delete storage":"删除存储","_get [KEY] from storage":"从存储中获取[KEY]","_project title":"作品标题","_score":"分数","_set [KEY] to [VALUE] in storage":"将存储中的[KEY]设为[VALUE]","_set namespace to [ID]":"将命名空间设为[ID]","_when another window changes storage":"当其他页面修改本地存储数据"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Local Storage must be run unsandboxed");
  }

  const getNamespace = () =>
    Scratch.vm.runtime.extensionStorage["localstorage"]?.namespace;

  /**
   * @param {string} newNamespace
   */
  const setNamespace = (newNamespace) => {
    Scratch.vm.runtime.extensionStorage["localstorage"] = {
      namespace: newNamespace,
    };
    readFromStorage();

    // We can generate namespace before we have fully loaded
    if (Scratch.vm.extensionManager.isExtensionLoaded("localstorage")) {
      Scratch.vm.extensionManager.refreshBlocks("localstorage");
    }
  };

  const STORAGE_PREFIX = "extensions.turbowarp.org/local-storage:";
  const getStorageKey = () => `${STORAGE_PREFIX}${getNamespace()}`;

  /**
   * Cached in memory for performance.
   * @type {Record<string, string|number|boolean>}
   */
  let namespaceValues = Object.create(null);

  const readFromStorage = () => {
    namespaceValues = Object.create(null);

    try {
      // localStorage could throw if unsupported
      const data = localStorage.getItem(getStorageKey());
      if (data) {
        // JSON.parse could throw if data is invalid
        const parsed = JSON.parse(data);
        if (parsed && parsed.data) {
          // Remove invalid values from the JSON
          for (const [key, value] of Object.entries(parsed.data)) {
            if (
              typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "boolean"
            ) {
              namespaceValues[key] = value;
            }
          }
        }
      }
    } catch (error) {
      console.error("Error reading from local storage", error);
    }
  };

  const saveToLocalStorage = () => {
    try {
      if (Object.keys(namespaceValues).length > 0) {
        localStorage.setItem(
          getStorageKey(),
          JSON.stringify({
            // If we find that turbowarp.org is commonly running out of shared space in local storage,
            // having a timestamp here makes it at least theoretically possible to delete storage based
            // on last used time.
            time: Math.round(Date.now() / 1000),
            data: namespaceValues,
          })
        );
      } else {
        localStorage.removeItem(getStorageKey());
      }
    } catch (error) {
      console.error("Error saving to local storage", error);
    }
  };

  window.addEventListener("storage", (event) => {
    if (
      getNamespace() &&
      event.key === getStorageKey() &&
      event.storageArea === localStorage
    ) {
      readFromStorage();
      Scratch.vm.runtime.startHats("localstorage_whenChanged");
    }
  });

  const generateRandomNamespace = () => {
    // doesn't need to be cryptographically secure and doesn't need to have excessive length
    // this has 16^16 = 18446744073709551616 possible namespaces which is plenty
    const soup = "0123456789abcdef";
    let id = "";
    for (let i = 0; i < 16; i++) {
      id += soup[Math.floor(Math.random() * soup.length)];
    }
    return id;
  };

  const prepareInitialNamespace = () => {
    if (getNamespace()) {
      readFromStorage();
    } else {
      setNamespace(generateRandomNamespace());
    }
  };

  Scratch.vm.runtime.on("PROJECT_LOADED", () => {
    prepareInitialNamespace();
  });

  Scratch.vm.runtime.on("RUNTIME_DISPOSED", () => {
    // Will always be followed by a PROJECT_LOADED event later
    namespaceValues = Object.create(null);
  });

  prepareInitialNamespace();

  let lastNamespaceWarning = 0;
  const validNamespace = () => {
    const valid = !!getNamespace();
    if (!valid && Date.now() - lastNamespaceWarning > 3000) {
      alert(
        Scratch.translate(
          'Local Storage extension: project must run the "set storage namespace ID" block before it can use other blocks'
        )
      );
      lastNamespaceWarning = Date.now();
    }
    return valid;
  };

  class LocalStorage {
    getInfo() {
      return {
        id: "localstorage",
        name: Scratch.translate("Local Storage"),
        docsURI: "https://extensions.turbowarp.org/local-storage",
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: getNamespace()
              ? Scratch.translate(
                  {
                    default: "Namespace: {namespace}",
                  },
                  {
                    namespace: getNamespace(),
                  }
                )
              : Scratch.translate("No namespace set"),
          },
          {
            opcode: "get",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("get [KEY] from storage"),
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("score"),
              },
            },
          },
          {
            opcode: "set",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set [KEY] to [VALUE] in storage"),
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("score"),
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1000",
              },
            },
          },
          {
            opcode: "remove",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete [KEY] from storage"),
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("score"),
              },
            },
          },
          {
            opcode: "removeAll",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete storage"),
          },
          {
            opcode: "whenChanged",
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate("when another window changes storage"),
            isEdgeActivated: false,
          },
          "---",
          {
            opcode: "setProjectId",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set namespace to [ID]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue:
                  getNamespace() || Scratch.translate("project title"),
              },
            },
          },
        ],
      };
    }

    setProjectId({ ID }) {
      setNamespace(Scratch.Cast.toString(ID));
    }

    get({ KEY }) {
      if (!validNamespace()) {
        return "";
      }
      KEY = Scratch.Cast.toString(KEY);
      if (!Object.prototype.hasOwnProperty.call(namespaceValues, KEY)) {
        return "";
      }
      return namespaceValues[KEY];
    }

    set({ KEY, VALUE }) {
      if (!validNamespace()) {
        return "";
      }
      namespaceValues[Scratch.Cast.toString(KEY)] = VALUE;
      saveToLocalStorage();
    }

    remove({ KEY }) {
      if (!validNamespace()) {
        return "";
      }
      delete namespaceValues[Scratch.Cast.toString(KEY)];
      saveToLocalStorage();
    }

    removeAll() {
      if (!validNamespace()) {
        return "";
      }
      namespaceValues = Object.create(null);
      saveToLocalStorage();
    }
  }

  Scratch.extensions.register(new LocalStorage());
})(Scratch);
