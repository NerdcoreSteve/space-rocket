const
    R = require('ramda'),
    game = require('./game'),
    random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

module.exports =  gameStore => {
    gameStore.state().commands.forEach(command => {
        switch(command.type) {
            case 'random_numbers':
                return gameStore.reduce(
                    game,
                    {
                        type: command.returnType,
                        numbers:
                            R.pipe(
                                R.prop('numbers'),
                                R.toPairs,
                                R.map(pair => [pair[0], random(pair[1][0], pair[1][1])]),
                                R.fromPairs)
                                    (command)
                    })
        }
    })
    gameStore.reduce(R.assoc('commands', []))
}
