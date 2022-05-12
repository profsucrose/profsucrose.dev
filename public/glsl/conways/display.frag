precision mediump float;

uniform vec2 resolution;
uniform sampler2D state;
uniform float time;

void main() {
    // vec2 sampleCoord = gl_FragCoord.xy;
    // sampleCoord.y /= mix(0.9, 2.0, (sin(sampleCoord.x / 300.0 + time / 10.0) + 1.0) / 2.0);
    // sampleCoord.x /= mix(0.9, 2.0, (sin(sampleCoord.y / 300.0 + time / 10.0) + 1.0) / 2.0);

    // vec2 uv = sampleCoord / resolution;

	// vec3 rainbow = 0.5+0.5*vec3(cos(time+uv.xyx+vec3(0, 2, 4)));

    // vec3 col = texture2D(state, uv).xyz;

    // gl_FragColor = vec4(col * rainbow, 1.0);

    gl_FragColor = texture2D(state, gl_FragCoord.xy / resolution);


    // float warp = 1.75; // simulate curvature of CRT monitor
    // float scan = 0.75; // simulate darkness between scanlines

    // // squared distance from center
    // vec2 uv = gl_FragCoord.xy / resolution;
    // vec2 dc = abs(0.5-uv);
    // dc *= dc;
    
    // // warp the fragment coordinates
    // uv.x -= 0.5; uv.x *= 1.0+(dc.y*(0.3*warp)); uv.x += 0.5;
    // uv.y -= 0.5; uv.y *= 1.0+(dc.x*(0.4*warp)); uv.y += 0.5;

    // vec3 crtGreen = vec3(0.1411764705882353, 0.8, 0.26666666666666666);

    // // sample inside boundaries, otherwise set to black
    // if (uv.y > 1.0 || uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0)
    //     gl_FragColor = vec4(0.0,0.0,0.0,1.0);
    // else {
    //     // determine if we are drawing in a scanline
    //     float apply = abs(sin(gl_FragCoord.y)*0.5*scan);
        
    //     uv.y /= mix(0.9, 2.0, (sin(uv.x + time / 10.0) + 1.0) / 2.0);
    //     uv.x /= mix(0.9, 2.0, (sin(uv.y + time / 10.0) + 1.0) / 2.0);

    //     uv.x += sin(uv.y + time / 10.0) / 10.0;


    //     // sample the texture
    // 	gl_FragColor = vec4(mix(texture2D(state, uv).rgb * crtGreen,vec3(0.0),apply),1.0);
    // }
}