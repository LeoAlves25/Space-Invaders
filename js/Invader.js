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
            x: 5,
            y: 0
        }

        this.invaders = [];
        const linhas = Math.floor(Math.random() * 10 + 5); // Sortea a quantidade de linhas
        const colunas = Math.floor(Math.random() * 10 + 2);// Sortea a quantidade de colunas

        this.tamanho = colunas * 30;

        for(let x = 0; x < linhas; x++){ // Numero de invaders no X
            for(let y = 0; y < colunas; y++){ // Numero de invaders no Y
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
        }
    }
}