const
    R = require('ramda'),
    tap = require('./tap.js'),
    flying = (gameState, input) => collision(flyingLogic(gameState, input)),
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
    collision = gameState =>
        collided(gameState.field.rocket, gameState.field.asteroid)
            ? {...gameState, mode: 'restart'}
            : gameState,
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
                    field: {
                        ...gameState.field,
                        starField: {
                            ...gameState.field.starField,
                            x1: starFieldDy(gameState),
                            x2: starFieldDy(gameState) + gameState.screen.width,
                        },
                        asteroid: {
                            ...gameState.field.asteroid,
                            x: gameState.field.asteroid.x - gameState.field.asteroid.speed
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
            default:
                return gameState
        }
    }

module.exports = flying
