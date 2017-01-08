const
    R = require('ramda'),
    Rx = require('rx'),
    context = document.getElementById("gameScreen").getContext("2d")

context.canvas.width = window.innerWidth * .95
context.canvas.height = window.innerWidth * .6

//Todo
//     rename series to let's make a game
//     Can't do any more recordings until you've uploaded the ones you've made
//     Need to animate rather than just jump from one spot to the next
//     Why is there a delay when I press down?
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
            x: 0,
            y: 0,
            width: context.canvas.width / 10,
            height: context.canvas.height / 10,
            speed: 90,
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
                        y: gameState.rocket.y - gameState.rocket.speed
                    }
                }
            case 'ArrowDownkeydown':
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

//16.67ms gives me 60 frames per second
const clock = Rx.Observable.interval(16.67)
    .map(() => 'tick')

Rx.Observable.fromEvent(document, 'keydown')
    .merge(Rx.Observable.fromEvent(document, 'keyup'))
    .map(e => e.key + e.type)
    .filter(R.pipe(R.match(/^(ArrowUp|ArrowDown).*$/), R.length))
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
