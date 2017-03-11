const
    R = require('ramda'),
    Task = require('data.task'),
    Immutable = require('immutable'),
    {Map} = require('immutable-ext'),
    game = require('./game'),
    random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    image = url =>
        new Task((rej, res) => {
                var img = new Image()
                img.onload = function () { res(img, ...arguments) }
                img.onerror = rej
                img.src = url
            })

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
            case 'load_images':
                return Map(command.images)
                    .traverse(Task.of, image)
                    .fork(
                        error => undefined, //TODO what should I do with an error?
                        images => gameStore.reduce(
                            game,
                            {
                                type: command.returnType,
                                images: images,
                            }))
        }
    })
    gameStore.reduce(R.assoc('commands', []))
}
