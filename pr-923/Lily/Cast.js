// Name: Cast
// ID: lmsCast
// Description: Convert values between types.
// By: LilyMakesThings <https://scratch.mit.edu/users/LilyMakesThings/>
// License: MIT AND LGPL-3.0

/* generated l10n code */Scratch.translate.setup({"de":{"_Cast":"Typen"},"es":{"_default":"por defecto"},"fi":{"_Cast":"Muunna","_boolean":"totuusarvoksi","_cast [INPUT] to [TYPE]":"muunna [INPUT] [TYPE] ","_default":"oletusarvoiseksi","_number":"numeroksi","_string":"merkkijonoksi","_type of [INPUT]":"kohteen [INPUT] tyyppi"},"it":{"_Cast":"Conversione","_boolean":"booleano","_cast [INPUT] to [TYPE]":"converti [INPUT] in [TYPE]","_default":"predefinito","_number":"numero","_string":"stringa","_type of [INPUT]":"tipo di [INPUT]"},"ja":{"_Cast":"型変換","_boolean":"真理値","_cast [INPUT] to [TYPE]":"[INPUT]を[TYPE]に変換する","_default":"デフォルト","_number":"数字","_string":"文字列","_type of [INPUT]":"[INPUT]の型"},"ko":{"_Cast":"캐스팅","_boolean":"불리언","_cast [INPUT] to [TYPE]":"[INPUT]을(를) [TYPE]화 하기","_default":"기본","_number":"숫자","_string":"문자열","_type of [INPUT]":"[INPUT]의 타입"},"nb":{"_Cast":"Kast"},"nl":{"_Cast":"Omzetten","_boolean":"booleaans","_cast [INPUT] to [TYPE]":"zet [INPUT] om naar [TYPE]","_default":"standaard","_number":"getal","_type of [INPUT]":"soort van [INPUT]"},"pl":{"_number":"liczba"},"ru":{"_Cast":"Каст","_boolean":"логическое","_cast [INPUT] to [TYPE]":"вывести [INPUT] в [TYPE]","_default":"по умолчанию","_number":"цифра","_string":"строка","_type of [INPUT]":"тип переменной [INPUT]"},"uk":{"_Cast":"Типи","_number":"число"},"zh-cn":{"_Cast":"类型转换","_boolean":"布尔值","_cast [INPUT] to [TYPE]":"将[INPUT]转换为类型[TYPE]","_default":"默认类型","_number":"数字","_string":"字符串","_type of [INPUT]":"[INPUT]的类型"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  const Cast = Scratch.Cast;

  class CastUtil {
    getInfo() {
      return {
        id: "lmsCast",
        name: Scratch.translate("Cast"),
        blocks: [
          {
            opcode: "toType",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("cast [INPUT] to [TYPE]"),
            allowDropAnywhere: true,
            disableMonitor: true,
            arguments: {
              INPUT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "apple",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "type",
              },
            },
          },
          {
            opcode: "typeOf",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("type of [INPUT]"),
            disableMonitor: true,
            arguments: {
              INPUT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "apple",
              },
            },
          },
        ],
        menus: {
          type: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("number"),
                value: "number",
              },
              {
                text: Scratch.translate("string"),
                value: "string",
              },
              {
                text: Scratch.translate("boolean"),
                value: "boolean",
              },
              {
                text: Scratch.translate("default"),
                value: "default",
              },
            ],
          },
        },
      };
    }

    toType(args) {
      const input = args.INPUT;
      switch (args.TYPE) {
        case "number":
          return Cast.toNumber(input);
        case "string":
          return Cast.toString(input);
        case "boolean":
          return Cast.toBoolean(input);
        default:
          return input;
      }
    }

    typeOf(args) {
      return typeof args.INPUT;
    }
  }

  Scratch.extensions.register(new CastUtil());
})(Scratch);
