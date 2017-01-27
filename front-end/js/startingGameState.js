module.exports = (width, height) => {
    const
        rocketLength = width / 10,
        rocketWidth = rocketLength * (48 / 122), // divide by image dimensions
        asteroidWidth = width / 20,
        asteroidHeight = asteroidWidth * (87/95),
        collisionWidth = width / 15,
        collisionHeight = collisionWidth * (136/168)
    return {
        screen: {
            width: width,
            height: height
        },
        mode: 'flying',
        restart: {
            mode: 'begin',
            crashedHold: 40,
            destroyedHold: 50,
            holdCounter: 0,
            pressAnyKey: {
                x: width * .2,
                y: height * .5,
                width: width * .6,
                height: width * .6 * (90/623),
                image: '/images/pressAnyKey.png',
            },
            destroyed: {
                x: 0,
                y: height * .1,
                width: width,
                height: width * (160/786),
                image: '/images/destroyed.png',
            },
            collision: {
                x: 0,
                y: 0,
                width: collisionWidth,
                height: collisionHeight,
                image: '/images/collision.png',
            }
        },
        field: {
            starField: {
                image: '/images/starfield.png',
                x1: 0,
                x2: width,
                speed: width / 470
            },
            asteroid: {
                x: height * 2,
                y: height / 3,
                width: asteroidWidth,
                height: asteroidHeight,
                speed: height / 90,
                image: '/images/asteroid.png'
            },
            rocket: {
                x: width / 25,
                y: height / 3,
                width: rocketLength,
                height: rocketWidth,
                keyUpDown: false,
                direction: 0,
                keyDownDown: false,
                speed: height / 90,
                image: '/images/rocket.png',
                fire: {
                    x: width / 40,
                    y: height / 3,
                    width: rocketWidth * .6,
                    height: rocketWidth * .8,
                    image: '/images/rocketFire1.png',
                    imageIndex: 0,
                    images: ['/images/rocketFire1.png', '/images/rocketFire2.png'],
                    frameHolds: 5,
                    holdCounter: 5,
                }
            }
        }
    }
}
