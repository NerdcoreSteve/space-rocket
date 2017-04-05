const
    R = require('ramda'),
    tap = require('./tap'),
    drawImage = R.curry((context, images, imageObj) =>
        context.drawImage(
            images.get(tap(imageObj.get('image'))),
            imageObj.get('x'),
            imageObj.get('y'),
            imageObj.get('width'),
            imageObj.get('height'))),
    drawImages = (context, images, imageObjs) => imageObjs.forEach(drawImage(context, images))

module.exports = (context, gameState) => {
    window.requestAnimationFrame(() => {
        if(gameState.get('mode') !== 'loading') {
            context.drawImage(
                gameState.getIn(['images', gameState.getIn(['field', 'starField', 'image'])]),
                gameState.getIn(['field', 'starField', 'x1']),
                0,
                context.canvas.width,
                context.canvas.height)
            context.drawImage(
                gameState.getIn(['images', gameState.getIn(['field', 'starField', 'image'])]),
                gameState.getIn(['field', 'starField', 'x2']),
                0,
                context.canvas.width,
                context.canvas.height)

            drawImage(context, gameState.get('images'), gameState.getIn(['field', 'rocket', 'fire']))
            drawImage(context, gameState.get('images'), gameState.getIn(['field', 'rocket']))
            drawImages(
                context,
                gameState.get('images'),
                gameState.getIn(['field', 'asteroidField', 'asteroids']))
            drawImages(context, gameState.get('images'), gameState.getIn(['field', 'collisions']))
        } else {
            context.font = gameState.getIn(['loading', 'text', 'font'])
            context.textAlign = 'center'
            context.fillStyle = gameState.getIn(['loading', 'text', 'color'])
            context.fillText(
                gameState.getIn(['loading', 'text', 'text']),
                gameState.getIn(['loading', 'text', 'x']),
                gameState.getIn(['loading', 'text', 'y']))
        }

        if(gameState.mode === 'start') {
            drawImage(context, gameState.get('images'), gameState.getIn(['start', 'space_rocket']))
            drawImage(context, gameState.get('images'), gameState.getIn(['start', 'esc']))
            drawImage(context, gameState.get('images'), gameState.getIn(['start', 'updown']))
            drawImage(context, gameState.get('images'), gameState.getIn(['start', 'pressAnyKey']))
        } else if(gameState.mode === 'pause') {
            drawImage(context, gameState.get('images'), gameState.getIn(['pause', 'paused']))
            drawImage(context, gameState.get('images'), gameState.getIn(['pause', 'esc']))
            drawImage(context, gameState.get('images'), gameState.getIn(['pause', 'updown']))
        } else if(gameState.mode === 'restart') {
            if(gameState.restart.mode === 'destroyed') {
                drawImage(context, gameState.get('images'), gameState.getIn(['restart', 'destroyed']))
            } else if(gameState.restart.mode === 'anykey') {
                drawImage(context, gameState.get('images'), gameState.getIn(['restart', 'destroyed']))
                drawImage(context, gameState.get('images'), gameState.getIn(['restart', 'pressAnyKey']))
            }
        }
    })
}
