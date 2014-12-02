var CGFscene = Class.create({
    init: function (application) {
        console.log("Initializing Scene");
    },
    update: function () {

    },
    display: function (gl) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
    }
});