class Nave{
    constructor(){
        this.velocidade = {
            x: 0,
            y: 0
        }

        const naveSprite = new Image();
        naveSprite.src = './Imagens/canhao.png';
        naveSprite.onload = () => {
            this.naveSprite = naveSprite;
            this.largura = naveSprite.width;
            this.altura = naveSprite.height;
            this.posicao = {
                x: canvas.width / 2 - this.largura / 2,
                y: canvas.height - this.altura - 20
            }
        }
    }

    mostrar() {
        c.drawImage(
            this.naveSprite, 
            this.posicao.x, 
            this.posicao.y,
            this.largura,
            this.altura
        );
    }
    
    update() {
        if(this.naveSprite){
            this.mostrar();
            this.posicao.x = this.posicao.x + this.velocidade.x;
        }
    }
}

class Projetil{
    constructor({posicao, velocidade}){
        this.posicao = posicao;
        this.velocidade = velocidade;
        this.tamanho = 3;
    }

    mostrar() {
        c.beginPath();
        c.arc(this.posicao.x, this.posicao.y, this.tamanho, 0, Math.PI * 2);
        c.fillStyle = "red";
        c.fill();
        c.closePath();
    }

    update() {
        this.mostrar();
        this.posicao.x = this.posicao.x + this.velocidade.x;
        this.posicao.y = this.posicao.y + this.velocidade.y;
    }
}