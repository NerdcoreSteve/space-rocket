module.exports = (width, height) => {
    const
        rocketLength = width / 10,
        rocketWidth = rocketLength * (48 / 122)
    return {
        commands: [],
        screen: {
            width: width,
            height: height
        },
        mode: 'pause',
        pause: {
            paused: {
                x: width * .2,
                y: height * .5,
                width: width * .6,
                height: width * .6 * (90/290),
                image: '/images/paused.png',
            },
        },
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
            }
        },
        field: {
            starField: {
                image: '/images/starfield.png',
                x1: 0,
                x2: width,
                speed: width / 470
            },
            asteroidField: {
                nextCounter: 0,
                nextDuration: 30,
                asteroids: []
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
            },
            collisions: []
        }
    }
}
