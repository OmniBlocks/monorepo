import paper from '@scratch/paper';
import Modes from '../../lib/modes';
import { styleShape } from '../style-path';
import { clearSelection } from '../selection';
import { getSquareDimensions } from '../math';
import BoundingBoxTool from '../selection-tools/bounding-box-tool';
import NudgeTool from '../selection-tools/nudge-tool';

const sideCount = {
    value: 3
};

/**
 * Tool for drawing triangles.
 */
class TriangleTool extends paper.Tool {
    static set sideCount (value) {
        sideCount.value = value;
    }
    static get sideCount () {
        return sideCount.value;
    }

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
            Modes.TRIANGLE,
            setSelectedItems,
            clearSelectedItems,
            setCursor,
            onUpdateImage
        );
        const nudgeTool = new NudgeTool(Modes.TRIANGLE, this.boundingBoxTool, onUpdateImage);

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;
        this.onKeyUp = nudgeTool.onKeyUp;
        this.onKeyDown = nudgeTool.onKeyDown;

        this.tri = null;
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
            tolerance: TriangleTool.TOLERANCE / paper.view.zoom
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

        if (this.tri) {
            this.tri.remove();
        }

        // idk how paper works so we use rectangle to make a triangle
        const tri = new paper.Rectangle(event.downPoint, event.point);
        const squareDimensions = getSquareDimensions(event.downPoint, event.point);
        if (event.modifiers.shift) {
            tri.size = squareDimensions.size.abs();
        }

        this.tri = new paper.Path.RegularPolygon(event.downPoint, TriangleTool.sideCount, 50);
        this.tri.scale(tri.size.width / 100, tri.size.height / 100, event.downPoint);
        if (event.modifiers.alt) {
            this.tri.position = event.downPoint;
        } else if (event.modifiers.shift) {
            this.tri.position = squareDimensions.position;
        } else {
            const dimensions = event.point.subtract(event.downPoint);
            this.tri.position = event.downPoint.add(dimensions.multiply(0.5));
        }

        styleShape(this.tri, this.colorState);
    }
    handleMouseUp(event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseUp(event);
            this.isBoundingBoxMode = null;
            return;
        }

        if (this.tri) {
            if (this.tri.area < TriangleTool.TOLERANCE / paper.view.zoom) {
                // Tiny triangle created unintentionally?
                this.tri.remove();
                this.tri = null;
            } else {
                this.tri.selected = true;
                this.setSelectedItems();
                this.onUpdateImage();
                this.tri = null;
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

export default TriangleTool;
