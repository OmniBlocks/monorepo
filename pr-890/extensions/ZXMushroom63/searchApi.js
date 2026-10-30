// Name: Search Params
// ID: zxmushroom63searchparams
// Description: Interact with URL search parameters: the part of the URL after a question mark.
// By: ZXMushroom63
// License: MIT

/* generated l10n code */Scratch.translate.setup({"de":{"_Search Params":"URL-Parameter","_name":"Name"},"fi":{"_Search Params":"URL-parametrit","_append search parameter [ID] with value [VAL]":"lisää [VAL] -arvoinen URL-parametri [ID]","_delete search parameter [ID]":"poista URL-parametri [ID]","_has search parameter [ID]?":"onko URL-parametri [ID] olemassa?","_index [I] of search parameters [ID]":"[I]. URL-parametri [ID]","_length of search parameters":"URL-parametrien määrä","_name":"nimi","_occurrences of search parameter [ID]":"URL-parametrin [ID] esiintymiskerrat","_search parameter [PARAM] at index [I]":"[I]. URL-parametrin [PARAM]","_set search parameter [ID] to [VAL]":"aseta URL-parametri [ID] arvoon [VAL]","_value":"arvo","_value of search parameter [ID]":"URL-parametrin [ID] arvo "},"it":{"_Search Params":"Parametri di Ricerca in URL","_append search parameter [ID] with value [VAL]":"aggiungi parametro di ricerca [ID] con valore [VAL]","_delete search parameter [ID]":"rimuovi parametro di ricerca [ID]","_has search parameter [ID]?":"presente parametro di ricerca [ID]","_index [I] of search parameters [ID]":"index [I] dei parametri di ricerca [ID]","_length of search parameters":"lunghezza parametri di ricerca","_name":"nome","_occurrences of search parameter [ID]":"occorrenze del parametro di ricerca [ID]","_search parameter [PARAM] at index [I]":"parametro di ricerca [PARAM] alla posizione [I]","_set search parameter [ID] to [VAL]":"imposta parametro di ricerca [ID] a [VAL]","_value":"valore","_value of search parameter [ID]":"valore parametro di ricerca [ID]"},"ja":{"_Search Params":"検索パラメータ","_append search parameter [ID] with value [VAL]":"検索パラメータ[ID]を値[VAL]で追加する","_delete search parameter [ID]":"検索パラメータ[ID]を削除する","_has search parameter [ID]?":"検索パラメータ[ID]がある","_index [I] of search parameters [ID]":"検索パラメータ[ID]の[I]番目","_length of search parameters":"検索パラメータの長さ","_name":"名前","_occurrences of search parameter [ID]":"検索パラメータで[ID]が出てきた回数","_search parameter [PARAM] at index [I]":"[I]番目の検索パラメータの[PARAM]","_set search parameter [ID] to [VAL]":"検索パラメータ[ID]を[VAL]にする","_value":"値","_value of search parameter [ID]":"検索パラメータの[ID]の値"},"ko":{"_Search Params":"검색 파라미터","_append search parameter [ID] with value [VAL]":"검색 파라미터 [ID](으)로 [VAL] 추가하기","_delete search parameter [ID]":"검색 파라미터 [ID]을(를) 삭제하기","_has search parameter [ID]?":"검색 파라미터 [ID]이(가) 존재하는가?","_index [I] of search parameters [ID]":"검색 파라미터 [ID]의 [I]번째 값","_length of search parameters":"모든 검색 파라미터 개수","_name":"이름","_occurrences of search parameter [ID]":"검색 파라미터 [ID]의 개수","_search parameter [PARAM] at index [I]":"검색 파라미터 [I]번째의 [PARAM]","_set search parameter [ID] to [VAL]":"검색 파라미터 [ID]을(를) [VAL](으)로 정하기","_value":"값","_value of search parameter [ID]":"검색 파라미터 [ID]의 값"},"nb":{"_Search Params":"Søkeparametere","_name":"navn"},"nl":{"_Search Params":"Zoekparameters","_name":"naam","_value":"waarde"},"pl":{"_name":"nazwa"},"ru":{"_Search Params":"Параметры Поиска","_append search parameter [ID] with value [VAL]":"добавьте к параметру поиска [ID] значение [VAL]","_delete search parameter [ID]":"удалить параметр поиска [ID]","_has search parameter [ID]?":"имеет параметр поиска [ID]?","_index [I] of search parameters [ID]":"индекс [I] параметров поиска [ID]","_length of search parameters":"длина параметров поиска","_name":"имя","_occurrences of search parameter [ID]":"вхождения параметра поиска [ID]","_search parameter [PARAM] at index [I]":"параметр поиска [PARAM] по индексу [I]","_set search parameter [ID] to [VAL]":"задать для параметра поиска [ID] значение [VAL]","_value":"значение","_value of search parameter [ID]":"значение параметра поиска [ID]"},"tr":{"_Search Params":"Arama Parametreleri"},"uk":{"_Search Params":"Параметри Пошуку","_name":"ім'я"},"zh-cn":{"_Search Params":"搜索参数","_append search parameter [ID] with value [VAL]":"添加搜索参数[ID]值为[VAL]","_delete search parameter [ID]":"删除搜索参数[ID]","_has search parameter [ID]?":"有搜索参数[ID]？","_index [I] of search parameters [ID]":"第[I]个搜索参数[ID]","_length of search parameters":"搜索参数长度","_name":"名字","_occurrences of search parameter [ID]":"搜索参数[ID]的出现次数","_search parameter [PARAM] at index [I]":"第[I]个搜索参数的[PARAM]","_set search parameter [ID] to [VAL]":"将搜索参数[ID]设为[VAL]","_value":"值","_value of search parameter [ID]":"搜索参数[ID]的值"}});/* end generated l10n code */(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("SearchParams must be run unsandboxed.");
  }

  class SearchApi {
    getInfo() {
      return {
        id: "zxmushroom63searchparams",
        name: Scratch.translate("Search Params"),
        color1: "#b4b4b4",
        color2: "#9c9c9c",
        color3: "#646464",
        blocks: [
          {
            opcode: "searchparam",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("value of search parameter [ID]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "x",
              },
            },
          },
          {
            opcode: "occurencesofsearchparam",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("occurrences of search parameter [ID]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "x",
              },
            },
          },
          {
            opcode: "indexedsearchparam",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("index [I] of search parameters [ID]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "x",
              },
              I: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: "setsearchparam",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set search parameter [ID] to [VAL]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "x",
              },
              VAL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "15",
              },
            },
          },
          {
            opcode: "deletesearchparam",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete search parameter [ID]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "x",
              },
            },
          },
          {
            opcode: "appendsearchparam",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "append search parameter [ID] with value [VAL]"
            ),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "x",
              },
              VAL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "15",
              },
            },
          },
          {
            opcode: "hassearchparam",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("has search parameter [ID]?"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "x",
              },
            },
          },
          {
            opcode: "searchparamslength",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("length of search parameters"),
          },
          {
            opcode: "searchparamatindex",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("search parameter [PARAM] at index [I]"),
            arguments: {
              PARAM: {
                type: Scratch.ArgumentType.STRING,
                menu: "PARAM",
              },
              I: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
        ],
        menus: {
          PARAM: {
            acceptReporters: true,
            items: [
              { text: Scratch.translate("value"), value: "value" },
              { text: Scratch.translate("name"), value: "name" },
            ],
          },
        },
      };
    }

    searchparam({ ID }) {
      return new URLSearchParams(location.search).get(ID.toString()) || "";
    }

    occurencesofsearchparam({ ID }) {
      return (
        new URLSearchParams(location.search).getAll(ID.toString()).length || 0
      );
    }

    indexedsearchparam({ ID, I }) {
      return (
        new URLSearchParams(location.search).getAll(ID.toString())[
          parseInt(I) - 1
        ] || ""
      );
    }

    setsearchparam({ ID, VAL }) {
      var s = new URLSearchParams(location.search);
      s.set(ID.toString(), VAL.toString());
      history.replaceState("", "", "?" + s.toString());
    }

    searchparamslength() {
      var s = new URLSearchParams(location.search);
      // @ts-ignore
      return typeof s.size !== "object" ? s.size : 0;
    }

    deletesearchparam({ ID }) {
      var s = new URLSearchParams(location.search);
      s.delete(ID.toString());
      history.replaceState("", "", "?" + s.toString());
    }

    appendsearchparam({ ID, VAL }) {
      var s = new URLSearchParams(location.search);
      s.append(ID.toString(), VAL.toString());
      history.replaceState("", "", "?" + s.toString());
    }

    hassearchparam({ ID }) {
      var s = new URLSearchParams(location.search);
      return s.has(ID.toString()) || false;
    }

    searchparamatindex({ PARAM, I }) {
      var index = parseInt(I) - 1 || 0;
      index = Math.max(0, index);
      var s = new URLSearchParams(location.search);
      var values = PARAM.toString() === "value" ? s.values() : s.keys();
      var i = 0;
      for (const value of values) {
        if (i === index) {
          return value;
        }
        i++;
      }
      return "";
    }
  }
  Scratch.extensions.register(new SearchApi());
})(Scratch);
