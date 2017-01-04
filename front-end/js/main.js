const
    R = require('ramda'),
    Rx = require('rx'),
    context = document.getElementById("gameScreen").getContext("2d")

context.canvas.width = window.innerWidth * .9
context.canvas.height = window.innerHeight * .6
const box = {
    x: 0,
    y: 0,
    width: context.canvas.width / 10,
    height: context.canvas.height / 10
}
context.fillRect(box.x, box.y, box.x + box.width, box.y + box.height)

//TODO make more functional!!
//     use scan and stuff
Rx.Observable.fromEvent(document, 'keydown')
    .map(R.prop('key'))
    .filter(R.pipe(R.match(/^ArrowUp|ArrowDown$/), R.length))
    .subscribe(arrow => {
        switch(arrow) {
            case 'ArrowUp':
                box.y--
                break;
            case 'ArrowDown':
                box.y++
                break;
        }
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        context.fillRect(box.x, box.y, box.width, box.height)
    })
