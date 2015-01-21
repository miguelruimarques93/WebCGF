/**
 *
 * @param gl {WebGLRenderingContext}
 * @param numDivisions {number}
 * @constructor
 */
function CGFplane(gl, numDivisions) {
    CGFobject.call(this, gl);
    this.numDivisions = numDivisions ? numDivisions + 1.0 : 2.0;
    this.initBuffers();
    this.wireframe = false;
}

CGFplane.prototype = Object.create(CGFobject.prototype);
CGFplane.prototype.constructor = CGFplane;

/**
 * @private
 */
CGFplane.prototype.initBuffers = function () {
    var gl = this.gl;

    var vertices = [];
    var indices = [];
    var normals = [];

    for (var x = 0; x < this.numDivisions; ++x) {
        for (var z = 0; z < this.numDivisions; ++z) {
            vertices.push(x); vertices.push(0); vertices.push(z);
            normals.push(0); normals.push(1); normals.push(0);
        }
    }

    for (var x = 0; x < this.numDivisions - 1; ++x) {
        for (var z = 0; z < this.numDivisions - 1; ++z) {
            indices.push(z * this.numDivisions + x);
            indices.push(z * this.numDivisions + (x + 1));
            indices.push((z + 1) * this.numDivisions + x);

            indices.push(z * this.numDivisions + (x + 1));
            indices.push((z + 1) * this.numDivisions + (x + 1));
            indices.push((z + 1) * this.numDivisions + x);
        }
    }

    this.modelMatrix = mat4.create();

    var scale = 1.0 / (this.numDivisions - 1);
    mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(-0.5, 0.0, -0.5));
    mat4.scale(this.modelMatrix, this.modelMatrix, vec3.fromValues(scale, 1.0, scale));

    this.verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this.normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    this.indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    this.numIndicies = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


};

/**
 *
 * @param shader {CGFshader} (must be applied)
 * @param mvMatrix {mat4}
 */
CGFplane.prototype.display = function (shader, mvMatrix) {
    var gl = this.gl;
    var myMVMatrix = mat4.mul(mat4.create(), mvMatrix, this.modelMatrix);

    var nMatrix = mat4.clone(myMVMatrix);
    mat4.invert(nMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);

    gl.uniformMatrix4fv(shader.uniforms.uMVMatrix, false, myMVMatrix);
    gl.uniformMatrix4fv(shader.uniforms.uNMatrix, false, nMatrix);

    gl.enableVertexAttribArray(shader.attributes.aVertexPosition);
    gl.enableVertexAttribArray(shader.attributes.aVertexNormal);

    //2. bind buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    gl.vertexAttribPointer(shader.attributes.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
    gl.vertexAttribPointer(shader.attributes.aVertexNormal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    gl.drawElements(this.wireframe ? gl.LINES : gl.TRIANGLES, this.numIndicies, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};