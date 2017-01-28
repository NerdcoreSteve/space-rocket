const
    image = url => {
        var imageObject = new Image()
        imageObject.src = url
        return imageObject
    },
    drawCollisions = (gameState, context) =>
        gameState.restart.collisions.forEach(
            collision =>
                context.drawImage(
                    image(collision.image),
                    collision.x,
                    collision.y,
                    collision.width,
                    collision.height)),
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

        gameState.field.asteroidField.asteroids.forEach(
            asteroid =>
                context.drawImage(
                    image(asteroid.image),
                    asteroid.x,
                    asteroid.y,
                    asteroid.width,
                    asteroid.height))

        if(gameState.mode === 'restart') {
            if(gameState.restart.mode === 'crashed') {
                drawCollisions(gameState, context)
            } else if(gameState.restart.mode === 'destroyed') {
                drawCollisions(gameState, context)
                drawDestroyed(gameState, context)
            } else if(gameState.restart.mode === 'anykey') {
                drawCollisions(gameState, context)
                drawDestroyed(gameState, context)
                drawAnyKey(gameState, context)
            }
        }
    })
}
