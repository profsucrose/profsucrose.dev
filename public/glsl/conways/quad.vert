precision mediump float;

attribute vec2 coords;

void main() {
    gl_Position = vec4(coords, 1.0, 1.0);
}