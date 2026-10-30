// Name: Numerical Encoding V2
// ID: numericalencoding2
// Description: Encode strings as numbers for cloud variables. Not compatible with V1 due to using much more efficient format.
// License: MPL-2.0

/* generated l10n code */Scratch.translate.setup({"de":{"_Numerical Encoding V2":"Numerische Codierung V2"},"fi":{"_Hello":"Hei","_Numerical Encoding V2":"Numerosalaus V2","_decode [TEXT] as text":"pura [TEXT] tekstiksi","_encode [TEXT] as numbers":"salaa [TEXT] numeroiksi"},"it":{"_Hello":"Ciao","_Numerical Encoding V2":"Codifica Numerica V2","_decode [TEXT] as text":"decodifica [TEXT] come testo","_encode [TEXT] as numbers":"codifica [TEXT] come numeri"},"ja":{"_Hello":"こんにちは","_Numerical Encoding V2":"数値エンコーディングV2","_decode [TEXT] as text":"[TEXT]をテキストとしてデコードする","_encode [TEXT] as numbers":"[TEXT]を数字としてエンコードする"},"ko":{"_Hello":"안녕","_Numerical Encoding V2":"숫자 인코딩 V2","_decode [TEXT] as text":"[TEXT]을(를) 텍스트로 디코딩","_encode [TEXT] as numbers":"[TEXT]을(를) 숫자로 인코딩"},"nb":{"_Hello":"Hei","_Numerical Encoding V2":"Numerisk Koding V2"},"nl":{"_Hello":"Hallo","_Numerical Encoding V2":"Numerieke Codering V2","_decode [TEXT] as text":"decodeer [TEXT] als tekst","_encode [TEXT] as numbers":"codeer [TEXT] als nummers"},"pl":{"_Hello":"Cześć"},"ru":{"_Hello":"Привет","_Numerical Encoding V2":"Численная Кодировка V2","_decode [TEXT] as text":"раскодировать [TEXT] как текст","_encode [TEXT] as numbers":"закодировать [TEXT] в цифры"},"uk":{"_Numerical Encoding V2":"Числове Кодування 2.0"},"zh-cn":{"_Numerical Encoding V2":"数字编码 V2","_decode [TEXT] as text":"解码[TEXT]为字符串","_encode [TEXT] as numbers":"编码[TEXT]为数字"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();

  /**
   * @param {Uint8Array} bytes
   * @returns {string}
   */
  const encodeBinary = (bytes) => {
    // Pre-allocating buffer seems to be much faster than string concatenation
    const buffer = new Uint8Array(Math.ceil((bytes.length * 8) / 3));
    let ptr = 0;

    for (var i = 0; i <= bytes.length - 3; i += 3) {
      // AAAAAAAA BBBBBBBB CCCCCCCC
      // 11122233 34445556 66777888
      const a = bytes[i];
      const b = bytes[i + 1];
      const c = bytes[i + 2];
      buffer[ptr++] = 49 + (a >> 5);
      buffer[ptr++] = 49 + ((a >> 2) & 0b111);
      buffer[ptr++] = 49 + (((a & 0b11) << 1) | (b >> 7));
      buffer[ptr++] = 49 + ((b >> 4) & 0b111);
      buffer[ptr++] = 49 + ((b >> 1) & 0b111);
      buffer[ptr++] = 49 + (((b & 0b1) << 2) | (c >> 6));
      buffer[ptr++] = 49 + ((c >> 3) & 0b111);
      buffer[ptr++] = 49 + (c & 0b111);
    }

    switch (bytes.length - i) {
      case 1: {
        // AAAAAAAA
        // 11122233 3
        const a = bytes[i];
        buffer[ptr++] = 49 + (a >> 5);
        buffer[ptr++] = 49 + ((a >> 2) & 0b111);
        buffer[ptr++] = 49 + ((a & 0b11) << 1);
        break;
      }

      case 2: {
        // AAAAAAAA BBBBBBBB
        // 11122233 34445556 66
        const a = bytes[i];
        const b = bytes[i + 1];
        buffer[ptr++] = 49 + (a >> 5);
        buffer[ptr++] = 49 + ((a >> 2) & 0b111);
        buffer[ptr++] = 49 + (((a & 0b11) << 1) | (b >> 7));
        buffer[ptr++] = 49 + ((b >> 4) & 0b111);
        buffer[ptr++] = 49 + ((b >> 1) & 0b111);
        buffer[ptr++] = 49 + ((b & 0b1) << 2);
        break;
      }
    }

    return textDecoder.decode(buffer);
  };

  /**
   * @param {string} string
   * @returns {Uint8Array}
   */
  const decodeBinary = (string) => {
    const encodedBytes = Math.floor((string.length * 3) / 8);
    const result = new Uint8Array(encodedBytes);
    let ptr = 0;

    for (var i = 0; i <= string.length - 8; i += 8) {
      // AAA BBB CCC DDD EEE FFF GGG HHH
      // 111 111 112 222 222 233 333 333
      const a = string.charCodeAt(i) - 49;
      const b = string.charCodeAt(i + 1) - 49;
      const c = string.charCodeAt(i + 2) - 49;
      const d = string.charCodeAt(i + 3) - 49;
      const e = string.charCodeAt(i + 4) - 49;
      const f = string.charCodeAt(i + 5) - 49;
      const g = string.charCodeAt(i + 6) - 49;
      const h = string.charCodeAt(i + 7) - 49;
      result[ptr++] = (a << 5) | (b << 2) | (c >> 1);
      result[ptr++] = ((c & 0b1) << 7) | (d << 4) | (e << 1) | (f >> 2);
      result[ptr++] = ((f & 0b11) << 6) | (g << 3) | h;
    }

    switch (encodedBytes - ptr) {
      case 1: {
        // AAA BBB CCC
        // 111 111 11
        const a = string.charCodeAt(i) - 49;
        const b = string.charCodeAt(i + 1) - 49;
        const c = string.charCodeAt(i + 2) - 49;
        result[ptr] = (a << 5) | (b << 2) | (c >> 1);
        break;
      }

      case 2: {
        // AAA BBB CCC DDD EEE FFF
        // 111 111 112 222 222 2
        const a = string.charCodeAt(i) - 49;
        const b = string.charCodeAt(i + 1) - 49;
        const c = string.charCodeAt(i + 2) - 49;
        const d = string.charCodeAt(i + 3) - 49;
        const e = string.charCodeAt(i + 4) - 49;
        const f = string.charCodeAt(i + 5) - 49;
        result[ptr++] = (a << 5) | (b << 2) | (c >> 1);
        result[ptr] = ((c & 0b1) << 7) | (d << 4) | (e << 1) | (f >> 2);
        break;
      }
    }

    return result;
  };

  /**
   * @param {string} text
   * @returns {string}
   */
  const encodeText = (text) => encodeBinary(textEncoder.encode(text));

  /**
   * @param {string} text
   * @returns {string}
   */
  const decodeText = (text) => {
    // All characters must be in range [1, 8]
    for (let i = 0; i < text.length; i++) {
      const ch = text.charCodeAt(i);
      if (ch < 49 || ch > 56) {
        return "";
      }
    }
    return textDecoder.decode(decodeBinary(text));
  };

  // Uncomment this to validate that the encoding and decoding is correct.
  /*
  const stressValidate = () => {
    for (let i = 0; i < 100000; i++) {
      const randomLength = Math.floor(Math.random() * 1000);
      const randomArray = new Uint8Array(randomLength);
      for (let j = 0; j < randomLength; j++) {
        randomArray[j] = Math.floor(Math.random() * 256);
      }
      const encoded = encodeBinary(randomArray);
      const decoded = decodeBinary(encoded);
      if (decoded.length !== randomArray.length) {
        debugger;
      }
      for (let j = 0; j < randomArray.length; j++) {
        if (randomArray[j] !== decoded[j]) {
          debugger;
        }
      }
    }
  };
  console.time('validate');
  stressValidate();
  console.timeEnd('validate');
  */

  class NumericalEncodingV2 {
    getInfo() {
      const example = Scratch.translate({
        default: "Hello",
        description:
          "Used as default input value to show how the encoding works",
      });

      return {
        id: "numericalencoding2",
        name: Scratch.translate("Numerical Encoding V2"),
        blocks: [
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: "encode",
            text: Scratch.translate("encode [TEXT] as numbers"),
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: example,
              },
            },
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: "decode",
            text: Scratch.translate("decode [TEXT] as text"),
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: encodeText(example),
              },
            },
          },
        ],
      };
    }

    encode({ TEXT }) {
      return encodeText(Scratch.Cast.toString(TEXT));
    }

    decode({ TEXT }) {
      return decodeText(Scratch.Cast.toString(TEXT));
    }
  }

  Scratch.extensions.register(new NumericalEncodingV2());
})(Scratch);
