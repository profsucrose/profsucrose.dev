precision mediump float;

uniform vec2 resolution;
uniform sampler2D state;
uniform float time;

void main() {
    gl_FragColor = texture2D(state, gl_FragCoord.xy / resolution);
}