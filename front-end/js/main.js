const
    R = require('ramda'),
    Rx = require('rx'),
    context = document.getElementById("gameScreen").getContext("2d")

context.canvas.width = window.innerWidth * .95
context.canvas.height = window.innerWidth * .6

//Todo
//     only one downarrowdown instead of many, same with uparrowdown,
//         other signals are uparrowup and downarrowup.
//     use downarrowdown and uparrowdown flags in game state
//     remember conversation with my partner
//     explain what's been done since the last video
//     rename series to let's make a game
//     Can't do any more recordings until you've uploaded the ones you've made
//     add fire
//     draw star field image
//     draw asteroid image
//     draw collision image
//     make rocket appear vertically centered at first, and not exactly at the side
//     make rocket move faster (hard-code speed in a const?)
//     add rocket fire animation
//     make star field move
//     add single asteroid move towards you from right side
//     make asteroid appear randomly
//     make array of asteroids
//     collision detection
//     show collision image and then reset game
//     What else before I call it done?
//     put up on heroku and porfolio
//     make sequel: space rocket 2

const
    gameState = {
        rocket: {
            x: 30,
            y: 0,
            width: context.canvas.width / 10,
            height: context.canvas.height / 10,
            keyUpDown: false,
            direction: 0,
            keyDownDown: false,
            speed: 5,
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
    image = (url) => {
        var imageObject = new Image()
        imageObject.src = url
        return imageObject
    },
    clock = Rx.Observable.interval(16.67).map(() => 'tick'), // 60 fps
    boolMatch = regex => R.pipe(R.match(regex), R.length)

Rx.Observable.fromEvent(document, 'keydown')
    .merge(Rx.Observable.fromEvent(document, 'keyup'))
    .map(e => e.key + e.type)
    .filter(boolMatch(/^(ArrowUp|ArrowDown).*$/))
    .scan((acc, el) => acc.match(el) ? 'remove' + el : el)
    .filter(R.pipe(boolMatch(/^(remove).*$/), R.not))
    .merge(clock)
    .startWith('')
    .scan(game, gameState)
    .subscribe(gameState => {
        window.requestAnimationFrame(() => {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height)
            context.drawImage(
                image(gameState.rocket.image),
                gameState.rocket.x,
                gameState.rocket.y)
        })
    })
