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
    drawImages = (context, imageObjs) => imageObjs.forEach(drawImage(context)),
    drawDestroyed = (gameState, context) =>
        context.drawImage(
            image(gameState.restart.destroyed.image),
            gameState.restart.destroyed.x,
            gameState.restart.destroyed.y,
            gameState.restart.destroyed.width,
            gameState.restart.destroyed.height),
    drawAnyKey = (gameState, context) =>
        context.drawImage(
            image(gameState.restart.pressAnyKey.image),
            gameState.restart.pressAnyKey.x,
            gameState.restart.pressAnyKey.y,
            gameState.restart.pressAnyKey.width,
            gameState.restart.pressAnyKey.height)

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

        context.drawImage(
            image(gameState.field.rocket.fire.image),
            gameState.field.rocket.fire.x,
            gameState.field.rocket.fire.y,
            gameState.field.rocket.fire.width,
            gameState.field.rocket.fire.height)

        context.drawImage(
            image(gameState.field.rocket.image),
            gameState.field.rocket.x,
            gameState.field.rocket.y,
            gameState.field.rocket.width,
            gameState.field.rocket.height)

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
                drawDestroyed(gameState, context)
            } else if(gameState.restart.mode === 'anykey') {
                drawDestroyed(gameState, context)
                drawAnyKey(gameState, context)
            }
        }
    })
}
