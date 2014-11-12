//******************************************************************
//
// OpenGL ES 2.0 vertex shader that implements the following
// OpenGL ES 1.1 fixed function pipeline
//
// - compute lighting equation for up to eight directional/point/
// - spot lights
// - transform position to clip coordinates
// - texture coordinate transforms for up to two texture coordinates
// - compute fog factor
// - compute user clip plane dot product (stored as v_ucp_factor)
//
//******************************************************************
#define NUM_TEXTURES            2
#define NUM_LIGHTS              16
#define GLI_FOG_MODE_LINEAR     0
#define GLI_FOG_MODE_EXP        1
#define GLI_FOR_MODE_EXP2       2

struct light {
    vec4    position;
    vec4    ambient_color;
    vec4    diffuse_color;
    vec4    specular_color;
    vec3    spot_direction;
    vec3    attenuation_factors;
    float   spot_exponent;
    float   spot_cutoff_angle;
    bool    compute_distance_attenuation;
};

struct material {
    vec4    ambient_color;
    vec4    diffuse_color;
    vec4    specular_color;
    vec4    emissive_color;
    float   specular_exponent;
};

const float     c_zero = 0.0;
const float     c_one = 1.0;
const int       indx_zero = 0;
const int       indx_one = 1;

uniform mat4    mvp_matrix; // combined model-view + projection matrix
uniform mat4    modelview_matrix;
uniform mat3    inv_modelview_matrix;

uniform mat4    tex_matrix[NUM_TEXTURES];
uniform bool    enable_tex[NUM_TEXTURES];
uniform bool    enable_tex_matrix[NUM_TEXTURES];

uniform material material_state;
uniform vec4     ambient_scene_color;
uniform light    light_state[NUM_LIGHTS];
uniform bool     light_enable_state[NUM_LIGHTS];

uniform int      num_lights;

uniform bool     enable_lighting;
uniform bool     light_model_two_sided;

uniform bool     enable_color_material;

uniform bool     enable_fog;
uniform float    fog_density;
uniform float    fog_start, fog_end;
uniform int      fog_mode;

uniform bool     xform_eye_p;

uniform bool     rescale_normal;
uniform bool     normalize_normal;
uniform float    rescale_normal_factor;

uniform vec4     ucp_eqn;

uniform bool     enable_ucp;

//******************************************************
// vertex attributes - not all of them may be passed in
//******************************************************
attribute vec4  a_position;
attribute vec4  a_texcoord0;
attribute vec4  a_texcoord1;
attribute vec4  a_color;

attribute vec3  a_normal;

//************************************************
// varying variables output by the vertex shader
//************************************************
varying vec4    v_texcoord[NUM_TEXTURES];
varying vec4    v_front_color;
varying vec4    v_back_color;
varying float   v_fog_factor;
varying float   v_ucp_factor;

//************************************************
// temporary variables used by the vertex shader
//************************************************
vec4            p_eye;
vec3            n;
vec4            mat_ambient_color;
vec4            mat_diffuse_color;

vec4 lighting_equation(int i) {
    vec4 computed_color = vec4(c_zero, c_zero, c_zero, c_zero);
    vec4 h_vec;
    float ndotl, ndoth;
    float att_factor;
    vec3 VPpli;

    att_factor = c_one;
    if (light_state[i].position.w != c_one) {
        float spot_factor;
        vec3 att_dist;

        // this is a point or spot light
        // we assume "w" values for PPli and V are the same
        VPpli = light_state[i].position.xyz - p_eye.xyz;
        if (light_state[i].compute_distance_attenuation) {
        	att_dist.x = c_one;
        	att_dist.z = dot(VPpli, VPpli);
        	att_dist.y = sqrt(att_dist.z);
        	att_factor = c_one / dot(att_dist, light_state[i].attenuation_factors);
        }
        VPpli = normalize(VPpli);

        if (light_state[i].spot_cutoff_angle < 180.0) {
        	// compute spot factor
        	spot_factor = dot(-VPpli, light_state[i].spot_direction);
        	if (spot_factor >= cos(radians(light_state[i].spot_cutoff_angle)))
        		spot_factor = pow(spot_factor, light_state[i].spot_exponent);
    		else
    			spot_factor = c_zero;

			att_factor *= spot_factor;
        }
    } else {
    	// directional light
    	VPpli = light_state[i].position.xyz;
    }

    if (att_factor > c_zero) {
    	// process lighting equation --> compute the light color
    	computed_color += (light_state[i].ambient_color * mat_ambient_color);
    	ndotl = max(c_zero, dot(n, VPpli));
    	computed_color += (ndotl * light_state[i].diffuse_color * mat_diffuse_color);
    	h_vec = vec4(normalize(VPpli + vec3(c_zero, c_zero, c_one)), 1.0);
    	ndoth = dot(n, h_vec.xyz);
    	if (ndotl > c_zero) {
    		computed_color += (pow(ndoth, material_state.specular_exponent) * 
    						   material_state.specular_color *
    						   light_state[i].specular_color);
    	}
    	computed_color *= att_factor;
    }
    return computed_color;
}

float compute_fog() {
	float f;

	if (fog_mode == GLI_FOG_MODE_LINEAR)
		f = (fog_end - p_eye.z) / (fog_end - fog_start);
	else if (fog_mode == GLI_FOG_MODE_EXP) 
		f = exp(-(p_eye.z * fog_density));
	else {
		f = p_eye.z * fog_density;
		f = exp(-(f * f));
	}

	f = clamp(f, c_zero, c_one);
	return f;
}

vec4 do_lighting() {
	vec4 vtx_color;
	int j;

	vtx_color = material_state.emissive_color + (mat_ambient_color * ambient_scene_color);
	j = indx_zero;
	for (int i=indx_zero; i < NUM_LIGHTS; i++) {
		if (j >= num_lights)
			break;

		if (light_enable_state[i]) {
			j++;
			vtx_color += lighting_equation(i);
		}
	}

	vtx_color.a = mat_diffuse_color.a;

	return vtx_color;
}

void main() {
	int i, j;

	// do we need to transform P
	if (xform_eye_p)
		p_eye = modelview_matrix * a_position;

	if (enable_lighting) {
		n = inv_modelview_matrix * a_normal;
		if (rescale_normal)
			n = rescale_normal_factor * n;

		if (normalize_normal)
			n = normalize(n);

		mat_ambient_color = enable_color_material ? a_color : material_state.ambient_color;
		mat_diffuse_color = enable_color_material ? a_color : material_state.diffuse_color;

		v_front_color = do_lighting();
		v_back_color = v_front_color;

		// do 2-sided lighting
		if (light_model_two_sided) {
			n = -n;
			v_back_color = do_lighting();	
		}			
	} else {
		v_front_color = a_color;
		v_back_color = a_color;
	}

	v_texcoord[indx_zero] = vec4(c_zero, c_zero, c_zero, c_one);
	if (enable_tex[indx_zero]) {
		if (enable_tex_matrix[indx_zero])
			v_texcoord[indx_zero] = tex_matrix[indx_zero] * a_texcoord0;
		else 
			v_texcoord[indx_zero] = a_texcoord0;
	}

	v_texcoord[indx_one] = vec4(c_zero, c_zero, c_zero, c_one);
	if (enable_tex[indx_one]) {
		if (enable_tex_matrix[indx_one])
			v_texcoord[indx_one] = tex_matrix[indx_one] * a_texcoord1;
		else 
			v_texcoord[indx_one] = a_texcoord1;
	}

	v_ucp_factor = enable_ucp ? dot(p_eye, ucp_eqn) : c_zero;
	v_fog_factor = enable_fog ? compute_fog() : c_one;

	gl_Position = mvp_matrix * a_position;
}