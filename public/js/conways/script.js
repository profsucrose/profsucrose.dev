let GOL

document.addEventListener('DOMContentLoaded', async () => {
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

    GOL = new GameOfLife(gl, canvas, 100, 100)
    await GOL.build()

    
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
        // GOL.set(sampleX + 1, sampleY, true)
        // GOL.set(sampleX, sampleY - 1, true)
        // GOL.set(sampleX, sampleY - 1, true)
        // GOL.display()
    })

    const draw = () => {
        GOL.step()
        GOL.display()

        // window.requestAnimationFrame(draw)
    }

    // window.requestAnimationFrame(draw)

    setInterval(draw, 1000 / 30)
})