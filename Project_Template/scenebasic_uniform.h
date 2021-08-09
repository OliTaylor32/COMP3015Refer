#ifndef SCENEBASIC_UNIFORM_H
#define SCENEBASIC_UNIFORM_H

#include "helper/scene.h"

#include <glad/glad.h>
#include "helper/glslprogram.h"

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

#include "helper/torus.h"
#include "glm/glm.hpp"

#include "helper/cube.h"
#include "helper/skybox.h"

class SceneBasic_Uniform : public Scene
{
private:
    //GLuint vaoHandle;
    GLSLProgram prog;
    float angle, tPrev, rotSpeed;

    glm::mat4 rotationMatrix;

    Torus torus;

    Cube cube;

    SkyBox sky;

    GLuint sprites;
    int numSprites;
    float* locations;

    bool GeometryShader;

    float cutOff;

    void compile();

    void setMatrices();

    bool deterioration;

public:
    SceneBasic_Uniform();

    void initScene();
    void update( float t );
    void render();
    void resize(int, int);
};

#endif // SCENEBASIC_UNIFORM_H
