// Name: Numerical Encoding V1
// ID: cs2627883NumericalEncoding
// Description: Use V2 instead as it is more efficient. V1 only exists for compatibility reasons.
// By: cs2627883 <https://scratch.mit.edu/users/cs2627883/>
// License: MIT

// https://github.com/CS2627883/Turbowarp-Encoding-Extension/blob/main/Encoding.js

/* generated l10n code */Scratch.translate.setup({"de":{"_Hello!":"Hallo!","_Numerical Encoding V1":"Numerische Kodierung V1"},"es":{"_Hello!":"¡Hola!"},"fi":{"_Hello!":"Terve!","_Numerical Encoding V1":"Numerosalaus V1","_decode [ENCODED] back to text":"pura [ENCODED] tekstiksi","_decoded":"purettu","_encode [DATA] to numbers":"salaa [DATA] numeroiksi","_encoded":"salattu"},"it":{"_Hello!":"Ciao!","_Numerical Encoding V1":"Codifica Numerica V1","_decode [ENCODED] back to text":"decodifica [ENCODED] come testo","_decoded":"decodificato","_encode [DATA] to numbers":"codifica [DATA] come numeri","_encoded":"codificato"},"ja":{"_Hello!":"こんにちは!","_Numerical Encoding V1":"数値エンコーディングV1","_decode [ENCODED] back to text":"[ENCODED]をテキストとしてデコードする","_decoded":"デコードされたもの","_encode [DATA] to numbers":"[DATA]を数字としてエンコードする","_encoded":"エンコードされたもの"},"ko":{"_Hello!":"안녕!","_Numerical Encoding V1":"숫자 인코딩 V1","_decode [ENCODED] back to text":"[ENCODED]을(를) 텍스트로 디코딩","_decoded":"디코딩 결과","_encode [DATA] to numbers":"[DATA]을(를) 숫자로 인코딩","_encoded":"인코딩 결과"},"nb":{"_Hello!":"Hei!","_Numerical Encoding V1":"Numerisk Koding V1","_decoded":"dekodet","_encoded":"kodet"},"nl":{"_Hello!":"Hallo!","_Numerical Encoding V1":"Numerieke codering V1","_decoded":"gedecodeerd","_encoded":"gecodeerd"},"pl":{"_Hello!":"Cześć!"},"ru":{"_Hello!":"Привет!","_Numerical Encoding V1":"Численная Кодировка V1","_decode [ENCODED] back to text":"раскодировать [ENCODED] обратно в текст","_decoded":"декодированное","_encode [DATA] to numbers":"закодировать [DATA] в цифры","_encoded":"закодированное"},"uk":{"_Hello!":"Привіт!","_Numerical Encoding V1":"Числове Кодування 1.0"},"zh-cn":{"_Hello!":"你好！","_Numerical Encoding V1":"数字编码 V1","_decode [ENCODED] back to text":"解密[ENCODED]回文字","_decoded":"解码数据","_encode [DATA] to numbers":"加密[DATA]为数字","_encoded":"编码数据"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  // There are 149,186 unicode characters, so the maximum character code length is 6
  const MAX_CHAR_LEN = 6;

  /**
   * @param {string} str
   * @returns {string}
   */
  const encode = (str) => {
    let encoded = "";
    for (let i = 0; i < str.length; ++i) {
      // Get character
      const char = String(str.charCodeAt(i));
      // Pad encodedChar with 0s to ensure all encodedchars are the same length
      const encodedChar = "0".repeat(MAX_CHAR_LEN - char.length) + char;
      encoded += encodedChar;
    }
    return encoded;
  };

  /**
   * @param {string} str
   * @returns {string}
   */
  const decode = (str) => {
    if (str === "") {
      return "";
    }
    let decoded = "";
    // Create regex to split by char length
    const regex = new RegExp(".{1," + MAX_CHAR_LEN + "}", "g");
    // Split into array of characters
    const split = str.match(regex);
    for (let i = 0; i < split.length; i++) {
      // Get character from char code
      const decodedChar = String.fromCharCode(+split[i]);
      decoded += decodedChar;
    }
    return decoded;
  };

  class NumericalEncodingExtension {
    /** @type {string|number} */
    encoded = 0;

    /** @type {string|number} */
    decoded = 0;

    getInfo() {
      return {
        id: "cs2627883NumericalEncoding",
        name: Scratch.translate("Numerical Encoding V1"),
        blocks: [
          {
            opcode: "NumericalEncode",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("encode [DATA] to numbers"),
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: Scratch.translate("Hello!"),
              },
            },
          },
          {
            opcode: "NumericalDecode",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("decode [ENCODED] back to text"),
            arguments: {
              ENCODED: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: encode(Scratch.translate("Hello!")),
              },
            },
          },
          {
            opcode: "GetNumericalEncoded",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("encoded"),
          },
          {
            opcode: "GetNumericalDecoded",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("decoded"),
          },
        ],
      };
    }
    NumericalEncode(args) {
      this.encoded = encode(Scratch.Cast.toString(args.DATA));
    }
    NumericalDecode(args) {
      this.decoded = decode(Scratch.Cast.toString(args.ENCODED));
    }
    GetNumericalEncoded(args) {
      return this.encoded;
    }
    GetNumericalDecoded(args) {
      return this.decoded;
    }
  }

  Scratch.extensions.register(new NumericalEncodingExtension());
})(Scratch);
