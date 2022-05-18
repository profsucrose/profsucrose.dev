
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

    GOL = new GameOfLife(gl, canvas, innerWidth, innerHeight)
    await GOL.build()

    document.addEventListener('mousemove', event => {
        const x = event.pageX
        const y = event.pageY

        const sampleX = Math.floor(x / innerWidth * GOL.width)
        const sampleY = Math.floor(GOL.height - y / innerHeight * GOL.height)

        console.log(sampleX, sampleY)

        GOL.set(sampleX, sampleY, true)
        GOL.set(sampleX + 1, sampleY, true)
        GOL.set(sampleX, sampleY - 1, true)
        GOL.set(sampleX + 1, sampleY - 1, true)
    })

    const FPS = 60
    const draw = () => {
        GOL.step()
        GOL.display()

        setTimeout(() => window.requestAnimationFrame(draw), 1000 / FPS) // FPS
    }

    window.requestAnimationFrame(draw)
})