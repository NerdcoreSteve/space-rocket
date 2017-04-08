module.exports = (gameState, input) => {
    switch(input.type) {
        case 'Escape':
            return gameState.set('mode', 'flying')
        default:
            return gameState
    }
}
