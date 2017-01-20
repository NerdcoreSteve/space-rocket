const
    R = require('ramda'),
    Rx = require('rx'),
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
    rocketDy = rocket => {
        const rocketVector = rocket.speed * rocket.direction
        return rocket.y >=0
            ? rocket.y + rocket.height <= context.canvas.height
                ? rocketVector
                : rocket.direction === 1 ? 0 : rocket.direction
            : rocket.direction === -1 ? 0 : rocket.direction
    },
    starFieldDy = starField => (starField.x1 - starField.speed) % context.canvas.width,
    nextImageIndex = animateable =>
        (animateable.imageIndex + 1) % animateable.images.length,
    initialGameState = {
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
    game = (gameState, input) =>
        collision(flying(gameState, input)),
    collided = (rect1, rect2) =>
        rect1.x < rect2.x + rect2.width
            && rect1.x + rect1.width > rect2.x
            && rect1.y < rect2.y + rect2.height
            && rect1.height + rect1.y > rect2.y,
    collision = gameState =>
        /*
        R.cond(
            [
                gameState => gameState.collision.collided && gameState.collision.holdCounter > 0,
                gameState => {
                    //TODO unexpected token?
                    ...gameState,
                    collision {
                        ...gameState.collision,
                        holdCounter = gameState.collision.holdCounter - 1
                    }
                }
            ],
            [
                gameState => gameState.collision.collided && gameState.collision.holdCounter === 0,
                initialGameState
            ],
            [
                gameState => collided(gameState.rocket, gameState.asteroid),
                gameState => {
                    ...gameState,
                    collision {
                        ...gameState.collision,
                        collided: true,
                        holdCounter: gameState.collision.frameHolds
                    }
                }
            ],
            [R.T, gameState])
        */
        collided(gameState.rocket, gameState.asteroid) ? initialGameState : gameState,
    flying = (gameState, input) => {
        switch(input) {
            case 'ArrowUpkeydown':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        keyUpDown: true,
                        direction: -1
                    }
                }
            case 'ArrowDownkeydown':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        keyDownDown: true,
                        direction: 1
                    }
                }
            case 'ArrowUpkeyup':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        keyUpDown: false,
                        direction: gameState.rocket.keyDownDown ? 1 : 0
                    }
                }
            case 'ArrowDownkeyup':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        keyDownDown: false,
                        direction: gameState.rocket.keyUpDown ? -1 : 0
                    }
                }
            case 'tick':
                return {
                    ...gameState,
                    starField: {
                        ...gameState.starField,
                        x1: starFieldDy(gameState.starField),
                        x2: starFieldDy(gameState.starField) + context.canvas.width,
                    },
                    asteroid: {
                        ...gameState.asteroid,
                        x: gameState.asteroid.x - gameState.asteroid.speed
                    },
                    rocket: {
                        ...gameState.rocket,
                        y: gameState.rocket.y + rocketDy(gameState.rocket),
                        fire: {
                            ...gameState.rocket.fire,
                            y: gameState.rocket.fire.y + rocketDy(gameState.rocket),
                            holdCounter: (gameState.rocket.fire.holdCounter + 1)
                                % gameState.rocket.fire.frameHolds,
                            image: gameState.rocket.fire.holdCounter === 0
                                ? gameState.rocket.fire.images[nextImageIndex(gameState.rocket.fire)]
                                : gameState.rocket.fire.images[gameState.rocket.fire.imageIndex],
                            imageIndex: gameState.rocket.fire.holdCounter === 0
                                ? nextImageIndex(gameState.rocket.fire)
                                : gameState.rocket.fire.imageIndex
                        }
                    }
                }
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
