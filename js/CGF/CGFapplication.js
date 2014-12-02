var CGFapplication = Class.create({

    initialize: function (element) {
        jQuery.ajaxSetup({async: false});

        this.element = element;
        this.initialized = false;
        this.gl = null;
    },

    init: function () {
        // Init context
        var gl = null;

        if (!Detector.webgl) {
            Detector.addGetWebGLMessage({parent: this.element});
            return false;
        }

        var canvas = document.createElement('canvas');
        gl = canvas.getContext("webgl", {antialias: true}) || canvas.getContext("experimental-webgl", {antialias: true});

        if (!gl) {
            Detector.addGetWebGLMessage({parent: this.element});
            return false;
        }

        this.gl = gl;
        this.initialized = true;

        this.element.appendChild(this.gl.canvas);

        this.initScene();
        this.initInterface();

        jQuery(window).resize(this.resizeCanvas);
        this.resizeCanvas();

        return true;
    },

    resizeCanvas: function () {
        if (!this.gl) return;

        var width = this.gl.canvas.clientWidth;
        var height = this.gl.canvas.clientHeight;
        if (this.gl.canvas.width != width ||
            this.gl.canvas.height != height) {
            // Change the size of the canvas to match the size it's being displayed
            this.gl.canvas.width = width;
            this.gl.canvas.height = height;
        }
    },

    update: function () {

    },

    setScene: function (scene) {
        this.scene = scene;
        if (this.initialized) {
            this.scene.init(this);
        }
    },

    setInterface: function (i) {
        this.interface = i;
        if (this.initialized) {
            this.interface.init(this);
        }
    },

    initScene: function () {
        if (this.scene && this.initialized) {
            return this.scene.init(this);
        }
        return false;
    },

    initInterface: function () {
        if (this.interface && this.initialized) {
            return this.interface.init(this);
        }
        return false;
    },

    run: function () {
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
    }
});

