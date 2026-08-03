import paper from '@turbowarp/paper';
import {styleBlob} from '../../helper/style-path';
import {snapDeltaToAngle} from '../math';

/**
 * Segment brush functions to add as listeners on the mouse. Call them when the corresponding mouse event happens
 * to get the broad brush behavior.
 *
 * Segment brush draws by creating a rounded rectangle for each mouse move event and merging all of
 * those shapes. Unlike the broad brush, the resulting shape will not self-intersect and when you make
 * 180 degree turns, you will get a rounded point as expected. Shortcomings include that performance is
 * worse, especially as the number of segments to join increase, and that there are problems in paper.js
 * with union on shapes with curves, so that chunks of the union tend to disappear.
 * (https://github.com/paperjs/paper.js/issues/1321)
 *
 * @param {!Tool} tool paper.js mouse object
 */
class SegmentBrushHelper {
    constructor () {
        this.lastPoint = null;
        this.finalPath = null;
        this.initialShape = null;
        this.isSquareBrush = false;
    }
    onSegmentMouseDown (event, tool, options) {
        if (event.event.button > 0) return; // only first mouse button

        const size = options.brushSize / 2;
        if (this.isSquareBrush) {
            tool.minDistance = options.brushSize / (paper.view.zoom / 2);
            tool.maxDistance = options.brushSize;
        } else {
            tool.minDistance = 2 / paper.view.zoom;
            tool.maxDistance = options.brushSize;
        }

        this.initialShape = this.isSquareBrush ? new paper.Path.Rectangle(
            new paper.Rectangle(
                new paper.Point(event.point.x - size, event.point.y - size),
                new paper.Point(event.point.x + size, event.point.y + size)
            )) : new paper.Path.Circle({
            center: event.point,
            radius: size
        });

        this.finalPath = this.initialShape;
        styleBlob(this.finalPath, options);
        this.lastPoint = event.point;
    }
    
    onSegmentMouseDrag (event, tool, options) {
        if (event.event.button > 0) return; // only first mouse button

        let delta = event.delta;
        if (event.modifiers.shift) {
            // 45 degree movement
            delta = snapDeltaToAngle(delta, Math.PI / 4);
        } else if (event.modifiers.alt) {
            // vertical movement
            delta = new paper.Point(0, delta.y);
        } else if (event.modifiers.control || event.modifiers.meta) {
            // horizontal movement
            delta = new paper.Point(delta.x, 0);
        }
        const point = this.lastPoint.add(delta);

        if (this.isSquareBrush) this.squareHandler({ point, delta }, tool, options);
        else this.roundHandler({ point, delta }, tool, options);
    }
    // square brush
    squareHandler (movement, tool, options) {
        const { delta, point } = movement;

        const size = options.brushSize / 2;
        const square = new paper.Path.Rectangle(new paper.Rectangle(
            new paper.Point(point.x - size, point.y - size),
            new paper.Point(point.x + size, point.y + size)
        ));

        square.fillColor = options.fillColor;
        this.lastPoint = point;
        if (!this.finalPath) this.finalPath = square;
        else {
            const merged = this.finalPath.unite(square);
            this.finalPath.remove();
            square.remove();
            this.finalPath = merged;
        }
    }
    // round brush
    roundHandler(movement, tool, options) {
        const { delta, point } = movement;

        const step = (delta).normalize(options.brushSize / 2);
        const handleVec = step.clone();
        handleVec.length = options.brushSize / 2;
        handleVec.angle += 90;

        const path = new paper.Path();
        
        styleBlob(path, options);

        // Add handles to round the end caps
        path.add(new paper.Segment(this.lastPoint.subtract(step), handleVec.multiply(-1), handleVec));
        step.angle += 90;

        path.add(this.lastPoint.add(step));
        path.insert(0, this.lastPoint.subtract(step));
        path.add(point.add(step));
        path.insert(0, point.subtract(step));

        // Add end cap
        step.angle -= 90;
        path.add(new paper.Segment(point.add(step), handleVec, handleVec.multiply(-1)));
        path.closed = true;
        // The unite function on curved paths does not always work (sometimes deletes half the path)
        // so we have to flatten.
        path.flatten(Math.min(5, options.brushSize / 5));
        
        this.lastPoint = point;
        const newPath = this.finalPath.unite(path);
        path.remove();
        this.finalPath.remove();
        this.finalPath = newPath;
    }

    onSegmentMouseUp(event, tool, options) {
        if (event.event.button > 0) return; // only first mouse button

        // TODO: This smoothing tends to cut off large portions of the path! Would like to eventually
        // add back smoothing, maybe a custom implementation that only applies to a subset of the line?

        // no need for normalization with the square brush
        if (this.isSquareBrush) {
            if (options.simplifySize > 0 && this.finalPath.segments) this.finalPath.simplify(options.simplifySize);
            return this.finalPath;
        }

        // Smooth the path. Make it unclosed first because smoothing of closed
        // paths tends to cut off the path.
        if (this.finalPath.segments && this.finalPath.segments.length > 4) {
            this.finalPath.closed = false;
            if (options.simplifySize > 0) {
                this.finalPath.simplify(options.simplifySize);
            }
            this.finalPath.closed = true;
            // Merge again with the first point, since it gets distorted when we unclose the path.
            const temp = this.finalPath.unite(this.initialShape);
            this.finalPath.remove();
            this.finalPath = temp;
        }
        return this.finalPath;
    }
}

export default SegmentBrushHelper;
