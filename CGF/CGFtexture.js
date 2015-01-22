/**
 * CGFtexture
 * @param gl {WebGLRenderingContext}
 * @param url {String}
 * @constructor
 */
function CGFtexture(gl, url) {
    this.texId = -1;
    this.gl = gl;

    this.texId = gl.createTexture();
    this.image = new Image();
    this.image.crossOrigin = "anonymous";
    var self = this;
    this.image.onload = function () {
        console.log("Texture loaded: " + self.image.src);

        self.gl.activeTexture(gl.TEXTURE_2D, gl.TEXTURE0);
        self.gl.bindTexture(gl.TEXTURE_2D, self.texId);
        self.gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.image);
        self.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        self.gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        self.gl.generateMipmap(gl.TEXTURE_2D);
    };
    this.image.src = url;
}

/**
 * Binds the texture to the current TEXTURE_2D.
 */
CGFtexture.prototype.bind = function () {
    if (this.texID != -1)
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texID)
};

/**
 * Unbinds the current binded texture.
 */
CGFtexture.prototype.unbind = function () {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};