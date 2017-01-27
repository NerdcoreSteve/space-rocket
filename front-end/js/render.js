const
    image = url => {
        var imageObject = new Image()
        imageObject.src = url
        return imageObject
    }

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

        context.drawImage(
            image(gameState.field.asteroid.image),
            gameState.field.asteroid.x,
            gameState.field.asteroid.y,
            gameState.field.asteroid.width,
            gameState.field.asteroid.height)

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
            } else if(gameState.restart.mode === 'anykey') {
                context.drawImage(
                    image(gameState.restart.destroyed.image),
                    gameState.restart.destroyed.x,
                    gameState.restart.destroyed.y,
                    gameState.restart.destroyed.width,
                    gameState.restart.destroyed.height)

                context.drawImage(
                    image(gameState.restart.pressAnyKey.image),
                    gameState.restart.pressAnyKey.x,
                    gameState.restart.pressAnyKey.y,
                    gameState.restart.pressAnyKey.width,
                    gameState.restart.pressAnyKey.height)
            }
        }
    })
}
