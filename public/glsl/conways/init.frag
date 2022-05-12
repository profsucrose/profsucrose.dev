precision mediump float;

uniform vec2 resolution;
uniform sampler2D state;

uniform float seed;

float rand(vec2 coord) {
    return fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float random = rand(seed + gl_FragCoord.xy);    

    if (random > 0.50) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        // gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}