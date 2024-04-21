var GameArea = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNumber = 0;
        this.interval = setInterval(this.updateGameArea, 10);
        Hrac = new Player (50, 50, "images/player.gif");
        Enemak = new Enemy ("images/enemy.png")
        window.addEventListener('keydown', function (e) {
            GameArea.keys = (GameArea.keys || []);
            GameArea.keys[e.key] = true;
          })
          window.addEventListener('keyup', function (e) {
            GameArea.keys[e.key] = false;
          })
      },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        clearInterval(this.interval);
    },
    updateGameArea: function(){
        GameArea.clear();
        Hrac.speedX = 0;
        Hrac.speedY = 0;
        if (GameArea.keys && GameArea.keys['ArrowLeft'] && Hrac.x>10) {Hrac.speedX = -15; }
        if (GameArea.keys && GameArea.keys['ArrowRight'] && Hrac.x<(window.innerWidth - 70)) {Hrac.speedX = 15; }
        if (GameArea.keys && GameArea.keys['ArrowUp'] && Hrac.y>10) {Hrac.speedY = -15; }
        if (GameArea.keys && GameArea.keys['ArrowDown'] && Hrac.y<(window.innerHeight-70)) {Hrac.speedY = 15; }
        Hrac.changePos();
        Hrac.update();
        Enemak.update();
    }
}
class Player{
    constructor(x, y, imgsrc){
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.image = new Image;
        this.image.src = imgsrc;
    }
    update(){
        GameArea.context.drawImage(this.image, this.x, this.y);
    }
    changePos(){
        this.x += this.speedX;
        this.y += this.speedY; 
    }
}
class Enemy{
    constructor(imgsrc){
        this.x = 200;
        this.y = 200;
        this.speedX = 0;
        this.speedY = 0;
        this.image = new Image;
        this.image.src = imgsrc;
    }
    update(){
        GameArea.context.drawImage(this.image, this.x, this.y);
    }
    changePos(){
        this.x -= this.speedX;
        this.y -= this.speedY; 
    }
}