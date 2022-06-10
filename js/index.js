document.getElementById("NomesRank").style.display = "none"

const scoreEl = document.querySelector('#scoreEl')
const vidaEl = document.querySelector('#vidaEl')
const canvas = document.querySelector('canvas')

const resultado=document.querySelector("#resultado")

const primeiroNome = document.querySelector('#primeiroNome')
const segundoNome = document.querySelector('#segundoNome')
const terceiroNome = document.querySelector('#terceiroNome')
const quartoNome = document.querySelector('#quartoNome')
const quintoNome = document.querySelector('#quintoNome')
const sextoNome = document.querySelector('#sextoNome')
const setimoNome = document.querySelector('#setimoNome')
const oitavoNome = document.querySelector('#oitavoNome')
const nonoNome = document.querySelector('#nonoNome')
const decimoNome = document.querySelector('#decimoNome')

const primeiroPont = document.querySelector('#primeiroPont')
const segundoPont = document.querySelector('#segundoPont')
const terceiroPont = document.querySelector('#terceiroPont')
const quartoPont = document.querySelector('#quartoPont')
const quintoPont = document.querySelector('#quintoPont')
const sextoPont = document.querySelector('#sextoPont')
const setimoPont = document.querySelector('#setimoPont')
const oitavoPont = document.querySelector('#oitavoPont')
const nonoPont = document.querySelector('#nonoPont')
const decimoPont = document.querySelector('#decimoPont')

const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0
    }

    this.opacity = 1

    const image = new Image()
    image.src = './img/spaceship.png'
    image.onload = () => {
      this.image = image
      this.width = image.width
      this.height = image.height
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20
      }
    }
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    c.save()
    c.globalAlpha = this.opacity
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    )
    c.rotate(this.rotation)

    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    )

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
    c.restore()
  }

  update() {
    if (this.image) {
      this.draw()
      this.position.x += this.velocity.x
    }
  }
}

class Projectile {
  constructor({
    position,
    velocity,
    color = 'white'
  }) {
    this.position = position
    this.velocity = velocity

    this.radius = 4
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Particle {
  constructor({
    position,
    velocity,
    radius,
    color,
    fades
  }) {
    this.position = position
    this.velocity = velocity

    this.radius = radius
    this.color = color
    this.opacity = 1
    this.fades = fades
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.fades) this.opacity -= 0.01
  }
}

class InvaderProjectile {
  constructor({
    position,
    velocity
  }) {
    this.position = position
    this.velocity = velocity

    this.width = 3
    this.height = 10
  }

  draw() {
    c.fillStyle = 'white'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Invader {
  constructor({
    position
  }, img) {
    this.velocity = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = img
    image.onload = () => {
      const scale = 1
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update({
    velocity
  }) {
    if (this.image) {
      this.draw()
      this.position.x += velocity.x
      this.position.y += velocity.y
    }
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height
        },
        velocity: {
          x: 0,
          y: 5
        }
      })
    )
  }
}

class Barrier {
  constructor({
    position
  }, img) {

    this.qntdDeAcertos = 0;

    const image = new Image();
    image.src = img;
    image.onload = () => {
      const scale = 1.2
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update() {
    if (this.image) {
      this.draw()
    }
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }

    this.velocity = {
      x: 1,
      y: 0
    }

    this.invaders = []

    const columns = 15;
    const rows = 6;

    this.width = columns * 30

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        if(y == 0){
          this.invaders.push(
            new Invader({
              position: {
                x: x * 30,
                y: y * 30
              }
            }, './img/invader3.png')
          )
        } else if(y == 1) {
          this.invaders.push(
            new Invader({
              position: {
                x: x * 30,
                y: y * 30
              }
            }, './img/invader.png')
          )
        } else if(y == 2) {
          this.invaders.push(
            new Invader({
              position: {
                x: x * 30,
                y: y * 30
              }
            }, './img/invader2.png')
          )
        } else if(y == 3) {
          this.invaders.push(
            new Invader({
              position: {
                x: x * 30,
                y: y * 30
              }
            }, './img/invader.png')
          )
        } else if(y == 4) {
          this.invaders.push(
            new Invader({
              position: {
                x: x * 30,
                y: y * 30
              }
            }, './img/invader2.png')
          )
        } 
      }
    }
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.velocity.y = 0

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 30
    }
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
const barriers = [
  new Barrier({position: { x: 80, y:400 }},'./img/barreira1.png'),
  new Barrier({position: { x: 330, y:400 }},'./img/barreira1.png'),
  new Barrier({position: { x: 580, y:400 }},'./img/barreira1.png'),
  new Barrier({position: { x: 820, y:400 }},'./img/barreira1.png')
];

var qntdDeMortes = 0;
var qntdDeVida = 3;
var naveTocada = false;
var hiscores = [];
var invaders = 0;

var tiroInvader = new Audio()
tiroInvader.src = './Sons/laser1.wav'
var tiroCanhao = new Audio()
tiroCanhao.src = './Sons/shoot.wav'

var canhaoExplode = new Audio()
canhaoExplode.src = './Sons/explosion.wav'
var barreiraExplode = new Audio()
barreiraExplode.src = './Sons/barrierExplode.wav'

var invader1Morto = new Audio()
invader1Morto.src = './Sons/invaderkilled1.wav'
var invader2Morto = new Audio()
invader2Morto.src = './Sons/invaderkilled2.wav'
var invader3Morto = new Audio()
invader3Morto.src = './Sons/invaderkilled3.wav'
var invader4Morto = new Audio()
invader4Morto.src = './Sons/invaderkilled4.wav'

var fimDeJogo = new Audio()
fimDeJogo.src = './Sons/game-over.wav'

var tema = new Audio()
tema.src = './Sons/music.mp3'

var nomePlayer=prompt("Informe o seu nome!")

const keys = {
  esquerda: {
    pressed: false
  },
  direita: {
    pressed: false
  },
  cima: {
    pressed: false
  }
}

let frames = 0

let game = {
  over: false,
  active: true
}
let score = 0

for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
      },
      velocity: {
        x: 0,
        y: 0.3
      },
      radius: Math.random() * 2,
      color: 'white'
    })
  )
}

function createParticles({
  object,
  color,
  fades
}) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        },
        radius: Math.random() * 3,
        color: color || 'red',
        fades
      })
    )
  }
}

function createScoreLabel(score,{
  object
}) {
  const scoreLabel = document.createElement('label')
  scoreLabel.innerHTML = score
  scoreLabel.style.position = 'absolute'
  scoreLabel.style.color = '#00fc01'
  scoreLabel.style.fontSize = '20px';
  scoreLabel.style.top = object.position.y + 'px'
  scoreLabel.style.left = object.position.x + 'px'
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

function rectangularCollision({
  rectangle1,
  rectangle2
}) {
  return (
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width
  )
}

function endGame() {
  document.getElementById("NomesRank").style.display = "block"

  hiscores.push(score);
  console.log(hiscores);

  fimDeJogo.play()
  tema.pause()

  criarRank(nomePlayer, score)

  if(qntdDeMortes >= 3 || naveTocada == true){
    resultado.innerHTML="QUE PAIA. TU PERDEU, OH."

    setTimeout(() => {
      player.opacity = 0
      game.over = true
    }, 0)
  
    setTimeout(() => {
      game.active = false
    }, 2000)
  
    createParticles({
      object: player,
      color: 'white',
      fades: true
    })
  } else {
    resultado.innerHTML = "MASSA! TU GANHOU, OH!"

    setTimeout(() => {
      player.opacity = 0
      game.over = true
    }, 0)
  
    setTimeout(() => {
      game.active = false
    }, 1000)
  
    createParticles({
      object: player,
      color: 'white',
      fades: true
    })
  }
}


function animate() {
  if (!game.active) return
  // if (invaders == 1) {
  //   endGame();
  //   return;
  // }
  requestAnimationFrame(animate)

  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  barriers.forEach((barrier) => {
    barrier.update();
  });
  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width
      particle.position.y = -particle.radius
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1)
      }, 0)
    } else {
      particle.update()
    }
  })

  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1)
      }, 0)
    } else invaderProjectile.update()

    // projectile hits barrier
    for(let barrierIndex = 0; barrierIndex < barriers.length; barrierIndex++){
      if (
        rectangularCollision({
          rectangle1: invaderProjectile,
          rectangle2: barriers[barrierIndex]
        })
      ) {
        setTimeout(() => {
          invaderProjectiles.splice(index, 1);

          let barrier = barriers[barrierIndex];
          barrier.qntdDeAcertos++;

          if(barrier.qntdDeAcertos == 1){
            barrier.image.src = "http://127.0.0.1:5500/img/barreira2.png";
            barrier.image.currentSrc = "http://127.0.0.1:5500/img/barreira2.png";
          } else if(barrier.qntdDeAcertos == 2){
            barrier.image.src = "http://127.0.0.1:5500/img/barreira3.png";
            barrier.image.currentSrc = "http://127.0.0.1:5500/img/barreira3.png";
          } else if(barrier.qntdDeAcertos == 3){
            barriers.splice(barrierIndex,1);
          }

          barreiraExplode.play()

        }, 0)
      }
    }

    // projectile hits player
    if (
      rectangularCollision({
        rectangle1: invaderProjectile,
        rectangle2: player
      })
    ) {
      qntdDeMortes++
      qntdDeVida--
      vidaEl.innerHTML = "< Vidas: " + qntdDeVida +" >";
      invaderProjectiles.splice(index, 1)
      if(qntdDeMortes >= 3){
        canhaoExplode.play()
        endGame()
      }
    }
  })

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i]

    if (projectile.position.y + projectile.radius <= 0) {
      projectiles.splice(i, 1)
    } else {
      projectile.update()
    }

  }

  grids.forEach((grid, gridIndex) => {
    grid.update()

    invaders = grid.invaders.length;

    // spawn projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      )
      tiroInvader.play()
      tiroInvader.volume = 0.2
    }

    for (let i = grid.invaders.length - 1; i >= 0; i--) {
      const invader = grid.invaders[i]
      invader.update({
        velocity: grid.velocity
      })

      // projectiles hit enemy
      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.radius <=
          invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
          invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            )

            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            )

            // remove invader and projectile
            let valorDeScore

            if (invaderFound && projectileFound) {
              if(invaderFound.image.currentSrc == "http://127.0.0.1:5500/img/invader.png"){
                  score += 10;
                  valorDeScore = 10;
                  invader1Morto.play()
                  invader1Morto.volume = 0.2
              } else if(invaderFound.image.currentSrc == "http://127.0.0.1:5500/img/invader2.png"){
                  score += 20;
                  valorDeScore = 20;
                  invader2Morto.play()
                  invader2Morto.volume = 0.2
              } else if(invaderFound.image.currentSrc == "http://127.0.0.1:5500/img/invader3.png"){
                  score += 40;
                  valorDeScore = 40;
                  invader3Morto.play()
                  invader3Morto.volume = 0.2
              }

              // dynamic score labels
              createScoreLabel(valorDeScore,{
                object: invader
              })

              createParticles({
                object: invader,
                fades: true
              })

              grid.velocity.x += grid.velocity.x * (grid.invaders.length / 1700);

              grid.invaders.splice(i, 1)
              projectiles.splice(j, 1)

              scoreEl.innerHTML = "< Score: " + score + " >";

              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0]
                const lastInvader = grid.invaders[grid.invaders.length - 1]

                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width
                grid.position.x = firstInvader.position.x
              } else {
                grids.splice(gridIndex, 1)
              }
            }

            if(score == 1500){
              endGame();
            }

            tema.playbackRate += 0.001;

          }, 0)
        }
      })
      
      // remove player if invaders touch it
      if (
        rectangularCollision({
          rectangle1: invader,
          rectangle2: player
        }) &&
        !game.over
      ) {
        naveTocada = true;
        canhaoExplode.play()
        endGame()
      }
    } // end looping over grid.invaders
  })

  if (keys.esquerda.pressed && player.position.x >= 0) {
    player.velocity.x = -7
  } else if (
    keys.direita.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 7
  } else {
    player.velocity.x = 0
  }

  // spawning enemies
  if (frames == 0) {
    grids.push(new Grid())
  }

  frames++
}

function criarRank (nomePlayer, score){
  var jogadores=["Paulo", "Gilson", "Elon Musk", "Jeff Bezos", "Roger", "Bill Gates", "Darth Vader", "Spock", "Bilu", "Marvin"]
  var pontuacao=[1400, 1300, 1250, 1200, 1100, 1050, 1000, 900, 800, 750]

  jogadores.push(nomePlayer)
  pontuacao.push(score)

  for(let i=0; i<pontuacao.length;i++){
    for(let j=0;j<pontuacao.length-1;j++){
      if(pontuacao[j]<pontuacao[j+1]){
        var auxPont=pontuacao[j]
        pontuacao[j]=pontuacao[j+1]
        pontuacao[j+1]=auxPont

        var auxJog=jogadores[j]
        jogadores[j]=jogadores[j+1]
        jogadores[j+1]=auxJog
      }
    }
  }
  primeiroNome.innerHTML = jogadores[0]
  segundoNome.innerHTML = jogadores[1]
  terceiroNome.innerHTML = jogadores[2]
  quartoNome.innerHTML = jogadores[3]
  quintoNome.innerHTML = jogadores[4]
  sextoNome.innerHTML = jogadores[5]
  setimoNome.innerHTML = jogadores[6]
  oitavoNome.innerHTML = jogadores[7]
  nonoNome.innerHTML = jogadores[8]
  decimoNome.innerHTML = jogadores[9]

  primeiroPont.innerHTML = pontuacao[0]
  segundoPont.innerHTML = pontuacao[1]
  terceiroPont.innerHTML = pontuacao[2]
  quartoPont.innerHTML = pontuacao[3]
  quintoPont.innerHTML = pontuacao[4]
  sextoPont.innerHTML = pontuacao[5]
  setimoPont.innerHTML = pontuacao[6]
  oitavoPont.innerHTML = pontuacao[7]
  nonoPont.innerHTML = pontuacao[8]
  decimoPont.innerHTML = pontuacao[9]

  console.log(jogadores)
  console.log(pontuacao)
  document.getElementById("scoreEl").style.display="none"
  document.getElementById("vidaEl").style.display="none"
}

animate()

addEventListener('keydown', ({
  key
}) => {
  if (game.over) return
  switch (key) {
    case 'ArrowLeft':
      keys.esquerda.pressed = true
      break
    case 'ArrowRight':
      keys.direita.pressed = true
      break
    case 'ArrowUp':
      keys.cima.pressed = true

      tiroCanhao.play()
      tiroCanhao.volume = 0.2

      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y
          },
          velocity: {
            x: 0,
            y: -10
          }
        })
      )

      break
    case 'Escape':
      document.location.reload();
    break
  }
  
})

addEventListener('keyup', ({
  key
}) => {
  switch (key) {
    case 'ArrowLeft':
      keys.esquerda.pressed = false
      break
    case 'ArrowRight':
      keys.direita.pressed = false
      break
    case 'ArrowUp':
      keys.cima.pressed = false
      break
    case "s":
      tema.play()
    break;    
  }
})