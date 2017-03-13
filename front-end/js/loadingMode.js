const
    tap = require('./tap')
module.exports = (gameState, input) => {
    switch(input.type) {
        case 'images_loaded':
            return {
                ...gameState,
                mode: 'start',
                images: {
                    ...gameState.images,
                    ...input.images,
                },
            }
        default:
            return gameState
    }
}
