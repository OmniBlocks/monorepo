// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { InstrumentType, Config, DropdownID } from "../synth/SynthConfig";
import { Instrument } from "../synth/synth";
import { SongDocument } from "./SongDocument";
import { ChangeSetEnvelopeTarget, ChangeSetEnvelopeType, ChangeRemoveEnvelope, ChangeEnvelopePitchStart, ChangeEnvelopePitchEnd, ChangeEnvelopeInverse, ChangePerEnvelopeSpeed, ChangeEnvelopeLowerBound, ChangeEnvelopeUpperBound } from "./changes";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { Change } from "./Change";
import { prettyNumber } from "./EditorConfig";

export class EnvelopeEditor {
	public readonly container: HTMLElement = HTML.div({ class: "envelopeEditor" });

	private readonly _rows: HTMLDivElement[] = [];
	private readonly _targetSelects: HTMLSelectElement[] = [];
	private readonly _envelopeSelects: HTMLSelectElement[] = [];
	private readonly _deleteButtons: HTMLButtonElement[] = [];
	//dropdown stuff
	public readonly extraSettingsDropdowns: HTMLButtonElement[] = []; //need to be accessed in SongEditor to function
	public readonly extraPitchSettingsGroups: HTMLDivElement[] = [];
	public readonly extraSettingsDropdownGroups: HTMLDivElement[] = [];
	public readonly openExtraSettingsDropdowns: Boolean[] = [];
	public readonly perEnvelopeSpeedGroups: HTMLElement[] = [];

	//pitch envelope sliders/boxes
	private readonly _pitchStartSliders: HTMLInputElement[] = [];
	public readonly pitchStartBoxes: HTMLInputElement[] = [];
	private readonly _pitchEndSliders: HTMLInputElement[] = [];
	public readonly pitchEndBoxes: HTMLInputElement[] = [];
	//pitch envelope note name displays
	private readonly _startNoteDisplays: HTMLSpanElement[] = [];
	private readonly _endNoteDisplays: HTMLSpanElement[] = [];
	//invert checkboxes
	private readonly _inverters: HTMLInputElement[] = [];
	//envelope speed sliders/displays
	private readonly _perEnvelopeSpeedSliders: HTMLInputElement[] = [];
	private readonly _perEnvelopeSpeedDisplays: HTMLSpanElement[] = [];
	//envelope bounds sliders/boxes
	public readonly perEnvelopeLowerBoundBoxes: HTMLInputElement[] = [];
	public readonly perEnvelopeUpperBoundBoxes: HTMLInputElement[] = [];
	private readonly _perEnvelopeLowerBoundSliders: HTMLInputElement[] = [];
	private readonly _perEnvelopeUpperBoundSliders: HTMLInputElement[] = [];

	private _renderedEnvelopeCount: number = 0;
	private _renderedEqFilterCount: number = -1;
	private _renderedNoteFilterCount: number = -1;
	private _renderedInstrumentType: InstrumentType;
	private _renderedEffects: number = 0;

	private _lastChange: Change | null = null;

	constructor(private _doc: SongDocument, private _extraSettingsDropdown: Function, private _openPrompt: Function) {
		this.container.addEventListener("change", this._onChange);
		this.container.addEventListener("click", this._onClick);
		this.container.addEventListener("input", this._onInput);
	}

	private _onChange = (event: Event): void => {
		const targetSelectIndex: number = this._targetSelects.indexOf(<any>event.target);
		const envelopeSelectIndex: number = this._envelopeSelects.indexOf(<any>event.target);
		const inverterIndex: number = this._inverters.indexOf(<any>event.target);
		const startBoxIndex: number = this.pitchStartBoxes.indexOf(<any>event.target);
		const endBoxIndex: number = this.pitchEndBoxes.indexOf(<any>event.target);
		const startSliderIndex: number = this._pitchStartSliders.indexOf(<any>event.target);
		const endSliderIndex: number = this._pitchEndSliders.indexOf(<any>event.target);
		const speedSliderIndex: number = this._perEnvelopeSpeedSliders.indexOf(<any>event.target);
		const lowerBoundBoxIndex: number = this.perEnvelopeLowerBoundBoxes.indexOf(<any>event.target);
		const upperBoundBoxIndex: number = this.perEnvelopeUpperBoundBoxes.indexOf(<any>event.target);
		const lowerBoundSliderIndex: number = this._perEnvelopeLowerBoundSliders.indexOf(<any>event.target);
		const upperBoundSliderIndex: number = this._perEnvelopeUpperBoundSliders.indexOf(<any>event.target);
		console.log("something is achanging...");
		if (targetSelectIndex != -1) {
			const combinedValue: number = parseInt(this._targetSelects[targetSelectIndex].value);
			const target: number = combinedValue % Config.instrumentAutomationTargets.length;
			const index: number = (combinedValue / Config.instrumentAutomationTargets.length) >>> 0;
			this._doc.record(new ChangeSetEnvelopeTarget(this._doc, targetSelectIndex, target, index));
		} else if (envelopeSelectIndex != -1) {
			console.log(("here2?"));
			const envelopeIndex: number = this._envelopeSelects.indexOf(<any>event.target);

			console.log("help1", this._envelopeSelects[envelopeIndex].selectedIndex, Config.newEnvelopes[this._envelopeSelects[envelopeIndex].selectedIndex]);
			this._doc.record(new ChangeSetEnvelopeType(this._doc, envelopeIndex, this._envelopeSelects[envelopeIndex].selectedIndex));

			//hide different envelope groups based on envelope type
			this.perEnvelopeSpeedGroups[envelopeIndex].style.display = Config.newEnvelopes[this._envelopeSelects[envelopeIndex].selectedIndex].name == "pitch" || Config.newEnvelopes[this._envelopeSelects[envelopeIndex].selectedIndex].name == "note size" || Config.newEnvelopes[this._envelopeSelects[envelopeIndex].selectedIndex].name == "none" ? "inline" : "none";
			this.extraPitchSettingsGroups[envelopeIndex].style.display = Config.newEnvelopes[this._envelopeSelects[envelopeIndex].selectedIndex].name == "pitch" ? "" : "none";
			this.render();
		} else if (inverterIndex != -1) {
			this._doc.record(new ChangeEnvelopeInverse(this._doc, this._inverters[inverterIndex].checked, inverterIndex));
		} else if (startBoxIndex != -1) {
			if (this._lastChange != null) {
				this._doc.record(this._lastChange);
				this._lastChange = null;
			}
		} else if (endBoxIndex != -1) {
			if (this._lastChange != null) {
				this._doc.record(this._lastChange);
				this._lastChange = null;
			}
		} else if (startSliderIndex != -1) {
			if (this._lastChange != null) {
				this._doc.record(this._lastChange);
				this._lastChange = null;
			}
		} else if (endSliderIndex != -1) {
			if (this._lastChange != null) {
				this._doc.record(this._lastChange);
				this._lastChange = null;
			}
		} else if (speedSliderIndex != -1) {
			if (this._lastChange != null) {
				this._doc.record(this._lastChange);
				this._lastChange = null;
			}
		} else if (lowerBoundBoxIndex != -1) {
			if (this._lastChange != null) {
				this._doc.record(this._lastChange);
				this._lastChange = null;
			}
		} else if (upperBoundBoxIndex != -1) {
			if (this._lastChange != null) {
				this._doc.record(this._lastChange);
				this._lastChange = null;
			}
		} else if (lowerBoundSliderIndex != -1) {
			if (this._lastChange != null) {
				this._doc.record(this._lastChange);
				this._lastChange = null;
			}
		} else if (upperBoundSliderIndex != -1) {
			if (this._lastChange != null) {
				this._doc.record(this._lastChange);
				this._lastChange = null;
			}
		}
	}

	private _onClick = (event: MouseEvent): void => {
		const index: number = this._deleteButtons.indexOf(<any>event.target);
		if (index != -1) {
			this._doc.record(new ChangeRemoveEnvelope(this._doc, index));
			this.extraSettingsDropdownGroups[index].style.display = "none";
		}
	}

	private _onInput = (event: Event): void => {
		const startBoxIndex: number = this.pitchStartBoxes.indexOf(<any>event.target);
		const endBoxIndex: number = this.pitchEndBoxes.indexOf(<any>event.target);
		const startSliderIndex: number = this._pitchStartSliders.indexOf(<any>event.target);
		const endSliderIndex: number = this._pitchEndSliders.indexOf(<any>event.target);
		const speedSliderIndex: number = this._perEnvelopeSpeedSliders.indexOf(<any>event.target);
		const lowerBoundBoxIndex: number = this.perEnvelopeLowerBoundBoxes.indexOf(<any>event.target);
		const upperBoundBoxIndex: number = this.perEnvelopeUpperBoundBoxes.indexOf(<any>event.target);
		const lowerBoundSliderIndex: number = this._perEnvelopeLowerBoundSliders.indexOf(<any>event.target);
		const upperBoundSliderIndex: number = this._perEnvelopeUpperBoundSliders.indexOf(<any>event.target);
		if (startBoxIndex != -1) {
			this._lastChange = new ChangeEnvelopePitchStart(this._doc, parseInt(this.pitchStartBoxes[startBoxIndex].value), startBoxIndex);
		} else if (endBoxIndex != -1) {
			this._lastChange = new ChangeEnvelopePitchEnd(this._doc, parseInt(this.pitchEndBoxes[endBoxIndex].value), endBoxIndex);
		} else if (startSliderIndex != -1) {
			this._lastChange = new ChangeEnvelopePitchStart(this._doc, parseInt(this._pitchStartSliders[startSliderIndex].value), startSliderIndex);
		} else if (endSliderIndex != -1) {
			this._lastChange = new ChangeEnvelopePitchEnd(this._doc, parseInt(this._pitchEndSliders[endSliderIndex].value), endSliderIndex);
		} else if (speedSliderIndex != -1) {
			this._lastChange = new ChangePerEnvelopeSpeed(this._doc, this.convertIndexSpeed(parseFloat(this._perEnvelopeSpeedSliders[speedSliderIndex].value), "speed"), speedSliderIndex);
		} else if (lowerBoundBoxIndex != -1) {
			this._lastChange = new ChangeEnvelopeLowerBound(this._doc, parseFloat(this.perEnvelopeLowerBoundBoxes[lowerBoundBoxIndex].value), lowerBoundBoxIndex);
		} else if (upperBoundBoxIndex != -1) {
			this._lastChange = new ChangeEnvelopeUpperBound(this._doc, parseFloat(this.perEnvelopeUpperBoundBoxes[upperBoundBoxIndex].value), upperBoundBoxIndex);
		} else if (lowerBoundSliderIndex != -1) {
			this._lastChange = new ChangeEnvelopeLowerBound(this._doc, parseFloat(this._perEnvelopeLowerBoundSliders[lowerBoundSliderIndex].value), lowerBoundSliderIndex);
		} else if (upperBoundSliderIndex != -1) {
			this._lastChange = new ChangeEnvelopeUpperBound(this._doc, parseFloat(this._perEnvelopeUpperBoundSliders[upperBoundSliderIndex].value), upperBoundSliderIndex);
		}
	}

	private _makeOption(target: number, index: number): HTMLOptionElement {
		let displayName = Config.instrumentAutomationTargets[target].displayName;
		if (Config.instrumentAutomationTargets[target].maxCount > 1) {
			if (displayName.indexOf("#") != -1) {
				displayName = displayName.replace("#", String(index + 1));
			} else {
				displayName += " " + (index + 1);
			}
		}
		return HTML.option({ value: target + index * Config.instrumentAutomationTargets.length }, displayName);
	}

	private _updateTargetOptionVisibility(menu: HTMLSelectElement, instrument: Instrument): void {
		for (let optionIndex: number = 0; optionIndex < menu.childElementCount; optionIndex++) {
			const option: HTMLOptionElement = <HTMLOptionElement>menu.children[optionIndex];
			const combinedValue: number = parseInt(option.value);
			const target: number = combinedValue % Config.instrumentAutomationTargets.length;
			const index: number = (combinedValue / Config.instrumentAutomationTargets.length) >>> 0;
			option.hidden = !instrument.supportsEnvelopeTarget(target, index);
		}
	}

	private _pitchToNote(value: number, isNoise: boolean): string {
		let text = "";
		if (isNoise) {
			value = value * 6 + 12;
		}
		const offset: number = Config.keys[this._doc.song.key].basePitch % Config.pitchesPerOctave;
		const keyValue = (value + offset) % Config.pitchesPerOctave;
		if (Config.keys[keyValue].isWhiteKey) {
			text = Config.keys[keyValue].name;
		} else {
			const shiftDir: number = Config.blackKeyNameParents[value % Config.pitchesPerOctave];
			text = Config.keys[(keyValue + Config.pitchesPerOctave + shiftDir) % Config.pitchesPerOctave].name;
			if (shiftDir == 1) {
				text += "♭";
			} else if (shiftDir == -1) {
				text += "♯";
			}
		}
		return "[" + text + Math.floor((value + Config.pitchesPerOctave) / 12 + this._doc.song.octave - 1) + "]";
	}

	public rerenderExtraSettings() { //probably not the best solution, but very reliable and easy
		const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
		for (let i = 0; i < Config.maxEnvelopeCount; i++) {
			if (i >= instrument.envelopeCount) {
				if (this.extraSettingsDropdowns[i]) { //make sure is not null so that we don't get an error
					this.extraSettingsDropdowns[i].style.display = "none";
				}
				if (this.extraSettingsDropdownGroups[i]) {
					this.extraSettingsDropdownGroups[i].style.display = "none";
				}
				if (this.extraPitchSettingsGroups[i]) {
					this.extraPitchSettingsGroups[i].style.display = "none";
				}
				if (this.extraPitchSettingsGroups[i]) {
					this.perEnvelopeSpeedGroups[i].style.display = "none";
				}
			} else if (this.openExtraSettingsDropdowns) {
				this.extraSettingsDropdownGroups[i].style.display = "flex";
				this.extraSettingsDropdowns[i].style.display = "inline";
				if (Config.newEnvelopes[instrument.envelopes[i].envelope].name == "pitch") {
					this.extraPitchSettingsGroups[i].style.display = "flex";
					this.pitchStartBoxes[i].value = instrument.envelopes[i].pitchEnvelopeStart.toString();
					this.pitchEndBoxes[i].value = instrument.envelopes[i].pitchEnvelopeEnd.toString();
					//reset bounds between noise and pitch channels
					this._pitchStartSliders[i].max = (instrument.isNoiseInstrument ? Config.drumCount - 1 : Config.maxPitch).toString();
					this.pitchStartBoxes[i].max = (instrument.isNoiseInstrument ? Config.drumCount - 1 : Config.maxPitch).toString();
					this._pitchEndSliders[i].max = (instrument.isNoiseInstrument ? Config.drumCount - 1 : Config.maxPitch).toString();
					this.pitchEndBoxes[i].max = (instrument.isNoiseInstrument ? Config.drumCount - 1 : Config.maxPitch).toString();
					if (instrument.isNoiseInstrument && parseInt(this.pitchStartBoxes[i].value) > Config.drumCount - 1) {
						this.pitchStartBoxes[i].value = (Config.drumCount - 1).toString(); //reset if somehow greater than it should be
					}
					if (instrument.isNoiseInstrument && parseInt(this.pitchEndBoxes[i].value) > Config.drumCount - 1) {
						this.pitchEndBoxes[i].value = (Config.drumCount - 1).toString();
					}
					//update note displays
					this._startNoteDisplays[i].textContent = "Start " + this._pitchToNote(parseInt(this.pitchStartBoxes[i].value), instrument.isNoiseInstrument) + ": ";
					this._endNoteDisplays[i].textContent = "End " + this._pitchToNote(parseInt(this.pitchEndBoxes[i].value), instrument.isNoiseInstrument) + ": ";
					//hide perEnvelopeSpeed
					this.perEnvelopeSpeedGroups[i].style.display = "none"
				} else {
					this.extraPitchSettingsGroups[i].style.display = "none";
					if (Config.newEnvelopes[instrument.envelopes[i].envelope].name == "note size" || Config.newEnvelopes[instrument.envelopes[i].envelope].name == "none") {
						this.perEnvelopeSpeedGroups[i].style.display = "none"
					} else {
						//perEnvelopeSpeed
						this.perEnvelopeSpeedGroups[i].style.display = "flex"
						this._perEnvelopeSpeedSliders[i].value = this.convertIndexSpeed(instrument.envelopes[i].perEnvelopeSpeed, "index").toString();
						this._perEnvelopeSpeedDisplays[i].textContent = "Spd: x" + prettyNumber(this.convertIndexSpeed(parseFloat(this._perEnvelopeSpeedSliders[i].value), "speed"));
					}
				}
				this._inverters[i].checked = instrument.envelopes[i].inverse;
				this.perEnvelopeLowerBoundBoxes[i].value = instrument.envelopes[i].perEnvelopeLowerBound.toString();
				this.perEnvelopeUpperBoundBoxes[i].value = instrument.envelopes[i].perEnvelopeUpperBound.toString();
				this._perEnvelopeLowerBoundSliders[i].value = instrument.envelopes[i].perEnvelopeLowerBound.toString();
				this._perEnvelopeUpperBoundSliders[i].value = instrument.envelopes[i].perEnvelopeUpperBound.toString();
			} else if (this.openExtraSettingsDropdowns != null || this.openExtraSettingsDropdowns != undefined) {
				this.extraSettingsDropdownGroups[i].style.display = "none";
				this.extraPitchSettingsGroups[i].style.display = "none";
				this.extraSettingsDropdowns[i].style.display = "inline";
				this.perEnvelopeSpeedGroups[i].style.display = "none";
			} else {
				this.extraSettingsDropdowns[i].style.display = "none";
				this.extraSettingsDropdownGroups[i].style.display = "none";
				this.extraPitchSettingsGroups[i].style.display = "none";
				this.perEnvelopeSpeedGroups[i].style.display = "none";
			}
		}
	}

	private convertIndexSpeed(value: number, convertTo: string): number {
		switch (convertTo) {
			case "index":
				return Config.perEnvelopeSpeedToIndices[value] ? Config.perEnvelopeSpeedToIndices[value] : 23;
			case "speed":
				return Config.perEnvelopeSpeedIndices[value] ? Config.perEnvelopeSpeedIndices[value] : 1;
		} 
		return 0;
		//lots of defaults just in case...
	}

	// public whenSetEnvelopePreset = (event: Event): void => {
	// 	const envelopeIndex: number = this._envelopeSelects.indexOf(<any>event.target);

	// 	console.log("help1", this._envelopeSelects[envelopeIndex].selectedIndex, this.envelopesScrambled[this._envelopeSelects[envelopeIndex].selectedIndex]);
	// 	this._doc.record(new ChangeSetEnvelopeType(this._doc, envelopeIndex, this.envelopesScrambled[this._envelopeSelects[envelopeIndex].selectedIndex]));

	// 	//set the speed slider to the right speed
	// 	const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
	// 	console.log("help2", instrument.envelopes[envelopeIndex].envelope, Config.envelopes[instrument.envelopes[envelopeIndex].envelope], this.convertIndexSpeed(Config.envelopes[instrument.envelopes[envelopeIndex].envelope].speed, "index").toString());
	// 	this._perEnvelopeSpeedSliders[envelopeIndex].value = this.convertIndexSpeed(Config.envelopes[instrument.envelopes[envelopeIndex].envelope].speed, "index").toString();
	// 	//speed = to index
	// 	this._perEnvelopeSpeedDisplays[envelopeIndex].textContent = "Spd: x" + prettyNumber(this.convertIndexSpeed(parseFloat(this._perEnvelopeSpeedSliders[envelopeIndex].value), "speed"));

	// 	this.perEnvelopeSpeedGroups[envelopeIndex].style.display = Config.envelopes[this._envelopeSelects[envelopeIndex].selectedIndex].name == "pitch" || Config.envelopes[this._envelopeSelects[envelopeIndex].selectedIndex].name == "note size" || Config.envelopes[this._envelopeSelects[envelopeIndex].selectedIndex].name == "none" ? "inline" : "none";
	// 	this.extraPitchSettingsGroups[envelopeIndex].style.display = Config.envelopes[this._envelopeSelects[envelopeIndex].selectedIndex].name == "pitch" ? "" : "none";
	// 	this.render();
	// }

	public render(): void {
		const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];

		for (let envelopeIndex: number = this._rows.length; envelopeIndex < instrument.envelopeCount; envelopeIndex++) {
			const targetSelect: HTMLSelectElement = HTML.select();
			for (let target: number = 0; target < Config.instrumentAutomationTargets.length; target++) {
				const interleaved: boolean = (Config.instrumentAutomationTargets[target].interleave);
				for (let index: number = 0; index < Config.instrumentAutomationTargets[target].maxCount; index++) {
					targetSelect.appendChild(this._makeOption(target, index));
					if (interleaved) {
						targetSelect.appendChild(this._makeOption(target + 1, index));
					}
				}
				if (interleaved) target++;
			}

			const envelopeSelect: HTMLSelectElement = HTML.select({ id: "envelopeSelect"});
			//count represents the location of the envelope in the dropdown, while envelope represents the location of the envelope in synthconfig
			//add bases first, then presets
			for (let envelope: number = 0; envelope < Config.newEnvelopes.length; envelope++) {
				envelopeSelect.appendChild(HTML.option({ value: envelope }, Config.newEnvelopes[envelope].name));
			}
			// I might add envelope presets later, but it's too much of a hassle currently
			//const envelopePresets: HTMLElement = HTML.optgroup({ label: "Presets ▾" });
			// for (let envelope: number = 0; envelope < Config.envelopes.length; envelope++) {
			// 	if (!Config.envelopes[envelope].default) {
			// 		envelopePresets.appendChild(HTML.option({ value: envelope }, Config.envelopes[envelope].name));
			// 		this.envelopesScrambled[count] = envelope;
			// 		count++;
			// 	}
			// }
			// envelopeSelect.appendChild(envelopePresets);

			const deleteButton: HTMLButtonElement = HTML.button({ type: "button", class: "delete-envelope", style: "flex: 0.2" });

			//Create HTML structure for the dropdowns
			const startNoteSlider: HTMLInputElement = HTML.input({ value: instrument.envelopes[envelopeIndex].pitchEnvelopeStart ? instrument.envelopes[envelopeIndex].pitchEnvelopeStart : 0, style: "width: 113px; margin-left: 0px;", type: "range", min: "0", max: instrument.isNoiseInstrument ? Config.drumCount-1 : Config.maxPitch, step: "1" });
			const startNoteBox: HTMLInputElement = HTML.input({ value: instrument.envelopes[envelopeIndex].pitchEnvelopeStart ? instrument.envelopes[envelopeIndex].pitchEnvelopeStart : 0, style: "width: 4em; font-size: 80%; ", id: "startNoteBox", type: "number", step: "1", min: "0", max: instrument.isNoiseInstrument ? Config.drumCount - 1 : Config.maxPitch });

			const endNoteSlider: HTMLInputElement = HTML.input({ value: instrument.envelopes[envelopeIndex].pitchEnvelopeEnd ? instrument.envelopes[envelopeIndex].pitchEnvelopeEnd : instrument.isNoiseInstrument ? Config.drumCount-1 : Config.maxPitch, style: "width: 113px; margin-left: 0px;", type: "range", min: "0", max: instrument.isNoiseInstrument ? Config.drumCount-1 : Config.maxPitch, step: "1" });
			const endNoteBox: HTMLInputElement = HTML.input({ value: instrument.envelopes[envelopeIndex].pitchEnvelopeEnd ? instrument.envelopes[envelopeIndex].pitchEnvelopeEnd : instrument.isNoiseInstrument ? Config.drumCount-1 : Config.maxPitch, style: "width: 4em; font-size: 80%; ", id: "endNoteBox", type: "number", step: "1", min: "0", max: instrument.isNoiseInstrument ? Config.drumCount - 1 : Config.maxPitch });

			const invertBox: HTMLInputElement = HTML.input({ "checked": instrument.envelopes[envelopeIndex].inverse, type: "checkbox", style: "width: 1em; padding: 0.5em; margin-left: 4em;", id: "invertBox" });

			const lowerBoundBox: HTMLInputElement = HTML.input({ value: instrument.envelopes[envelopeIndex].perEnvelopeLowerBound, type: "number", min: Config.perEnvelopeBoundMin, max: Config.perEnvelopeBoundMax, step: 0.1 });
			const upperBoundBox: HTMLInputElement = HTML.input({ value: instrument.envelopes[envelopeIndex].perEnvelopeUpperBound, type: "number", min: Config.perEnvelopeBoundMin, max: Config.perEnvelopeBoundMax, step: 0.1 });
			const lowerBoundSlider: HTMLInputElement = HTML.input({ value: instrument.envelopes[envelopeIndex].perEnvelopeLowerBound, type: "range", min: Config.perEnvelopeBoundMin, max: Config.perEnvelopeBoundMax, step: 0.1 });
			const upperBoundSlider: HTMLInputElement = HTML.input({ value: instrument.envelopes[envelopeIndex].perEnvelopeUpperBound, type: "range", min: Config.perEnvelopeBoundMin, max: Config.perEnvelopeBoundMax, step: 0.1 });

			const startNoteDisplay: HTMLSpanElement = HTML.span({ class: "tip", style: `width:68px; flex:1; height:1em; font-size: smaller;`, onclick: () => this._openPrompt("pitchRange") }, "Start " + this._pitchToNote(parseInt(startNoteBox.value), instrument.isNoiseInstrument) + ": ");
			const endNoteDisplay: HTMLSpanElement = HTML.span({ class: "tip", style: `width:68px; flex:1; height:1em; font-size: smaller;`, onclick: () => this._openPrompt("pitchRange") }, "End " + this._pitchToNote(parseInt(endNoteBox.value), instrument.isNoiseInstrument) + ": ");
			const startBoxWrapper: HTMLDivElement = HTML.div({ style: "flex: 1; display: flex; flex-direction: column; align-items: center;" }, startNoteDisplay, startNoteBox);
			const endBoxWrapper: HTMLDivElement = HTML.div({ style: "flex: 1; display: flex; flex-direction: column; align-items: center;" }, endNoteDisplay, endNoteBox);

			const lowerBoundBoxWrapper: HTMLDivElement = HTML.div({ style: "flex: 1; display: flex; flex-direction: column; align-items: center;" }, HTML.span({ class: "tip", style: `width:68px; flex:1; height:1em; font-size: smaller;`, onclick: () => this._openPrompt("envelopeRange") }, "Upr bnd: "), lowerBoundBox);
			const upperBoundBoxWrapper: HTMLDivElement = HTML.div({ style: "flex: 1; display: flex; flex-direction: column; align-items: center;" }, HTML.span({ class: "tip", style: `width:68px; flex:1; height:1em; font-size: smaller;`, onclick: () => this._openPrompt("envelopeRange") }, "Lwr bnd: "), upperBoundBox);

			const startNoteWrapper: HTMLDivElement = HTML.div({ style: "margin-top: 3px; flex:1; display:flex; flex-direction: row; align-items:center; justify-content:right;" }, startBoxWrapper, startNoteSlider);
			const endNoteWrapper: HTMLDivElement = HTML.div({ style: "margin-top: 3px; flex:1; display:flex; flex-direction: row; align-items:center; justify-content:right;" }, endBoxWrapper, endNoteSlider);
			const invertWrapper: HTMLDivElement = HTML.div({ style: "margin: 0.5em; align-items:center; justify-content:right;" }, HTML.span({ class: "tip", onclick: () => this._openPrompt("envelopeInvert") }, "Invert: "), invertBox);
			
			const lowerBoundWrapper: HTMLDivElement = HTML.div({ style: "margin-top: 3px; flex:2; display:flex; flex-direction: row; align-items:center; justify-content:right;" }, lowerBoundBoxWrapper, lowerBoundSlider);
			const upperBoundWrapper: HTMLDivElement = HTML.div({ style: "margin-top: 3px; flex:2; display:flex; flex-direction: row; align-items:center; justify-content:right;" }, upperBoundBoxWrapper, upperBoundSlider);

			const perEnvelopeSpeedSlider: HTMLInputElement = HTML.input({ style: "margin: 0; width: 124px", type: "range", min: 0, max: Config.perEnvelopeSpeedIndices.length - 1, value: this.convertIndexSpeed(instrument.envelopes[envelopeIndex].perEnvelopeSpeed, "index"), step: "1" });
			const perEnvelopeSpeedDisplay: HTMLSpanElement = HTML.span({ class: "tip", style: `width:68px; flex:1; height:1em; font-size: smaller;`, onclick: () => this._openPrompt("perEnvelopeSpeed") }, "Spd: x" + prettyNumber(this.convertIndexSpeed(parseFloat(perEnvelopeSpeedSlider.value), "speed")));
			const perEnvelopeSpeedWrapper: HTMLDivElement = HTML.div({ style: "margin-top: 3px; flex:1; display:flex; flex-direction: row; align-items:center; justify-content:right;" }, perEnvelopeSpeedDisplay, perEnvelopeSpeedSlider);


			const perEnvelopeSpeedGroup: HTMLDivElement = HTML.div({ class: "editor-controls", style: "flex-direction:column; align-items:center;" }, perEnvelopeSpeedWrapper);
			const extraPitchSettingsGroup: HTMLDivElement = HTML.div({ class: "editor-controls", style: "flex-direction:column; align-items:center;" }, startNoteWrapper, endNoteWrapper);
			extraPitchSettingsGroup.style.display = "none";
			const extraSettingsDropdown: HTMLButtonElement = HTML.button({ style: "margin-left:0em; margin-right: 0.3em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => { const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()]; this._extraSettingsDropdown(DropdownID.EnvelopeSettings, envelopeIndex, Config.newEnvelopes[instrument.envelopes[envelopeIndex].envelope].name); } }, "▼");
			extraSettingsDropdown.style.display = "inline";

			const extraSettingsDropdownGroup: HTMLDivElement = HTML.div({ class: "editor-controls", style: "flex-direction:column; align-items:center;" }, perEnvelopeSpeedGroup, extraPitchSettingsGroup, lowerBoundWrapper, upperBoundWrapper, invertWrapper);
			extraSettingsDropdownGroup.style.display = "none";


			const row: HTMLDivElement = HTML.div({ class: "envelope-row" },
				extraSettingsDropdown,
				HTML.div({ class: "selectContainer", style: "width: 0; flex: 1;" }, targetSelect),
				HTML.div({ class: "selectContainer", style: "width: 0; flex: 0.85" }, envelopeSelect),
				deleteButton,
			);

			this.container.appendChild(row);
			this.container.appendChild(extraSettingsDropdownGroup);
			this._rows[envelopeIndex] = row;
			this._targetSelects[envelopeIndex] = targetSelect;
			this._envelopeSelects[envelopeIndex] = envelopeSelect;
			this._deleteButtons[envelopeIndex] = deleteButton;
			this.extraSettingsDropdowns[envelopeIndex] = extraSettingsDropdown;
			this.extraSettingsDropdownGroups[envelopeIndex] = extraSettingsDropdownGroup;
			this.extraPitchSettingsGroups[envelopeIndex] = extraPitchSettingsGroup;
			this._pitchStartSliders[envelopeIndex] = startNoteSlider;
			this.pitchStartBoxes[envelopeIndex] = startNoteBox;
			this._pitchEndSliders[envelopeIndex] = endNoteSlider;
			this.pitchEndBoxes[envelopeIndex] = endNoteBox;
			this._inverters[envelopeIndex] = invertBox;
			this._startNoteDisplays[envelopeIndex] = startNoteDisplay;
			this._endNoteDisplays[envelopeIndex] = endNoteDisplay;
			this._perEnvelopeSpeedDisplays[envelopeIndex] = perEnvelopeSpeedDisplay;
			this._perEnvelopeSpeedSliders[envelopeIndex] = perEnvelopeSpeedSlider;
			this.perEnvelopeSpeedGroups[envelopeIndex] = perEnvelopeSpeedGroup;
			this.perEnvelopeLowerBoundBoxes[envelopeIndex] = lowerBoundBox;
			this.perEnvelopeUpperBoundBoxes[envelopeIndex] = upperBoundBox;
			this._perEnvelopeLowerBoundSliders[envelopeIndex] = lowerBoundSlider;
			this._perEnvelopeUpperBoundSliders[envelopeIndex] = upperBoundSlider;
		}

		for (let envelopeIndex: number = this._renderedEnvelopeCount; envelopeIndex < instrument.envelopeCount; envelopeIndex++) {
			this._rows[envelopeIndex].style.display = "";
			// For newly visible rows, update target option visibiliy.
			this._updateTargetOptionVisibility(this._targetSelects[envelopeIndex], instrument);
		}

		for (let envelopeIndex: number = instrument.envelopeCount; envelopeIndex < this._renderedEnvelopeCount; envelopeIndex++) {
			this._rows[envelopeIndex].style.display = "none";
		}

		let useControlPointCount: number = instrument.noteFilter.controlPointCount;
		if (instrument.noteFilterType)
			useControlPointCount = 1;

		if (this._renderedEqFilterCount != instrument.eqFilter.controlPointCount ||
			this._renderedNoteFilterCount != useControlPointCount ||
			this._renderedInstrumentType != instrument.type ||
			this._renderedEffects != instrument.effects) {
			// Update target option visibility for previously visible rows.
			for (let envelopeIndex: number = 0; envelopeIndex < this._renderedEnvelopeCount; envelopeIndex++) {
				this._updateTargetOptionVisibility(this._targetSelects[envelopeIndex], instrument);
			}
		}

		for (let envelopeIndex: number = 0; envelopeIndex < instrument.envelopeCount; envelopeIndex++) {
			this._targetSelects[envelopeIndex].value = String(instrument.envelopes[envelopeIndex].target + instrument.envelopes[envelopeIndex].index * Config.instrumentAutomationTargets.length);
			this._envelopeSelects[envelopeIndex].selectedIndex = instrument.envelopes[envelopeIndex].envelope;
			this.pitchStartBoxes[envelopeIndex].value = String(instrument.envelopes[envelopeIndex].pitchEnvelopeStart);
			this.pitchEndBoxes[envelopeIndex].value = String(instrument.envelopes[envelopeIndex].pitchEnvelopeEnd);
			this._pitchStartSliders[envelopeIndex].value = String(instrument.envelopes[envelopeIndex].pitchEnvelopeStart);
			this._pitchEndSliders[envelopeIndex].value = String(instrument.envelopes[envelopeIndex].pitchEnvelopeEnd);
			this._inverters[envelopeIndex].checked = instrument.envelopes[envelopeIndex].inverse;
			this._perEnvelopeSpeedSliders[envelopeIndex].value = String(this.convertIndexSpeed(instrument.envelopes[envelopeIndex].perEnvelopeSpeed, "index"));
			this.perEnvelopeLowerBoundBoxes[envelopeIndex].value = String(instrument.envelopes[envelopeIndex].perEnvelopeLowerBound);
			this.perEnvelopeUpperBoundBoxes[envelopeIndex].value = String(instrument.envelopes[envelopeIndex].perEnvelopeUpperBound);
			this._perEnvelopeLowerBoundSliders[envelopeIndex].value = String(instrument.envelopes[envelopeIndex].perEnvelopeLowerBound);
			this._perEnvelopeUpperBoundSliders[envelopeIndex].value = String(instrument.envelopes[envelopeIndex].perEnvelopeUpperBound);
		}

		this._renderedEnvelopeCount = instrument.envelopeCount;
		this._renderedEqFilterCount = instrument.eqFilter.controlPointCount;
		this._renderedNoteFilterCount = useControlPointCount;
		this._renderedInstrumentType = instrument.type;
		this._renderedEffects = instrument.effects;
	}
}