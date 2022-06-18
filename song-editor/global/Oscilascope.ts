import { ColorConfig } from "../editor/ColorConfig";
import { Synth } from "../synth/synth";
import { events } from "./events";

export class oscilascopeCanvas {
    public _EventUpdateCanvas:Function;

    constructor(public readonly canvas: HTMLCanvasElement, private readonly synth: Synth, private readonly scale:number = 1) {
        this._updateCanvas();
        this._EventUpdateCanvas = function(directlinkL: Float32Array, directlinkR ?: Float32Array): void {
            if(directlinkR) {
                var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

                ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = ColorConfig.getComputed("--primary-text");
                for (let i: number = directlinkL.length - 1; i >= directlinkL.length - 1 - (canvas.width/scale); i--) {
                    let x = i - (directlinkL.length - 1) + (canvas.width/scale);
                    let yl = (directlinkL[i] * (canvas.height/scale / 2) + (canvas.height/scale / 2));

                    ctx.fillRect((x - 1)*scale, (yl - 1)*scale, 1*scale, 1.5*scale);
                    if (x == 0) break;
                }
                ctx.fillStyle = ColorConfig.getComputed("--text-selection"); //less ctx style calls = less expensive??? also avoiding uncached colors
                for (let i: number = directlinkR.length - 1; i >= directlinkR.length - 1 - (canvas.width/scale); i--) {
                    let x = i - (directlinkR.length - 1) + (canvas.width/scale);
                    let yr = (directlinkR[i] * (canvas.height/scale / 2) + (canvas.height/scale / 2));
                    
                    ctx.fillRect((x - 1)*scale, (yr - 1)*scale, 1*scale, 1.5*scale);
                    if (x == 0) break;
                }
            }
        };
        events.listen("oscillascopeUpdate", this._EventUpdateCanvas);
    }

    public _updateCanvas(directlinkL?: Float32Array, directlinkR?: Float32Array): void {
        if (this.synth.copybroken) {
            return;
        }
        var arrays = this.synth.exposedBuffer;
        if (arrays[0] != undefined) {
            if (arrays[0].length >= this.canvas.width && this.synth.playing) {
                var ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

                ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                ctx.fillStyle = ColorConfig.getComputed("--primary-text");
                for (let i: number = arrays[0].length - 1; i >= arrays[0].length - 1 - (this.canvas.width/this.scale); i--) {
                    let x = i - (arrays[0].length - 1) + (this.canvas.width/this.scale);
                    let yl = (arrays[0][i] * (this.canvas.height/this.scale / 2) + (this.canvas.height/this.scale / 2));

                    ctx.fillRect((x - 1)*this.scale, (yl - 1)*this.scale, 1*this.scale, 1.5*this.scale);
                    if (x == 0) break;
                }
                ctx.fillStyle = ColorConfig.getComputed("--text-selection");
                for (let i: number = arrays[1].length - 1; i >= arrays[1].length - 1 - (this.canvas.width/this.scale); i--) {
                    let x = i - (arrays[1].length - 1) + (this.canvas.width/this.scale);
                    let yr = (arrays[1][i] * (this.canvas.height/this.scale / 2) + (this.canvas.height/this.scale / 2));

                    ctx.fillRect((x - 1)*this.scale, (yr - 1)*this.scale, 1*this.scale, 1.5*this.scale);
                    if (x == 0) break;
                }
            }
        }
    }
}
