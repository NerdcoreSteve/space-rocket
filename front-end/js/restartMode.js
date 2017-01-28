const
    tap = require('./tap.js'),
    boolMatch = require('./boolMatch'),
    startingGameState = require('./startingGameState.js'),
    anyKeyCheck = (input, gameState) =>
        boolMatch(/^(.*?keydown|anykey)$/, input.type)
            ? startingGameState(gameState.screen.width, gameState.screen.height)
            : gameState,
    restartLogic = (gameState) => {
        switch(gameState.restart.mode) {
            case 'begin':
                return {
                    ...gameState,
                    restart: {
                        ...gameState.restart,
                        holdCounter: gameState.restart.crashedHold,
                        mode: 'crashed'
                    }
                }
            case 'crashed':
                return gameState.restart.holdCounter !== 0
                    ? {
                        ...gameState,
                        restart: {
                            ...gameState.restart,
                            holdCounter: gameState.restart.holdCounter - 1
                        }
                    }
                    : {
                        ...gameState,
                        restart: {
                            ...gameState.restart,
                            mode: 'destroyed',
                            holdCounter: gameState.restart.destroyedHold
                        }
                    }
            case 'destroyed':
                return gameState.restart.holdCounter !== 0
                    ? {
                        ...gameState,
                        restart: {
                            ...gameState.restart,
                            holdCounter: gameState.restart.holdCounter - 1
                        }
                    }
                    : {
                        ...gameState,
                        restart: {
                            ...gameState.restart,
                            mode: 'anykey'
                        }
                    }
            default:
                return gameState
        }
    }
module.exports = (gameState, input) => anyKeyCheck(input, restartLogic(gameState))
