const
    image = url => {
        var imageObject = new Image()
        imageObject.src = url
        return imageObject
    }

module.exports = context => gameState => {
    window.requestAnimationFrame(() => {
        context.drawImage(
            image(gameState.starField.image),
            gameState.starField.x1,
            0,
            context.canvas.width,
            context.canvas.height)

        context.drawImage(
            image(gameState.starField.image),
            gameState.starField.x2,
            0,
            context.canvas.width,
            context.canvas.height)

        context.drawImage(
            image(gameState.rocket.fire.image),
            gameState.rocket.fire.x,
            gameState.rocket.fire.y,
            gameState.rocket.fire.width,
            gameState.rocket.fire.height)

        context.drawImage(
            image(gameState.rocket.image),
            gameState.rocket.x,
            gameState.rocket.y,
            gameState.rocket.width,
            gameState.rocket.height)

        context.drawImage(
            image(gameState.asteroid.image),
            gameState.asteroid.x,
            gameState.asteroid.y,
            gameState.asteroid.width,
            gameState.asteroid.height)

        if(gameState.mode === 'restart') {
            context.drawImage(
                image(gameState.restart.collision.image),
                gameState.restart.collision.x,
                gameState.restart.collision.y,
                gameState.restart.collision.width,
                gameState.restart.collision.height)
            if(gameState.restart.mode === 'destroyed') {
                context.drawImage(
                    image(gameState.restart.destroyed.image),
                    gameState.restart.destroyed.x,
                    gameState.restart.destroyed.y,
                    gameState.restart.destroyed.width,
                    gameState.restart.destroyed.height)
            }
        }
    })
}
