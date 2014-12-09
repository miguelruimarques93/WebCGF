/**
 *
 * @param object
 * @param prop
 * @param value
 */
function setProperty(object, prop, value) {
    var fields = prop.split(/[\.\[\]]/).filter(function(elem) { return elem.length > 0; })
    var tempObj = object;
    for (var i = 0; i < fields.length - 1; ++i) {
        if (tempObj[fields[i]] === undefined) {
            tempObj[fields[i]] = {};
        }
        tempObj = tempObj[fields[i]];
    }
    tempObj[fields[fields.length - 1]] = value;
}

var CGFshader = Class.create({
    initialize: function (gl, vertexURL, fragmentURL) {
        this.gl = gl;
        if (vertexURL != undefined && fragmentURL != undefined) {
            this.init(vertexURL, fragmentURL);
        }
    },

    init: function (vertexURL, fragmentURL) {
        var fgShader, vxShader = null;
        var self = this;

        jQuery.when(
            jQuery.get(fragmentURL).success(function (fg) {
                fgShader = self.createShaderFromSource(self.gl.FRAGMENT_SHADER, fg);
            }),
            jQuery.get(vertexURL).success(function (vs) {
                vxShader = self.createShaderFromSource(self.gl.VERTEX_SHADER, vs);
            })
        ).then(function () { self.compile_program(vxShader, fgShader); })
    },

    createShaderFromSource: function (type, str) {
        var shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, str);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    },

    compile_program: function (vertexShader, fragmentShader) {
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
    },

    update: function () {
    },

    bind: function () {
        this.gl.useProgram(this.program);
    },

    unbind: function () {
        this.gl.useProgram(null);
    }
});