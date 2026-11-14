// Name: BigInt
// ID: skyhigh173BigInt
// Description: Math blocks that work on infinitely large integers (no decimals).
// By: Skyhigh173 <https://scratch.mit.edu/users/Skyhigh173/>
// License: MIT
// Context: BigInt is short for "Big Integer" which can be infinitely big. "number" refers to normal numbers that have limits.

/* generated l10n code */Scratch.translate.setup({"de":{"_Bitwise":"Bitweise"},"fi":{"_Arithmetic":"Laskut","_BigInt":"Suuret kokonaisluvut","_Bitwise":"Bittimenetelmät","_Logic":"Logiikka","_[a] mod [b]":"lukujen [a] ja [b] jakojäännös","_convert BigInt [text] to number":"muunna suuri kokonaisluku [text] luvuksi","_convert number [text] to BigInt":"muunna luku [text] suureksi kokonaisluvuksi"},"it":{"_Arithmetic":"Aritmetica","_BigInt":"Numeri Illimitati","_Bitwise":"Operazioni su Bit","_Logic":"Logica","_convert BigInt [text] to number":"converti BigInt [text] in numero","_convert number [text] to BigInt":"converti numero [text] in BigInt"},"ja":{"_Arithmetic":"計算","_BigInt":"ビッグイント","_Bitwise":"ビット操作","_Logic":"論理","_[a] mod [b]":"[a]を[b]で割った余り","_convert BigInt [text] to number":"ビッグイント[text]を数字にする","_convert number [text] to BigInt":"数字[text]をビッグイントにする"},"ko":{"_Arithmetic":"산술 연산","_Bitwise":"비트 연산","_Logic":"논리 연산","_convert BigInt [text] to number":"BigInt [text]을(를) 숫자로","_convert number [text] to BigInt":"숫자 [text]을(를) BigInt로"},"nb":{"_Bitwise":"Bitvis"},"nl":{"_Arithmetic":"Rekenen","_Bitwise":"Bitsgewijs","_Logic":"Logica","_[a] mod [b]":"[a] modulo [b]","_convert BigInt [text] to number":"zet BigInt [text] om naar getal","_convert number [text] to BigInt":"zet getal [text] om naar BigInt"},"ru":{"_Arithmetic":"Арифметика","_BigInt":"БольшущееЧисло","_Bitwise":"Пробитие","_Logic":"Логика","_[a] mod [b]":"[a] мод [b]","_convert BigInt [text] to number":"сконвертировать БольшущееЧисло [text] в цифры","_convert number [text] to BigInt":"сконвертировать цифры [text] в БольшущееЧисло"},"uk":{"_Arithmetic":"Арифметичні","_BigInt":"Величезні Числа","_Logic":"Логічні","_[a] mod [b]":"остача [a] на [b]"},"zh-cn":{"_Arithmetic":"运算","_BigInt":"大整数","_Bitwise":"位运算","_Logic":"逻辑","_[a] mod [b]":"[a]  % [b]","_convert BigInt [text] to number":"将BigInt[text]转为数字","_convert number [text] to BigInt":"将数字[text]转为BigInt"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  /**
   * @param {unknown} x
   * @returns {bigint}
   */
  const bi = (x) => {
    if (typeof x === "bigint") {
      return x;
    }
    if (typeof x === "string") {
      // Try to parse things like '8n'
      if (x.charAt(x.length - 1) === "n") {
        try {
          return BigInt(x.slice(0, -1));
        } catch (e) {
          // ignore
        }
      }
      // Must remove decimal using string operations. Math.trunc will convert to float
      // which ruins the point of using bigints.
      const decimalIndex = x.indexOf(".");
      const withoutDecimal =
        decimalIndex === -1 ? x : x.substring(0, decimalIndex);
      try {
        return BigInt(withoutDecimal);
      } catch (e) {
        return 0n;
      }
    }
    try {
      // Here we can use Math.trunc because it's a boolean or number.
      // @ts-expect-error
      return BigInt(Math.trunc(x));
    } catch (e) {
      return 0n;
    }
  };

  const makeLabel = (text) => ({
    blockType: "label",
    text: text,
  });

  class BigIntExtension {
    getInfo() {
      return {
        id: "skyhigh173BigInt",
        name: Scratch.translate("BigInt"),
        color1: "#59C093",
        blocks: [
          /* eslint-disable extension/should-translate */
          {
            opcode: "from",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("convert number [text] to BigInt"),
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "to",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("convert BigInt [text] to number"),
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          makeLabel(Scratch.translate("Arithmetic")),
          {
            opcode: "add",
            blockType: Scratch.BlockType.REPORTER,
            text: "[a] + [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "sub",
            blockType: Scratch.BlockType.REPORTER,
            text: "[a] - [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "mul",
            blockType: Scratch.BlockType.REPORTER,
            text: "[a] * [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "div",
            blockType: Scratch.BlockType.REPORTER,
            text: "[a] / [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "pow",
            blockType: Scratch.BlockType.REPORTER,
            text: "[a] ** [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "mod",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              default: "[a] mod [b]",
              description: "mod refers to modulo",
            }),
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "select",
            blockType: Scratch.BlockType.REPORTER,
            text: "[a] [sel] [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              sel: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "+",
                menu: "op",
              },
            },
          },
          makeLabel(Scratch.translate("Logic")),
          {
            opcode: "lt",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[a] < [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "le",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[a] ≤ [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "eq",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[a] = [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "neq",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[a] ≠ [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "ge",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[a] ≥ [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "gt",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[a] > [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          makeLabel(Scratch.translate("Bitwise")),
          {
            opcode: "and",
            blockType: Scratch.BlockType.REPORTER,
            text: "[a] & [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "or",
            blockType: Scratch.BlockType.REPORTER,
            text: "[a] | [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "xor",
            blockType: Scratch.BlockType.REPORTER,
            text: "[a] ^ [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "ls",
            blockType: Scratch.BlockType.REPORTER,
            text: "[a] << [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "rs",
            blockType: Scratch.BlockType.REPORTER,
            text: "[a] >> [b]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "not",
            blockType: Scratch.BlockType.REPORTER,
            text: "~ [a]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          /* eslint-enable extension/should-translate */
        ],
        menus: {
          op: {
            items: ["+", "-", "*", "/", "%", "^"],
            acceptReporters: true,
          },
        },
      };
    }
    from({ text }) {
      return bi(text);
    }
    to({ text }) {
      return Number(bi(text));
    }
    add({ a, b }) {
      return (bi(a) + bi(b)).toString();
    }
    sub({ a, b }) {
      return (bi(a) - bi(b)).toString();
    }
    mul({ a, b }) {
      return (bi(a) * bi(b)).toString();
    }
    div({ a, b }) {
      if (Number(b) == 0) return "NaN";
      return (bi(a) / bi(b)).toString();
    }
    pow({ a, b }) {
      return (bi(a) ** bi(b)).toString();
    }
    mod({ a, b }) {
      if (Number(b) == 0) return "NaN";
      return (bi(a) % bi(b)).toString();
    }

    and({ a, b }) {
      return (bi(a) & bi(b)).toString();
    }
    or({ a, b }) {
      return (bi(a) | bi(b)).toString();
    }
    xor({ a, b }) {
      return (bi(a) ^ bi(b)).toString();
    }
    ls({ a, b }) {
      return (bi(a) << bi(b)).toString();
    }
    rs({ a, b }) {
      return (bi(a) >> bi(b)).toString();
    }
    not({ a }) {
      return (~bi(a)).toString();
    }

    select({ a, sel, b }) {
      switch (sel) {
        case "+":
          return (bi(a) + bi(b)).toString();
        case "-":
          return (bi(a) - bi(b)).toString();
        case "*":
          return (bi(a) * bi(b)).toString();
        case "/": {
          if (Number(b) == 0) return "NaN";
          return (bi(a) / bi(b)).toString();
        }
        case "%": {
          if (Number(b) == 0) return "NaN";
          return (bi(a) % bi(b)).toString();
        }
        case "^":
        case "**":
          return (bi(a) ** bi(b)).toString();
        default:
          return "0";
      }
    }

    lt({ a, b }) {
      return bi(a) < bi(b);
    }
    gt({ a, b }) {
      return bi(a) > bi(b);
    }
    eq({ a, b }) {
      return bi(a) === bi(b);
    }
    neq({ a, b }) {
      return bi(a) != bi(b);
    }
    le({ a, b }) {
      return bi(a) <= bi(b);
    }
    ge({ a, b }) {
      return bi(a) >= bi(b);
    }
  }

  Scratch.extensions.register(new BigIntExtension());
})(Scratch);
