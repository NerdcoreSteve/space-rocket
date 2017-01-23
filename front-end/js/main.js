const
    R = require('ramda'),
    Rx = require('rx'),
    flyingMode = require('./flyingMode.js'),
    restartMode = require('./restartMode.js'),
    render = require('./render.js'),
    context = document.getElementById("gameScreen").getContext("2d"),
    screenShrinkFactor = .6

context.canvas.width = window.innerWidth * screenShrinkFactor * 1.5
context.canvas.height = window.innerWidth * screenShrinkFactor * (480 / 640) 

const
    rocketLength = context.canvas.width / 10,
    rocketWidth = rocketLength * (48 / 122), // divide by image dimensions
    asteroidWidth = context.canvas.width / 20,
    asteroidHeight = asteroidWidth * (87/95),
    collisionWidth = context.canvas.width / 15,
    collisionHeight = collisionWidth * (136/168),
    initialGameState = {
        screen: {
            width: context.canvas.width,
            height: context.canvas.height
        },
        mode: 'flying',
        restart: {
            mode: 'begin',
            crashedHold: 40,
            destroyedHold: 10,
            holdCounter: 0,
            destroyed: {
                x: 0,
                y: 0,
                width: collisionWidth,
                height: collisionHeight,
                image: '/images/destroyed.png',
            },
            collision: {
                x: 0,
                y: 0,
                width: collisionWidth,
                height: collisionHeight,
                image: '/images/collision.png',
            }
        },
        starField: {
            image: '/images/starfield.png',
            x1: 0,
            x2: context.canvas.width,
            speed: context.canvas.width / 470
        },
        asteroid: {
            x: context.canvas.height * 2,
            y: context.canvas.height / 3,
            width: asteroidWidth,
            height: asteroidHeight,
            speed: context.canvas.height / 90,
            image: '/images/asteroid.png'
        },
        rocket: {
            x: context.canvas.width / 25,
            y: context.canvas.height / 3,
            width: rocketLength,
            height: rocketWidth,
            keyUpDown: false,
            direction: 0,
            keyDownDown: false,
            speed: context.canvas.height / 90,
            image: '/images/rocket.png',
            fire: {
                x: context.canvas.width / 40,
                y: context.canvas.height / 3,
                width: rocketWidth * .6,
                height: rocketWidth * .8,
                image: '/images/rocketFire1.png',
                imageIndex: 0,
                images: ['/images/rocketFire1.png', '/images/rocketFire2.png'],
                frameHolds: 5,
                holdCounter: 5,
            },
        }
    },
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
    boolMatch = regex => R.pipe(R.match(regex), R.length)

Rx.Observable.fromEvent(document, 'keydown')
    .merge(Rx.Observable.fromEvent(document, 'keyup'))
    .map(e => e.key + e.type)
    .filter(boolMatch(/^(ArrowUp|ArrowDown).*$/))
    .distinctUntilChanged()
    .merge(clock)
    .scan(game, initialGameState)
    .subscribe(render(context))
