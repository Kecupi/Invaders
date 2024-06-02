var GameArea = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNumber = 0;
        this.bossfight = false;
        this.interval = setInterval(this.updateGameArea, 10);
        Hrac = new Player (50, 50, "images/player.gif");
        this.score = 0;
        this.context.font = "50px Arial";
        this.context.fillStyle = "white";
        Bos = 0;
        Enemies = [];
        Bullets = [];
        window.addEventListener('keydown', function (e) {
            GameArea.keys = (GameArea.keys || []);
            GameArea.keys[e.key] = true;
          })
        window.addEventListener('keyup', function (e) {
            GameArea.keys[e.key] = false;
          })
        window.addEventListener('resize',function(e){
            this.canvas.style.height = window.innerHeight;
            this.canvas.style.width = window.innerWidth;
        })
    },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function(){
        clearInterval(this.interval);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillText(`Final score: ${this.score}`,(window.innerWidth-this.context.measureText("Final score: " + this.score).width)/2,window.innerHeight/2);
        
    },
    updateScore: function(){
        this.context.fillText(`Score: ${this.score}`,10,50);
    },
    updateGameArea: function(){
        GameArea.clear();
        GameArea.frameNumber +=1;
        if (GameArea.bossfight === false){
            if (GameArea.frameNumber % 30 ===0){
                Enemies.push(new Enemy("images/enemy.png"))
            }
            for (let i=0;i<Enemies.length;i++){
                Enemies[i].update();
            }
            GameArea.updateScore();
            for (let i=0;i<Bullets.length;i++){
                Bullets[i].update();
                Bullets[i].crash();
            }
        }
        if (GameArea.score%5 == 0 && GameArea.score !=0 && GameArea.bossfight == false){
            GameArea.bossfight=true;
            GameArea.clear;
            Bos = new Boss("images/enemy.png");
            Enemies = [];
        }
        if (GameArea.bossfight == true){
            Bos.update();
            for (let i=0;i<Bullets.length;i++){
                Bullets[i].update();
                Bullets[i].crashBoss();
            }
        }
        if (Hrac.explode == true){
            GameArea.stop();
        } else {Hrac.changePos()}
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
        this.bulletRate = 0;
        this.explode = false;
    }
    update(){
        GameArea.context.drawImage(this.image, this.x, this.y);
    }
    changePos(){
        this.bulletRate += 1;
        Hrac.speedX = 0;
        Hrac.speedY = 0;
        if (GameArea.keys && GameArea.keys['ArrowLeft'] && Hrac.x>10) {Hrac.speedX = -15;};
        if (GameArea.keys && GameArea.keys['ArrowRight'] && Hrac.x<(window.innerWidth - 70)) {Hrac.speedX = 15;};
        if (GameArea.keys && GameArea.keys['ArrowUp'] && Hrac.y>10) {Hrac.speedY = -15;};
        if (GameArea.keys && GameArea.keys['ArrowDown'] && Hrac.y<(window.innerHeight-70)) {Hrac.speedY = 15;};
        if (this.bulletRate>=20){
            if (GameArea.keys && GameArea.keys[" "]) {
            Bullets.push(new Bullet(this.x + this.image.width,this.y,"images/bullet.png"),new Bullet(this.x + this.image.width,this.y+this.image.height,"images/bullet.png"));
            this.bulletRate = 0;
            }
        }
        this.x += this.speedX;
        this.y += this.speedY;
        if (GameArea.bossfight ==false){
          this.crash();  
        }else{
          this.crashBoss();  
        }
        this.update();
    }
    crash(){
        for (let i=0;i<Enemies.length;i++){
            if ((Enemies[i].x + Enemies[i].image.width >= this.x && Enemies[i].x <= this.x + this.image.width) && ((Enemies[i].y + Enemies[i].image.height >= this.y && Enemies[i].y <= this.y + this.image.height) ||(this.y + this.image.height >= Enemies[i].y && this.y <= Enemies[i].y + Enemies[i].image.height)))
                {this.explode = true;}
        }
    }
    crashBoss(){
        if(this.x <= (Bos.x+Bos.image.width) && this.x >= Bos.x && this.y>=Bos.y && this.y<=(Bos.image.height + Bos.y)){
            this.explode = true;
        }
    }
}
class Enemy{
    constructor(imgsrc){
        this.x = Math.floor(Math.random()*(window.innerWidth*0.9-0.8*window.innerWidth)+window.innerWidth*0.8)
        this.y = Math.floor(Math.random()*window.innerHeight);
        if (this.y>=(window.innerHeight/2)){
            this.speedY = Math.floor(Math.random()*(3));
        } else {
            this.speedY = Math.floor(Math.random()*(-3));
        };
        this.speedX = Math.floor(Math.random()*(5)+10);
        this.image = new Image;
        this.image.src = imgsrc;
    }
    update(){
        this.x -= this.speedX;
        this.y -= this.speedY; 
        GameArea.context.drawImage(this.image, this.x, this.y);
    }
}
class Boss{
    constructor(imgsrc){
        this.image = new Image;
        this.image.src = imgsrc;
        this.x = 500;
        this.y = 400;
        this.hp = 2;
    }
    update(){
        GameArea.context.drawImage(this.image, this.x, this.y);
        if(this.hp==0){
            GameArea.bossfight=false;
            GameArea.score +=1;
        }
    }
}
class Bullet{
    constructor(x,y, imgsrc){
        this.x = x;
        this.y = y;
        this.speedX = 10;
        this.image = new Image;
        this.image.src = imgsrc; 
    }
    update(){
        this.x += this.speedX;
        GameArea.context.drawImage(this.image, this.x, this.y);
    }
    crash(){
        for (let j=0;j<Enemies.length;j++){
            if (this.x <= (Enemies[j].x+Enemies[j].image.width) && this.x >= Enemies[j].x && this.y>=Enemies[j].y && this.y<=(Enemies[j].image.height + Enemies[j].y)){
                Bullets.splice(Bullets.indexOf(this),1);
                Enemies.splice(j,1);
                j = j-1;
                GameArea.score +=1;
            }
        }
    }
    crashBoss(){
        if(this.x <= (Bos.x+Bos.image.width) && this.x >= Bos.x && this.y>=Bos.y && this.y<=(Bos.image.height + Bos.y)){
            Bullets.splice(Bullets.indexOf(this),1);
            Bos.hp= Bos.hp-1;
        }
    }
}