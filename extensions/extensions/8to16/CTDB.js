// Name: Worldwide Database
// Id: ampctdbapi
// Description: Set and receive worldwide cloud values.
// By: AmpElectrecuted
// By: KV storage provided by Cloudflare
// License: MPL-2.0

(function (Scratch) {
  "use strict";

  class WWDBExtension {
    constructor() {
      // Default scope is CT as per requirements
      this.projectScope = "CT";
    }

    getInfo() {
      return {
        id: "ampctdbapi",
        name: Scratch.translate("Worldwide Database"),
        color1: "#4f7cff",
        color2: "#2f5fe0",
        blocks: [
          { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Scope (prevents collisions)") },
          {
            opcode: "setScope",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set project scope to [SCOPE]"),
            arguments: {
              SCOPE: { type: Scratch.ArgumentType.STRING, defaultValue: "CT" }
            }
          },
          {
            opcode: "getScope",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("project scope")
          },
          "---",
          { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Storage") },
          {
            opcode: "setKey",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set key [KEY] to [VALUE]"),
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "hello" }
            }
          },
          {
            opcode: "getKey",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("get key [KEY]"),
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" }
            }
          },
          {
            opcode: "deleteKey",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete key [KEY]"),
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" }
            }
          }
        ]
      };
    }

    // Scope Management
    setScope({ SCOPE }) {
      this.projectScope = SCOPE || "CT";
    }

    getScope() {
      return this.projectScope;
    }

    // Helper to build v2 URLs
    _buildUrl(key) {
      const baseUrl = "https://ctdbapi.funstrangeegg.workers.dev/CTDBv2/Key";
      const name = encodeURIComponent(key);
      const scope = encodeURIComponent(this.projectScope);
      return `${baseUrl}?name=${name}&scope=${scope}`;
    }

    async setKey({ KEY, VALUE }) {
      const url = this._buildUrl(KEY);

      await Scratch.fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(VALUE)
      });
    }

    async getKey(args) {
      const url = this._buildUrl(args.KEY);

      const res = await Scratch.fetch(url);
      if (!res.ok) return "";

      const json = await res.json();

      return (typeof json === "object" && json !== null)
        ? JSON.stringify(json)
        : String(json);
    }

    async deleteKey(args) {
      const url = this._buildUrl(args.KEY);

      try {
        const res = await Scratch.fetch(url, {
          method: "DELETE"
        });

        if (!res.ok) {
          console.error(`Failed to delete key: ${res.status} ${res.statusText}`);
        }
      } catch (e) {
        console.error("Network error deleting key:", e);
      }
    }
  }

  Scratch.extensions.register(new WWDBExtension());
})(Scratch);
