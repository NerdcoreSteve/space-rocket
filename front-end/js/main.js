const
    R = require('ramda'),
    Rx = require('rx'),
    game = require('./game'),
    effects = require('./effects'),
    render = require('./render'),
    tap = require('./tap'),
    boolMatch = require('./boolMatch'),
    startingGameState = require('./startingGameState'),
    context = document.getElementById("gameScreen").getContext("2d"),
    screenShrinkFactor = .6

context.canvas.width = window.innerWidth * screenShrinkFactor * 1.5
context.canvas.height = window.innerWidth * screenShrinkFactor * (480 / 640) 

const
    store = state => {
        return {
            reduce: (reducer, input = state.input) => { state = reducer(state, input); return state },
            state: () => state
        }
    },
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
    .subscribe(input => {
        effects(gameStore)
        gameStore.reduce(game, input)
        if(input.type === 'tick') render(context, gameStore.state())
    })
