const
    tap = require('./tap.js'),
    {fromJS} = require('immutable-ext'),
    boolMatch = require('./boolMatch'),
    startingGameState = require('./startingGameState.js'),
    anyKeyCheck = (input, gameState) =>
        boolMatch(/^(.*?keydown|anykey)$/, input.type)
            ? fromJS(
                startingGameState(
                    gameState.getIn(['screen', 'width']),
                    gameState.getIn(['screen', 'height'])))
                        .set('mode', 'flying')
                        .set('images', gameState.get('images'))
            : gameState,
    restartLogic = (gameState) => {
        switch(gameState.getIn(['restart', 'mode'])) {
            case 'begin':
                return gameState
                    .setIn(
                        ['restart', 'holdCounter'],
                        gameState.getIn(['restart', 'crashedHold']))
                    .setIn(['restart', 'mode'], 'crashed')
            case 'crashed':
                gameState = gameState.toJS()
                return gameState.restart.holdCounter !== 0
                    ? fromJS({
                        ...gameState,
                        restart: {
                            ...gameState.restart,
                            holdCounter: gameState.restart.holdCounter - 1
                        }
                    })
                    : fromJS({
                        ...gameState,
                        restart: {
                            ...gameState.restart,
                            mode: 'destroyed',
                            holdCounter: gameState.restart.destroyedHold
                        }
                    })
            case 'destroyed':
                gameState = gameState.toJS()
                return gameState.restart.holdCounter !== 0
                    ? fromJS({
                        ...gameState,
                        restart: {
                            ...gameState.restart,
                            holdCounter: gameState.restart.holdCounter - 1
                        }
                    })
                    : fromJS({
                        ...gameState,
                        restart: {
                            ...gameState.restart,
                            mode: 'anykey'
                        }
                    })
            default:
                return gameState
        }
    }
module.exports = (gameState, input) => anyKeyCheck(input, restartLogic(gameState))
