// Name: Fetch
// ID: fetch
// Description: Make requests to the broader internet.
// License: MIT AND MPL-2.0

/* generated l10n code */Scratch.translate.setup({"de":{"_Fetch":"Internetquests"},"fi":{"_Fetch":"Datan haku"},"it":{"_Fetch":"Estrazione"},"ja":{"_Fetch":"フェッチ"},"nb":{"_Fetch":"Hent"},"ru":{"_Fetch":"Поимка"},"zh-cn":{"_Fetch":"请求API"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  class Fetch {
    getInfo() {
      return {
        id: "fetch",
        name: Scratch.translate("Fetch"),
        blocks: [
          {
            opcode: "get",
            blockType: Scratch.BlockType.REPORTER,
            // eslint-disable-next-line extension/should-translate
            text: "GET [URL]",
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://extensions.turbowarp.org/hello.txt",
              },
            },
          },
        ],
      };
    }

    get(args) {
      return Scratch.fetch(args.URL)
        .then((r) => r.text())
        .catch(() => "");
    }
  }

  Scratch.extensions.register(new Fetch());
})(Scratch);
