class Invader{
    constructor({posicao}){
        this.velocidade = {
            x: 0,
            y: 0
        }

        const invaderSprite = new Image();
        invaderSprite.src = './Imagens/alien.png';
        invaderSprite.onload = () => {
            this.invaderSprite = invaderSprite;
            this.largura = invaderSprite.width;
            this.altura = invaderSprite.height;
            this.posicao = {
                x: posicao.x,
                y: posicao.y
            }
        }
    }

    mostrar() {
        c.drawImage(
            this.invaderSprite, 
            this.posicao.x, 
            this.posicao.y,
            this.largura,
            this.altura
        );
    }
    
    update({velocidade}) {
        if(this.invaderSprite){
            this.mostrar();
            this.posicao.x = this.posicao.x + velocidade.x;
            this.posicao.y = this.posicao.y + velocidade.y;
        }
    }
}

class FileiraInvaders {
    constructor() {
        this.posicao = {
            x: 0,
            y: 0
        }

        this.velocidade = {
            x: 2,
            y: 0
        }

        this.invaders = [];

        this.tamanho = 5 * 60;

        for(let x = 0; x < 10; x++){ // Numero de invaders no X
            for(let y = 0; y < 5; y++){ // Numero de invaders no Y
                this.invaders.push(new Invader({posicao: {
                    x: x * 30,
                    y: y * 30
                }}));
            }
        }
    }

    update() {
        this.posicao.x = this.posicao.x + this.velocidade.x;
        this.posicao.y = this.posicao.y + this.velocidade.y;

        if(this.posicao.x + this.tamanho >= canvas.width || this.posicao.x <= 0){
            this.velocidade.x = -this.velocidade.x;
            this.velocidade.y=15;
        }else{
            this.velocidade.y=0;
        }
    }
}