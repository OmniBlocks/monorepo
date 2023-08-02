// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { HTML } from "imperative-html/dist/esm/elements-strict";
import { Prompt } from "./Prompt";
import { SongDocument } from "./SongDocument";
import { ColorConfig } from "./ColorConfig";

//namespace beepbox {
const { button, div, h2, select, option } = HTML;

export class ThemePrompt implements Prompt {
	private readonly _themeSelect: HTMLSelectElement = select({ style: "width: 100%;" },
					option$6({ value: "dark classic" }, "BeepBox Dark"),
			option$6({ value: "light classic" }, "BeepBox Light"),
			option$6({ value: "dark competition" }, "BeepBox Competition Dark"),
			option$6({ value: "jummbox classic" }, "JummBox Dark"),
			option$6({ value: "jummbox light" }, "Gold Light"),
			option$6({ value: "forest" }, "Forest"),
			option$6({ value: "canyon" }, "Canyon"),
			option$6({ value: "midnight" }, "Midnight"),
			option$6({ value: "beachcombing" }, "Beachcombing"),
			option$6({ value: "violet verdant" }, "Violet Verdant"),
			option$6({ value: "sunset" }, "Sunset"),
			option$6({ value: "autumn" }, "Autumn"),
			option$6({ value: "fruit" }, "Shadowfruit"),
			option$6({ value: "toxic" }, "Toxic"),
			option$6({ value: "roe" }, "Roe"),
			option$6({ value: "moonlight" }, "Moonlight"),
			option$6({ value: "portal" }, "Portal"),
			option$6({ value: "fusion" }, "Fusion"),
			option$6({ value: "inverse" }, "Inverse"),
			option$6({ value: "nebula" }, "Nebula"),
			option$6({ value: "roe light" }, "Roe Light"),
			option$6({ value: "amoled dark" }, "High Contrast Dark"),
			option$6({ value: "energized" }, "Energized"),
			option$6({ value: "neapolitan" }, "Neapolitan"),
			option$6({ value: "mono" }, "Mono"),
			option$6({ value: "slushie" }, "Slushie"),
			option$6({ value: "modbox classic" }, "Modbox Classic"),
			option$6({ value: "sandbox classic" }, "Sandbox 3.0"),
			option$6({ value: "harrybox" }, "Haileybox"),
			option$6({ value: "brucebox" }, "Brucebox"),
			option$6({ value: "shitbox 2.0" }, "Shitbox 2.0"),
			option$6({ value: "shitbox 3.0" }, "Shitbox 3.0"),
			option$6({ value: "nerdbox" }, "Nerdbox"),
			option$6({ value: "zefbox" }, "Zefbox"),
			option$6({ value: "cardboardbox classic" }, "Cardboardbox"),
			option$6({ value: "blubox classic" }, "Blubox 1.0"),
			option$6({ value: "dogebox classic" }, "Dogebox"),
			option$6({ value: "wackybox" }, "Wackybox"),
			option$6({ value: "todbox dark mode" }, "Todbox Dark Mode"),
			option$6({ value: "mainbox 1.0" }, "Mainbox"),
			option$6({ value: "microbox" }, "MicroBox"),
			option$6({ value: "foxbox" }, "FoxBox"),
			option$6({ value: "ultrabox rainbow" }, "UltraBox Rainbow"),
			option$6({ value: "ultrabox terminal" }, "UltraBox Terminal"),
			option$6({ value: "ultrabox upside-down beepbox" }, "UltraBox Upside-down Beepbox"),
			option$6({ value: "mainbox reimagined" }, "Mainbox Reimagined"),
			option$6({ value: "custom" }, "Custom")
	);
	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
	private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, "Okay");

	public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 220px;" },
		h2("Set Theme"),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ class: "selectContainer", style: "width: 100%;" }, this._themeSelect),
		),
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
		),
		this._cancelButton,
	);
	private readonly lastTheme: string | null = window.localStorage.getItem("colorTheme")

	constructor(private _doc: SongDocument) {
		if (this.lastTheme != null) {
			this._themeSelect.value = this.lastTheme;
		}
		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
		this.container.addEventListener("keydown", this._whenKeyPressed);
		this._themeSelect.addEventListener("change", this._previewTheme);
	}

	private _close = (): void => {
		if (this.lastTheme != null) {
			ColorConfig.setTheme(this.lastTheme);
		} else {
			ColorConfig.setTheme("dark classic");
		}
		this._doc.undo();
	}

	public cleanUp = (): void => {
		this._okayButton.removeEventListener("click", this._saveChanges);
		this._cancelButton.removeEventListener("click", this._close);
		this.container.removeEventListener("keydown", this._whenKeyPressed);
	}

	private _whenKeyPressed = (event: KeyboardEvent): void => {
		if ((<Element>event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
			this._saveChanges();
		}
	}

	private _saveChanges = (): void => {
		window.localStorage.setItem("colorTheme", this._themeSelect.value);
		this._doc.prompt = null;
		this._doc.prefs.colorTheme = this._themeSelect.value;
		this._doc.undo();
	}

	private _previewTheme = (): void => {
		ColorConfig.setTheme(this._themeSelect.value);
		this._doc.notifier.changed();
	}
}
//}
