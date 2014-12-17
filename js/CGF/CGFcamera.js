/**
 * Enum for axis
 * @readonly
 * @enum {vec3}
 */
var CGFcameraAxis = Object.freeze({
    X: vec3.fromValues(1.0, 0.0, 0.0),
    Y: vec3.fromValues(0.0, 1.0, 0.0),
    Z: vec3.fromValues(0.0, 0.0, 1.0)
});

/**
 *
 * @param fov {Number}
 * @param near {Number}
 * @param far {Number}
 * @param position {vec3}
 * @param target {vec3}
 * @constructor
 */
function CGFcamera(fov, near, far, position, target) {
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.position = vec4.fromValues(position[0], position[1], position[2], 0.0);
    this.target = vec4.fromValues(target[0], target[1], target[2], 0.0);
    this.direction = this.calculateDirection();

    /**
     *
     * @type {vec3}
     * @private
     */
    this._up = vec3.fromValues(0.0, 1.0, 0.0);

    /**
     *
     * @type {mat4}
     * @private
     */
    this._viewMatrix = mat4.create();

    /**
     *
     * @type {mat4}
     * @private
     */
    this._projectionMatrix = mat4.create();
}

/**
 *
 * @returns {mat4}
 */
CGFcamera.prototype.getViewMatrix = function () {
    mat4.lookAt(this._viewMatrix, this.position, this.target, this._up);
    return this._viewMatrix;
};

/**
 *
 * @param width {number}
 * @param height {number}
 * @returns {mat4}
 */
CGFcamera.prototype.getProjectionMatrix = function (width, height) {
    var aspect = width / height;
    mat4.perspective(this._projectionMatrix, this.fov, aspect, this.near, this.far);
    return this._projectionMatrix;
};

/**
 *
 * @returns {vec4}
 */
CGFcamera.prototype.calculateDirection = function () {
    return vec4.normalize(vec4.create(), vec4.subtract(vec4.create(), this.target, this.position));
};

/**
 *
 * @param newPosition {vec3}
 */
CGFcamera.prototype.setPosition = function (newPosition) {
    vec3.copy(this.position, newPosition);
    this.direction = this.calculateDirection();
};

/**
 *
 * @param newTarget {vec3}
 */
CGFcamera.prototype.setTarget = function (newTarget) {
    vec3.copy(this.target, newTarget);
    this.direction = this.calculateDirection();
};

/**
 *
 * @param vecValue {vec3}
 */
CGFcamera.prototype.translate = function (vecValue) {
    var tZ = vec4.scale(vec4.create(), this.direction, -vecValue[2]);
    var tUp = vec4.fromValues(0.0, vecValue[1], 0.0, 0.0);
    var temp = vec3.create();
    vec3.scale(temp, vec3.cross(temp, vec3.fromValues(0, 1, 0), this.direction), vecValue[0]);
    var tLeft = vec4.fromValues(temp[0], temp[1], temp[2], 0);
    var temp1 = vec4.create();
    temp1 = vec4.add(temp1, tZ, vec4.add(temp1, tUp, tLeft));
    vec4.add(this.position, this.position, temp1);
    vec4.add(this.target, this.position, this.direction);
};

/**
 *
 * @param axis {CGFcameraAxis}
 * @param angle {number}
 */
CGFcamera.prototype.rotate = function (axis, angle) {
    vec4.transformMat4(this.direction, this.direction, mat4.rotate(mat4.create(), mat4.create(), angle, axis));
    vec4.add(this.target, this.position, this.direction);
};