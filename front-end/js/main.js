const
    R = require('ramda'),
    Rx = require('rx'),
    context = document.getElementById("gameScreen").getContext("2d")

context.canvas.width = window.innerWidth * .95
context.canvas.height = window.innerWidth * .6

const
    box = {
        x: 0,
        y: 0,
        width: context.canvas.width / 10,
        height: context.canvas.height / 10
    },
    game = (box, arrow) => {
        switch(arrow) {
            case 'ArrowUp':
                return {
                    ...box,
                    y: box.y - 1
                }
            case 'ArrowDown':
                return {
                    ...box,
                    y: box.y + 1
                }
            default:
                return box
        }
    }

Rx.Observable.fromEvent(document, 'keydown')
    .map(R.prop('key'))
    .filter(R.pipe(R.match(/^ArrowUp|ArrowDown$/), R.length))
    .startWith('')
    .scan(game, box)
    .subscribe(box => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        context.fillRect(box.x, box.y, box.width, box.height)
    })
