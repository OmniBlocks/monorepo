import { EditorConfig } from "./EditorConfig";
import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { HTML } from "imperative-html/dist/esm/elements-strict";
const { div, p, br, h2, button } = HTML;

export class AddExternalPrompt implements Prompt {
    private readonly externalSamples = HTML.textarea({
        style: "resize: none; word-break: break-all;", rows:"8", cols:"32", type: "text", placeholder: "https://example.com/file1.wav!48|https://example.com/file2.ogg,12430.8|https://example.com/file3.mp3@"
    });

    private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%; display:block" }, "Okay");

    private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });

    public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "padding-left:25px; width: 250px; display:inline-block; text-align:left" }, h2({ style: "text-align:left; margin:0px; padding:0px"} , "Add Samples"), div({ style: "display: inline-block; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" }, div({ style: "text-align: left" },
        p("Enter the full url of the sample you'd like to use. Add \" | \" (no spaces) to the very end of a sample url to separate samples. There should be NO SPACES anywhere within this prompt"),
        p("You can set a root key of a sample by adding an exclamation mark followed by the pitch represented in numerical form (ex. C4 is 60) to the end of a sample url. By default, samples are tuned to C4."),
        p("You may  also specify the sample rate by adding a comma followed by the sample rate to the end of a sample url."),
        "Additionally, you can designate a sample as percussion (doesn't change pitch with key) by adding \"@\" to the end of the sample url:",
        br(), this.externalSamples),div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" }, this._cancelButton)));

    constructor(private _doc: SongDocument) {
        if(EditorConfig.customSamples !== undefined) {
            this.externalSamples.value = EditorConfig.customSamples.join("|");
        }
        this.externalSamples.select();
        setTimeout(() => this.externalSamples.focus());
        this._okayButton.addEventListener("click", this._saveChanges);
        this._cancelButton.addEventListener("click", this._close);
     
        this.container.addEventListener("keydown", this._whenKeyPressed);
    }

    public cleanUp = (): void => {
        this._okayButton.removeEventListener("click", this._saveChanges);
        this._cancelButton.removeEventListener("click", this._close);
        this.container.removeEventListener("keydown", this._whenKeyPressed);
    }

    private _whenKeyPressed = (event: KeyboardEvent): void => {
        if ((<Element>event.target).tagName != "BUTTON" && event.keyCode == 13 && !event.shiftKey) {
            this._saveChanges();
        }
    }

    private _close = (): void => {
        this._saveChanges();
    }

    private _saveChanges = (): void => {
        var externalVal: string = "";
        if (this.externalSamples.value != "") {
            externalVal = "|" + this.externalSamples.value;
            externalVal = externalVal.replace(/\s+/g, '');
        }
        this._doc.prompt = null;
        
        this._doc.undo();
        if (externalVal.split("|").length > 64) {
            window.alert("Hey there, you can only have 64 samples in a song. Try removing samples that aren't in use. ")
            return;
        }
       EditorConfig.customSamples = externalVal.split("|").filter(x => x !== "");
       window.location.hash = this._doc.song.toBase64String();
        // window.location.hash = this._doc.song.toBase64String().split("|")[0] + externalVal;
       location.reload();
        
    }
}
	//samplemark
