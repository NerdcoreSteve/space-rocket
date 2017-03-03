const
    R = require('ramda')

var
    tap = x => { console.log(x); return x }

tap.filter = R.curry((f, x) => { if(f(x)) console.log(x); return x })
tap.lens = R.curry((l, x) => { console.log(l(x)); return x })
tap.lensFilter = R.curry((l, f, x) => { if(f(x)) console.log(l(x)); return x })

module.exports = tap
