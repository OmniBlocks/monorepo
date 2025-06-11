import { ColorConfig } from "../editor/ColorConfig";
import { events } from "./Events";
export class oscilloscopeCanvas {
    constructor(canvas, scale = 1) {
        this.canvas = canvas;
        this.scale = scale;
        this._EventUpdateCanvas = function (directlinkL, directlinkR) {
            if (directlinkR) {
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = ColorConfig.getComputed("--oscilloscope-line-L");
                for (let i = directlinkL.length - 1; i >= directlinkL.length - 1 - (canvas.width / scale); i--) {
                    let x = i - (directlinkL.length - 1) + (canvas.width / scale);
                    let yl = (directlinkL[i] * (canvas.height / scale / 2) + (canvas.height / scale / 2));
                    ctx.fillRect((x - 1) * scale, (yl - 1) * scale, 1 * scale, 1.5 * scale);
                    if (x == 0)
                        break;
                }
                ctx.fillStyle = ColorConfig.getComputed("--oscilloscope-line-R");
                for (let i = directlinkR.length - 1; i >= directlinkR.length - 1 - (canvas.width / scale); i--) {
                    let x = i - (directlinkR.length - 1) + (canvas.width / scale);
                    let yr = (directlinkR[i] * (canvas.height / scale / 2) + (canvas.height / scale / 2));
                    ctx.fillRect((x - 1) * scale, (yr - 1) * scale, 1 * scale, 1.5 * scale);
                    if (x == 0)
                        break;
                }
            }
        };
        events.listen("oscilloscopeUpdate", this._EventUpdateCanvas);
    }
}
//# sourceMappingURL=Oscilloscope.js.map