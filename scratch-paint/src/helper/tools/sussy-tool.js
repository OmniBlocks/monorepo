import paper from '@turbowarp/paper';
import Modes from '../../lib/modes';
import { styleShape } from '../style-path';
import { clearSelection } from '../selection';
import { getSquareDimensions } from '../math';
import BoundingBoxTool from '../selection-tools/bounding-box-tool';
import NudgeTool from '../selection-tools/nudge-tool';
import { selectablePaths } from '../selectable-shapes';

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

        this.shape = "smile";
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
    setShape(shape) {
        // NOTE: Purposefully not doing live updates here since users probably dont want that for this tool.
        this.shape = shape;
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

        if (this.sussy) this.sussy.remove();

        const rawBounds = new paper.Rectangle(event.downPoint, event.point);
        const pathData = selectablePaths[this.shape];
        this.sussy = new paper.CompoundPath(pathData);

        const shapeBounds = this.sussy.bounds.clone();
        const shapeRatio = shapeBounds.width / shapeBounds.height;
        let finalBounds = rawBounds;

        if (event.modifiers.shift) {
            const { width, height } = rawBounds.size;
            let w0 = width, h0 = height;

            // adjust to keep aspect ratio
            if (width / height > shapeRatio) w0 = Math.sign(width) * Math.abs(height * shapeRatio);
            else h0 = Math.sign(height) * Math.abs(width / shapeRatio);

            const opposite = event.downPoint.add(new paper.Point(w0, h0));
            finalBounds = new paper.Rectangle(
                new paper.Point(
                    Math.min(event.downPoint.x, opposite.x),
                    Math.min(event.downPoint.y, opposite.y)
                ),
                new paper.Point(
                    Math.max(event.downPoint.x, opposite.x),
                    Math.max(event.downPoint.y, opposite.y)
                )
            );
        }

        this.sussy.bounds = finalBounds;
        if (event.modifiers.alt) this.sussy.position = event.downPoint;
        else this.sussy.position = this.sussy.bounds.center;

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
            if (Math.abs(this.sussy.area) < SussyTool.TOLERANCE / paper.view.zoom) {
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
