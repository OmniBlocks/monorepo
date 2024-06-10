// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Config } from "../synth/SynthConfig";
import { AdditiveWave, Instrument } from "../synth/synth";
import { SongDocument } from "./SongDocument";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig";
import { ChangeAdditive } from "./changes";
import { prettyNumber } from "./EditorConfig";
import { Prompt } from "./Prompt";
import { SongEditor } from "./SongEditor";

export class AdditiveEditor {
    private readonly _editorWidth: number = 120;
    private readonly _editorHeight: number = 26;
    private readonly _octaves: SVGSVGElement = SVG.svg({ "pointer-events": "none" });
    private readonly _fifths: SVGSVGElement = SVG.svg({ "pointer-events": "none" });
    private readonly _curve: SVGPathElement = SVG.path({ fill: "none", stroke: "currentColor", "stroke-width": 2, "pointer-events": "none" });
    private readonly _lastControlPoints: SVGRectElement[] = [];
    private readonly _lastControlPointContainer: SVGSVGElement = SVG.svg({ "pointer-events": "none" });
    private readonly _svg: SVGSVGElement = SVG.svg({ style: "background-color: ${ColorConfig.editorBackground}; touch-action: none; cursor: crosshair;", width: "100%", height: "100%", viewBox: "0 0 " + this._editorWidth + " " + this._editorHeight, preserveAspectRatio: "none" },
        this._octaves,
        this._fifths,
        this._curve,
        this._lastControlPointContainer,
    );

    public readonly container: HTMLElement = HTML.div({ class: "additive", style: "height: 100%;" }, this._svg);

    private _mouseX: number = 0;
    private _mouseY: number = 0;
    private _freqPrev: number = 0;
    private _ampPrev: number = 0;
    private _mouseDown: boolean = false;
    public _change: ChangeAdditive | null = null;
    private _renderedPath: String = "";
    private _renderedFifths: boolean = true;

    private _instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
    private _initial: AdditiveWave = this._instrument.additiveWave;
    private _current: AdditiveWave = this._initial;

    constructor(private _doc: SongDocument) {
        for (let i: number = 1; i <= Config.additiveControlPoints; i = i * 2) {
            this._octaves.appendChild(SVG.rect({ fill: ColorConfig.tonic, x: (i - 0.5) * (this._editorWidth - 8) / (Config.additiveControlPoints - 1) - 1, y: 0, width: 2, height: this._editorHeight }));
        }
        for (let i: number = 3; i <= Config.additiveControlPoints; i = i * 2) {
            this._fifths.appendChild(SVG.rect({ fill: ColorConfig.fifthNote, x: (i - 0.5) * (this._editorWidth - 8) / (Config.additiveControlPoints - 1) - 1, y: 0, width: 2, height: this._editorHeight }));
        }
        for (let i: number = 0; i < 4; i++) {
            const rect: SVGRectElement = SVG.rect({ fill: "currentColor", x: (this._editorWidth - i * 2 - 1), y: 0, width: 1, height: this._editorHeight });
            this._lastControlPoints.push(rect);
            this._lastControlPointContainer.appendChild(rect);
        }

        this.container.addEventListener("mousedown", this._whenMousePressed);
        document.addEventListener("mousemove", this._whenMouseMoved);
        document.addEventListener("mouseup", this._whenCursorReleased);

        this.container.addEventListener("touchstart", this._whenTouchPressed);
        this.container.addEventListener("touchmove", this._whenTouchMoved);
        this.container.addEventListener("touchend", this._whenCursorReleased);
        this.container.addEventListener("touchcancel", this._whenCursorReleased);
    }

    private _xToFreq(x: number): number {
        return (Config.additiveControlPoints - 1) * x / (this._editorWidth - 8) - 0.5;
    }

    private _yToAmp(y: number): number {
        return Config.additiveMax * (1 - y / this._editorHeight);
    }

    private _whenMousePressed = (event: MouseEvent): void => {
        event.preventDefault();
        this._mouseDown = true;
        const boundingRect: ClientRect = this._svg.getBoundingClientRect();
        this._mouseX = ((event.clientX || event.pageX) - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
        this._mouseY = ((event.clientY || event.pageY) - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
        if (isNaN(this._mouseX)) this._mouseX = 0;
        if (isNaN(this._mouseY)) this._mouseY = 0;

        this._freqPrev = this._xToFreq(this._mouseX);
        this._ampPrev = this._yToAmp(this._mouseY);
        this._whenCursorMoved();
    }

    private _whenTouchPressed = (event: TouchEvent): void => {
        event.preventDefault();
        this._mouseDown = true;
        const boundingRect: ClientRect = this._svg.getBoundingClientRect();
        this._mouseX = (event.touches[0].clientX - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
        this._mouseY = (event.touches[0].clientY - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
        if (isNaN(this._mouseX)) this._mouseX = 0;
        if (isNaN(this._mouseY)) this._mouseY = 0;

        this._freqPrev = this._xToFreq(this._mouseX);
        this._ampPrev = this._yToAmp(this._mouseY);
        this._whenCursorMoved();
    }

    private _whenMouseMoved = (event: MouseEvent): void => {
        if (this.container.offsetParent == null) return;
        const boundingRect: ClientRect = this._svg.getBoundingClientRect();
        this._mouseX = ((event.clientX || event.pageX) - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
        this._mouseY = ((event.clientY || event.pageY) - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
        if (isNaN(this._mouseX)) this._mouseX = 0;
        if (isNaN(this._mouseY)) this._mouseY = 0;
        this._whenCursorMoved();
    }

    private _whenTouchMoved = (event: TouchEvent): void => {
        if (this.container.offsetParent == null) return;
        if (!this._mouseDown) return;
        event.preventDefault();
        const boundingRect: ClientRect = this._svg.getBoundingClientRect();
        this._mouseX = (event.touches[0].clientX - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
        this._mouseY = (event.touches[0].clientY - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
        if (isNaN(this._mouseX)) this._mouseX = 0;
        if (isNaN(this._mouseY)) this._mouseY = 0;
        this._whenCursorMoved();
    }

    private _whenCursorMoved(): void {
        if (this._mouseDown) {
            const freq: number = this._xToFreq(this._mouseX);
            const amp: number = this._yToAmp(this._mouseY);

            this._updateAdditive(freq, amp);
            this._doc.setProspectiveChange(this._change!);
        }
    }

    private _updateAdditive(freq: number, amp: number) {
        const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];

        if (freq != this._freqPrev) {
            const slope: number = (amp - this._ampPrev) / (freq - this._freqPrev);
            const offset: number = this._ampPrev - this._freqPrev * slope;
            const lowerFreq: number = Math.ceil(Math.min(this._freqPrev, freq));
            const upperFreq: number = Math.floor(Math.max(this._freqPrev, freq));
            for (let i: number = lowerFreq; i <= upperFreq; i++) {
                if (i < 0 || i >= Config.additiveControlPoints) continue;
                this._current.additives[i] = Math.max(0, Math.min(Config.additiveMax, Math.round(i * slope + offset)));
            }
        }

        this._current.additives[Math.max(0, Math.min(Config.additiveControlPoints - 1, Math.round(freq)))] = Math.max(0, Math.min(Config.additiveMax, Math.round(amp)));

        this._freqPrev = freq;
        this._ampPrev = amp;

        this._change = new ChangeAdditive(this._doc, instrument, this._current);
    }

    public getAddditiveWave(): AdditiveWave {
        return this._current;
    }

    public setAdditiveWave(additive: AdditiveWave) {
        const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        this._current = additive;
        this._doc.record(new ChangeAdditive(this._doc, instrument, this._current));
        this.render();
    }

    private _whenCursorReleased = (event: Event): void => {
        if (this._mouseDown) {
            this._doc.record(this._change!);
            this._change = null;
        }
        this._mouseDown = false;
    }

    public saveSettings() {
        const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        this._doc.record(new ChangeAdditive(this._doc, instrument, this._current));
    }

    public resetToInitial() {
        const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        this._doc.record(new ChangeAdditive(this._doc, instrument, this._initial));
    }

    public rerenderWave() {
        this._instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        this._initial = this._instrument.additiveWave;
        this._current = this._initial;
        this.render();
    }

    public render(): void {
        const instrument: Instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        const additiveWave: AdditiveWave = instrument.additiveWave; 
        const controlPointToHeight = (point: number): number => {
            return (1 - (point / Config.additiveMax)) * this._editorHeight;
        }

        let bottom: string = prettyNumber(this._editorHeight);
        let path: string = "";
        for (let i: number = 0; i < Config.additiveControlPoints - 1; i++) {
            if (additiveWave.additives[i] == 0) continue;
            let xPos: string = prettyNumber((i + 0.5) * (this._editorWidth - 8) / (Config.additiveControlPoints - 1));
            path += "M " + xPos + " " + bottom + " ";
            path += "L " + xPos + " " + prettyNumber(controlPointToHeight(additiveWave.additives[i])) + " ";
        }

        const lastHeight: number = controlPointToHeight(additiveWave.additives[Config.additiveControlPoints - 1]);
        for (let i: number = 0; i < 4; i++) {
            const rect: SVGRectElement = this._lastControlPoints[i];
            rect.setAttribute("y", prettyNumber(lastHeight));
            rect.setAttribute("height", prettyNumber(this._editorHeight - lastHeight));
        }

        if (this._renderedPath != path) {
            this._renderedPath = path;
            this._curve.setAttribute("d", path);
        }
        if (this._renderedFifths != this._doc.prefs.showFifth) {
            this._renderedFifths = this._doc.prefs.showFifth;
            this._fifths.style.display = this._doc.prefs.showFifth ? "" : "none";
        }
    }
}

export class AdditiveEditorPrompt implements Prompt {

    public readonly additiveEditor: AdditiveEditor = new AdditiveEditor(this._doc);

    public readonly _playButton: HTMLButtonElement = HTML.button({ style: "width: 55%;", type: "button" });

    private readonly _cancelButton: HTMLButtonElement = HTML.button({ class: "cancelButton" });
    private readonly _okayButton: HTMLButtonElement = HTML.button({ class: "okayButton", style: "width:45%;" }, "Okay");

    private readonly copyButton: HTMLButtonElement = HTML.button({ style: "width:86px; margin-right: 5px;", class: "copyButton" }, [
        "Copy",
        // Copy icon:
        SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 50%; margin-top: -1em; pointer-events: none;", width: "2em", height: "2em", viewBox: "-5 -21 26 26" }, [
            SVG.path({ d: "M 0 -15 L 1 -15 L 1 0 L 13 0 L 13 1 L 0 1 L 0 -15 z M 2 -1 L 2 -17 L 10 -17 L 14 -13 L 14 -1 z M 3 -2 L 13 -2 L 13 -12 L 9 -12 L 9 -16 L 3 -16 z", fill: "currentColor" }),
        ]),
    ]);
    private readonly pasteButton: HTMLButtonElement = HTML.button({ style: "width:86px;", class: "pasteButton" }, [
        "Paste",
        // Paste icon:
        SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 50%; margin-top: -1em; pointer-events: none;", width: "2em", height: "2em", viewBox: "0 0 26 26" }, [
            SVG.path({ d: "M 8 18 L 6 18 L 6 5 L 17 5 L 17 7 M 9 8 L 16 8 L 20 12 L 20 22 L 9 22 z", stroke: "currentColor", fill: "none" }),
            SVG.path({ d: "M 9 3 L 14 3 L 14 6 L 9 6 L 9 3 z M 16 8 L 20 12 L 16 12 L 16 8 z", fill: "currentColor", }),
        ]),
    ]);
    private readonly copyPasteContainer: HTMLDivElement = HTML.div({ style: "width: 185px;" }, this.copyButton, this.pasteButton);
    public readonly container: HTMLDivElement = HTML.div({ class: "prompt noSelection", style: "width: 800px; height: 500px" },
        HTML.h2("Edit Additive Instrument"),
        HTML.div({ style: "display: flex; width: 55%; align-self: center; flex-direction: row; align-items: center; justify-content: center;" },
            this._playButton,
        ),
        HTML.div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: center; height: 80%" },
            this.additiveEditor.container,
        ),
        HTML.div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
            this._okayButton,
            this.copyPasteContainer,
        ),
        this._cancelButton,
    );

    constructor(private _doc: SongDocument, private _songEditor: SongEditor) {
        this._okayButton.addEventListener("click", this._saveChanges);
        this._cancelButton.addEventListener("click", this._close);
        this.container.addEventListener("keydown", this.whenKeyPressed);
        this.copyButton.addEventListener("click", this._copySettings);
        this.pasteButton.addEventListener("click", this._pasteSettings);
        this._playButton.addEventListener("click", this._togglePlay);
        this.additiveEditor.container.addEventListener("mousemove", () => this.additiveEditor.render());
        this.container.addEventListener("mousemove", () => this.additiveEditor.render());
        this.container.addEventListener("mousedown", () => this.additiveEditor.render());
        this.updatePlayButton();

        setTimeout(() => this._playButton.focus());

        this.additiveEditor.render();
    }

    private _togglePlay = (): void => {
        this._songEditor.togglePlay();
        this.updatePlayButton();
    }

    public updatePlayButton(): void {
        if (this._doc.synth.playing) {
            this._playButton.classList.remove("playButton");
            this._playButton.classList.add("pauseButton");
            this._playButton.title = "Pause (Space)";
            this._playButton.innerText = "Pause";
        } else {
            this._playButton.classList.remove("pauseButton");
            this._playButton.classList.add("playButton");
            this._playButton.title = "Play (Space)";
            this._playButton.innerText = "Play";
        }
    }

    private _close = (): void => {
        this._doc.prompt = null;
        this.additiveEditor.resetToInitial();
    }

    public cleanUp = (): void => {
        this._okayButton.removeEventListener("click", this._saveChanges);
        this._cancelButton.removeEventListener("click", this._close);
        this.container.removeEventListener("keydown", this.whenKeyPressed);
        this.additiveEditor.container.removeEventListener("mousemove", () => this.additiveEditor.render());
        this._playButton.removeEventListener("click", this._togglePlay);
    }

    private _copySettings = (): void => {
        const additiveCopy: AdditiveWave = this.additiveEditor.getAddditiveWave();
        window.localStorage.setItem("additiveCopy", JSON.stringify({
            "additives": additiveCopy.additives,
            "waveTypes": additiveCopy.waveTypes
        }));
    }

    private _pasteSettings = (): void => {
        const storedAdditiveWave: any = JSON.parse(String(window.localStorage.getItem("additiveCopy")));
        const parsedAdditive: AdditiveWave = new AdditiveWave;
        for (let i: number = 0; i < Config.additiveControlPoints; i++) {
            parsedAdditive.additives[i] = storedAdditiveWave["additives"][i];
            parsedAdditive.waveTypes[i] = storedAdditiveWave["waveTypes"][i];
        }
        this.additiveEditor.setAdditiveWave(parsedAdditive);
    }

    public whenKeyPressed = (event: KeyboardEvent): void => {
        if ((<Element>event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
            this._saveChanges();
        }
        else if (event.keyCode == 32) {
            this._togglePlay();
            event.preventDefault();
        }
        // else if (event.keyCode == 90) { // z
        //     this.additiveEditor.undo();
        //     event.stopPropagation();
        // }
        // else if (event.keyCode == 89) { // y
        //     this.additiveEditor.redo();
        //     event.stopPropagation();
        // }
        else if (event.keyCode == 219) { // [
            this._doc.synth.goToPrevBar();
        }
        else if (event.keyCode == 221) { // ]
            this._doc.synth.goToNextBar();
        }
    }

    private _saveChanges = (): void => {
        this._doc.prompt = null;
        // Save again just in case
        this.additiveEditor.saveSettings();
    }
}