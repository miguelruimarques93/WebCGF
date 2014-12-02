var CGFcameraAxis = Object.freeze({
    X: vec3.fromValues(1.0, 0.0, 0.0),
    Y: vec3.fromValues(0.0, 1.0, 0.0),
    Z: vec3.fromValues(0.0, 0.0, 1.0)
});

var CGFcamera = Class.create({
    initialize: function (fov, near, far, position, target) {
        this.fov = fov;
        this.near = near;
        this.far = far;
        this.position = vec4.fromValues(position[0], position[1], position[2], 0.0);
        this.target = vec4.fromValues(target[0], target[1], target[2], 0.0);
        this.direction = this.calculateDirection();
        this.up = vec3.fromValues(0.0, 1.0, 0.0);
        this._viewMatrix = mat4.create();
        this._projectionMatrix = mat4.create();
    },

    getViewMatrix: function () {
        mat4.lookAt(this._viewMatrix, this.position, this.target, this.up);
        return this._viewMatrix;
    },

    getProjectionMatrix: function (width, height) {
        var aspect = width / height;
        mat4.perspective(this._projectionMatrix, this.fov, aspect, this.near, this.far);
        return this._projectionMatrix;
    },

    calculateDirection: function () {
        return vec4.normalize(vec4.create(), vec4.subtract(vec4.create(), this.target, this.position));
    },

    setPosition: function (newPosition) {
        vec3.copy(this.position, newPosition);
        this.direction = this.calculateDirection();
    },

    setTarget: function (newTarget) {
        vec3.copy(this.target, newTarget);
        this.direction = this.calculateDirection();
    },

    translate: function (vecValue) {
        var tZ = vec4.scale(vec4.create(), this.direction, -vecValue[2]);
        var tUp = vec4.fromValues(0.0, vecValue[1], 0.0, 0.0);
        var temp = vec3.create();
        vec3.scale(temp, vec3.cross(temp, vec3.fromValues(0, 1, 0), this.direction), vecValue[0]);
        var tLeft = vec4.fromValues(temp[0], temp[1], temp[2], 0);
        var temp1 = vec4.create();
        temp1 = vec4.add(temp1, tZ, vec4.add(temp1, tUp, tLeft));
        vec4.add(this.position, this.position, temp1);
        vec4.add(this.target, this.position, this.direction);
    },

    rotate: function (axis, angle) {
        vec4.transformMat4(this.direction, this.direction, mat4.rotate(mat4.create(), mat4.create(), angle, axis));
        vec4.add(this.target, this.position, this.direction);
    }
});