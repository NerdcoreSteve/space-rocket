const
    R = require('ramda'),
    {fromJS} = require('immutable-ext'),
    loadingMode = require('./loadingMode'),
    pauseMode = require('./pauseMode'),
    startMode = require('./startMode'),
    flyingMode = require('./flyingMode'),
    restartMode = require('./restartMode'),
    includeInput = R.curry((input, gameState) => ({
        ...gameState,
        input
    })),
    gameModes = (gameState, input) => {
        switch(gameState.mode) {
            case 'loading':
                return loadingMode(fromJS(gameState), input).toJS()
            case 'start':
                return startMode(fromJS(gameState), input).toJS()
            case 'pause':
                return pauseMode(fromJS(gameState), input).toJS()
            case 'flying':
                return flyingMode(gameState, input)
            case 'restart':
                return restartMode(gameState, input)
            default:
                return gameState
        }
    }
module.exports = 
    (gameState, input) => R.pipe(gameModes, includeInput(input))(gameState, input)
