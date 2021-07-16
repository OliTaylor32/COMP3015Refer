#version 460

layout (location = 0) in vec3 VertexPosition;
layout (location = 1) in vec3 VertexNormal;
layout (location = 2) in vec2 VertexTexCoord;

out vec3 Position;
out vec3 Normal;
out vec2 TexCoord;
out vec3 Vec;

uniform mat4 ModelViewMatrix; 
uniform mat3 NormalMatrix; 
uniform mat4 ProjectionMatrix; 
uniform mat4 MVP; 

uniform mat4 RotationMatrix;

void main()
{
	Normal = normalize(NormalMatrix * VertexNormal);
	Position = (ModelViewMatrix * vec4(VertexPosition,1.0)).xyz;

	TexCoord = VertexTexCoord;

	Vec = VertexPosition;

	gl_Position = MVP * vec4(VertexPosition,1.0);
}
