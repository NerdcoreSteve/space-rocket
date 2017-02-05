const
    R = require('ramda'),
    tap = require('./tap.js'),
    flying = (gameState, input) => checkCollisions(flyingLogic(gameState, input)),
    starFieldDy = gameState =>
        (gameState.field.starField.x1 - gameState.field.starField.speed) % gameState.screen.width,
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
            image: '/images/collision.png',
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
    asteroid = (width, y, speed) => {
        const
            asteroidWidth = width / 20,
            asteroidHeight = asteroidWidth * (87/95)
        return {
            x: width * 1.5,
            y: y,
            width: asteroidWidth,
            height: asteroidHeight,
            speed: speed,
            image: '/images/asteroid.png'
        }
    },
    flyingLogic = (gameState, input) => {
        switch(input.type) {
            case 'ArrowUpkeydown':
                return {
                    ...gameState,
                    field: {
                        ...gameState.field,
                        rocket: {
                            ...gameState.field.rocket,
                            keyUpDown: true,
                            direction: -1
                        }
                    }
                }
            case 'ArrowDownkeydown':
                return {
                    ...gameState,
                    field: {
                        ...gameState.field,
                        rocket: {
                            ...gameState.field.rocket,
                            keyDownDown: true,
                            direction: 1
                        }
                    }
                }
            case 'ArrowUpkeyup':
                return {
                    ...gameState,
                    field: {
                        ...gameState.field,
                        rocket: {
                            ...gameState.field.rocket,
                            keyUpDown: false,
                            direction: gameState.field.rocket.keyDownDown ? 1 : 0
                        }
                    }
                }
            case 'ArrowDownkeyup':
                return {
                    ...gameState,
                    field: {
                        ...gameState.field,
                        rocket: {
                            ...gameState.field.rocket,
                            keyDownDown: false,
                            direction: gameState.field.rocket.keyUpDown ? -1 : 0
                        }
                    }
                }
            case 'tick':
                return {
                    ...gameState,
                    commands: gameState.field.asteroidField.nextCounter === 0
                        ? gameState.commands.concat({
                                type: 'random_numbers',
                                returnType: 'new_asteroid',
                                numbers: {
                                    speed: [130, 260],
                                    y: [1, 100]
                                }
                            })
                        : gameState.commands,
                    field: {
                        ...gameState.field,
                        starField: {
                            ...gameState.field.starField,
                            x1: starFieldDy(gameState),
                            x2: starFieldDy(gameState) + gameState.screen.width,
                        },
                        asteroidField: {
                            ...gameState.field.asteroidField,
                            nextCounter: gameState.field.asteroidField.nextCounter
                                ? gameState.field.asteroidField.nextCounter - 1
                                : gameState.field.asteroidField.nextDuration,
                            asteroids: R.pipe(
                                R.map(asteroid =>
                                    ({
                                        ...asteroid,
                                        x: asteroid.x - asteroid.speed
                                    })),
                                R.reject(asteroid => asteroid.x + asteroid.width < 0))
                                    (gameState.field.asteroidField.asteroids)
                        },
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
                    }
                }
            case 'new_asteroid':
                return R.over(
                    R.lensPath(['field', 'asteroidField', 'asteroids']),
                    R.append(
                        asteroid(
                            gameState.screen.width * 1.0,
                            gameState.screen.height * (input.numbers.y / 100.0),
                            gameState.screen.width / (input.numbers.speed * 1.0))),
                    gameState)
            case 'Escape':
                return {
                    ...gameState,
                    mode: 'pause'
                }
            default:
                return gameState
        }
    }

module.exports = flying
