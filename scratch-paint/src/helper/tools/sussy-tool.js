import paper from '@scratch/paper';
import Modes from '../../lib/modes';
import { styleShape } from '../style-path';
import { clearSelection } from '../selection';
import { getSquareDimensions } from '../math';
import BoundingBoxTool from '../selection-tools/bounding-box-tool';
import NudgeTool from '../selection-tools/nudge-tool';

/**
 * Tool for drawing sussys.
 */
class SussyTool extends paper.Tool {
    static get TOLERANCE() {
        return 2;
    }
    /**
     * @param {function} setSelectedItems Callback to set the set of selected items in the Redux state
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     * @param {function} setCursor Callback to set the visible mouse cursor
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     */
    constructor(setSelectedItems, clearSelectedItems, setCursor, onUpdateImage) {
        super();
        this.setSelectedItems = setSelectedItems;
        this.clearSelectedItems = clearSelectedItems;
        this.onUpdateImage = onUpdateImage;
        this.boundingBoxTool = new BoundingBoxTool(
            Modes.SUSSY,
            setSelectedItems,
            clearSelectedItems,
            setCursor,
            onUpdateImage
        );
        const nudgeTool = new NudgeTool(Modes.SUSSY, this.boundingBoxTool, onUpdateImage);

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;
        this.onKeyUp = nudgeTool.onKeyUp;
        this.onKeyDown = nudgeTool.onKeyDown;

        this.sussy = null;
        this.colorState = null;
        this.isBoundingBoxMode = null;
        this.active = false;
    }
    getHitOptions() {
        return {
            segments: true,
            stroke: true,
            curves: true,
            fill: true,
            guide: false,
            match: hitResult =>
                (hitResult.item.data && (hitResult.item.data.isScaleHandle || hitResult.item.data.isRotHandle)) ||
                hitResult.item.selected, // Allow hits on bounding box and selected only
            tolerance: SussyTool.TOLERANCE / paper.view.zoom
        };
    }
    /**
     * Should be called if the selection changes to update the bounds of the bounding box.
     * @param {Array<paper.Item>} selectedItems Array of selected items.
     */
    onSelectionChanged(selectedItems) {
        this.boundingBoxTool.onSelectionChanged(selectedItems);
    }
    setColorState(colorState) {
        this.colorState = colorState;
    }
    handleMouseDown(event) {
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
    handleMouseDrag(event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseDrag(event);
            return;
        }

        if (this.sussy) {
            this.sussy.remove();
        }

        const sussy = new paper.Rectangle(event.downPoint, event.point);
        const squareDimensions = getSquareDimensions(event.downPoint, event.point);
        if (event.modifiers.shift) {
            sussy.size = squareDimensions.size.abs();
        }

        this.sussy = new paper.Path(`m 77 0 h 28 a 20 20 0 0 1 20 20 v 0 a 20 20 0 0 1 -20 20 V 40 H 77 V 112 A 1 1 0 0 1 42 111 A 1 1 0 0 0 16 112 A 1 1 0 0 1 -18 111 V 74 H -29 C -35 74 -36 73 -36 67 V 5 C -36 -1 -35 -2 -29 -2 H -18 A 1 1 0 0 1 76 0`);
        this.sussy.scale(sussy.size.divide(100));
        if (event.modifiers.alt) {
            this.sussy.position = event.downPoint;
        } else if (event.modifiers.shift) {
            this.sussy.position = squareDimensions.position;
        } else {
            const dimensions = event.point.subtract(event.downPoint);
            this.sussy.position = event.downPoint.add(dimensions.multiply(0.5));
        }

        styleShape(this.sussy, this.colorState);
    }
    handleMouseUp(event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseUp(event);
            this.isBoundingBoxMode = null;
            return;
        }

        if (this.sussy) {
            if (this.sussy.area < SussyTool.TOLERANCE / paper.view.zoom) {
                // Tiny sussy created unintentionally?
                this.sussy.remove();
                this.sussy = null;
            } else {
                this.sussy.selected = true;
                this.setSelectedItems();
                this.onUpdateImage();
                this.sussy = null;
            }
        }
        this.active = false;
    }
    handleMouseMove(event) {
        this.boundingBoxTool.onMouseMove(event, this.getHitOptions());
    }
    deactivateTool() {
        this.boundingBoxTool.deactivateTool();
    }
}

export default SussyTool;
