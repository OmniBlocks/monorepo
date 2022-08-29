import paper from '@scratch/paper';
import {getRaster, getGuideLayer, createCanvas} from '../layer';
import {doesColorRequireMask, forEachLinePoint, getBrushMark} from '../bitmap';

/**
 * Tool for drawing with the bitmap brush and eraser
 */
class BrushTool extends paper.Tool {
    /**
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     * @param {boolean} isEraser True if brush should erase
     */
    constructor (onUpdateImage, isEraser) {
        super();
        this.onUpdateImage = onUpdateImage;
        this.isEraser = isEraser;

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDown = this.handleMouseDown;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;

        this.colorState = null;
        this.active = false;
        this.lastPoint = null;
        this.cursorPreview = null;
        this.drawTarget = null;
        this.maskTarget = null;
        this.maskBrush = null;
    }
    setColor (color) {
        this.color = color;
        this.tmpCanvas = getBrushMark(this.size, this.color, this.isEraser || !this.color);
    }
    setBrushSize (size) {
        // For performance, make sure this is an integer
        this.size = Math.max(1, ~~size);
        this.tmpCanvas = getBrushMark(this.size, this.color, this.isEraser || !this.color);
    }
    drawNextLine (previousPoint, nextPoint) {
        const roundedUpRadius = Math.ceil(this.size / 2);
        const context = this.maskTarget || this.drawTarget.getContext('2d');
        if (this.isEraser || !this.color) {
            context.globalCompositeOperation = 'destination-out';
        }
        forEachLinePoint(previousPoint, nextPoint, (x, y) => {
            context.drawImage(this.maskBrush || this.tmpCanvas, ~~x - roundedUpRadius, ~~y - roundedUpRadius);
        });
        if (this.isEraser || !this.color) {
            context.globalCompositeOperation = 'source-over';
        }
        if (this.maskTarget) {
            const drawContext = this.drawTarget.getContext('2d');
            const {width, height} = drawContext.canvas;
            drawContext.globalCompositeOperation = 'source-over';
            drawContext.drawImage(this.maskTarget.canvas, 0, 0);
            drawContext.globalCompositeOperation = 'source-in';
            drawContext.fillStyle = this.color;
            drawContext.fillRect(0, 0, width, height);
        }
    }
    updateCursorIfNeeded () {
        if (!this.size) {
            return;
        }

        // The cursor preview was unattached from the view by an outside process,
        // such as changing costumes or undo.
        if (this.cursorPreview && !this.cursorPreview.parent) {
            this.cursorPreview = null;
        }

        if (!this.cursorPreview || !(this.lastSize === this.size && this.lastColor === this.color)) {
            if (this.cursorPreview) {
                this.cursorPreview.remove();
            }

            this.tmpCanvas = getBrushMark(this.size, this.color, this.isEraser || !this.color);
            this.cursorPreview = new paper.Raster(this.tmpCanvas);
            this.cursorPreview.guide = true;
            this.cursorPreview.parent = getGuideLayer();
            this.cursorPreview.data.isHelperItem = true;
        }

        this.lastSize = this.size;
        this.lastColor = this.color;
    }
    handleMouseMove (event) {
        this.updateCursorIfNeeded();
        this.cursorPreview.position = new paper.Point(~~event.point.x, ~~event.point.y);
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;

        if (this.cursorPreview) {
            this.cursorPreview.remove();
        }

        if (this.isEraser) {
            this.drawTarget = getRaster();
        } else {
            const drawCanvas = createCanvas();
            this.drawTarget = new paper.Raster(drawCanvas);
            this.drawTarget.parent = getGuideLayer();
            this.drawTarget.guide = true;
            this.drawTarget.locked = true;
            this.drawTarget.position = getRaster().position;

            if (this.color && doesColorRequireMask(this.color)) {
                this.maskTarget = createCanvas().getContext('2d');
                this.maskBrush = getBrushMark(this.size, 'black', false);
            }
        }

        this.drawNextLine(event.point, event.point);
        this.lastPoint = event.point;
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        this.drawNextLine(this.lastPoint, event.point);
        this.lastPoint = event.point;
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        this.drawNextLine(this.lastPoint, event.point);
        if (!this.isEraser) {
            getRaster().drawImage(this.drawTarget.canvas, new paper.Point(0, 0));
            this.drawTarget.remove();
        }
        this.drawTarget = null;
        this.maskTarget = null;
        this.maskBrush = null;
        this.onUpdateImage();

        this.lastPoint = null;
        this.active = false;

        this.updateCursorIfNeeded();
        this.cursorPreview.position = new paper.Point(~~event.point.x, ~~event.point.y);
    }
    deactivateTool () {
        this.active = false;
        this.tmpCanvas = null;
        if (this.cursorPreview) {
            this.cursorPreview.remove();
            this.cursorPreview = null;
        }
    }
}

export default BrushTool;
