import paper from '@turbowarp/paper';
import Modes from '../../lib/modes';
import {styleShape} from '../style-path';
import {clearSelection} from '../selection';
import {getSquareDimensions} from '../math';
import BoundingBoxTool from '../selection-tools/bounding-box-tool';
import NudgeTool from '../selection-tools/nudge-tool';

// since we arent a blob tool we have to improvise
// this gets set by the reducer when the corner value is changed
const toolCornerSize = {
    value: 8
}

/**
 * Tool for drawing rounded rectangles.
 */
class RoundedRectTool extends paper.Tool {
    static get TOLERANCE () {
        return 2;
    }
    static set cornerSize (value) {
        toolCornerSize.value = value;
    }
    /**
     * @param {function} setSelectedItems Callback to set the set of selected items in the Redux state
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     * @param {function} setCursor Callback to set the visible mouse cursor
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     */
    constructor (setSelectedItems, clearSelectedItems, setCursor, onUpdateImage) {
        super();
        this.setSelectedItems = setSelectedItems;
        this.clearSelectedItems = clearSelectedItems;
        this.onUpdateImage = onUpdateImage;
        this.boundingBoxTool = new BoundingBoxTool(
            Modes.ROUNDED_RECT,
            setSelectedItems,
            clearSelectedItems,
            setCursor,
            onUpdateImage
        );
        const nudgeTool = new NudgeTool(Modes.ROUNDED_RECT, this.boundingBoxTool, onUpdateImage);

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;
        this.onKeyUp = nudgeTool.onKeyUp;
        this.onKeyDown = nudgeTool.onKeyDown;

        this.rect = null;
        this.colorState = null;
        this.isBoundingBoxMode = null;
        this.active = false;

        this.roundedCornerSize = toolCornerSize.value;
    }
    getHitOptions () {
        return {
            segments: true,
            stroke: true,
            curves: true,
            fill: true,
            guide: false,
            match: hitResult =>
                (hitResult.item.data && (hitResult.item.data.isScaleHandle || hitResult.item.data.isRotHandle)) ||
                hitResult.item.selected, // Allow hits on bounding box and selected only
            tolerance: RoundedRectTool.TOLERANCE / paper.view.zoom
        };
    }
    setRoundedCornerSize () {
        // For performance, make sure this is an integer
        this.roundedCornerSize = toolCornerSize.value;
        this.roundedCornerSize = Math.max(1, ~~this.roundedCornerSize);
    }
    /**
     * Should be called if the selection changes to update the bounds of the bounding box.
     * @param {Array<paper.Item>} selectedItems Array of selected items.
     */
    onSelectionChanged (selectedItems) {
        this.boundingBoxTool.onSelectionChanged(selectedItems);
    }
    setColorState (colorState) {
        this.colorState = colorState;
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;

        if (this.boundingBoxTool.onMouseDown(
            event, false /* clone */, false /* multiselect */, false /* doubleClicked */, this.getHitOptions())) {
            this.isBoundingBoxMode = true;
        } else {
            this.isBoundingBoxMode = false;
            clearSelection(this.clearSelectedItems);
        }
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseDrag(event);
            return;
        }

        if (this.rect) {
            this.rect.remove();
        }

        const rect = new paper.Rectangle(event.downPoint, event.point);
        const squareDimensions = getSquareDimensions(event.downPoint, event.point);
        if (event.modifiers.shift) {
            rect.size = squareDimensions.size.abs();
        }

        // update corner size
        this.setRoundedCornerSize();
        this.rect = new paper.Path.Rectangle(rect, this.roundedCornerSize);
        if (event.modifiers.alt) {
            this.rect.position = event.downPoint;
        } else if (event.modifiers.shift) {
            this.rect.position = squareDimensions.position;
        } else {
            const dimensions = event.point.subtract(event.downPoint);
            this.rect.position = event.downPoint.add(dimensions.multiply(0.5));
        }

        styleShape(this.rect, this.colorState);
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseUp(event);
            this.isBoundingBoxMode = null;
            return;
        }

        if (this.rect) {
            if (this.rect.area < RoundedRectTool.TOLERANCE / paper.view.zoom) {
                // Tiny rectangle created unintentionally?
                this.rect.remove();
                this.rect = null;
            } else {
                this.rect.selected = true;
                this.setSelectedItems();
                this.onUpdateImage();
                this.rect = null;
            }
        }
        this.active = false;
    }
    handleMouseMove (event) {
        this.boundingBoxTool.onMouseMove(event, this.getHitOptions());
    }
    deactivateTool () {
        this.boundingBoxTool.deactivateTool();
    }
}

export default RoundedRectTool;
