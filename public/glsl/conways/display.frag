precision mediump float;

uniform vec2 resolution;
uniform sampler2D state;
uniform float time;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

	vec3 rainbow = 0.5+0.5*vec3(cos(time+uv.xyx+vec3(0, 2, 4)));

    vec3 col = texture2D(state, uv).xyz;

    gl_FragColor = vec4(col * rainbow, 1.0);
}