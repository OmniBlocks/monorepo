// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { HTML } from "imperative-html/dist/esm/elements-strict";
import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { ChangeOctaveCount } from "./changes";

	const {button, div, h2, p, input} = HTML;

export class OctaveCountPrompt implements Prompt {
		private readonly _octaves: HTMLInputElement = input({style: "width: 3em; margin-left: 1em;", type: "number", step: "1"});
		private readonly _cancelButton: HTMLButtonElement = button({class: "cancelButton"});
		private readonly _okayButton: HTMLButtonElement = button({class: "okayButton", style: "width:45%;"}, "Okay");
		
		public readonly container: HTMLDivElement = div({class: "prompt noSelection", style: "width: 250px;"},
		h2("Change Octave Count"),
        p("WARNING! This will clear all the contents of the song!"),
			div({style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;"},
				div({style: "display: inline-block; text-align: left;"},
				"EDO:",
			),
			this._octaves,
		),
			div({style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;"},
		),
			div({style: "display: flex; flex-direction: row-reverse; justify-content: space-between;"},
			this._okayButton,
		),
		this._cancelButton,
	);
		
	constructor(private _doc: SongDocument) {

		this._octaves.value = this._doc.song.octaveCount + "";
		this._octaves.min = "1";
		this._octaves.max = "16";
			
		this._octaves.select();
			setTimeout(()=>this._octaves.focus());
			
		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
		this._octaves.addEventListener("keypress", OctaveCountPrompt._validateKey);
		this._octaves.addEventListener("blur", OctaveCountPrompt._validateNumber);
		this.container.addEventListener("keydown", this._whenKeyPressed);
	}
		
		private _close = (): void => { 
		this._doc.undo();
	}
		
	public cleanUp = (): void => {
		this._okayButton.removeEventListener("click", this._saveChanges);
		this._cancelButton.removeEventListener("click", this._close);
		this._octaves.removeEventListener("keypress", OctaveCountPrompt._validateKey);
		this._octaves.removeEventListener("blur", OctaveCountPrompt._validateNumber);
		this.container.removeEventListener("keydown", this._whenKeyPressed);
	}
		
	private _whenKeyPressed = (event: KeyboardEvent): void => {
			if ((<Element> event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
			this._saveChanges();
		}
	}
		
	private static _validateKey(event: KeyboardEvent): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
			event.preventDefault();
			return true;
		}
		return false;
	}
		
	private static _validateNumber(event: Event): void {
		const input: HTMLInputElement = <HTMLInputElement>event.target;
		input.value = String(OctaveCountPrompt._validate(input));
	}
		
	private static _validate(input: HTMLInputElement): number {
		return Math.floor(Math.max(Number(input.min), Math.min(Number(input.max), Number(input.value))));
	}
		
	private _saveChanges = (): void => {
		this._doc.prompt = null;
		this._doc.record(new ChangeOctaveCount(this._doc, OctaveCountPrompt._validate(this._octaves)), true);
		let numChannels: number = this._doc.song.channels.length;
		let numPatterns: number;
		for (let i=0; i<numChannels; i++) {
			numPatterns = this._doc.song.channels[i].patterns.length;
			for (let j=0; j<numPatterns; j++) {
				this._doc.song.channels[i].patterns[j].notes = [];
			}
		}
        // Reload but make sure changes get saved or changes will not save
        setTimeout(() => { location.reload(); }, 50);
	}
}
