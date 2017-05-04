const
    R = require('ramda'),
    Task = require('data.task'),
    {List} = require('immutable-ext'),
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
    gameStore.state().get('commands').forEach(command => {
        switch(command.get('type')) {
            case 'random_numbers':
                return gameStore.reduce(
                    game,
                    {
                        type: command.get('returnType'),
                        numbers: command
                            .get('numbers')
                            .map(range => random(range.get(0), range.get(1)))
                            .toJS()
                    })
            case 'load_images':
                return command
                    .get('images')
                    .traverse(Task.of, image)
                    .fork(
                        error => undefined, //TODO what should I do with an error?
                        images => gameStore.reduce(
                            game,
                            {
                                type: command.get('returnType'),
                                images: images,
                            }))
        }
    })
    gameStore.reduce(gameState => gameState.set('commands', List()))
}
