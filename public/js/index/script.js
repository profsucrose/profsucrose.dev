/**
 * Compiles shader and links to program, returns error if error
 * @param {WebGLRenderingContext} gl WebGL context
 * @param {WebGLProgram} program Shader program to attach to
 * @param {string} source Shader source code
 * @param {number} type Shader type
 * @return {Array} Status and error message (or null) of compilation
 */
 function compileAndAttachShader(gl, program, source, type) {
	const shader = gl.createShader(type)
	gl.shaderSource(shader, source)
	gl.compileShader(shader)

	const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (!status) {
		const error = gl.getShaderInfoLog(shader)
		return [ status, error.slice(0, error.length - 2) ]
	}

	gl.attachShader(program, shader)
	return [ true, null ]
}

let fontSize = calcFontSize(innerWidth, innerHeight)

function calcFontSize(width, height) {
    return Math.floor(Math.min(width, height) * 0.02)
}

/**
 * Resizes DOM Element to window innerWidth and innerHeight
 * @param {DOMElement} element 
 */
function resizeElementToWindow(element) {
    fontSize = calcFontSize(innerWidth, innerHeight)
    element.width = window.innerWidth - window.innerWidth % fontSize
    element.height = window.innerHeight - window.innerHeight % fontSize
}

const fortunes = FORTUNES.split('%')

/**
 * Fetches random UNIX fortune
 * @returns {String} fortune
 */
function getFortune() {
    return fortunes[Math.floor(Math.random() * fortunes.length)].trim()
}

document.addEventListener('DOMContentLoaded', async () => {
    // load fortune
    const fortune = document.querySelector('.main__fortune')
    fortune.innerText = `${getFortune()}`

    // load canvas
    const canvas = document.querySelector('canvas')

    resizeElementToWindow(canvas)
    window.addEventListener('resize', () => {
        resizeElementToWindow(canvas)
    })
    
    // load WebGL
    const gl = canvas.getContext('webgl')
    if (gl == null) {
        alert('Your browser does not support WebGL; try switching or updating your browser!')
        return
    }

    const vertices = [
        -1, -1, 0,
        -1,  1, 0,
         1, -1, 0,
         1,  1, 0
    ]

    const indices = [0, 1, 2, 1, 3, 2]

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)	

    const vertexSource = `
        attribute vec3 coords;
        void main() {
            gl_Position = vec4(coords, 1.0);
        }
    `

    // import fragment shader from other JS
    const fragmentSource = await (await fetch('glsl/index/welcome.frag')).text()

    let program = gl.createProgram()

    compileAndAttachShader(gl, program, vertexSource, gl.VERTEX_SHADER)
    compileAndAttachShader(gl, program, fragmentSource, gl.FRAGMENT_SHADER)

    gl.linkProgram(program)
    gl.useProgram(program)

    const coord = gl.getAttribLocation(program, 'coords')
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(coord)

    let t = Math.random() * 1000
    const draw = () => {
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.viewport(0, 0, canvas.width, canvas.height)

        const time = gl.getUniformLocation(program, 'time')
        gl.uniform1f(time, t)

        const fontSizeLoc = gl.getUniformLocation(program, 'fontSize')
        gl.uniform1f(fontSizeLoc, fontSize)

        const resolution = gl.getUniformLocation(program, 'resolution')
        gl.uniform2fv(resolution, [ canvas.width, canvas.height ])

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        t += 0.01

        window.requestAnimationFrame(draw)
    }

    window.requestAnimationFrame(draw)
})
