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
                return gameState.getIn(['restart', 'holdCounter']) !== 0
                    ? gameState.updateIn(['restart', 'holdCounter'], x => x - 1)
                    : gameState
                        .setIn(['restart', 'mode'], 'destroyed')
                        .setIn(
                            ['restart', 'holdCounter'],
                            gameState.getIn(['restart', 'destroyedHold']))
            case 'destroyed':
                return gameState.getIn(['restart', 'holdCounter']) !== 0
                    ? gameState.updateIn(['restart', 'holdCounter'], x => x - 1)
                    : gameState.setIn(['restart', 'mode'], 'anykey')
            default:
                return gameState
        }
    }
module.exports = (gameState, input) => anyKeyCheck(input, restartLogic(gameState))
