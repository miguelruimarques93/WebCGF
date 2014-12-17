/**
 * CGFscene
 * @constructor
 */
function CGFscene() {
}

/**
 *
 * @param application {CGFapplication}
 * @returns {boolean}
 */
CGFscene.prototype.init = function (application) {
    console.log("Initializing Scene");
    this.gl = application.gl;
    return true;
};

/**
 *
 */
CGFscene.prototype.update = function () {

};

/**
 *
 * @param gl {WebGLRenderingContext}
 */
CGFscene.prototype.display = function (gl) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
};