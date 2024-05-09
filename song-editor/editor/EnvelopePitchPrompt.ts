// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

//I'm pretty sure that Config doesn't need to be used here...
//import { Config } from "../synth/SynthConfig";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { ChangeGroup } from "./Change";
import { ChangeEnvelopePitchStart, ChangeEnvelopePitchEnd, ChangeEnvelopeInverse } from "./changes";
import { Slider } from "./HTMLWrapper";
import { Instrument } from "../synth/synth";

const { button, div, h2, input, span, p } = HTML;

export class EnvelopePitchPrompt implements Prompt {
    private readonly instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];  

    private readonly _startNote: Slider = new Slider(input({ value: this.instrument.pitchEnvelopeStart, style: "width: 3em; margin-left: 1em;", type: "range", min: "0", max: this.instrument.isNoiseInstrument ? 11 : 96, step: "1" }), this._doc, null, false);
    private readonly _startNoteBox: HTMLInputElement = input({ value: this.instrument.pitchEnvelopeStart, style: "width: 4em; font-size: 80%; ", id: "startNoteBox", type: "number", step: "1", min: "0", max: this.instrument.isNoiseInstrument ? 11 : 96 });

    private readonly _endNote: Slider = new Slider(input({ value: this.instrument.pitchEnvelopeEnd, style: "width: 3em; margin-left: 1em;", type: "range", min: "0", max: this.instrument.isNoiseInstrument ? 11 : 96, step: "1" }), this._doc, null, false);
    private readonly _endNoteBox: HTMLInputElement = input({ value: this.instrument.pitchEnvelopeEnd, style: "width: 4em; font-size: 80%; ", id: "endNoteBox", type: "number", step: "1", min: "0", max: this.instrument.isNoiseInstrument ? 11 : 96 });

    private readonly _invertBox: HTMLInputElement = input({ "checked": this.instrument.pitchEnvelopeInverse, type: "checkbox", style: "width: 1em; padding: 0; margin-right: 4em;", id:"invertBox" })
    
    private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
    private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, "Okay");  

    public container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 250px;" });


    //private _currentStartNote: number = 0;
    constructor(private _doc: SongDocument) {
        //Create HTML structure
        let pitchEnvelopeEditorWrapper: HTMLDivElement = div({});
        let startNoteWrapper: HTMLDivElement = div({});
        let endNoteWrapper: HTMLDivElement = div({});
        let pitchInvertWrapper: HTMLDivElement = div({});
        startNoteWrapper.appendChild(span("Start note: "));
        startNoteWrapper.appendChild(this._startNoteBox);
        startNoteWrapper.appendChild(this._startNote.container);
        endNoteWrapper.appendChild(span("End note: "));
        endNoteWrapper.appendChild(this._endNoteBox);
        endNoteWrapper.appendChild(this._endNote.container);
        pitchInvertWrapper.appendChild(span("Invert direction: "));
        pitchInvertWrapper.appendChild(this._invertBox);
        pitchEnvelopeEditorWrapper.appendChild(startNoteWrapper);
        pitchEnvelopeEditorWrapper.appendChild(endNoteWrapper);
        pitchEnvelopeEditorWrapper.appendChild(pitchInvertWrapper);

        //Save and close buttons receive their onCLick functionality
        this._okayButton.addEventListener("click", this._saveChanges);
        this._cancelButton.addEventListener("click", this._close);

        //The main prompt container
        this.container = div({ class: "prompt noSelection", style: "width: 350px" },
            h2("Pitch Envelope Boundaries"),
            p("Here you can adjust the start and end of where the pitch envelope affects. Everything below start envelope will be 0, everything above end envelope will be 1, and everything inbetween will scale based on pitch."),
            p("Additionally, you can decide to invert which direction increases the value. So instead of a higher pitch leading to a higher value, a lower pitch can lead to a higher value."),

            div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: flex-end;" },
                pitchEnvelopeEditorWrapper,
            ),
            div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
                this._okayButton,
            ),
            this._cancelButton,
        )
        //Save when enter is pressed
        this.container.addEventListener("keydown", this.whenKeyPressed);

        //bind box and slider
        this._startNoteBox.addEventListener("input", this._matchStartSliderToBox);
        this._startNote.input.addEventListener("input", this._matchStartBoxToSlider);
        this._endNoteBox.addEventListener("input", this._matchEndSliderToBox);
        this._endNote.input.addEventListener("input", this._matchEndBoxToSlider);
    }

    private _matchStartSliderToBox = (): void => {
        this._startNote.updateValue(parseInt(this._startNoteBox.value));
    }

    private _matchStartBoxToSlider = (): void => {
        this._startNoteBox.value = this._startNote.input.value;
    }

    private _matchEndSliderToBox = (): void => {
        this._endNote.updateValue(parseInt(this._endNoteBox.value));
    }

    private _matchEndBoxToSlider = (): void => {
        this._endNoteBox.value = this._endNote.input.value;
    }

    private _close = (): void => {
        this._doc.undo();
    }

    public cleanUp = (): void => {
        this._okayButton.removeEventListener("click", this._saveChanges);
        this._cancelButton.removeEventListener("click", this._close);
        this.container.removeEventListener("keydown", this.whenKeyPressed);
    }

    public whenKeyPressed = (event: KeyboardEvent): void => {
        if ((<Element>event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
            this._saveChanges();
        }
    }

    //Save changes...
    private _saveChanges = (): void => {
        const group: ChangeGroup = new ChangeGroup();
        group.append(new ChangeEnvelopePitchStart(this._doc, parseInt(this._startNoteBox.value)));
        group.append(new ChangeEnvelopePitchEnd(this._doc, parseInt(this._endNoteBox.value)));
        group.append(new ChangeEnvelopeInverse(this._doc, this._invertBox.checked));
        this._doc.prompt = null;
        this._doc.record(group, true);
    }
}