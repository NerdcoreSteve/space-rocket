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
    game = (gameState, input) => {
        switch(gameState.mode) {
            case 'flying':
                return flyingMode(gameState, input)
            case 'restart':
                return restartMode(gameState, input)
            default:
                return gameState
        }
    },
    clock = Rx.Observable.interval(1000/60).map(() => 'tick'), // 60 fps
    commandObservable = new Rx.Subject(),
    commandStream = commandObservable.filter(x => x.type !== 'no_op'),
    command = c => {
        switch(c.type) {
            case 'random_numbers':
                return commandObservable.onNext({
                    type: c.returnType
                })
            default:
                return commandObservable.onNext({
                    type: 'no_op'
                })
        }
    }

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


commandStream.subscribe(console.log)
command({type: 'random_numbers', returnType: 'new_asteroid'})
command({type: 'random_numbers', returnType: 'new_car'})
command({type: 'shoes', returnType: 'new_car'})
