var CGFapplication = Class.create({

    initialize: function (element) {
        jQuery.ajaxSetup({async:false});

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
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            Detector.addGetWebGLMessage({parent: this.element});
            return false;
        }

        this.gl = gl;
        this.initialized = true;

        this.element.appendChild(canvas);

        this.initScene();
        this.initInterface();

        return true;
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

