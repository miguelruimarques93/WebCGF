/**
 * CGFinterface
 * @constructor
 */
function CGFinterface() {
    this.mouse = vec2.create();
    this.prevMouse = vec2.create();
    this.mouseButtons = [false, false, false];
    this.activeCamera = null;
}

/**
 *
 * @param application {CGFapplication}
 */
CGFinterface.prototype.init = function (application) {
    console.log("Initializing Interface");

    var canvas = application.gl.canvas;
    var self = this;

    canvas.addEventListener("mousedown", function (ev) { ev.preventDefault(); ev.stopPropagation(); self.processMouseDown(ev); } );
    canvas.addEventListener("mouseup", function (ev) { ev.preventDefault(); ev.stopPropagation(); self.processMouseUp(ev); } );
    canvas.addEventListener("mousemove", function (ev) { ev.preventDefault(); ev.stopPropagation(); self.processMouseMove(ev); } );

    return true;
};

CGFinterface.prototype.update = function () {

};

/**
 * setActiveCamera
 * @param camera {CGFcamera}
 */
CGFinterface.prototype.setActiveCamera = function (camera) {
    this.activeCamera = camera;
};

/**
 *
 */
CGFinterface.prototype.processMouse = function () {
    if (this.activeCamera) {
        var displacement = vec2.subtract(vec2.create(), this.mouse, this.prevMouse);

        if (this.mouseButtons[0]) { // pressing Left
            this.activeCamera.rotate(CGFcameraAxis.X, displacement[1] * 0.5 * Math.PI / 180.0);
            this.activeCamera.rotate(CGFcameraAxis.Y, -displacement[0] * 0.5 * Math.PI / 180.0);
        } else if (this.mouseButtons[2]) { // pressing Right
            this.activeCamera.translate([-displacement[0] * 0.05, -displacement[1] * 0.05, 0]);
        } else if (this.mouseButtons[1]) { // pressing middle
            this.activeCamera.translate([0, 0, displacement[1] * 0.05]);
        }
    }
};

/**
 *
 * @param event {Event}
 */
CGFinterface.prototype.processMouseMove = function (event) {
    this.prevMouse[0] = this.mouse[0];
    this.prevMouse[1] = this.mouse[1];
    this.mouse[0] = event.pageX;
    this.mouse[1] = event.pageY;

    this.processMouse();
};

/**
 *
 * @param event {Event}
 */
CGFinterface.prototype.processMouseDown = function (event) {
    var button = event.which; // 1 - left, 2 - middle, 3 - right
    this.mouseButtons[button - 1] = true;

    this.prevMouse[0] = this.mouse[0];
    this.prevMouse[0] = this.mouse[0];
    this.mouse[0] = event.pageX;
    this.mouse[1] = event.pageY;
};

/**
 *
 * @param event {Event}
 */
CGFinterface.prototype.processMouseUp = function (event) {
    var button = event.which; // 1 - left, 2 - middle, 3 - right
    this.mouseButtons[button - 1] = false;

    this.prevMouse[0] = this.mouse[0];
    this.prevMouse[0] = this.mouse[0];
    this.mouse[0] = event.pageX;
    this.mouse[1] = event.pageY;
};