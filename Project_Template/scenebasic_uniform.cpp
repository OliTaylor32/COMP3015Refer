#include "scenebasic_uniform.h"

#include <cstdio>
#include <cstdlib>

#include <string>
using std::string;

#include <iostream>
using std::cerr;
using std::endl;

#include <glm/gtc/matrix_transform.hpp>
#include "helper/glutils.h"

#include "helper/texture.h"

using glm::vec3;
using glm::mat4;

SceneBasic_Uniform::SceneBasic_Uniform() : torus(0.7f, 0.3f, 100, 100), angle(0.0f), tPrev(0.0f), rotSpeed(glm::pi<float>() / 8.0f), sky(100.0f) {}

void SceneBasic_Uniform::initScene()
{
    compile();

    glEnable(GL_DEPTH_TEST);

    model = mat4(1.0f);

    model = glm::rotate(model, glm::radians(-35.0f), vec3(1.0f, 0.0f, 0.0f));

    view = glm::lookAt(vec3(0.0f, 0.0f, 2.0f), vec3(0.0f, 0.0f, 0.0f), vec3(0.0f, 1.0f, 0.0f));

    projection = mat4(1.0f);

    prog.setUniform("LightPosition", view * glm::vec4(5.0f, 5.0f, 2.0f, 1.0f));
    prog.setUniform("Kd", 1.0f, 1.0f, 1.0f);
    prog.setUniform("Ld", 1.0f, 1.0f, 1.0f);

    prog.setUniform("Ka", 1.0f, 1.0f, 1.0f);
    prog.setUniform("Ks", 0.0f, 0.0f, 0.0f);
    prog.setUniform("Shininess", 32.0f);
    prog.setUniform("La", 0.2f, 0.2f, 0.2f);
    prog.setUniform("levels", 4); //CelShading
    prog.setUniform("scaleFactor", 0.25f); //CelShading (1.0 / levels).

    GLuint texID = Texture::loadTexture("../Project_Template/media/texture/brick1.jpg");
    GLuint texID2 = Texture::loadTexture("../Project_Template/media/texture/moss.png");

    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, texID);

    glActiveTexture(GL_TEXTURE1);
    glBindTexture(GL_TEXTURE_2D, texID2);

    angle = glm::radians(90.0f);

    GLuint cubeTex = Texture::loadHdrCubeMap("../Project_Template/media/texture/cube/pisa-hdr/pisa");

    glActiveTexture(GL_TEXTURE2);
    glBindTexture(GL_TEXTURE_CUBE_MAP, cubeTex);
}

void SceneBasic_Uniform::compile()
{
	try {
		prog.compileShader("shader/basic_uniform.vert");
		prog.compileShader("shader/basic_uniform.frag");
		prog.link();
		prog.use();
	} catch (GLSLProgramException &e) {
		cerr << e.what() << endl;
		exit(EXIT_FAILURE);
	}
}

void SceneBasic_Uniform::setMatrices()
{
    mat4 mv = view * model;

    prog.setUniform("ModelViewMatrix", mv);
    prog.setUniform("NormalMatrix", glm::mat3(vec3(mv[0]), vec3(mv[1]), vec3(mv[2])));
    prog.setUniform("MVP", projection * mv);
}

void SceneBasic_Uniform::update( float t )
{
    float deltaT = t - tPrev;
    if (tPrev == 0.0f)
        deltaT = 0.0f;
    tPrev = t;
    angle += rotSpeed * deltaT;
    if (angle > glm::two_pi<float>())
        angle -= glm::two_pi<float>();

}

void SceneBasic_Uniform::render()
{
    glClear(GL_COLOR_BUFFER_BIT);
    glClear(GL_DEPTH_BUFFER_BIT);

    GLuint programHandle = prog.getHandle();
    GLuint location = glGetUniformLocation(programHandle, "RotationMatrix");

    glUniformMatrix4fv(location, 1, GL_FALSE, &rotationMatrix[0][0]);

    rotationMatrix = glm::rotate(glm::mat4(1.0f), angle, vec3(0.0f, 0.5f, 0.0f));
    glUniformMatrix4fv(location, 1, GL_FALSE, &rotationMatrix[0][0]);

    setMatrices();

    prog.setUniform("SkyBox", false);
    torus.render();

    vec3 cameraPos = vec3(7.0f * cos(angle), 2.0f, 7.0f * sin(angle));
    view = glm::lookAt(cameraPos, vec3(0.0f, 0.0f, 0.0f), vec3(0.0f, 1.0f,
        0.0f));
    // Draw sky
    prog.use();
    model = mat4(1.0f);
    setMatrices();
    prog.setUniform("SkyBox", true);
    sky.render();
}

void SceneBasic_Uniform::resize(int w, int h)
{
    width = w;
    height = h;
    glViewport(0, 0, w, h);
    projection = glm::perspective(glm::radians(70.0f), (float)w / h, 0.3f, 100.0f);
}

