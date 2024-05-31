// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { InstrumentType, Config } from "../synth/SynthConfig";
import { Instrument } from "../synth/synth";
import { SongDocument } from "./SongDocument";
import { ChangeSetEnvelopeTarget, ChangeSetEnvelopeType, ChangeRemoveEnvelope, ChangeEnvelopePitchStart, ChangeEnvelopePitchEnd, ChangeEnvelopeInverse } from "./changes";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { DropdownID } from "../synth/SynthConfig";

export class EnvelopeEditor {
	public readonly container: HTMLElement = HTML.div({ class: "envelopeEditor" });

	private readonly _rows: HTMLDivElement[] = [];
	private readonly _targetSelects: HTMLSelectElement[] = [];
	private readonly _envelopeSelects: HTMLSelectElement[] = [];
	private readonly _deleteButtons: HTMLButtonElement[] = [];
	public readonly _extraSettingsDropdowns: HTMLButtonElement[] = []; //need to be accessed in SongEditor to function
	public readonly _extraPitchSettingsGroups: HTMLDivElement[] = [];
	public readonly _extraSettingsDropdownGroups: HTMLDivElement[] = [];
	public readonly _openExtraSettingsDropdowns: Boolean[] = [];
	private readonly _pitchStartSliders: HTMLInputElement[] = [];
	public readonly _pitchStartBoxes: HTMLInputElement[] = [];
	private readonly _pitchEndSliders: HTMLInputElement[] = [];
	public readonly _pitchEndBoxes: HTMLInputElement[] = [];
	private readonly _inverters: HTMLInputElement[] = [];
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
		const inverterIndex: number = this._inverters.indexOf(<any>event.target);
		if (targetSelectIndex != -1) {
			const combinedValue: number = parseInt(this._targetSelects[targetSelectIndex].value);
			const target: number = combinedValue % Config.instrumentAutomationTargets.length;
			const index: number = (combinedValue / Config.instrumentAutomationTargets.length) >>> 0;
			this._doc.record(new ChangeSetEnvelopeTarget(this._doc, targetSelectIndex, target, index));
		} else if (envelopeSelectIndex != -1) {
			this._doc.record(new ChangeSetEnvelopeType(this._doc, envelopeSelectIndex, this._envelopeSelects[envelopeSelectIndex].selectedIndex));

			this._extraSettingsDropdowns[envelopeSelectIndex].style.display = Config.envelopes[this._envelopeSelects[envelopeSelectIndex].selectedIndex].name == "pitch" ? "inline" : "none";
			this._extraPitchSettingsGroups[envelopeSelectIndex].style.display = Config.envelopes[this._envelopeSelects[envelopeSelectIndex].selectedIndex].name == "pitch" ? "" : "none";
		} else if (inverterIndex != -1) {
			this._doc.record(new ChangeEnvelopeInverse(this._doc, this._inverters[inverterIndex].checked, inverterIndex));
		}
	}

	private _onClick = (event: MouseEvent): void => {
		const index: number = this._deleteButtons.indexOf(<any>event.target);
		if (index != -1) {
			this._doc.record(new ChangeRemoveEnvelope(this._doc, index));
			this._extraSettingsDropdownGroups[index].style.display = "none";
		}
	}

	private _onInput = (event: Event): void => {
		const startBoxIndex: number = this._pitchStartBoxes.indexOf(<any>event.target);
		const endBoxIndex: number = this._pitchEndBoxes.indexOf(<any>event.target);
		const startSliderIndex: number = this._pitchStartSliders.indexOf(<any>event.target);
		const endSliderIndex: number = this._pitchEndSliders.indexOf(<any>event.target);
		if (startBoxIndex != -1) {
			this._doc.record(new ChangeEnvelopePitchStart(this._doc, parseInt(this._pitchStartBoxes[startBoxIndex].value), startBoxIndex));
		} else if (endBoxIndex != -1) {
			this._doc.record(new ChangeEnvelopePitchEnd(this._doc, parseInt(this._pitchEndBoxes[endBoxIndex].value), endBoxIndex));
		} else if (startSliderIndex != -1) {
			this._doc.record(new ChangeEnvelopePitchStart(this._doc, parseInt(this._pitchStartSliders[startSliderIndex].value), startSliderIndex));
		} else if (endSliderIndex != -1) {
			this._doc.record(new ChangeEnvelopePitchEnd(this._doc, parseInt(this._pitchEndSliders[endSliderIndex].value), endSliderIndex));
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
		for (let i = 0; i < Config.maxEnvelopeCount; i++) {
			if (i >= instrument.envelopeCount) {
				if (this._extraSettingsDropdowns[i]) { //make sure is not null so that we don't get an error
					this._extraSettingsDropdowns[i].style.display = "none";
				}
				if (this._extraSettingsDropdownGroups[i]) {
					this._extraSettingsDropdownGroups[i].style.display = "none";
				}
				if (this._extraPitchSettingsGroups[i]) {
					this._extraPitchSettingsGroups[i].style.display = "none";
				}
			} else if (this._extraSettingsDropdowns[i].textContent == "▲") {
				this._extraSettingsDropdownGroups[i].style.display = "flex";
				this._extraSettingsDropdowns[i].style.display = "inline";
				if (Config.envelopes[instrument.envelopes[i].envelope].name == "pitch") {
					this._extraPitchSettingsGroups[i].style.display = "flex";
					this._pitchStartBoxes[i].value = instrument.pitchEnvelopeStart[i].toString();
					this._pitchEndBoxes[i].value = instrument.pitchEnvelopeEnd[i].toString();
				} else {
					this._extraPitchSettingsGroups[i].style.display = "none";
				}
				this._inverters[i].checked = instrument.envelopeInverse[i];
			} else if (this._extraSettingsDropdowns[i].textContent == "▼") {
				this._extraSettingsDropdownGroups[i].style.display = "none";
				this._extraPitchSettingsGroups[i].style.display = "none";
				this._extraSettingsDropdowns[i].style.display = "inline";
			} else {
				this._extraSettingsDropdowns[i].style.display = "none";
				this._extraSettingsDropdownGroups[i].style.display = "none";
				this._extraPitchSettingsGroups[i].style.display = "none";
			}
		}
	}

	public render(): void {
		let instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];

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
			instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
			const startNoteSlider: HTMLInputElement = HTML.input({ value: instrument.pitchEnvelopeStart[envelopeIndex] ? instrument.pitchEnvelopeStart[envelopeIndex] : 0, style: "width: 9em; margin-left: 1em;", type: "range", min: "0", max: instrument.isNoiseInstrument ? 11 : 96, step: "1" });
			const startNoteBox: HTMLInputElement = HTML.input({ value: instrument.pitchEnvelopeStart[envelopeIndex] ? instrument.pitchEnvelopeStart[envelopeIndex] : 0, style: "width: 4em; font-size: 80%; ", id: "startNoteBox", type: "number", step: "1", min: "0", max: instrument.isNoiseInstrument ? 11 : 96 });

			const endNoteSlider: HTMLInputElement = HTML.input({ value: instrument.pitchEnvelopeEnd[envelopeIndex] ? instrument.pitchEnvelopeEnd[envelopeIndex] : instrument.isNoiseInstrument ? 11 : 96, style: "width: 9em; margin-left: 1em;", type: "range", min: "0", max: instrument.isNoiseInstrument ? 11 : 96, step: "1" });
			const endNoteBox: HTMLInputElement = HTML.input({ value: instrument.pitchEnvelopeEnd[envelopeIndex] ? instrument.pitchEnvelopeEnd[envelopeIndex] : instrument.isNoiseInstrument ? 11 : 96, style: "width: 4em; font-size: 80%; ", id: "endNoteBox", type: "number", step: "1", min: "0", max: instrument.isNoiseInstrument ? 11 : 96 });

			const invertBox: HTMLInputElement = HTML.input({ "checked": instrument.envelopeInverse[envelopeIndex], type: "checkbox", style: "width: 1em; padding: 0.5em; margin-left: 4em;", id: "invertBox" });

			const startBoxWrapper: HTMLDivElement = HTML.div({ style: "flex: 1; display: flex; flex-direction: column; align-items: center" }, HTML.span({ class: "tip", style: `flex:1; height:1em; font-size: smaller;`, onclick: () => this._openPrompt("pitchRange") }, "Start: "), startNoteBox);
			const endBoxWrapper: HTMLDivElement = HTML.div({ style: "flex: 1; display: flex; flex-direction: column; align-items: center" }, HTML.span({ class: "tip", style: `flex:1; height:1em; font-size: smaller;`, onclick: () => this._openPrompt("pitchRange") }, "End: "), endNoteBox);

			const startNoteWrapper: HTMLDivElement = HTML.div({ style: "margin-top: 3px; flex:1; display:flex; flex-direction: row; align-items:center; justify-content:right;" }, startBoxWrapper, startNoteSlider);
			const endNoteWrapper: HTMLDivElement = HTML.div({ style: "margin-top: 3px; flex:1; display:flex; flex-direction: row; align-items:center; justify-content:right;" }, endBoxWrapper, endNoteSlider);
			const invertWrapper: HTMLDivElement = HTML.div({ style: "margin: 0.5em; align-items:center; justify-content:right;" }, HTML.span({ class: "tip", onclick: () => this._openPrompt("pitchInvert") }, "Invert: "), invertBox);

			const extraPitchSettingsGroup: HTMLDivElement = HTML.div({ class: "editor-controls", style: "flex-direction:column; align-items:center;" }, startNoteWrapper, endNoteWrapper);
			extraPitchSettingsGroup.style.display = "none";
			const extraSettingsDropdown: HTMLButtonElement = HTML.button({ style: "margin-left:0em; margin-right: 0.3em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._extraSettingsDropdown(DropdownID.EnvelopeSettings, envelopeIndex, Config.envelopes[instrument.envelopes[envelopeIndex].envelope].name) }, "▼");
			extraSettingsDropdown.style.display = "inline";

			//const extraNoteSizeSettingsDropdownGroup: HTMLDivElement = HTML.div({ class: "editor-controls", style: "flex-direction:row; align-items:center;" }, HTML.span({ class: "tip", onclick: () => this._openPrompt("noteSizeInvert") }, "Invert: "), noteSizeInvertBox);
			//extraNoteSizeSettingsDropdownGroup.style.display = "none";

			const extraSettingsDropdownGroup: HTMLDivElement = HTML.div({ class: "editor-controls", style: "flex-direction:column; align-items:center;" }, extraPitchSettingsGroup, invertWrapper);
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
			this._extraSettingsDropdowns[envelopeIndex] = extraSettingsDropdown;
			this._extraSettingsDropdownGroups[envelopeIndex] = extraSettingsDropdownGroup;
			this._extraPitchSettingsGroups[envelopeIndex] = extraPitchSettingsGroup;
			this._pitchStartSliders[envelopeIndex] = startNoteSlider;
			this._pitchStartBoxes[envelopeIndex] = startNoteBox;
			this._pitchEndSliders[envelopeIndex] = endNoteSlider;
			this._pitchEndBoxes[envelopeIndex] = endNoteBox;
			this._inverters[envelopeIndex] = invertBox;
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
			this._pitchStartBoxes[envelopeIndex].value = String(instrument.pitchEnvelopeStart[envelopeIndex]);
			this._pitchEndBoxes[envelopeIndex].value = String(instrument.pitchEnvelopeEnd[envelopeIndex]);
			this._pitchStartSliders[envelopeIndex].value = String(instrument.pitchEnvelopeStart[envelopeIndex]);
			this._pitchEndSliders[envelopeIndex].value = String(instrument.pitchEnvelopeEnd[envelopeIndex]);
		}

		this._renderedEnvelopeCount = instrument.envelopeCount;
		this._renderedEqFilterCount = instrument.eqFilter.controlPointCount;
		this._renderedNoteFilterCount = useControlPointCount;
		this._renderedInstrumentType = instrument.type;
		this._renderedEffects = instrument.effects;
	}
}