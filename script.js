const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const CANVAS_WIDTH = canvas.width = 2160
const CANVAS_HEIGHT = canvas.height = 1080

const playerImage = new Image()
playerImage.src = './shadow_dog.png'

const player = {
    width: 575,
    height: 523,
    position: {
        x: 50,
        y: 720
    },
    movement: {
        idle: {
            position: 0,
            count: 7
        },
        jump: {
            position: 1,
            count: 7
        },
        fall: {
            position: 2,
            count: 7
        },
        run: {
            position: 3,
            count: 9
        },
        dizzy: {
            position: 4,
            count: 11
        },
        sit: {
            position: 5,
            count: 5
        },
        roll: {
            position: 6,
            count: 7
        },
        bite: {
            position: 7,
            count: 7
        },
        faint: {
            position: 8,
            count: 12
        },
        hit: {
            position: 9,
            count: 4
        }
    },
    frame: 0
}

let frameCount = 0
let movementType = 'idle'


const updatePlayerPosition = () => {
    const currentMovement = player.movement[movementType]
    if (!(frameCount % Math.floor(30 / currentMovement.count)))
        ++player.frame
    if (player.frame >= currentMovement.count) {
        player.frame = 0
        if (['hit', 'bite'].includes(movementType))
            movementType = 'idle'
    }
}

const updatePlayerHeight = () => {
    if (player.position.y < 100 || (['idle', 'fall'].includes(movementType) && player.position.y < 720)) {
        movementType = 'fall'
        player.position.y += 10
        if (player.position.y === 720)
            movementType = 'idle'
    }
    else if (movementType === 'jump')
        player.position.y -= 10
}

const checkIsInVerticalMotion = () => !['jump', 'fall'].includes(movementType)


const animate = () => {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    updatePlayerPosition()
    updatePlayerHeight()
    context.drawImage(playerImage, player.width * player.frame, player.height * player.movement[movementType].position, player.width, player.height, player.position.x, player.position.y, 320, 290)

    ++frameCount
    if (frameCount > 60)
        frameCount = 0
    requestAnimationFrame(animate)
}

window.addEventListener("keydown", (event) => {
    if (!checkIsInVerticalMotion()) return
    switch (event.key) {
        case 'ArrowUp':
            movementType = 'jump'
            break;
        case 'ArrowRight':
            movementType = 'run'
            break;
        case 'ArrowDown':
            movementType = 'sit'
            break;
        case ' ':
            movementType = 'bite'
            break;
        case 'Enter':
            movementType = 'roll'
            break;
        default:
            break;
    }
})

window.addEventListener("keyup", () => {
    if (movementType !== 'bite')
        movementType = 'idle'
})

animate()