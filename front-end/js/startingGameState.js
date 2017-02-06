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
        mode: 'start',
        start: {
            space_rocket: {
                x: width * .2,
                y: height * .01,
                width: width * .6,
                height: width * .6 * (200/387),
                image: '/images/space_rocket.png',
            },
            updown: {
                x: width * .20,
                y: height * .70,
                width: width * .6,
                height: width * .6 * (90/1324),
                image: '/images/updown.png',
            },
            esc: {
                x: width * .3,
                y: height * .80,
                width: width * .4,
                height: width * .4 * (90/930),
                image: '/images/esc.png',
            },
            pressAnyKey: {
                x: width * .35,
                y: height * .89,
                width: width * .3,
                height: width * .3 * (90/623),
                image: '/images/pressAnyKey.png',
            },
        },
        pause: {
            paused: {
                x: width * .2,
                y: height * .05,
                width: width * .6,
                height: width * .6 * (90/290),
                image: '/images/paused.png',
            },
            updown: {
                x: width * .05,
                y: height * .55,
                width: width * .9,
                height: width * .9 * (90/1324),
                image: '/images/updown.png',
            },
            esc: {
                x: width * .25,
                y: height * .8,
                width: width * .5,
                height: width * .5 * (90/930),
                image: '/images/esc.png',
            }
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
