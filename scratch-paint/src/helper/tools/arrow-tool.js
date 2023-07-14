import paper from '@scratch/paper';
import Modes from '../../lib/modes';
import { styleShape } from '../style-path';
import { clearSelection } from '../selection';
import { getSquareDimensions } from '../math';
import BoundingBoxTool from '../selection-tools/bounding-box-tool';
import NudgeTool from '../selection-tools/nudge-tool';

const arrowSettings = {
    lineWidth: 24,
    lineLength: 60,
    headWidth: 60,
    headLength: 60
}

const guideText = `Hold Shift to resize arrow tip`;

const constructArrowPath = (left, lineWidth, lineLength, headWidth, headLength) => {
    if (typeof lineWidth !== "number") {
        lineWidth = 24;
    }
    if (typeof lineLength !== "number") {
        lineLength = 60;
    }
    if (typeof headWidth !== "number") {
        headWidth = 60;
    }
    if (typeof headLength !== "number") {
        headLength = 60;
    }

    if (left) {
        return `M 0 ${lineWidth} H ${0 - lineLength} V ${headWidth} L ${0 - (lineLength + headLength)} 0 L ${0 - lineLength} ${0 - headWidth} V ${0 - lineWidth} H 0 Z`;
    }
    return `M 0 ${0 - lineWidth} H ${lineLength} V ${0 - headWidth} L ${lineLength + headLength} 0 L ${lineLength} ${headWidth} V ${lineWidth} H 0 Z`;
}

/**
 * Tool for drawing arrows.
 */
class ArrowTool extends paper.Tool {
    static update(settings) {
        if (typeof settings.lineWidth === "number") arrowSettings.lineWidth = settings.lineWidth;
        if (typeof settings.lineLength === "number") arrowSettings.lineLength = settings.lineLength;
        if (typeof settings.headWidth === "number") arrowSettings.headWidth = settings.headWidth;
        if (typeof settings.headLength === "number") arrowSettings.headLength = settings.headLength;
    }

    static set arrowSettings(_) {
        throw new Error('arrowSettings cannot be set; use ArrowTool.update(<Object:ArrowToolSettings>);');
    }
    static get arrowSettings() {
        return arrowSettings;
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
            Modes.ARROW,
            setSelectedItems,
            clearSelectedItems,
            setCursor,
            onUpdateImage
        );
        const nudgeTool = new NudgeTool(Modes.ARROW, this.boundingBoxTool, onUpdateImage);

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

        this.canModifyState = true;
        this.arrowPathState = {
            length: 60,
            angle: 0,
            width: 24,
            head: {
                length: 60,
                width: 60
            }
        };
        this.arrowPathLocked = false;
        this.arrowPathLockedState = {};
        this.arrowPathLockedPositionSet = false;
        this.arrowPathLockedPosition = { x: 0, y: 0 };
        this.guideText = null;
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
            tolerance: ArrowTool.TOLERANCE / paper.view.zoom
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

        const pathOptions = {
            length: 60,
            angle: 0,
            width: 24,
            head: {
                length: 60,
                width: 60
            }
        };
        this.arrowPathState = pathOptions;
        this.canModifyState = true;
        this.arrowPathLocked = false;
        this.arrowPathLockedState = {};
        this.arrowPathLockedPositionSet = false;
        this.arrowPathLockedPosition = { x: 0, y: 0 };
        if (this.guideText) {
            this.guideText.remove();
        }
        this.guideText = null;

        if (this.boundingBoxTool.onMouseDown(
            event, false /* clone */, false /* multiselect */, false /* doubleClicked */, this.getHitOptions())) {
            this.isBoundingBoxMode = true;
        } else {
            this.isBoundingBoxMode = false;
            clearSelection(this.clearSelectedItems);
        }
    }

    radToDeg(rad) {
        return rad * 180 / Math.PI;
    }

    calculateDirection(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const direction = 90 - this.radToDeg(Math.atan2(dy, dx));
        return direction;
    }
    calculateDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt((dx * dx) + (dy * dy));
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

        // set some stuff for locking if alt is pressed
        // alt allows other pieces of the arrow to be modified
        const pathOptions = this.arrowPathState;
        if (event.modifiers.alt) {
            this.canModifyState = false;
            this.arrowPathLocked = true;
            if (!this.arrowPathLockedPositionSet) {
                this.arrowPathLockedPosition = {
                    x: event.point.x,
                    y: event.point.y
                };
            }
            this.arrowPathLockedPositionSet = true;
        } else {
            this.canModifyState = true;
            this.arrowPathLocked = false;
            this.arrowPathLockedPositionSet = false;
            this.arrowPathLockedPosition = { x: 0, y: 0 };
        }

        if (this.canModifyState) {
            const x1 = event.downPoint.x;
            const y1 = event.downPoint.y;

            const x2 = event.point.x;
            const y2 = event.point.y;

            pathOptions.length = this.calculateDistance(x1, y1, x2, y2);
        }

        if (this.canModifyState) {
            const x1 = event.downPoint.x;
            const y1 = event.downPoint.y;

            const x2 = event.point.x;
            const y2 = event.point.y;

            pathOptions.angle = 90 - this.calculateDirection(x1, y1, x2, y2);
            if (event.modifiers.shift) {
                pathOptions.angle = Math.round((pathOptions.angle / 360) * 8) * 45;
            }
        }

        // set extra modifications
        if (event.modifiers.alt) {
            if (event.modifiers.shift) {
                // edit arrow point
                const x1 = this.arrowPathLockedPosition.x;
                const y1 = this.arrowPathLockedPosition.y;

                const x2 = event.point.x;
                const y2 = event.point.y;

                pathOptions.head.length = this.calculateDistance(x1, y1, x2, y1);
                pathOptions.head.width = this.calculateDistance(x1, y1, x1, y2);
            } else {
                // edit arrow width
                const x1 = this.arrowPathLockedPosition.x;
                const y1 = this.arrowPathLockedPosition.y;

                const x2 = event.point.x;
                const y2 = event.point.y;

                pathOptions.width = this.calculateDistance(x1, y1, x2, y2);
            }
        }

        this.tri = new paper.Path(constructArrowPath(event.modifiers.control, pathOptions.width, pathOptions.length, pathOptions.head.width, pathOptions.head.length));
        // console.log(pathOptions.angle, this.tri)
        // console.log(pathOptions.angle)
        this.tri.rotate(pathOptions.angle, event.downPoint);
        // this.tri.scale(tri.size.width / 100, tri.size.height / 100, event.downPoint);

        // create new position
        if ((!this.arrowPathLocked) && this.arrowPathLockedState) {
            this.tri.position = event.downPoint;

            const dimensions = event.point.subtract(event.downPoint);
            this.tri.position = event.downPoint.add(dimensions.multiply(0.5));
        } else if (this.arrowPathLocked) {
            this.tri.position = this.arrowPathLockedState;
        }

        // add guide text
        // remove first
        if (this.guideText) {
            this.guideText.remove();
        }
        this.guideText = null;
        if (event.modifiers.alt && (!event.modifiers.shift)) {
            // create
            this.guideText = new paper.PointText({
                point: event.point,
                content: guideText,
                font: 'Sans Serif',
                fontSize: 32,
                fillColor: '#000000',
                // Default leading for both the HTML text area and paper.PointText
                // is 120%, but for some reason they are slightly off from each other.
                // This value was obtained experimentally.
                leading: 46.15
            });
        }

        this.arrowPathLockedState = {
            x: this.tri.position.x,
            y: this.tri.position.y,
        };
        // console.log(this.arrowPathLockedState)

        styleShape(this.tri, this.colorState);
    }
    handleMouseUp(event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseUp(event);
            this.isBoundingBoxMode = null;
            return;
        }

        if (this.guideText) {
            this.guideText.remove();
        }
        this.guideText = null;

        this.arrowPathLockedPositionSet = false;
        this.arrowPathLockedPosition = { x: 0, y: 0 };

        if (this.tri) {
            if (this.tri.area < ArrowTool.TOLERANCE / paper.view.zoom) {
                // Tiny arrow created unintentionally?
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

export default ArrowTool;
