const
    R = require('ramda'),
    drawImage = R.curry((context, imageObj) =>
        context.drawImage(
            gameState.images[imageObj.image],
            imageObj.x,
            imageObj.y,
            imageObj.width,
            imageObj.height)),
    drawImages = (context, imageObjs) => imageObjs.forEach(drawImage(context))

module.exports = (context, gameState) => {
    window.requestAnimationFrame(() => {
        if(gameState.mode !== 'loading') {
            context.drawImage(
                gameState.images[gameState.field.starField.image],
                gameState.field.starField.x1,
                0,
                context.canvas.width,
                context.canvas.height)
            context.drawImage(
                gameState.images[gameState.field.starField.image],
                gameState.field.starField.x2,
                0,
                context.canvas.width,
                context.canvas.height)

            drawImage(context, gameState.field.rocket.fire)
            drawImage(context, gameState.field.rocket)
            drawImages(context, gameState.field.asteroidField.asteroids)
            drawImages(context, gameState.field.collisions)
        } else {
            context.font = gameState.loading.text.font
            context.textAlign = 'center'
            context.fillStyle = gameState.loading.text.color
            context.fillText(
                gameState.loading.text.text,
                gameState.loading.text.x,
                gameState.loading.text.y)
        }

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
