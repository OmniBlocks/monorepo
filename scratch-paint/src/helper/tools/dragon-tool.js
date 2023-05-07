import paper from '@scratch/paper';
import Modes from '../../lib/modes';
import { styleShape } from '../style-path';
import { clearSelection } from '../selection';
import { getSquareDimensions } from '../math';
import BoundingBoxTool from '../selection-tools/bounding-box-tool';
import NudgeTool from '../selection-tools/nudge-tool';

/**
 * Tool for drawing definetly just normal dragon heads.
 */
class DragonTool extends paper.Tool {
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
            Modes.DRAGON,
            setSelectedItems,
            clearSelectedItems,
            setCursor,
            onUpdateImage
        );
        const nudgeTool = new NudgeTool(Modes.DRAGON, this.boundingBoxTool, onUpdateImage);

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;
        this.onKeyUp = nudgeTool.onKeyUp;
        this.onKeyDown = nudgeTool.onKeyDown;

        this.dragon = null;
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
            tolerance: DragonTool.TOLERANCE / paper.view.zoom
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

        if (this.dragon) {
            this.dragon.remove();
        }

        const dragon = new paper.Rectangle(event.downPoint, event.point);
        const squareDimensions = getSquareDimensions(event.downPoint, event.point);
        if (event.modifiers.shift) {
            dragon.size = squareDimensions.size.abs();
        }

        this.dragon = new paper.Path(`M169.19262,341.94408c-5.80616,2.17958 -21.17199,0.24298 -33.38995,1.0916c-7.25679,0 -9.67935,-0.84862 -15.72487,-5.20415c-7.74276,-11.732 -18.51008,-29.51676 -23.10859,-48.2662c-1.20765,-6.17244 9.43637,-6.77446 4.23585,-12.70392c-5.32382,-8.95041 0.9683,-11.49264 3.26392,-11.97498c9.31669,0.23935 3.02457,20.92901 26.00986,15.36221c2.29925,-9.79903 -1.33096,-32.17867 4.71818,-38.95313c3.02457,19.96071 0.72532,26.25284 3.74989,32.29835c8.95403,-3.86956 12.09828,0.48596 14.87987,1.45426c2.54223,6.16882 7.98574,3.26392 8.71105,0.23935c-0.11968,-10.16169 -0.84499,-27.82315 0.60564,-39.55877c-3.14425,-1.93297 -5.80616,-7.86243 -3.50691,-18.2671c-0.36266,-0.9683 8.70743,-23.22464 -1.21128,-25.76687c-8.10541,2.54223 -11.61232,14.39754 -16.1528,19.33332c-3.77165,-11.7864 -7.26042,-25.55291 -7.97123,-44.80644c1.39623,-28.10239 14.28149,-28.10239 24.68253,-27.17036c-2.48421,-4.81248 -6.36465,-9.7809 -6.65841,-17.67234c-1.70812,-29.19037 5.90045,-48.59984 22.04963,-54.96812c-4.65653,7.60857 -4.96842,20.03325 -4.65653,24.06963c4.19233,15.99323 14.90526,28.87848 22.82209,30.74255c9.16438,-5.12436 13.82091,-13.81728 19.72136,-25.93007c2.17232,-4.50422 -2.02001,-24.68978 -0.15594,-36.79894c7.45263,-23.44586 28.41428,-34.47067 38.04286,-44.87534c-5.74451,15.68497 -11.49264,37.11083 -9.78452,42.85533c7.14437,18.01324 12.73293,31.67821 22.20557,47.04767c6.21234,-0.93203 11.02481,-6.98843 17.23352,-8.5406c-16.76932,25.30992 -3.10436,55.27638 -2.79247,57.45233c20.33788,-20.02962 35.24676,-43.94331 56.67262,-53.56826c25.62181,-25.93007 41.30316,-55.58827 65.83699,-89.12691c-2.7961,27.63819 -19.25353,67.23323 -29.50226,85.71067c-9.7809,20.64977 -19.25353,36.33111 -33.85053,58.92473c-17.90807,20.81296 -20.18556,24.60999 -26.83672,48.36411c0.23935,3.38723 4.23222,5.92946 7.01381,8.46807c-7.25679,1.81329 -8.70743,5.56681 -9.07371,11.37297c0,41.61504 5.32382,45.24525 5.20052,56.37524c-15.36221,32.41803 -28.67177,42.46004 -60.2448,65.565c-76.33595,21.41497 -51.90003,3.86956 -76.45563,-3.63021zM242.45,269.99185c3.089,-2.18347 3.8336,-19.71382 1.23123,-26.15118c-3.41142,-8.43867 -9.64814,-22.47456 -13.03123,-22.04882c-8.4,0.67715 -6.47716,12 -26,17.4c-2.36136,1.15845 -17.23312,6.73679 -30.28301,6.53392c-4.23102,-0.06578 -2.26453,29.16099 -0.51699,31.46608c5.4,7.12284 58.90584,-0.34765 68.6,-7.2z`);
        this.dragon.scale(dragon.size.divide(100));
        if (event.modifiers.alt) {
            this.dragon.position = event.downPoint;
        } else if (event.modifiers.shift) {
            this.dragon.position = squareDimensions.position;
        } else {
            const dimensions = event.point.subtract(event.downPoint);
            this.dragon.position = event.downPoint.add(dimensions.multiply(0.5));
        }

        styleShape(this.dragon, this.colorState);
    }
    handleMouseUp(event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseUp(event);
            this.isBoundingBoxMode = null;
            return;
        }

        if (this.dragon) {
            if (this.dragon.area < DragonTool.TOLERANCE / paper.view.zoom) {
                // Tiny definetly just a normal dragon head created unintentionally?
                this.dragon.remove();
                this.dragon = null;
            } else {
                this.dragon.selected = true;
                this.setSelectedItems();
                this.onUpdateImage();
                this.dragon = null;
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

export default DragonTool;
