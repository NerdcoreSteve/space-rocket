const
    R = require('ramda'),
    Rx = require('rx'),
    context = document.getElementById("gameScreen").getContext("2d"),
    screenShrinkFactor = .6

context.canvas.width = window.innerWidth * screenShrinkFactor * 1.5
context.canvas.height = window.innerWidth * screenShrinkFactor * (480 / 640) 

//Todo
//     Can't do any more recordings until you've uploaded the ones you've made
//     explain what's been done since the last video
//     prevent ship from going out of screen
//     make star field image move
//     add fire animation
//     draw asteroid image
//     add single asteroid move towards you from right side
//     draw collision image
//     collision detection
//     show collision image and then reset game
//     make asteroid appear randomly
//     make array of asteroids that appear randomly and at random speeds and sizes
//     make a pause screen that shows game instructions and player stats
//     What else before I call it done?
//     put up on heroku and porfolio
//     make sequel: space rocket 2

const
    rocketLength = context.canvas.width / 10,
    gameState = {
        starField: {
            image: '/images/starfield.png'
        },
        rocket: {
            x: context.canvas.width / 25,
            y: context.canvas.height / 3,
            width: rocketLength,
            height: rocketLength * (48 / 122), // divide by image dimensions
            keyUpDown: false,
            direction: 0,
            keyDownDown: false,
            speed: context.canvas.height / 90,
            image: '/images/rocket.png'
        }
    },
    game = (gameState, input) => {
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
                    rocket: {
                        ...gameState.rocket,
                        y: gameState.rocket.y + gameState.rocket.speed * gameState.rocket.direction
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
    clock = Rx.Observable.interval(16.67).map(() => 'tick'), // 60 fps
    boolMatch = regex => R.pipe(R.match(regex), R.length),
    render = gameState => {
        window.requestAnimationFrame(() => {
            context.drawImage(
                image(gameState.starField.image),
                0,
                0,
                context.canvas.width,
                context.canvas.height)
            context.drawImage(
                image(gameState.rocket.image),
                gameState.rocket.x,
                gameState.rocket.y,
                gameState.rocket.width,
                gameState.rocket.height)
        })
    }

Rx.Observable.fromEvent(document, 'keydown')
    .merge(Rx.Observable.fromEvent(document, 'keyup'))
    .map(e => e.key + e.type)
    .filter(boolMatch(/^(ArrowUp|ArrowDown).*$/))
    .distinctUntilChanged()
    .merge(clock)
    .scan(game, gameState)
    .subscribe(render)
