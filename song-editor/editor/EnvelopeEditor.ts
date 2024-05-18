// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { InstrumentType, Config } from "../synth/SynthConfig";
import { Instrument } from "../synth/synth";
import { SongDocument } from "./SongDocument";
import { ChangeSetEnvelopeTarget, ChangeSetEnvelopeType, ChangeRemoveEnvelope } from "./changes";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { Slider } from "./HTMLWrapper";
import { ChangeEnvelopePitchStart, ChangeEnvelopePitchEnd, ChangeEnvelopeInverse } from "./changes";
import { DropdownID } from "../synth/SynthConfig";

export class EnvelopeEditor {
	public readonly container: HTMLElement = HTML.div({ class: "envelopeEditor" });

	private readonly _rows: HTMLDivElement[] = [];
	private readonly _targetSelects: HTMLSelectElement[] = [];
	private readonly _envelopeSelects: HTMLSelectElement[] = [];
	private readonly _deleteButtons: HTMLButtonElement[] = [];
	public readonly _extraSettingsDropdowns: HTMLButtonElement[] = []; //need to be accessed in SongEditor to function
	public readonly _extraPitchSettingsDropdownGroups: HTMLDivElement[] = [];
	public readonly _extraNoteSizeSettingsDropdownGroups: HTMLDivElement[] = [];
	public readonly _openExtraSettingsDropdowns: Boolean[] = [];
	private readonly _pitchStartSliders: HTMLInputElement[] = [];
	private readonly _pitchStartBoxes: HTMLInputElement[] = [];
	private readonly _pitchEndSliders: HTMLInputElement[] = [];
	private readonly _pitchEndBoxes: HTMLInputElement[] = [];
	private readonly _pitchInverters: HTMLInputElement[] = [];
	private _renderedEnvelopeCount: number = 0;
	private _renderedEqFilterCount: number = -1;
	private _renderedNoteFilterCount: number = -1;
	private _renderedInstrumentType: InstrumentType;
	private _renderedEffects: number = 0;

	constructor(private _doc: SongDocument, private _extraSettingsDropdown: Function, private _openPrompt: Function) {
		this.container.addEventListener("change", this._onChange);
		this.container.addEventListener("click", this._onClick);
		this.container.addEventListener("input", this._onInput);
	}

	private _onChange = (event: Event): void => {
		const targetSelectIndex: number = this._targetSelects.indexOf(<any>event.target);
		const envelopeSelectIndex: number = this._envelopeSelects.indexOf(<any>event.target);
		const pitchStartSliderIndex: number = this._pitchStartSliders.indexOf(<any>event.target);
		const pitchStartBoxIndex: number = this._pitchStartBoxes.indexOf(<any>event.target);
		const pitchEndSliderIndex: number = this._pitchEndSliders.indexOf(<any>event.target);
		const pitchEndBoxIndex: number = this._pitchEndBoxes.indexOf(<any>event.target);
		const pitchInverterIndex: number = this._pitchInverters.indexOf(<any>event.target);
		if (targetSelectIndex != -1) {
			const combinedValue: number = parseInt(this._targetSelects[targetSelectIndex].value);
			const target: number = combinedValue % Config.instrumentAutomationTargets.length;
			const index: number = (combinedValue / Config.instrumentAutomationTargets.length) >>> 0;
			this._doc.record(new ChangeSetEnvelopeTarget(this._doc, targetSelectIndex, target, index));
		} else if (envelopeSelectIndex != -1) {
			this._doc.record(new ChangeSetEnvelopeType(this._doc, envelopeSelectIndex, this._envelopeSelects[envelopeSelectIndex].selectedIndex));

			this._extraSettingsDropdowns[envelopeSelectIndex].style.display = Config.envelopes[this._envelopeSelects[envelopeSelectIndex].selectedIndex].name == "pitch" ? "inline" : "none";
			this._extraPitchSettingsDropdownGroups[envelopeSelectIndex].style.display = Config.envelopes[this._envelopeSelects[envelopeSelectIndex].selectedIndex].name == "pitch" ? "" : "none";
		} else if (pitchStartSliderIndex != -1 || pitchStartBoxIndex != -1) {
			const index: number = pitchStartSliderIndex == -1 ? pitchStartBoxIndex : pitchStartSliderIndex;
			const newValue: number = parseInt(this._pitchStartBoxes[index].value);
			this._doc.record(new ChangeEnvelopePitchStart(this._doc, newValue, index));
		} else if (pitchEndSliderIndex != -1 || pitchEndBoxIndex != -1) {
			const index: number = pitchEndSliderIndex == -1 ? pitchEndBoxIndex : pitchEndSliderIndex;
			const newValue: number = parseInt(this._pitchEndBoxes[index].value);
			this._doc.record(new ChangeEnvelopePitchEnd(this._doc, newValue, index));
		} else if (pitchInverterIndex != -1) {
			this._doc.record(new ChangeEnvelopeInverse(this._doc, this._pitchInverters[pitchInverterIndex].checked, pitchInverterIndex));
		}
	}

	private _onClick = (event: MouseEvent): void => {
		const index: number = this._deleteButtons.indexOf(<any>event.target);
		if (index != -1) {
			this._doc.record(new ChangeRemoveEnvelope(this._doc, index));
		}
	}

	private _onInput = (event: Event): void => {
		const startSliderIndex: number = this._pitchStartSliders.indexOf(<any>event.target);
		const startBoxIndex: number = this._pitchStartBoxes.indexOf(<any>event.target);
		const endSliderIndex: number = this._pitchEndSliders.indexOf(<any>event.target);
		const endBoxIndex: number = this._pitchEndBoxes.indexOf(<any>event.target);
		if (startSliderIndex != -1) {
			this._pitchStartBoxes[startSliderIndex].value = this._pitchStartSliders[startSliderIndex].value;
		} else if (startBoxIndex != -1) {
			this._pitchStartSliders[startBoxIndex].value = this._pitchStartBoxes[startBoxIndex].value;
		} else if (endSliderIndex != -1) {
			this._pitchEndBoxes[endSliderIndex].value = this._pitchEndSliders[endSliderIndex].value;
		} else if (endBoxIndex != -1) {
			this._pitchEndSliders[endBoxIndex].value = this._pitchEndBoxes[endBoxIndex].value;
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

	public rerenderExtraSettings() {
		const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
		for (let i = 0; i < instrument.envelopeCount; i++) {
			//this._extraPitchSettingsDropdownGroups[i].style.display = "none";
			if (Config.envelopes[instrument.envelopes[i].envelope].name == "pitch") {
				this._extraSettingsDropdowns[i].style.display = "inline";
				if (this._extraSettingsDropdowns[i].textContent == "▼") {
					this._extraPitchSettingsDropdownGroups[i].style.display = "flex";
				}
			} else {
				this._extraSettingsDropdowns[i].style.display = "none";
			}
		}
	}

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

			const envelopeSelect: HTMLSelectElement = HTML.select();
			for (let envelope: number = 0; envelope < Config.envelopes.length; envelope++) {
				envelopeSelect.appendChild(HTML.option({ value: envelope }, Config.envelopes[envelope].name));
			}

			const deleteButton: HTMLButtonElement = HTML.button({ type: "button", class: "delete-envelope", style: "flex: 0.2" });

			//Create HTML structure for the dropdowns
			const startNoteSlider: Slider = new Slider(HTML.input({ value: instrument.pitchEnvelopeStart[envelopeIndex], style: "width: 9em; margin-left: 1em;", type: "range", min: "0", max: instrument.isNoiseInstrument ? 11 : 96, step: "1" }), this._doc, null, false);
			const startNoteBox: HTMLInputElement = HTML.input({ value: instrument.pitchEnvelopeStart[envelopeIndex], style: "width: 4em; font-size: 80%; ", id: "startNoteBox", type: "number", step: "1", min: "0", max: instrument.isNoiseInstrument ? 11 : 96 });

			const endNoteSlider: Slider = new Slider(HTML.input({ value: instrument.pitchEnvelopeEnd[envelopeIndex], style: "width: 9em; margin-left: 1em;", type: "range", min: "0", max: instrument.isNoiseInstrument ? 11 : 96, step: "1" }), this._doc, null, false);
			const endNoteBox: HTMLInputElement = HTML.input({ value: instrument.pitchEnvelopeEnd[envelopeIndex], style: "width: 4em; font-size: 80%; ", id: "endNoteBox", type: "number", step: "1", min: "0", max: instrument.isNoiseInstrument ? 11 : 96 });

			const invertBox: HTMLInputElement = HTML.input({ "checked": instrument.pitchEnvelopeInverse[envelopeIndex], type: "checkbox", style: "width: 1em; padding: 0.5em; margin-left: 4em;", id: "invertBox" })

			const startBoxWrapper: HTMLDivElement = HTML.div({ style: "flex: 1; display: flex; flex-direction: column; align-items: center" }, HTML.span({ class: "tip", style: `flex:1; height:1em; font-size: smaller;`, onclick: () => this._openPrompt("pitchRange") }, "Start: "), startNoteBox);
			const endBoxWrapper: HTMLDivElement = HTML.div({ style: "flex: 1; display: flex; flex-direction: column; align-items: center" }, HTML.span({ class: "tip", style: `flex:1; height:1em; font-size: smaller;`, onclick: () => this._openPrompt("pitchRange") }, "End: "), endNoteBox);

			const startNoteWrapper: HTMLDivElement = HTML.div({ style: "margin-top: 3px; flex:1; display:flex; flex-direction: row; align-items:center; justify-content:right;" }, startBoxWrapper, startNoteSlider.container);
			const endNoteWrapper: HTMLDivElement = HTML.div({ style: "margin-top: 3px; flex:1; display:flex; flex-direction: row; align-items:center; justify-content:right;" }, endBoxWrapper, endNoteSlider.container);
			const pitchInvertWrapper: HTMLDivElement = HTML.div({ style: "margin: 0.5em; align-items:center; justify-content:right;" }, HTML.span({ class: "tip", onclick: () => this._openPrompt("pitchInvert") }, "Invert: "), invertBox);

			const extraPitchSettingsDropdownGroup: HTMLDivElement = HTML.div({ class: "editor-controls", style: "flex-direction:column; align-items:center;" }, startNoteWrapper, endNoteWrapper, pitchInvertWrapper);
			extraPitchSettingsDropdownGroup.style.display = "none";
			const extraSettingsDropdown: HTMLButtonElement = HTML.button({ style: "margin-left:0em; margin-right: 0.3em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._extraSettingsDropdown(DropdownID.EnvelopeSettings, envelopeIndex, "pitch") }, "▼");
			extraSettingsDropdown.style.display = Config.envelopes[instrument.envelopes[envelopeIndex].envelope].name == "pitch" ? "inline" : "none";


			const row: HTMLDivElement = HTML.div({ class: "envelope-row" },
				extraSettingsDropdown,
				HTML.div({ class: "selectContainer", style: "width: 0; flex: 1;" }, targetSelect),
				//extraSettingsButton,
				HTML.div({ class: "selectContainer", style: "width: 0; flex: 0.85" }, envelopeSelect),
				deleteButton,
			);

			this.container.appendChild(row);
			this.container.appendChild(extraPitchSettingsDropdownGroup);
			this._rows[envelopeIndex] = row;
			this._targetSelects[envelopeIndex] = targetSelect;
			//this._extraSettingsDropdowns[envelopeIndex] = extraSettingsButton;
			this._envelopeSelects[envelopeIndex] = envelopeSelect;
			this._deleteButtons[envelopeIndex] = deleteButton;
			this._extraSettingsDropdowns[envelopeIndex] = extraSettingsDropdown;
			this._extraPitchSettingsDropdownGroups[envelopeIndex] = extraPitchSettingsDropdownGroup;
			this._pitchStartSliders[envelopeIndex] = startNoteSlider.input;
			this._pitchStartBoxes[envelopeIndex] = startNoteBox;
			this._pitchEndSliders[envelopeIndex] = endNoteSlider.input;
			this._pitchEndBoxes[envelopeIndex] = endNoteBox;
			this._pitchInverters[envelopeIndex] = invertBox;
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
		}

		this._renderedEnvelopeCount = instrument.envelopeCount;
		this._renderedEqFilterCount = instrument.eqFilter.controlPointCount;
		this._renderedNoteFilterCount = useControlPointCount;
		this._renderedInstrumentType = instrument.type;
		this._renderedEffects = instrument.effects;
	}
}