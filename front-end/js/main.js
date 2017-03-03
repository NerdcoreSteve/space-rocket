const
    R = require('ramda'),
    Rx = require('rx'),
    Box = x => ({
        map: f => Box(f(x))
    }),
    store = state => {
        return {
            reduce: (reducer, input) => { state = reducer(state, input); return state },
            state: () => state
        }
    },
    pauseMode = require('./pauseMode.js'),
    startMode = require('./startMode.js'),
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
    includeInput = R.curry((input, gameState) => ({
        ...gameState,
        input
    })),
    gameModes = (gameState, input) => {
        switch(gameState.mode) {
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
    },
    modesIncludingInput = (gameState, input) => R.pipe(gameModes, includeInput(input))(gameState, input),
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
            R.reduce((gameState, effect) => modesIncludingInput(gameState, effect), gameState),
            gameState => ({
                ...gameState,
                commands: []
            }))
                (gameState),
    game = R.pipe(modesIncludingInput, effects),
    gameStore = store(startingGameState(context.canvas.width, context.canvas.height)),
    clock = Rx.Observable.interval(1000/60).map(() => 'tick'), // 60 fps
    escKey = Rx.Observable.fromEvent(document, 'keydown')
        .map(R.prop('key'))
        .filter(R.equals('Escape'))

Rx.Observable.fromEvent(document, 'keydown')
    .merge(Rx.Observable.fromEvent(document, 'keyup'))
    .map(input => input.key + input.type)
    .filter(boolMatch(/^(ArrowUp|ArrowDown).*$/))
    .distinctUntilChanged()
    .merge(Rx.Observable.fromEvent(document, 'keypress').map(() => 'anykey'))
    .merge(clock)
    .merge(escKey)
    .map(input => ({type: input}))
    .subscribe(
        input => Box(gameStore.reduce(game, input)).map(
            newGameState => { if(newGameState.input.type === 'tick') render(context, newGameState) }))
