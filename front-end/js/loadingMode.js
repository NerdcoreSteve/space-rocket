const
    tap = require('./tap')
module.exports = (gameState, input) => {
    switch(input.type) {
        case 'starting_images_loaded':
            return {
                ...gameState,
                mode: 'start'
            }
        default:
            return gameState
    }
}
