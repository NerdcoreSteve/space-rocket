const
    R = require('ramda'),
    image = url => {
        var imageObject = new Image()
        imageObject.src = url
        return imageObject
    },
    drawImage = R.curry((context, imageObj) =>
        context.drawImage(
            image(imageObj.image),
            imageObj.x,
            imageObj.y,
            imageObj.width,
            imageObj.height)),
    drawImages = (context, imageObjs) => imageObjs.forEach(drawImage(context))

module.exports = context => gameState => {
    window.requestAnimationFrame(() => {
        context.drawImage(
            image(gameState.field.starField.image),
            gameState.field.starField.x1,
            0,
            context.canvas.width,
            context.canvas.height)
        context.drawImage(
            image(gameState.field.starField.image),
            gameState.field.starField.x2,
            0,
            context.canvas.width,
            context.canvas.height)

        drawImage(context, gameState.field.rocket.fire)
        drawImage(context, gameState.field.rocket)
        drawImages(context, gameState.field.asteroidField.asteroids)
        drawImages(context, gameState.field.collisions)

        if(gameState.mode === 'start') {
            drawImage(context, gameState.start.space_rocket)
            drawImage(context, gameState.start.esc)
            drawImage(context, gameState.start.updown)
            drawImage(context, gameState.start.pressAnyKey)
        } else if(gameState.mode === 'pause') {
            drawImage(context, gameState.pause.paused)
            drawImage(context, gameState.pause.esc)
            drawImage(context, gameState.pause.updown)
        } else if(gameState.mode === 'restart') {
            if(gameState.restart.mode === 'destroyed') {
                drawImage(context, gameState.restart.destroyed)
            } else if(gameState.restart.mode === 'anykey') {
                drawImage(context, gameState.restart.destroyed)
                drawImage(context, gameState.restart.pressAnyKey)
            }
        }
    })
}
