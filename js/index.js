const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 700
canvas.height = 500

class Nave {
  constructor() {
    this.velocidade = {
      x: 0,
      y: 0
    }

    this.rotation = 0
    this.opacity = 1

    const image = new Image()
    image.src = './img/spaceship.png'
    image.onload = () => {
      const scale = 0.15
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.posicao = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20
      }
    }
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.posicao.x, this.posicao.y, this.width, this.height)

    c.save()
    c.globalAlpha = this.opacity
    c.translate(
      nave.posicao.x + nave.width / 2,
      nave.posicao.y + nave.height / 2
    )
    c.rotate(this.rotation)

    c.translate(
      -nave.posicao.x - nave.width / 2,
      -nave.posicao.y - nave.height / 2
    )

    c.drawImage(
      this.image,
      this.posicao.x,
      this.posicao.y,
      this.width,
      this.height
    )
    c.restore()
  }

  update() {
    if (this.image) {
      this.draw()
      this.posicao.x += this.velocidade.x
    }
  }
}

class Projetil {
  constructor({ posicao, velocidade, color = 'red' }) {
    this.posicao = posicao
    this.velocidade = velocidade

    this.radius = 4
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.posicao.x, this.posicao.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.posicao.x += this.velocidade.x
    this.posicao.y += this.velocidade.y
  }
}

class ProjetilInvader {
  constructor({ posicao, velocidade }) {
    this.posicao = posicao
    this.velocidade = velocidade

    this.width = 3
    this.height = 10
  }

  draw() {
    c.fillStyle = 'white'
    c.fillRect(this.posicao.x, this.posicao.y, this.width, this.height)
  }

  update() {
    this.draw()
    this.posicao.x += this.velocidade.x
    this.posicao.y += this.velocidade.y
  }
}

class Invader {
  constructor({ posicao }) {
    this.velocidade = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = './img/invader.png'
    image.onload = () => {
      const scale = 1
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.posicao = {
        x: posicao.x,
        y: posicao.y
      }
    }
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.posicao.x, this.posicao.y, this.width, this.height)

    c.drawImage(
      this.image,
      this.posicao.x,
      this.posicao.y,
      this.width,
      this.height
    )
  }

  update({ velocidade }) {
    if (this.image) {
      this.draw()
      this.posicao.x += velocidade.x
      this.posicao.y += velocidade.y
    }
  }

  tiro(projetilInvader) {
    projetilInvader.push(
      new ProjetilInvader({
        posicao: {
          x: this.posicao.x + this.width / 2,
          y: this.posicao.y + this.height
        },
        velocidade: {
          x: 0,
          y: 5
        }
      })
    )
  }
}

class FileirasInvaders {
  constructor() {
    this.posicao = {
      x: 0,
      y: 0
    }

    this.velocidade = {
      x: 3,
      y: 0
    }

    this.invaders = []

    const colunas = Math.floor(Math.random() * 10 + 5)
    const linhas = Math.floor(Math.random() * 5 + 2)

    this.width = colunas * 30

    for (let x = 0; x < colunas; x++) {
      for (let y = 0; y < linhas; y++) {
        this.invaders.push(
          new Invader({
            posicao: {
              x: x * 30,
              y: y * 30
            }
          })
        )
      }
    }
  }

  update() {
    this.posicao.x += this.velocidade.x
    this.posicao.y += this.velocidade.y

    this.velocidade.y = 0

    if (this.posicao.x + this.width >= canvas.width || this.posicao.x <= 0) {
      this.velocidade.x = -this.velocidade.x * 1.15
      this.velocidade.y = 30
    }
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

const nave = new Nave()
const projetil = []
const fileirasInvaders = []
const projetilInvader = []


const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false
  }
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
  over: false,
  active: true
}
let score = 0


function createScoreLabel({ score = 100, object }) {
  const scoreLabel = document.createElement('label')
  scoreLabel.innerHTML = score
  scoreLabel.style.posicao = 'absolute'
  scoreLabel.style.color = 'white'
  scoreLabel.style.top = object.posicao.y + 'px'
  scoreLabel.style.left = object.posicao.x + 'px'
  scoreLabel.style.userSelect = 'none'
  document.querySelector('#parentDiv').appendChild(scoreLabel)

  gsap.to(scoreLabel, {
    opacity: 0,
    y: -30,
    duration: 0.75,
    onComplete: () => {
      document.querySelector('#parentDiv').removeChild(scoreLabel)
    }
  })
}

function colisaoRetangulo({ retangulo1, retangulo2 }) {
  return (
    retangulo1.posicao.y + retangulo1.height >= retangulo2.posicao.y &&
    retangulo1.posicao.x + retangulo1.width >= retangulo2.posicao.x &&
    retangulo1.posicao.x <= retangulo2.posicao.x + retangulo2.width
  )
}

function fimDeJogo() {
  console.log('you lose')

  setTimeout(() => {
    nave.opacity = 0
    game.over = true
  }, 0)

  setTimeout(() => {
    game.active = false
  }, 2000)

  createParticles({
    object: nave,
    color: 'white',
    fades: true
  })
}

let spawnBuffer = 500
function animate() {
  if (!game.active) return
  requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)

  nave.update()

  projetilInvader.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.posicao.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        projetilInvader.splice(index, 1)
      }, 0)
    } else invaderProjectile.update()

    // projectile hits nave
    if (
      colisaoRetangulo({
        retangulo1: invaderProjectile,
        retangulo2: nave
      })
    ) {
      projetilInvader.splice(index, 1)
      fimDeJogo()
    }
  })

  fileirasInvaders.forEach((grid, gridIndex) => {
    grid.update()

    // spawn projetil
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].tiro(
        projetilInvader
      )
    }

    for (let i = grid.invaders.length - 1; i >= 0; i--) {
      const invader = grid.invaders[i]
      invader.update({ velocidade: grid.velocidade })


      // projetil hit enemy
      projetil.forEach((projectile, j) => {
        if (
          projectile.posicao.y - projectile.radius <=
            invader.posicao.y + invader.height &&
          projectile.posicao.x + projectile.radius >= invader.posicao.x &&
          projectile.posicao.x - projectile.radius <=
            invader.posicao.x + invader.width &&
          projectile.posicao.y + projectile.radius >= invader.posicao.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            )
            const projectileFound = projetil.find(
              (projectile2) => projectile2 === projectile
            )

            // remove invader and projectile
            if (invaderFound && projectileFound) {
              score += 100
              console.log(score)
              scoreEl.innerHTML = score

              // dynamic score labels
              createScoreLabel({
                object: invader
              })

              createParticles({
                object: invader,
                fades: true
              })

              grid.invaders.splice(i, 1)
              projetil.splice(j, 1)

              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0]
                const lastInvader = grid.invaders[grid.invaders.length - 1]

                grid.width =
                  lastInvader.posicao.x -
                  firstInvader.posicao.x +
                  lastInvader.width
                grid.posicao.x = firstInvader.posicao.x
              } else {
                fileirasInvaders.splice(gridIndex, 1)
              }
            }
          }, 0)
        }
      })

      // remove nave if invaders touch it
      if (
        colisaoRetangulo({
          retangulo1: invader,
          retangulo2: nave
        }) &&
        !game.over
      )
        fimDeJogo()
    } // end looping over grid.invaders
  })

  if (keys.a.pressed && nave.posicao.x >= 0) {
    nave.velocidade.x = -7
    nave.rotation = -0.15
  } else if (
    keys.d.pressed &&
    nave.posicao.x + nave.width <= canvas.width
  ) {
    nave.velocidade.x = 7
    nave.rotation = 0.15
  } else {
    nave.velocidade.x = 0
    nave.rotation = 0
  }

  // spawning enemies
  if (frames % randomInterval === 0) {
    console.log(spawnBuffer)
    console.log(randomInterval)
    spawnBuffer = spawnBuffer < 0 ? 100 : spawnBuffer
    fileirasInvaders.push(new FileirasInvaders())
    randomInterval = Math.floor(Math.random() * 500 + spawnBuffer)
    frames = 0
    spawnBuffer -= 100
  }

  if (keys.space.pressed && nave.powerUp === 'MachineGun' && frames % 2 === 0)
    projetil.push(
      new Projetil({
        posicao: {
          x: nave.posicao.x + nave.width / 2,
          y: nave.posicao.y
        },
        velocidade: {
          x: 0,
          y: -10
        },
        color: 'yellow'
      })
    )

  frames++
}

animate()

addEventListener('keydown', ({ key }) => {
  if (game.over) return

  switch (key) {
    case 'a':
      keys.a.pressed = true
      break
    case 'd':
      keys.d.pressed = true
      break
    case ' ':
      keys.space.pressed = true

      if (nave.powerUp === 'MachineGun') return

      projetil.push(
        new Projetil({
          posicao: {
            x: nave.posicao.x + nave.width / 2,
            y: nave.posicao.y
          },
          velocidade: {
            x: 0,
            y: -10
          }
        })
      )

      break
  }
})

addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'a':
      keys.a.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case ' ':
      keys.space.pressed = false

      break
  }
})