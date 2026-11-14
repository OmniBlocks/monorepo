// Name: Dictionaries
// ID: verctedictionaries
// Description: Use the power of dictionaries in your project.
// By: Vercte <https://scratch.mit.edu/users/lolecksdeehaha/>
// License: MIT

/* generated l10n code */Scratch.translate.setup({"fi":{"_Dictionaries":"Sanakirjat","_change key [KEY] in dictionary [DICT] by [BY]":"lisää sanakirjan [DICT] avaimeen [KEY] arvo [BY]","_key [KEY] from dictionary [DICT]":"sanakirjan [DICT] avain [KEY]","_key [KEY] in dictionary [DICT] is defined?":"onko avain [KEY] määritelty sanakirjassa [DICT]?","_key [KEY] in dictionary [DICT] is null?":"onko sanakirjan [DICT] avaimen [KEY] arvo null?","_list of dictionaries":"sanakirjaluettelo","_parse JSON [OBJ] into dictionary [DICT]":"muunna JSON-koodi [OBJ] sanakirjaksi [DICT]","_remove dictionary [DICT]":"poista sanakirja [DICT]","_remove key [KEY] from dictionary [DICT]":"poista avain [KEY] sanakirjasta [DICT]","_set key [KEY] in dictionary [DICT] to [VAL]":"aseta sanakirjan [DICT] avain [KEY] arvoon [VAL]","_stringify dictionary [DICT] into JSON":"sanakirja [DICT] JSON-muodossa"},"it":{"_Dictionaries":"Dizionari","_change key [KEY] in dictionary [DICT] by [BY]":"cambia chiave [KEY] del dizionario [DICT] di [BY]","_key [KEY] from dictionary [DICT]":"chiave [KEY] del dizionario [DICT]","_key [KEY] in dictionary [DICT] is defined?":"chiave [KEY] definita in dizionario [DICT] ","_key [KEY] in dictionary [DICT] is null?":"chiave [KEY] vuota in dizionario [DICT]","_list of dictionaries":"lista dizionari","_parse JSON [OBJ] into dictionary [DICT]":"JSON [OBJ] come dizionario [DICT]","_remove dictionary [DICT]":"elimina dizionario [DICT]","_remove key [KEY] from dictionary [DICT]":"rimuovi chiave [KEY] da dizionario [DICT]","_set key [KEY] in dictionary [DICT] to [VAL]":"porta chiave [KEY] del dizionario [DICT] a [VAL]","_stringify dictionary [DICT] into JSON":"contenuto dizionario [DICT] come JSON"},"ja":{"_Dictionaries":"辞書","_list of dictionaries":"辞書のリスト","_parse JSON [OBJ] into dictionary [DICT]":"JSON[OBJ]をディクショナリ[DICT]に解析して","_stringify dictionary [DICT] into JSON":"ディクショナリ[DICT]をJSON文字列に変換して"},"ko":{"_Dictionaries":"사전","_change key [KEY] in dictionary [DICT] by [BY]":"사전 [DICT]의 키 [KEY]을(를) [BY](으)로 변경하기","_key [KEY] from dictionary [DICT]":"사전 [DICT]의 키 [KEY]","_key [KEY] in dictionary [DICT] is defined?":"사전 [DICT]의 키 [KEY]이(가) 정의되었는가?","_key [KEY] in dictionary [DICT] is null?":"사전 [DICT]의 키 [KEY]이(가) null인가?","_parse JSON [OBJ] into dictionary [DICT]":"JSON [OBJ]을 사전 [DICT](으)로 변환","_remove dictionary [DICT]":"사전 [DICT]을(를) 제거하기","_remove key [KEY] from dictionary [DICT]":"사전 [DICT]의 키 [KEY]을(를) 제거하기","_set key [KEY] in dictionary [DICT] to [VAL]":"사전 [DICT]의 키 [KEY]을(를) [VAL](으)로 정하기","_stringify dictionary [DICT] into JSON":"사전 [DICT]을(를) JSON으로 문자열화"},"nb":{"_Dictionaries":"Ordbøker"},"nl":{"_Dictionaries":"JSON-woordenboeken"},"ru":{"_Dictionaries":"Словари","_change key [KEY] in dictionary [DICT] by [BY]":"изменить ключ [KEY] в словаре [DICT] на [BY]","_key [KEY] from dictionary [DICT]":"ключ [KEY] из словаря [DICT]","_key [KEY] in dictionary [DICT] is defined?":"ключ [KEY] в словаре [DICT] найден?","_key [KEY] in dictionary [DICT] is null?":"ключ [KEY] в словаре [DICT] нулевой?","_list of dictionaries":"список словарей","_parse JSON [OBJ] into dictionary [DICT]":"преобразовать JSON [OBJ] в словарь [DICT]","_remove dictionary [DICT]":"удалить словарь [DICT]","_remove key [KEY] from dictionary [DICT]":"удалить ключ [KEY] из словаря [DICT]","_set key [KEY] in dictionary [DICT] to [VAL]":"задать ключ [KEY] в словаре [DICT] значение [VAL]","_stringify dictionary [DICT] into JSON":"преобразовать словарь [DICT] в JSON"},"zh-cn":{"_Dictionaries":"字典","_change key [KEY] in dictionary [DICT] by [BY]":"将字典[DICT]中的键[KEY]增加[BY]","_key [KEY] from dictionary [DICT]":"字典[DICT]的键[KEY]","_key [KEY] in dictionary [DICT] is defined?":"字典[DICT]定义了键[KEY]？","_key [KEY] in dictionary [DICT] is null?":"字典[DICT]中的键[KEY]是null吗？","_list of dictionaries":"已有字典","_parse JSON [OBJ] into dictionary [DICT]":"解析JSON[OBJ]到字典[DICT]","_remove dictionary [DICT]":"删除字典[DICT]","_remove key [KEY] from dictionary [DICT]":"从字典[DICT]删除键[KEY]","_set key [KEY] in dictionary [DICT] to [VAL]":"将字典[DICT]中的键[KEY]设为[VAL]","_stringify dictionary [DICT] into JSON":"将字典[DICT]转为JSON字符串"}});/* end generated l10n code */(function (Scratch) {
  "use strict";
  let dictionaries = new Map();

  Scratch.vm.runtime.on("RUNTIME_DISPOSED", () => {
    dictionaries.clear();
  });

  class DictionaryExtension {
    getInfo() {
      return {
        id: "verctedictionaries",
        name: Scratch.translate("Dictionaries"),
        color1: "#008cff",
        color2: "#0073d1",
        color3: "#0066ba",
        blocks: [
          {
            opcode: "dict_list",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("list of dictionaries"),
          },
          {
            opcode: "dict_stringify",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("stringify dictionary [DICT] into JSON"),
            arguments: {
              DICT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "foo",
              },
            },
          },
          {
            opcode: "dict_parse",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("parse JSON [OBJ] into dictionary [DICT]"),
            arguments: {
              OBJ: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{"bar": "baz"}',
              },
              DICT: { type: Scratch.ArgumentType.STRING, defaultValue: "foo" },
            },
          },

          "---",

          {
            opcode: "dict_get",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("key [KEY] from dictionary [DICT]"),
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "bar" },
              DICT: { type: Scratch.ArgumentType.STRING, defaultValue: "foo" },
            },
          },
          {
            opcode: "dict_property_defined",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate(
              "key [KEY] in dictionary [DICT] is defined?"
            ),
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "bar" },
              DICT: { type: Scratch.ArgumentType.STRING, defaultValue: "foo" },
            },
          },
          {
            opcode: "dict_property_null",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("key [KEY] in dictionary [DICT] is null?"),
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "bar" },
              DICT: { type: Scratch.ArgumentType.STRING, defaultValue: "foo" },
            },
          },

          "---",

          {
            opcode: "dict_set",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set key [KEY] in dictionary [DICT] to [VAL]"
            ),
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "bar" },
              DICT: { type: Scratch.ArgumentType.STRING, defaultValue: "foo" },
              VAL: { type: Scratch.ArgumentType.STRING, defaultValue: "baz" },
            },
          },
          {
            opcode: "dict_change",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "change key [KEY] in dictionary [DICT] by [BY]"
            ),
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "number",
              },
              DICT: { type: Scratch.ArgumentType.STRING, defaultValue: "foo" },
              BY: { type: Scratch.ArgumentType.NUMBER, defaultValue: "1" },
            },
          },

          "---",

          {
            opcode: "dict_delete",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("remove dictionary [DICT]"),
            arguments: {
              DICT: { type: Scratch.ArgumentType.STRING, defaultValue: "foo" },
            },
          },
          {
            opcode: "dict_delete_key",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("remove key [KEY] from dictionary [DICT]"),
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "bar" },
              DICT: { type: Scratch.ArgumentType.STRING, defaultValue: "foo" },
            },
          },
        ],
      };
    }

    dict_list() {
      return Array.from(dictionaries.keys()).join(" ");
    }

    dict_stringify({ DICT }) {
      const mapToObj = (m) => {
        return Array.from(m).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
      };
      if (!dictionaries.get(DICT)) return "{}";
      return JSON.stringify(mapToObj(dictionaries.get(DICT)));
    }

    dict_parse({ OBJ, DICT }) {
      let dict = null;
      try {
        dict = JSON.parse(OBJ);
      } catch (e) {
        dict = { error: String(e) };
      }
      dictionaries.set(DICT, new Map(Object.entries(dict)));
    }

    dict_get({ KEY, DICT }) {
      if (!dictionaries.get(DICT)) return "null";
      KEY = Scratch.Cast.toString(KEY);
      let dict = dictionaries.get(DICT);
      let value = dict.get(KEY);
      if (
        typeof value === "number" ||
        typeof value === "string" ||
        typeof value === "boolean"
      ) {
        return value;
      }
      if (value === undefined) {
        return "undefined";
      }
      return JSON.stringify(value);
    }

    dict_property_defined({ KEY, DICT }) {
      if (!dictionaries.get(DICT)) return false;
      let dict = dictionaries.get(DICT);
      KEY = Scratch.Cast.toString(KEY);
      return dict.get(KEY) === undefined ? false : true;
    }

    dict_property_null({ KEY, DICT }) {
      if (!dictionaries.get(DICT)) return false;
      let dict = dictionaries.get(DICT);
      return dict.get(KEY) === null ? true : false;
    }

    dict_set({ KEY, DICT, VAL }) {
      if (!dictionaries.get(DICT)) {
        dictionaries.set(DICT, new Map());
      }
      let dict = dictionaries.get(DICT);
      KEY = Scratch.Cast.toString(KEY);
      dict.set(KEY, VAL);
    }

    dict_change({ KEY, DICT, BY }) {
      if (!dictionaries.get(DICT)) {
        dictionaries.set(DICT, new Map());
      }
      let dict = dictionaries.get(DICT);
      KEY = Scratch.Cast.toString(KEY);
      if (isNaN(+dict.get(KEY))) dict.set(KEY, 0);
      dict.set(KEY, dict.get(KEY) + BY);
    }

    dict_delete({ DICT }) {
      if (dictionaries.has(DICT)) dictionaries.delete(DICT);
    }

    dict_delete_key({ KEY, DICT }) {
      if (dictionaries.has(DICT)) {
        KEY = Scratch.Cast.toString(KEY);
        dictionaries.get(DICT).delete(KEY);
      }
    }
  }

  Scratch.extensions.register(new DictionaryExtension());
})(Scratch);
