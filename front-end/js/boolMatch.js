const R = require('ramda')
module.exports = R.curry((regex, string) => R.pipe(R.match(regex), R.length)(string))
