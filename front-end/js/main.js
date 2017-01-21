const
    R = require('ramda'),
    Rx = require('rx'),
    flyingMode = require('./flyingMode.js'),
    crashedMode = require('./crashedMode.js'),
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
        collision: {
            x: 0,
            y: 0,
            width: collisionWidth,
            height: collisionHeight,
            image: '/images/collision.png'
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
            case 'crashed':
                return crashedMode(gameState, input)
            default:
                return gameState
        }
    },
    image = url => {
        var imageObject = new Image()
        imageObject.src = url
        return imageObject
    },
    clock = Rx.Observable.interval(1000/60).map(() => 'tick'), // 60 fps
    boolMatch = regex => R.pipe(R.match(regex), R.length),
    render = gameState => {
        window.requestAnimationFrame(() => {
            context.drawImage(
                image(gameState.starField.image),
                gameState.starField.x1,
                0,
                context.canvas.width,
                context.canvas.height)

            context.drawImage(
                image(gameState.starField.image),
                gameState.starField.x2,
                0,
                context.canvas.width,
                context.canvas.height)

            context.drawImage(
                image(gameState.rocket.fire.image),
                gameState.rocket.fire.x,
                gameState.rocket.fire.y,
                gameState.rocket.fire.width,
                gameState.rocket.fire.height)

            context.drawImage(
                image(gameState.rocket.image),
                gameState.rocket.x,
                gameState.rocket.y,
                gameState.rocket.width,
                gameState.rocket.height)

            context.drawImage(
                image(gameState.asteroid.image),
                gameState.asteroid.x,
                gameState.asteroid.y,
                gameState.asteroid.width,
                gameState.asteroid.height)

            if(gameState.mode === 'crashed') {
                context.drawImage(
                    image(gameState.collision.image),
                    gameState.collision.x,
                    gameState.collision.y,
                    gameState.collision.width,
                    gameState.collision.height)
            }
        })
    }

Rx.Observable.fromEvent(document, 'keydown')
    .merge(Rx.Observable.fromEvent(document, 'keyup'))
    .map(e => e.key + e.type)
    .filter(boolMatch(/^(ArrowUp|ArrowDown).*$/))
    .distinctUntilChanged()
    .merge(clock)
    .scan(game, initialGameState)
    .subscribe(render)
