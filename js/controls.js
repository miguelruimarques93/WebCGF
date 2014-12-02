function Controls(activeCamera) {
    this.mouse = vec2.create();
    this.prevMouse = vec2.create();
    this.mouseButtons = [false, false, false];
    this.activeCamera = activeCamera;
}

Controls.prototype.processMouse = function () {
    if (this.activeCamera) {
        var displacement = vec2.subtract(vec2.create(), this.mouse, this.prevMouse);

        if (this.mouseButtons[0]) { // pressing Left
            console.log(displacement);
            this.activeCamera.rotate(displacement[1] * 0.5 * 0.0174532925, [1,0,0]);
            this.activeCamera.rotate(-displacement[0] * 0.5 * 0.0174532925, [0,1,0]);
        } else if (this.mouseButtons[2]) { // pressing Right
            console.log([-displacement[0] * 0.05, displacement[1] * 0.05, 0]);
            this.activeCamera.translate([-displacement[0] * 0.05, -displacement[1] * 0.05, 0]);
        } else if (this.mouseButtons[1]) { // pressing middle
            console.log([0, 0, displacement[1] * 0.05]);
            this.activeCamera.translate([0, 0, displacement[1] * 0.05]);
        }
    }
};

Controls.prototype.processMouseMove = function (event) {
    this.prevMouse[0] = this.mouse[0];
    this.prevMouse[1] = this.mouse[1];
    this.mouse[0] = event.pageX;
    this.mouse[1] = event.pageY;

    this.processMouse();
};

Controls.prototype.processMouseDown = function (event) {
    var button = event.which; // 1 - left, 2 - middle, 3 - right
    this.mouseButtons[button - 1] = true;

    this.prevMouse[0] = this.mouse[0];
    this.prevMouse[0] = this.mouse[0];
    this.mouse[0] = event.pageX;
    this.mouse[1] = event.pageY;
};

Controls.prototype.processMouseUp = function (event) {
    var button = event.which; // 1 - left, 2 - middle, 3 - right
    this.mouseButtons[button - 1] = false;

    this.prevMouse[0] = this.mouse[0];
    this.prevMouse[0] = this.mouse[0];
    this.mouse[0] = event.pageX;
    this.mouse[1] = event.pageY;
};