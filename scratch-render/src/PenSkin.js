const twgl = require('twgl.js');

const RenderConstants = require('./RenderConstants');
const Skin = require('./Skin');

const Rectangle = require('./Rectangle');
const ShaderManager = require('./ShaderManager');

/**
 * Attributes to use when drawing with the pen
 * @typedef {object} PenSkin#PenAttributes
 * @property {number} [diameter] - The size (diameter) of the pen.
 * @property {Array<number>} [color4f] - The pen color as an array of [r,g,b,a], each component in the range [0,1].
 */

/**
 * The pen attributes to use when unspecified.
 * @type {PenSkin#PenAttributes}
 * @memberof PenSkin
 * @private
 * @const
 */
const DefaultPenAttributes = {
    color4f: [0, 0, 1, 1],
    diameter: 1
};

/**
 * Reused memory location for storing a premultiplied pen color.
 * @type {FloatArray}
 */
const __premultipliedColor = [0, 0, 0, 0];


/**
 * Reused memory location for projection matrices.
 * @type {FloatArray}
 */
const __projectionMatrix = twgl.m4.identity();

/**
 * Reused memory location for translation matrix for building a model matrix.
 * @type {FloatArray}
 */
const __modelTranslationMatrix = twgl.m4.identity();


/**
 * Reused memory location for scaling matrix for building a model matrix.
 * @type {FloatArray}
 */
const __modelScalingMatrix = twgl.m4.identity();

/**
 * Reused memory location for a model matrix.
 * @type {FloatArray}
 */
const __modelMatrix = twgl.m4.identity();

/**
 * Reused memory location for a vector to create a translation matrix from.
 * @type {FloatArray}
 */
const __modelTranslationVector = twgl.v3.create();

/**
 * Reused memory location for a vector to create a scaling matrix from.
 * @type {FloatArray}
 */
const __modelScalingVector = twgl.v3.create();

class PenSkin extends Skin {
    /**
     * Create a Skin which implements a Scratch pen layer.
     * @param {int} id - The unique ID for this Skin.
     * @param {RenderWebGL} renderer - The renderer which will use this Skin.
     * @extends Skin
     * @listens RenderWebGL#event:NativeSizeChanged
     */
    constructor (id, renderer) {
        super(id);

        /**
         * @private
         * @type {RenderWebGL}
         */
        this._renderer = renderer;

        /** @type {HTMLCanvasElement} */
        this._canvas = document.createElement('canvas');

        /** @type {WebGLTexture} */
        this._exportTexture = null;

        /** @type {WebGLFramebuffer} */
        this._framebuffer = null;

        /** @type {WebGLFramebuffer} */
        this._silhouetteBuffer = null;

        /** @type {boolean} */
        this._canvasDirty = false;

        /** @type {boolean} */
        this._silhouetteDirty = false;

        /** @type {Uint8Array} */
        this._silhouettePixels = null;

        /** @type {ImageData} */
        this._silhouetteImageData = null;

        /** @type {object} */
        this._lineOnBufferDrawRegionId = {
            enter: () => this._enterDrawLineOnBuffer(),
            exit: () => this._exitDrawLineOnBuffer()
        };

        /** @type {object} */
        this._toBufferDrawRegionId = {
            enter: () => this._enterDrawToBuffer(),
            exit: () => this._exitDrawToBuffer()
        };

        // tw: renderQuality attribute
        this.renderQuality = 1;

        // tw: keep track of pen size
        this._nativeSize = renderer.getNativeSize();

        /** @type {twgl.BufferInfo} */
        this._lineBufferInfo = null;

        const NO_EFFECTS = 0;
        /** @type {twgl.ProgramInfo} */
        this._stampShader = this._renderer._shaderManager.getShader(ShaderManager.DRAW_MODE.default, NO_EFFECTS);

        /** @type {twgl.ProgramInfo} */
        this._lineShader = this._renderer._shaderManager.getShader(ShaderManager.DRAW_MODE.line, NO_EFFECTS);

        this._createLineGeometry();

        this.onNativeSizeChanged = this.onNativeSizeChanged.bind(this);
        this._renderer.on(RenderConstants.Events.NativeSizeChanged, this.onNativeSizeChanged);

        this._setCanvasSize(renderer.getNativeSize());
    }

    /**
     * Dispose of this object. Do not use it after calling this method.
     */
    dispose () {
        this._renderer.removeListener(RenderConstants.Events.NativeSizeChanged, this.onNativeSizeChanged);
        this._renderer.gl.deleteTexture(this._texture);
        this._renderer.gl.deleteTexture(this._exportTexture);
        this._texture = null;
        super.dispose();
    }

    /**
     * @returns {boolean} true for a raster-style skin (like a BitmapSkin), false for vector-style (like SVGSkin).
     */
    get isRaster () {
        return true;
    }

    /**
     * @return {Array<number>} the "native" size, in texels, of this skin. [width, height]
     */
    get size () {
        // tw: the "native" size of the pen layer is always equal to the native size of the renderer
        return this._nativeSize;
    }

    /**
     * @return {WebGLTexture} The GL texture representation of this skin when drawing at the given size.
     * @param {int} pixelsWide - The width that the skin will be rendered at, in GPU pixels.
     * @param {int} pixelsTall - The height that the skin will be rendered at, in GPU pixels.
     */
    // eslint-disable-next-line no-unused-vars
    getTexture (pixelsWide, pixelsTall) {
        if (this._canvasDirty) {
            this._drawToBuffer();
        }

        return this._exportTexture;
    }

    /**
     * Clear the pen layer.
     */
    clear () {
        const gl = this._renderer.gl;
        twgl.bindFramebufferInfo(gl, this._framebuffer);

        /* Reset framebuffer to transparent black */
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._silhouetteDirty = true;
    }

    /**
     * Draw a point on the pen layer.
     * @param {PenAttributes} penAttributes - how the point should be drawn.
     * @param {number} x - the X coordinate of the point to draw.
     * @param {number} y - the Y coordinate of the point to draw.
     */
    drawPoint (penAttributes, x, y) {
        // Canvas renders a zero-length line as two end-caps back-to-back, which is what we want.
        this.drawLine(penAttributes, x, y, x, y);
    }

    /**
     * Draw a line on the pen layer.
     * @param {PenAttributes} penAttributes - how the line should be drawn.
     * @param {number} x0 - the X coordinate of the beginning of the line.
     * @param {number} y0 - the Y coordinate of the beginning of the line.
     * @param {number} x1 - the X coordinate of the end of the line.
     * @param {number} y1 - the Y coordinate of the end of the line.
     */
    drawLine (penAttributes, x0, y0, x1, y1) {
        // For compatibility with Scratch 2.0, offset pen lines of width 1 and 3 so they're pixel-aligned.
        // See https://github.com/LLK/scratch-render/pull/314
        const diameter = penAttributes.diameter || DefaultPenAttributes.diameter;
        const offset = (diameter === 1 || diameter === 3) ? 0.5 : 0;

        this._drawLineOnBuffer(
            penAttributes,
            x0 + offset, y0 + offset,
            x1 + offset, y1 + offset
        );

        this._silhouetteDirty = true;
    }

    /**
     * Create 2D geometry for drawing lines to a framebuffer.
     */
    _createLineGeometry () {
        this.a_lineColor = new Float32Array(65520);
        this.a_lineColorIndex = 0;
        this.a_lineThicknessAndLength = new Float32Array(32760);
        this.a_lineThicknessAndLengthIndex = 0;
        this.a_penPoints = new Float32Array(65520);
        this.a_penPointsIndex = 0;

        this.a_position = new Float32Array(32760);
        for (var i = 0; i < this.a_position.length; i += 12) {
            this.a_position[i + 0] = 1;
            this.a_position[i + 1] = 0;
            this.a_position[i + 2] = 0;
            this.a_position[i + 3] = 0;
            this.a_position[i + 4] = 1;
            this.a_position[i + 5] = 1;
            this.a_position[i + 6] = 1;
            this.a_position[i + 7] = 1;
            this.a_position[i + 8] = 0;
            this.a_position[i + 9] = 0;
            this.a_position[i + 10] = 0;
            this.a_position[i + 11] = 1;
        }

        const quads = {
            a_position: {
                numComponents: 2,
                data: this.a_position
            },
            a_lineColor: {
                numComponents: 4,
                drawType: this._renderer.gl.STREAM_DRAW,
                data: this.a_lineColor
            },
            a_lineThicknessAndLength: {
                numComponents: 2,
                drawType: this._renderer.gl.STREAM_DRAW,
                data: this.a_lineThicknessAndLength
            },
            a_penPoints: {
                numComponents: 4,
                drawType: this._renderer.gl.STREAM_DRAW,
                data: this.a_penPoints
            }
        };

        this._lineBufferInfo = twgl.createBufferInfoFromArrays(this._renderer.gl, quads);
    }

    /**
     * Prepare to draw lines in the _lineOnBufferDrawRegionId region.
     */
    _enterDrawLineOnBuffer () {
        const gl = this._renderer.gl;

        const bounds = this._bounds;
        const currentShader = this._lineShader;
        const projection = twgl.m4.ortho(0, bounds.width, 0, bounds.height, -1, 1, __projectionMatrix);

        this.a_lineColorIndex = 0;
        this.a_lineThicknessAndLengthIndex = 0;
        this.a_penPointsIndex = 0;

        twgl.bindFramebufferInfo(gl, this._framebuffer);

        gl.viewport(0, 0, bounds.width, bounds.height);

        gl.useProgram(currentShader.program);

        const uniforms = {
            u_skin: this._texture,
            u_projectionMatrix: projection,
            // tw: we assume that size won't change between now and when lines are flushed
            // tw: must use native size instead of real size for proper scaling
            u_stageSize: this._nativeSize
        };

        twgl.setUniforms(currentShader, uniforms);
    }

    /**
     * Return to a base state from _lineOnBufferDrawRegionId.
     */
    _exitDrawLineOnBuffer () {
        if (this.a_lineColorIndex) {
            this._flushLines();
        }

        const gl = this._renderer.gl;

        twgl.bindFramebufferInfo(gl, null);
    }

    /**
     * Draw a line on the framebuffer.
     * Note that the point coordinates are in the following coordinate space:
     * +y is down, (0, 0) is the center, and the coords range from (-width / 2, -height / 2) to (height / 2, width / 2).
     * @param {PenAttributes} penAttributes - how the line should be drawn.
     * @param {number} x0 - the X coordinate of the beginning of the line.
     * @param {number} y0 - the Y coordinate of the beginning of the line.
     * @param {number} x1 - the X coordinate of the end of the line.
     * @param {number} y1 - the Y coordinate of the end of the line.
     */
    _drawLineOnBuffer (penAttributes, x0, y0, x1, y1) {
        this._renderer.enterDrawRegion(this._lineOnBufferDrawRegionId);

        if (this.a_lineColorIndex + 24 > this.a_lineColor.length) {
            this._flushLines();
        }

        // Premultiply pen color by pen transparency
        const penColor = penAttributes.color4f || DefaultPenAttributes.color4f;
        __premultipliedColor[0] = penColor[0] * penColor[3];
        __premultipliedColor[1] = penColor[1] * penColor[3];
        __premultipliedColor[2] = penColor[2] * penColor[3];
        __premultipliedColor[3] = penColor[3];

        // Fun fact: Doing this calculation in the shader has the potential to overflow the floating-point range.
        // 'mediump' precision is only required to have a range up to 2^14 (16384), so any lines longer than 2^7 (128)
        // can overflow that, because you're squaring the operands, and they could end up as "infinity".
        // Even GLSL's `length` function won't save us here:
        // https://asawicki.info/news_1596_watch_out_for_reduced_precision_normalizelength_in_opengl_es
        const lineDiffX = x1 - x0;
        const lineDiffY = y1 - y0;
        const lineLength = Math.sqrt((lineDiffX * lineDiffX) + (lineDiffY * lineDiffY));

        const lineThickness = penAttributes.diameter || DefaultPenAttributes.diameter;

        for (let i = 0; i < 6; i++) {
            this.a_lineColor[this.a_lineColorIndex] = __premultipliedColor[0];
            this.a_lineColorIndex++;
            this.a_lineColor[this.a_lineColorIndex] = __premultipliedColor[1];
            this.a_lineColorIndex++;
            this.a_lineColor[this.a_lineColorIndex] = __premultipliedColor[2];
            this.a_lineColorIndex++;
            this.a_lineColor[this.a_lineColorIndex] = __premultipliedColor[3];
            this.a_lineColorIndex++;

            this.a_lineThicknessAndLength[this.a_lineThicknessAndLengthIndex] = lineThickness;
            this.a_lineThicknessAndLengthIndex++;

            this.a_lineThicknessAndLength[this.a_lineThicknessAndLengthIndex] = lineLength;
            this.a_lineThicknessAndLengthIndex++;

            this.a_penPoints[this.a_penPointsIndex] = x0;
            this.a_penPointsIndex++;
            this.a_penPoints[this.a_penPointsIndex] = -y0;
            this.a_penPointsIndex++;
            this.a_penPoints[this.a_penPointsIndex] = lineDiffX;
            this.a_penPointsIndex++;
            this.a_penPoints[this.a_penPointsIndex] = -lineDiffY;
            this.a_penPointsIndex++;
        }
    }

    _flushLines() {
        const gl = this._renderer.gl;

        const currentShader = this._lineShader;

        // If only a small amount of data needs to be uploaded, we only upload part of the data. Otherwise we'll just upload everything.
        // todo: need to see if this helps and fine tune this number
        if (this.a_lineColorIndex < 1000) {
            twgl.setAttribInfoBufferFromArray(gl, this._lineBufferInfo.attribs.a_lineColor, new Float32Array(this.a_lineColor.buffer, 0, this.a_lineColorIndex), 0);
            twgl.setAttribInfoBufferFromArray(gl, this._lineBufferInfo.attribs.a_penPoints, new Float32Array(this.a_penPoints.buffer, 0, this.a_penPointsIndex), 0);
            twgl.setAttribInfoBufferFromArray(gl, this._lineBufferInfo.attribs.a_lineThicknessAndLength, new Float32Array(this.a_lineThicknessAndLength.buffer, 0, this.a_lineThicknessAndLengthIndex), 0);
        } else {
            twgl.setAttribInfoBufferFromArray(gl, this._lineBufferInfo.attribs.a_lineColor, this.a_lineColor);
            twgl.setAttribInfoBufferFromArray(gl, this._lineBufferInfo.attribs.a_penPoints, this.a_penPoints);
            twgl.setAttribInfoBufferFromArray(gl, this._lineBufferInfo.attribs.a_lineThicknessAndLength, this.a_lineThicknessAndLength);
        }
        // todo: if we skip twgl and do all this buffer stuff ourselves, we can skip some unneeded gl calls
        twgl.setBuffersAndAttributes(gl, currentShader, this._lineBufferInfo);

        twgl.drawBufferInfo(gl, this._lineBufferInfo, gl.TRIANGLES, this.a_lineThicknessAndLengthIndex / 2);

        this.a_lineColorIndex = 0;
        this.a_lineThicknessAndLengthIndex = 0;
        this.a_penPointsIndex = 0;

        this._silhouetteDirty = true;
    }

    /**
     * Stamp an image onto the pen layer.
     * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} stampElement - the element to use as the stamp.
     * @param {number} x - the X coordinate of the stamp to draw.
     * @param {number} y - the Y coordinate of the stamp to draw.
     */
    drawStamp (stampElement, x, y) {
        const ctx = this._canvas.getContext('2d');

        ctx.drawImage(stampElement, this._rotationCenter[0] + x, this._rotationCenter[1] - y);

        this._canvasDirty = true;
        this._silhouetteDirty = true;
    }

    /**
     * Enter a draw region to draw a rectangle.
     *
     * Multiple calls with the same regionId skip the callback reducing the
     * amount of GL state changes.
     * @param {twgl.ProgramInfo} currentShader - program info to draw rectangle
     *   with
     * @param {Rectangle} bounds - viewport bounds to draw in
     *   region
     */
    _drawRectangleRegionEnter (currentShader, bounds) {
        const gl = this._renderer.gl;

        gl.viewport(0, 0, bounds.width, bounds.height);

        gl.useProgram(currentShader.program);
        twgl.setBuffersAndAttributes(gl, currentShader, this._renderer._bufferInfo);
    }

    /**
     * Draw a rectangle.
     * @param {twgl.ProgramInfo} currentShader - program info to draw rectangle
     *   with
     * @param {WebGLTexture} texture - texture to draw
     * @param {Rectangle} bounds - bounded area to draw in
     * @param {number} x - centered at x
     * @param {number} y - centered at y
     */
    _drawRectangle (currentShader, texture, bounds, x = -this._canvas.width / 2, y = this._canvas.height / 2) {
        const gl = this._renderer.gl;

        const projection = twgl.m4.ortho(
            bounds.left, bounds.right, bounds.top, bounds.bottom, -1, 1,
            __projectionMatrix
        );

        const uniforms = {
            u_skin: texture,
            u_projectionMatrix: projection,
            u_modelMatrix: twgl.m4.multiply(
                twgl.m4.translation(twgl.v3.create(
                    -x - (bounds.width / 2),
                    -y + (bounds.height / 2),
                    0
                ), __modelTranslationMatrix),
                twgl.m4.scaling(twgl.v3.create(
                    bounds.width,
                    bounds.height,
                    0
                ), __modelScalingMatrix),
                __modelMatrix
            )
        };

        twgl.setTextureParameters(gl, texture, {minMag: gl.NEAREST});
        twgl.setUniforms(currentShader, uniforms);

        twgl.drawBufferInfo(gl, this._renderer._bufferInfo, gl.TRIANGLES);
    }

    /**
     * Prepare to draw a rectangle in the _toBufferDrawRegionId region.
     */
    _enterDrawToBuffer () {
        const gl = this._renderer.gl;

        twgl.bindFramebufferInfo(gl, this._framebuffer);

        this._drawRectangleRegionEnter(this._stampShader, this._bounds);
    }

    /**
     * Return to a base state from _toBufferDrawRegionId.
     */
    _exitDrawToBuffer () {
        const gl = this._renderer.gl;

        twgl.bindFramebufferInfo(gl, null);
    }

    /**
     * Draw the input texture to the framebuffer.
     * @param {WebGLTexture} texture - input texture to draw
     * @param {number} x - texture centered at x
     * @param {number} y - texture centered at y
     */
    _drawToBuffer (texture = this._texture, x = -this._canvas.width / 2, y = this._canvas.height / 2) {
        if (texture !== this._texture && this._canvasDirty) {
            this._drawToBuffer();
        }

        const gl = this._renderer.gl;

        // If the input texture is the one that represents the pen's canvas
        // layer, update the texture with the canvas data.
        if (texture === this._texture) {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._canvas);

            const ctx = this._canvas.getContext('2d');
            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

            this._canvasDirty = false;
        }

        const currentShader = this._stampShader;
        const bounds = this._bounds;

        this._renderer.enterDrawRegion(this._toBufferDrawRegionId);

        this._drawRectangle(currentShader, texture, bounds, x, y);

        this._silhouetteDirty = true;
    }

    /**
     * React to a change in the renderer's native size.
     * @param {object} event - The change event.
     */
    onNativeSizeChanged (event) {
        // tw: keep track of native size
        this._nativeSize = event.newSize;
        this._setCanvasSize(event.newSize);
    }

    /**
     * Set the size of the pen canvas.
     * @param {Array<int>} canvasSize - the new width and height for the canvas.
     * @private
     */
    _setCanvasSize (canvasSize) {
        const [width, height] = canvasSize;

        const gl = this._renderer.gl;

        this._bounds = new Rectangle();
        this._bounds.initFromBounds(width / 2, width / -2, height / 2, height / -2);

        this._canvas.width = width;
        this._canvas.height = height;

        this._rotationCenter[0] = this.size[0] / 2;
        this._rotationCenter[1] = this.size[1] / 2;

        const oldTexture = this._texture;
        const oldExportTexture = this._exportTexture;

        this._texture = twgl.createTexture(
            gl,
            {
                auto: true,
                mag: gl.NEAREST,
                min: gl.NEAREST,
                wrap: gl.CLAMP_TO_EDGE,
                src: this._canvas
            }
        );

        this._exportTexture = twgl.createTexture(
            gl,
            {
                auto: true,
                mag: gl.NEAREST,
                min: gl.NEAREST,
                wrap: gl.CLAMP_TO_EDGE,
                width,
                height
            }
        );

        const attachments = [
            {
                format: gl.RGBA,
                attachment: this._exportTexture
            }
        ];
        // tw: this is a temporary dirty hack to avoid some weird issue with resizing the framebuffers
        if (this._framebuffer) gl.deleteFramebuffer(this._framebuffer.framebuffer);
        if (this._silhouetteBuffer) gl.deleteFramebuffer(this._silhouetteBuffer.framebuffer);
        if (this._framebuffer && false) {
            twgl.resizeFramebufferInfo(gl, this._framebuffer, attachments, width, height);
            twgl.resizeFramebufferInfo(gl, this._silhouetteBuffer, [{format: gl.RGBA}], width, height);
        } else {
            this._framebuffer = twgl.createFramebufferInfo(gl, attachments, width, height);
            this._silhouetteBuffer = twgl.createFramebufferInfo(gl, [{format: gl.RGBA}], width, height);
        }

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw the old image
        if (oldExportTexture) {
            this._drawToBuffer(oldExportTexture);
        }

        this._silhouettePixels = new Uint8Array(Math.floor(width * height * 4));
        this._silhouetteImageData = this._canvas.getContext('2d').createImageData(width, height);

        this._silhouetteDirty = true;
    }

    setRenderQuality (quality) {
        if (this.renderQuality === quality) {
            return;
        }
        this.renderQuality = quality;
        this._setCanvasSize([Math.round(this._nativeSize[0] * quality), Math.round(this._nativeSize[1] * quality)]);
    }

    /**
     * Set context state to match provided pen attributes.
     * @param {CanvasRenderingContext2D} context - the canvas rendering context to be modified.
     * @param {PenAttributes} penAttributes - the pen attributes to be used.
     * @private
     */
    _setAttributes (context, penAttributes) {
        penAttributes = penAttributes || DefaultPenAttributes;
        const color4f = penAttributes.color4f || DefaultPenAttributes.color4f;
        const diameter = penAttributes.diameter || DefaultPenAttributes.diameter;

        const r = Math.round(color4f[0] * 255);
        const g = Math.round(color4f[1] * 255);
        const b = Math.round(color4f[2] * 255);
        const a = color4f[3]; // Alpha is 0 to 1 (not 0 to 255 like r,g,b)

        context.strokeStyle = `rgba(${r},${g},${b},${a})`;
        context.lineCap = 'round';
        context.lineWidth = diameter;
    }

    /**
     * If there have been pen operations that have dirtied the canvas, update
     * now before someone wants to use our silhouette.
     */
    updateSilhouette () {
        if (this._silhouetteDirty) {
            if (this._canvasDirty) {
                this._drawToBuffer();
            }

            // Render export texture to another framebuffer
            const gl = this._renderer.gl;

            this._renderer.enterDrawRegion(this._toBufferDrawRegionId);

            // Sample the framebuffer's pixels into the silhouette instance
            gl.readPixels(
                0, 0,
                this._canvas.width, this._canvas.height,
                gl.RGBA, gl.UNSIGNED_BYTE, this._silhouettePixels
            );

            this._silhouetteImageData.data.set(this._silhouettePixels);
            this._silhouette.update(this._silhouetteImageData, true /* isPremultiplied */);

            this._silhouetteDirty = false;
        }
    }
}

module.exports = PenSkin;
