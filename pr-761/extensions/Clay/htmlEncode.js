// Name: HTML Encode
// ID: clayhtmlencode
// Description: Escape untrusted text to safely include in HTML.
// By: ClaytonTDM
// License: MIT

/* generated l10n code */Scratch.translate.setup({"de":{"_HTML Encode":"HTML-Sicherung","_Hello!":"Hallo!","_encode [text] as HTML-safe":"Kodiere [text] als HTML-Sicher"},"es":{"_Hello!":"¡Hola!"},"fi":{"_HTML Encode":"HTML-salaus","_Hello!":"Terve!","_encode [text] as HTML-safe":"salaa [text] HTML-koodiin sisällytettäväksi"},"fr":{"_HTML Encode":"Encodeur HTML"},"it":{"_HTML Encode":"HTML Encoding","_Hello!":"Ciao!","_encode [text] as HTML-safe":"codifica [text] come HTML sicuro"},"ja":{"_HTML Encode":"HTMLエンコード","_Hello!":"こんにちは!","_encode [text] as HTML-safe":"テキスト[text]をHTML-safeでエンコード"},"ko":{"_HTML Encode":"HTML 인코딩","_Hello!":"안녕!","_encode [text] as HTML-safe":"[text]을(를) HTML 안전하게 인코딩하기"},"nb":{"_Hello!":"Hei!","_encode [text] as HTML-safe":"enkoder [text] som HTML-sikker"},"nl":{"_HTML Encode":"HTML-codering","_Hello!":"Hallo!","_encode [text] as HTML-safe":"codeer [text] naar HTML-veilig"},"pl":{"_Hello!":"Cześć!"},"ru":{"_HTML Encode":"HTML Шифр","_Hello!":"Привет!","_encode [text] as HTML-safe":"закодировать [text] как безопасный HTML"},"tr":{"_HTML Encode":"HTML Kodlama"},"uk":{"_Hello!":"Привіт!"},"zh-cn":{"_HTML Encode":"HTML 编码","_Hello!":"你好！","_encode [text] as HTML-safe":"编码[text]为HTML编码"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  class HtmlEncode {
    getInfo() {
      return {
        id: "claytonhtmlencode",
        name: Scratch.translate("HTML Encode"),
        blocks: [
          {
            opcode: "encode",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("encode [text] as HTML-safe"),
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                // don't use a script tag as the example here as the closing script
                // tag might break things when this extension gets inlined in packed
                // projects
                defaultValue: `<h1>${Scratch.translate("Hello!")}</h1>`,
              },
            },
          },
        ],
      };
    }

    encode({ text }) {
      return Scratch.Cast.toString(text).replace(/["'&<>]/g, (a) => {
        switch (a) {
          case "&":
            return "&amp;";
          case '"':
            return "&apos;";
          case "'":
            return "&quot;";
          case ">":
            return "&gt;";
          case "<":
            return "&lt;";
        }
        // this should never happen...
        return "";
      });
    }
  }

  Scratch.extensions.register(new HtmlEncode());
})(Scratch);
