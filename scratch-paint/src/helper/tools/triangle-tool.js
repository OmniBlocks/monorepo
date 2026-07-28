import paper from '@turbowarp/paper';
import Modes from '../../lib/modes';
import { styleShape } from '../style-path';
import { clearSelection } from '../selection';
import { getSquareDimensions } from '../math';
import BoundingBoxTool from '../selection-tools/bounding-box-tool';
import NudgeTool from '../selection-tools/nudge-tool';

/**
 * Tool for drawing triangles.
 */
class TriangleTool extends paper.Tool {
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

        this.sideCount = 3;
        this.pointCount = 1;
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
    setSideCount(sideCount) {
        this.sideCount = sideCount;
        this.updateExistingShape();
    }
    setPointCount(pointCount) {
        this.pointCount = pointCount;
        this.updateExistingShape();
    }
    calculateSegments() {
        let segs = [];

        for (let i = 0; i < this.sideCount; i++) {
            let angle = (i / this.sideCount) * Math.PI * 2;
            let angleIn = angle + (1 / this.sideCount) * Math.PI;

            segs.push(new paper.Point(Math.sin(angle) * 50, -Math.cos(angle) * 50))
            if (this.pointCount !== 1) {
                segs.push(new paper.Point(Math.sin(angleIn) * 50 * this.pointCount, -Math.cos(angleIn) * 50 * this.pointCount));
            }
        }

        return segs;
    }
    updateExistingShape() {
        // if editing a tri, update the curves
        const oldTri = paper.project.selectedItems[0];
        if (oldTri) {
            const path = new paper.Path({segments: this.calculateSegments(), closed: true});
            path.bounds = oldTri.bounds;
            oldTri.segments = path.segments;
            oldTri.closed = true;
            path.remove();
            this.setSelectedItems();
            this.onUpdateImage();
        }
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

        const bounds = new paper.Rectangle(event.downPoint, event.point);
        const squareDimensions = getSquareDimensions(event.downPoint, event.point);
        if (event.modifiers.shift) {
            bounds.size = squareDimensions.size.abs();
        }

        this.tri = new paper.Path({segments: this.calculateSegments(), closed: true});
        this.tri.bounds = bounds;
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
