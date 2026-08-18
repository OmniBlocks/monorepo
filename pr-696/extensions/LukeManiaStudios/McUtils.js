// Name: McUtils
// ID: lmsmcutils
// Description: Helpful utilities for any fast food employee.
// By: LilyMakesThings <https://scratch.mit.edu/users/LilyMakesThings/>
// Context: Joke extension based on McDonalds, a fast food chain.
// License: MIT AND LGPL-3.0

/*!
 * Credit to NexusKitten (NamelessCat) for the idea
 */

/* generated l10n code */Scratch.translate.setup({"fi":{"_broken":"rikki","_if [INPUTA] is manager then [INPUTB] else [INPUTC]":"jos [INPUTA] on johtaja, niin [INPUTB] tai muuten [INPUTC]","_is ice cream machine [INPUT]":"onko jäätelökone [INPUT]","_place order [INPUT]":"tilaa [INPUT]","_talk to manager [INPUT]":"puhu johtajalle [INPUT]","_working":"toiminnassa"},"it":{"_broken":"è rotta","_is ice cream machine [INPUT]":"la macchina del gelato [INPUT]","_place order [INPUT]":"ordina [INPUT]","_talk to manager [INPUT]":"dire al manager [INPUT]","_working":"funziona"},"ja":{"_broken":"壊れて","_if [INPUTA] is manager then [INPUTB] else [INPUTC]":"[INPUTA]はマネージャーであるなら[INPUTB]、でなければ[INPUTC]","_is ice cream machine [INPUT]":"アイスクリーム機は[INPUT]いますか？","_place order [INPUT]":"[INPUT]を注文する","_talk to manager [INPUT]":"マネージャーに[INPUT]話しかける","_working":"動いて"},"ko":{"_broken":"고장남","_if [INPUTA] is manager then [INPUTB] else [INPUTC]":"[INPUTA]이(가) 매니저라면 [INPUTB] 아니면 [INPUTC]","_is ice cream machine [INPUT]":"아이스크림 기계가 [INPUT]인가?","_place order [INPUT]":"[INPUT] 주문하기","_talk to manager [INPUT]":"[INPUT] 매니저에게 묻기","_working":"작동중"},"nl":{"_broken":"kapot","_if [INPUTA] is manager then [INPUTB] else [INPUTC]":"als [INPUTA] manager is dan [INPUTB] anders [INPUTC]","_is ice cream machine [INPUT]":"ijsmachine [INPUT]","_place order [INPUT]":"plaats bestelling [INPUT]","_talk to manager [INPUT]":"zeg [INPUT] tegen manager ","_working":"werkt"},"ru":{"_broken":"сломана","_if [INPUTA] is manager then [INPUTB] else [INPUTC]":"если [INPUTA] является менеджером тогда [INPUTB] иначе [INPUTC]","_is ice cream machine [INPUT]":"если машина мороженного [INPUT] ","_place order [INPUT]":"разместить заказ [INPUT]","_talk to manager [INPUT]":"поговорить с менеджером [INPUT]","_working":"работает"},"zh-cn":{"_broken":"损坏","_if [INPUTA] is manager then [INPUTB] else [INPUTC]":"如果[INPUTA]是餐厅经理则[INPUTB]否则[INPUTC]","_is ice cream machine [INPUT]":"冰淇淋机[INPUT]","_place order [INPUT]":"点餐[INPUT]","_talk to manager [INPUT]":"和餐厅经理讲话[INPUT]","_working":"可用"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  class lmsmcutils {
    getInfo() {
      return {
        id: "lmsmcutils",
        // eslint-disable-next-line extension/should-translate
        name: "McUtils",
        color1: "#ec2020",
        color3: "#ffe427",
        blocks: [
          {
            opcode: "managerReporter",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              default: "if [INPUTA] is manager then [INPUTB] else [INPUTC]",
              description:
                "This is a joke block equivalent to 'if [INPUTA] then [INPUTB] else [INPUTC]",
            }),
            arguments: {
              INPUTA: {
                type: Scratch.ArgumentType.BOOLEAN,
              },
              INPUTB: {
                type: Scratch.ArgumentType.STRING,
              },
              INPUTC: {
                type: Scratch.ArgumentType.STRING,
              },
            },
          },
          {
            opcode: "icecreammachine",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate({
              default: "is ice cream machine [INPUT]",
              description:
                "This is a joke block. [INPUT] can be 'working' (reports false) and 'broken' (reports true) because the machine is always broken.",
            }),
            arguments: {
              INPUT: {
                type: Scratch.ArgumentType.STRING,
                menu: "iceCreamMenu",
              },
            },
          },
          {
            opcode: "talkToManager",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate({
              default: "talk to manager [INPUT]",
              description:
                "This is a joke block that just reports whatever you put into it.",
            }),
            arguments: {
              INPUT: {
                type: Scratch.ArgumentType.STRING,
              },
            },
          },
          {
            opcode: "placeOrder",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate({
              default: "place order [INPUT]",
              description:
                "This is a joke block that just reports whatever yout put into it, except if it contains 'ice cream', then false because the machine is always broken.",
            }),
            arguments: {
              INPUT: {
                type: Scratch.ArgumentType.STRING,
              },
            },
          },
          {
            opcode: "grimaceBlock",
            blockType: Scratch.BlockType.REPORTER,
            // eslint-disable-next-line extension/should-translate
            text: "🎂",
            extensions: ["colours_looks"],
            hideFromPalette: new Date().getMonth() !== 5,
          },
        ],
        menus: {
          iceCreamMenu: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate({
                  default: "working",
                  description:
                    "Used in context 'is ice cream machine [working]?', a joke block",
                }),
                value: "working",
              },
              {
                text: Scratch.translate({
                  default: "broken",
                  description:
                    "Used in context 'is ice cream machine [broken]?', a joke block",
                }),
                value: "broken",
              },
            ],
          },
        },
      };
    }

    managerReporter(args, util) {
      if (args.INPUTA) {
        return args.INPUTB;
      } else {
        return args.INPUTC;
      }
    }

    icecreammachine(args, util) {
      if (args.INPUT === "working") {
        return false;
      } else {
        return true;
      }
    }

    talkToManager(args, util) {
      return args.INPUT;
    }

    placeOrder(args, util) {
      const text = Scratch.Cast.toString(args.INPUT);
      if (text.includes("ice cream")) {
        return false;
      } else {
        return args.INPUT;
      }
    }

    grimaceBlock(args, util) {
      return "All good things are purple, including Scratch <3";
    }
  }
  Scratch.extensions.register(new lmsmcutils());
})(Scratch);
