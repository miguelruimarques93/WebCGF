attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

struct lightProperties {
    vec4 position;                  // Default: (0, 0, 1, 0)
    vec4 ambient;                   // Default: (0, 0, 0, 1)
    vec4 diffuse;                   // Default: (0, 0, 0, 1)
    vec4 specular;                  // Default: (0, 0, 0, 1)
    vec3 spot_direction;            // Default: (0, 0, -1)
    float spot_exponent;            // Default: 0 (possible values [0, 128]
    float spot_cutoff;              // Default: 180 (possible values [0, 90] or 180)
    float constant_attenuation;     // Default: 1 (value must be >= 0)
    float linear_attenuation;       // Default: 0 (value must be >= 0)
    float quadratic_attenuation;    // Default: 0 (value must be >= 0)
    bool enabled;                   // Deafult: false
};

struct materialProperties {
    vec4 ambient;                   // Default: (0, 0, 0, 1)
    vec4 diffuse;                   // Default: (0, 0, 0, 1)
    vec4 specular;                  // Default: (0, 0, 0, 1)
    vec4 emission;                  // Default: (0, 0, 0, 1)
    float shininess;                // Default: 0 (possible values [0, 128])
};

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform bool uLightEnabled;
uniform bool uLightModelTwoSided;

// uniform vec4 uGlobalAmbient;

#define NUMBER_OF_LIGHTS 4

uniform lightProperties uLight[NUMBER_OF_LIGHTS];

uniform materialProperties uFrontMaterial;
uniform materialProperties uBackMaterial;

varying vec4 vFinalColor;

vec4 lighting(vec4 vertex, vec3 E, vec3 N) {

    vec4 result;

    for (int i = 0; i < NUMBER_OF_LIGHTS; i++) {
        if (uLight[i].enabled) {
            // Normalize light to calculate lambertTerm
            vec3 L = normalize(uLight[i].position.xyz); // Should be uLight.direction (Assumes uLight.position.w = 0) TODO Implement

            // Lambert's cosine law
            float lambertTerm = dot(N, -L);

            vec4 Ia = uLight[i].ambient * uFrontMaterial.ambient;

            vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);

            vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

            if (lambertTerm > 0.0) {
                Id = uLight[i].diffuse * uFrontMaterial.diffuse * lambertTerm;

                vec3 R = reflect(L, N);
                float specular = pow( max( dot(R, E), 0.0 ), uFrontMaterial.shininess);

                Is = uLight[i].specular * uFrontMaterial.specular * specular;
            }
            result += Ia + Id + Is;
        }
    }

    result.a = 1.0;
    return result;
}

void main() {

    // Transformed Vertex position
    vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);

    // Transformed normal position
	vec3 N = normalize(vec3(uNMatrix * vec4(aVertexNormal, 1.0)));

    vec3 eyeVec = -vec3(vertex.xyz);
    vec3 E = normalize(eyeVec);

    vFinalColor = lighting(vertex, E, N);

	gl_Position = uPMatrix * vertex;
}

