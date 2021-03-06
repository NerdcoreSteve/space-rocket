const
    R = require('ramda'),
    tap = require('./tap'),
    {Map, List, fromJS} = require('immutable-ext'),
    flying = (gameState, input) => checkCollisions(flyingLogic(gameState, input)),
    nextImageIndex = animateable =>
        (animateable.get('imageIndex') + 1) % animateable.get('images').size,
    rocketDy = gameState => {
        const
            rocket = gameState.getIn(['field', 'rocket']),
            direction = rocket.get('direction')
        return rocket.get('y') >= 0
            ? rocket.get('y') + rocket.get('height') <= gameState.getIn(['screen', 'height'])
                ? rocket.get('speed') * direction
                : direction === 1 ? 0 : direction
            : direction === -1 ? 0 : direction
    },
    rocketY = R.curry((gameState, y) => y + rocketDy(gameState)),
    collided = (rect1, rect2) =>
        rect1.get('x') < rect2.get('x') + rect2.get('width')
            && rect1.get('x') + rect1.get('width') > rect2.get('x')
            && rect1.get('y') < rect2.get('y') + rect2.get('height')
            && rect1.get('height') + rect1.get('y') > rect2.get('y'),
    collision = (screenWidth, screenHeight, x, y) => {
        const width = screenWidth / 15
        return {
            x: x,
            y: y,
            width: width,
            height: width * (136/168),
            image: 'collision',
        }
    },
    toJSRect = rect => ({
        x: rect.get('x'),
        y: rect.get('y'),
        width: rect.get('width'),
        height: rect.get('height'),
    }),
    rectsMidpoint = (rect1, rect2) => ({
        x: (rect1.x + rect2.x)/2,
        y: (rect1.y + rect2.y)/2
    }),
    rectMidpoint = rect => ({
        x: rect.x + (rect.width / 2),
        y: rect.y + (rect.height / 2),
    }),
    checkCollisions = gameState =>
        gameState.setIn(
            ['field', 'collisions'],
            gameState.getIn(['field', 'asteroidField', 'asteroids'])
                .reduce((collisions, asteroid) => {
                    const
                        rocket = gameState.getIn(['field', 'rocket']),
                        rocketRect = toJSRect(rocket),
                        asteroidRect = toJSRect(asteroid)
                        
                    return collided(rocket, asteroid)
                        ? R.pipe(
                            rectsMidpoint,
                            collisionMidpoint =>
                                collision(
                                    gameState.getIn(['screen', 'width']),
                                    gameState.getIn(['screen', 'height']),
                                    collisionMidpoint.x,
                                    collisionMidpoint.y),
                            collision => Map({
                                ...collision,
                                x: collision.x - collision.width / 2,
                                y: collision.y - collision.height / 2
                            }),
                            collision => collisions.push(collision))(
                                rectMidpoint(rocketRect),
                                rectMidpoint(asteroidRect))
                        : collisions
                    },
                    List()))
                .update('mode', mode =>
                    gameState.getIn(['field', 'collisions']).size
                        ? 'restart'
                        : mode),
    asteroid = (width, height, rand, speed) => {
        const
            asteroidWidth = width / 20,
            asteroidHeight = asteroidWidth * (87/95)
        return Map({
            x: width * 1.5,
            y: (height - (asteroidHeight / 2)) * (rand / 100.0),
            width: asteroidWidth,
            height: asteroidHeight,
            speed: speed,
            image: 'asteroid'
        })
    },
    flyingLogic = (gameState, input) => {
        switch(input.type) {
            case 'ArrowUpkeydown':
                return gameState.updateIn(
                    ['field', 'rocket'],
                    rocket => rocket.set('keyUpDown', true).set('direction', -1))
            case 'ArrowDownkeydown':
                return gameState.updateIn(
                    ['field', 'rocket'],
                    rocket => rocket.set('keyDownDown', true).set('direction', 1))
            case 'ArrowUpkeyup':
                return gameState.updateIn(
                    ['field', 'rocket'],
                    rocket => rocket
                        .set('keyUpDown', false)
                        .set(
                            'direction',
                            gameState.getIn(['field', 'rocket', 'keyDownDown']) ? 1 : 0))
            case 'ArrowDownkeyup':
                return gameState.updateIn(
                    ['field', 'rocket'],
                    rocket => rocket
                        .set('keyDownDown', false)
                        .set(
                            'direction',
                            gameState.getIn(['field', 'rocket', 'keyUpDown']) ? -1 : 0))
            case 'tick':
                return gameState
                    .update('commands', commands => {
                        const asteroidField = gameState.getIn(['field', 'asteroidField'])
                        return asteroidField.get('nextCounter') === 0
                            ? commands.push(
                                fromJS({
                                    type: 'random_numbers',
                                    returnType: 'new_asteroid',
                                    numbers: {
                                        speed: asteroidField.get('speedRange').toJS(),
                                        y: asteroidField.get('positionRange').toJS()
                                    }
                                }))
                            : commands
                     })
                    .update('field', field => field
                        .update('rocket', rocket => rocket
                            .update('fire', fire => fire
                                .update('y', rocketY(gameState))
                                .set('image', fire.get('images').get(fire.get('imageIndex')))
                                .update('holdCounter', holdCounter =>
                                    (holdCounter + 1) % fire.get('frameHolds'))
                                .update('imageIndex', imageIndex =>
                                    fire.get('holdCounter') === 0
                                        ? nextImageIndex(fire)
                                        : imageIndex))
                            .update('y', rocketY(gameState)))
                        .update('starField', starField => {
                            const dy = 
                                (starField.get('x1') - starField.get('speed'))
                                    % gameState.getIn(['screen', 'width'])
                            return starField
                                .set('x1', dy)
                                .set('x2', dy + gameState.getIn(['screen', 'width']))
                        })
                        .update('asteroidField', asteroidField => asteroidField
                            .update(
                                'asteroids',
                                asteroids => asteroids
                                    .map(asteroid =>
                                        asteroid.update('x', x => x - asteroid.get('speed')))
                                    .filter(asteroid =>
                                        asteroid.get('x') + asteroid.get('width') >= 0))
                            .update(
                                'nextCounter',
                                nextCounter => nextCounter
                                    ? nextCounter - 1
                                    : asteroidField.get('nextDuration'))))
            case 'new_asteroid':
                return gameState.
                    updateIn(
                        ['field', 'asteroidField', 'asteroids'],
                        asteroids => asteroids.push(
                            asteroid(
                                gameState.getIn(['screen', 'width']) * 1.0,
                                gameState.getIn(['screen', 'height']),
                                input.numbers.y,
                                gameState.getIn(['screen', 'width']) / (input.numbers.speed * 1.0))))
            case 'Escape':
                return gameState.set('mode', 'pause')
            default:
                return gameState
        }
    }

module.exports = flying
