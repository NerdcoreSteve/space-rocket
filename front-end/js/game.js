const
    R = require('ramda'),
    {Map} = require('immutable-ext'),
    loadingMode = require('./loadingMode'),
    pauseMode = require('./pauseMode'),
    startMode = require('./startMode'),
    flyingMode = require('./flyingMode'),
    restartMode = require('./restartMode'),
    gameModes = (gameState, input) => {
        switch(gameState.get('mode')) {
            case 'loading':
                return loadingMode(gameState, input)
            case 'start':
                return startMode(gameState, input)
            case 'pause':
                return pauseMode(gameState, input)
            case 'flying':
                return flyingMode(gameState, input)
            case 'restart':
                return restartMode(gameState, input)
            default:
                return gameState
        }
    }
module.exports = 
    (gameState, input) => gameModes(gameState, input).merge(Map(input))
