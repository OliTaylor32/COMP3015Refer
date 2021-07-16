#version 460

in vec3 Position;
in vec3 Normal;
in vec2 TexCoord;
in vec3 Vec;

uniform vec4 LightPosition;

uniform vec3 Kd; //Diffuse reflection strength
uniform vec3 Ka; //Ambient reflection strength

uniform vec3 Ks; //Specular reflection strength
uniform float Shininess; //Shininess of specular shading

uniform vec3 Ld; //Diffuse Light strength
uniform vec3 La; //Ambient Light strength

uniform mat4 ModelViewMatrix;
uniform mat3 NormalMatrix;
uniform mat4 MVP;

//Toon Shader Uniforms
uniform int levels;
uniform float scaleFactor;

uniform bool SkyBox;

layout (location = 0) out vec4 FragColor;

layout (binding = 0) uniform sampler2D Tex1;
layout (binding = 1) uniform sampler2D Tex2;
layout (binding = 2) uniform samplerCube SkyBoxTex;

void main() {
	vec4 texColor = texture(Tex1, TexCoord);
	vec4 texColor2 = texture(Tex2, TexCoord);
	vec3 totalColor = mix(texColor.rgb, texColor2.rgb, texColor2.a);

	vec3 skyColor = texture(SkyBoxTex, normalize(Vec)).rgb;

	vec3 s = normalize(vec3(LightPosition.xyz - Position));
	float sDotN = max( dot(s, Normal), 0.0 );

	//vec3 diffuse = Ld * Kd * sDotN * totalColor; //Normal shading
	vec3 diffuse = Kd * floor(sDotN * levels) * scaleFactor * totalColor; //Cel-shading

	vec3 ambient = La * Ka * totalColor;

	vec3 specular = vec3(0.0);
	if(sDotN > 0.1)
	{
		vec3 v = normalize(-Position);
		vec3 h = normalize(v + s);
		specular = Ks * pow(max(dot(h, Normal), 0.0), Shininess);
	}

	if(SkyBox == true)
	{
		FragColor = vec4(skyColor, 1); //Skybox
	}
	else{
		if(texColor2.a + texColor.a < 0.15)
			discard;
		else
		{
			//FragColor = vec4((diffuse + ambient + specular), 0.0); //Normal Shading
			FragColor = vec4((diffuse + ambient), 0.0); //Cel-Shading
		}
	}

}
