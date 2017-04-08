module.exports = (gameState, input) => {
    switch(input.type) {
        case 'anykey':
            return gameState.set('mode', 'flying')
        default:
            return gameState
    }
}
