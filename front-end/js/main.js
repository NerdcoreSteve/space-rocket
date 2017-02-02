const
    R = require('ramda'),
    Rx = require('rx'),
    flyingMode = require('./flyingMode.js'),
    restartMode = require('./restartMode.js'),
    render = require('./render.js'),
    tap = require('./tap.js'),
    boolMatch = require('./boolMatch'),
    startingGameState = require('./startingGameState.js'),
    context = document.getElementById("gameScreen").getContext("2d"),
    screenShrinkFactor = .6

context.canvas.width = window.innerWidth * screenShrinkFactor * 1.5
context.canvas.height = window.innerWidth * screenShrinkFactor * (480 / 640) 

const
    gameModes = (gameState, input) => {
        switch(gameState.mode) {
            case 'flying':
                return flyingMode(gameState, input)
            case 'restart':
                return restartMode(gameState, input)
            default:
                return gameState
        }
    },
    random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    effects = gameState =>
        R.pipe(
            R.prop('commands'),
            R.map(command => {
                switch(command.type) {
                    case 'random_numbers':
                        return {
                            type: command.returnType,
                            numbers:
                                R.pipe(
                                    R.prop('numbers'),
                                    R.toPairs,
                                    R.map(pair => [pair[0], random(pair[1][0], pair[1][1])]),
                                    R.fromPairs)
                                        (command)
                        }
                }
            }),
            R.filter(x => x),
            R.reduce((gameState, effect) => gameModes(gameState, effect), gameState),
            gameState => ({
                ...gameState,
                commands: []
            }))
                (gameState),
    game = R.pipe(gameModes, effects),
    clock = Rx.Observable.interval(1000/60).map(() => 'tick') // 60 fps

Rx.Observable.fromEvent(document, 'keydown')
    .merge(Rx.Observable.fromEvent(document, 'keyup'))
    .map(input => input.key + input.type)
    .filter(boolMatch(/^(ArrowUp|ArrowDown).*$/))
    .distinctUntilChanged()
    .merge(Rx.Observable.fromEvent(document, 'keypress').map(() => 'anykey'))
    .merge(clock)
    .map(input => ({type: input}))
    .scan(game, startingGameState(context.canvas.width, context.canvas.height))
    .subscribe(render(context))
