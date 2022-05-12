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

    GOL = new GameOfLife(gl, canvas, innerWidth, innerHeight)
    await GOL.build()

    document.addEventListener('mousemove', event => {
        const x = event.pageX
        const y = event.pageY

        const sampleX = Math.floor(x / innerWidth * GOL.width)
        const sampleY = Math.floor(GOL.height - y / innerHeight * GOL.height)

        console.log(sampleX, sampleY)

        GOL.set(sampleX, sampleY, true)
    })

    const draw = () => {
        GOL.step()
        GOL.display()

        window.requestAnimationFrame(draw)
    }

    window.requestAnimationFrame(draw)
})