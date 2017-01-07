const
    R = require('ramda'),
    Rx = require('rx'),
    context = document.getElementById("gameScreen").getContext("2d")

context.canvas.width = window.innerWidth * .95
context.canvas.height = window.innerWidth * .6

//Todo
//     rename series to let's make a game
//     Fix bug: Why doesn't rocket appear until I press a button?
//     Why is there a delay when I press down?
//     Need to animate rather than just jump from one spot to the next
//     replace rocket rect with rocket image
//     add fire (need to add time)
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
            x: 0,
            y: 0,
            width: context.canvas.width / 10,
            height: context.canvas.height / 10,
            speed: 90
        }
    },
    game = (gameState, input) => {
        switch(input) {
            case 'ArrowUp':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        y: gameState.rocket.y - gameState.rocket.speed
                    }
                }
            case 'ArrowDown':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        y: gameState.rocket.y + gameState.rocket.speed
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
    }

Rx.Observable.fromEvent(document, 'keydown')
    .map(R.prop('key'))
    .filter(R.pipe(R.match(/^ArrowUp|ArrowDown$/), R.length))
    .startWith('')
    .scan(game, gameState)
    .subscribe(gameState => {
        window.requestAnimationFrame(() => {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height)
            context.drawImage(
                image('/images/rocket.png'),
                gameState.rocket.x,
                gameState.rocket.y)
        })
    })
