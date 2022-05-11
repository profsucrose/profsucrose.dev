document.addEventListener('DOMContentLoaded', async () => {
    // load canvas
    const canvas = document.querySelector('canvas')

    // load WebGL
    const gl = canvas.getContext('webgl')
    if (gl == null) {
        alert('Your browser does not support WebGL; try switching or updating your browser!')
        return
    }
    
    console.log(gl.MAX_TEXTURE_SIZE)
    
    console.log(innerWidth, innerHeight)
    canvas.width = innerWidth
    canvas.height = innerWidth

    const GOL = new GameOfLife(gl, canvas, 16384, 16384)
    await GOL.build()

    const draw = () => {
        GOL.step()
        GOL.display()

        window.requestAnimationFrame(draw)
    }

    window.requestAnimationFrame(draw)
})