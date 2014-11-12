var gl = null;

var userData = {
    pMatrix: mat4.create(),
    mvMatrix: mat4.create()
};

function centerCanvas(canvas) {
    var windowHeight = window.innerHeight;
    var bodyTop = (windowHeight - canvas.offsetHeight) / 2;
    $('body').css('margin-top', bodyTop)
}

function resizeCanvas() {
    if (gl) {
        var width = gl.canvas.clientWidth;
        var height = gl.canvas.clientHeight;
        if (gl.canvas.width != width ||
            gl.canvas.height != height) {
            // Change the size of the canvas to match the size it's being displayed
            gl.canvas.width = width;
            gl.canvas.height = height;
        }

        centerCanvas(gl.canvas);
    }
}

function init() {
    userData.cone = createConeBuffers();
    initProgram();
}

function getShaderAjax(url) {
    return $.get(url);
}

function createShaderFromSource(type, str) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function initProgram() {
    var fgShader, vxShader = null;

    $.when(
        getShaderAjax('/resources/fragment.glsl').success(function (fg) {
            fgShader = createShaderFromSource(gl.FRAGMENT_SHADER, fg);
        }),
        getShaderAjax('/resources/vertex.glsl').success(function (vs) {
            vxShader = createShaderFromSource(gl.VERTEX_SHADER, vs);
        })
    ).then(function () {
        userData.program = compile_program(gl, vxShader, fgShader);
    });
}

function createConeBuffers() {
    var vertices =
        [
            1.5, 0, 0,
            -1.5, 1, 0,
            -1.5, 0.809017, 0.587785,
            -1.5, 0.309017, 0.951057,
            -1.5, -0.309017, 0.951057,
            -1.5, -0.809017, 0.587785,
            -1.5, -1, 0.0,
            -1.5, -0.809017, -0.587785,
            -1.5, -0.309017, -0.951057,
            -1.5, 0.309017, -0.951057,
            -1.5, 0.809017, -0.587785
        ];

    var indices =
        [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 5,
            0, 5, 6,
            0, 6, 7,
            0, 7, 8,
            0, 8, 9,
            0, 9, 10,
            0, 10, 1
        ];

    var coneVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var coneIBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneIBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return { vbo: coneVBO, ibo: coneIBO, noIndices: indices.length, noVertices: vertices.length };
}

function renderLoop() {
    requestAnimationFrame(renderLoop, gl.canvas);
    display();
}

function display() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    if (userData.i === undefined)
        userData.i = 0;

    if (userData.program !== undefined) {
        mat4.perspective(userData.pMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 10000.0);
        mat4.identity(userData.mvMatrix);
        mat4.translate(userData.mvMatrix, userData.mvMatrix, vec3.fromValues(0.0, 0.0, -5.0));
        mat4.rotate(userData.mvMatrix, userData.mvMatrix, userData.i * Math.PI / 100, vec3.fromValues(1, 1, 1));

        gl.uniformMatrix4fv(userData.program.uniforms.uPMatrix, false, userData.pMatrix);
        gl.uniformMatrix4fv(userData.program.uniforms.uMVMatrix, false, userData.mvMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, userData.cone.vbo);
        gl.vertexAttribPointer(userData.program.attributes.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(userData.program.attributes.aVertexPosition);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, userData.cone.ibo);
        gl.drawElements(gl.LINE_LOOP, userData.cone.noIndices, gl.UNSIGNED_SHORT, 0);

        userData.i += 1;
    }
}

$(document).ready(function () {
    gl = initWebGL();
    if (gl) {
        init();
        $('body').append(gl.canvas);
        $('canvas').resize(resizeCanvas);

        resizeCanvas();
        renderLoop();
    }
});
