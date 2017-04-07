const
    tap = require('./tap')

module.exports = (gameState, input) => {
    switch(input.type) {
        case 'images_loaded':
            return gameState
                .set('mode', 'start')
                .set('images', gameState.get('images').merge(input.images))
        default:
            return gameState
    }
}
