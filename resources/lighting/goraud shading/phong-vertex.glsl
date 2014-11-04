attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float uShininess;
uniform vec3 uLightDirection;

uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;

varying vec4 vFinalColor;

void main() {

    // Transformed Vertex position
    vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);

    // Transformed normal position
	vec3 N = normalize(vec3(uNMatrix * vec4(aVertexNormal, 1.0)));

	// Normalize light to calculate lambertTerm
	vec3 L = normalize(uLightDirection);

    // Lambert's cosine law
	float lambertTerm = dot(N, -L);

    vec4 Ia = uLightAmbient * uMaterialAmbient;

    vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);

    vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

    if (lambertTerm > 0.0) {
        Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;

        vec3 eyeVec = -vec3(vertex.xyz);
        vec3 E = normalize(eyeVec);
        vec3 R = reflect(L, N);
        float specular = pow( max( dot(R, E), 0.0 ), uShininess);

        Is = uLightSpecular * uMaterialSpecular * specular;
    }

	vFinalColor = Ia + Id + Is;
	vFinalColor.a = 1.0;

	gl_Position = uPMatrix * vertex;
}
