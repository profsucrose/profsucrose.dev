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

    if (sum == 3) {
        float r = (sin(x) + 1.0) / 2.0;
        vec2 uv = gl_FragCoord.xy / resolution;
        vec3 rainbow = uv.xyx + (0.5+0.5*vec3(cos(time+uv.xyx+vec3(0, 2, 4))));
        gl_FragColor = vec4(1.0, rainbow.y, rainbow.z, 1.0);
    } else if (sum == 2) {
        float r = (sin(x) + 1.0) / 2.0;
        vec2 uv = gl_FragCoord.xy / resolution;
        vec3 rainbow = uv.xyx + (0.5+0.5*vec3(cos(time+uv.xyx+vec3(0, 2, 4))));
        float current = float(get(0, 0));
        gl_FragColor = vec4(current, rainbow.y, rainbow.z, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}