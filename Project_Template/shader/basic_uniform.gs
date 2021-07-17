#version 460

layout(points) in;
layout(triangle_strip, max_vertices = 4) out;

uniform float size2;

uniform mat4 ProjectionMatrix;

out vec2 TexCoord;

void main()
{
	mat4 m = ProjectionMatrix;

	gl_Position = m * (vec4(-size2, -size2, 0.0, 0.0) + gl_in[0].gl_Position);

	TexCoord = vec2(0.0, 0.0);
	EmitVertex();


	gl_Position = m * (vec4(size2, -size2, 0.0, 0.0) + gl_in[0].gl_Position);
	TexCoord = vec2(1.0, 0.0);
	EmitVertex();

	gl_Position = m * (vec4(-size2, size2, 0.0, 0.0) + gl_in[0].gl_Position);
	TexCoord = vec2(0.0, 1.0);
	EmitVertex();

	gl_Position = m * (vec4(size2, size2, 0.0, 0.0) + gl_in[0].gl_Position);
	TexCoord = vec2(1.0, 1.0);
	EmitVertex();

	EndPrimitive();
}