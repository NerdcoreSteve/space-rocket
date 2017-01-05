const
    R = require('ramda'),
    Rx = require('rx'),
    context = document.getElementById("gameScreen").getContext("2d")

context.canvas.width = window.innerWidth * .95
context.canvas.height = window.innerWidth * .6

//Todo
//     rename series to let's make a game
//     draw rocket image
//     draw rocket fire images
//     draw star field image
//     draw asteroid image
//     draw collision image
//     replace rocket rect with rocket image
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
            x: 0,
            y: 0,
            width: context.canvas.width / 10,
            height: context.canvas.height / 10
        }
    },
    game = (gameState, input) => {
        switch(input) {
            case 'ArrowUp':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        y: gameState.rocket.y - 1
                    }
                }
            case 'ArrowDown':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        y: gameState.rocket.y + 1
                    }
                }
            default:
                return gameState
        }
    }

Rx.Observable.fromEvent(document, 'keydown')
    .map(R.prop('key'))
    .filter(R.pipe(R.match(/^ArrowUp|ArrowDown$/), R.length))
    .startWith('')
    .scan(game, gameState)
    .subscribe(gameState => {
        window.requestAnimationFrame(() => {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height)
            context.fillRect(
                gameState.rocket.x,
                gameState.rocket.y,
                gameState.rocket.width,
                gameState.rocket.height)
        })
    })
