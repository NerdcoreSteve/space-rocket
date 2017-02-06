const
    tap = require('./tap.js')
module.exports = (gameState, input) => {
    switch(input.type) {
        case 'anykey':
            return {
                ...gameState,
                mode: 'flying'
            }
        default:
            return gameState
    }
}
