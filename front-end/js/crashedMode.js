const
    crashedModeLogic = (gameState, input) => {
        switch(input) {
            case 'tick':
                return {
                    ...gameState,
                    collision: {
                        ...gameState.collision,
                        modeHoldCounter: gameState.collision.modeHoldCounter - 1,
                    }
                }
            default:
                return gameState
        }
    },
    countCheck = gameState =>
        gameState.collision.modeHoldCounter === 0
            ? {
                ...gameState,
                mode: 'restart'
            }
            : gameState

module.exports = (gameState, input) => countCheck(crashedModeLogic(gameState, input))
