/**
 * CGFapplication
 * @param element {HTMLElement}
 * @constructor
 */
function CGFapplication(element) {
    this.element = element;
    this.initialized = false;
    this.gl = null;
}

/**
 *
 * @returns {boolean}
 */
CGFapplication.prototype.init = function () {
    if (this.initialized) {
        return true;
    }

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage({parent: this.element});
        return false;
    }

    var canvas = document.createElement("canvas");
    this.gl = canvas.getContext("webgl", {antialias: true}) || canvas.getContext("experimental-webgl", {antialias: true});

    if (!this.gl) {
        Detector.addGetWebGLMessage({parent: this.element});
        return false;
    }

    this.initialized = true;
    this.element.appendChild(this.gl.canvas);

    this.initScene();
    this.initInterface();

    window.addEventListener("resize", this.resizeCanvas(this.gl));
    this.resizeCanvas(this.gl)();

    return true;
};

/**
 *
 * @param gl {WebGLRenderingContext}
 */
CGFapplication.prototype.resizeCanvas = function (gl) {
    return function () {
        console.log("resize");

        if (!gl) return;

        var width = window.innerWidth;
        var height = window.innerHeight;
        console.log("clientWidth: " + width + ", clientHeight: " + height);
        if (gl.canvas.width != width || gl.canvas.height != height) {
            console.log("width: " + gl.canvas.width + ", height: " + gl.canvas.height);
            // Change the size of the canvas to match the size it's being displayed
            gl.canvas.width = width;
            gl.canvas.height = height;
        }
    }
};

/**
 *
 * @param scene {CGFscene}
 */
CGFapplication.prototype.setScene = function (scene) {
    this.scene = scene;
    if (this.initialized) {
        this.scene.init(this);
    }
};

/**
 *
 * @param iFace {CGFinterface}
 */
CGFapplication.prototype.setInterface = function (iFace) {
    this.interface = iFace;
    if (this.initialized) {
        this.interface.init(this);
    }
};

/**
 *
 * @returns {boolean}
 */
CGFapplication.prototype.initScene = function () {
    if (this.scene && this.initialized) {
        return this.scene.init(this);
    }
    return false;
};

/**
 *
 * @returns {boolean}
 */
CGFapplication.prototype.initInterface = function () {
    if (this.interface && this.initialized) {
        return this.interface.init(this);
    }
    return false;
};

/**
 *
 */
CGFapplication.prototype.run = function () {
    var gl = this.gl;
    var self = this;

    function renderLoop() {
        requestAnimationFrame(renderLoop, gl.canvas);

        if (self.interface) {
            self.interface.update();
        }

        if (self.scene) {
            self.scene.update();
            self.scene.display(gl);
        }
    }

    renderLoop();
};