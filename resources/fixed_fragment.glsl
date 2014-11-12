
precision mediump float;

#define NUM_TEXTURES 2

varying vec4    v_texcoord[NUM_TEXTURES];
varying vec4    v_front_color;
varying vec4    v_back_color;
varying float   v_fog_factor;
varying float   v_ucp_factor;

void main() {
	gl_FragColor = v_front_color;
}