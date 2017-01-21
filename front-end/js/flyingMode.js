const
    R = require('ramda'),
    flying = (gameState, input) => collision(flyingLogic(gameState, input)),
    starFieldDy = gameState =>
        (gameState.starField.x1 - gameState.starField.speed) % gameState.screen.width,
    nextImageIndex = animateable =>
        (animateable.imageIndex + 1) % animateable.images.length,
    rocketDy = gameState => {
        const rocketVector = gameState.rocket.speed * gameState.rocket.direction
        return gameState.rocket.y >=0
            ? gameState.rocket.y + gameState.rocket.height <= gameState.screen.height
                ? rocketVector
                : gameState.rocket.direction === 1 ? 0 : gameState.rocket.direction
            : gameState.rocket.direction === -1 ? 0 : gameState.rocket.direction
    },
    collided = (rect1, rect2) =>
        rect1.x < rect2.x + rect2.width
            && rect1.x + rect1.width > rect2.x
            && rect1.y < rect2.y + rect2.height
            && rect1.height + rect1.y > rect2.y,
    rectMidpoint = rect => ({
            x: rect.x + (rect.width / 2),
            y: rect.y + (rect.height / 2),
        }),
    repositionByMidpoint = (x, y, rect) => ({
            ...rect,
            x: x - (rect.width / 2),
            y: y - (rect.height / 2)
        }),
    rectsMidpoint = (rect1, rect2) => ({
            x: (rect1.x + rect2.x)/2,
            y: (rect1.y + rect2.y)/2
        }),
    repositionCollision = (rocket, asteroid, collision) => {
        const collisionMidpoint = rectsMidpoint(rectMidpoint(rocket), rectMidpoint(asteroid))
        return repositionByMidpoint(collisionMidpoint.x, collisionMidpoint.y, collision)
    },
    collision = gameState =>
        collided(gameState.rocket, gameState.asteroid)
            ? {
                ...gameState,
                mode: 'crashed',
                collision: {
                    ...repositionCollision(gameState.rocket, gameState.asteroid, gameState.collision),
                    modeHoldCounter: gameState.collision.modeHold
                }
            }
            : gameState,
    flyingLogic = (gameState, input) => {
        switch(input) {
            case 'ArrowUpkeydown':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        keyUpDown: true,
                        direction: -1
                    }
                }
            case 'ArrowDownkeydown':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        keyDownDown: true,
                        direction: 1
                    }
                }
            case 'ArrowUpkeyup':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        keyUpDown: false,
                        direction: gameState.rocket.keyDownDown ? 1 : 0
                    }
                }
            case 'ArrowDownkeyup':
                return {
                    ...gameState,
                    rocket: {
                        ...gameState.rocket,
                        keyDownDown: false,
                        direction: gameState.rocket.keyUpDown ? -1 : 0
                    }
                }
            case 'tick':
                return {
                    ...gameState,
                    starField: {
                        ...gameState.starField,
                        x1: starFieldDy(gameState),
                        x2: starFieldDy(gameState) + gameState.screen.width,
                    },
                    asteroid: {
                        ...gameState.asteroid,
                        x: gameState.asteroid.x - gameState.asteroid.speed
                    },
                    rocket: {
                        ...gameState.rocket,
                        y: gameState.rocket.y + rocketDy(gameState),
                        fire: {
                            ...gameState.rocket.fire,
                            y: gameState.rocket.fire.y + rocketDy(gameState),
                            holdCounter: (gameState.rocket.fire.holdCounter + 1)
                                % gameState.rocket.fire.frameHolds,
                            image: gameState.rocket.fire.holdCounter === 0
                                ? gameState.rocket.fire.images[nextImageIndex(gameState.rocket.fire)]
                                : gameState.rocket.fire.images[gameState.rocket.fire.imageIndex],
                            imageIndex: gameState.rocket.fire.holdCounter === 0
                                ? nextImageIndex(gameState.rocket.fire)
                                : gameState.rocket.fire.imageIndex
                        }
                    }
                }
            default:
                return gameState
        }
    }

module.exports = flying
