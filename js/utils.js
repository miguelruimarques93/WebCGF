/**
 *
 * @param object
 * @param prop
 * @param value
 */
function setProperty(object, prop, value) {
    var fields = prop.split('.');
    var tempObj = object;
    for (var i = 0; i < fields.length - 1; ++i) {
        if (tempObj[fields[i]] === undefined) {
            tempObj[fields[i]] = {};
        }
        tempObj = tempObj[fields[i]];
    }
    tempObj[fields[fields.length - 1]] = value;
}

/**
 *
 * @param gl: WebGL Context
 * @param vertexShader
 * @param fragmentShader
 */
function compile_program(gl, vertexShader, fragmentShader) {
    var prg = gl.createProgram();
    gl.attachShader(prg, vertexShader);
    gl.attachShader(prg, fragmentShader);
    gl.linkProgram(prg);

    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(prg));
        alert('Could not initialise shaders');
    }

    gl.useProgram(prg);

    prg.uniforms = {};

    var numUniforms = gl.getProgramParameter(prg, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < numUniforms; ++i) {
        var uniformInfo = gl.getActiveUniform(prg, i);
        var loc = gl.getUniformLocation(prg, uniformInfo.name);
        setProperty(prg.uniforms, uniformInfo.name, loc);
    }

    prg.attributes = {};

    var numAttributes = gl.getProgramParameter(prg, gl.ACTIVE_ATTRIBUTES);
    for (var i = 0; i < numAttributes; ++i) {
        var attributeInfo = gl.getActiveAttrib(prg, i);
        var loc = gl.getAttribLocation(prg, attributeInfo.name);
        setProperty(prg.attributes, attributeInfo.name, loc);
    }

    return prg;
}

function getShaderAjax(url) {
    return $.get(url);
}

function createShaderFromSource(gl, type, str) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function initProgram(gl, vertexShaderUrl, fragmentShaderUrl, callback) {
    var fgShader, vxShader = null;

    $.when(
        getShaderAjax(fragmentShaderUrl).success(function (fg) {
            fgShader = createShaderFromSource(gl, gl.FRAGMENT_SHADER, fg);
        }),
        getShaderAjax(vertexShaderUrl).success(function (vs) {
            vxShader = createShaderFromSource(gl, gl.VERTEX_SHADER, vs);
        })
    ).then(function () { callback(vxShader, fgShader); });
}

/**
 * initWebGL
 * @param canvas
 * @returns WebGl Context
 */
function initWebGL() {
    var gl = null;

    if (Detector.webgl) {
        var canvas = document.createElement('canvas');
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } else {
        Detector.addGetWebGLMessage();
    }

    return gl;
}

function centerCanvas(canvas) {
    var windowHeight = window.innerHeight;
    var bodyTop = (windowHeight - canvas.offsetHeight) / 2;
    $('body').css('margin-top', bodyTop)
}

function resizeCanvas(gl) {
    if (!gl) return;

    var width = gl.canvas.clientWidth;
    var height = gl.canvas.clientHeight;
    if (gl.canvas.width != width ||
        gl.canvas.height != height) {
        // Change the size of the canvas to match the size it's being displayed
        gl.canvas.width = width;
        gl.canvas.height = height;
    }
}
