let GOL
let buffer
let audios

async function start() {
    // load canvas
    const canvas = document.querySelector('canvas')

    // load WebGL
    const gl = canvas.getContext('webgl')
    if (gl == null) {
        alert('Your browser does not support WebGL; try switching or updating your browser!')
        return
    }
    
    canvas.width = innerWidth
    canvas.height = innerHeight

    GOL = new GameOfLife(gl, canvas, 20, 20)
    await GOL.build()

    const songs = [
        'JAY Z, Kanye West - Otis ft. Otis Redding-BoEKWtgJQAU.mp3',
        'Jay-Z & Kanye West - Ni_as In Paris (Explicit)-gG_dA32oH44.mp3',
        'Kanye West - All Of The Lights ft. Rihanna, Kid Cudi-HAfFfqiYLp0.mp3',
        'Kanye West - Fade (Explicit)-IxGvm6btP1A.mp3',
        'Kanye West - Gold Digger ft. Jamie Foxx-6vwNcNOTVzY.mp3',
        'Kanye West - Heartless-Co0tTeuUVhU.mp3',
        'Kanye West - Mercy (Explicit) ft. Big Sean, Pusha T, 2 Chainz-7Dqgr0wNyPo.mp3',
        'Kanye West - POWER-L53gjP-TtGE.mp3',
        'Kanye West - Stronger-PsO6ZnUZI0g.mp3',
        'No Church In The Wild-FJt7gNi3Nr4.mp3'
    ] //.map(path => new Audio(`media/kanyes/songs/${path}`))

    const get = (x, y) => buffer[(y * GOL.width + x) * 4] == 255
    audios = {}

    const audioExists = (x, y) => audios[[x, y]] != undefined

    const createAudio = (x, y) => {
        // Clone loaded Audio instance
        const audio = new Audio('media/kanyes/songs/' + songs[Math.floor(Math.random() * songs.length)])
        audio.currentTime = Math.floor(Math.random() * 100)
        audio.play()
        audios[[x, y]] = audio
    }

    const deleteAudio = (x, y) => {
        console.log('Deleting audio')
        audioLength--
        audios[[x, y]].pause()
        delete audios[[x, y]]
    }

    const stopAudio = (x, y) => {
        if (audioExists(x, y)) audios[[x, y]].pause()
    }

    const playOrContinueAudio = (x, y) => {
        if (!audioExists(x, y)) createAudio(x, y)
        else audios[[x, y]].play()
    }
    
    let mouseIsDown = false
    document.addEventListener('mousedown', () => mouseIsDown = true)
    document.addEventListener('mouseup', () => mouseIsDown = false)

    document.addEventListener('mousemove', event => {
        if (!mouseIsDown) return

        const x = event.pageX
        const y = event.pageY

        const sampleX = Math.floor(x / innerWidth * GOL.width)
        const sampleY = Math.floor(GOL.height - y / innerHeight * GOL.height)

        // console.log(sampleX, sampleY)

        GOL.set(sampleX, sampleY, true)
        GOL.set(sampleX + 1, sampleY, true)
        GOL.set(sampleX, sampleY - 1, true)
        GOL.set(sampleX, sampleY - 1, true)
        // GOL.display()
    })

    buffer = new Uint8Array(GOL.width * GOL.height * 4)

    const fb = gl.createFramebuffer()

    const draw = () => {
        GOL.step()
        GOL.display()

        gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, GOL.textures.front, 0)
        gl.readPixels(0, 0, GOL.width, GOL.height, gl.RGBA, gl.UNSIGNED_BYTE, buffer)

        for (let y = 0; y < GOL.height; y++) {
            for (let x = 0; x < GOL.width; x++) {
                const cell = get(x, y)
                if (cell) playOrContinueAudio(x, y)
                else stopAudio(x, y)
            }
        }

        setTimeout(() => window.requestAnimationFrame(draw), 2000)
    }

    window.requestAnimationFrame(draw)
}

let started = false

document.addEventListener('mousedown', () => {
    if (!started) {
        document.querySelector('p').remove()
        start()
        started = true
    }
})