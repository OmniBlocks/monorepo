// Name: Comment Blocks
// ID: lmscomments
// Description: Annotate your scripts.
// By: LilyMakesThings <https://scratch.mit.edu/users/LilyMakesThings/>
// License: MIT AND LGPL-3.0

/* generated l10n code */Scratch.translate.setup({"de":{"_Comment Blocks":"Kommentar Blöcke","_comment":"Kommentar"},"es":{"_Comment Blocks":"Bloques de Comentarios","_comment":"comentario"},"fi":{"_Comment Blocks":"Kommenttilohkot","_comment":"kommentti"},"it":{"_Comment Blocks":"Blocchi per Commenti","_comment":"commento"},"ja":{"_Comment Blocks":"コメントブロック","_comment":"コメント"},"ko":{"_Comment Blocks":"주석 블록","_comment":"주석"},"nb":{"_Comment Blocks":"Kommentarblokker","_comment":"kommentar"},"nl":{"_Comment Blocks":"Commentaarblokken","_comment":"opmerking"},"pl":{"_comment":"komentarz"},"ru":{"_Comment Blocks":"Блоки Комментариев","_comment":"комментарий"},"tr":{"_Comment Blocks":"Yorum Blokları"},"uk":{"_Comment Blocks":"Блоки-Коментарі"},"zh-cn":{"_Comment Blocks":"注释","_comment":"注释"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  class CommentBlocks {
    getInfo() {
      const defaultValue = Scratch.translate({
        default: "comment",
        description: "Default comment value",
      });
      return {
        id: "lmscomments",
        name: Scratch.translate("Comment Blocks"),
        color1: "#e4db8c",
        color2: "#c6be79",
        color3: "#a8a167",
        blocks: [
          /* eslint-disable extension/should-translate */
          {
            opcode: "commentHat",
            blockType: Scratch.BlockType.HAT,
            text: "// [COMMENT]",
            isEdgeActivated: false,
            arguments: {
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: defaultValue,
              },
            },
          },
          {
            opcode: "commentCommand",
            blockType: Scratch.BlockType.COMMAND,
            text: "// [COMMENT]",
            arguments: {
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: defaultValue,
              },
            },
          },
          {
            opcode: "commentC",
            blockType: Scratch.BlockType.CONDITIONAL,
            text: "// [COMMENT]",
            arguments: {
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: defaultValue,
              },
            },
          },
          {
            opcode: "commentReporter",
            blockType: Scratch.BlockType.REPORTER,
            text: "[INPUT] // [COMMENT]",
            allowDropAnywhere: true,
            arguments: {
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: defaultValue,
              },
              INPUT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "commentBoolean",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[INPUT] // [COMMENT]",
            arguments: {
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: defaultValue,
              },
              INPUT: {
                type: Scratch.ArgumentType.BOOLEAN,
              },
            },
          },
          /* eslint-enable extension/should-translate */
        ],
      };
    }

    commentHat() {
      // no-op
    }

    commentCommand() {
      // no-op
    }

    commentC(args, util) {
      return true;
    }

    commentReporter(args) {
      return args.INPUT;
    }

    commentBoolean(args) {
      return args.INPUT || false;
    }
  }
  Scratch.extensions.register(new CommentBlocks());
})(Scratch);
