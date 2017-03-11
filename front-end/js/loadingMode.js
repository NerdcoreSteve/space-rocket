const
    tap = require('./tap')
module.exports = (gameState, input) => {
    switch(input.type) {
        case 'images_loaded':
            console.log(input.images)
            return {
                ...gameState,
                //mode: 'start'
            }
        default:
            return gameState
    }
}
