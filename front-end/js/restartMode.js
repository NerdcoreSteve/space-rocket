const
    tap = require('./tap.js'),
    boolMatch = require('./boolMatch'),
    startingGameState = require('./startingGameState.js'),
    rectMidpoint = rect => ({
            x: rect.x + (rect.width / 2),
            y: rect.y + (rect.height / 2),
        }),
    repositionByMidpoint = (x, y, rect) => ({
            ...rect,
            x: x - (rect.width / 2),
            y: y - (rect.height / 2)
        }),
    rectsMidpoint = (rect1, rect2) => ({
            x: (rect1.x + rect2.x)/2,
            y: (rect1.y + rect2.y)/2
        }),
    repositionCollision = (rocket, asteroid, collision) => {
        const collisionMidpoint = rectsMidpoint(rectMidpoint(rocket), rectMidpoint(asteroid))
        return repositionByMidpoint(collisionMidpoint.x, collisionMidpoint.y, collision)
    },
    anyKeyCheck = (input, gameState) =>
        boolMatch(/^(ArrowUp|ArrowDown|anykey).*$/, input.type)
            ? startingGameState(gameState.screen.width, gameState.screen.height)
            : gameState

module.exports = (gameState, input) => {
    switch(gameState.restart.mode) {
        case 'begin':
            return {
                ...gameState,
                restart: {
                    ...gameState.restart,
                    collision: {
                        ...repositionCollision(
                            gameState.rocket, gameState.asteroid, gameState.restart.collision),
                    },
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
        case 'anykey':
            return anyKeyCheck(input, gameState)
        default:
            return gameState
    }
}
