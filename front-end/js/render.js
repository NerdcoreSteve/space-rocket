const
    R = require('ramda'),
    tap = require('./tap'),
    drawImage = R.curry((context, images, imageObj) =>
        context.drawImage(
            images.get(imageObj.get('image')),
            imageObj.get('x'),
            imageObj.get('y'),
            imageObj.get('width'),
            imageObj.get('height'))),
    drawImages = R.curry((context, images, imageObjs) => imageObjs.forEach(drawImage(context, images)))

module.exports = (context, gameState) => {
    const
        starFieldImage = gameState.getIn(['field', 'starField', 'image']),
        draw = drawImage(context, gameState.get('images')),
        drawList = drawImages(context, gameState.get('images'))

    window.requestAnimationFrame(() => {
        if(gameState.get('mode') !== 'loading') {
            const field = gameState.get('field')

            context.drawImage(
                gameState.getIn(['images', starFieldImage]),
                field.getIn(['starField', 'x1']),
                0,
                context.canvas.width,
                context.canvas.height)
            context.drawImage(
                gameState.getIn(['images', starFieldImage]),
                field.getIn(['starField', 'x2']),
                0,
                context.canvas.width,
                context.canvas.height)

            draw(field.getIn(['rocket', 'fire']))
            draw(field.get('rocket'))
            drawList(field.getIn(['asteroidField', 'asteroids']))
            drawList(field.get('collisions'))
        } else {
            const text = gameState.getIn(['loading', 'text'])
            context.font = text.get('font')
            context.textAlign = 'center'
            context.fillStyle = text.get('color')
            context.fillText( text.get('text'), text.get('x'), text.get('y'))
        }

        if(gameState.get('mode') === 'start') {
            const start = gameState.get('start')
            draw(start.get('space_rocket'))
            draw(start.get('esc'))
            draw(start.get('updown'))
            draw(start.get('pressAnyKey'))
        } else if(gameState.get('mode') === 'pause') {
            const pause = gameState.get('pause')
            draw(pause.get('paused'))
            draw(pause.get('esc'))
            draw(pause.get('updown'))
        } else if(gameState.get('mode') === 'restart') {
            const restart = gameState.get('restart')

            if(restart.get('mode') === 'destroyed') {
                draw(restart.get('destroyed'))
            } else if(restart.get('mode') === 'anykey') {
                draw(restart.get('destroyed'))
                draw(restart.get('pressAnyKey'))
            }
        }
    })
}
