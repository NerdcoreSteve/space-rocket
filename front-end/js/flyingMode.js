const
    R = require('ramda'),
    tap = require('./tap'),
    {Map, fromJS} = require('immutable-ext'),
    flying = (gameState, input) => fromJS(checkCollisions(flyingLogic(gameState, input).toJS())),
    nextImageIndex = animateable =>
        (animateable.imageIndex + 1) % animateable.images.length,
    rocketDy = gameState => {
        const rocketVector = gameState.field.rocket.speed * gameState.field.rocket.direction
        return gameState.field.rocket.y >=0
            ? gameState.field.rocket.y + gameState.field.rocket.height <= gameState.screen.height
                ? rocketVector
                : gameState.field.rocket.direction === 1 ? 0 : gameState.field.rocket.direction
            : gameState.field.rocket.direction === -1 ? 0 : gameState.field.rocket.direction
    },
    collided = (rect1, rect2) =>
        rect1.x < rect2.x + rect2.width
            && rect1.x + rect1.width > rect2.x
            && rect1.y < rect2.y + rect2.height
            && rect1.height + rect1.y > rect2.y,
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
    rectsMidpoint = (rect1, rect2) => ({
        x: (rect1.x + rect2.x)/2,
        y: (rect1.y + rect2.y)/2
    }),
    rectMidpoint = rect => ({
        x: rect.x + (rect.width / 2),
        y: rect.y + (rect.height / 2),
    }),
    checkCollisions = gameState =>
        R.pipe(
            R.over(
                R.lens(
                    R.path(['field', 'asteroidField', 'asteroids']),
                    R.assocPath(['field', 'collisions'])),
                R.reduce(
                    (collisions, asteroid) =>
                        (collided(gameState.field.rocket, asteroid))
                            ? R.pipe(
                                rectsMidpoint,
                                collisionMidpoint =>
                                    collision(
                                        gameState.screen.width,
                                        gameState.screen.height,
                                        collisionMidpoint.x,
                                        collisionMidpoint.y),
                                collision => ({
                                    ...collision,
                                    x: collision.x - collision.width / 2,
                                    y: collision.y - collision.height / 2
                                }),
                                R.append(R.__, collisions))(
                                    rectMidpoint(gameState.field.rocket),
                                    rectMidpoint(asteroid))
                            : collisions,
                    [])),
                gameState =>
                    gameState.field.collisions.length
                        ? {...gameState, mode: 'restart'}
                        : gameState)
                    (gameState),
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
                const pameState = gameState
                gameState = gameState.toJS()
                return pameState
                    .update('commands', commands =>
                        pameState.getIn(['field', 'asteroidField', 'nextCounter']) === 0
                            ? commands.push(
                                fromJS({
                                    type: 'random_numbers',
                                    returnType: 'new_asteroid',
                                    numbers: {
                                        speed: [130, 260],
                                        y: [1, 100]
                                    }
                                }))
                            : commands)
                    .update('field', field => field.merge(fromJS({
                        rocket: {
                            ...gameState.field.rocket,
                            y: gameState.field.rocket.y + rocketDy(gameState),
                            fire: {
                                ...gameState.field.rocket.fire,
                                y: gameState.field.rocket.fire.y + rocketDy(gameState),
                                holdCounter: (gameState.field.rocket.fire.holdCounter + 1)
                                    % gameState.field.rocket.fire.frameHolds,
                                image: gameState.field.rocket.fire.holdCounter === 0
                                    ? gameState.field.rocket.fire.images[
                                        nextImageIndex(gameState.field.rocket.fire)]
                                    : gameState.field.rocket.fire.images[
                                        gameState.field.rocket.fire.imageIndex],
                                imageIndex: gameState.field.rocket.fire.holdCounter === 0
                                    ? nextImageIndex(gameState.field.rocket.fire)
                                    : gameState.field.rocket.fire.imageIndex
                            }
                        }
                    }))
                        .update('starField', starField => {
                            const dy = 
                                (pameState.getIn(['field', 'starField', 'x1'])
                                    - pameState.getIn(['field', 'starField', 'speed']))
                                        % pameState.getIn(['screen', 'width'])
                            return starField
                                .set('x1', dy)
                                .set('x2', dy + pameState.getIn(['screen', 'width']))
                        })
                        .update('asteroidField', asteroidField => asteroidField.merge(fromJS({
                            asteroids: R.pipe(
                                R.map(asteroid =>
                                    ({
                                        ...asteroid,
                                        x: asteroid.x - asteroid.speed
                                    })),
                                R.reject(asteroid => asteroid.x + asteroid.width < 0))
                                    (gameState.field.asteroidField.asteroids)
                        }))
                            .update(
                                'nextCounter',
                                nextCounter =>
                                    nextCounter
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
