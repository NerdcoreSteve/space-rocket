const
    R = require('ramda'),
    Rx = require('rx')

var c = document.getElementById("gameScreen");
var ctx = c.getContext("2d");
ctx.moveTo(0,0);
ctx.lineTo(200,100);
ctx.stroke();

Rx.Observable.fromEvent(document, 'keydown')
    .map(R.prop('key'))
    .filter(R.pipe(R.match(/^ArrowUp|ArrowDown$/), R.length))
    .subscribe(console.log)
