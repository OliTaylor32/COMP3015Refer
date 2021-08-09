#version 460

#define PI 3.14159265

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

//Cel-Shading Uniforms
uniform int levels;
uniform float scaleFactor;

uniform int RenderMode; //0 - Standard, 1 - Skybox, 2 - point sprites, 3 - Noise. 

//For Point Sprites
uniform sampler2D spriteTex;

//For noise effects
uniform vec4 Color;
//uniform sampler2D NoiseTex;
uniform vec4 BaseColor = vec4(1.0, 1.0, 1.0, 1.0);
uniform vec4 ErosionColor = vec4(0.0, 0.0, 0.0, 0.0);
uniform float CutOff;

uniform bool CelShade;

layout (location = 0) out vec4 FragColor;

layout (binding = 0) uniform sampler2D Tex1;
layout (binding = 1) uniform sampler2D Tex2;
layout (binding = 2) uniform samplerCube SkyBoxTex;
layout (binding = 3) uniform sampler2D NoiseTex;

vec3 blinnPhong(vec3 totalColor)
{

	vec3 s = normalize(vec3(LightPosition.xyz - Position));
	float sDotN = max( dot(s, Normal), 0.0 );

	vec3 ambient = La * Ka * totalColor;
	
	if(CelShade == true)
	{
		vec3 diffuse = Kd * floor(sDotN * levels) * scaleFactor * totalColor;
		return (diffuse + ambient);
	}
	else
	{
		vec3 specular = vec3(0.0);
		if(sDotN > 0.1)
		{
			vec3 v = normalize(-Position);
			vec3 h = normalize(v + s);
			specular = Ks * pow(max(dot(h, Normal), 0.0), Shininess);
		}

		vec3 diffuse = Ld * Kd * sDotN * totalColor;

		return (diffuse + ambient + specular);
	}
}

float NoiseGenerator()
{
	vec4 noise = texture(NoiseTex, TexCoord);
	float t = (cos(noise.a * PI) + 1.0) / 2.0;
	return (mix(BaseColor, ErosionColor, t)).a;
}

void main() {

	vec3 skyColor = texture(SkyBoxTex, normalize(Vec)).rgb;

	vec4 texColor = texture(Tex1, TexCoord);
	vec4 texColor2 = texture(Tex2, TexCoord);
	vec3 totalColor = mix(texColor.rgb, texColor2.rgb, texColor2.a);

	if(RenderMode == 1)
	{
		FragColor = vec4(skyColor, 1); //Skybox
	}
	else if (RenderMode == 0)
	{
		if(texColor2.a + texColor.a < 0.15)
			discard;
		else
		{
			FragColor = vec4(blinnPhong(totalColor), 0.0);
		}
	}
	else if (RenderMode == 2)
	{
		FragColor = texture(spriteTex, TexCoord);
	}
	else
	{
		if(texColor2.a + texColor.a < 0.15 || NoiseGenerator() < CutOff)
			discard;
		else
		{
			FragColor = vec4(blinnPhong(totalColor), 1.0);
		}
	}

}
