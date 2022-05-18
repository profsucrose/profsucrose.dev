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

const __retrievedFiles = {}

async function getFile(path, refresh = false) {
    if (!refresh && __retrievedFiles[path]) return __retrievedFiles[path]

    const file = await fetch(`/${path}`)
    const text = await file.text()

    __retrievedFiles[path] = text

    return text
}

async function getShaderSources(...files) {
    return Promise.all(files.map(name => getFile(`glsl/kanyes/${name}`)))
}