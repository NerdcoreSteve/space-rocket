const
    R = require('ramda'),
    Rx = require('rx'),
    flyingMode = require('./flyingMode.js'),
    context = document.getElementById("gameScreen").getContext("2d"),
    screenShrinkFactor = .6

/*
Todo later:
make a function that takes gamestate, canvas height and width,
and modifies game state dimensions appropriately
use it on initial state,
in subscribe: use it to modify state and canvas when window resizes
No functions will be able to rever to context.canvas, instead gamestate will
keep a record of canvas width and height
*/
context.canvas.width = window.innerWidth * screenShrinkFactor * 1.5
context.canvas.height = window.innerWidth * screenShrinkFactor * (480 / 640) 

//Todo
//     explain what's been done since the last video
//     when collision happens show collision image and then reset game
//     Don't just reset game, show a screen saying "You crashed!"
//     Suggested that I add a "relaunch in 3, 2, 1..." screen
//     maybe put a mode flag in gameData? flying, crashed, etc..
//     refactor to use more redux-like pattern of streamed values
//         each value in the stream will be an object with a type and it will have other
//             attributes
//     make asteroid appear randomly
//         make a callback stream that puts a set of random numbers (and what the are for)
//             into the input stream,
//             call that callback from subscribe callback
//             this is like the elm effects model
//     make stream of asteroids that appear randomly
//         garbage collect them when they go off screen
//         is it ok for them to overlap?
//     make a pause screen that shows game instructions and player stats
//     Do I have a full game now?
//         as soon as I do, I need to release it on heroku
//             put up on digital ocean instead with a doman, make a trailer, publicize, etc?
//     make a "let's make" video about what I've done?
//     make the asteroids have random sizes within a range
//     asteroids move at different speeds
//     tweak with frequency of new asteroid appearance
//         should not be fixed. Should also be random
//     rotate asteroids at different rates
//         http://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
//         make rotate image function that takes an image and context
//     make a set of asteroid images so they don't all look the same
//     What else before I call it done?
//     put up on heroku and porfolio
//     keep improving, iterating, etc until people play it.

const
    rocketLength = context.canvas.width / 10,
    rocketWidth = rocketLength * (48 / 122), // divide by image dimensions
    asteroidWidth = context.canvas.width / 20,
    asteroidHeight = asteroidWidth * (87/95),
    initialGameState = {
        screen: {
            width: context.canvas.width,
            height: context.canvas.height
        },
        mode: 'flying',
        collision: {
            collided: false,
            frameHolds: 10,
            holdCounter: 10,
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
                return gameState
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
