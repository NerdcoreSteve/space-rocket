const
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
    }

module.exports = (gameState, input) => {
    return {
        ...gameState,
        restart: {
            ...gameState.restart,
            collision: {
                ...repositionCollision(
                    gameState.rocket, gameState.asteroid, gameState.restart.collision),
            }
        }
    }
}
