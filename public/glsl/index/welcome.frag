precision mediump float;

uniform vec2 resolution;
uniform float _time;
uniform float fontSize;

#define PI 3.14159

float time;

const ivec2 char_a = ivec2(0x3f333300, 0xc1e3333);
const ivec2 char_b = ivec2(0x66663f00, 0x3f66663e);
const ivec2 char_c = ivec2(0x3663c00, 0x3c660303);
const ivec2 char_d = ivec2(0x66361f00, 0x1f366666);
const ivec2 char_e = ivec2(0x16467f00, 0x7f46161e);
const ivec2 char_f = ivec2(0x16060f00, 0x7f46161e);
const ivec2 char_g = ivec2(0x73667c00, 0x3c660303);
const ivec2 char_h = ivec2(0x33333300, 0x3333333f);
const ivec2 char_i = ivec2(0xc0c1e00, 0x1e0c0c0c);
const ivec2 char_j = ivec2(0x33331e00, 0x78303030);
const ivec2 char_k = ivec2(0x36666700, 0x6766361e);
const ivec2 char_l = ivec2(0x46667f00, 0xf060606);
const ivec2 char_m = ivec2(0x6b636300, 0x63777f7f);
const ivec2 char_n = ivec2(0x73636300, 0x63676f7b);
const ivec2 char_o = ivec2(0x63361c00, 0x1c366363);
const ivec2 char_p = ivec2(0x6060f00, 0x3f66663e);
const ivec2 char_q = ivec2(0x3b1e3800, 0x1e333333);
const ivec2 char_r = ivec2(0x36666700, 0x3f66663e);
const ivec2 char_s = ivec2(0x38331e00, 0x1e33070e);
const ivec2 char_t = ivec2(0xc0c1e00, 0x3f2d0c0c);
const ivec2 char_u = ivec2(0x33333f00, 0x33333333);
const ivec2 char_v = ivec2(0x331e0c00, 0x33333333);
const ivec2 char_w = ivec2(0x7f776300, 0x6363636b);
const ivec2 char_x = ivec2(0x1c366300, 0x6363361c);
const ivec2 char_y = ivec2(0xc0c1e00, 0x3333331e);
const ivec2 char_z = ivec2(0x4c667f00, 0x7f633118);
const ivec2 char_per = ivec2(0xc0c00, 0x0);
const ivec2 char_esc = ivec2(0x18001800, 0x183c3c18);
const ivec2 char_space = ivec2(0, 0);

// This should be a texture, but performs surprisingly well enough
ivec2 string(int i) {
    if (i == 0)  return char_w;
    if (i == 1)  return char_e;
    if (i == 2)  return char_l;
    if (i == 3)  return char_c;
    if (i == 4)  return char_o;
    if (i == 5)  return char_m;
    if (i == 6)  return char_e;
    if (i == 7)  return char_space;
    if (i == 8)  return char_t;
    if (i == 9)  return char_o;
    if (i == 10) return char_space;
    if (i == 11) return char_m;
    if (i == 12) return char_y;
    if (i == 13) return char_space;
    if (i == 14) return char_j;
    if (i == 15) return char_a;
    if (i == 16) return char_n;
    if (i == 17) return char_k;
    if (i == 18) return char_y;
    if (i == 19) return char_space;
    if (i == 20) return char_w;
    if (i == 21) return char_e;
    if (i == 22) return char_b;
    if (i == 23) return char_p;
    if (i == 24) return char_a;
    if (i == 25) return char_g;
    if (i == 26) return char_e;
    if (i == 27) return char_space;
    if (i == 28) return char_o;
    if (i == 29) return char_n;
    if (i == 30) return char_space;
    if (i == 31) return char_p;
    if (i == 32) return char_r;
    if (i == 33) return char_o;
    if (i == 34) return char_f;
    if (i == 35) return char_s;
    if (i == 36) return char_u;
    if (i == 37) return char_c;
    if (i == 38) return char_r;
    if (i == 39) return char_o;
    if (i == 40) return char_s;
    if (i == 41) return char_e;
    if (i == 42) return char_per;
    if (i == 43) return char_d;
    if (i == 44) return char_e;
    if (i == 45) return char_v;
    if (i == 46) return char_esc;
    return char_space;
}

bool bit(int byte, int x) {
    int shifted = byte / int(pow(2.0, float(x)));
    return (shifted - 2 * (shifted / 2)) == 1;
}

bool char(ivec2 ch, int x, int y) {
    int sampleY = int(mod(float(y), 4.0));
    return bit(y >= 4 ? ch.y : ch.x, sampleY * 8 + x);
}
vec3 textBuffer(vec2 fragCoord) {
    int y = (int(resolution.y) - int(fragCoord.y)) / int(fontSize);
    fragCoord.x += sin(float(y) + time * 10.0) + time * 100.0 * sin(float(y));
    ivec2 coord = ivec2(int(fragCoord.x), int(fragCoord.y));
    // int x = int(mod(float(coord.x / int(fontSize)) - time * mod(float(y), 2.0) * 2.0, 48.0));
    int x = int(mod(float(coord.x / int(fontSize)), 48.0));
    int charPixelX = int(mod(float(coord.x), fontSize) / (fontSize / 8.0));
    int charPixelY = int(mod(float(coord.y), fontSize) / (fontSize / 8.0));
   
    bool isFilled = char(string(x), charPixelX, charPixelY);
    vec3 col = isFilled ? vec3(1.0) : vec3(0.0); // black if filled, white otherwise
    return col;
}

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

vec3 polar(vec2 coord) {
    vec2 center = resolution / 2.0;

    vec2 diff = coord - center;

    float lineLength = fontSize * 48.0;
    float r = length(diff) * min(resolution.x, resolution.y) / lineLength;
    float theta = atan(diff.y, diff.x) / (2.0 * PI) * lineLength * 2.0;

    vec3 col = textBuffer(vec2(-theta, r));
    return col;
}

vec3 rectangular(vec2 coord) {
    coord.y /= mix(0.9, 2.0, (sin(coord.x / 300.0 + time / 2.0) + 1.0) / 2.0);
    coord.x /= mix(0.9, 2.0, (sin(coord.y / 300.0 + time / 2.0) + 1.0) / 2.0);
    coord.x += time * 20.;

    vec3 col = textBuffer(coord);
    return col;
}

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

vec3 matrix(vec2 _coord) {
    ivec2 coord = ivec2(int(_coord.x), int(_coord.y));
    int x = coord.x / int(fontSize);
    float colHeight = (sin(float(x)) + 1.0)/2.0 * 50.0 + 45.0;
    int y = int(mod(mod(float((int(resolution.y) - coord.y) / int(fontSize)), 48.0) - time * 10.0, colHeight));
    int charPixelX = int(mod(float(coord.x), fontSize) / (fontSize / 8.0));
    int charPixelY = int(mod(float(coord.y), fontSize) / (fontSize / 8.0));
   
    int word = int(rand(vec2(0, x)) * 7.0);

    int boldStartIndex = int(word == 0) * 0   // welcome
        + int(word == 1) * 8                  // to
        + int(word == 2) * 11                 // my
        + int(word == 3) * 14                 // janky
        + int(word == 4) * 19                 // webpage
        + int(word == 5) * 28                 // on
        + int(word == 6) * 31;                // profsucrose.dev!

    int boldEndIndex = int(word == 0) * 7
        + int(word == 1) * 10
        + int(word == 2) * 13
        + int(word == 3) * 19
        + int(word == 4) * 27
        + int(word == 5) * 30
        + int(word == 6) * 46;
   
    bool isFilled = char(string(y), charPixelX, charPixelY);
    vec3 col = isFilled ? vec3(float(y >= boldStartIndex && y < boldEndIndex) * 0.4 + 0.6) : vec3(0.0); // black if filled, white otherwise
    return col;
}

#define TRANSITIONS_WINDOW 2.0

void main() {
    time = _time * 0.1;
    vec2 sampleCoord = gl_FragCoord.xy;

    vec3 col1 = polar(sampleCoord);
    vec3 col2 = rectangular(sampleCoord);
    vec3 col3 = matrix(sampleCoord);

    float t = mod(time, TRANSITIONS_WINDOW)/TRANSITIONS_WINDOW;

    vec3 col = mix(col1, col2, smoothstep(0.2, 0.3, t));
    col = mix(col, col3, smoothstep(0.5, 0.6, t));
    col = mix(col, col1, smoothstep(0.8, 0.9, t));

    vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 rainbow = 0.5+0.5*vec4(cos(time+uv.xyx+vec3(0, 2, 4)),1.0);

    gl_FragColor = vec4(col * rainbow.xyz, 1.0);
}
