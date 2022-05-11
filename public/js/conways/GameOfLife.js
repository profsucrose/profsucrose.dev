class Program {
    constructor(gl, vertex, fragment) {
        this.gl = gl
        this.shaderProgram = gl.createProgram()

        this.vertex = vertex
        this.fragment = fragment
    }

    async build() {
        const [ vertexSource, fragmentSource ] = await getShaderSources(this.vertex, this.fragment)

        let [ vertexStatus, vertexMessage ] = compileAndAttachShader(this.gl, this.shaderProgram, vertexSource, this.gl.VERTEX_SHADER)
        if (!vertexStatus) console.error(vertexMessage)

        console.log(this.gl, this.shaderProgram, fragmentSource, this.gl.FRAGMENT_SHADER)
        let [ fragmentStatus, fragmentMessage ] = compileAndAttachShader(this.gl, this.shaderProgram, fragmentSource, this.gl.FRAGMENT_SHADER)
        if (!fragmentStatus) console.error(fragmentMessage)

        this.gl.linkProgram(this.shaderProgram)

        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            const info = this.gl.getProgramInfoLog(this.shaderProgram)
            throw new Error('Could not compile WebGL program. \n\n' + info)
        }

        return this
    }

    static async buildProgramMap(programs) {
        await Promise.all(Object.values(programs).map(program => program.build()))
        return programs
    }

    use() {
        this.gl.useProgram(this.shaderProgram)
    }

    getAttribLocation(name) {
        return this.gl.getAttribLocation(this.shaderProgram, name)
    }

    getUniformLocation(name) {
        return this.gl.getUniformLocation(this.shaderProgram, name)
    }
}

class GameOfLife {    
    /**
     * @param {WebGLRenderingContext} gl 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(gl, canvas, width, height) {
        this.gl = gl
        this.canvas = canvas
        this.width = width
        this.height = height
        this.time = 0;
    }

    async build() {
        const gl = this.gl

        this.programs = await Program.buildProgramMap({
            quad: new Program(gl, 'quad.vert', 'quad.frag'),
            copy: new Program(gl, 'quad.vert', 'copy.frag'),
            init: new Program(gl, 'quad.vert', 'init.frag')
        })

        console.log(this.programs)

        this.step_framebuffer = gl.createFramebuffer()

        this.textures = {
            back: this.texture(),
            front: this.texture()
        }

        this.initQuad()
        this.initCells()
    }

    texture() {
        const gl = this.gl

        const tex = gl.createTexture()

        gl.bindTexture(gl.TEXTURE_2D, tex)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

        // By default WebGL will fill null texture with all 0s
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height,
            0, gl.RGBA, gl.UNSIGNED_BYTE, null)

        return tex
    }

    display() {
        const gl = this.gl

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, this.textures.front)
        this.drawToCurrentFramebuffer(this.programs.copy)
    }

    drawToCurrentFramebuffer(program) {
        const gl = this.gl

        program.use()

        const coord = program.getAttribLocation('coords')
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 2 * 4, 0)
        gl.enableVertexAttribArray(coord)

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        
        gl.viewport(0, 0, this.canvas.width, this.canvas.height)

        const resolution = program.getUniformLocation('resolution')
        gl.uniform2fv(resolution, [this.width, this.height])

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0)
    }

    swap() {
        const tmp = this.textures.back
        this.textures.back = this.textures.front
        this.textures.front = tmp
    }

    initCells() {
        const gl = this.gl

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.step_framebuffer)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D, this.textures.back, 0)
        gl.bindTexture(gl.TEXTURE_2D, this.textures.front)

        this.programs.init.use();
        const seed = this.programs.init.getUniformLocation('seed')
        gl.uniform1f(seed, Math.random())

        this.drawToCurrentFramebuffer(this.programs.init)
        this.swap()
    }

    step() {
        const gl = this.gl        

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.step_framebuffer)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D, this.textures.back, 0)
        gl.bindTexture(gl.TEXTURE_2D, this.textures.front)

        // Write to textures.back but sample from textures.front,
        // then swap textures. This constitutes a state change.
        this.programs.quad.use()
        const time = this.programs.quad.getUniformLocation('time')
        gl.uniform1f(time, this.time)

        console.log(this.time)

        this.drawToCurrentFramebuffer(this.programs.quad)
        this.swap()

        this.time += 0.1;
    }

    initQuad() {
        const gl = this.gl

        const vertices = [
            -1, -1,
            -1,  1,
             1, -1,
             1,  1,
        ]

        const indices = [0, 1, 2, 1, 3, 2]
        this.indices = indices

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

    }
}