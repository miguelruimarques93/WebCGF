var gl = null;
var prg = null;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var nMatrix = mat4.create();

var unitCubeVerticesBuffer;
var unitCubeIndicesBuffer;
var unitCubeNormalsBuffer;

var angle = 0;

function initBuffers() {
    var vertices = [
        // Front face
        -0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,

        // Back face
        -0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,
         0.5,  0.5, -0.5,
        -0.5,  0.5, -0.5,

        // Top face
        -0.5,  0.5, -0.5,
        -0.5,  0.5,  0.5,
         0.5,  0.5,  0.5,
         0.5,  0.5, -0.5,

        // Bottom face
        -0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,
         0.5, -0.5,  0.5,
        -0.5, -0.5,  0.5,

        // Right face
         0.5, -0.5, -0.5,
         0.5,  0.5, -0.5,
         0.5,  0.5,  0.5,
         0.5, -0.5,  0.5,

        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,
        -0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5
    ];
    var indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // left
    ];

    var normals = [
        // Front face
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        // Back face
        0.0,  0.0,  -1.0,
        0.0,  0.0,  -1.0,
        0.0,  0.0,  -1.0,
        0.0,  0.0,  -1.0,

        // Top face
        0.0,  1.0,   0.0,
        0.0,  1.0,   0.0,
        0.0,  1.0,   0.0,
        0.0,  1.0,   0.0,

        // Bottom face
        0.0, -1.0,   0.0,
        0.0, -1.0,   0.0,
        0.0, -1.0,   0.0,
        0.0, -1.0,   0.0,

        // Right face
        1.0,  0.0,   0.0,
        1.0,  0.0,   0.0,
        1.0,  0.0,   0.0,
        1.0,  0.0,   0.0,

        // Left face
        -1.0,  0.0,   0.0,
        -1.0,  0.0,   0.0,
        -1.0,  0.0,   0.0,
        -1.0,  0.0,   0.0
    ];

    unitCubeVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, unitCubeVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    unitCubeNormalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, unitCubeNormalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    unitCubeIndicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, unitCubeIndicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    unitCubeIndicesBuffer.numValues = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function initLights() {
    gl.uniform3fv(prg.uniforms.uLightDirection, [-1, -1, -1]);
    gl.uniform4fv(prg.uniforms.uLightAmbient, [0.3, 0.3, 0.3, 1.0]);
    gl.uniform4fv(prg.uniforms.uLightDiffuse, [1.0, 1.0, 1.0, 1.0]);
    gl.uniform4fv(prg.uniforms.uLightSpecular, [1.0, 1.0, 1.0, 1.0]);

    gl.uniform4fv(prg.uniforms.uMaterialAmbient, [46 / 256, 99 / 256, 191 / 256, 1.0]);
    gl.uniform4fv(prg.uniforms.uMaterialDiffuse, [46 / 256, 99 / 256, 191 / 256, 1.0]);
    gl.uniform4fv(prg.uniforms.uMaterialSpecular, [0.0, 0.0, 0.0]);
    gl.uniform1f(prg.uniforms.uShininess, 10.0);
}

function init() {
    initProgram(
        gl,
        '/resources/lighting/goraud shading/phong-vertex.glsl',
        '/resources/lighting/goraud shading/fragment.glsl',
        function (vxShader, fgShader) {
            prg = compile_program(gl, vxShader, fgShader);
            gl.useProgram(prg);


            initLights();
        }
    );

    initBuffers();

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clearDepth(100.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
}

var matrixStack = [];

function pushMatrix(mat) {
    var clone = mat4.clone(mat);
    matrixStack.push(clone);
}

function popMatrix(mat) {
    if (matrixStack.length == 0) {
        throw "Invalid popMatrix";
    }

    var clone = matrixStack.pop();
    mat4.copy(mat, clone);
}

function drawUnitCube() {
    gl.uniformMatrix4fv(prg.uniforms.uMVMatrix, false, mvMatrix);
    gl.uniformMatrix4fv(prg.uniforms.uPMatrix, false, pMatrix);

    mat4.copy(nMatrix, mvMatrix);
    mat4.invert(nMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);

    gl.uniformMatrix4fv(prg.uniforms.uNMatrix, false, nMatrix);

    gl.useProgram(prg);

    gl.enableVertexAttribArray(prg.attributes.aVertexPosition);
    gl.enableVertexAttribArray(prg.attributes.aVertexNormal);

    //2. bind buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, unitCubeVerticesBuffer);
    gl.vertexAttribPointer(prg.attributes.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, unitCubeNormalsBuffer);
    gl.vertexAttribPointer(prg.attributes.aVertexNormal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, unitCubeIndicesBuffer);
    gl.drawElements(gl.TRIANGLES, unitCubeIndicesBuffer.numValues, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function display() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (prg === null) return;

    mat4.perspective(pMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 10000.0);

    mat4.identity(mvMatrix)
    mat4.lookAt(mvMatrix, vec3.fromValues(-4, 7, -7), vec3.fromValues(4.0, 0.0, 3.0), vec3.fromValues(0.0, 1.0, 0.0));
    // mat4.rotate(mvMatrix, mvMatrix, angle * Math.PI / 180, vec3.fromValues(0, 1, 0));

    mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(4, 0, 3));

    pushMatrix(mvMatrix);

    mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(0, 0.05, 0));
    mat4.scale(mvMatrix, mvMatrix, vec3.fromValues(8, 0.1, 6));

    drawUnitCube();

    popMatrix(mvMatrix);
    pushMatrix(mvMatrix);

    mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(0, 3.7, 0));
    mat4.scale(mvMatrix, mvMatrix, vec3.fromValues(5, 0.3, 3));

    drawUnitCube();

    popMatrix(mvMatrix);

    mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(0, 1.8, 0));

    var legs = [
        vec3.fromValues( 2.2, 0,  1.2),
        vec3.fromValues( 2.2, 0, -1.2),
        vec3.fromValues(-2.2, 0,  1.2),
        vec3.fromValues(-2.2, 0, -1.2)
    ];

    for (var i = 0; i < legs.length; ++i) {
        pushMatrix(mvMatrix);

        mat4.translate(mvMatrix, mvMatrix, legs[i]);
        mat4.scale(mvMatrix, mvMatrix, vec3.fromValues(0.3, 3.5, 0.3));

        drawUnitCube();

        popMatrix(mvMatrix);
    }
}

var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        angle += (90 * elapsed) / 10000.0;
    }
    lastTime = timeNow;
}

function main() {
    gl = initWebGL();

    if (!gl) return;

    init();
    $('body').append(gl.canvas);
    $(window).resize(windowResizeHandler);
    windowResizeHandler();

    function renderLoop() {
        requestAnimationFrame(renderLoop, gl.canvas);
        display();
        animate();
    }

    renderLoop();
}

function windowResizeHandler() {
    resizeCanvas(gl);
}

$(document).ready(main);