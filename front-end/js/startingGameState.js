module.exports = (width, height) => {
    const
        rocketLength = width / 10,
        rocketWidth = rocketLength * (48 / 122)
    return {
        images: {},
        commands: [
            {
                type: 'load_images',
                returnType: 'starting_images_loaded',
                images: {
                    space_rocket: '/images/space_rocket.png',
                    updown: '/images/updown.png',
                    pressAnyKey: '/images/pressAnyKey.png',
                    destroyed: '/images/destroyed.png',
                    starfield: '/images/starfield.png',
                    rocket: '/images/rocket.png',
                    rocketFire1: '/images/rocketFire1.png',
                    rocketFire2: '/images/rocketFire2.png',
                    paused: 'paused',
                    asteroid: '/images/asteroid.png',
                    collision: '/images/collision.png',
                }
            }
        ],
        screen: {
            width: width,
            height: height,
        },
        mode: 'loading',
        loading: {
            text: {
                x: width * 0.5,
                y: height * 0.7,
                font: `900 ${width / 10}px Arial`,
                color: '#f8cc00',
                text: 'LOADING'
            }
        },
        start: {
            space_rocket: {
                x: width * .2,
                y: height * .01,
                width: width * .6,
                height: width * .6 * (200/387),
                image: 'space_rocket',
            },
            updown: {
                x: width * .20,
                y: height * .70,
                width: width * .6,
                height: width * .6 * (90/1324),
                image: 'updown',
            },
            esc: {
                x: width * .3,
                y: height * .80,
                width: width * .4,
                height: width * .4 * (90/930),
                image: 'esc',
            },
            pressAnyKey: {
                x: width * .35,
                y: height * .89,
                width: width * .3,
                height: width * .3 * (90/623),
                image: 'pressAnyKey',
            },
        },
        pause: {
            paused: {
                x: width * .2,
                y: height * .05,
                width: width * .6,
                height: width * .6 * (90/290),
                image: 'paused',
            },
            updown: {
                x: width * .05,
                y: height * .55,
                width: width * .9,
                height: width * .9 * (90/1324),
                image: 'updown',
            },
            esc: {
                x: width * .25,
                y: height * .8,
                width: width * .5,
                height: width * .5 * (90/930),
                image: 'esc',
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
                image: 'pressAnyKey',
            },
            destroyed: {
                x: 0,
                y: height * .1,
                width: width,
                height: width * (160/786),
                image: 'destroyed',
            }
        },
        field: {
            starField: {
                image: 'starfield',
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
                image: 'rocket',
                fire: {
                    x: width / 40,
                    y: height / 3,
                    width: rocketWidth * .6,
                    height: rocketWidth * .8,
                    image: 'rocketFire1',
                    imageIndex: 0,
                    images: ['rocketFire1', 'rocketFire2'],
                    frameHolds: 5,
                    holdCounter: 5,
                }
            },
            collisions: []
        }
    }
}
