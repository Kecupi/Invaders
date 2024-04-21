var GameArea = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNumber = 0;
        this.interval = setInterval(this.updateGameArea, 10);
        Hrac = new Player (50, 40, "green", 100, 120);
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
        if (GameArea.keys && GameArea.keys['ArrowLeft'] && Hrac.x>0) {Hrac.speedX = -10; }
        if (GameArea.keys && GameArea.keys['ArrowRight'] && Hrac.x < GameArea.canvas.width - Hrac.width) {Hrac.speedX = 10; }
        if (GameArea.keys && GameArea.keys['ArrowUp'] && Hrac.y>0) {Hrac.speedY = -10; }
        if (GameArea.keys && GameArea.keys['ArrowDown'] && Hrac.y < GameArea.canvas.height - Hrac.height) {Hrac.speedY = 10; }
        Hrac.changePos();
        Hrac.update();
    }
}
class Player{
    constructor(width, height, color, x, y){
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
    }
    update(){
            GameArea.context.fillStyle = this.color;
            GameArea.context.fillRect(this.x, this.y, this.width, this.height);
    }
    changePos(){
        this.x += this.speedX;
        this.y += this.speedY; 
    }
}
var Hrac;