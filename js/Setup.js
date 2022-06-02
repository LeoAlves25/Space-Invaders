const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = 824;
canvas.height = 641;

//Criar objeto Nave
const nave = new Nave();
const fileirasInvaders = [new FileiraInvaders()];
const projeteis = [];

const teclas = {
    arrowLeft: {
        pressionado: false
    },
    arrowRight: {
        pressionado: false
    },
    arrowUp: {
        pressionado: false
    }
}

function animar(){
    //Cria o frame rate do jogo com auto calling.
    requestAnimationFrame(animar);
    c.fillStyle = "black";
    c.fillRect(0,0, window.innerWidth, window.innerHeight);
    nave.update();
    fileirasInvaders.forEach((fileiraInvader) => {
        fileiraInvader.update();
        fileiraInvader.invaders.forEach((invader) => {
            invader.update({
                velocidade: fileiraInvader.velocidade
            });
        })
    });
    projeteis.forEach((projetil, index) => {
        if(projetil.posicao.x + projetil.tamanho <= 0){
            projeteis.splice(index, 1);
        } else {
            projetil.update();
        }
    });

    if(teclas.arrowLeft.pressionado && nave.posicao.x >= 0){
        nave.velocidade.x = -4;
    } else if(teclas.arrowRight.pressionado && nave.posicao.x <= 795){
        nave.velocidade.x = 4;
    } else {
        nave.velocidade.x = 0;
    }

}

animar();

addEventListener("keydown", ({key}) => {
    switch(key){
        case "ArrowLeft":
            teclas.arrowLeft.pressionado = true;
        break;

        case "ArrowRight":
            teclas.arrowRight.pressionado = true;
        break;

        case "ArrowUp":
            projeteis.push(
                new Projetil({
                    posicao: {
                        x: nave.posicao.x + nave.largura / 2,
                        y: nave.posicao.y
                    },
                    velocidade: {
                        x: 0,
                        y: -10
                    }
                })
            );
        break;
    }
});

addEventListener("keyup", ({key}) => {
    switch(key){
        case "ArrowLeft":
            teclas.arrowLeft.pressionado = false;
        break;

        case "ArrowRight":
            teclas.arrowRight.pressionado = false;
        break;

        case "ArrowUp":

        break;
    }
});