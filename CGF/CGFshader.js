/**
 *
 * @param object
 * @param prop
 * @param value
 */
function setProperty(object, prop, value) {
    var fields = prop.split(/[\.\[\]]/).filter(function (elem) {
        return elem.length > 0;
    })
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
 * @param url {string}
 * @returns {string}
 */
function getStringFromUrl(url) {
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", url, false);
    xmlHttpReq.send();
    return xmlHttpReq.responseText;
}

/**
 * CGFshader
 * @param gl {WebGLRenderingContext}
 * @param vertexURL {string}
 * @param fragmentURL {string}
 * @constructor
 */
function CGFshader(gl, vertexURL, fragmentURL) {
    this.gl = gl;

    /**
     * @type {*}
     */
    this.uniforms = {};

    /**
     * @type {*}
     */
    this.attributes = {};
    if (vertexURL != undefined && fragmentURL != undefined) {
        this.init(vertexURL, fragmentURL);
    }
}

/**
 *
 * @param vertexURL {string}
 * @param fragmentURL {string}
 */
CGFshader.prototype.init = function (vertexURL, fragmentURL) {
    var fgShaderSrc = getStringFromUrl(fragmentURL);
    var vertexShaderSrc = getStringFromUrl(vertexURL);

    var fgShader = this.createShaderFromSource(WebGLRenderingContext.FRAGMENT_SHADER, fgShaderSrc);
    var vxShader = this.createShaderFromSource(WebGLRenderingContext.VERTEX_SHADER, vertexShaderSrc);

    this.compile_program(vxShader, fgShader);
};

/**
 *
 * @param type {number}
 * @param shaderSource {string}
 * @returns {WebGLShader}
 */
CGFshader.prototype.createShaderFromSource = function (type, shaderSource) {
    var shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        alert(this.gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
};

/**
 *
 * @param vertexShader {WebGLShader}
 * @param fragmentShader {WebGLShader}
 */
CGFshader.prototype.compile_program = function (vertexShader, fragmentShader) {
    var gl = this.gl;

    var prg = gl.createProgram();
    gl.attachShader(prg, vertexShader);
    gl.attachShader(prg, fragmentShader);
    gl.linkProgram(prg);

    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(prg));
        alert('Could not initialise shaders');
    }

    this.program = prg;

    gl.useProgram(prg);

    this.uniforms = {};

    var numUniforms = gl.getProgramParameter(prg, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < numUniforms; ++i) {
        var uniformInfo = gl.getActiveUniform(prg, i);
        var loc = gl.getUniformLocation(prg, uniformInfo.name);
        setProperty(this.uniforms, uniformInfo.name, loc);
    }

    this.attributes = {};

    var numAttributes = gl.getProgramParameter(prg, gl.ACTIVE_ATTRIBUTES);
    for (var i = 0; i < numAttributes; ++i) {
        var attributeInfo = gl.getActiveAttrib(prg, i);
        var loc = gl.getAttribLocation(prg, attributeInfo.name);
        setProperty(this.attributes, attributeInfo.name, loc);
    }
};

/**
 *
 */
CGFshader.prototype.update = function () {

};

/**
 *
 */
CGFshader.prototype.bind = function () {
    this.gl.useProgram(this.program);
};

/**
 *
 */
CGFshader.prototype.unbind = function () {
    this.gl.useProgram(null);
};