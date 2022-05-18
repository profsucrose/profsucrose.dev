precision mediump float;

uniform vec2 resolution;
uniform sampler2D state;
uniform float time;

int get(int x, int y) {
    return int(texture2D(state, (gl_FragCoord.xy + vec2(x, y)) / resolution).r);
}

void main() {
    int sum = get(-1, -1) +
              get(-1,  0) +
              get(-1,  1) +
              get( 0, -1) +
              get( 0,  1) +
              get( 1, -1) +
              get( 1,  0) +
              get( 1,  1);

    float x = gl_FragCoord.x;

    float current = float(get(0, 0));

    if (sum == 3) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else if (sum == 2) {
        gl_FragColor = vec4(current, current, current, 1.0);
    } else {
        float col = 0.0;
        gl_FragColor = vec4(col, col, col, 1.0);
    }
}