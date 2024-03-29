function UnitCube(gl) {
    CGFobject.call(this, gl);
    this.initBuffers();
    this.wireframe = false;
}

UnitCube.prototype = Object.create(CGFobject.prototype);
UnitCube.prototype.constructor = UnitCube;

UnitCube.prototype = {

    /**
     * @private
     */
    initBuffers: function () {
        var gl = this.gl;

        var vertices = [
            // Front face
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,

            // Back face
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,

            // Top face
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,

            // Bottom face
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,

            // Right face
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,

            // Left face
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5
        ];
        var indices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23    // left
        ];
        var normals = [
            // Front face
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            // Back face
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            // Top face
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Bottom face
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            // Right face
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            // Left face
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0
        ];

        this.unitCubeVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.unitCubeVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.unitCubeNormalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.unitCubeNormalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        this.unitCubeIndicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.unitCubeIndicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        this.unitCubeIndicesBuffer.numValues = indices.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    },

    /**
     *
     * @param shader {CGFshader}
     * @param mvMatrix {mat4}
     */
    display: function (shader, mvMatrix) {
        var gl = this.gl;

        var nMatrix = mat4.create();
        mat4.copy(nMatrix, mvMatrix);
        mat4.invert(nMatrix, nMatrix);
        mat4.transpose(nMatrix, nMatrix);

        gl.uniformMatrix4fv(shader.uniforms.uMVMatrix, false, mvMatrix);
        gl.uniformMatrix4fv(shader.uniforms.uNMatrix, false, nMatrix);

        gl.enableVertexAttribArray(shader.attributes.aVertexPosition);
        gl.enableVertexAttribArray(shader.attributes.aVertexNormal);

        //2. bind buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.unitCubeVerticesBuffer);
        gl.vertexAttribPointer(shader.attributes.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.unitCubeNormalsBuffer);
        gl.vertexAttribPointer(shader.attributes.aVertexNormal, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.unitCubeIndicesBuffer);
        gl.drawElements(this.wireframe ? gl.LINES : gl.TRIANGLES, this.unitCubeIndicesBuffer.numValues, gl.UNSIGNED_SHORT, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
};

/**
 *
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTable(gl) {
    CGFobject.call(this, gl);
    this.unitCube = new UnitCube(gl);
}

MyTable.prototype = Object.create(CGFobject.prototype);
MyTable.prototype.constructor = MyTable;

/**
 *
 * @param shader {CGFshader}
 * @param mvMatrix {mat4}
 */
MyTable.prototype.display = function (shader, pMvMatrix) {
    var mvMatrix = mat4.translate(mat4.create(), pMvMatrix, vec3.fromValues(4, 0, 3));

    var floorModelViewMatrix = mat4.create();

    mat4.translate(floorModelViewMatrix, mvMatrix, vec3.fromValues(0, 0.05, 0));
    mat4.scale(floorModelViewMatrix, floorModelViewMatrix, vec3.fromValues(8, 0.1, 6));

    this.unitCube.display(shader, floorModelViewMatrix);

    var TopModelViewMatrix = mat4.create();

    mat4.translate(TopModelViewMatrix, mvMatrix, vec3.fromValues(0, 3.7, 0));
    mat4.scale(TopModelViewMatrix, TopModelViewMatrix, vec3.fromValues(5, 0.3, 3));

    this.unitCube.display(shader, TopModelViewMatrix);

    var legsModelViewMatrix = mat4.translate(mat4.create(), mvMatrix, vec3.fromValues(0, 1.8, 0));

    var legs = [
        vec3.fromValues(2.2, 0, 1.2),
        vec3.fromValues(2.2, 0, -1.2),
        vec3.fromValues(-2.2, 0, 1.2),
        vec3.fromValues(-2.2, 0, -1.2)
    ];

    for (var i = 0; i < legs.length; ++i) {
        var thisLegModelViewMatrix = mat4.copy(mat4.create(), legsModelViewMatrix);

        mat4.translate(thisLegModelViewMatrix, thisLegModelViewMatrix, legs[i]);
        mat4.scale(thisLegModelViewMatrix, thisLegModelViewMatrix, vec3.fromValues(0.3, 3.5, 0.3));

        this.unitCube.display(shader, thisLegModelViewMatrix);
    }
};

function MyScene() {
    CGFscene.call(this);
}

MyScene.prototype = Object.create(CGFscene.prototype);
MyScene.prototype.constructor = MyScene;

MyScene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);
    this.shader = new CGFshader(
        this.gl,
        '/resources/lighting/goraud shading/multiple_light-phong-vertex.glsl',
        '/resources/lighting/goraud shading/fragment.glsl'
    );

    this.initLights();

    this.initCameras();

    this.table = new MyTable(this.gl);

    this.wall = new CGFplane(this.gl,100);
    this.wall.wireframe = false;

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
};

// MyScene.prototype.update = function () { CGFscene.prototype.update.call(this); }

MyScene.prototype.initLights = function () {
    var gl = this.gl;

    this.shader.bind();

    gl.uniform1i(this.shader.uniforms.uLight[0].enabled, true);
    gl.uniform4fv(this.shader.uniforms.uLight[0].position, [3, 10, 3, 1]);
    gl.uniform4fv(this.shader.uniforms.uLight[0].ambient, [0.1, 0.1, 0.1, 1.0]);
    gl.uniform4fv(this.shader.uniforms.uLight[0].diffuse, [0.5, 0.5, 0.5, 1.0]);
    gl.uniform4fv(this.shader.uniforms.uLight[0].specular, [0.5, 0.5, 0.5, 1.0]);
    gl.uniform3fv(this.shader.uniforms.uLight[0].spot_direction, [0, -1, 0]);
    gl.uniform1f(this.shader.uniforms.uLight[0].spot_exponent, 10);
    gl.uniform1f(this.shader.uniforms.uLight[0].spot_cutoff, 20);
    gl.uniform1f(this.shader.uniforms.uLight[0].constant_attenuation, 1.0);
    gl.uniform1f(this.shader.uniforms.uLight[0].linear_attenuation, 0);
    gl.uniform1f(this.shader.uniforms.uLight[0].quadratic_attenuation, 0);

    gl.uniform1i(this.shader.uniforms.uLight[1].enabled, true);
    gl.uniform4fv(this.shader.uniforms.uLight[1].position, [1, 1, 1, 0]);
    gl.uniform4fv(this.shader.uniforms.uLight[1].ambient, [0.1, 0.1, 0.1, 1.0]);
    gl.uniform4fv(this.shader.uniforms.uLight[1].diffuse, [0.2, 0.2, 0.2, 1.0]);
    gl.uniform4fv(this.shader.uniforms.uLight[1].specular, [0.0, 0.0, 0.0, 1.0]);
    gl.uniform3fv(this.shader.uniforms.uLight[1].spot_direction, [-1, 0, 0]);
    gl.uniform1f(this.shader.uniforms.uLight[1].spot_exponent, 1);
    gl.uniform1f(this.shader.uniforms.uLight[1].spot_cutoff, 89);
    gl.uniform1f(this.shader.uniforms.uLight[1].constant_attenuation, 1);
    gl.uniform1f(this.shader.uniforms.uLight[1].linear_attenuation, 0);
    gl.uniform1f(this.shader.uniforms.uLight[1].quadratic_attenuation, 0);

    for (var i = 2; i < 4; ++i) {
        gl.uniform1i(this.shader.uniforms.uLight[i].enabled, false);
    }

    gl.uniform4fv(this.shader.uniforms.uFrontMaterial.ambient, [46 / 256, 99 / 256, 191 / 256, 1.0]);
    gl.uniform4fv(this.shader.uniforms.uFrontMaterial.diffuse, [46 / 256, 99 / 256, 191 / 256, 1.0]);
    gl.uniform4fv(this.shader.uniforms.uFrontMaterial.specular, [46 / 256, 99 / 256, 191 / 256, 1.0]);
    gl.uniform1f(this.shader.uniforms.uFrontMaterial.shininess, 10.0);

    this.shader.unbind();
};

MyScene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(25, 15, 25), vec3.fromValues(4, 0, 3));
};

MyScene.prototype.display = function (gl) {
    // this.gl = gl;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var pMatrix = this.camera.getProjectionMatrix(gl.canvas.width, gl.canvas.height);
    mat4.mul(pMatrix, pMatrix, this.camera.getViewMatrix());

    var mvMatrix = mat4.create();

    this.shader.bind();

    gl.uniformMatrix4fv(this.shader.uniforms.uPMatrix, false, pMatrix);

    gl.uniform4fv(this.shader.uniforms.uFrontMaterial.ambient, [46 / 256, 99 / 256, 191 / 256, 1.0]);
    gl.uniform4fv(this.shader.uniforms.uFrontMaterial.diffuse, [46 / 256, 99 / 256, 191 / 256, 1.0]);
    gl.uniform4fv(this.shader.uniforms.uFrontMaterial.specular, [46 / 256, 99 / 256, 191 / 256, 1.0]);
    gl.uniform1f(this.shader.uniforms.uFrontMaterial.shininess, 10.0);

    this.table.display(this.shader, mvMatrix);

    gl.uniform4fv(this.shader.uniforms.uFrontMaterial.ambient, [100 / 256, 100 / 256, 100 / 256, 1.0]);
    gl.uniform4fv(this.shader.uniforms.uFrontMaterial.diffuse, [100 / 256, 100 / 256, 100 / 256, 1.0]);
    gl.uniform4fv(this.shader.uniforms.uFrontMaterial.specular, [0.5, 0.5, 0.5, 1.0]);
    gl.uniform1f(this.shader.uniforms.uFrontMaterial.shininess, 100.0);


    var mvMatrix1 = mat4.clone(mvMatrix);

    mat4.translate(mvMatrix1, mvMatrix1, [0, 3, 3]);
    mat4.rotate(mvMatrix1, mvMatrix1, -Math.PI / 2, [0, 0, 1]);
    mat4.scale(mvMatrix1, mvMatrix1, [6, 1, 6]);
    this.wall.display(this.shader, mvMatrix1);

    mat4.translate(mvMatrix1, mvMatrix, [4, 3, 0]);
    mat4.rotate(mvMatrix1, mvMatrix1, Math.PI / 2, [1, 0, 0]);
    mat4.scale(mvMatrix1, mvMatrix1, [8, 1, 6]);
    this.wall.display(this.shader, mvMatrix1);

    mat4.translate(mvMatrix1, mvMatrix, [4, 0, 3]);
    // mat4.rotate(mvMatrix1, mvMatrix1, Math.PI / 2, [1, 0, 0]);
    mat4.scale(mvMatrix1, mvMatrix1, [8,1,6]);
    this.wall.display(this.shader, mvMatrix1);

    this.shader.unbind();
};

var app = new CGFapplication(document.body);
var myScene = new MyScene();
var cgfInterface = new CGFinterface();

app.init();

app.setScene(myScene);
app.setInterface(cgfInterface);

cgfInterface.setActiveCamera(myScene.camera);

app.run();

