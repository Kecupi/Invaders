startScreen = (text) =>{
    let start = document.createElement("button");
    start.textContent = text;
    start.style.color = "white";
    start.style.font = ((window.innerWidth+window.innerHeight)/60)+"px Arial";
    start.style.border = "none";
    start.style.textDecoration = "none";
    start.style.background = "none";
    start.style.position = "absolute";
    start.style.top = "50%";
    start.style.left = "50%";
    start.style.transform = "translate(-50%,-50%)"
    document.body.insertBefore(start, document.body.childNodes[0]);
    
    start.addEventListener("click", () => {
        GameArea.start();
        document.getElementById("theme").play();
        document.getElementById("theme").loop = true;
        document.body.removeChild(start);
        document.getElementById("bodyElement").style.cursor = "none";
    });
    window.addEventListener("resize", () => {
        x = start.textContent;
        document.body.removeChild(start);
        startScreen(x);
    })
};
var GameArea = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        this.context.font = ((window.innerWidth+window.innerHeight)/60)+"px Arial";
        this.context.fillStyle = "white";
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNumber = 0;
        this.bossfight = false;
        this.interval = setInterval(this.updateGameArea, 10);
        this.score = 0;
        Hrac = new Player (50, 50, "images/player.gif");
        Bos = 0;
        Enemies = [];
        Bullets = [];
        bossBullets = [];
        window.addEventListener('keydown', (e) =>{
            GameArea.keys = (GameArea.keys || []);
            GameArea.keys[e.key] = true;
          })
        window.addEventListener('keyup', (e) =>{
            GameArea.keys[e.key] = false;
          })
        window.addEventListener('resize', () =>{
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.context.font = ((window.innerWidth+window.innerHeight)/60)+"px Arial";
            this.context.fillStyle = "white";
            Bos.x = window.innerWidth*0.9;
            this.clear();
            if (this.interval !=null){
                this.updateScore()
            } else {
                this.context.fillText(`Final Score: ${this.score}`,(window.innerWidth-this.context.measureText("Final score: " + this.score).width)/2,0.9*window.innerHeight/2);
            }
        },)
        
    },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function(){
        clearInterval(this.interval);
        this.interval = null;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillText(`Final Score: ${this.score}`,(window.innerWidth-this.context.measureText("Final score: " + this.score).width)/2,0.9*window.innerHeight/2);
        document.getElementById("bodyElement").style.cursor = "default";
        document.getElementById("theme").pause();
        document.getElementById("theme").currentTime = 0;
        startScreen("Restart");
        
        
    },
    updateScore: function(){
        this.context.fillText(`Score: ${this.score}`,10,50);
    },
    updateGameArea: function(){
        GameArea.clear();
        GameArea.frameNumber +=1;
        if (GameArea.bossfight === false){
            if (GameArea.frameNumber % 20 ===0){
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
            GameArea.clear();
            Bos = new Boss("images/boss.png");
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
            Bullets.push(new Bullet(this.x + this.image.width,this.y,10,"images/bullet.png"),new Bullet(this.x + this.image.width,this.y+this.image.height,10,"images/bullet.png"));
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
        this.x = window.innerWidth*0.9;
        this.y = window.innerHeight/2;
        this.hp = 2;
        this.up = false;
        this.bulletRate = 0;
    }
    update(){
        this.bulletRate += 1;
        if (this.bulletRate>=20){
            bossBullets.push(new Bullet(this.x + this.image.width,this.y,-10,"images/bullet.png"));
            this.bulletRate = 0;
        }
        for (let i=0;i<bossBullets.length;i++){
            bossBullets[i].update();
            bossBullets[i].crashPlayer();
        }
        if (this.up == false){
            this.y+=5;
            if ((this.y+50)>= window.innerHeight){
                this.up = true;
            }
        } else {
            this.y-=5;
            if ((this.y)<= 0){
                this.up = false;
            }
        }
        GameArea.context.drawImage(this.image, this.x, this.y);
        if(this.hp==0){
            GameArea.bossfight=false;
            bossBullets = [];
            GameArea.score +=1;
            document.getElementById("death_sound").play();
        }
    }
}
class Bullet{
    constructor(x,y, speedX, imgsrc){
        this.x = x;
        this.y = y;
        this.speedX = speedX;
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
                document.getElementById("death_sound").play();
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
    crashPlayer(){
        if(this.x <= (Hrac.x+Hrac.image.width) && this.x >= Hrac.x && this.y>=Hrac.y && this.y<=(Hrac.image.height + Hrac.y)){
            Bullets.splice(Bullets.indexOf(this),1);
            Hrac.explode = true;
        }
    }
}